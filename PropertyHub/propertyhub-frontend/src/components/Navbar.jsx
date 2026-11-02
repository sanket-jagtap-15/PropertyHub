
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavigationBar({
  isAdmin,
  onAdminClick,
  onLogout
}) {
  return (
    <Navbar expand="lg" className="prime-navbar" sticky="top">
      <Container>
       <Navbar.Brand href="/" className="prime-brand">
             <img
               src="/images/primenest-logo.png"
               alt="PrimeNest Realty"
               className="prime-logo"
             />
       </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#properties">Properties</Nav.Link>
            <Nav.Link href="#about">About Us</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>

            {isAdmin ? (
              <>
                <Nav.Link onClick={onAdminClick}>
                  Admin Dashboard
                </Nav.Link>
                <Nav.Link onClick={onLogout} className="text-danger">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                onClick={onAdminClick}
                style={{ cursor: "pointer" }}
              >
                Admin Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
