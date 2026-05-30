import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import ExpenseItem from '../expense-item/ExpenseItem';
import GlobalContext from '../../../../contexts/GlobalContext';
import DashboardPageContext from '../../../../contexts/DashboardPageContext';
import './expense-list.scss';

const ExpenseList = () => {
    const { headerRef } = useContext(GlobalContext);
    const { filteredExpenses, autoSortCheck } = useContext(DashboardPageContext);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        setHeaderHeight(headerRef?.current?.offsetHeight || 0);
    }, [headerRef]);

    return (
        filteredExpenses?.length > 0 ?
            <table id='expense-list'>
                <caption>Expenses</caption>
                <thead style={{ top: headerHeight }}>
                    <tr>
                        <th>Title</th>
                        <th>Expense</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { filteredExpenses.map((expense, index) => (
                        <React.Fragment key={`expense-${expense.id}`}>
                            {/* Day row */}
                            { autoSortCheck && expense.date.split('-')[2] !== filteredExpenses[index - 1]?.date.split('-')[2] &&
                                <tr className='date-row'>
                                    <th colSpan={5}>{ expense.date.replaceAll('-', '/') }</th>
                                </tr>
                            }
                            {/* Expense item */}
                            <ExpenseItem expenseData={expense} />
                        </React.Fragment>
                    )) }
                </tbody>
            </table>
            : <div id='no-data-found'>No data found!</div>
    );
}

export default ExpenseList;