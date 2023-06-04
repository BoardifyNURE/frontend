import { useEffect, useState } from "react";
import { X ,Check} from "react-feather";
import { IUser } from "../../Interfaces/Kanban";
import UserList from "../UserList/UserList";
import fetchBoardUsers from "../../http/users/fetchBoardUsers";
import "./CustomInput.css";


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
  const [selectedUser,setSelectedUser] = useState<IUser>({email:'',username:'',id:''})
  const [inputText, setInputText] = useState(initialState || {
    title:'',description:'',assigneeId:''});

  const inputsHandler = (value:string,name:string) : void => {
    setInputText({...inputText,[name]:value})
  }

  const selectUserHandler = (userId:IUser) : void => {
    selectedUser === userId
    ?
    setSelectedUser({email:'',username:'',id:''})
    :
    setSelectedUser(userId)
  }

  const submission = (e: any) : void => {
    e.preventDefault();
    if (inputText && onSubmit) {
      setInputText({title:'',description:'',assigneeId:''});
      setSelectedUser({email:'',username:'',id:''})
      onSubmit({...inputText,assigneeId:selectedUser?.id});
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
          {
            boardUsers.length
            ?
            <>
              <div className="custom-input__list-title">
                Add user:
              </div>
              <div className="custom-input__list">
              <UserList
              selectedUser={selectedUser}
              selectUserHandler={selectUserHandler}
              boardUsers={boardUsers}
              />
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
