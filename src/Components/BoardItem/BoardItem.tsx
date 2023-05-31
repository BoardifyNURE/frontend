import {FC} from 'react'
import { IBoard } from '../../Interfaces/Kanban'
import { useNavigate } from 'react-router-dom'
import { Delete,Edit,Eye,User} from 'react-feather'

interface IProps {
    board:IBoard
    updateBoard: (id:string) => void
    deleteBoard: (id:string) => Promise<void>
    toggleModal: (id?:string) => void
}

const BoardItem : FC<IProps> = ({board,updateBoard,deleteBoard,toggleModal}) => {
    const navigate = useNavigate()

  return (
    <div
    key={board.id} 
    className='main__boards-item'>
        <div className='main__boards-item-title'>
            <span className='key'>Title: </span>
            <span className='value'>{board.title}</span>
        </div>
        <div className='main__boards-item-actions'>
            <button 
            onClick={() => navigate(`/boards/${board.id}`)} 
            className='main__boards-item-btn'>
                <Eye/>
                View
            </button>
            <button 
            onClick={() => toggleModal(board.id)} 
            className='main__boards-item-btn'>
                <User/>
                Add users
            </button>
            <button 
            onClick={() => updateBoard(board.id)}
            className='main__boards-item-btn'>
                <Edit/>
                Edit
            </button>
            <button 
            onClick={() => deleteBoard(board.id)} 
            className='main__boards-item-btn'>
                <Delete/>
                Delete
            </button>
        </div>
    </div>
  )
}

export default BoardItem;
