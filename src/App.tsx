import React from 'react';
import './index.css';
import InputField from "./components/InputField";
import SetList from "./components/SetList";
import { useFlashcardSets } from './hooks/useFlashcardSets';

const App: React.FC = () => {
  const { setUrl, setSetUrl, inputError, handleAdd, sets, setSets } = useFlashcardSets();

  return (
    <>
      <div className="title-container">
        <h1 className="title-container__title">Flashcard Sets Manager</h1>
        <h3 className="title-container__subtitle">Select Default Set for Adding New Words</h3>
      </div>

      <SetList sets={sets} setSets={setSets}/>

      <p className="error-message">{inputError}</p>
      <InputField setUrl={setUrl} setSetUrl={setSetUrl} handleAdd={handleAdd}/>
    </>
  );
};

export default App;
