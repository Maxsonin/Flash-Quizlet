import React, { useEffect, useRef, useState } from "react";
import '../App.css';
import { FlashcardSet } from "../model";
import { ImCross } from "react-icons/im";
import { MdEdit } from "react-icons/md";

interface Props {   
    set: FlashcardSet;
    sets: Set<FlashcardSet>;
    setSets: React.Dispatch<React.SetStateAction<Set<FlashcardSet>>>;
}   

const SetItem: React.FC<Props> = ({ set, sets, setSets }) => {
    const [edit, setEdit] = useState<boolean>(false); // Handle if in edit mode
    const [editName, setEditName] = useState<string>(set.name); // Handle name in edit mode

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement>, id: number) => {
        e.preventDefault(); e.stopPropagation();

        const updatedSets = new Set(Array.from(sets).filter(set => set.id !== id));
        const firstSet = Array.from(updatedSets)[0];
        
        if (set.isActive && firstSet) {
            firstSet.isActive = true;
        }

        chrome.storage.sync.set({ sets: Array.from(updatedSets) }, () => {
            setSets(updatedSets);
        });
    };

    const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault();

        const updatedSets = new Set(Array.from(sets).map(set => set.id === id ? { ...set, name: editName } : set));
        chrome.storage.sync.set({ sets: Array.from(updatedSets) }, () => {
            setSets(updatedSets);
        });
        setEdit(false);
    };

    const handleSetActive = (id: number) => {
        if (!set.isActive) {
            const updatedSets = new Set(Array.from(sets).map(set => ({...set, isActive: set.id === id})));
            
            chrome.storage.sync.set({ sets: Array.from(updatedSets) }, () => {
                setSets(updatedSets);
            });
        }
    };

    const toggleEdit = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault(); e.stopPropagation();

        if (edit) {
            handleEdit(new Event('submit') as any, set.id);
        }
        setEdit(!edit);
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);


    useEffect(() => {
        inputRef.current?.focus();
    }, [edit]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node) && edit) {
                setEdit(false);
                setEditName(set.name); // Reset to original name
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [edit, set.name]);

    
    return (
      <form className={`list__item ${set.isActive ? 'activeSet' : 'inactiveSet'}`}
            onSubmit={(e) => handleEdit(e, set.id)}
            onClick={() => handleSetActive(set.id)}>
        {
            edit ? <input className="list__item-input" ref={inputRef} type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                 : <span className="list__item-text">
                        {set.name.length > 20 ? `${set.name.slice(0, 20)}...` : set.name}
                   </span>
        }
        <div>
            <span className="icon" onClick={(e) => toggleEdit(e)}><MdEdit /></span> 
            <span className="icon" onClick={(e) => handleDelete(e, set.id)}><ImCross /></span>  
        </div>
      </form>
    );
};


export default SetItem;