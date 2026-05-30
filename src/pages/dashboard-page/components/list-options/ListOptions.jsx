import { useContext, useState } from 'react';
import DateInput from '../../../../components/date-input/DateInput';
import PersianDate from '../../../../utils/PersianDate';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { MdSort } from 'react-icons/md';
import GlobalContext from '../../../../contexts/GlobalContext';
import DashboardPageContext from '../../../../contexts/DashboardPageContext';
import './list-options.scss';

const ListOptions = () => {
    const { expenses, expensesOperations, expenseCategories, today, notification } = useContext(GlobalContext);
    const { filters, filtersOperations, autoSortCheck, setAutoSortCheck } = useContext(DashboardPageContext);
    const minDate = expenses.reduce((min, e) => 
        e.date < min ? e.date : min,
        expenses[0]?.date || today.toDate().replaceAll('/', '-')
    ).split('-').map(timeUnit => parseInt(timeUnit));
    const defaultDateRangeFromDate = new PersianDate(minDate[0], minDate[1], minDate[2]);
    const defaultDateRangeToDate = today.copy();
    const [dateRangeFromDate, setDateRangeFromDate] = useState(defaultDateRangeFromDate);
    const [dateRangeToDate, setDateRangeToDate] = useState(defaultDateRangeToDate);

    const sortFields = {
        'Date': (expense1, expense2) => expense2.date.localeCompare(expense1.date),
        'Expense': (expense1, expense2) => expense2.expense - expense1.expense,
        'Title': (expense1, expense2) => expense1.title.localeCompare(expense2.title),
        'Category': (expense1, expense2) => expense1.category.localeCompare(expense2.category),
    };

    const autoSortButtonClickHandler = () => {
        setAutoSortCheck(!autoSortCheck);
    }

    const sortFieldButtonClickHandler = (callback = () => {}) => {
        if (autoSortCheck) {
            new notification('alert', 'Auto sort is active!');
            return;
        }
        expensesOperations.sort((expense1, expense2) => callback(expense1, expense2));
    }

    const resetFiltersHandler = () => {
        setDateRangeFromDate(defaultDateRangeFromDate);
        setDateRangeToDate(defaultDateRangeToDate);
        filtersOperations.resetExcept( 'showFilterForm');
    }

    const dateRangeInputChangeHandler = (data ,which) => {
        filtersOperations.set('dateRange', {
            ...filters.dateRange,
            [which]: data.toDate().replaceAll('/', '-'),
        });
    };
    
    const expenseRangeInputChangeHandler = (e ,which) => {
        const stringValue = e.target.value.trim();
        const value = parseInt(stringValue || 0);
        if (stringValue === '' || !value) {
            filtersOperations.set('expenseRange', {
                ...filters.expenseRange,
                [which]: null,
            });
            e.target.value = '';
            return;
        }
        filtersOperations.set('expenseRange', {
            ...filters.expenseRange,
            [which]: value,
        });
    }
    
    return (
        <div id='list-options'>
            {/* Search */}
            <div id='list-options-filter-container'>
                <div id='list-options-filter-search-container'>
                    <input
                        type='search'
                        id='list-options-filter-search-input'
                        placeholder='Search...'
                        onKeyDown={() => {}}
                        onChange={(e) => { filtersOperations.set('searchValue', e.target.value.trim()) }}
                    />
                    <button id='list-options-filter-search-button' onClick={() => {}}>
                        <FiSearch />
                    </button>
                </div>
                {/* Filter */}
                <div id='list-options-filter-filter-container'>
                    <button
                        id='list-options-filter-filter-button'
                        onClick={() => { filtersOperations.toggle('showFilterForm') }}
                        data-showing-form={filters.showFilterForm}
                    >
                        <FiFilter />
                        <div id='list-options-filter-filter-title'>Filters</div>
                    </button>
                    { filters.showFilterForm &&
                        // Filters from
                        <div id='list-options-filter-filter-form'>
                            {/* Category */}
                            <div id='list-options-filter-filter-form-category-container'>
                                <label htmlFor='list-options-filter-filter-form-category-select'>Category:</label>
                                <select
                                    id='list-options-filter-filter-form-category-select'
                                    value={filters.category}
                                    onChange={(e) => { filtersOperations.set('category', e.target.value) }}
                                >
                                    { [{name: 'All'}, ...expenseCategories].map(category => (
                                        <option value={category.name} key={category.name}>{ category.name }</option>
                                    )) }
                                </select>
                            </div>
                            {/* Date range */}
                            <div id='list-options-filter-filter-form-date-range-container'>
                                <label htmlFor='list-options-filter-filter-form-date-range-from-input'>Date range:</label>
                                <div id='list-options-filter-filter-form-date-range-inputs-container'>
                                    <label htmlFor='list-options-filter-filter-form-date-range-from-input'>From:</label>
                                    <DateInput
                                        id='list-options-filter-filter-form-date-range-from-input'
                                        activeDate={dateRangeFromDate}
                                        setActiveDate={setDateRangeFromDate}
                                        onChange={date => dateRangeInputChangeHandler(date, 'from')}
                                    />
                                    <label htmlFor='list-options-filter-filter-form-date-range-to-input'>To:</label>
                                    <DateInput
                                        id='list-options-filter-filter-form-date-range-to-input'
                                        activeDate={dateRangeToDate}
                                        setActiveDate={setDateRangeToDate}
                                        onChange={date => {dateRangeInputChangeHandler(date, 'to')}}
                                    />
                                </div>
                            </div>
                            {/* Expense range */}
                            <div id='list-options-filter-filter-form-expense-range-container'>
                                <label htmlFor='list-options-filter-filter-form-expense-range-from-input'>Expense range:</label>
                                <div id='list-options-filter-filter-form-expense-range-inputs-container'>
                                    <label htmlFor='list-options-filter-filter-form-expense-range-from-input'>From:</label>
                                    <input
                                        type='text'
                                        id='list-options-filter-filter-form-expense-range-from-input'
                                        placeholder='From'
                                        defaultValue={filters.expenseRange.from || ''}
                                        onChange={e => expenseRangeInputChangeHandler(e, 'from')}
                                    />
                                    <label htmlFor='list-options-filter-filter-form-expense-range-to-input'>To:</label>
                                    <input
                                        type='text'
                                        id='list-options-filter-filter-form-expense-range-to-input'
                                        placeholder='To'
                                        defaultValue={filters.expenseRange.to || ''}
                                        onChange={e => expenseRangeInputChangeHandler(e, 'to')}
                                    />
                                </div>
                            </div>
                            {/* Reset filters */}
                            <div id='list-options-filter-filter-form-reset-filters-button-container'>
                                <button
                                    id='list-options-filter-filter-form-reset-filters-button'
                                    onClick={resetFiltersHandler}
                                >Reset Filters</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* Sort */}
            <div id='list-options-sort-container'>
                <MdSort size={20} />
                <ul id='list-options-sort-fields-button'>
                    { Object.keys(sortFields).map(sortField => (
                        <li key={sortField}>
                            <button onClick={() => sortFieldButtonClickHandler(sortFields[sortField])}>{ sortField }</button>
                        </li>
                    ))}
                    <li>
                        <button
                            id='list-options-sort-auto-sort-button'
                            data-active={autoSortCheck}
                            onClick={autoSortButtonClickHandler}
                        >Auto Sort</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ListOptions;