import { Navbar, NavbarBrand, Nav } from 'react-bootstrap';
import Link from 'next/link';
export default function header() {
  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Link href="/" passHref>
          <NavbarBrand className="text-light">TKN Exchange</NavbarBrand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav.Item className="text-light">1 TKN = 1 ETH</Nav.Item>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
