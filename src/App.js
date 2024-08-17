import Login from "./components/pages/Login";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Schedule from "./pages/Schedule";
import Appointment from "./pages/Appointment";
import Patient from "./pages/Patient";
import Employee from "./pages/Employee";

import Dashboard from "./pages/users/Dashboard";
import Register from "./components/pages/Register";
import Missing from "./components/pages/Missing";
import RequireAuth from "./components/auth/RequireAuth";
import Unathorized from "./components/pages/Unathorized";
import PersistLogin from "./components/pages/PersistLogin";
import PatientLayout from "./components/layout/PatientLayout";
import Logout from "./components/pages/Logout";

const ROLES = {
  User: "USER",
  Dentist: "DENTIST",
  Admin: "ADMIN",
  Hygienist: "HYGIENIST",
};

const publicRoutes = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "unathorized",
    element: <Unathorized />,
  },

  //catch all other pages
  {
    path: "*",
    element: <Missing />,
  },
];

const userRoutes = [
  {
    path: "/user",
    element: <PatientLayout />,

    children: [
      {
        element: <PersistLogin />,
        children: [
          {
            //user routes
            path: "/user/dash",
            element: <RequireAuth allowedRoles={[ROLES.User]} />,

            children: [
              {
                path: "/user/dash",
                element: <Dashboard />,
              },
              {
                path: "/user/dash/logout",
                element: <Logout />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const protectedRoutes = [
  //main layout for pages
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        element: <PersistLogin />,

        children: [
          {
            // Admin + Hygienist protected routes
            element: (
              <RequireAuth
                allowedRoles={[ROLES.Admin, ROLES.Hygienist, ROLES.Dentist]}
              />
            ),
            children: [
              {
                //path: "/",
                index: true,
                element: <Home />,
              },
              {
                path: "patient",
                element: <Patient />,
              },
              {
                path: "appointment",
                element: <Appointment />,
              },
              {
                path: "logout",
                element: <Logout />,
              },
            ],
          },

          {
            // Dentist protected routes
            element: <RequireAuth allowedRoles={[ROLES.Dentist]} />,

            children: [
              {
                path: "schedule",
                element: <Schedule />,
              },

              {
                path: "employee",
                element: <Employee />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  ...userRoutes,
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
