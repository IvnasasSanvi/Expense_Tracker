import React from 'react'
import { styles } from '../assets/dummyStyles'
import Navbar from './Navbar'
import { Sidebar } from './Sidebar'

const Layout = ({onLayout, user}) => {
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLayout={onLayout} />
      <Sidebar/>
    </div>
  )
}

export default Layout