import CategoryList from './components/category-list/CategoryList';
import './categories-page.scss';

const CategoriesPage = () => {
  return (
    <div id='categories-page'>
      <h2>Categories</h2>
      <CategoryList />
    </div>
  );
}

export default CategoriesPage;