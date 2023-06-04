import {useState } from "react";
import { MoreHorizontal,ArrowLeft,ArrowRight } from "react-feather";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import CustomInput from "../CustomInput/CustomInput";
import { ICard, IColumn } from '../../Interfaces/Kanban';
import "./column.css";

interface BoardProps {
  boardId:string
  column: IColumn;
  columns: IColumn[];
  addCard: (boardId:string,data:any) => void;
  removeColumn: (boardId: string) => void;
  removeCard: (boardId: string, cardId: string) => void;
  onDragEnd: (boardId: string, cardId: string) => void;
  onDragEnter: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard,isLocal?:boolean) => void;
  updateCards: (columnId: string, cards: Array<ICard>) => void;
  editColumn: (boardId:string) => void;
  confrimEdit: (id:string,value:string) => Promise<void>,
  editColumnOrder: (id:string,value:'left' | 'right') => Promise<void>,
}

const Column = (props: BoardProps) => {
  const {
    boardId,
    column,
    columns,
    addCard,
    removeColumn,
    removeCard,
    onDragEnd,
    onDragEnter,
    updateCard,
    editColumn,
    confrimEdit,
    editColumnOrder,
  } = props;
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [columnTitle,setColumnTitle] = useState<string>(column.title)

  return (
    <div className="board">
      <div className="board-inner" key={column?.id}>
        <div className="board-header">
          {
            column.isEdit
            ?
            <div className="column-edit">
              <div className="column-edit-head">
                <label htmlFor="title-edit">
                Title:
                </label>
                <input 
                onChange={(e) => setColumnTitle(e.target.value)}
                className="column-edit-input"
                value={columnTitle}
                type="text" 
                />
              </div>
              <div className="column-edit-btns">
                <input
                onClick={() => confrimEdit(column.id || '',columnTitle)}
                className="column-edit-btn"
                type="button"
                value={'Confrim'}
                />
                <input
                onClick={() => editColumn(column?.id || '')}
                className="column-edit-btn"
                type="button"
                value={'Cancel'}
                />
              </div>
            </div>
            :
            <p className="board-header-title">
              {column?.title}
            </p>
          }
          <div
            className="board-header-title-more"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            {
              !column.isEdit
              ?
              <MoreHorizontal />
              :
              <></>
            }
            {
            showDropdown && !column.isEdit
            ?
            (
              <Dropdown
                class="board-dropdown"
              >
                <input
                value={'Delete Column'} 
                type="button" 
                onClick={() => removeColumn(column?.id || '')}
                />
                    <input
                value={'Edit Column'} 
                type="button" 
                onClick={() => editColumn(column?.id || '')}
                />
              </Dropdown>
            )
            :
            <></>
            }
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {column.cards?.map((item) => (
            <Card
              boardId={boardId}
              key={item.id}
              card={item}
              column_id={column.id || ''}
              removeCard={removeCard}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              updateCard={updateCard}
            />
          ))}
          <CustomInput
            columnId={boardId}
            text="+ Add Task"
            placeholder="Enter Card Title"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value: any) => addCard(column?.id || '', value)}
          />
        </div>
        <div className="column-arrows">
          {
            column.order === 0
            ?
            <div className="blocked-arrow">
              <ArrowLeft 
              tabIndex={1}/>
            </div>
            :
            <ArrowLeft 
            onClick={() => editColumnOrder(column.id || '','left')}
            tabIndex={1}/>
          }
          {
            column.order === (columns.length - 1)
            ?
            <div className="blocked-arrow">
              <ArrowRight 
              tabIndex={2}/>
            </div>
            :
            <ArrowRight 
            onClick={() => editColumnOrder(column.id || '','right')}
            tabIndex={2}/>
          }
      
        </div>
      </div>
    </div>
  );
}

export default Column;
