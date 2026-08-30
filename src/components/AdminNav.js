import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// Shared header for the admin section: nav tabs + Google sign-in state.
// NOTE: sign-in only proves *who* someone is, not that they're allowed to
// write/delete data. Until an auth-check/allowlist is added, access control
// still relies on Firestore security rules (and the URL not being public).
function AdminNav() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-nav">
      <ul>
        <li>
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Add</Link>
        </li>
        <li>
          <Link to="/admin/delete" className={isActive('/admin/delete') ? 'active' : ''}>Delete</Link>
        </li>
        <li>
          <Link to="/admin/messages" className={isActive('/admin/messages') ? 'active' : ''}>Messages</Link>
        </li>
      </ul>
      <div className="admin-nav-right">
        {user ? (
          <>
            <span className="admin-user-display">Signed in as: {user.displayName}</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={handleSignIn}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

export default AdminNav;
