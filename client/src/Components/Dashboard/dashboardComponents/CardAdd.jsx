import React, { useState } from 'react';
import { X, Plus } from 'react-feather';

const CardAdd = (props) => {
    const [cardTitle, setCardTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [checklist, setChecklist] = useState([{ text: '', done: false }]);
    const [show, setShow] = useState(false);

    const saveCard = () => {
        if (!cardTitle) {
            return;
        }
        props.getcard({
            title: cardTitle,
            description,
            dueDate,
            checklist
        }, props.listIndex);
        setCardTitle('');
        setDescription('');
        setDueDate('');
        setChecklist([{ text: '', done: false }]);
        setShow(!show);
    };

    const handleAddChecklistItem = () => {
        setChecklist([...checklist, { text: '', done: false }]);
    };

    const handleChecklistChange = (index, value) => {
        const newChecklist = [...checklist];
        newChecklist[index].text = value;
        setChecklist(newChecklist);
    };

    const closeBtn = () => {
        setCardTitle('');
        setDescription('');
        setDueDate('');
        setChecklist([{ text: '', done: false }]);
        setShow(!show);
    };

    return (
        <div>
            <div className="flex flex-col">
                {show && (
                    <div>
                        <textarea
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            className='p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900'
                            cols="30"
                            rows="2"
                            placeholder='Enter Card Title...'
                        ></textarea>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900'
                            cols="30"
                            rows="2"
                            placeholder='Enter Description...'
                        ></textarea>

                        <div className="checklist">
                            {checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center mb-1">
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleChecklistChange(idx, e.target.value)}
                                        className='bg-transparent outline-none text-white flex-grow p-1 border-2 bg-zinc-700 border-zinc-900 rounded-md mb-1'
                                        placeholder='Details'
                                    />
                                </div>
                            ))}
                        </div>
                        <input
                            type='date'
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className='p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900'
                        />
                        <button 
                                type="button" 
                                onClick={handleAddChecklistItem} 
                                className='flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-gray-500 h-8 text-white' 
                            >
                                <Plus size={16} />
                                <span className='ml-2'>Add More Details</span>
                        </button>
                        <div className='flex p-1'>
                            <button onClick={() => saveCard()} className='p-1 rounded bg-sky-600 text-white mr-2'>Add Card</button>
                            <button onClick={() => closeBtn()} className='p-1 rounded hover:bg-gray-600'><X size={16}></X></button>
                        </div>
                    </div>
                )}
                {!show && <button onClick={() => setShow(!show)} className='flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-gray-500 h-8'>
                    <Plus size={16}></Plus> Add a card
                </button>}
            </div>
        </div>
    );
}

export default CardAdd;
