import React from "react";
import { FlashcardSet } from "./model";
import { ImCross } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import { useFlashcardActions } from "../hooks/useFlashcardActions";

interface Props {   
    set: FlashcardSet;
    sets: Set<FlashcardSet>;
    setSets: React.Dispatch<React.SetStateAction<Set<FlashcardSet>>>;
}   

const SetItem: React.FC<Props> = ({ set, sets, setSets }) => {
    const { 
        edit, editName, setEditName, handleDelete, handleEdit, handleSetActive, toggleEdit, inputRef, formRef 
    } = useFlashcardActions(sets, setSets, set);

    return (
      <form className={`list__item ${set.isActive ? 'active' : 'inactive'}`}
            ref={formRef}
            onSubmit={(e) => handleEdit(e, set.id)}
            onClick={() => handleSetActive(set.id)}>
        {
            edit ? <input className="list__item-input" ref={inputRef} type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                 : <span className="list__item-text">
                        {set.name.length > 20 ? `${set.name.slice(0, 20)}...` : set.name}
                   </span>
        }
        <div>
            <span className="list__item-icon" onClick={(e) => toggleEdit(e)}><MdEdit /></span> 
            <span className="list__item-icon" onClick={(e) => handleDelete(e, set.id)}><ImCross /></span>  
        </div>
      </form>
    );
};

export default SetItem;
