import { useState, useRef, useEffect } from "react";
import { FlashcardSet } from "../components/model";

export const useFlashcardActions = (sets: Set<FlashcardSet>, setSets: React.Dispatch<React.SetStateAction<Set<FlashcardSet>>>, set: FlashcardSet) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>(set.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    return {
        edit,
        editName,
        setEditName,
        handleDelete,
        handleEdit,
        handleSetActive,
        toggleEdit,
        inputRef,
        formRef,
    };
};
