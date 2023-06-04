import { useEffect, useState } from "react";
import fetchBoardUsers from "../../http/users/fetchBoardUsers";
import { X ,Check} from "react-feather";

import "./CustomInput.css";
import { IUser } from "../../Interfaces/Kanban";
interface CustomInputProps {
  columnId:string;
  text: string;
  onSubmit: (value: any) => void;
  displayClass?: string;
  editClass?: string;
  placeholder?: string;
  defaultValue?: string;
  buttonText?: string;
  initialState?:{title:string,description:string,assigneeId:string}
}
function CustomInput(props: CustomInputProps) {
  const {
    text,
    onSubmit,
    displayClass,
    editClass,
    placeholder,
    defaultValue,
    buttonText,
    initialState,
    columnId
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [boardUsers,setBoardUsers] = useState<Array<IUser>>([])
  const [selectedUser,setSelectedUser] = useState<string>('')
  const [inputText, setInputText] = useState(initialState || {
    title:'',description:'',assigneeId:''});

  const inputsHandler = (value:string,name:string) : void => {
    setInputText({...inputText,[name]:value})
  }

  const selectUserHandler = (userId:string) : void => {
    selectedUser === userId
    ?
    setSelectedUser('')
    :
    setSelectedUser(userId)
  }

  const submission = (e: any) : void => {
    e.preventDefault();
    if (inputText && onSubmit) {
      setInputText({title:'',description:'',assigneeId:''});
      setSelectedUser('')
      onSubmit({...inputText,assigneeId:selectedUser});
    }
    setIsCustomInput(false);
  };

  useEffect(() => {
    fetchBoardUsers(columnId).then((data : Array<IUser>) => {
      setBoardUsers(data)
    })
  },[])
 
  return (
    <div className="custom-input">
      {isCustomInput ? (
        <form
          className={`custom-input-edit ${editClass ? editClass : ""}`}
          onSubmit={submission}
        >
          <input
            type="text"
            value={inputText.title}
            placeholder={'Title*'}
            onChange={(event) => inputsHandler(event.target.value,'title')}
            autoFocus
          />
          <input
            type="text"
            value={inputText.description}
            placeholder={'Description'}
            onChange={(event) => inputsHandler(event.target.value,'description')}
            autoFocus
          />
          {/* <input
            type="text"
            value={inputText.assigneeId}
            placeholder={'User ID'}
            onChange={(event) => inputsHandler(event.target.value,'assigneeId')}
            autoFocus
          /> */}
          {
            boardUsers.length
            ?
            <>
              <div className="custom-input__list-title">
                Add user:
              </div>
              <div className="custom-input__list">
              {boardUsers.map((user:IUser) => {
                if(user.id === selectedUser){
                  return (
                    <div key={user.id} className="select-user-btn__wrapper">
                      <Check/>
                      <input
                      onClick={() => selectUserHandler(user.id)}
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
                  onClick={() => selectUserHandler(user.id)}
                  className="select-user-btn"
                  type="button"
                  value={user.username}
                  />
                )
              })}
            </div>
            </>
            :
            <>Loading...</>
          }
          <div className="custom-input-edit-footer">
            <input type="submit" value={buttonText || "Add"}/>
            <X onClick={() => setIsCustomInput(false)} className="closeIcon" />
          </div>
        </form>
      ) : (
        <p
          className={`custom-input-display ${displayClass ? displayClass : ""}`}
          onClick={() => setIsCustomInput(true)}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default CustomInput;
