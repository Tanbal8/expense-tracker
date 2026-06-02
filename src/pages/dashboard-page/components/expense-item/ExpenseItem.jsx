import { useContext, useRef, useState } from 'react';
import { useStateManager } from '../../../../hooks/customHooks';
import DateInput from '../../../../components/date-input/DateInput';
import PersianDate from '../../../../utils/PersianDate';
import { inputTextValidation, refValidation } from '../../../../utils/validation';
import { dateInputKeyDownHandler } from '../../../../utils/date';
import { onDragEnd, onDragOver, onDragStart, onDrop } from '../../../../utils/drag';
import { focusInput } from '../../../../utils/input';
import { FiCheckCircle, FiXCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import GlobalContext from '../../../../contexts/GlobalContext';
import DashboardPageContext from '../../../../contexts/DashboardPageContext';
import './expense-item.scss';

const ExpenseItem = ({ expenseData }) => {
    const { id, title, expense, category, date, dayNumber } = expenseData;
    const { expenses, expensesOperations, expenseCategories, expenseCategoriesOperations, notification } = useContext(GlobalContext);
    const { autoSortCheck } = useContext(DashboardPageContext);
    const [year, month, day] = date.split('-').map(timeUnit => parseInt(timeUnit));
    const [currentDate, setCurrentDate] = useState(new PersianDate(year, month, day, dayNumber));
    const titleInputRef = useRef(null);
    const expenseInputRef = useRef(null);
    const dateInputRef = useRef(null);
    const categorySelectRef = useRef(null);
    const inputs = [titleInputRef, expenseInputRef, dateInputRef, categorySelectRef];
    const [state, stateOperations] = useStateManager({
        isEditing: false,
        isDeleting: false,
    });

    const deleteHandler = () => { // Delete
        if (state.isDeleting) return; // Prevent of several click on delete button
        stateOperations.toggle('isDeleting');
        const isLastItemOfCategory = expenses.filter(expense => expense.category === category).length === 1;
        setTimeout(() => { // Timeout for animation
            expensesOperations.remove(id);
            if (category !== 'other' && isLastItemOfCategory) {
                const categoryId = expenseCategories.find(categoryItem => categoryItem.name === category).id;
                expenseCategoriesOperations.remove(categoryId);
            }
            new notification('success', 'Expense deleted!');
        }, 200);
    }

    const editHandler = () => { // Edit
        const result = refValidation(notification, 'Error', {
            expenseValue: expenseInputRef,
        });
        if (!result) return;
        const { expenseValue } = result;
        expenseInputRef.current.value = expenseValue.replaceAll(',', '');
        stateOperations.toggle('isEditing'); // Toggle edit status
    }

    const confirmEditHandler = () => { // Confirm edit
        const result = inputTextValidation(notification, 'Couldn\'t edit the expense', 'Empty input!', {
            newTitle: titleInputRef,
            newExpenseString: expenseInputRef,
            newDate: dateInputRef,
            newCategory: categorySelectRef,
        });
        if (!result) return;
        const { newTitle, newExpenseString, newDate, newCategory } = result;
        const newExpense = parseInt(newExpenseString);
        if (!newExpense) {
            new notification('alert', 'Invalid amount!');
            return;
        }
        // Successful edit
        stateOperations.toggle('isEditing'); // Toggle edit status
        expensesOperations.edit(id, {
            title: newTitle,
            expense: newExpense,
            date: newDate.replaceAll('/', '-'),
            category: newCategory,
        });

        // Delete category if it will be empty
        const isLastItemOfCategory = category !== 'other' &&
            newCategory !== category &&
            expenses.filter(expense => expense.category === category).length === 1;
        if (isLastItemOfCategory) expenseCategoriesOperations.remove(expenseCategories.find(category => category.name === category)?.id || 0);

        expenseInputRef.current.value = newExpense.toLocaleString();
        focusInput(titleInputRef.current);
        new notification('success', 'Expense edited!');
    }

    const cancelEditHandler = () => {
        if (!refValidation(notification, 'Couldn\'t cancel editing!', {
            titleInputRef,
            expenseInputRef,
            dateInputRef,
            categorySelectRef,

        })) return;
        setCurrentDate(new PersianDate(year, month, day, dayNumber));
        titleInputRef.current.value = title;
        expenseInputRef.current.value = expense.toLocaleString();
        categorySelectRef.current.value = category;
        stateOperations.toggle('isEditing');
    }

    const expenseItemOnDrop = (fromId, toId) => {
        const fromIndex = expenses.findIndex(expense => expense.id === fromId);
        const toIndex = expenses.findIndex(expense => expense.id === toId);
        expensesOperations.changeOrder(fromIndex, toIndex);
    }

    const keyDownHandler = (e, ref) => {
        if (e.key === 'Enter') {
            if (inputs.slice(0, -1).includes(ref)) inputs[inputs.indexOf(ref) + 1].current.focus(); // Focus next input
            else if (inputs.at(-1) === ref) confirmEditHandler();
        }
    }

    const doubleClickHandler = (e) => {
        if (!refValidation(notification, 'Error', {...inputs})) return;
        const { target } = e;
        if (inputs.map(input => input.current).includes(target)) target.focus();
        !state.isEditing && editHandler()
    }

    return (
        <tr
            className='expense-item'
            draggable={!autoSortCheck}
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={(e) => onDrop(e, id, expenseItemOnDrop)}
            onDoubleClick={doubleClickHandler}
        >
            {/* Title */}
            <td className='expense-item-title-container'>
                <input
                    className='expense-item-title'
                    name='expense-item-title'
                    defaultValue={title}
                    readOnly={!state.isEditing}
                    ref={titleInputRef}
                    onKeyDown={e => keyDownHandler(e, titleInputRef)}
                />
            </td>
            {/* Expense */}
            <td className='expense-item-expense-container'>
                <input
                    className='expense-item-expense'
                    name='expense-item-expense'
                    defaultValue={state.isEditing ? expense : expense.toLocaleString() }
                    readOnly={!state.isEditing}
                    ref={expenseInputRef}
                    onKeyDown={e => keyDownHandler(e, expenseInputRef)}
                />
            </td>
            {/* Date */}
            <td className='expense-item-date-container'>
                <DateInput
                    ref={dateInputRef}
                    activeDate={currentDate}
                    setActiveDate={setCurrentDate}
                    showOptionsCondition={state.isEditing}
                    valueCallback={date => date.toDate()}
                    iconSize={9}
                    name='expense-item-date'
                    canFocus={state.isEditing}
                    onDoubleClick={() => { !state.isEditing && editHandler() }}
                    keyDownCallback={e => {
                        keyDownHandler(e, dateInputRef);
                        state.isEditing && dateInputKeyDownHandler(e, currentDate, setCurrentDate, notification);
                    }}
                />
            </td>
            {/* Categories */}
            <td className='expense-item-category-container'>
                <select
                    className='expense-item-category'
                    name='expense-item-category'
                    defaultValue={category}
                    disabled={!state.isEditing}
                    ref={categorySelectRef}
                    onKeyDown={e => keyDownHandler(e, categorySelectRef)}
                >
                    { expenseCategories.map(category => (
                        <option key={category.id} value={category.name}>{ category.name }</option>
                    )) }
                </select>
            </td>
            {/* Options */}
            <td className='expense-item-options'>
                { state.isEditing ? // Is editing
                    <>
                        <button onClick={cancelEditHandler}>
                            <FiXCircle size={17} />
                        </button>
                        <button onClick={confirmEditHandler}>
                            <FiCheckCircle size={17} />
                        </button>
                    </>
                    : <> {/* Not editing */}
                        <button onClick={editHandler}>
                            <FiEdit2 size={17} />
                        </button>
                        <button onClick={deleteHandler}>
                            <FiTrash2 size={17} />
                        </button>
                    </>
                }
            </td>
        </tr>
    );
}

export default ExpenseItem;