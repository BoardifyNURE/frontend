import {FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Column from "../Column/Column";
import { ICard, IColumn, TaskStatus,INewTask, IUser} from "../../Interfaces/Kanban";
import fetchColumns from "../../http/columns/fetchColumns";
import createColumn from "../../http/columns/createColumn";
import removeColumn from "../../http/columns/removeColumn";
import createTask from "../../http/tasks/createTask";
import removeTask from "../../http/tasks/removeTask";
import editTask from "../../http/tasks/editTask";
import AddBoardInput from "../AddColumnInput/AddColumnInput";
import Nav from "../Nav/Nav";
import editColumn from "../../http/columns/editColumn";
import LoaderCustom from "../loader/Loader";
import "./columns.css";
import fetchAvailableStatuses from "../../http/fetchAvailableStatuses";
import fetchTasks from "../../http/tasks/fetchTasks";
import { ITodos } from "../../Interfaces/Kanban";
import fetchTodos from "../../http/todos/fetchTodos";
import fetchBoardUsers from "../../http/users/fetchBoardUsers";

interface IProps {
    boardId:string
}

const Columns : FC<IProps> = ({boardId}) => {
  const [loading,setLoading] = useState<boolean>(true)
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [targetCard, setTargetCard] = useState({
    boardId: '0',
    cardId: '0',
  });

  const navigate = useNavigate()

  const addColumnHandler = async (name: string) : Promise<void> => {
    const newColumn : IColumn = {
      boardId:boardId,
      title:name,
      order:(columns.length + 1),
      cards:[],
    }

    const column : IColumn = await createColumn(newColumn)

    const tempBoardsList = [...columns,column];

    setColumns(tempBoardsList);
  };

  const deleteColumn = async (columnId: string) : Promise<void> => {
    const isSuccess : boolean = await removeColumn(columnId)

    if(!isSuccess) return 

    const filteredColumns = columns.filter((column) => column.id !== columnId)

    setColumns(filteredColumns);
  };

  const editColumnHandler = (id: string)  => {
    setColumns((prev : Array<IColumn>) => {
      return prev.map((column:IColumn) => {
        if(column.id === id){
          return {...column,isEdit:!column.isEdit}
        }
        return column
      })
    });
  };

  const editColumnInputTitle = async (id: string,value: string) : Promise<void> => {
    const editedColumn : IColumn | undefined= columns.find((column:IColumn) => column.id === id)

    if(!editedColumn) return

    setColumns((prev : Array<IColumn>) => {
      return prev.map((column:IColumn) => {
        if(column.id === id){
          return {...column,title:value,isEdit:false}
        }
        return column
      })
    });

    await editColumn({...editedColumn,title:value},id)
  };

  const editColumnOrder = async (id: string,action: 'left' | 'right') : Promise<void> => {
    const editedColumn : IColumn | undefined = columns.find((column:IColumn) => column.id === id)

    if(!editedColumn) return
    
    let firstEditedColumn : IColumn = editedColumn;

    let currentOrder : number = editedColumn.order

    if(
      ((currentOrder - 1) < 0 && action === 'left')  
      || 
      ((currentOrder + 1) === columns.length) && action === 'right'
      ) return

    const updatedOrder = action === 'left' ? (currentOrder - 1) : (currentOrder + 1)

    if(updatedOrder < 0 || currentOrder < 0) return 

    const updatedColumns : Array<IColumn> = columns.map((column:IColumn) => {
      if(column.order === updatedOrder){
        firstEditedColumn = column

        return {...column,order:currentOrder}
      }

      if(column.order === currentOrder){
        return {...column,order:updatedOrder}
      }
      return column

    }).sort((a,b) => a.order - b.order)

    setColumns(updatedColumns);

    setLoading(true)
    
    await editColumn({...firstEditedColumn,order:currentOrder},firstEditedColumn.id || '')

    await editColumn({...editedColumn,order:updatedOrder},id)

    setLoading(false)

  };

  const addCardHandler = async (columnId:string,data:{title:string,description:string,assigneeId?:string}) : Promise<void> => {
    const boardIndex = columns.findIndex((item: IColumn) => item.id === columnId);

    if (
      boardIndex < 0 
      ||
      data.title.length < 2
      ) {
      alert('Title is required')
      return
    };  

    const tempBoardsList = [...columns];

    const newCard : INewTask= {
      title:data.title,
      description:data.description,
      order: tempBoardsList[boardIndex].cards?.length || 0,
      status: TaskStatus.ToDo,
      column_id:columnId
    }

    if(data.assigneeId){
      newCard.assignee_id = data.assigneeId
    }

    const task : ICard = await createTask(newCard)

    const statuses : Array<string> = await fetchAvailableStatuses(task.id)

    tempBoardsList[boardIndex]?.cards
    ?
    tempBoardsList[boardIndex].cards.push({...task,available_statuses:statuses})
    :
    tempBoardsList[boardIndex].cards = [{...task,available_statuses:statuses}]

    setColumns(tempBoardsList);
  };
  
  const removeCard = async (boardId: string, cardId: string) : Promise<void> => {
    const boardIndex = columns.findIndex((item: IColumn) => item.id === boardId);

    if (boardIndex < 0) return;

    await removeTask(cardId)

    const tempBoardsList = [...columns];

    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => String(item.id) === String(cardId));

    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);

    setColumns(tempBoardsList);
  };

  const updateCard = async (boardId: string, cardId: string, card: ICard,isLocal?:boolean) : Promise<void> => {
    const boardIndex = columns.findIndex((item) => item.id === boardId);
    
    if (boardIndex < 0) return;

    const newTask : INewTask = {
      title:card.title,
      description:card.description,
      status:card.status,
      order:card.order,
      column_id:card.column_id
    }

    if(card.assignee_id){
      newTask.assignee_id = card.assignee_id
    }

    const tempBoardsList = [...columns];

    const cards = tempBoardsList[boardIndex].cards;
    
    const cardIndex = cards.findIndex((item) => item.id === cardId);

    if (cardIndex < 0) return
    
    !isLocal && await editTask(newTask,card.id)

    tempBoardsList[boardIndex].cards[cardIndex] = card;

    setColumns(tempBoardsList);
  };

  const updateColumnCards = (columnId: string, cards: Array<ICard>) : void => {
    const boardIndex = columns.findIndex((item) => item.id === columnId);

    if (boardIndex < 0) return;

    setColumns((prev:Array<IColumn>) => {
      return prev.map((column:IColumn) => {
          if(column.id === columnId){
            return {...column,cards}
          } 
          return column
      })
    })
  };

  const onDragEnd = async (boardId: string, cardId: string) : Promise<void> => {
    if(boardId !== targetCard.boardId) return

    const sourceBoardIndex = columns.findIndex(
      (item: IColumn) => item.id === boardId,
    );

    const sourceCardIndex = columns[sourceBoardIndex]?.cards?.findIndex(
      (item) => item.id === cardId,
    );

    const targetBoardIndex = columns.findIndex(
      (item: IColumn) => item.id === String(targetCard.boardId),
    );

    const targetCardIndex = columns[targetBoardIndex]?.cards?.findIndex(
      (item) => String(item.id) === String(targetCard.cardId),
    );

    if (
      targetCardIndex < 0 
      || 
      targetBoardIndex < 0
      ||
      sourceCardIndex < 0
      ||
      sourceBoardIndex < 0
      ) return

    const sourceTask : ICard = columns[sourceBoardIndex].cards[sourceCardIndex];

    const targetTask : ICard = columns[targetBoardIndex].cards[targetCardIndex];

    let changedSourceTask : ICard = columns[targetBoardIndex].cards[targetBoardIndex];

    let changedTargetTask : ICard = columns[sourceBoardIndex].cards[sourceCardIndex];

    const tempBoardsList : Array<IColumn> =  columns.map((column:IColumn) => {

      if(column.id === targetCard.boardId){
        return {...column,cards:column.cards.map((card: ICard) => {

          if(card.order === sourceTask.order){
            changedSourceTask = {...card,order:targetTask.order}
            return {...card,order:targetTask.order};
          }

          if(card.id === targetCard.cardId){
            changedTargetTask = {...card,order:sourceTask.order}
            return {...card,order:sourceTask.order};
          }

          return card
        }).sort((a,b) => (a.order || 0) - (b.order || 0))}
      }

      return column
    })

    setColumns(tempBoardsList);

    await editTask({
      title:changedSourceTask.title,
      description:changedSourceTask.description,
      assignee_id:changedSourceTask.assignee_id || '',
      status:changedSourceTask.status,
      order:changedSourceTask.order,
      column_id:changedSourceTask.column_id
    },changedSourceTask.id)

    await editTask({
      title:changedTargetTask.title,
      description:changedTargetTask.description,
      assignee_id:changedTargetTask.assignee_id || '',
      status:changedTargetTask.status,
      order:changedTargetTask.order,
      column_id:changedTargetTask.column_id
    },changedTargetTask.id)

    setTargetCard({
      boardId: '0',
      cardId: '0',
    });

  };

  const onDragEnter = (boardId: string, cardId: string) => {
    if (String(targetCard.cardId) === cardId) return;
    setTargetCard({
      boardId: boardId,
      cardId: cardId,
    });
  };

  const fetchData = async () : Promise<void> => {
    const columns : Array<IColumn> = await fetchColumns(boardId);

    const columnsData : Array<IColumn>  = []
    
    for (let index = 0; index < columns.length; index++) {
      const column = columns[index];

      if(column.order < 0){
        column.order = 0
      }
      
      const tasks : Array<ICard> = await fetchTasks(column.id || '')
      
      const tasksData : Array<ICard> = []

      for (let i = 0; i < tasks.length; i++) {
        const task : ICard = tasks[i];
  
        const todosData : Array<ITodos> = await fetchTodos(task.id || '')
  
        const statusesData : Array<string> = await fetchAvailableStatuses(task.id || '')

        const users : Array<IUser> = await fetchBoardUsers(boardId)

        const selectedUser : IUser | undefined = users.find((user:IUser) => {
          return user.id === task.assignee_id
        })

        tasksData.push({
          ...task,
          todos:todosData.sort((a,b) => (a.order || 0) - (b.order || 0)),
          available_statuses:statusesData,
          selectedUser:selectedUser
        })
      }

      columnsData.push({...column,cards:tasksData})
    }
    
    setColumns(columnsData)

    setLoading(false)
  };

  useEffect(() => {
    if(!localStorage.getItem('accessToken')){
      return navigate('/login')
    }else{
      fetchData();
    }
  }, []);

  return (
    <div className="app">
      <Nav/>
      {
        loading
        ?
        <><LoaderCustom/></>
        :
        <div className="app-boards-container">
        <div className="app-boards">
          {columns.map((item,index) => (
            <Column
            boardId={boardId}
              key={item.id || index}
              confrimEdit={editColumnInputTitle}
              columns={columns}
              column={item}
              addCard={addCardHandler}
              editColumn={editColumnHandler}
              editColumnOrder={editColumnOrder}
              removeColumn={() => deleteColumn(item.id || '')}
              removeCard={removeCard}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              updateCards={updateColumnCards}
              updateCard={updateCard}
            />
          ))}
          <div className="app-boards-last">
            <AddBoardInput
              displayClass="app-boards-add-board"
              editClass="app-boards-add-board-edit"
              placeholder="Enter Board Name"
              text="Add Column"
              buttonText="Add Column"
              onSubmit={addColumnHandler}
            />
          </div>
        </div>
      </div>
      }

    </div>
  );
}

export default Columns;
