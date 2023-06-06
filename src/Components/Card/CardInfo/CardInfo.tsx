import { useEffect, useMemo, useState } from "react";
import {  CheckSquare, List, Type ,Check, ArrowDown,ArrowUp,User,X} from "react-feather";
import { ICard, INewTodos, ITodos, IUser } from "../../../Interfaces/Kanban";
import UserList from "../../UserList/UserList";
import TextArea from "../../TextArea/TextArea";
import Modal from "../../Modal/Modal";
import editTodo from "../../../http/todos/editTodo";
import createTodo from "../../../http/todos/createTodo";
import removeTodo from "../../../http/todos/removeTodo";
import fetchAvailableStatuses from "../../../http/fetchAvailableStatuses";
import Todos from "../../Todos/Todos";
import TextInput from "../../TextInput/TextInput";
import AddColumnInput from "../../AddColumnInput/AddColumnInput";
import fetchBoardUsers from "../../../http/users/fetchBoardUsers";
import "./CardInfo.css";

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: string;
  columnId:string;
  updateCard: (boardId: string, cardId: string, card: ICard,isLocal?:boolean) => void;
}

function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard ,columnId} = props;
  const [isOpenStatusList,setIsOpenStatusList] = useState<boolean>(false)
  const [selectedUser,setSelectedUser] = useState<IUser>(card.selectedUser || {email:'',username:'',id:''})
  const [boardUsers,setBoardUsers] = useState<Array<IUser>>([])
  const [cardValues, setCardValues] = useState<ICard>({
    ...card,todos:card.todos,
  });
  
  const updateInfo = (value: string,name: string) => {
    const updatedCard = {...card,[name]:value}

    setCardValues(updatedCard);

    updateCard(card.column_id || '',card.id || '',updatedCard)
  };

  const addTodos = async (value: string) : Promise<void> => {
    const newTodo: INewTodos = {
      task_id:card.id,
      content: value,
      order:card.todos?.length || 0
    };

    const todo : ITodos = await createTodo(newTodo)

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: card.todos?.length ? [...card.todos, todo] : [todo],
    })

  };

  const removeTodos = async (id: string) : Promise<void> => {
    const todos = [...card.todos];

    const tempTasks = todos.filter((item) => item.id !== id).map((todo:ITodos,index:number) => {
      return (
        {...todo,order:index}
      )
    });

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: tempTasks,
    },true)

    await removeTodo(id)

  };

  const updateTodos = async (id: string, value: boolean) : Promise<void> => {
    const todos = [...card.todos];

    const index = todos.findIndex((item) => item.id === id);

    if (index < 0) return;

    todos[index].is_done = !!value;
    
    const updatedTodos : Array<ITodos> = todos.map((todo:ITodos) => {
      if(todo.id === id){
        return {...todo,is_done:!!value}
      }
      return todo
    })

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: updatedTodos,
    },true)

    await editTodo(todos[index],todos[index].id)
  };

  const editTodoMode = async (id:string) : Promise<void> => {
    const todos = [...card.todos];

    const index = todos.findIndex((item) => item.id === id);

    if (index < 0) return;
    
    const updatedTodos : Array<ITodos> = todos.map((todo:ITodos) => {
      if(todo.id === id){
        return {...todo,is_edit:!todo.is_edit}
      }
      return {...todo,is_edit:false}
    })

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: updatedTodos,
    })
  }

  const editTodoContent = async (id:string,content:string) : Promise<void> => {
    const todos = [...card.todos];

    const index = todos.findIndex((item) => item.id === id);

    if (index < 0) return;

    
    const updatedTodos : Array<ITodos> = todos.map((todo:ITodos) => {
      if(todo.id === id){
        return {...todo,content}
      }
      return todo
    })

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: updatedTodos,
    },true)
  }

  const confrimEditTodoContent = async (id:string) : Promise<void> => {
    const editedTodo : ITodos | undefined = card.todos.find((todo:ITodos) => todo.id === id)
    
    const updatedTodos : Array<ITodos> = card.todos.map((todo:ITodos) => {
      if(todo.id === editedTodo?.id){
        return {...editedTodo,is_edit:false}
      }
      return {...todo,is_edit:false}
    })

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: updatedTodos,
    })

    if(!editedTodo) return

    const todo : ITodos = {
      id,
      content:editedTodo.content,
      order:Number(editedTodo.order) || 0,
      is_done:editedTodo.is_done
    }

    await editTodo(todo,id)
  }

  const editCardOrder = async (id:string,action: 'up' | 'down') : Promise<void> => {
    const targetTodo : ITodos | undefined = card.todos.find((todo:ITodos) => todo.id === id)

    if(!targetTodo) return

    const targetTodoOrder : number = targetTodo?.order || 0
    
    const updatedOrder : number = action === 'up' ? (targetTodoOrder - 1) : (targetTodoOrder + 1)

    if(updatedOrder < 0 || updatedOrder > (card.todos.length)) return

    let updatedTodo : ITodos = targetTodo

    const updatedTodos : Array<ITodos> = card.todos.map((todo:ITodos) => {
      if(todo.order === targetTodoOrder){
        return {...todo,order:updatedOrder}
      }

      if(todo.order === updatedOrder){
        updatedTodo = {...todo,order:updatedOrder}

        return {...todo,order:targetTodoOrder}
      }
      
      return todo

    })

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      todos: updatedTodos.sort((a,b) => (a.order || 0) - (b.order || 0)),
    },true)

    await editTodo({...targetTodo,order:updatedOrder},targetTodo.id)

    await editTodo({...updatedTodo,order:targetTodoOrder},updatedTodo.id)
  } 

  const calculatePercent = () : number => {
    if (!card.todos?.length) return 0;
    const completed = card.todos?.filter(
      (item) => item.is_done,
    )?.length;
    return (completed / card.todos?.length) * 100;
  };

  const updateStatus = async (status:any) : Promise<void> => {
    setCardValues({...cardValues,status:status})

    await updateCard(card.column_id || '',card.id || '',{
      ...card,
      status:status
    })

    const statuses : Array<string> = await fetchAvailableStatuses(card.id)
    
    updateCard(card.column_id || '',card.id || '',{
      ...card,
      status:status,
      available_statuses:statuses,
    },true)

    setIsOpenStatusList(false)
  }
  
  const selectUserHandler = (user:IUser) : void => {
    selectedUser === user
    ?
    setSelectedUser({email:'',username:'',id:''})
    :
    setSelectedUser(user)

    updateCard(card.column_id || '',card.id || '',{
      ...card,
      assignee_id:user.id,
      selectedUser:user,
    })

  }

  const calculatedPercent = useMemo(() : number => {
    return calculatePercent();
  },[card])

  useEffect(() => {
    fetchBoardUsers(boardId).then((data : Array<IUser>) => {
      setBoardUsers(data)
    })
  },[])

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
      <div className={'cardinfo-close'}>
      <X onClick={onClose}/>
      </div>
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type />
            <p>Title</p>
          </div>
          <TextInput
            name={'title'}
            defaultValue={cardValues.title}
            text={cardValues.title}
            placeholder="Enter Title"
            onSubmit={updateInfo}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type />
            <p>Description</p>
          </div>
          <TextArea
            name={'description'}
            defaultValue={cardValues.description}
            text={cardValues.description || "Add a Description"}
            placeholder="Enter description"
            onSubmit={updateInfo}
          />
        </div>


        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <User/>
            <p>Assigned</p>
          </div>
          {/* <div className="cardinf-status-list">
          <div 
          tabIndex={0}
          onClick={() => setIsOpenUsersList((prev) => !prev)}
          className='custom-input__list-btn-wrapper'>
              <input
              className='custom-input__list-status-btn'
              value={card.status || 'Select status'}
              type='button'
              />
              {
                  isOpenUsersList
                  ?
                  <ArrowUp/>
                  :
                  <ArrowDown/>
              }
          </div>
            {
              card.available_statuses?.length && isOpenUsersList
              ?
              <div className="status-list">
                {
                  card.available_statuses.map((status,index) => {

                    return (
                        status === cardValues.status
                        ?
                        <div
                        key={status + index} 
                        tabIndex={(index + 1)} 
                        className="cardinf-status-item current">
                          <Check/>
                          {status}
                        </div>
                        :
                        <div
                        key={status + index} 
                        tabIndex={(index + 1)} 
                        onClick={() => updateStatus(status)} 
                        className="cardinf-status-item">
                          {status}
                        </div>
                    )
                })}
              </div>
              :
              <></>
            }
          </div> */}

          <UserList
          selectUserHandler={selectUserHandler}
          selectedUser={selectedUser}
          boardUsers={boardUsers}
          />

        </div>


        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <List />
            <p>Status - {card.status}</p>
          </div>
          <div className="cardinf-status-list">
          <div 
                tabIndex={0}
                onClick={() => setIsOpenStatusList((prev) => !prev)}
                className='custom-input__list-btn-wrapper'>
                    <input
                    className='custom-input__list-status-btn'
                    value={card.status || 'Select status'}
                    type='button'
                    />
                    {
                        isOpenStatusList
                        ?
                        <ArrowUp/>
                        :
                        <ArrowDown/>
                    }
                </div>
            {
              card.available_statuses?.length && isOpenStatusList
              ?
              <div className="status-list">
                {
                  card.available_statuses.map((status,index) => {

                    return (
                        status === cardValues.status
                        ?
                        <div
                        key={status + index} 
                        tabIndex={(index + 1)} 
                        className="cardinf-status-item current">
                          <Check/>
                          {status}
                        </div>
                        :
                        <div
                        key={status + index} 
                        tabIndex={(index + 1)} 
                        onClick={() => updateStatus(status)} 
                        className="cardinf-status-item">
                          {status}
                        </div>
                    )
                })}
              </div>
              :
              <></>
            }
          </div>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <CheckSquare />
            <p>Todos</p>
          </div>
          <div className="cardinfo-box-progress-bar">
            <div
              className="cardinfo-box-progress"
              style={{
                width: `${calculatedPercent}%`,
                backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <Todos 
          card={card}
          updateTodos={updateTodos}
          editTodoContent={editTodoContent}
          editTodoMode={editTodoMode}
          confrimEditTodoContent={confrimEditTodoContent}
          removeTodos={removeTodos}
          editCardOrder={editCardOrder}
          />
          <AddColumnInput
            text={"Add todo"}
            placeholder="Enter todo"
            onSubmit={addTodos}
          />
        </div>
        
      </div>

    </Modal>
  );
}

export default CardInfo;
