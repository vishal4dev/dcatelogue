import React from 'react';

const About = () => {
  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '800px' }}>
        <h2 style={{ color: '#00d4ff', marginBottom: '1rem' }}>
          Your Personal Media Experience Tracker
        </h2>
        
        <p style={{ color: '#b0b0b0', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          The Catalogue is a unified platform designed for those who love to keep track of 
          their media experiences across different mediums. Whether it's movies, books, comics, 
          games, or any other form of entertainment, you can catalogue them all in one beautiful, 
          dark-themed interface.
        </p>

        <h3 style={{ color: '#7b2ff7', marginTop: '2rem', marginBottom: '1rem' }}>
          Features
        </h3>
        
        <ul style={{ color: '#b0b0b0', lineHeight: '1.8', marginLeft: '1.5rem' }}>
          <li>Create custom mediums for different types of content</li>
          <li>Add items with detailed information including ratings</li>
          <li>View your collection in both grid and list formats</li>
          <li>Update ratings on the fly with an interactive star system</li>
          <li>Modern, aesthetic dark interface designed for comfortable viewing</li>
          <li>Fully responsive design that works on all devices</li>
        </ul>

        <h3 style={{ color: '#7b2ff7', marginTop: '2rem', marginBottom: '1rem' }}>
          How to Use
        </h3>
        
        <ol style={{ color: '#b0b0b0', lineHeight: '1.8', marginLeft: '1.5rem' }}>
          <li>Start by creating a medium (e.g., "Movies", "Books", "Comics")</li>
          <li>Add items to your mediums with all the relevant details</li>
          <li>Rate your experiences using the 5-star rating system</li>
          <li>Browse your collection and update ratings as your opinions evolve</li>
        </ol>

        <p style={{ color: '#b0b0b0', lineHeight: '1.8', marginTop: '2rem' }}>
          Built with the MERN stack (MongoDB, Express, React, Node.js) for a seamless 
          and powerful user experience.
        </p>
      </div>
    </div>
  );
};

export default About;