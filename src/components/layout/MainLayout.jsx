import React from 'react'
import { Outlet } from 'react-router'
import Navbars from './Navbars'

const MainLayout = () => {
  return (
    <div>
        <Navbars />
        <main>
        <Outlet />
        </main>
    </div>
  )
}

export default MainLayout
