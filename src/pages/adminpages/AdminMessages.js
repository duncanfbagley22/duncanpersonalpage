import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminNav from '../../components/AdminNav';
import '../../styles/Admin.css';

function formatTimestamp(timestamp) {
  if (!timestamp || !timestamp.seconds) return 'No Date';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'messages'));
        const fetched = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setMessages(fetched);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-main-section">
        <h2>View Messages</h2>

        {loading && <p>Loading messages…</p>}
        {!loading && messages.length === 0 && <p>No messages yet.</p>}

        <ul id="messagesList">
          {messages.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.name} ({msg.email})</strong> - {formatTimestamp(msg.date)}
              <br />
              <em>{msg.title}</em>
              <br />
              {msg.message}
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminMessages;
