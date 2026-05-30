const refValidation = (notification, errorMessage = 'Error!', refs) => {
    if (!refs) return null;
    const isValid = Object.values(refs).every(ref => ref && ref.current);
    if (!isValid) {
        new notification('alert', errorMessage);
        return null;
    }
    const keys = Object.keys(refs);
    const result = {};
    keys.forEach(key =>
        result[key] = refs[key].current.value.trim()
    );
    return result;
}

const emptyValuesValidation = (notification, errorMessage = 'Empty Input!', ...values) => {
    const isValid = values.every(value => value !== '');
    !isValid && new notification('alert', errorMessage);
    return isValid;
}

const inputTextValidation = (notification, refErrorMessage, emptyErrorMessage, inputs) => {
    const newValues = refValidation(notification, refErrorMessage, inputs);
    if (!newValues) return null;
    if (!emptyValuesValidation(notification, emptyErrorMessage, ...Object.values(newValues))) return null;
    return newValues;
}

const importedDataValidation = (expenses, expenseCategories) => {
    // Existance check
    if (!expenses || !expenseCategories) return false;
    // Empty check
    if (expenses.length === 0 || expenseCategories.length === 0) return false;
    // Expenses every properties
    if (!expenses.every(expense => expense.id && expense.title && expense.expense && expense.category && expense.date)) return false;
    // Categories every properties
    if (!expenseCategories.every(category => category.id && category.name)) return false;
    return true;
}

export {
    refValidation,
    emptyValuesValidation,
    inputTextValidation,
    importedDataValidation,
};