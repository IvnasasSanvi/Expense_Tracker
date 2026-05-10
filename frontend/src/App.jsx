// import React, {useState, useEffect, Children} from 'react'
// import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import axios from 'axios'

// const API_URL = "http://localhost:4000"

// //to get transaction from localstorage
// const getTransactionsFromStorage = () => {
//   const saved = localStorage.getItem("transactions");
//   return saved ? JSON.parse(saved) : [];
// };

// // to protect the routes
// const ProtectedRoute = ({ user, Children }) => {
//   const localToken = localStorage.getItem("token");
//   const sessionToken = sessionStorage.getItem("token");
//   const hasToken = localToken || sessionToken;

//   if (!user || !hasToken){
//     return <Navigate to="/login" replace />;
//   }

//   return Children;
// }

// //to scroll to top when page gets reload or new page is visited
// const ScrollToTop = () => {
//   const location = useLocation();
//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "auto" });
//   }, [location.pathname]);

//   return null;
// }

// const App = () => {

//   const [user, setUser]= useState(null);
//   const [token, setToken] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const navigate = useNavigate();

//   // Restore auth state from storage on mount
//   useEffect(() => {
//     try {
//       const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
//       const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      
//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (err) {
//       console.error("Error restoring auth state:", err);
//     } finally {
//       setIsInitialized(true);
//     }
//   }, []);

//   //to save the token
//   const persistAuth = (userObj, tokenStr, remember = false) => {
//     try {
//       if (remember) {
//         if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
//         if (tokenStr) localStorage.setItem("token", tokenStr);
//         sessionStorage.removeItem("user");
//         sessionStorage.removeItem("token");
//       } else {
//         if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
//         if (tokenStr) sessionStorage.setItem("token", tokenStr);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//       }
//       setUser(userObj || null);
//       setToken(tokenStr || null);
//     } catch (err) {
//       console.error("persistAuth error:", err);
//     }
//   };


//   const clearAuth= () =>{
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       sessionStorage.removeItem("token");  
//     } 
//     catch (err) {
//       console.error("clearAuth error : ", err);
//     }
//     setUser(null);
//     setToken(null);

//   };

//   //to update user data both in state and storage
//   const updateUserData = (updatedUser) => {
//     setUser(updatedUser);

//     const localToken = localStorage.getItem("token");
//     const sessionToken = sessionStorage.getItem("token");

//     if(localToken){
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//     } else if(sessionToken){
//       sessionToken.setItem("user", JSON.stringify(updatedUser));
//     }
//   };

//   //try to load user with token when mounted
//   useEffect(() => {
//     (async () => {
//       try {
//         const localUserRaw = localStorage.getItem("user");
//         const sessionUserRaw = sessionStorage.getItem("user");
//         const localToken = localStorage.getItem("token");
//         const sessionToken = localStorage.getItem("token");

//         const storedToken = localUserRaw ? JSON.parse(localUserRaw) : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;

//         const storedToken = localToken || sessionToken || null;
//         const tokenFromLocal = !!localToken;

//         if(storedUser) {
//           setUser(storedUser);
//           setToken(storedToken);
//           setIsLoading(false);
//           return;
//         }

//         if(storedToken){
//           try {
//             const res = await axios.get(`${API_URL}/api/user/me`, {
//               headers: {Authorization: `Bearer ${storedToken}`}
//             });
//             const profile = res.data;
//             persistAuth(profile, storedToken, tokenFromLocal);
//           } 
//           catch (fetchErr) {
//             console.warn("Could not fetch profile with the stored token", 
//               fetchErr
//             );
//             clearAuth();
//           }
//         }
//       } 
//       catch (err) {
//         console.error("error bootstrapping auth: ", err);
//       } finally {
//         setIsLoading(false);
//         try {
//           setTransactions(getTransactionsFromStorage());
//         } catch (txErr) {
//           console.error("Error loading transactions: ", txErr);
//         }
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem("transactions", JSON.stringify(transactions));
//     } catch (err) {
//       console.error("error saving transactions: ", err);
//     }
//   }, [transactions]);

//   const handleLogin =(userData, remember = false, tokenFromApi =null) =>{
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
//   }

//   const handleSignup = (userData, remember = false, tokenFromApi =null) =>{
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
//   }

//   const handleLogout = () => {
//     clearAuth();
//     navigate("/login");
//   };

//   // Protected route component
//   // const ProtectedRoute = ({ children }) => {
//   //   if (!isInitialized) {
//   //     return <div>Loading...</div>;
//   //   }
//   //   if (!token) {
//   //     navigate("/login");
//   //     return null;
//   //   }
//   //   return children;
//   // };

//   // transaction helpers
//   const addTransaction = (newTransaction) =>
//     setTransactions((p) => [newTransaction, ...p]);
//   const editTransaction = (id, updatedTransaction) =>
//     setTransactions((p) =>
//       p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
//     );
//   const deleteTransaction = (id) =>
//     setTransactions((p) => p.filter((t) => t.id !== id));
//   const refreshTransactions = () =>
//     setTransactions(getTransactionsFromStorage());


//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
    
//     <ScrollToTop/>

//     <Routes>

//       <Route path= "/login" element={<Login onLogin ={handleLogin} />} />

//       <Route path="/signup" element={<Signup onSignup={handleSignup}/>}/>

//       <Route 
//         element= {
//         <ProtectedRoute>
//           <Layout user={user} 
//           onLayout={handleLogout}
//           transactions={transactions}
//           addTransaction={addTransaction} 
//           editTransaction= {editTransaction}
//           deleteTransaction= {deleteTransaction}
//           refreshTransactions= {refreshTransactions}
//           />
//         </ProtectedRoute>}
//         >

//         <Route 
//           path="/" 
//           element= {<Dashboard/>} 
//           transactions={transactions}
//           addTransaction={addTransaction} 
//           editTransaction= {editTransaction}
//           deleteTransaction= {deleteTransaction}
//           refreshTransactions= {refreshTransactions}
//         />
//       </Route>
//     </Routes>
    
//     </>
//   )
// }

// export default App







import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import Income from "./pages/Income";


const API_URL = import.meta.env.VITE_BACK_URL;

// Get transactions from localStorage
const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

// Protected Route
const ProtectedRoute = ({ user, children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

//  Scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  //  Restore auth from storage
  useEffect(() => {
    try {
      const localUser = localStorage.getItem("user");
      const sessionUser = sessionStorage.getItem("user");

      const localToken = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("token");

      const storedUser = localUser
        ? JSON.parse(localUser)
        : sessionUser
        ? JSON.parse(sessionUser)
        : null;

      const storedToken = localToken || sessionToken;

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Error restoring auth:", err);
    } finally {
      setIsLoading(false);
      setTransactions(getTransactionsFromStorage());
    }
  }, []);

  //  Persist transactions
  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (err) {
      console.error("Error saving transactions:", err);
    }
  }, [transactions]);

  // Save auth
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("token", tokenStr);
        sessionStorage.clear();
      } else {
        sessionStorage.setItem("user", JSON.stringify(userObj));
        sessionStorage.setItem("token", tokenStr);
        localStorage.clear();
      }

      setUser(userObj);
      setToken(tokenStr);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  //  Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  //  Login handler
  const handleLogin = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  //  Signup handler
  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  // Transaction helpers
  const addTransaction = (newTransaction) =>
    setTransactions((prev) => [newTransaction, ...prev]);

  const editTransaction = (id, updatedTransaction) =>
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );

  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());

  //  Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute user={user}>
              <Layout
                user={user}
                onLogout={handleLogout}
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <Dashboard
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />

          <Route
            path="/income"
            element={
              <Income
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;