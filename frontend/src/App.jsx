import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <>
    
    <Routes>
      <Route element= {<Layout/>}/>
        <Route path="/" element= {<Dashboard/>}/>
    </Routes>
    
    </>
  )
}

export default App