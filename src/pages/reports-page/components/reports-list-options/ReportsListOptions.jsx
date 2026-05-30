import { useContext } from 'react';
import { reportsTimeUnits } from '../../ReportsPage';
import ReportsPageContext from '../../../../contexts/ReportsPageContext';
import './reports-list-options.scss';

const ReportsListOptions = () => {
    const { activeReportsTimeUnit, setActiveReportsTimeUnit } = useContext(ReportsPageContext);

    return (
        <div id='reports-list-options'>
            {/* Time unit */}
            <div id='reports-list-options-time-units'>
                <ul id='reports-list-options-time-units-list'>
                    { reportsTimeUnits.map(timeUnit => (
                        <li key={timeUnit}>
                            <button
                                data-active={activeReportsTimeUnit === timeUnit}
                                onClick={() => setActiveReportsTimeUnit(timeUnit)}
                            >{ timeUnit }</button>
                        </li>
                    )) }
                </ul>
            </div>
        </div>
    );
}

export default ReportsListOptions;