import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage, useStateManager } from '../../hooks/customHooks';
import StatsSection from './components/stats-section/StatsSection';
import AddExpenseForm from './components/add-expense-form/AddExpenseForm';
import ExpenseList from './components/expense-list/ExpenseList';
import ListOptions from './components/list-options/ListOptions';
import GlobalContext from '../../contexts/GlobalContext';
import DashboardPageContext from '../../contexts/DashboardPageContext';
import './dashboard-page.scss';

const DashboardPage = () => {
    const [autoSortCheck, setAutoSortCheck] = useLocalStorage('expense-tracker-auto-sort', true);
    const { expenses, expensesOperations } = useContext(GlobalContext);
    const [filters, filtersOperations] = useStateManager({
        searchValue: '',
        showFilterForm: false,
        category: 'All',
        dateRange: {
            from: null,
            to: null,
        },
        expenseRange: {
            from: null,
            to: null,
        },
    });

    const autoSort = useCallback((reverseCheck) => {
        expensesOperations.sort((expense1, expense2) => {
            const dateCompare = expense2.date.localeCompare(expense1.date);
            if (dateCompare) return dateCompare; // Different dates
            return expense2.expense - expense1.expense; // Same date
        }, reverseCheck);
    }, [expensesOperations]);

    const filteredExpenses = useMemo(() => expenses.filter(expense =>
        // Search
        expense.title.toLowerCase().includes(filters.searchValue.toLowerCase()) &&
        // Category
        (filters.category === 'All' || expense.category === filters.category) &&
        // Date range
        (!filters.dateRange.from || expense.date >= filters.dateRange.from) &&
        (!filters.dateRange.to || expense.date <= filters.dateRange.to) &&
        // Expense range
        (!filters.expenseRange.from || expense.expense >= filters.expenseRange.from) &&
        (!filters.expenseRange.to || expense.expense <= filters.expenseRange.to)
    ), [expenses, filters]);

    useEffect(() => {
        if (!autoSortCheck) return;
        autoSort(false);
    }, [autoSortCheck, expenses, autoSort]);

    return (
        <DashboardPageContext value={{
            autoSortCheck,
            setAutoSortCheck,
            autoSort,
            filters,
            filtersOperations,
            filteredExpenses,
        }}>
            <div id='dashboard-page'>
                <section id='dashboard-page-expenses-information'>
                    <StatsSection />
                    <AddExpenseForm />
                </section>
                <section id='dashboard-page-expense-list'>
                    <ListOptions />
                    <ExpenseList />
                </section>
            </div>
        </DashboardPageContext>
    );
}

export default DashboardPage;