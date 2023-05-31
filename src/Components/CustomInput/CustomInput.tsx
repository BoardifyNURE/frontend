import { useState } from "react";
import { X } from "react-feather";

import "./CustomInput.css";
interface CustomInputProps {
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
    initialState
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(initialState || {
    title:'',description:'',assigneeId:''});

  const inputsHandler = (value:string,name:string) : void => {
    setInputText({...inputText,[name]:value})
  }

  const submission = (e: any) : void => {
    e.preventDefault();
    if (inputText && onSubmit) {
      setInputText({title:'',description:'',assigneeId:''});
      onSubmit(inputText);
    }
    setIsCustomInput(false);
  };

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
          <input
            type="text"
            value={inputText.assigneeId}
            placeholder={'User ID'}
            onChange={(event) => inputsHandler(event.target.value,'assigneeId')}
            autoFocus
          />
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
