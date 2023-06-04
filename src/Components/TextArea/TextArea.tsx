import { X } from "react-feather";
import { useState } from "react";
import './textarea.css'

interface CustomInputProps {
  text: string;
  name:string;
  onSubmit: (value: string,name:string) => void;
  displayClass?: string;
  editClass?: string;
  placeholder?: string;
  defaultValue: string;
  buttonText?: string;
}
const TextArea = (props: CustomInputProps) => {
  const {
    text,
    onSubmit,
    displayClass,
    editClass,
    placeholder,
    defaultValue,
    buttonText,
    name
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(defaultValue);

  const inputsHandler = (value:string,name:string) : void => {
    setInputText(value)
  }

  const submission = (e: any) : void => {
    e.preventDefault();
    if (inputText && onSubmit) {
      onSubmit(inputText,name);
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
          <textarea
          className="custom-input__textarea"
            value={inputText}
            placeholder={placeholder || 'Title'}
            onChange={(event) => inputsHandler(event.target.value,name)}
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

export default TextArea;
