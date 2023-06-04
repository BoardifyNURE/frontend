import { FC, useState } from 'react'
import { IUser } from '../../Interfaces/Kanban'
import { Check ,ArrowDown,ArrowUp} from 'react-feather'
import './user-list.css'

interface IProps {
    selectedUser: IUser
    boardUsers: Array<IUser>
    selectUserHandler: (user:IUser) => void
}

const UserList : FC<IProps> = ({selectUserHandler,selectedUser,boardUsers}) => {
    const [isOpen,setIsOpen] = useState<boolean>(false)

    const confirmSelectUser = (user:IUser) : void => {
        selectUserHandler(user)
        setIsOpen(false)
    }
    
    return (
              <div className="custom-input__list users-list">
                <div 
                tabIndex={0}
                onClick={() => setIsOpen((prev) => !prev)}
                className='custom-input__list-btn-wrapper'>
                    <input
                    className='custom-input__list-btn'
                    value={selectedUser.username || 'Select user'}
                    type='button'
                    />
                    {
                        isOpen
                        ?
                        <ArrowUp/>
                        :
                        <ArrowDown/>
                    }
                </div>
                {
                    isOpen
                    ?
                    <div className='custom-input__users-list'>
                        {
                            boardUsers.map((user:IUser) => {
                                if(user.id === selectedUser.id){
                                  return (
                                    <div key={user.id} className="select-user-btn__wrapper">
                                      <Check/>
                                      <input
                                      onClick={() => confirmSelectUser(user)}
                                      className="select-user-btn selected"
                                      type="button"
                                      value={user.username}
                                      />
                                    </div>
                                  )
                                }
                                return (
                                  <input
                                  key={user.id}
                                  onClick={() => confirmSelectUser(user)}
                                  className="select-user-btn"
                                  type="button"
                                  value={user.username}
                                  />
                                )
                              })
                        }
                    </div>

                      :
                     <></>
                }
              </div>
    )
}


export default UserList;