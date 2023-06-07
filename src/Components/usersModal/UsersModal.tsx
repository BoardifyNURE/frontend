import {FC,useEffect, useState} from 'react'
import { IUser } from '../../Interfaces/Kanban'
import closeIcon from '../../assets/close.png'
import fetchBoardUsers from '../../http/users/fetchBoardUsers'
import addUser from '../../http/boards/addUser'
import reloadWindow from '../../Helper/reloadWindow'
import uuid from 'react-uuid'
import './users-modal.css'

interface IProps {
  boardId:string
  toggleModal: (id?:string) => void
}

const UsersModal : FC<IProps> = ({boardId,toggleModal}) => {
  const [loading,setLoading] = useState<boolean>(true)
  const [searchType,setSearchType] = useState<boolean>(true)
  const [boardUsers,setBoardUsers] = useState<Array<IUser>>([])
  const [user,setUser] = useState<IUser>({username:'',email:'',id:uuid()})

  const inputsHandler = (name:string,value:string) : void => {
    setUser({...user,[name]:value})
  }
  const confirmAddUser = async (e:any) : Promise<void> => {
    e.preventDefault()
    if(user.email.length < 4 && searchType){
      return alert('Email is required (min 4 characters)')
    }

    if(user.username.length < 4 && !searchType){
      return alert('Username is required (min 4 characters)')
    }

    const result = await addUser(boardId,user,searchType ? 'email' : 'username')

    if(result.message){
      alert(String(result.message))
    }else{
      reloadWindow()
    }
  }

  useEffect(() => {
    fetchBoardUsers(boardId).then((users) => {
      setBoardUsers(users)
      setLoading(false)
    })
  },[])

  return (
    <form 
    id='close-modal'
    onSubmit={confirmAddUser}
    onClick={(e:any) => toggleModal(e.target.id)} 
    className='modal'
    >
      <div className="users-modal">
        <div className='users-modal__head'>
          <div className="users-modal__title">
          Already added users:
          </div>
          <button 
            id='close-modal' 
            className='users-modal__close'>
            <img
            id='close-modal' 
            src={closeIcon} alt="close-modal" />
          </button>
        </div>

        <div className='users-modal__list'>
          {
          loading && boardUsers?.length
          ?
          <>Loading...</>
          :
          boardUsers.map((user,index) => {
            return (
              <div key={user.id}>
                {(index + 1)} . {user.username}
              </div>
            )
          })}
        </div>
        <div className='users-modal__add'>
          <div className="users-modal__add-title">
            <div>Add user by:</div>
            <div className='users-modal__add-btns'>
              <button 
              className={searchType ? 'selected' : ""}
              onClick={(e) => {
                e.preventDefault()
                setSearchType(true)
              }}>
                Email
              </button> 
              <button 
              className={searchType ? '' : "selected"}
              onClick={(e) => {
                e.preventDefault()
                setSearchType(false)
              }}>
                Username
              </button>
            </div>
          </div>
          <div className='users-modal__add-inputs'>
            {
              searchType
              ?
              <div className='users-modal__add-input'>
                <label 
                htmlFor="email">
                  Email:
                </label>
                <input
                onChange={(e) => inputsHandler(e.target.name,e.target.value)}
                id='email'
                type="email" 
                name='email'
                value={user.email}
                />
              </div>
              :
              <div className='users-modal__add-input'>
                <label 
                htmlFor="username">
                  Username:
                </label>
                <input
                id='username'
                onChange={(e) => inputsHandler(e.target.name,e.target.value)}
                name='username'
                value={user.username}
                type="text" 
                />
              </div>
            }
          </div>
          <input 
          type='submit'
          value={'Confirm'}
          className='users-modal__add-button'/>
        </div>
      </div>
    </form>
  )
}


export default UsersModal