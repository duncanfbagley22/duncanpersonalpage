import React from 'react';
import '../styles/PageBanner.css';

// Reusable page-title banner matching the retro chrome look of the site
// header (see Header.css .header-banner). Drop this at the top of any
// content page to label it, e.g. <PageBanner title="Blog" subtitle="..." />
const PageBanner = ({ title, subtitle }) => (
  <div className="page-banner">
    <h1 className="page-banner-title">{title}</h1>
    {subtitle && <p className="page-banner-subtitle">{subtitle}</p>}
  </div>
);

export default PageBanner;
