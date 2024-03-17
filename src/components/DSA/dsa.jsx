// DSAApp.js
import React, { useState, useEffect } from 'react';
import Modal from './model'; // Assuming Modal component is in the same directory
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext'; // Import useAuth hook for Firebase authentication

import './dsa.css';

function DSAApp() {
  const { currentUser } = useAuth(); // Get the current user from the authentication context
  const userId = currentUser.uid; // Get the current user's unique ID

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [month, setMonth] = useState(1); // Start from month 1
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [countMonths, setCountMonths] = useState(0);
  const [monthlyScores, setMonthlyScores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  let interval;

  // Firestore instance
  const firestore = getFirestore();

  // Function to add score to Firestore
  const addScoreToFirestore = async (name, score) => {
    try {
      const userScoresRef = collection(firestore, 'users', userId, 'scores'); // Reference to user's scores collection
      await addDoc(userScoresRef, { name: name, score: score }); // Add score document to Firestore
      console.log('Score added to Firestore');
    } catch (error) {
      console.error('Error adding score to Firestore:', error);
    }
  };

  // Function to retrieve user's score from Firestore
  const fetchUserScoreFromFirestore = async () => {
    try {
      const userScoresRef = collection(firestore, 'users', userId, 'scores'); // Reference to user's scores collection
      const scoresSnapshot = await getDocs(userScoresRef); // Get all documents in the user's scores collection
      let totalScore = 0;
      scoresSnapshot.forEach((doc) => {
        totalScore += doc.data().score; // Sum up all scores
      });
      setScore(totalScore); // Set the total score state
      console.log('User score fetched from Firestore:', totalScore);
    } catch (error) {
      console.error('Error fetching user score from Firestore:', error);
    }
  };

  useEffect(() => {
    fetchUserScoreFromFirestore(); // Fetch user's score from Firestore when component mounts
  }, []);

  // Load data from session storage
  const loadFromSessionStorage = () => {
    const storedTopics = sessionStorage.getItem(`${userId}_topics`);
    if (storedTopics) {
      setTopics(JSON.parse(storedTopics));
    }
  
    // Load other data similarly...
    const storedQuestionCount = sessionStorage.getItem(`${userId}_questionCount`);
    if (storedQuestionCount) {
      setQuestionCount(parseInt(storedQuestionCount));
    }
  
    const storedScore = sessionStorage.getItem(`${userId}_score`);
    if (storedScore) {
      setScore(parseInt(storedScore));
    }
  
    const storedCountMonths = sessionStorage.getItem(`${userId}_countMonths`);
    if (storedCountMonths) {
      setCountMonths(parseInt(storedCountMonths));
    }
  
    const storedMonthlyScores = sessionStorage.getItem(`${userId}_monthlyScores`);
    if (storedMonthlyScores) {
      setMonthlyScores(JSON.parse(storedMonthlyScores));
    }
  };
  

  useEffect(() => {
    loadFromSessionStorage();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(`${userId}_topics`, JSON.stringify(topics));
    sessionStorage.setItem(`${userId}_questionCount`, questionCount);
    sessionStorage.setItem(`${userId}_score`, score);
    sessionStorage.setItem(`${userId}_countMonths`, countMonths);
    sessionStorage.setItem(`${userId}_monthlyScores`, JSON.stringify(monthlyScores));
  }, [userId, topics, questionCount, score, countMonths, monthlyScores]);

  // Add topic function
  const addTopic = () => {
    if (newTopic.trim() !== '' && newCategory.trim() !== '') {
      const newQuestion = {
        statement: newTopic,
        category: newCategory,
        completed: false
      };
      setTopics([...topics, newQuestion]);
      setNewTopic('');
      setNewCategory('');
      setQuestionCount(questionCount + 1);
      let points = 0;
      switch (newCategory.toLowerCase()) {
        case 'easy':
          points = 1;
          break;
        case 'medium':
          points = 2;
          break;
        case 'hard':
          points = 3;
          break;
        default:
          break;
      }
      setScore(score + points);
    }
    // Store data in session storage...
    const storedScores = sessionStorage.getItem('scores');
    if (storedScores) {
      const scores = JSON.parse(storedScores);
      scores.push({ name: currentUser.displayName || currentUser.email, score: score });
      sessionStorage.setItem('scores', JSON.stringify(scores));
    } else {
      const scores = [{ name: currentUser.displayName || currentUser.email, score: score }];
      sessionStorage.setItem('scores', JSON.stringify(scores));
    }
    // Add score to Firestore
    addScoreToFirestore(currentUser.displayName || currentUser.email, score);
  };

  // Delete topic function...
  const deleteTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
    setQuestionCount(questionCount - 1);
  };

  // Toggle completion function...
  const toggleCompletion = (index) => {
    const updatedTopics = [...topics];
    updatedTopics[index].completed = !updatedTopics[index].completed;
    setTopics(updatedTopics);
  };

  // Generate leaderboard function...
  const generateLeaderboard = () => {
    const sortedScores = [...monthlyScores].sort((a, b) => b - a);
    const topStudents = sortedScores.slice(0, 10);
    console.log('Monthly Leaderboard:', topStudents);
  };

  useEffect(() => {
    if (countMonths === 4) {
      generateLeaderboard();
      addScoreToFirestore('Student Name', score); // Change 'Student Name' to the actual user's name
    }
  }, [countMonths]);

  useEffect(() => {
    sessionStorage.setItem('topics', JSON.stringify(topics));
    sessionStorage.setItem('questionCount', questionCount);
    sessionStorage.setItem('score', score);
    sessionStorage.setItem('countMonths', countMonths);
    sessionStorage.setItem('monthlyScores', JSON.stringify(monthlyScores));
  }, [topics, questionCount, score, countMonths, monthlyScores]);

  useEffect(() => {
    interval = setInterval(() => {
      setDaysElapsed((prevDays) => prevDays + 1);
    }, 1000*3*5);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (questionCount < 30 && daysElapsed === 30) {
      setMonthlyScores([...monthlyScores, score]);
      setScore(0);

      if (countMonths === 4) {
        clearInterval(interval);
        generateLeaderboard();
      } else {
        switch (countMonths) {
          case 1:
            if (score < 30) setModalMessage('Work Hard');
            break;
          case 2:
            if (score < 30) setModalMessage('Out of super dream');
            break;
          case 3:
            if (score < 30) setModalMessage('Out of dream');
            break;
          case 4:
            if (score < 30) setModalMessage('Not placed');
            break;
          default:
            setModalMessage('Well Done!');
            break;
        }
        setShowModal(true);
        setCountMonths((prevCount) => prevCount + 1);
        setDaysElapsed(0);
      }
    }
  }, [questionCount, countMonths, daysElapsed, score, monthlyScores]);

  return (
    <div className="contain">
      <h1>4 months DSA Challenge!!</h1>
      <p>Total Score: {score}</p>
      <input
        type="text"
        value={newTopic}
        onChange={(e) => setNewTopic(e.target.value)}
        placeholder="Enter new DSA question"
      />
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Enter category (easy, medium, hard)"
      />
      <button onClick={addTopic}>Add</button>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            <span style={{ textDecoration: topic.completed ? 'line-through' : 'none' }}>
              {topic.statement} ({topic.category})
            </span>
            <button onClick={() => toggleCompletion(index)}>
              {topic.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTopic(index)}>Delete</button>
          </li>
        ))}
      </ul>
      {countMonths < 4 && <p>Month: {countMonths + 1}</p>}
      {showModal && <Modal onClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
}

export default DSAApp;
