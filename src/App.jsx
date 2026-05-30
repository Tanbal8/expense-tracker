import { useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { useDataManager, useLocalStorage, useStateManager } from './hooks/customHooks';
import AppRouter from './routers/AppRouter';
import notification from './utils/notification/notification';
import PersianDate from './utils/PersianDate';
import GlobalContext from './contexts/GlobalContext';
import './App.css';
import './styles/global.scss';
import './styles/variables.css';
import './styles/theme.css';

const App = () => {
  const [expenses, expensesOperations] = useDataManager('expense-tracker-expenses', []);
  const [expenseCategories, expenseCategoriesOperations] = useDataManager('expense-tracker-categories', []);
  const [themeMode, setThemeMode] = useLocalStorage('expense-tracker-theme-mode', 'light');
  const today = PersianDate.today();
  const headerRef = useRef(null);
  const [globalState, globalOperations] = useStateManager({
    showSettingsMenu: false,
    dialog: null,
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, [themeMode]);

  return (
    <GlobalContext value={{
      expenses,
      expensesOperations,
      expenseCategories,
      expenseCategoriesOperations,
      globalState,
      globalOperations,
      themeMode,
      setThemeMode,
      today,
      notification,
      headerRef,
    }}>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </GlobalContext>
  );
}

export default App;
