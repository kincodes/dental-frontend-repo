import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import "../../styles/RegisterForm.css";
import axios from "../../api/axios";

const REGISTER_URL = "/register";

const Register = () => {
  
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [errPass, setErrPass] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, username, password, passwordConfirm]);

  function handleSignup() {
    navigate("/");
  }

  function validateFields() {
    if (password != passwordConfirm) {
      setErrPass("passwords do not match");
      return false;
    } else {
      setErrPass("passwords match");
      return true;
    }
  }

  const handleRegister = async (e) => {
    if (validateFields() == false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      const user = {
        firstName,
        lastName,
        username,
        password,
        role,
      };
      console.log(user);

      try {
        const response = await axios.post(REGISTER_URL, JSON.stringify(user), {
          headers: { "Content-Type": "application/json" },
        });

        //  console.log(JSON.stringify(response?.data));

        const roles = response?.data?.role;

        setUsername("");
        setPassword("");
        setPasswordConfirm("");

        navigate("/");
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("Register Failed");
        }
        errRef.current.focus();
      }
    }
  };

  return (
    <div className="bodystyle">
      <section>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreeen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <div className="register-wrapper">
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Firstname"
                required
                value={firstName}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setRole("USER");
                }}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Lastname"
                required
                value={lastName}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setLastName(e.target.value)}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
              {errPass}
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={passwordConfirm}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <FaLock className="icon" />
              {errPass}
            </div>

            <button type="submit"> Sign Up </button>

            <div className="login-link">
              <p>
                {" "}
                Already have an account? <a href="/login"> Login</a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;
