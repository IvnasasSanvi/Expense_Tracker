import React, { useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin , API_URL = import.meta.env.VITE_BACK_URL}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //to fetch profile
  const fetchProfile = async (token) => {
    if(!token) return null;
    const res =await axios.get(`$(API_URL)/user/me`,{

    })
  }
    return (
    <div className={loginStyles.pageContainer}>
        <div className={loginStyles.cardContainer}>
            <div className={loginStyles.header}>
                <div className={loginStyles.avatar}>
                    <User className=" w-10 h-10 text-white"/>
                </div>
                <h1 className={loginStyles.headerTitle}>Welcome Back</h1>
                <p className={loginStyles.headerSubtitle}>
                    Sign in to your FinFlow account
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login