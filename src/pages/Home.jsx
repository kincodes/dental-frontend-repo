import React, {  useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const Home = () => {

  const axiosPrivate = useAxiosPrivate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const filterCountActive = (patients) => {
    return patients.filter(
      (row) => row.status.toLowerCase() === "ACTIVE".toLowerCase()
    ).length;
  };

  const filterCountInactive = (patients) => {
    return patients.filter(
      (row) => row.status.toLowerCase() === "INACTIVE".toLowerCase()
    ).length;
  };

  const filterCountActiveApp = (appointments) => {
    return appointments.filter(
      (row) => row.status.toLowerCase() === "BOOKED".toLowerCase()
    ).length;
  };

  const filterCountInactiveApp = (appointments) => {
    return appointments.filter(
      (row) => row.status.toLowerCase() === "CANCELLED".toLowerCase()
    ).length;
  };

  const filterCountCompletedApp = (appointments) => {
    return appointments.filter(
      (row) => row.status.toLowerCase() === "COMPLETED".toLowerCase()
    ).length;
  };

  ///

  const filterCountCleaning = (appointments) => {
    return appointments.filter(
      (row) => row.reason.toLowerCase() === "Cleaning".toLowerCase()
    ).length;
  };

  const filterCountToothache = (appointments) => {
    return appointments.filter(
      (row) => row.reason.toLowerCase() === "Toothache".toLowerCase()
    ).length;
  };

  const filterCountFillings = (appointments) => {
    return appointments.filter(
      (row) => row.reason.toLowerCase() === "Filling".toLowerCase()
    ).length;
  };

  const filterCountCavities = (appointments) => {
    return appointments.filter(
      (row) => row.reason.toLowerCase() === "Cavities".toLowerCase()
    ).length;
  };

  const active = filterCountActive(patients);
  const inactive = filterCountInactive(patients);

  const cleaning = filterCountCleaning(appointments);
  const toothache = filterCountToothache(appointments);
  const fillings = filterCountFillings(appointments);
  const cavities = filterCountCavities(appointments);

  const activeAppointments = filterCountActiveApp(appointments);
  const completeAppointments = filterCountCompletedApp(appointments);
  const inactiveAppointments = filterCountInactiveApp(appointments);

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, []);

  const [chartDataProcedure, setChartDataProcedure] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderRadius: 0,
      },
    ],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderRadius: 0,
      },
    ],
  });

  const [chartDataApp, setChartDataApp] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderRadius: 0,
      },
    ],
  });

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
        console.error(err);
      }
    };
    getAppointments();
  }, []);

  //Load data for charts

  useEffect(() => {
    const getProcedues = async () => {
      try {
        const labels = ["Cleaning", "ToothAche", "Fillings", "Cavities"];
        const data = [cleaning, toothache, fillings, cavities];
        const backgroundColor = [
          "rgba(43, 63, 229, 0.8)",
          "rgba(55, 215, 82, 0.8)",
          "rgba(253, 135, 135, 0.8)",
          "rgba(250, 192, 19, 0.8)",
        ];
        const borderRadius = 5;

        setChartDataProcedure({
          labels,
          datasets: [
            {
              label: "Count",
              data,
              backgroundColor,
              borderRadius,
            },
          ],
        });
      } catch (err) {
        setErrMsg("loading chart data failed");
      }
    };
    getProcedues();
  }, [cleaning, toothache, fillings, cavities]);

  useEffect(() => {
    const getPatients = async () => {
      try {
        const labels = ["Active", "Inactive"];
        const data = [active, inactive];
        const backgroundColor = [
          "rgba(43, 63, 229, 0.8)",
          "rgba(253, 135, 135, 0.8)",
          "rgba(253, 135, 135, 0.8)",
        ];
        const borderRadius = 5;

        setChartData({
          labels,
          datasets: [
            {
              label: "Count",
              data,
              backgroundColor,
              borderRadius,
            },
          ],
        });
      } catch (err) {
        setErrMsg("loading chart data failed");
      }
    };
    getPatients();
  }, [active, inactive]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const labels = ["Active", "Completed", "Cancelled"];
        const data = [
          activeAppointments,
          completeAppointments,
          inactiveAppointments,
        ];
        const backgroundColor = [
          "rgba(43, 63, 229, 0.8)",
          "rgba(250, 192, 19, 0.8)",
          "rgba(253, 135, 135, 0.8)",
        ];
        const borderRadius = 5;

        setChartDataApp({
          labels,
          datasets: [
            {
              label: "Count",
              data,
              backgroundColor,
              borderRadius,
            },
          ],
        });
      } catch (err) {
        setErrMsg("loading chart data failed");
      }
    };
    getAppointments();
  }, [activeAppointments, completeAppointments, inactiveAppointments]);

  return (
    <div className="app-dash">
      <div className="dataCard procedureCard">
        <Bar
          data={chartDataProcedure}
          options={{
            indexAxis: "y",
            plugins: {
              title: {
                text: "Appointment-Procedures",
              },
            },
          }}
        />
      </div>

      <div className="dataCard appointmentCard">
        <Doughnut
          data={chartDataApp}
          options={{
            plugins: {
              title: {
                text: "Appointment Status",
              },
            },
          }}
        />
      </div>

      <div className="dataCard patientCard">
        <Bar
          data={chartData}
          options={{
            plugins: {
              title: {
                text: "Patient Status",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Home;
