import React, { useState } from "react";

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
}
const AddColumnInput = (props: CustomInputProps) => {
  const {
    text,
    onSubmit,
    displayClass,
    editClass,
    placeholder,
    defaultValue,
    buttonText,
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState('');

  const inputsHandler = (value:string,name:string) : void => {
    setInputText(value)
  }

  const submission = (e: any) : void => {
    e.preventDefault();
    if (inputText && onSubmit) {
      setInputText('');
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
            value={inputText}
            placeholder={placeholder || 'Title'}
            onChange={(event) => inputsHandler(event.target.value,'title')}
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

export default AddColumnInput;
