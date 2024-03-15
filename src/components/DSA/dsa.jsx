// DSAApp.js
import React, { useState, useEffect } from 'react';
import Modal from './model';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import './dsa.css';

function DSAApp() {
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

  // Function to load stored data from session storage
  const addScoreToFirestore = async (name, score) => {
    try {
      const firestore = getFirestore();
      const userRef = collection(firestore, 'students');
      await addDoc(userRef, {
        name: name,
        score: score
      });
      console.log('Score added to Firestore');
    } catch (error) {
      console.error('Error adding score to Firestore:', error);
    }
  };

  useEffect(() => {
    if (countMonths === 4) {
      generateLeaderboard();
      addScoreToFirestore('Student Name', score); // Change 'Student Name' to the actual user's name
    }
  }, [countMonths]);
  const loadFromSessionStorage = () => {
    const storedTopics = sessionStorage.getItem('topics');
    if (storedTopics) {
      setTopics(JSON.parse(storedTopics));
    }
    const storedQuestionCount = sessionStorage.getItem('questionCount');
    if (storedQuestionCount) {
      setQuestionCount(parseInt(storedQuestionCount));
    }
    const storedScore = sessionStorage.getItem('score');
    if (storedScore) {
      setScore(parseInt(storedScore));
    }
    const storedCountMonths = sessionStorage.getItem('countMonths');
    if (storedCountMonths) {
      setCountMonths(parseInt(storedCountMonths));
    }
    const storedMonthlyScores = sessionStorage.getItem('monthlyScores');
    if (storedMonthlyScores) {
      setMonthlyScores(JSON.parse(storedMonthlyScores));
    }
  };

  useEffect(() => {
    loadFromSessionStorage();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('topics', JSON.stringify(topics));
    sessionStorage.setItem('questionCount', questionCount);
    sessionStorage.setItem('score', score);
    sessionStorage.setItem('countMonths', countMonths);
    sessionStorage.setItem('monthlyScores', JSON.stringify(monthlyScores));
  }, [topics, questionCount, score, countMonths, monthlyScores]);

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
    const storedScores = sessionStorage.getItem('scores');
    if (storedScores) {
      const scores = JSON.parse(storedScores);
      scores.push({ name: 'Student Name', score: score });
      sessionStorage.setItem('scores', JSON.stringify(scores));
    } else {
      const scores = [{ name: 'Student Name', score: score }];
      sessionStorage.setItem('scores', JSON.stringify(scores));
    }
  };

  const deleteTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
    setQuestionCount(questionCount - 1);
  };

  const toggleCompletion = (index) => {
    const updatedTopics = [...topics];
    updatedTopics[index].completed = !updatedTopics[index].completed;
    setTopics(updatedTopics);
  };

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

  useEffect(() => {
    interval = setInterval(() => {
      setDaysElapsed((prevDays) => prevDays + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateLeaderboard = () => {
    const sortedScores = [...monthlyScores].sort((a, b) => b - a);
    const topStudents = sortedScores.slice(0, 10);
    console.log('Monthly Leaderboard:', topStudents);
  };

  return (
    <div className="contain">
      <h1>4 months DSA Challenge!!</h1>
      
      <p>Total Score: {score}</p>
      <input className='in'
        type="text"
        value={newTopic}
        onChange={(e) => setNewTopic(e.target.value)}
        placeholder="Enter new DSA question"
      />
      <input className='in'
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Enter category (easy, medium, hard)"
      />
      <button className ='bu' onClick={addTopic}>Add</button>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            <span style={{ textDecoration: topic.completed ? 'line-through' : 'none' }}>
              {topic.statement} ({topic.category})
            </span>
            <button className="bu" onClick={() => toggleCompletion(index)}>
              {topic.completed ? 'Undo' : 'Complete'}
            </button>
            <button className='bu' onClick={() => deleteTopic(index)}>Delete</button>
          </li>
        ))}
      </ul>
      {countMonths < 4 && <p>Month: {countMonths + 1}</p>}
      {showModal && <Modal onClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
}

export default DSAApp;


