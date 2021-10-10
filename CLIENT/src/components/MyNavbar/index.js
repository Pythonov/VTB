import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import tech from "../../assets/img/tech.svg";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
const MyNavbar = ({ loginWithPopup, isAuthenticated, logout, user }) => {
  const router = useHistory()
  return (
    <Navbar bg="black" variant="dark">
      <Container style={{ display: "flex", justifyContent: "space-between" }}>
        <Navbar.Brand href="/">
          <img src={tech} style={{ width: "120px" }}></img>
        </Navbar.Brand>
        {isAuthenticated ? (
          <>
            <div style= {{cursor:'pointer'}} onClick={()=>router.push(`/${user.name}`)}>
              <BsPersonCircle
                style={{
                  color: "white",
                  marginBottom: "12px",
                  marginRight: "10px",
                }}
                size="28px"
              />

              <span style={{ color: "white", fontSize: "28px" }}>
                {user.name}
              </span>
            </div>

            <Button onClick={logout}>Выйти</Button>
          </>
        ) : (
          <Button onClick={loginWithPopup}>Вход / Регистрация</Button>
        )}
      </Container>
    </Navbar>
  );
};


export default MyNavbar;
