import React, { useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import img1 from '../assets/logo.png'
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = ({user: propUser, onLogout}) => {
    const navigate = useNavigate();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = propUser || {
        name: "",
        email: "",
    };

    // to fetch the user data from server
    useEffect(()=> {
        const fetchUserData = async () =>{
            try {
                const token = localStorage.getItem("token");
                if(!token) return;

                const response = await axios.get
            } 
            
            catch (error) {
                
            }
        }
    })

    const toggleMenu = () => setMenuOpen((prev) => !prev)

  return (
    <header className={navbarStyles.header}>
        <div className={navbarStyles.container}>
            <div onClick={() => navigate("/")} className={navbarStyles.logoContainer}>
                <div className={navbarStyles.logoImage}>
                    <img src={img1} alt="logo"/>
                </div>
                <span className= {navbarStyles.logoText}>FinFlow</span>
            </div>

            {/* if the user is present */}
            {user &&(
                <div className={navbarStyles.userContainer} ref={menuRef} >
                    <button onClick={toggleMenu} className={navbarStyles.userButton}>
                        <div className="relative">
                            <div className={navbarStyles.userAvatar}>
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className= {navbarStyles.statusIndicator}></div>
                        </div>
                        <div className= {navbarStyles.userTextContainer}>
                            <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                            <p className={navbarStyles.userEmail}>
                                {user?.email || "user@finflow.com"}
                            </p>
                        </div>
                        <ChevronDown className={navbarStyles.chevronIcon(menuOpen)}></ChevronDown>

                    </button>
                    {/* dropdown menu */}
                    {menuOpen && (
                        <div className={navbarStyles.dropdownMenu}>
                            <div className={navbarStyles.dropdownHeader}>
                                <div className= "flex items-centre gap-3">
                                    <div className={navbarStyles.dropdownAvatar}>
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <div className={navbarStyles.dropdownName}>
                                            {user?.name || "User"}
                                        </div>
                                        <div className={navbarStyles.dropdownEmail}>
                                            {user?.email || "user@finflow.com"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={navbarStyles.menuItemContainer}>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/profile");
                                    }} className= {navbarStyles.menuItem}
                                > 
                                    <User className=" w-4 h-4"></User>
                                    <span>My Profile</span>
                                </button>
                            </div>

                            <div className={navbarStyles.menuItemBorder}>
                                <button
                                    onClick={handleLogout}
                                    className={navbarStyles.logoutButton}
                                >
                                    <LogOut className=" w-4 h-4"/>
                                    <span>Log Out</span>
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    </header>
  )
}

export default Navbar