import React from 'react';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

const Board = ({ columns, cards, setCards, addCard, removeCard }) => {
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const draggedCard = cards.find(card => card.id === result.draggableId);
        const updatedCards = Array.from(cards);
        updatedCards.splice(source.index, 1);
        draggedCard.columnId = destination.droppableId;
        updatedCards.splice(destination.index, 0, draggedCard);

        setCards(updatedCards);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
                {columns.map((column) => (
                    <Column key={column.id} column={column} cards={cards.filter(card => card.columnId === column.id)} addCard={addCard} removeCard={removeCard} />
                ))}
            </div>
        </DragDropContext>
    );
};

export default Board;