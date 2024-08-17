import React, { useRef, useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";

import "../styles/Schedule.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { MdEdit } from "react-icons/md";

import { format } from "date-fns";
import { RiDeleteBin2Line } from "react-icons/ri";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import _ from "lodash";

const hours = [
  { id: 0, label: "6:00 AM" },
  { id: 1, label: "7:00 AM" },
  { id: 2, label: "8:00 AM" },
  { id: 3, label: "9:00 AM" },
  { id: 4, label: "10:00 AM" },
  { id: 5, label: "11:00 AM" },
  { id: 6, label: "12:00 PM" },
  { id: 7, label: "1:00 PM" },
  { id: 8, label: "2:00 PM" },
  { id: 9, label: "3:00 PM" },
  { id: 10, label: "4:00 PM" },
  { id: 11, label: "5:00 PM" },
  { id: 12, label: "6:00 PM" },
];

const Schedule = () => {
  const axiosPrivate = useAxiosPrivate();

  const errRef = useRef();

  const [errorHours, setErrorHours] = useState("");
  const [errorHours2, setErrorHours2] = useState("");
  const [errorSelect, setErrorSelect] = useState("");

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const successRef = useRef();
  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    setSuccessMsg("");
  }, []);

  const [key, setKey] = useState("home");
  const [validated, setValidated] = useState(false);
  const [validatedUpdate, setValidatedUp] = useState(false);
  const [validatedDelete, setValidatedDel] = useState(false);
  const [filterVal, setFilterVal] = useState("");

  //variables to save/update schedule
  const [searchVal, setSearchVal] = useState("");
  const [employeeId, setEmpID] = useState("");
  const [firstName, setEmpFName] = useState("");
  const [lastName, setEmpLName] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [workTime, setWorkTime] = useState([]);

  // apointment variables
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [employees, setEmployees] = useState([]);

  //view all schedules
  const [schedules, setSchedules] = useState([]);

  // Add Schedule Modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    handleClear();
  };
  const handleShow = () => {
    setShow(true);
  };

  //load employee data
  let handleLoadData = (employee) => {
    setEmpFName(employee.firstName);
    setEmpLName(employee.lastName);
  };

  // Edit Schedule Modal
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);

  let handleShowEdit = (schedule) => {
    setShowEdit(true);
    setSearchVal(schedule.id);
    setEmpID(schedule.employeeId);
    setPeriodStart(schedule.periodStart);
    setPeriodEnd(schedule.periodEnd);
    setEmpFName(schedule.firstName);
    setEmpLName(schedule.lastName);
    setWorkTime(schedule.workTime);
  };

  // Delete Schedule Modal
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);

  let handleShowDelete = (schedule) => {
    setShowDelete(true);
    setSearchVal(schedule.id);
    setEmpID(schedule.employeeId);
    setPeriodStart(schedule.periodStart);
    setPeriodEnd(schedule.periodEnd);
    setEmpFName(schedule.firstName);
    setEmpLName(schedule.lastName);
    setWorkTime(schedule.workTime);
  };

  //date range picker
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  ///time picker dropdown
  const [select_Hours, set_Select_Hours] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const dropDownShow = () => {
    setIsOpen(!isOpen);
  };
  const hourChange = (event) => {
    const hourId = parseInt(event.target.value);
    const choosen = event.target.checked;

    if (choosen) {
      set_Select_Hours([...select_Hours, hourId]);
    } else {
      set_Select_Hours(select_Hours.filter((id) => id !== hourId));
    }
  };

  function confirmHours() {
    setWorkTime(
      select_Hours.map(
        (optionId) => hours.find((option) => option.id === optionId)?.label
      )
    );
    setErrorHours("");
    setErrorHours2("");

    alert("Hours are confirmed.");
  }

  function validateHours() {
    if (employeeId.length === 0) {
      setErrorSelect("Please select an employee");
      return false;
    }
    if (workTime.length === 0) {
      setErrorHours("Please select valid work hours.");
      setErrorHours2("Please confirm work hours.");

      return false;
    } else {
      setErrorHours("");
      setErrorHours2("");
      setErrorSelect("");

      return true;
    }
  }

  const handleClear = () => {
    setEmpFName("");
    setEmpLName("");
    setEmpID("");
    setPeriodStart("");
    setPeriodEnd("");
    setIsOpen(false);
    setWorkTime([]);
    setState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: "selection",
      },
    ]);

    set_Select_Hours([]);

    setErrorHours("");
    setErrorHours2("");
    setErrorSelect("");
  };

  //View Employee data in dropdown
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const repsonse = await axiosPrivate
          .get("/employee/getRole", {})
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
          setErrMsg("loading data failed");
        }
      }
    };
    getEmployees();
  }, []);

  // view schedules
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

  // view appointments
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
          setErrMsg("loading data failed");
        }
      }
    };
    getAppointments();
  }, []);

  /// Add Schedule
  const handleSave = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } //{
    else if (validateHours() == false) {
      console.log(employeeId);
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const schedule = {
        periodStart,
        periodEnd,
        firstName,
        lastName,
        workTime,
        employeeId,
      };
      console.log(schedule);

      try {
        const response = await axiosPrivate
          .post("/schedule/add/" + employeeId, JSON.stringify(schedule))
          .then(() => {
            // console.log("New schedule added sucessfully!!");
            setSuccessMsg("Success");
            setShow(false);
          });
        handleClear();
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Bad Request | Missing Fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("Saving data failed");
        }
        errRef.current.focus();
      }
    }

    //handleClear();
    setValidated(true);
  };

  /// Update Schedule
  const handleEdit = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const schedule = {
        periodStart,
        periodEnd,
        workTime,
        employeeId,
      };
      console.log(schedule);

      try {
        const response = await axiosPrivate
          .put("/schedule/update/" + searchVal, JSON.stringify(schedule))
          .then(() => {
            console.log("Schedule updated sucessfully!!");
            setSuccessMsg("Success");
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

  /// Delete Schedule
  const handleDelete = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const schedule = {
        periodStart,
        periodEnd,
        workTime,
        employeeId,
      };
      console.log(schedule);

      try {
        const response = await axiosPrivate
          .delete("/schedule/delete/" + searchVal, JSON.stringify(schedule))
          .then(() => {
            console.log("Schedule deleted!!");
            setSuccessMsg("Success");
            setShowDelete(false);
          });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing fields");
        } else if (err.response?.status === 401) {
          setErrMsg("Unathorized");
        } else {
          setErrMsg("deleting data failed");
        }
        errRef.current.focus();
      }
    }

    setValidatedDel(true);
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
        <Tab eventKey="home" title="Manage Schedule">
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

                <Form.Group as={Col} md="4" controlId="validationCustom01">
                  <Button variant="primary" onClick={handleShow}>
                    Add Schedule
                  </Button>
                </Form.Group>
              </Row>
            </Form>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Employee ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Hours</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules
                  .filter((row) => {
                    return (
                      !filterVal.length ||
                      row.id
                        .toString()
                        .toLowerCase()
                        .includes(filterVal.toString().toLowerCase()) ||
                      row.employeeId
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
                        .includes(filterVal.toString().toLowerCase())
                    );
                  })
                  .map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{schedule.employeeId}</td>
                      <td>{schedule.firstName}</td>
                      <td>{schedule.lastName}</td>
                      <td>{schedule.periodStart}</td>
                      <td>{schedule.periodEnd}</td>
                      <td>{schedule.workTime}</td>
                      <td>
                        {" "}
                        <MdEdit
                          onClick={() => handleShowEdit(schedule)}
                        /> |{" "}
                        <RiDeleteBin2Line
                          onClick={() => handleShowDelete(schedule)}
                        />
                      </td>

                      <Modal show={showEdit} onHide={handleCloseEdit}>
                        <Form
                          noValidate
                          validated={validatedUpdate}
                          onSubmit={handleEdit}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Update Schedule</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Schedule ID</Form.Label>
                                <Form.Control
                                  required
                                  readOnly
                                  type="text"
                                  value={searchVal}
                                  onChange={(e) => setSearchVal(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid schedule id.
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom02"
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
                            </Row>
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom03"
                              >
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                  required
                                  type="date"
                                  value={periodStart}
                                  onChange={(e) =>
                                    setPeriodStart(e.target.value)
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid start date.
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom04"
                              >
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                  required
                                  type="date"
                                  value={periodEnd}
                                  onChange={(e) => setPeriodEnd(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid end date.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Current Hours</Form.Label>
                                <Form.Control
                                  required
                                  readOnly
                                  type="text"
                                  value={workTime}
                                  onChange={(e) => setWorkTime(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide valid work times.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom06"
                              >
                                <div>
                                  {" "}
                                  <div className="custom-dropdown">
                                    <button
                                      className="btn-selct"
                                      type="button"
                                      id="multiSelectDropdown"
                                      onClick={dropDownShow}
                                    >
                                      Update Hours
                                    </button>
                                    {isOpen && (
                                      <div
                                        className={`custom-dropdown-menu  
                                    ${isOpen ? "show" : ""}`}
                                        aria-labelledby="multiSelectDropdown"
                                      >
                                        {hours.map((option) => (
                                          <Form.Check
                                            className="custom-checkbox"
                                            key={option.id}
                                            type="checkbox"
                                            id={`option_${option.id}`}
                                            label={option.label}
                                            checked={select_Hours.includes(
                                              option.id
                                            )}
                                            onChange={hourChange}
                                            value={option.id}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Form.Control.Feedback type="invalid">
                                  Please provide valid hours.
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom07"
                              >
                                <Form.Label>Selected Hours</Form.Label>
                                <div
                                  style={{
                                    marginLeft: "20px",
                                    width: "50%",
                                  }}
                                >
                                  <ul>
                                    {select_Hours.map((optionId) => (
                                      <li key={optionId}>
                                        {
                                          hours.find(
                                            (option) => option.id === optionId
                                          )?.label
                                        }
                                      </li>
                                    ))}
                                  </ul>
                                  <Button className="btn-selct" onClick={confirmHours}>
                                    Confirm Hours
                                  </Button>
                                </div>
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
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>

                      <Modal show={showDelete} onHide={handleCloseDelete}>
                        <Form
                          noValidate
                          validated={validatedDelete}
                          onSubmit={handleDelete}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Delete Schedule</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom08"
                              >
                                <Form.Label>Schedule ID</Form.Label>
                                <Form.Control
                                  required
                                  readOnly
                                  type="text"
                                  value={searchVal}
                                  onChange={(e) => setSearchVal(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid schedule id.
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom09"
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
                            </Row>
                            <Row>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom10"
                              >
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                  readOnly
                                  required
                                  type="date"
                                  value={periodStart}
                                  onChange={(e) =>
                                    setPeriodStart(e.target.value)
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid start date.
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom11"
                              >
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                  readOnly
                                  required
                                  type="date"
                                  value={periodEnd}
                                  onChange={(e) => setPeriodEnd(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid end date.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom12"
                              >
                                <Form.Label>Current Hours</Form.Label>
                                <Form.Control
                                  required
                                  readOnly
                                  type="text"
                                  value={workTime}
                                  onChange={(e) => setWorkTime(e.target.value)}
                                />
                              </Form.Group>
                            </Row>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={handleCloseDelete}
                            >
                              Close
                            </Button>
                            <Button variant="primary" type="submit">
                              Delete Schedule
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
          <>
            <Modal show={show} onHide={handleClose}>
              <Form noValidate validated={validated} onSubmit={handleSave}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom100">
                      <Form.Label>Select Employee</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        value={employeeId}
                        onChange={(e) => setEmpID(e.target.value)}
                      >
                        <option>Select ...</option>
                        {employees.map((employee, index) => (
                          <option
                            key={index}
                            value={employee.id}
                            onClick={(e) => handleLoadData(employee)}
                          >
                            {employee.firstName} {employee.lastName} , ID#{" "}
                            {employee.id}{" "}
                          </option>
                        ))}
                      </Form.Select>
                      <p className="text-danger">{errorSelect}</p>

                      <Form.Control.Feedback type="invalid">
                        Please select an employee.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom101">
                      <Form.Label>Employee First Name</Form.Label>
                      <Form.Control
                        readOnly
                        required
                        type="text"
                        value={firstName}
                        onChange={(e) => setEmpFName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid first name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom102">
                      <Form.Label>Employee Last Name</Form.Label>
                      <Form.Control
                        readOnly
                        required
                        type="text"
                        value={lastName}
                        onChange={(e) => setEmpLName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationCustom1103"
                    >
                      <Form.Label>Select Date Range</Form.Label>
                      <DateRangePicker
                        className="daterange"
                        onChange={(item) => {
                          setState([item.selection]);

                          setPeriodStart(
                            format(item.selection.startDate, "yyyy-MM-dd")
                          );
                          setPeriodEnd(
                            format(item.selection.endDate, "yyyy-MM-dd")
                          );
                        }}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={state}
                        direction="horizontal"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid date range.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom104">
                      <div>
                        {" "}
                        <div className="custom-dropdown">
                          <button
                            className="btn-selct"
                            type="button"
                            id="multiSelectDropdown"
                            onClick={dropDownShow}
                          >
                            Select Hours
                          </button>
                          <p className="text-danger">{errorHours}</p>
                          {isOpen && (
                            <div
                              className={`custom-dropdown-menu  
                                    ${isOpen ? "show" : ""}`}
                              aria-labelledby="multiSelectDropdown"
                            >
                              {hours.map((option) => (
                                <Form.Check
                                  className="custom-checkbox"
                                  key={option.id}
                                  type="checkbox"
                                  id={`option_${option.id}`}
                                  label={option.label}
                                  checked={select_Hours.includes(option.id)}
                                  onChange={hourChange}
                                  value={option.id}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Please provide valid hours.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>Selected Hours</Form.Label>
                      <p className="text-danger">{errorHours2}</p>
                      <div style={{ marginLeft: "20px", width: "50%" }}>
                        <ul>
                          {select_Hours.map((optionId) => (
                            <li key={optionId}>
                              {
                                hours.find((option) => option.id === optionId)
                                  ?.label
                              }
                            </li>
                          ))}
                        </ul>
                        <Button className="btn-hours" onClick={confirmHours}>
                          Confirm Hours
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Please provide valid hours.
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
          </>
        </Tab>
      </Tabs>
    </section>
  );
};

export default Schedule;
