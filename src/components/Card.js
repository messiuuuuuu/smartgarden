import React from 'react';

const Card = ({ children }) => {
    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            {children}
        </div>
    );
}

export default Card;
