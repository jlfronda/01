import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ card, index, removeCard }) => {
    return (
        <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="card"
                >
                    {card.content}
                    <button onClick={() => removeCard(card.id)} className="remove-button">Remove</button>
                </div>
            )}
        </Draggable>
    );
};

export default Card;