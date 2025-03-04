import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Sidebar from '../../components/Sidebar.js';
import BlogEntry from '../../components/BlogEntry.js';
import '../../styles/Blog.css';
import { app } from '../../firebase.js'; // Ensure your Firebase app is correctly imported

const Blog = () => {
  const [blogEntries, setBlogEntries] = useState([]); // State to store blog data from Firestore
  const [selectedEntry, setSelectedEntry] = useState(null); // State for selected blog entry

  const db = getFirestore(app); // Initialize Firestore with your Firebase app

  // Fetch blog entries from Firestore
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogCollection = collection(db, 'blogData'); // Firestore collection name
        const blogSnapshot = await getDocs(blogCollection); // Fetch documents
        const blogList = blogSnapshot.docs.map(doc => doc.data()); // Map each doc to its data

        setBlogEntries(blogList); // Set the state with the fetched blog entries
        if (blogList.length > 0) {
          setSelectedEntry(blogList[0]); // Set the first blog entry as the default selected entry
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogData();
  }, [db]); // Dependency array ensures the effect runs when db is available

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry); // Update the selected blog entry
  };

  return (
    <div className="blog-container">
      <Sidebar entries={blogEntries} onSelectEntry={handleEntrySelect} />
      <div className="blog-main">
        {selectedEntry ? (
          <BlogEntry entry={selectedEntry} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
