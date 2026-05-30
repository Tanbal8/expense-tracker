import { useContext, useRef, useState } from 'react';
import DateInput from '../../../../components/date-input/DateInput';
import { inputTextValidation, emptyValuesValidation } from '../../../../utils/validation';
import { focusInput } from '../../../../utils/input';
import { FcPlus } from 'react-icons/fc';
import GlobalContext from '../../../../contexts/GlobalContext';
import './add-expense-form.scss';

const AddExpenseForm = () => {
  const { expensesOperations, expenseCategories, expenseCategoriesOperations, today, notification } = useContext(GlobalContext);
  const [currentCategory, setCurrentCategory] = useState(expenseCategories[0]?.name || addCategory);
  const titleInputRef = useRef(null);
  const expenseInputRef = useRef(null);
  const categorySelectRef = useRef(null);
  const categoryInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const [activeDate, setActiveDate] = useState(today);

  const submitButtonClickHandler = e => {
    e.preventDefault(); /* Prevent of submiting data */
    try {
      // inputs validation
      const result = inputTextValidation(
        notification,
        'Couldn\'t add the expense',
        'Empty input!',
        {
          title: titleInputRef,
          expense: expenseInputRef,
        }
      );
      if (!result) throw new Error();
      const { title: newTitle, expense: newExpenseString } = result;
      const newExpense = parseInt(newExpenseString);
      if (isNaN(newExpense)) {
        new notification('alert', 'Invalid amount!');
        focusInput(expenseInputRef.current);
        return;
      }

      // Select category empty validation
      if (!emptyValuesValidation(notification, 'Empty input!', currentCategory)) {
        focusInput(titleInputRef.current);
        return;
      }

      let newCategory;
      if (currentCategory === addCategory) {
        // Category input validation
        const result = inputTextValidation(
          notification,
          'Couldn\'t add the expense!',
          'Enter a category',
          {
            category: categoryInputRef,
          },
        )
        if (!result) throw new Error();;
        newCategory = result.category;
        // Already exists category
        if (expenseCategories.find(categoryItem => categoryItem.name === newCategory)) {
          new notification('alert', 'This category already exists');
          focusInput(categoryInputRef.current);
          return;
        } 
        expenseCategoriesOperations.add({ name: newCategory });
        setCurrentCategory(newCategory);
      }
      else newCategory = currentCategory;
      const [year, month, day] = activeDate.toDate().split('/');
      // Successful add
      expensesOperations.add({
        title: newTitle,
        expense: newExpense,
        category: newCategory,
        date: [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-'),
        dayNumber: activeDate.dayNumber,
      });
      titleInputRef.current.value = '';
      expenseInputRef.current.value = '';
      titleInputRef.current.focus();
      new notification('success', 'Expense added!');
    }
    catch {
      return;
    }
  }

  /*  */
  const keyDownHandler = (e, key, options) => {
    const { callback = () => {} } = options;
    callback(e);
    if (e.key !== key) return; // Key validation
    if (options.submit) submitButtonClickHandler(e);
    else {
      const { ref, nextRef } = options;
      if (nextRef?.current && // Target ref validation
        ref?.current && // Current ref validation
        ref.current.value.trim() !== '' // Empty input validation
      ) {
        nextRef.current.focus();
      }
    }
  }

  const categorySelectChangeHandler = e => {
    const newCurrentCategory = e.target.value;
    setCurrentCategory(newCurrentCategory);
    if (newCurrentCategory === addCategory) setTimeout(() => { categoryInputRef?.current?.focus() }, 10);
  }

  const categorySelectKeyDownHandler = e => {
    if (e.key !== 'Enter') return;
    if (currentCategory === addCategory) setTimeout(() => { categoryInputRef?.current?.focus() }, 0);
    else submitButtonClickHandler(e);
  }
  return (
    <form id='add-expense-form'>
      {/* Form title */}
      <div id='add-expense-form-title-container'>
        <FcPlus size={20} />
        <h2 id='add-expense-form-title'>Add new expense</h2>
      </div>
      <div id='add-expense-form-inputs-container'>
        {/* Title input */}
        <div>
          <label htmlFor='add-expense-form-title-input'>Title:</label>
          <input
            type='text'
            id='add-expense-form-title-input'
            placeholder='Enter Title...'
            ref={titleInputRef}
            onKeyDown={e => keyDownHandler(e, 'Enter', {
              ref: titleInputRef,
              nextRef: expenseInputRef
            })}
          />
        </div>
        {/* Expense input */}
        <div>
          <label htmlFor='add-expense-form-expense-input'>Expense:</label>
          <input
            type='text'
            id='add-expense-form-expense-input'
            placeholder='Enter expense...'
            ref={expenseInputRef}
            onKeyDown={e => keyDownHandler(e, 'Enter', {
              ref: expenseInputRef,
              nextRef: dateInputRef
            })}
          />
        </div>
        {/* Date input */}
        <div id='add-expense-form-date-input-container'>
          <label htmlFor='add-expense-form-date-input'>Date:</label>
          <DateInput
            id='add-expense-form-date-input'
            inputRef={dateInputRef}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            valueCallback={date => date.toStringDayMonth()}
            keyDownCallback={e => keyDownHandler(e, 'Enter', {
                ref: dateInputRef,
                nextRef: categorySelectRef,
            })}
          />
        </div>
        {/* Category select */}
        <div id='add-expense-form-category-container'>
          <label htmlFor='add-expense-form-category-select'>Category:</label>
          <select
            id='add-expense-form-category-select'
            value={currentCategory}
            ref={categorySelectRef}
            onChange={categorySelectChangeHandler}
            onKeyDown={categorySelectKeyDownHandler}
          >
            { expenseCategories.map(category => (
              <option key={category.id}>{ category.name }</option>
            )) }
            <option>{ addCategory }</option>
          </select>
          {/* New category input */}
          { currentCategory === addCategory &&
            <input
              type='text'
              id='add-expense-form-new-category-input'
              placeholder='Enter new category...'
              ref={categoryInputRef}
              onKeyDown={e => keyDownHandler(e, 'Enter', {
                submit: true,
              })}
            />
          }
        </div>
      </div>
      {/* Submit button */}
      <div id='add-expense-form-button-container'>
        <button
          type='button'
          id='add-expense-form-button'
          onClick={submitButtonClickHandler}
        >Add Expense</button>
      </div>
    </form>
  );
}

const addCategory = 'Add Category';

export default AddExpenseForm;