import React from "react";
import { FlashcardSet } from "./model";
import SetItem from "./SetItem";
import '../index.css';

interface Props {
    sets: Set<FlashcardSet>;
    setSets: React.Dispatch<React.SetStateAction<Set<FlashcardSet>>>;
}

const SetList: React.FC<Props> = ({ sets, setSets }) => {
    return <div className="list">
        {Array.from(sets).map(set => <SetItem set={set} sets={sets} setSets={setSets} />)}
    </div>;
};

export default SetList;