import { useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../../hooks/customHooks';
import ReportsExpenseList from './components/expense-list/ReportsExpenseList';
import ReportsListOptions from './components/reports-list-options/ReportsListOptions';
import GlobalContext from '../../contexts/GlobalContext';
import ReportsPageContext from '../../contexts/ReportsPageContext';
import './reports-page.scss';

const reportsTimeUnits = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];

const ReportsPage = () => {
    const { expenses, today, notification } = useContext(GlobalContext);
    const [activeReportsTimeUnit, setActiveReportsTimeUnit] = useLocalStorage('expense-tracker-active-reports-time-unit', 'Monthly');
    const [listData, setListData] = useState([]);
    
    useEffect(() => {
        const newData = [];
        let currentDate = today.copy();
        const maxYears = 50;
        const maxDays = maxYears * 365;
        let checkedDays = 0;
    
        switch (activeReportsTimeUnit) {
            case 'Daily': {
                while (newData.length < expenses.length && checkedDays < maxDays) {
                    // eslint-disable-next-line no-loop-func
                    const currentDateData = expenses.filter(expense => expense.date === currentDate.toDate().replaceAll('/', '-'));
                    if (currentDateData?.length) {
                        newData.push({
                            title: currentDate.toDate(),
                            data: currentDateData,
                        });
                    }
                    checkedDays++;
                    currentDate = currentDate.previousDay();
                }
                break;
            }
            case 'Weekly': {
                // Go to friday
                while (currentDate.dayNumber !== 6) currentDate = currentDate.nextDay();
                while (newData.length < expenses.length && checkedDays < maxDays) {
                    const weekDaysDate = currentDate.getWeekDays().reverse();
                    currentDate = weekDaysDate.at(-1).previousDay();
                    const weekDays = weekDaysDate.map(date => date.toDate())
                    checkedDays += 7;
                    const currentDateData = weekDays.map(day => expenses.filter(expense => expense.date === day.replaceAll('/', '-'))).flat();
                    if (currentDateData?.length) {
                        newData.push({
                            title: `${weekDays[0]} - ${weekDays.at(-1)}`,
                            data: currentDateData,
                        });
                    }
                }
                break;
            }
            case 'Monthly': {
                do {
                    // eslint-disable-next-line no-loop-func
                    const currentDateData = expenses.filter(expense => expense.date.startsWith(currentDate.toDate().split('/').slice(0, 2).join('-')));
                    if (currentDateData?.length) {
                        newData.push({
                            title: currentDate.toDate().split('/').slice(0, 2).join('/'),
                            data: currentDateData,
                        });
                    }
                    currentDate = currentDate.previousMonth();
                }
                while (newData.length < expenses.length && currentDate.year > today.year - maxYears);
                break;
            }
            case 'Yearly': {
                while ((newData.length < expenses.length) && (currentDate.year >= today.year - maxYears)) {
                    const currentDateData = expenses.filter(expense => expense.date.startsWith(currentDate.year));
                    if (currentDateData?.length) {
                        newData.push({
                            title: currentDate.year,
                            data: currentDateData,
                        });
                    }
                    currentDate.year--;
                }
                break;
            }
            case 'All Time': {
                newData.push({
                    title: 'All time',
                    data: expenses,
                });
                break;
            }
            default: {
                new notification('alert', 'Invalid time unit!');
                break;
            }
        }

        const categories = newData.map(dataInTimeUnit => [...new Set(dataInTimeUnit.data.map(dataInTimeUnitItem => dataInTimeUnitItem.category))]);
        newData.forEach((dataInTimeUnit, index) => {
            dataInTimeUnit.categories = [];
            categories[index].forEach(category => {
                dataInTimeUnit.categories.push({
                    title: category,
                    expense: dataInTimeUnit.data.filter(dataItem =>
                        dataItem.category === category).map(dataItem =>
                            dataItem.expense).reduce((acc, cur) => acc + cur, 0),
                });
            });
            dataInTimeUnit.categories.sort((item1, item2) => item2.expense - item1.expense);
            dataInTimeUnit.total = dataInTimeUnit.categories.reduce((acc, cur) => acc + cur.expense, 0);
        });
        
        setListData(newData);
    }, [activeReportsTimeUnit, expenses, today, notification]);
    
    return (
        <ReportsPageContext value={{
            activeReportsTimeUnit,
            setActiveReportsTimeUnit,
            listData,
        }}>
            <div id='reports-page'>
                <div id='reports-page-expense-list-container'>
                    { expenses?.length > 0 ?
                        <>
                            <ReportsListOptions />
                            <ReportsExpenseList />
                        </>
                        : <div className='empty-text'>No data found!</div>
                    }
                </div>
            </div>
        </ReportsPageContext>
    );
}

export default ReportsPage;
export {
    reportsTimeUnits,
};