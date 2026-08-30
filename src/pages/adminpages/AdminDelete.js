import React, { useState } from 'react';
import { doc, getDocs, getDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminNav from '../../components/AdminNav';
import '../../styles/Admin.css';

const COLLECTION_MAP = {
  blog: 'blogData',
  book: 'bookData',
  movie: 'movieData',
  podcast: 'podcastData',
  restaurant: 'restaurantData',
  tvshow: 'tvshowData',
};

const DELETE_TYPE_OPTIONS = [
  { value: 'none', label: 'Select an Entry Type' },
  { value: 'blog', label: 'Blog' },
  { value: 'book', label: 'Book' },
  { value: 'movie', label: 'Movie' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'tvshow', label: 'TV Show' },
];

function AdminDelete() {
  const [deleteType, setDeleteType] = useState('none');
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('none');
  const [documentDetails, setDocumentDetails] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentCollection = COLLECTION_MAP[deleteType];

  const handleTypeChange = async (event) => {
    const entryType = event.target.value;
    setDeleteType(entryType);
    setSelectedDocId('none');
    setDocumentDetails(null);
    setDocuments([]);

    const collectionName = COLLECTION_MAP[entryType];
    if (!collectionName) return;

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDocSelect = async (event) => {
    const docId = event.target.value;
    setSelectedDocId(docId);

    if (docId === 'none') {
      setDocumentDetails(null);
      return;
    }

    try {
      const docRef = doc(db, currentCollection, docId);
      const docSnap = await getDoc(docRef);
      setDocumentDetails(docSnap.exists() ? docSnap.data() : null);
    } catch (error) {
      console.error('Error fetching document details:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentCollection || selectedDocId === 'none') return;

    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, currentCollection, selectedDocId));
      // Refresh the document list for the current type.
      const querySnapshot = await getDocs(collection(db, currentCollection));
      const docs = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setDocuments(docs);
      setSelectedDocId('none');
      setDocumentDetails(null);
      window.alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-main-section">
        <h2>Delete Entries</h2>

        <label htmlFor="deleteType">Choose Entry Type:</label>
        <select id="deleteType" value={deleteType} onChange={handleTypeChange}>
          {DELETE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label htmlFor="documentList">Select Document:</label>
        <select
          id="documentList"
          value={selectedDocId}
          onChange={handleDocSelect}
          disabled={documents.length === 0}
        >
          <option value="none">Select a Document</option>
          {documents.map((docItem) => (
            <option key={docItem.id} value={docItem.id}>
              {docItem.title || docItem.name || `Document ${docItem.id}`}
            </option>
          ))}
        </select>

        {documentDetails && (
          <div id="documentDetails">
            <h3>Document Details</h3>
            <pre>{JSON.stringify(documentDetails, null, 2)}</pre>
          </div>
        )}

        <button
          id="deleteBtn"
          onClick={handleDelete}
          disabled={selectedDocId === 'none' || isDeleting}
        >
          {isDeleting ? 'Deleting…' : 'Delete Entry'}
        </button>
      </div>
    </div>
  );
}

export default AdminDelete;
