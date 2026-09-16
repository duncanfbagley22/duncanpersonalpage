// Project images now live in per-project subfolders under
// src/favorites-images/project-images/ (e.g. PersonalPage/, CorgiButt/,
// PokemonAPI/), for organization. Firestore project docs still store bare
// filenames (e.g. "personalPage1.png"), so we build a filename -> module
// map by scanning every subfolder recursively, keyed by basename. That
// way existing data doesn't need to change even though the files moved.
const imageContext = require.context(
  '../favorites-images/project-images',
  true,
  /\.(png|jpe?g|webp|gif|svg)$/i
);

const imagesByFilename = imageContext.keys().reduce((map, key) => {
  const filename = key.split('/').pop();
  map[filename] = imageContext(key);
  return map;
}, {});

export const getImage = (filename) => {
  return imagesByFilename[filename];
};

// Same as getImage, but never throws — returns null if the filename is
// missing or doesn't match any file under project-images/ (in any
// subfolder), so callers can fall back to a placeholder instead of
// crashing.
export const getImageSafe = (filename) => {
  if (!filename) return null;
  return imagesByFilename[filename] || null;
};
