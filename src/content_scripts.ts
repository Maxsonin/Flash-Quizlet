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
    const lastInputField = inputFields.length > 0 ? inputFields[inputFields.length - 4] as HTMLElement : null;
    if (lastInputField && lastInputField.textContent?.trim() === "") {
        lastInputField.focus();
        lastInputField.textContent = word;
    } else {
        const addCardButton = document.getElementById('addRow') as HTMLElement;
        if (addCardButton) {
            addCardButton.click();
            setTimeout(() => {
                const newInputFields = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
                const newLastInputField = newInputFields[newInputFields.length - 4] as HTMLElement;
                if (newLastInputField) {
                    newLastInputField.textContent = word;
                }
            }, 400);
        } else {
            console.error('Add card button not found.');
        }
    }

    window.scrollTo(0, document.body.scrollHeight);
}