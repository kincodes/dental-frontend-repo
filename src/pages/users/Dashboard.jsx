import React, { useRef, useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();

  const errRef = useRef();
  const successRef = useRef();

  const [currentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    setSuccessMsg("");
  }, []);

  const [setFName] = useState("");
  const [setLName] = useState("");
  const [setEmail] = useState("");
  const [setPhone] = useState("");
  const [setBalance] = useState("");
  const [setStreet] = useState("");
  const [setCity] = useState("");
  const [setProvince] = useState("");
  const [setPostal] = useState("");
  const [setInsuranceProv] = useState("");
  const [setPolicyNum] = useState("");
  const [setKin] = useState("");
  const [setKinPhone] = useState("");
  const [setKinRelationship] = useState("");

  const [users, setUser] = useState([]);
  const [appointments, setAppointments] = useState([]);

  //view user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/patient/getPatient/" + currentUser)
          .then(function (response) {
            setUser(response.data);
          });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("loading data failed");
        }
      }
    };
    getUser();
  }, []);

  // view appointments
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/appointment/getAppointment/" + currentUser, {})
          .then(function (response) {
            setAppointments(response.data);
            //  console.log(auth?.accessToken + " ....testing ");
          });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("loading appointment data failed");
        }
      }
    };
    getAppointments();
  }, []);

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreeen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <p
        ref={successRef}
        className={successMsg ? "successmsg" : "onscreeen"}
        aria-live="assertive"
      >
        {successMsg}
      </p>
      <div>
        <Tabs>
          <Tab eventKey="add" title="Dashboard">
            <div className="wrapper">
              <Form>
                {[users].map((user) => (
                  <div key={user.id}>
                    {" "}
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom30"
                      >
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="First name"
                          value={user.firstName}
                          onChange={(e) => setFName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom31"
                      >
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Last name"
                          value={user.lastName}
                          onChange={(e) => setLName(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom33"
                      >
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Email"
                          value={user.email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom34"
                      >
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Phone"
                          value={user.phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustom36"
                      >
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          placeholder="Street Address"
                          required
                          value={user.street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationCustom36"
                      >
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          placeholder="Balance"
                          required
                          value={"$" + user.balance}
                          onChange={(e) => setBalance(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustom37"
                      >
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          placeholder="City"
                          required
                          value={user.city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationCustom38"
                      >
                        <Form.Label>Province</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          placeholder="Province"
                          required
                          value={user.province}
                          onChange={(e) => setProvince(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationCustom39"
                      >
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          placeholder="Postal Code"
                          required
                          value={user.postal}
                          onChange={(e) => setPostal(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom40"
                      >
                        <Form.Label>Insurance Provider</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Insurance Provider"
                          value={user.insuranceProvider}
                          onChange={(e) => setInsuranceProv(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom41"
                      >
                        <Form.Label>Policy Number</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Policy Number"
                          value={user.policyNumber}
                          onChange={(e) => setPolicyNum(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom42"
                      >
                        <Form.Label>Next of Kin</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Full Name"
                          value={user.nextOfKin}
                          onChange={(e) => setKin(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom43"
                      >
                        <Form.Label>Next of Kin Phone</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Phone"
                          value={user.kinPhone}
                          onChange={(e) => setKinPhone(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom44"
                      >
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          placeholder="Relationship"
                          value={user.kinRelationship}
                          onChange={(e) => setKinRelationship(e.target.value)}
                        />
                      </Form.Group>
                    </Row>
                  </div>
                ))}
              </Form>
            </div>
          </Tab>

          <Tab eventKey="appointment" title="Appointment History">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time </th>
                  <th>Hygienist</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.employeeName}</td>
                    <td>{appointment.reason}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

export default Dashboard;
