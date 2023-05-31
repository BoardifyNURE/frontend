import { useState , useEffect, useCallback} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { IBoard, INewBoard } from '../../Interfaces/Kanban'
import { setBoards } from '../../store/slices/boards'
import fetchBoards from '../../http/boards/fetchBoards'
import createBoard from '../../http/boards/createBoard'
import removeBoard from '../../http/boards/removeBoard'
import editBoard from '../../http/boards/editBoard'
import UsersModal from '../usersModal/UsersModal'
import BoardItem from '../BoardItem/BoardItem'
import './boards.css'
import LoaderCustom from '../loader/Loader'

export default function Boards() {
    const [newBoard,setNewBoard] = useState<INewBoard>({title:''})
    const [loading,setLoading] = useState<boolean>(true)
    const [isNewBoard,setIsNewBoard] = useState<boolean>(false)
    const [userModal,setUsersModal] = useState<boolean>(false)
    const [selectedBoard,setSelectedBoard] = useState<string>('')
    const boards : Array<IBoard> = useSelector((state:any) => state.boards.boards)

    const dispatch = useDispatch()

    const inputHandler = useCallback((id:string,value:string) => {
        const updatedBoards : Array<IBoard> = boards.map((board:IBoard) => {
            if(board.id === id){
                return {...board,title:value}
            }
            return board
        })

        dispatch(setBoards(updatedBoards))

    },[boards])

    const updateBoard = useCallback( (id:string) : void => {
        const updatedBoards : Array<IBoard> = boards.map((board:IBoard) => {
            if(board.id === id){
                return {...board,isEdit:!board?.isEdit}
            }
            return {...board,isEdit:false}
        })
        
        dispatch(setBoards(updatedBoards))    

    },[boards])

    const deleteBoard = useCallback(async (id:string) : Promise<void> => {
        const filteredBoards : Array<IBoard> = boards.filter((board:IBoard) => {
            return board.id !== id
        })

        const isSuccess : boolean = await removeBoard(id)

        isSuccess && dispatch(setBoards(filteredBoards))
    },[boards])

    const toggleUserModal = useCallback((id?:string) : void => {
        if(id === 'close-modal') {
            setUsersModal(false)
            setSelectedBoard('')
            return
        }else{
            setUsersModal(true)
            if(!selectedBoard.length && id){
                setSelectedBoard(id)
            }
        }
    },[boards,userModal,selectedBoard])

    const confirmCreateBoard = async () : Promise<void> => {
        if(newBoard.title.length < 3) return

        const board : IBoard = await createBoard(newBoard)

        dispatch(setBoards([board,...boards]))
        setIsNewBoard(false)
        setNewBoard({title:''})
    }

    const confirmEditBoard = async (id:string) : Promise<void> => {
        const updatedBoard : IBoard | undefined = boards.find((board:IBoard) => board.id === id)
        
        updatedBoard && await editBoard({title:updatedBoard?.title},id)

        updateBoard(id)
    }
    
    useEffect(() => {
        fetchBoards().then((result) => {
            setLoading(false)
            dispatch(setBoards(result))
        })
    },[])

    if(loading) return <LoaderCustom/>
    
  return (
        <>
        <div className='main__boards-items'>
        {
                isNewBoard
                ?
                <div className='main__boards-create'>
                    <div className='main__boards-create-title'>
                    New board
                    </div>
                    <div className='main__boards-create-input'>
                        <label htmlFor="board-title">Title:</label>
                        <input 
                        id='board-title'
                        onChange={(e) => setNewBoard({title:e.target.value})}
                        value={newBoard.title}
                        type="text" 
                        />
                    </div>
                    <div className='main__boards-create-actions'>
                        <input
                        type='button'
                        value={'Create'}
                        onClick={confirmCreateBoard}
                        />
                        <input
                        type='button'
                        value={'Cancel'} 
                        onClick={() => setIsNewBoard(false)}
                        />
                    </div>
                </div>
                :
                <input
                type='button'
                value={'+'} 
                onClick={() => setIsNewBoard(true)}
                className='main__boards-add-btn'
                />
            }
            {
                boards.map((board:IBoard,index) => {
                    return (
                        
                            board?.isEdit 
                            ?
                            <div key={board.id} className='main__boards-item-edit'>
                                <div className='main__boards-item-title'>
                                    <span className='key'>Title: </span>
                                    <input 
                                    onChange={(e) => inputHandler(board.id,e.target.value)}
                                    className='main__boards-item-input'
                                    value={board.title}
                                    type="text" />
                                </div>
                                <div className='main__boards-item-edit-actions'>
                                    <input
                                    type='button'
                                    value={'Confirm'} 
                                    onClick={() => confirmEditBoard(board.id)}
                                    />
                                    <input 
                                    type='button'
                                    value={'Cancel'}
                                    onClick={() => updateBoard(board.id)} 
                                    />
                                </div>
                            </div>
                            :
                            <BoardItem 
                            toggleModal={toggleUserModal}
                            deleteBoard={deleteBoard}
                            updateBoard={updateBoard}
                            key={board.id} 
                            board={board}/>
                    )
                })
            }
        </div>
        {
            userModal
            ?
            <UsersModal 
            toggleModal={toggleUserModal}
            boardId={selectedBoard}/>
            :
            <></>
        }
        </>
  )
}
