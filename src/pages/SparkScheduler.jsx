import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { format } from "date-fns";
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

const SparkScheduler = (props) => {
  const axiosPrivate = useAxiosPrivate();

  const errRef = useRef();
  const successRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    setSuccessMsg("");
  }, []);

  const [validated, setValidated] = useState(false);
  const [event, setEvent] = useState(null);
  const [info, setInfo] = useState(false);
  const [date, setDate] = useState("");

  let handleSetDate = () => {
    setDate(format(new Date(props.date), "yyyy-MM-dd"));
    console.log(date);
  };

  //employee data
  const [employeeId, setEmpID] = useState("");
  const [employeeName, setEmpFName] = useState("");

  // patient data
  const [patients, setPatients] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");

  //add appointment
  const [time, setTime] = useState("");
  const [reason, setProcedure] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [workTime, setWorkTime] = useState([]);

  //array to store all schedules
  const [schedules, setSchedules] = useState([]);

  // Add Appoinment Modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (times) => {
    setShow(true);
    handleSetDate(true);
    setEmpID(times.employeeId);
    setEmpFName(times.firstName);
    setWorkTime(times.workTime);
    setStatus("BOOKED");
  };

  const handleLoadData = (patient) => {
    setPatientId(patient.id);
    setPatientName(patient.firstName);
  };

  // view all schedules
  useEffect(() => {
    const getSchedules = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/schedule/getAll", {})
          .then(function (response) {
            setSchedules(response.data);
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
    getSchedules();
  }, []);

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
        } else if (err.response?.status === 403) {
          setErrMsg("Missing fields.");
        } else {
          setErrMsg("loading data failed");
        }
      }
    };
    getPatients();
  }, []);

  // add appointment
  const handleSave = async (e) => {
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
          .post("/appointment/add", JSON.stringify(appointment))
          .then(() => {
            // console.log("New appointment added sucessfully!!");
            setSuccessMsg("Success");
            setShow(false);
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

      <div className="times">
        {schedules.map((times) => {
          return (
            <div key={times.id}>
              <button
                key={times.id}
                className="btn-name"
                onClick={(e) => handleShow(times)}
              >
                {" "}
                {
                 /*  !times.role .toString()
                  .toLowerCase()
                  .includes("ADMIN") ? */
                   times.firstName
                 /*  :" "*/} {" "}
              </button>
              <div>
                <Modal show={show} onHide={handleClose}>
                  <Form noValidate validated={validated} onSubmit={handleSave}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Appoinment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Select Patient</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                          >
                            <option>Select Patient</option>
                            {patients.map((patient, index) => (
                              <option
                                key={index}
                                value={patient.id}
                                onClick={(e) => handleLoadData(patient)}
                              >
                                {patient.firstName} {patient.lastName}{" "}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid patient.
                          </Form.Control.Feedback>
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
                            onChange={(e) => setPatientName(e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a patient name.
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
                            Please provide a valid date.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Select Appointment Time</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          >
                            <option>Select Time</option>
                            {workTime.map((time, index) => (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid appointment time.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                          <Form.Label>Procedure</Form.Label>
                          <Form.Select
                            required
                            value={reason}
                            onChange={(e) => setProcedure(e.target.value)}
                          >
                            <option>Select ...</option>
                            {procedures.map((reason, optionId) => (
                              <option key={optionId} value={reason.label}>
                                {reason.label}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid procedure.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group
                          as={Col}
                          md="5"
                          controlId="validationCustom05"
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
                          controlId="validationCustom06"
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
                          controlId="validationCustom07"
                        >
                          <Form.Label>Employee Name</Form.Label>
                          <Form.Control
                            required
                            readOnly
                            type="text"
                            value={employeeName}
                            onChange={(e) => setEmpFName(e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid employee name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
              </div>
            </div>
          );
        })}
        <div>
          {info
            ? `Your appointment is booked on ${event} ${props.date.toDateString()}`
            : null}
        </div>
      </div>
    </section>
  );
};

export default SparkScheduler;
