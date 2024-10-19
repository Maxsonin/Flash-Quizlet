chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "addWordToSet") {
        console.log('Received word to add:', request.word);
        addWordToSet(request.word);
        sendResponse({ success: true, word: request.word });
    }
    return true;
});

function addWordToSet(word: string): void {
    const addCardButton = document.getElementById('addRow') as HTMLElement;
    if (addCardButton) {
        addCardButton.click();  // Add a new Flashcard

        // Function to focus and insert the word into the last input field
        const focusAndInsert = (): void => {
            const inputFields = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
            const lastInputField = inputFields[inputFields.length - 2] as HTMLElement;

            if (lastInputField) {
                lastInputField.focus();

                const range = document.createRange();
                const selection = window.getSelection();

                if (selection) {
                    range.selectNodeContents(lastInputField);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    lastInputField.textContent += word;

                    // Reset caret position to the end of the input field
                    const newRange = document.createRange();
                    newRange.selectNodeContents(lastInputField);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            } else {
                console.error('Last input field not found after adding card.');
            }
        };

        // Use MutationObserver to wait for the input field to appear
        const observer = new MutationObserver((_mutations) => {
            const inputFields = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
            if (inputFields.length > 0) {
                observer.disconnect(); // Stop observing once input field is found
                focusAndInsert(); // Call the function to focus and insert the word
            }
        });

        // Start observing the DOM for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.scrollTo(0, document.body.scrollHeight);
    } else {
        console.error('Add card button not found.');
    }
}
