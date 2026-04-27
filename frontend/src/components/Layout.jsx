import React, { useState } from 'react'
import { styles } from '../assets/dummyStyles'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({onLayout, user}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLayout={onLayout} />
      <Sidebar user={user} isCollapsed = {sidebarCollapsed} setIsCollapsed = {setSidebarCollapsed} /> 
    </div>
  )
}

export default Layout