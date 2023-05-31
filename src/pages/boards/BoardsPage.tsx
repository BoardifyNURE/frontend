import { useState , useEffect, useCallback} from 'react'
import { IBoard, INewBoard } from '../../Interfaces/Kanban'
import { Delete,Edit,Eye } from 'react-feather'
import { useDispatch,useSelector } from 'react-redux'
import { setBoards } from '../../store/slices/boards'
import { useNavigate } from 'react-router-dom'
import fetchBoards from '../../http/boards/fetchBoards'
import Nav from '../../Components/Nav/Nav'
import createBoard from '../../http/boards/createBoard'
import Boards from '../../Components/Boards/Boards'
import './boards-page.css'

export default function Main() {
  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem('accessToken')){
      return navigate('/login')
    }
  }, []);
  
  return (
    <div className='main'>
      <Nav/>
      <div className='main__boards'>
        <h2>Available boards</h2>
        <Boards/>
      </div>
    </div>
  )
}
