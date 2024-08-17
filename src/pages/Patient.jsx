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

const genders = [
  { value: "M", label: "M" },
  { value: "F", label: "F" },
  { value: "Other", label: "Other" },
];
const provinces = [
  { value: "AB", label: "AB" },
  { value: "BC", label: "BC" },
  { value: "MB", label: "MB" },
  { value: "NB", label: "NB" },
  { value: "NL", label: "NL" },
  { value: "NT", label: "NT" },
  { value: "NS", label: "NS" },
  { value: "NU", label: "NU" },
  { value: "ON", label: "ON" },
  { value: "PE", label: "PE" },
  { value: "QC", label: "QC" },
  { value: "SK", label: "SK" },
  { value: "YT", label: "YT" },
];
const relationships = [
  { value: "Mother", label: "Mother" },
  { value: "Father", label: "Father" },
  { value: "Spouse", label: "Spouse" },
  { value: "Husband", label: "Husband" },
  { value: "Wife", label: "Wife" },
  { value: "Child", label: "Child" },
  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Other", label: "Other" },
];

const Patient = () => {
  const axiosPrivate = useAxiosPrivate();
  const [keyed, setKey] = useState("home");

  const errRef = useRef();

  const [errMsg, setErrMsg] = React.useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const successRef = useRef();
  const [successMsg, setSuccessMsg] = React.useState("");
  useEffect(() => {
    setSuccessMsg("");
  }, []);

  const [validated, setValidated] = useState(false);
  const [validatedUpdate, setValidatedUp] = useState(false);
  const [validatedDelete, setValidatedDel] = useState(false);

  const [errorGen, setErrorGen] = useState("");
  const [errorProv, setErrorProv] = useState("");
  const [errorRship, setErrorRship] = useState("");

  const [errorGenUpdate, setErrorGenUpdate] = useState("");
  const [errorProvUpdate, setErrorProvUpdate] = useState("");
  const [errorRshipUpdate, setErrorRshipUpdate] = useState("");

  const [filterVal, setFilterVal] = useState("");

  const [searchVal, setSearchVal] = useState("");
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");
  const [insuranceProvider, setInsuranceProv] = useState("");
  const [policyNumber, setPolicyNum] = useState("");
  const [nextOfKin, setKin] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [kinRelationship, setKinRelationship] = useState("");
  const [status, setStatus] = useState("");

  const [patients, setPatients] = useState([]);

  function validateSelect() {
    if (gender.length === 0) {
      setErrorGen("Please select a valid gender.");
      return false;
    }
    if (province.length === 0) {
      setErrorProv("Please select a valid provincce.");
      return false;
    }
    if (kinRelationship.length === 0) {
      setErrorRship("Please select a valid relationship.");
      return false;
    } else {
      setErrorGen("");
      setErrorProv("");
      setErrorRship("");
      return true;
    }
  }

  function validateSelectUpdate() {
    if (gender.length === 0) {
      setErrorGenUpdate("Please select a valid gender.");
      return false;
    }
    if (province.length === 0) {
      setErrorProvUpdate("Please select a valid provincce.");
      return false;
    }
    if (kinRelationship.length === 0) {
      setErrorRshipUpdate("Please select a valid relationship.");
      return false;
    } else {
      setErrorGenUpdate("");
      setErrorProvUpdate("");
      setErrorRshipUpdate("");
      return true;
    }
  }

  //show edit modal
  const [show, setShow] = useState(false);

  let handleShow = (patient) => {
    setShow(true);
    setSearchVal(patient.id);
    setFName(patient.firstName);
    setLName(patient.lastName);
    setDob(patient.dob);
    setEmail(patient.email);
    setPhone(patient.phone);
    setGender(patient.gender);
    setStreet(patient.street);
    setCity(patient.city);
    setPostal(patient.postal);
    setProvince(patient.province);
    setInsuranceProv(patient.insuranceProvider);
    setPolicyNum(patient.policyNumber);
    setKin(patient.nextOfKin);
    setKinPhone(patient.kinPhone);
    setKinRelationship(patient.kinRelationship);
  };

  // close edit modal
  const handleClose = () => {
    setShow(false);
    handleClear(true);
  };

  //show delete modal
  const [showDelete, setShowDelete] = useState(false);

  let handleShowDel = (patient) => {
    setShowDelete(true);

    setSearchVal(patient.id);
    setFName(patient.firstName);
    setLName(patient.lastName);
    setDob(patient.dob);
    setEmail(patient.email);
    setPhone(patient.phone);
    setGender(patient.gender);
    setStreet(patient.street);
    setCity(patient.city);
    setPostal(patient.postal);
    setProvince(patient.province);
    setInsuranceProv(patient.insuranceProvider);
    setPolicyNum(patient.policyNumber);
    setKin(patient.nextOfKin);
    setKinPhone(patient.kinPhone);
    setKinRelationship(patient.kinRelationship);
    setStatus("INACTIVE");
  };

  //close delete modal
  const handleCloseDel = () => {
    setShowDelete(false);
    handleClear(true);
  };

  //view all patients
  useEffect(() => {
    const getPatients = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/patient/getAll", {})
          .then(function (response) {
            setPatients(response.data);
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
    getPatients();
  }, []);

  // save patient
  const handleClick = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validateSelect() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const patient = {
        firstName,
        lastName,
        dob,
        email,
        phone,
        gender,
        street,
        city,
        province,
        postal,
        insuranceProvider,
        policyNumber,
        nextOfKin,
        kinPhone,
        kinRelationship,
        status,
      };
      console.log(patient);

      try {
        const response = await axiosPrivate
          .post("/patient/add", JSON.stringify(patient))
          .then(() => {
            // console.log("New patient added sucessfully!!");
            setSuccessMsg("Success");
            handleClear(true);
          });
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

  //update patient
  const handleUpdate = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else if (validateSelectUpdate() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      const patient = {
        firstName,
        lastName,
        dob,
        email,
        phone,
        gender,
        street,
        city,
        province,
        postal,
        insuranceProvider,
        policyNumber,
        nextOfKin,
        kinPhone,
        kinRelationship,
      };
      console.log(patient);

      try {
        const response = await axiosPrivate
          .put("/patient/update/" + searchVal, JSON.stringify(patient))
          .then(() => {
            // console.log("Patient record updated sucessfully!!");
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

  //delete patient
  const handleDelete = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const patient = {
        firstName,
        lastName,
        dob,
        email,
        phone,
        gender,
        street,
        city,
        province,
        postal,
        insuranceProvider,
        policyNumber,
        nextOfKin,
        kinPhone,
        kinRelationship,
        status,
      };
      console.log(patient);

      try {
        const response = await axiosPrivate
          .put("/patient/delete/" + searchVal, JSON.stringify(patient))
          .then(() => {
            // console.log("Patient record deleted!!");
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

  //clear forms
  const handleClear = () => {
    setFName("");
    setLName("");
    setDob("");
    setEmail("");
    setPhone("");

    setGender("");

    setStreet("");
    setCity("");
    setPostal("");
    setProvince("");
    setInsuranceProv("");
    setPolicyNum("");
    setKin("");
    setKinPhone("");
    setKinRelationship("");

    setGender("");
    setErrorProv("");
    setErrorGen("");
    setErrorRship("");
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
        activeKey={keyed}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="View Patients">
          <div className="wrapper">
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom01">
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
                  <th>Account Number</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients
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
                        .includes(filterVal.toString().toLowerCase())
                    );
                  })
                  .map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.firstName}</td>
                      <td>{patient.lastName}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>${patient.balance}</td>
                      <td>{patient.status}</td>
                      <td>
                        {" "}
                        <MdEdit onClick={() => handleShow(patient)} /> |{" "}
                        <GiCancel onClick={() => handleShowDel(patient)} />
                      </td>

                      <Modal show={show} onHide={handleClose}>
                        <Form
                          noValidate
                          validated={validatedUpdate}
                          onSubmit={handleUpdate}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Update Patient</Modal.Title>
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
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom03"
                                >
                                  <Form.Label>Date of Birth</Form.Label>
                                  <Form.Control
                                    required
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid date of birth.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom04"
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
                                  controlId="validationCustom05"
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
                                  controlId="validationCustom06"
                                >
                                  <Form.Select
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                  >
                                    <option>Select ...</option>
                                    {genders.map((gen, optionId) => (
                                      <option key={optionId} value={gen.label}>
                                        {gen.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errorGenUpdate}
                                  </p>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom07"
                                >
                                  <Form.Label>Street Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid street.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom08"
                                >
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid city.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="3"
                                  controlId="validationCustom09"
                                >
                                  <Form.Label>Province</Form.Label>

                                  <Form.Select
                                    required
                                    value={province}
                                    onChange={(e) =>
                                      setProvince(e.target.value)
                                    }
                                  >
                                    <option>Select ...</option>
                                    {provinces.map((prov, optionId) => (
                                      <option key={optionId} value={prov.label}>
                                        {prov.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errorProvUpdate}
                                  </p>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="3"
                                  controlId="validationCustom10"
                                >
                                  <Form.Label>Postal Code</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    value={postal}
                                    onChange={(e) => setPostal(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid postal code.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom11"
                                >
                                  <Form.Label>Insurance Provider</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={insuranceProvider}
                                    onChange={(e) =>
                                      setInsuranceProv(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid insurance provider.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom12"
                                >
                                  <Form.Label>Policy Number</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={policyNumber}
                                    onChange={(e) =>
                                      setPolicyNum(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid policy number.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom13"
                                >
                                  <Form.Label>Next of Kin</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={nextOfKin}
                                    onChange={(e) => setKin(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid next of kin.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom14"
                                >
                                  <Form.Label>Kin's Phone Number</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    value={kinPhone}
                                    onChange={(e) =>
                                      setKinPhone(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid phone number.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom15"
                                >
                                  <Form.Label>Relationship</Form.Label>
                                  <Form.Select
                                    required
                                    value={kinRelationship}
                                    onChange={(e) =>
                                      setKinRelationship(e.target.value)
                                    }
                                  >
                                    <option>Select ...</option>
                                    {relationships.map((rship, optionId) => (
                                      <option
                                        key={optionId}
                                        value={rship.label}
                                      >
                                        {rship.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errorRshipUpdate}
                                  </p>
                                </Form.Group>
                              </Row>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" type="sumbit">
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
                            <Modal.Title>Delete Patient</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom16"
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
                                    Please provide a valid firstname.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom17"
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
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom18"
                                >
                                  <Form.Label>Date of Birth</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid date of birth.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom19"
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
                                  controlId="validationCustom20"
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
                                  controlId="validationCustom21"
                                >
                                  <Form.Label>Gender</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    readOnly
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid gender.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom22"
                                >
                                  <Form.Label>Street Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    readOnly
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid street.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom22"
                                >
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    readOnly
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid city.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="3"
                                  controlId="validationCustom23"
                                >
                                  <Form.Label>Province</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    readOnly
                                    value={province}
                                    onChange={(e) =>
                                      setProvince(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid province.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="3"
                                  controlId="validationCustom24"
                                >
                                  <Form.Label>Postal Code</Form.Label>
                                  <Form.Control
                                    type="text"
                                    required
                                    readOnly
                                    value={postal}
                                    onChange={(e) => setPostal(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid postal code.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom25"
                                >
                                  <Form.Label>Insurance Provider</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={insuranceProvider}
                                    onChange={(e) =>
                                      setInsuranceProv(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid insurance provider.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom26"
                                >
                                  <Form.Label>Policy Number</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={policyNumber}
                                    onChange={(e) =>
                                      setPolicyNum(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid policy number.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom27"
                                >
                                  <Form.Label>Next of Kin</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={nextOfKin}
                                    onChange={(e) => setKin(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid next of kin.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom28"
                                >
                                  <Form.Label>Kin's Phone Number</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={kinPhone}
                                    onChange={(e) =>
                                      setKinPhone(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid phone number.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom29"
                                >
                                  <Form.Label>Relationship</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={kinRelationship}
                                    onChange={(e) =>
                                      setKinRelationship(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid relationship.
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

        <Tab eventKey="add" title="Add Patient">
          <div className="wrapper">
            <Form noValidate validated={validated} onSubmit={handleClick}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom30">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFName(e.target.value);
                      setStatus("ACTIVE");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid first name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom31">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid lastname.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom32">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    placeholder="DOB"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter date of birth.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom33">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom34">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid phone number.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Gender </Form.Label>
                  <Form.Select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>Select ...</option>
                    {genders.map((gen, optionId) => (
                      <option key={optionId} value={gen.label}>
                        {gen.label}
                      </option>
                    ))}
                  </Form.Select>
                  <p className="text-danger">{errorGen}</p>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom36">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Street Address"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid street.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom37">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid city.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom38">
                  <Form.Label>Province</Form.Label>
                  <Form.Select
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    <option>Select ...</option>
                    {provinces.map((prov, optionId) => (
                      <option key={optionId} value={prov.label}>
                        {prov.label}
                      </option>
                    ))}
                  </Form.Select>
                  <p className="text-danger">{errorProv}</p>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="validationCustom39">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Postal Code"
                    required
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid postal code.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom40">
                  <Form.Label>Insurance Provider</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Insurance Provider"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProv(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid insurance provider.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom41">
                  <Form.Label>Policy Number</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Policy Number"
                    value={policyNumber}
                    onChange={(e) => setPolicyNum(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid policy number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom42">
                  <Form.Label>Next of Kin</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Full Name"
                    value={nextOfKin}
                    onChange={(e) => setKin(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter next of kin's name.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom43">
                  <Form.Label>Next of Kin Phone</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Phone"
                    value={kinPhone}
                    onChange={(e) => setKinPhone(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid phone number.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3">
                  {" "}
                  <Form.Label>Relationship</Form.Label>
                  <Form.Select
                    required
                    value={kinRelationship}
                    onChange={(e) => setKinRelationship(e.target.value)}
                  >
                    <option>Select ...</option>
                    {relationships.map((rship, optionId) => (
                      <option key={optionId} value={rship.label}>
                        {rship.label}
                      </option>
                    ))}
                  </Form.Select>
                  <p className="text-danger">{errorRship}</p>
                </Form.Group>
              </Row>

              <Button type="submit"> Save Patient</Button>
              <Button onClick={() => handleClear()}>Clear form</Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    </section>
  );
};

export default Patient;
