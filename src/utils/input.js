const focusInput = (input) => {
    const valueLength = input.value.length;
    input.focus();
    input.setSelectionRange(valueLength, valueLength);
}

export {
    focusInput,
};