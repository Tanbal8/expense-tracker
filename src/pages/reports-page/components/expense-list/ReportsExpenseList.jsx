import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../../contexts/GlobalContext';
import ReportsPageContext from '../../../../contexts/ReportsPageContext';
import './reports-expense-list.scss';

const ReportsExpenseList = () => {
    const { headerRef } = useContext(GlobalContext);
    const { listData, activeReportsTimeUnit } = useContext(ReportsPageContext);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        setHeaderHeight(headerRef?.current?.offsetHeight || 0);
    }, [headerRef]);

    return (
        <table id='reports-expense-list'>
            <caption>{ activeReportsTimeUnit } Report</caption>
            <thead style={{ top: headerHeight }}>
                <tr>
                    <th>Category</th>
                    <th>Expense</th>
                </tr>
            </thead>
            <tbody>
                { listData.map(dataItem => (
                    <React.Fragment key={dataItem.title}>
                        <tr className='date-row'>
                            <th colSpan={2}>{ dataItem.title }</th>
                        </tr>
                        { dataItem.categories.map(category => (
                            <tr key={`${dataItem.title}-${category.title}`}>
                                <td>{ category.title }</td>
                                <td>{ category.expense.toLocaleString()}</td>
                            </tr>
                        )) }
                        <tr className='date-total'>
                            <th>Total</th>
                            <th>{ dataItem.total.toLocaleString() }</th>
                        </tr>
                    </React.Fragment>
                )) }
            </tbody>
        </table>
    );
}

export default ReportsExpenseList;