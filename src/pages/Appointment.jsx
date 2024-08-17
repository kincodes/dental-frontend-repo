import React, { useRef, useState, useEffect } from "react";
import Calendar from "react-calendar";
import TimeProp from "./TimeProp";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { MdEdit } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

//css imports
import "../styles/CalendarStyle.css";
import "../styles/Schedule.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const procedures = [
  { value: "Cleaning", label: "Cleaning" },
  { value: "Toothache", label: "Toothache" },
  { value: "Sensitivity", label: "Sensitivity" },
  { value: "Teeth  Whitening", label: "Teeth  Whitening" },
  { value: "Cavities", label: "Cavities" },
  { value: "Gum Problems", label: "Gum Problems" },
  { value: "Wisdom Teeth", label: "Wisdom Teeth" },
  { value: "Other", label: "Other" },
];

const Appointment = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef();
  const successRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [validatedUpdate, setValidatedUp] = useState(false);
  const [validatedCancel, setValidatedCan] = useState(false);
  const [keyed, setKey] = useState("home");

  useEffect(() => {
    setErrMsg("");
  }, []);

  useEffect(() => {
    setSuccessMsg("");
  }, []);

  //filter/search value
  const [filterVal, setFilterVal] = useState("");

  // apointment variables
  const [appointments, setAppointments] = useState([]);
  const [day, setDay] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [employees1, setEmployees] = useState([]);

  const [searchVal, setSearchVal] = React.useState("");
  const [date, setDate] = useState("");
  const [employeeId, setEmpID] = React.useState("");
  const [employeeName, setEmpFName] = React.useState("");
  const [patientId, setPatientId] = React.useState("");
  const [patientName, setPatientName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [reason, setProcedure] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [status, setStatus] = React.useState("");

  // Edit Appointment Modal
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);

  let handleShowEdit = (appointment) => {
    setShowEdit(true);
    setSearchVal(appointment.id);

    setPatientId(appointment.patientId);
    setPatientName(appointment.patientName);
    setDate(appointment.date);
    setTime(appointment.time);

    setEmpID(appointment.employeeId);
    setEmpFName(appointment.employeeName);

    setProcedure(appointment.reason);
    setNotes(appointment.notes);
    setStatus("COMPLETED");
  };

  // Cancel Appointment Modal
  const [showCancelApp, setShowCancelApp] = useState(false);
  const handleCloseCancel = () => setShowCancelApp(false);

  let handleShowCancel = (appointment) => {
    setShowCancelApp(true);

    setSearchVal(appointment.id);

    setPatientId(appointment.patientId);
    setPatientName(appointment.patientName);
    setDate(appointment.date);
    setTime(appointment.time);

    setEmpID(appointment.employeeId);
    setEmpFName(appointment.employeeName);

    setProcedure(appointment.reason);
    setNotes(appointment.notes);
    setStatus("CANCELLED");
  };

  //View Employee data in dropdown
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

  // view appointments from mysql
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/appointment/getAll", {})
          .then(function (response) {
            setAppointments(response.data);
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

  //update appointment
  const handleUpdate = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      const appointment = {
        patientId,
        patientName,
        date,
        time,
        employeeId,
        employeeName,
        reason,
        notes,
        status,
      };
      console.log(appointment);

      try {
        const response = await axiosPrivate
          .put("appointment/update/" + searchVal, JSON.stringify(appointment))
          .then(() => {
            setSuccessMsg("Success");
            // console.log("Appointment updated sucessfully!!");
            setShowEdit(false);
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

    setValidatedUp(true);
  };

  //cancel appointment
  const handleCancel = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      const appointment = {
        patientId,
        patientName,
        date,
        time,
        employeeId,
        employeeName,
        reason,
        notes,
        status,
      };
      console.log(appointment);

      try {
        const response = await axiosPrivate
          .put("appointment/delete/" + searchVal, JSON.stringify(appointment))
          .then(() => {
            setSuccessMsg("Success");
            // console.log("Appointment cancelled!!");
            setShowCancelApp(false);
          });
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
    setValidatedCan(true);
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
        <Tab eventKey="home" title="Scheduler">
          <div className="app">
            <div className="left-pane">
              <Calendar
                onChange={setDay}
                tileDisabled={({ date }) =>
                  date.getDay() === 0 || date.getDay() === 6
                }
                value={day}
                onClickDay={() => setShowTime(true)}
              />
            </div>

            <div className="right-pane">
              {day.length > 0 ? (
                <p>
                  <span>Start:</span>
                  {day[0].toDateString()}
                  &nbsp; &nbsp;
                  <span>End:</span>
                  {day[1].toDateString()}
                </p>
              ) : (
                <p>
                  <span>Default selected date:</span> {day.toDateString()}
                </p>
              )}
              <p>Select an employee below to schedule and appointment</p>
              <TimeProp showTime={showTime} date={day} />
            </div>
          </div>
        </Tab>

        <Tab eventKey="appointment" title="Appointments">
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
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time </th>
                    <th>Employee Name</th>
                    <th>Reason</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .filter((row) => {
                      return (
                        !filterVal.length ||
                        row.id
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.patientName
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.employeeName
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.reason
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.notes
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.status
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase()) ||
                        row.date
                          .toString()
                          .toLowerCase()
                          .includes(filterVal.toString().toLowerCase())
                      );
                    })
                    .map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.employeeName}</td>
                        <td>{appointment.reason}</td>
                        <td>{appointment.notes}</td>
                        <td>{appointment.status}</td>

                        <td>
                          {" "}
                          <MdEdit
                            onClick={() => handleShowEdit(appointment)}
                          />{" "}
                          |{" "}
                          <MdOutlineCancel
                            onClick={() => handleShowCancel(appointment)}
                          />
                        </td>

                        <Modal show={showEdit} onHide={handleCloseEdit}>
                          <Form
                            noValidate
                            validated={validatedUpdate}
                            onSubmit={handleUpdate}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Update Appoinment</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom01"
                                >
                                  <Form.Label>Patient ID</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={patientId}
                                    onChange={(e) =>
                                      setPatientId(e.target.value)
                                    }
                                  />
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>Patient Name</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={patientName}
                                    onChange={(e) =>
                                      setPatientName(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid patient name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom03"
                                >
                                  <Form.Label>Date</Form.Label>
                                  <Form.Control
                                    readOnly
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid appointment date.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom04"
                                >
                                  <Form.Label>Appointment Time</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid appointment time.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom05"
                                >
                                  <Form.Label>Procedure</Form.Label>
                                  <Form.Select
                                    required
                                    value={reason}
                                    onChange={(e) =>
                                      setProcedure(e.target.value)
                                    }
                                  >
                                    <option>Select ...</option>
                                    {procedures.map((reason, optionId) => (
                                      <option
                                        key={optionId}
                                        value={reason.label}
                                      >
                                        {reason.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid procedure.
                                  </Form.Control.Feedback>

                                  {/*  <Form.Control
                                      required
                                      readOnly
                                      type="text"
                                      value={reason}
                                      onChange={(e) =>
                                        setProcedure(e.target.value)
                                      }
                                    />
                                     <Form.Control.Feedback type="invalid">
                                      Please provide a valid procedure.
                                    </Form.Control.Feedback> */}
                                </Form.Group>
                              </Row>
                              <Row>
                                <Form.Group
                                  as={Col}
                                  md="5"
                                  controlId="validationCustom06"
                                >
                                  <Form.Label>Notes</Form.Label>
                                  <Form.Control
                                    required
                                    as="textarea"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide valid notes.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom07"
                                >
                                  <Form.Label>Employee ID</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={employeeId}
                                    onChange={(e) => setEmpID(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid employee id.
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom08"
                                >
                                  <Form.Label>Employee Name</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={employeeName}
                                    onChange={(e) =>
                                      setEmpFName(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid employee name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseEdit}
                              >
                                Close
                              </Button>
                              <Button variant="primary" type="submit">
                                Complete Appointment
                              </Button>
                            </Modal.Footer>
                          </Form>
                        </Modal>

                        <Modal show={showCancelApp} onHide={handleCloseCancel}>
                          <Form
                            noValidate
                            validated={validatedCancel}
                            onSubmit={handleCancel}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Cancel Appointment</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <p>
                                Are you sure you want to cancel this
                                appointment?
                              </p>
                              <br />

                              <Row className="mb-3">
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom09"
                                >
                                  <Form.Label>Patient Name</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={patientName}
                                    onChange={(e) =>
                                      setPatientName(e.target.value)
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid patient name.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>

                              <Row>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom10"
                                >
                                  <Form.Label>Date</Form.Label>
                                  <Form.Control
                                    readOnly
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid appointment date.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  controlId="validationCustom11"
                                >
                                  <Form.Label>Appointment Time</Form.Label>
                                  <Form.Control
                                    required
                                    readOnly
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a valid appointment time.
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseCancel}
                              >
                                Close
                              </Button>
                              <Button variant="primary" type="submit">
                                Cancel Appointment
                              </Button>
                            </Modal.Footer>
                          </Form>
                        </Modal>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Tab>
      </Tabs>
    </section>
  );
};

export default Appointment;
