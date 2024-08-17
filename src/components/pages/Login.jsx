import React, { useRef, useEffect } from "react";
import "../../styles/LoginForm.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log(JSON.stringify(response?.data));

      const accessToken = response?.data?.token;

      const roles = response?.data?.role;
      setAuth({ username, password, roles, accessToken });

      try {
        localStorage.setItem("jwt", JSON.stringify(accessToken));
        localStorage.setItem("currentUser", JSON.stringify(username));
      } catch (err) {
        console.log(err);
      }

      setUsername("");
      setPassword("");

      if (roles === "USER") {
        navigate("/user/dash");
      } else if (location.state?.from?.pathname === "/logout") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unathorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    try {
      localStorage.setItem("persist", JSON.stringify(persist));
    } catch (err) {
      console.log(err);
    }
  }, [persist]);

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

        <div className="login-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                className="input"
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
            </div>

            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  id="persist"
                  onChange={togglePersist}
                  checked={persist}
                />{" "}
                Trust device
              </label>
              <a href="#">Forgot password?</a> {/* Not implemented yet */}
            </div>

            <button type="submit"> Login </button>

            <div className="register-link">
              <p>
                {" "}
                Don't have an account? <a href="/register"> Register</a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
