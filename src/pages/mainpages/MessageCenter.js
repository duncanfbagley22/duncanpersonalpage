import React, { useState } from 'react';
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebase.js'; // Import your Firebase app configuration
import '../../styles/MessageCenter.css';

const MessageCenter = () => {
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot state

  const db = getFirestore(app); // Initialize Firestore

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for empty fields and email format
    if (!senderName || !email || !title || !message) {
      setErrorMessage("All fields must be filled out.");
      return;
    }

    // Validate email format using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Check honeypot field (should be empty)
    if (honeypot) {
      setErrorMessage("Bot detection activated. Please try again.");
      return;
    }

    // Check if the same email sent a message in the last 3 minutes
    const threeMinutesAgo = Timestamp.now().toMillis() - 3 * 60 * 1000;
    const messagesQuery = query(
      collection(db, 'messages'),
      where('email', '==', email),
      where('date', '>=', Timestamp.fromMillis(threeMinutesAgo))
    );

    const querySnapshot = await getDocs(messagesQuery);
    if (!querySnapshot.empty) {
      setErrorMessage("Please wait before sending another message.");
      return;
    }

    try {
      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        name: senderName,
        email: email, // Include email in the message document
        title: title,
        message: message,
        date: Timestamp.now() // Automatically set the timestamp
      });

      // Show success alert
      alert("Message sent successfully!");

      // Reset form fields
      setSenderName('');
      setEmail('');
      setTitle('');
      setMessage('');
      setErrorMessage('');
      setHoneypot(''); // Reset honeypot field
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMessage("Failed to send the message. Please try again.");
    }
  };

  return (
    <div className="message-center">
      <h1>Message Center</h1>
      <h3>Send Duncan a message using the form below!</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

      <form onSubmit={handleSubmit}>
        {/* Name Section */}
        <div className="form-group">
          <label htmlFor="senderName">Name</label>
          <input
            type="text"
            id="senderName"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Section */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Title Section */}
        <div className="form-group">
          <label htmlFor="title">Message Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your message"
            required
          />
        </div>

        {/* Message Body Section */}
        <div className="form-group">
          <label htmlFor="message">Message Body</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here"
            required
          />
        </div>

        {/* Honeypot Field (hidden) */}
        <input
          type="text"
          style={{ display: 'none' }} // Hide the honeypot field
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          placeholder="If you are a human, leave this field blank"
        />

        {/* Submit Button */}
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default MessageCenter;
