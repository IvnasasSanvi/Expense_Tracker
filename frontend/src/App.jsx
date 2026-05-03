import React, {useState, useEffect} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'

const API_URL = "http://localhost:4000"

const App = () => {

  const [user, setUser]= useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Restore auth state from storage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error restoring auth state:", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  //to save the token
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };


  const clearAuth= () =>{
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");  
    } 
    catch (err) {
      console.error("clearAuth error : ", err);
    }
    setUser(null);
    setToken(null);

  };

  const handleLogin =(userData, remember = false, tokenFromApi =null) =>{
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  }

  const handleSignup = (userData, remember = false, tokenFromApi =null) =>{
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isInitialized) {
      return <div>Loading...</div>;
    }
    if (!token) {
      navigate("/login");
      return null;
    }
    return children;
  };

  return (
    <>
    
    <Routes>

      <Route path= "/login" element={<Login onLogin ={handleLogin} />} />

      <Route path="/signup" element={<Signup onSignup={handleSignup}/>}/>

      <Route element= {<ProtectedRoute><Layout user={user} onLayout={handleLogout}/></ProtectedRoute>}>
        <Route path="/" element= {<Dashboard/>}/>
      </Route>
    </Routes>
    
    </>
  )
}

export default App