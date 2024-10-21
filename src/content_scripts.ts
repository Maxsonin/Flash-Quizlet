chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "addWordToSet") {
        console.log('Received word to add:', request.word);
        addWordToSet(request.word);
        sendResponse({ success: true, word: request.word });
    }
    return true;
});

function addWordToSet(word: string): void {
    const inputFields = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
    
    const lastInputField = inputFields.length > 0 ? inputFields[inputFields.length - 2] as HTMLElement : null;
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
        // If there are no existing input fields, add a new card
        const addCardButton = document.getElementById('addRow') as HTMLElement;
        if (addCardButton) {
            addCardButton.click();
        } else {
            console.error('Add card button not found.');
        }
    }

    window.scrollTo(0, document.body.scrollHeight);
}