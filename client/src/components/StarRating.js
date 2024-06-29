import React from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="relative mx-1 cursor-pointer text-gray-400"
          style={{
            width: '24px',
            height: '24px',
          }}
          onClick={() => onRatingChange(star)}
        >
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <span className="block w-full h-full leading-none">★</span>
          </div>
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${Math.min(Math.max(rating - star + 1, 0), 1) * 100}%`,
              overflow: 'hidden',
              color: 'yellow',
            }}
          >
            <span className="block w-full h-full leading-none">★</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StarRating;
