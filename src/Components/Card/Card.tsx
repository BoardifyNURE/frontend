import {useState } from "react";
import { AlignLeft, CheckSquare, MoreHorizontal } from "react-feather";
import { ICard } from "../../Interfaces/Kanban";
import Dropdown from "../Dropdown/Dropdown";
import CardInfo from "./CardInfo/CardInfo";
import "./Card.css";


interface CardProps {
  card: ICard;
  column_id: string;
  removeCard: (boardId: string, cardId: string) => void;
  onDragEnd: (boardId: string, cardId: string) => void;
  onDragEnter: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard,isLocal?:boolean) => void;
}


function Card(props: CardProps) {
  const { card, column_id, removeCard, onDragEnd, onDragEnter, updateCard } =
    props;
  const { id, title, description, todos,  } = card;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={card}
          boardId={column_id}
          updateCard={updateCard}
        />
      )}
      <div
        className="card"
        key={card.id}
        draggable
        onDragEnd={() => onDragEnd(column_id, id)}
        onDragEnter={() => onDragEnter(column_id, id)}
        onClick={() => setShowModal(true)}
      >
        <div className="card-top">
          <div
            className="card-top-more"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown((prev:boolean) => !prev);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <input
                type="button"
                value={'Delete Card'}
                onClick={() => removeCard(column_id, id)} 
                />
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card-title">{title}</div>
        <div>
          <p title={description}>
            <AlignLeft />
          </p>
        </div>
        <div className="card-footer">
          {todos && todos?.length > 0 && (
            <p className="card-footer-item">
              <CheckSquare className="card-footer-icon" />
              {todos?.filter((item) => item.is_done)?.length}/{todos?.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
