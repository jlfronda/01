import { useState } from 'react';
import './Dashboard.css';
import Header from './dashboardComponents/Header.jsx';
import Sidebar from './dashboardComponents/Sidebar.jsx';
import Main from './dashboardComponents/Main.jsx';
import { BoardContext } from './context/BoardContext';




function Dashboard() {
  const boardData = {
    active: 0,
    boards: [
      {
        name: 'My TaskFlow',
        bgcolor: '#069',
        list: [
          { id: "1", title: "To do", items: [{ id: "cdrFt", title: "Project Description 1" }] },
          { id: "2", title: "In Progress", items: [{ id: "cdrFv", title: "Project Description 2" }] },
          { id: "3", title: "Done", items: [{ id: "cdrFb", title: "Project Description 3" }] }
        ]
      }
    ]
  }
  const [allboard, setAllBoard] = useState(boardData);

  return (
    <>
      <Header></Header>
      <BoardContext.Provider value={{ allboard, setAllBoard }}>
        <div className='content flex'>
          <Sidebar></Sidebar>
          <Main></Main>
        </div>
      </BoardContext.Provider>
    </>
  )
}

export default Dashboard
