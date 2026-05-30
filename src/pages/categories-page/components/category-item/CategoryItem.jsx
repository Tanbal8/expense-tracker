import { useContext, useRef } from 'react';
import { useStateManager } from '../../../../hooks/customHooks';
import Dialog from '../../../../components/dialog/Dialog';
import { refValidation } from '../../../../utils/validation';
import { focusInput } from '../../../../utils/input';
import { FiTrash2, FiEdit2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import GlobalContext from '../../../../contexts/GlobalContext';
import './category-item.scss';

const CategoryItem = ({ categoryData }) => {
  const { id, name } = categoryData;
  const { expenseCategories, expenseCategoriesOperations, expensesOperations, notification } = useContext(GlobalContext);
  const categoryTitleRef = useRef(null);
  const [state, stateOperations] = useStateManager({
    isEditing: false,
    isDeleting: false,
    dialog: null,
  });

  const deleteHandler = () => {
    if (state.isDeleting) return; // Prevent of several click on delete button
    if (name === 'other') {
      new notification('alert', 'You can\'t remove the "other" category!');
      return;
    }
    stateOperations.toggle('isDeleting');
    // Show dialog
    const messages = [
      `Are you sure you want to delete "${name}"?`,
      'All expenses in this category will be moved to "Other".',
    ];
    const onOk = () => { // Successful delete
      if (!expenseCategories.some(category => category.name === 'other')) expenseCategoriesOperations.add({ name: 'other' });
      expensesOperations.editAllWhere(expense => expense.category === name, { category: 'other' });
      expenseCategoriesOperations.remove(id);
      new notification('success', 'Category deleted!');
    };
    const onCancel = () => {}
    const onClose = () => { // closing the dialog
      stateOperations.set('dialog', null);
    }
    stateOperations.set('dialog', {
      messages,
      onOk,
      onCancel,
      onClose,
    });
  }
  
  const editHandler = () => {
    if (name === 'other') {
      new notification('alert', 'You can\'t edit the "other" category!');
      return;
    }
    stateOperations.toggle('isEditing');
    focusInput(categoryTitleRef.current);
  }

  const confirmEditHandler = () => {
    if (name === 'other') {
      new notification('alert', 'You can\'t edit the "other" category!');
      return;
    }
    if (!categoryTitleRef || !categoryTitleRef.current) { // Ref validation
      new notification('alert', 'Couldn\'t edit the category!');
      return;
    }
    const newCategory = categoryTitleRef.current.value.trim();
    if (newCategory === '') { // Empty input
      new notification('alert', 'Enter a category!');
      return;
    }
    if (expenseCategories.some(category => category.name === newCategory && category.id !== id)) { // Already exists
      new notification('alert', 'This category already exists!');
      return;
    }
    // Successful edit
    stateOperations.toggle('isEditing');
    expenseCategoriesOperations.edit(id, {
      name: newCategory,
    });
    expensesOperations.editAllWhere(expense => expense.category === name, { category: newCategory });
    new notification('success', 'Category Edited');
  }

  const cancelEditHandler = () => {
    if (!refValidation(notification, 'Couldn\'t cancel editing', { categoryTitleRef })) return;
    categoryTitleRef.current.value = name;
    stateOperations.toggle('isEditing');
  }

  const categoryTitleInputKeyDownHandler = (e) => {
    if (e.key === 'Enter') confirmEditHandler();
  }

  return (
    <li className='category-item'>
      <input
        type='text'
        className='category-item-input'
        defaultValue={name}
        readOnly={!state.isEditing}
        ref={categoryTitleRef}
        onDoubleClick={editHandler}
        onKeyDown={categoryTitleInputKeyDownHandler}
      />
      <div className='category-item-options'>
        { name !== 'other' && ( // Hide options for "other"
          // Is editing
          state.isEditing ?
            <>
              <button onClick={cancelEditHandler}>
                  <FiXCircle size={18} />
              </button>
              <button onClick={confirmEditHandler}>
                  <FiCheckCircle size={18} />
              </button>
            </>
            : <> {/* Not editing */}
              <button onClick={editHandler}>
                  <FiEdit2 size={18} />
              </button>
              <button onClick={deleteHandler}>
                  <FiTrash2 size={18} />
              </button>
            </>
          )
        }
      </div>
      {
        state.dialog &&
        <Dialog messages={state.dialog.messages} onOk={state.dialog.onOk} onCancel={state.dialog.onCancel} onClose={state.dialog.onClose} />
      }
    </li>
  );
}

export default CategoryItem;