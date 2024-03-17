import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import styles from './Planner.module.css';

import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    const location = useLocation()

    // Check if the current path is '/leader'
    const isLeaderboardPage = location.pathname === '/leader'

    // Conditionally render the Header component
    if (isLeaderboardPage) {
        return (
            <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
                {
                    userLoggedIn
                        ?
                        <>
                            <div className={styles.top_strip}>
                                <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className={styles.leaderboard_button}>Logout</button>
    
    
                            </div>
                        </>
                        :
                        <>
                            <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                            <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                        </>
                }
    
            </nav>
        ) // Return null to hide the Header component
    }

    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                userLoggedIn
                    ?
                    <>
                        <div className={styles.top_strip}  style={{color:' #250092d6'}}>
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className={styles.leaderboard_button}>Logout</button>


                            <Link to="/leader" className={styles.leaderboard_button}>
                                Leaderboard
                            </Link>
                        </div>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header
