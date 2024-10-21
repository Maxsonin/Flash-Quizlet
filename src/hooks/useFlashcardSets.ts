import { useState, useEffect } from 'react';
import { FlashcardSet } from '../components/model';

export const useFlashcardSets = () => {
  const [setUrl, setSetUrl] = useState<string>("");  // Handle user input
  const [inputError, setInputError] = useState<string>("");  // Handle error showcase
  const [sets, setSets] = useState<Set<FlashcardSet>>(new Set()); // Handle list of sets

  useEffect(() => {
    // Load saved sets from browser storage
    chrome.storage.sync.get('sets', (data) => {
      setSets(new Set(data.sets || []));
    });
  }, []);

  function extractIdAndName(url: string) {
    let id, namePart;
    const urlParts = url.split('/');
    if (urlParts.length === 7) {
        id = parseInt(urlParts[4]);
        namePart = urlParts[5];
    } else {
        id = parseInt(urlParts[3]);
        namePart = urlParts[4];
    }
    // Remove 'flash-cards' and replace '-' with ' ' between words
    const name = namePart.split('-').slice(0, -2).join('-').replace(/-/g, ' ');

    return { id, name };
}

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();    

    const urlPattern1 = /^https:\/\/quizlet.com\/.*\/\d+\/.*flash-cards.*$/;
    const urlPattern2 = /^https:\/\/quizlet.com\/\d+\/.*flash-cards.*$/;

    if (setUrl && (urlPattern1.test(setUrl.trim()) || urlPattern2.test(setUrl.trim()))) {
        let { id, name } = extractIdAndName(setUrl);
        if (!name) name = `set${sets.size + 1}`; // Default name if not found in URL
        const isActive = sets.size === 0; // Only set active if it's the first one

        const newSet: FlashcardSet = { id, name, isActive };
        
        const alreadyExists = Array.from(sets).some((set) => set.id === id);
        if (alreadyExists) {
            setInputError("Set already in the list!");
        } else {
            const updatedSets = new Set(sets);
            updatedSets.add(newSet);

            chrome.storage.sync.set({ sets: Array.from(updatedSets) }, () => {
                if (chrome.runtime.lastError) {
                    setInputError(`Error saving sets: ${chrome.runtime.lastError.message}`);
                } else {
                    setSets(updatedSets);
                    setSetUrl(""); setInputError(""); // Clear
                }
            });
        }
    } else {
        setInputError("Incorrect URL!");
    }     
  };


  return { setUrl, setSetUrl, inputError, handleAdd, sets, setSets };
};
