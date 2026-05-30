import { useContext } from 'react';
import CategotyItem from '../category-item/CategoryItem';
import GlobalContext from '../../../../contexts/GlobalContext';
import './category-list.scss';

const CategoryList = () => {
  const { expenseCategories } = useContext(GlobalContext);

  return (
    expenseCategories?.length > 0 ?
      <ul id='category-list'>
      {
        expenseCategories.map(category => (
          <CategotyItem categoryData={category} key={category.id} />
        ))
      }
      </ul>
      : <div className='empty-text'>No categories found!</div>
  );
}

export default CategoryList;