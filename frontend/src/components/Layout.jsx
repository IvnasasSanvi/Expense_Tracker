import React from 'react'
import { styles } from '../assets/dummyStyles'
import Navbar from './Navbar'

const Layout = ({onLayout, user}) => {
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLayout={onLayout} />
    </div>
  )
}

export default Layout