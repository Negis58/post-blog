import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export const Header = ({ isAuth, handleShow, handleLogout }) => {


  return (
    <header className="mb-3">
      <Navbar style={{ background: "#CCD7D7" }} expand="lg">
        <Container fluid className="w-75">
          <Navbar.Brand href="/">BLOG</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-md-between">
            <Nav style={{ maxHeight: "100px" }} navbarScroll />
            {isAuth ? (
              <Nav>
                <Nav.Link className="d-flex align-items-center flex-column" variant="primary">
                  <Button variant="primary" onClick={handleShow}>Создать запись</Button>
                </Nav.Link>
                <Nav.Link className="d-flex align-items-center flex-column" variant="primary">
                  <Button type="primary" variant="danger" onClick={handleLogout}>Выйти из аккаунта</Button>
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link href="/login" className="d-flex align-items-center flex-column" variant="primary">
                  <Button type="primary">Войти в аккаунт</Button>
                </Nav.Link>
                <Nav.Link href="/register" className="d-flex align-items-center flex-column" variant="primary">
                  <Button type="primary">Регистрация</Button>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};