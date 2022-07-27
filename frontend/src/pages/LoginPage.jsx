import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { login } from "../core/api";
import AppContext from "../context";
import { Header } from "../components/Header";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { setUser, setIsAuth } = useContext(AppContext);


  const userLogin = async (email, password) => {
    const data = await login(email, password);
    localStorage.setItem("token2", data.accessToken);
    setIsAuth(true);
    setUser(data.user);
  };

  const onSubmit = e => {
    e.preventDefault();
    userLogin(email, password);
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="container h-100">
        <div className="row h-100 d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="card px-5 py-5" id="form1">
              <h4>Войти</h4>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Введите адрес электронной почты"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                </Form.Group>
                <Button type="submit" variant="outline-primary" style={{ width: "100%" }}>Войти</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default LoginPage;