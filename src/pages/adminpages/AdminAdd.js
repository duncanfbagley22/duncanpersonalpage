import React, { useState } from 'react';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminNav from '../../components/AdminNav';
import '../../styles/Admin.css';

const CONTENT_TYPE_OPTIONS = [
  { value: 'none', label: 'Select a Data Type' },
  { value: 'book', label: 'Book' },
  { value: 'tvshow', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'restaurant', label: 'Restaurant' },
];

const STREAMING_OPTIONS = [
  'Disney+', 'Hulu', 'Netflix', 'Paramount+', 'Max', 'Amazon Prime', 'Peacock', 'Apple TV+',
];

const BLOG_ICON_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'fa-brands fa-spotify', label: 'Spotify' },
  { value: 'fa-solid fa-file', label: 'Article' },
  { value: 'fa-brands fa-youtube', label: 'Youtube' },
];

const emptyBlogForm = {
  title: '', date: '', tags: '', content: '', images: '',
  extIcon: '', extLabel: '', extUrl: '',
};

const emptyContentForm = {
  contentType: 'none', title: '', image: '', details: '', extLink: '',
  author: '', streamingPlatform: '', years: '',
  location: '', mapLink: '', foodType: '',
};

function AdminAdd() {
  const [entryType, setEntryType] = useState('none');
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [contentForm, setContentForm] = useState(emptyContentForm);
  const [status, setStatus] = useState('');

  const updateBlogField = (field, value) => {
    setBlogForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateContentField = (field, value) => {
    setContentForm((prev) => ({ ...prev, [field]: value }));
  };

  const setDateToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    updateBlogField('date', today);
  };

  const blogFieldsFilled = blogForm.title.trim() && blogForm.date.trim() && blogForm.content.trim();

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const blogData = {
      title: blogForm.title,
      date: blogForm.date,
      tags: blogForm.tags.split(','),
      externalLink: { url: blogForm.extUrl, label: blogForm.extLabel, icon: blogForm.extIcon },
      content: blogForm.content,
    };
    if (blogForm.images) {
      blogData.images = blogForm.images.split(',').map((img) => img.trim());
    }

    await setDoc(doc(db, 'blogData', blogData.title), blogData);
    setStatus('Blog Entry Saved!');
  };

  const handleContentSubmit = async (event) => {
    event.preventDefault();
    const { contentType } = contentForm;
    const nameField = contentType === 'restaurant' ? 'name' : 'title';
    const contentTable = contentType + 'Data';

    // Preserve original behavior: auto-increment numeric id within the collection.
    const querySnapshot = await getDocs(collection(db, contentTable));
    let maxId = 0;
    querySnapshot.forEach((docSnap) => {
      const docData = docSnap.data();
      if (docData.id && !isNaN(docData.id)) {
        maxId = Math.max(maxId, parseInt(docData.id, 10));
      }
    });
    const newId = maxId + 1;

    const contentData = {
      id: newId,
      datatype: contentType,
      [nameField]: contentForm.title,
      details: contentForm.details,
      externallink: contentForm.extLink,
    };
    if (contentForm.image) {
      contentData.image = contentForm.image;
    }

    const otherFields = {
      author: ['book', 'podcast'].includes(contentType) ? contentForm.author : null,
      streamingplatform: ['movie', 'tvshow'].includes(contentType) ? contentForm.streamingPlatform : null,
      years: ['movie', 'tvshow'].includes(contentType) ? contentForm.years : null,
      location: contentType === 'restaurant' ? contentForm.location : null,
      maplink: contentType === 'restaurant' ? contentForm.mapLink : null,
      typeoffood: contentType === 'restaurant' ? contentForm.foodType : null,
    };
    Object.keys(otherFields).forEach((key) => {
      if (otherFields[key]) {
        contentData[key] = otherFields[key];
      }
    });

    const docId = nameField === 'title' ? contentData.title : contentData.name;
    await setDoc(doc(db, contentTable, docId), contentData);

    let countdown = 7;
    setStatus(`Content Entry Saved! Refreshing in ${countdown} seconds`);
    const countdownInterval = setInterval(() => {
      countdown -= 1;
      setStatus(`Content Entry Saved! Refreshing in ${countdown} seconds`);
      if (countdown === 0) {
        clearInterval(countdownInterval);
        setContentForm(emptyContentForm);
        setStatus('');
      }
    }, 1000);
  };

  const openStorageConsole = () => {
    window.open(
      'https://console.firebase.google.com/u/0/project/duncan-personal-page/storage/duncan-personal-page.appspot.com/files/~2Ffavoritesimages',
      '_blank'
    );
  };

  const contentType = contentForm.contentType;

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-main-section">
        <h2>Data Entry</h2>

        <label htmlFor="entryType">Choose Entry Type:</label>
        <select id="entryType" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
          <option value="none">Select an Entry Type</option>
          <option value="blog">Blog Entry</option>
          <option value="content">Other Content (TV, Movies, Books, Podcasts, Restaurants)</option>
        </select>

        {entryType === 'blog' && (
          <form onSubmit={handleBlogSubmit}>
            <label htmlFor="blogTitle">Title:</label>
            <input
              type="text" id="blogTitle" required
              value={blogForm.title}
              onChange={(e) => updateBlogField('title', e.target.value)}
            />

            <label htmlFor="blogDate">Date:</label>
            <input
              type="date" id="blogDate" required
              value={blogForm.date}
              onChange={(e) => updateBlogField('date', e.target.value)}
            />
            <button type="button" onClick={setDateToToday}>Set to Today</button>

            <label htmlFor="blogTags">Tags (comma-separated):</label>
            <input
              type="text" id="blogTags"
              value={blogForm.tags}
              onChange={(e) => updateBlogField('tags', e.target.value)}
            />

            <label htmlFor="blogContent">
              Main Content:{' '}
              <span
                className="info-icon"
                title="Bold: **text**, Italic: *text*, Underline: __text__"
              >
                (formatting help)
              </span>
            </label>
            <textarea
              id="blogContent" required
              value={blogForm.content}
              onChange={(e) => updateBlogField('content', e.target.value)}
            />

            <label htmlFor="blogImage">Image Links (comma-separated):</label>
            <input
              type="text" id="blogImage"
              value={blogForm.images}
              onChange={(e) => updateBlogField('images', e.target.value)}
            />

            <label htmlFor="blogIcon">External Link Icon:</label>
            <select
              id="blogIcon"
              value={blogForm.extIcon}
              onChange={(e) => updateBlogField('extIcon', e.target.value)}
            >
              {BLOG_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label htmlFor="blogExtLabel">External Link Label:</label>
            <input
              type="text" id="blogExtLabel"
              value={blogForm.extLabel}
              onChange={(e) => updateBlogField('extLabel', e.target.value)}
            />

            <label htmlFor="blogExtURL">External Link URL:</label>
            <input
              type="url" id="blogExtURL"
              value={blogForm.extUrl}
              onChange={(e) => updateBlogField('extUrl', e.target.value)}
            />

            <button type="submit" disabled={!blogFieldsFilled}>Submit Blog Entry</button>
            <button type="button" onClick={() => { setBlogForm(emptyBlogForm); setStatus(''); }}>Clear</button>
          </form>
        )}

        {entryType === 'content' && (
          <form onSubmit={handleContentSubmit}>
            <label htmlFor="contentType">Data Type:</label>
            <select
              id="contentType"
              value={contentForm.contentType}
              onChange={(e) => updateContentField('contentType', e.target.value)}
            >
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label htmlFor="contentTitle">Title/Name:</label>
            <input
              type="text" id="contentTitle" required
              value={contentForm.title}
              onChange={(e) => updateContentField('title', e.target.value)}
            />

            <label htmlFor="contentImage">Image Link:</label>
            <input
              type="text" id="contentImage" required
              value={contentForm.image}
              onChange={(e) => updateContentField('image', e.target.value)}
            />
            <button type="button" onClick={openStorageConsole}>Go to Image Upload</button>

            <label htmlFor="contentDetails">Details:</label>
            <textarea
              id="contentDetails" required
              value={contentForm.details}
              onChange={(e) => updateContentField('details', e.target.value)}
            />

            <label htmlFor="contentExtLink">External Link:</label>
            <input
              type="url" id="contentExtLink" required
              value={contentForm.extLink}
              onChange={(e) => updateContentField('extLink', e.target.value)}
            />

            {['book', 'podcast'].includes(contentType) && (
              <div>
                <label htmlFor="bookAuthor">Author:</label>
                <input
                  type="text" id="bookAuthor" required
                  value={contentForm.author}
                  onChange={(e) => updateContentField('author', e.target.value)}
                />
              </div>
            )}

            {['movie', 'tvshow'].includes(contentType) && (
              <div>
                <label htmlFor="contentStreaming">Streaming Platform:</label>
                <select
                  id="contentStreaming"
                  value={contentForm.streamingPlatform}
                  onChange={(e) => updateContentField('streamingPlatform', e.target.value)}
                >
                  <option value="none">Select a Streaming Platform</option>
                  {STREAMING_OPTIONS.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>

                <label htmlFor="contentYears">Year/Years (enter range or specific year):</label>
                <input
                  type="text" id="contentYears" required
                  value={contentForm.years}
                  onChange={(e) => updateContentField('years', e.target.value)}
                />
              </div>
            )}

            {contentType === 'restaurant' && (
              <div>
                <label htmlFor="location">Location:</label>
                <input
                  type="text" id="location" required
                  value={contentForm.location}
                  onChange={(e) => updateContentField('location', e.target.value)}
                />

                <label htmlFor="mapLink">Map Link:</label>
                <input
                  type="url" id="mapLink" required
                  value={contentForm.mapLink}
                  onChange={(e) => updateContentField('mapLink', e.target.value)}
                />

                <label htmlFor="foodType">Type of Food:</label>
                <input
                  type="text" id="foodType" required
                  value={contentForm.foodType}
                  onChange={(e) => updateContentField('foodType', e.target.value)}
                />
              </div>
            )}

            <button type="submit">Submit Content</button>
            <button type="button" onClick={() => { setContentForm(emptyContentForm); setStatus(''); }}>Clear</button>
          </form>
        )}

        {status && <p className="admin-status">{status}</p>}
      </div>
    </div>
  );
}

export default AdminAdd;
