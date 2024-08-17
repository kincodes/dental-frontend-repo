import React, { useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../styles/LogoutStyle.css";


const Logout = () => {
  const { setAuth, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const errRef = useRef();

  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    goBack(true);
  };

  const logout = async () => {
   
    try {
      const response = await axiosPrivate
      .post("/logout", {})
      .then(() => {

      //  setAuth({});
       // localStorage.removeItem("jwt");
      //  localStorage.removeItem("persist");
      });
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        console.log("Missing Username or Password");
      } else if (err.response?.status === 401) {
        console.log("Unathorized");
      } else {
        console.log("Login Failed");
      }
    }
    
     localStorage.removeItem("jwt");
     localStorage.removeItem("currentUser");
     setAuth({});
     setPersist({});
   
  };

  return (
  
    <div>
      <Modal  show={show} onHide={handleClose}>
        <Form onSubmit={logout}>
          <Modal.Header>
            <Modal.Title>Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Are you sure you want to logout? </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Go Back
            </Button>
            <Button variant="primary" type="submit">
              Logout
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Logout;
