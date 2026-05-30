const exportData = (expenses, expenseCategories, notification) => {
    if (!expenses || !expenseCategories) {
        new notification('alert', 'Invalid data to export!');
        return;
    }
    if (expenses.length === 0 || expenseCategories.length === 0) {
        new notification('alert', 'Empty data!');
        return;
    }
    const data = {
        expenses,
        expenseCategories,
        version: "1.0",
        exportDate: new Date().toISOString(),
    }
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
    a.href = url;
    a.download = `expense-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    new notification('success', 'Data exported!');
}

export {
    exportData,
}