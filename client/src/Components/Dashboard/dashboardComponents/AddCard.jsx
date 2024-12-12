import React, { useState } from 'react';

const AddCard = ({ columnId, addCard }) => {
    const [content, setContent] = useState('');

    const handleAddCard = () => {
        if (content.trim()) {
            addCard(columnId, content);
            setContent('');
        }
    };

    return (
        <div className="add-card">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a new card"
            />
            <button onClick={handleAddCard}>Add</button>
        </div>
    );
};

export default AddCard;