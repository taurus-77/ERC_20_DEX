import Head from 'next/head';
import Header from '../components/header';
import Link from 'next/link';
import { Jumbotron, Container, Row, Col, Button } from 'react-bootstrap';


async function connect(event) {
    
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | DEX</title>
        <meta name="description" content="Purchase TKN" />
      </Head>
      <Header></Header>
      <div style={{ marginTop: 20 + 'vh' }}></div>
      <Container>
        <Row>
          <Col className="text-center">
            <img src="/MetaMask_Fox.svg" style={{ maxWidth: 120 + 'px' }}></img>
            <h1>Metamask Not Connected</h1>
            <p>Please connect your metamask wallet to make transactions</p>
            <p>
              <Button onClick={connect} variant="primary">Connect</Button>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
