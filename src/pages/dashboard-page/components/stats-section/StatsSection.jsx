import { useContext } from 'react';
import StatCard from './stat-card/StatCard';
import { sum } from '../../../../utils/array';
import GlobalContext from '../../../../contexts/GlobalContext';
import './stats-section.scss';

const StatsSection = () => {
    const { expenses, expenseCategories, today } = useContext(GlobalContext);
    if (expenses?.length === 0) return;
    const thisWeekDays = today.getWeekDays();
    const highestExpense = Math.max(...(expenses.map(expense => expense?.expense) || [0])) || '-';
    const highestExpenseTitle = expenses.find(expense => expense.expense === highestExpense)?.title;
    const expensesCount = expenses.length;
    const categoriesExpenses = expenseCategories.map(category => ({
        name: category.name,
        expense: sum(expenses.filter(expense => expense.category === category.name))
    }));
    const topCategory = categoriesExpenses.sort((category1, category2) => category2.expense - category1.expense);
    const topCategoryName = topCategory?.[0]?.name || '-';
    const topCategoryExpense = topCategory?.[0]?.expense || '-';
    const dateToObject = (date) => {
        const [year, month, day] = date.split('-').map(timeUnit => parseInt(timeUnit));
        return {year, month, day};
    }
    
    
    const stats = [
        {
            title: 'Total',
            contents: [sum(expenses)],
        },
        {
            title: 'Today',
            contents: [sum(expenses.filter(expense =>
                today.sameDay(dateToObject(expense.date))
            ))],
        },
        {
            title: 'This Week',
            contents: [sum(expenses.filter(expense =>
                thisWeekDays.some(date =>
                    date.sameDay(dateToObject(expense.date))
                )
            ))],
        },
        {
            title: 'This Month',
            contents: [sum(expenses.filter(expense => {
                const date = dateToObject(expense.date);
                return date.year === today.year && date.month === today.month;
            }))],
        },
        {
            title: 'Highest Expense',
            contents: [
                highestExpense,
                highestExpenseTitle
            ],
        },
        {
            title: 'Average Expense',
            contents: [parseInt(sum(expenses) / expensesCount) || '-'],
        },
        {
            title: 'Transactions',
            contents: [expensesCount],
        },
        {
            title: 'Top Category',
            contents: [
                topCategoryName,
                topCategoryExpense,
            ]
        },
    ];

    return (
        <section id='stats-section'>
            {
                stats.map(statItem => (
                    <div key={statItem.title}>
                        <StatCard statData={statItem} />
                    </div>
                ))
            }
        </section>
    );
}

export default StatsSection;