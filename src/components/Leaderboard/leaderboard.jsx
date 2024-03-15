import React, { useEffect, useState } from 'react';
import { getDocs, collection, getFirestore } from 'firebase/firestore';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const firestore = getFirestore();
        const colRef = collection(firestore, 'lb');
        const snapshot = await getDocs(colRef);
        const students = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort students by score in descending order
        const sortedStudents = students.sort((a, b) => b.score - a.score);
        setLeaderboard(sortedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ marginTop: "70px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px",fontWeight:"bold",fontSize:"30px"} }>Leaderboard</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ margin: "auto", width: "100%" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f0f0f0" : "transparent" }}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
