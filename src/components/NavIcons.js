// src/components/NavIcons.js
// Small chunky "16/32-bit" pixel-style icons for the header nav cards.
// Built from blocky <rect> shapes (not a full pixel-grid raster) so they read
// as pixel-art at icon size without needing per-pixel authoring. Each icon
// uses currentColor so it inherits the pill's text color (and transitions
// with it on hover), plus a lower-opacity pass of the same color for shading.

import {
  Briefcase,
  Home,
  Mail,
  Notebook,
  Star,
  Tools,
} from 'pixelarticons/react';

const iconProps = {
  'aria-hidden': true,
  focusable: false,
  shapeRendering: 'crispEdges',
};

export const HomeIcon = () => (
  <Home {...iconProps} />
);

export const BlogIcon = () => (
  <Notebook {...iconProps} />
);

export const ProfessionalIcon = () => (
  <Briefcase {...iconProps} />
);

export const ProjectsIcon = () => (
  <Tools {...iconProps} />
);

export const FavoritesIcon = () => (
  <Star {...iconProps} />
);

export const MessageIcon = () => (
  <Mail {...iconProps} />
);
