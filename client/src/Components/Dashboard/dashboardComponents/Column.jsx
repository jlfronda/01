import React from 'react';
import Card from './Card';
import AddCard from './AddCard';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ column, cards, addCard, removeCard }) => {
    return (
        <div className="column">
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {cards.map((card, index) => (
                            <Card key={card.id} card={card} index={index} removeCard={removeCard} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <AddCard columnId={column.id} addCard={addCard} />
        </div>
    );
};

export default Column;