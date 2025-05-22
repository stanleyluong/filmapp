import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-center mt-auto">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} FilmFinder. All rights reserved.</p>
        <p className="text-sm mt-1">
          Movie and TV Show data provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">TMDb</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 