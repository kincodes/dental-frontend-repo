import React, { useRef, useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../styles/Dentist.css";
import Modal from "react-bootstrap/Modal";
import { MdEdit } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const roles = [
  { value: "DENTIST", label: "DENTIST" },
  { value: "HYGIENIST", label: "HYGIENIST" },
  { value: "ADMIN", label: "ADMIN" },
];

const Employee = () => {
  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef();
  const successRef = useRef();
  const [key, setKey] = useState("home");

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    setSuccessMsg("");
  }, []);

  const [validated, setValidated] = useState(false);
  const [validatedUpdate, setValidatedUp] = useState(false);
  const [validatedDelete, setValidatedDel] = useState(false);

  const [filterVal, setFilterVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [employees, setEmployees] = useState([]);

  //show edit modal
  const [show, setShow] = useState(false);

  let handleShow = (employee) => {
    setShow(true);
    setSearchVal(employee.id);
    setFName(employee.firstName);
    setLName(employee.lastName);
    setEmail(employee.email);
    setPhone(employee.phone);
    setRole(employee.role);
  };

  // close edit modal
  const handleClose = () => {
    setShow(false);
    handleClear(true);
  };

  //show delete modal
  const [showDelete, setShowDelete] = useState(false);

  let handleShowDel = (employee) => {
    setShowDelete(true);

    setSearchVal(employee.id);
    setFName(employee.firstName);
    setLName(employee.lastName);
    setEmail(employee.email);
    setPhone(employee.phone);
    setRole(employee.role);
  };

  //close delete modal
  const handleCloseDel = () => {
    setShowDelete(false);
    handleClear(true);
  };

  //view all employees
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/employee/getAll", {})
          .then(function (response) {
            setEmployees(response.data);
          });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("loading employee data failed");
        }
      }
    };
    getEmployees();
  }, []);

  // add employees
  const handleClick = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const employee = {
        firstName,
        lastName,
        email,
        phone,
        role,
      };
      console.log(employee);

      try {
        const response = await axiosPrivate
          .post("/employee/add", JSON.stringify(employee))
          .then(() => {
            // console.log("New employee added sucessfully!!");
            setSuccessMsg("Success");
          });

        handleClear(true);
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("Saving data failed");
        }
      }
    }
    setValidated(true);
  };

  //update employee
  const handleUpdate = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const employee = {
        firstName,
        lastName,
        email,
        phone,
        role,
      };
      console.log(employee);

      try {
        const response = await axiosPrivate
          .put("employee/update/" + searchVal, JSON.stringify(employee))
          .then(() => {
            //  console.log("Employee record updated sucessfully!!");
            setSuccessMsg("Success");
            setShow(false);
          });

        handleClear(true);
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("Saving data failed");
        }
      }
    }
    setValidatedUp(true);
  };

  //delete employee
  const handleDelete = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const employee = {
        firstName,
        lastName,
        email,
        phone,
        role,
      };
      console.log(employee);

      try {
        const response = await axiosPrivate
          .put("employee/delete/" + searchVal, JSON.stringify(employee))
          .then(() => {
            console.log("Employee record deleted!!");
            setSuccessMsg("Success");
            setShowDelete(false);
          });

        handleClear(true);
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("Deleting data failed");
        }
      }
    }

    setValidatedDel(true);
  };

  const handleClear = () => {
    setFName("");
    setLName("");
    setEmail("");
    setPhone("");
    setRole("");
  };

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

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="View Employees">
          <div className="wrapper">
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} md="4">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setFilterVal(e.target.value)}
                  />
                </Form.Group>
              </Row>
            </Form>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter((row) => {
                    return (
                      !filterVal.length ||
                      row.id
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.firstName
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.lastName
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.email
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.phone
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.role
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase())
                    );
                  })

                  .map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.role}</td>
                      <td>
                        {" "}
                        <MdEdit onClick={() => handleShow(employee)} /> |{" "}
                        <GiCancel onClick={() => handleShowDel(employee)} />
                      </td>
                      <Modal show={show} onHide={handleClose}>
                        <Form
                          noValidate
                          validated={validatedUpdate}
                          onSubmit={handleUpdate}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Update Employee</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom01"
                                >
                                  <Form.Label>First name</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFName(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid first name.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>Last name</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLName(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid last name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom03"
                                >
                                  <Form.Label>Email</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid email.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom04"
                                >
                                  <Form.Label>Phone</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid phone number.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom05"
                                >
                                  <Form.Label>Role</Form.Label>
                                  <Form.Select
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                  >
                                    <option>Select ...</option>
                                    {roles.map((role, optionId) => (
                                      <option key={optionId} value={role.label}>
                                        {role.label}
                                      </option>
                                    ))}{" "}
                                  </Form.Select>

                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid role.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" type="submit">
                              {" "}
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>

                      <Modal show={showDelete} onHide={handleCloseDel}>
                        <Form
                          noValidate
                          validated={validatedDelete}
                          onSubmit={handleDelete}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Delete Employee</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom06"
                                >
                                  <Form.Label>First name</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFName(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid first name.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom07"
                                >
                                  <Form.Label>Last name</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLName(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid last name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom08"
                                >
                                  <Form.Label>Email</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid email.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom09"
                                >
                                  <Form.Label>Phone</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid phone number.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom10"
                                >
                                  <Form.Label>Role</Form.Label>
                                  <Form.Control
                                    type="text"
                                    readOnly
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid Role.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={handleCloseDel}
                            >
                              Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                              Delete Record
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="add" title="Add Employee">
          <div className="wrapper">
            <Form noValidate validated={validated} onSubmit={handleClick}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom11">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid first name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom12">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid last name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom13">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom14">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="validationCustom16">
                  <Form.Label>Role </Form.Label>
                  <Form.Select
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Select ...</option>
                    {roles.map((role, optionId) => (
                      <option key={optionId} value={role.label}>
                        {role.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid role.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button variant="primary" type="submit">
                {" "}
                Save Employee
              </Button>
              <Button onClick={handleClear}>Clear form</Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    </section>
  );
};

export default Employee;
