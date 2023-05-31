import { FC } from "react"
import { ICard, ITodos } from "../../Interfaces/Kanban"
import { Edit,Trash,ArrowDown,ArrowUp} from "react-feather"

interface IProps {
    card:ICard,
    updateTodos:(id:string,value:boolean) => Promise<void>,
    editTodoContent:(id:string,value:string) => Promise<void>,
    confrimEditTodoContent:(id:string) => Promise<void>,
    editTodoMode:(id:string) => Promise<void>,
    removeTodos:(id:string) => Promise<void>,
    editCardOrder:(id:string,action: 'up' | 'down') => Promise<void>
}

const Todos : FC<IProps> = ({
        card,
        updateTodos,
        editTodoContent,
        confrimEditTodoContent,
        editTodoMode,
        removeTodos,
        editCardOrder
    }) => {
    console.log(card.todos)
    return (
        <div className="cardinfo-box-task-list">
            {
            card.todos?.map((item:ITodos) => (
                <div key={item.id} className="cardinfo-box-task-checkbox">
                    <input
                        className="cardinfo-box-task-checkbox-input"
                        type="checkbox"
                        defaultChecked={item.is_done}
                        onChange={(event) =>
                            updateTodos(item.id, event.target.checked)
                        }
                    />
                    {
                        item.is_edit
                            ?
                            <input
                                className="cardinfo-box-task-text-input"
                                type="text"
                                value={item.content}
                                onChange={(e: any) => editTodoContent(item.id, e.target.value)}
                            />
                            :
                            <p className={item.is_done ? "completed" : ""}>{item.content}</p>
                    }
                    {
                        item.is_edit
                            ?
                            <input
                                className="cardinfo-box-task-confirm"
                                onClick={() => confrimEditTodoContent(item.id)}
                                type="button"
                                value={'Confrim'}
                            />
                            :
                            <div className="cardinfo-box-task-btns">
                                <ArrowUp onClick={() => editCardOrder(item.id,'up')}/>
                                <ArrowDown onClick={() => editCardOrder(item.id,'down')}/>
                                <Edit tabIndex={1} onClick={() => editTodoMode(item.id)} />
                                <Trash tabIndex={2} onClick={() => removeTodos(item.id)} />
                            </div>
                    }
                </div>
            ))}
        </div>
    )
}

export default Todos