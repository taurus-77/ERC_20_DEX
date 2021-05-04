import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';
import { Jumbotron, Container, Row, Col, Button, Table } from 'react-bootstrap';

import Header from '../components/header';
import { getEvents } from '../web3';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(() =>
      getEvents().sort((a, b) => {
        return b.time - a.time;
      })
    );
  });
  return (
    <>
      <Head>
        <title>Home | DEX</title>
        <meta name="description" content="Purchase TKN" />
      </Head>
      <Header></Header>
      <Jumbotron fluid>
        <Container>
          <Row>
            <Col className="text-center">
              <h1>ERC20 DEX</h1>
              <p>
                Here you can buy your favorite TKN with an intermediary.
                <br />
                Selling you TKN has been this easy...Just shoot the button.
              </p>
              <p>
                <Link href="/buy" passHref>
                  <Button variant="success">BUY</Button>
                </Link>{' '}
                <Link href="/sell" passHref>
                  <Button variant="danger">SELL</Button>
                </Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Container>
        <h1 className="text-center">History</h1>
        <br />
        <Table responsive>
          <thead>
            <tr>
              <th>Address</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {events.map(event => {
                return (
                  <tr>
                    <td>{event.address}</td>
                    <td>{ event.amount }</td>
                    <td>{event.bought ? 'Bought': 'Sold'}</td>
                  </tr>
                );
              })}
            </Fragment>
          </tbody>
        </Table>
      </Container>
    </>
  );
}
