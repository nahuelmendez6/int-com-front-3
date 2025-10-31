import React from 'react';

const StarRating = ({ rating, setRating, readOnly = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleClick = (index) => {
    if (!readOnly && setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="star-rating" style={{ display: 'flex', gap: '4px', fontSize: '24px', cursor: readOnly ? 'default' : 'pointer' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full" onClick={() => handleClick(i)}>&#9733;</span>
      ))}
      {hasHalfStar && (
        <span className="star half" onClick={() => handleClick(fullStars)}>&#9733;</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty" onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}>&#9734;</span>
      ))}
    </div>
  );
};

export default StarRating;
