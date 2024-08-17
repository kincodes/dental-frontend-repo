import React from 'react'
import { Outlet } from 'react-router'
import NavbarPatient from './NavbarPatient'

const PatientLayout = () => {
  return (
    <div>
        <NavbarPatient />
        <main>
        <Outlet />
        </main>
    </div>
  )
}

export default PatientLayout
