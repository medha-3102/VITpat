import { useAuth } from '../../contexts/authContext';
import React, { useState, useEffect } from 'react';
import styles from './Planner.module.css';
import { Link } from "react-router-dom";
import { auth, firestore } from './firebase'; // Import Firebase authentication and Firestore

const Planner = () => {
    const { currentUser } = useAuth();
    const userId = currentUser.uid; // Get the current user's unique ID

    // Helper function to get the session-specific storage key
    const getStorageKey = (key) => `${userId}_${key}`;

    const calculateTime = (index) => {
        const startTime = new Date('2024-01-01T08:30:00');
        const interval = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds
        const time = new Date(startTime.getTime() + index * interval);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Initialize state variables with session-specific data
    const [hourlySchedule, setHourlySchedule] = useState(() => {
        const storedData = sessionStorage.getItem(getStorageKey('hourlySchedule'));
        return storedData ? JSON.parse(storedData) : Array(10).fill('');
    });
    const [personalTodos, setPersonalTodos] = useState(() => {
        const storedData = sessionStorage.getItem(getStorageKey('personalTodos'));
        return storedData ? JSON.parse(storedData) : [];
    });
    const [collegeTodos, setCollegeTodos] = useState(() => {
        const storedData = sessionStorage.getItem(getStorageKey('collegeTodos'));
        return storedData ? JSON.parse(storedData) : [];
    });
    const [notes, setNotes] = useState(() => {
        const storedData = sessionStorage.getItem(getStorageKey('notes'));
        return storedData ? storedData : '';
    });
    const [newPersonalTodo, setNewPersonalTodo] = useState('');
    const [newCollegeTodo, setNewCollegeTodo] = useState('');
    const [dsaChallenge, setDsaChallenge] = useState(() => {
        const storedData = sessionStorage.getItem(getStorageKey('dsaChallenge'));
        return storedData ? JSON.parse(storedData) : { solved: false, count: 0 };
    });

    useEffect(() => {
        // Store session-specific data in sessionStorage
        sessionStorage.setItem(getStorageKey('hourlySchedule'), JSON.stringify(hourlySchedule));
        sessionStorage.setItem(getStorageKey('personalTodos'), JSON.stringify(personalTodos));
        sessionStorage.setItem(getStorageKey('collegeTodos'), JSON.stringify(collegeTodos));
        sessionStorage.setItem(getStorageKey('notes'), notes);
        sessionStorage.setItem(getStorageKey('dsaChallenge'), JSON.stringify(dsaChallenge));
    }, [hourlySchedule, personalTodos, collegeTodos, notes, dsaChallenge]);

    const addPersonalTodo = () => {
        if (newPersonalTodo.trim() !== '') {
            setPersonalTodos([...personalTodos, newPersonalTodo]);
            setNewPersonalTodo('');
        }
    };

    const removePersonalTodo = (index) => {
        const updatedTodos = [...personalTodos];
        updatedTodos.splice(index, 1);
        setPersonalTodos(updatedTodos);
    };

    const addCollegeTodo = () => {
        if (newCollegeTodo.trim() !== '') {
            setCollegeTodos([...collegeTodos, newCollegeTodo]);
            setNewCollegeTodo('');
        }
    };

    const removeCollegeTodo = (index) => {
        const updatedTodos = [...collegeTodos];
        updatedTodos.splice(index, 1);
        setCollegeTodos(updatedTodos);
    };

    const handleDsaChallenge = (isChecked) => {
        setDsaChallenge({ solved: isChecked, count: isChecked ? dsaChallenge.count + 1 : dsaChallenge.count });
    };

    return (
        <div className={styles.p_container}>
            <div className='text-2xl font-bold pt-14' style={{marginLeft:'15px',fontFamily:'sans-serif'}}>Hello {currentUser.displayName? currentUser.displayName: currentUser.email}</div>

            <div className={styles.planner_container}>
                <div className={styles.left_section}>
                    <h2 style={{fontSize:'25px'}}>Schedule</h2>
                    <div className={styles.hourly_schedule}>
                        {hourlySchedule.map((item, index) => (
                            <div key={index} className={styles.hourly_item} >
                                <span>{calculateTime(index)}</span>
                                <textarea 
                                    placeholder="Enter your tasks..."
                                    value={hourlySchedule[index]}
                                    onChange={(e) => {
                                        const updatedSchedule = [...hourlySchedule];
                                        updatedSchedule[index] = e.target.value;
                                        setHourlySchedule(updatedSchedule);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.right_section}>
                    <div className='check'>
                        <h2 className={styles.blinky} style={{fontSize:'30px'}}>Challenge</h2>
                        <p className={styles.blinky} style={{marginBottom:'20px'}}>Solve a DSA question daily:</p>
                        <Link to="/dsa" className={styles.leaderboard_button} style={{fontSize:'15px'}} >
                            SOLVE
                        </Link>
                    </div>


                    <div className={styles.todo_section}>
                        <h2>Placement To-Do List</h2>
                        <ul>
                            {personalTodos.map((todo, index) => (
                                <li key={index}>
                                    {todo}
                                    <button onClick={() => removePersonalTodo(index)} className={styles.PlanB}>-</button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <input
                                type="text"
                                value={newPersonalTodo}
                                onChange={(e) => setNewPersonalTodo(e.target.value)}
                            />
                            <button onClick={addPersonalTodo} className={styles.PlanB}>+</button>
                        </div>
                    </div>

                    <div className={styles.todo_section}>
                        <h2>College To-Do List</h2>
                        <ul>
                            {collegeTodos.map((todo, index) => (
                                <li key={index}>
                                    {todo}
                                    <button onClick={() => removeCollegeTodo(index)} className={styles.PlanB}>-</button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <input
                                type="text"
                                value={newCollegeTodo}
                                onChange={(e) => setNewCollegeTodo(e.target.value)}
                            />
                            <button onClick={addCollegeTodo} className={styles.PlanB}>+</button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Notes</h2>
                        <textarea
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planner;
