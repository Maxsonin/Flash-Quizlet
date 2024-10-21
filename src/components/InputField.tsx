import React from 'react';
import '../index.css';

interface Props {
  setUrl: string;
  setSetUrl: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

const InputFeild: React.FC<Props> = ({ setUrl, setSetUrl, handleAdd }) => {
  return <form className='input-container' onSubmit={handleAdd}>
    <input type="text"
           value={setUrl}
           onChange={(e) => setSetUrl(e.target.value)}
           placeholder="URL of Flashcard set"
           className="input-container__input"/>
    <button className="input-container__button-submit" type='submit'>Add</button>
  </form>;
};

export default InputFeild;
