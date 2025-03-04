import React from 'react';
import '../styles/BlogEntry.css';

// Function to convert markdown-like syntax to HTML
const convertMarkdownToHTML = (text) => {
  // Convert **text** to <strong>text</strong> (bold)
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert *text* to <em>text</em> (italic)
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert __text__ to <u>text</u> (underline)
  formattedText = formattedText.replace(/__(.*?)__/g, '<u>$1</u>');

  // Convert newlines to <br />
  formattedText = formattedText.replace(/\n/g, '<br />');

  return formattedText;
};

const BlogEntry = ({ entry }) => {
  const { title, date, tags, externalLink, content } = entry;

  return (
    <div className="blog-entry-container">
      <h2>{title}</h2>
      <p className="entry-date">{date}</p>
      <div className="entry-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </span>
        ))}
      </div>

      {/* Conditional rendering of the external link button */}
      {externalLink.url && (
        <div className="entry-links">
          <a href={externalLink.url} target="_blank" rel="noopener noreferrer" className="link-card">
            <i className={externalLink.icon}></i>
            {externalLink.label}
          </a>
        </div>
      )}

      <div className="entry-content">
        {content && (
          <div
            className="formatted-content"
            dangerouslySetInnerHTML={{
              __html: convertMarkdownToHTML(content), // Render converted HTML
            }}
          />
        )}
      </div>

      {entry.images && entry.images.length > 0 && (
        <div className="images-container">
          {entry.images.map((image, index) => (
            <img key={index} src={image} alt={`blog image ${index + 1}`} className="blog-image" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogEntry;
