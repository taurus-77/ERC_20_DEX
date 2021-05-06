// @ts-check
import Head from 'next/head';
import Header from '../components/header';
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Toast, Spinner } from 'react-bootstrap';

import { setupWeb3, getTKNBalance } from '../web3';

export default function Home() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(() => undefined);
  const [DexContract, setDexContract] = useState(() => undefined);
  const [TokenContract, setTokenContract] = useState(() => undefined);
  const [account, setAccount] = useState(() => undefined);
  const [balance, setBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  useEffect(async () => {
    try {
      const W3 = await setupWeb3();
      setAccount(W3.account);
      setBalance(W3.balance);
      setWeb3(W3.web3);
      setDexContract(W3.dexContract);
      setTokenContract(W3.tokenContract);
      setTokenPrice(W3.tokenPrice);
      console.log(W3.tokenPrice);
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function buyTKNs(event) {
    event.preventDefault();
    setLoading(true);
    let quantity = 0;
    try {
      quantity = event.target[0].value;
      quantity = (Number.parseFloat(quantity) * (tokenPrice/ 10**18)).toString();
      quantity = web3.utils.toWei(quantity, 'ether');
      console.log(quantity);
      if (quantity <= 0) {
        setLoading(false);
        throw 'Invalid amount entered';
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return setError('Invalid amount entered');
    }
    try {
      await DexContract.methods.buy().send({
        value: quantity,
        from: account
      });

      setSuccess('Transaction Completed.');
      setLoading(false);
    } catch (error) {
      console.log(error);
      let metamaskError = '';
      if (error.code === -32002) {
        metamaskError =
          'Please open metamask and accept the connection request.';
      } else if (error.code === 4001) {
        metamaskError = 'User canceled the connection request.';
      } else {
        metamaskError = 'Something went wrong.';
      }
      setLoading(false);
      setError(metamaskError);
    }
    const b = await getTKNBalance(account);
    setBalance(web3.utils.fromWei(b));
  }

  return (
    <>
      <Head>
        <title>BUY TKN | DEX</title>
        <meta name="description" content="Purchase TKN" />
      </Head>
      <Header tokenPrice={tokenPrice/10**18}></Header>
      <Toast
        className="bg-danger"
        onClose={() => setError('')}
        show={error !== ''}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: '60px',
          right: '10px'
        }}
      >
        <Toast.Header className="bg-danger text-light">
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body className="bg-danger text-light">{error}</Toast.Body>
      </Toast>

      <Toast
        className="bg-success"
        onClose={() => setSuccess('')}
        show={success !== ''}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: '60px',
          right: '10px'
        }}
      >
        <Toast.Header className="bg-success text-light">
          <strong className="mr-auto">Successful</strong>
        </Toast.Header>
        <Toast.Body className="bg-success text-light">{success}</Toast.Body>
      </Toast>

      <Container>
        <br></br>
        <h1 className="text-center">Buy</h1>
        <p className="text-center">Balance: {balance}</p>
        <Form onSubmit={buyTKNs}>
          <Form.Group controlId="amount">
            <Form.Label>Amount (TKNs)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.000000000000000001"
              placeholder="Enter amount"
            />
            <Form.Text className="text-muted">
              How much do you want to buy?
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            <span
              style={{
                display: loading ? 'none' : 'inline-block'
              }}
            >
              Buy
            </span>
            <Spinner
              animation="border"
              style={{
                display: loading ? 'inline-block' : 'none'
              }}
            />
          </Button>
        </Form>
      </Container>
    </>
  );
}
