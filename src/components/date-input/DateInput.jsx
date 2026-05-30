import { useContext, useEffect, useRef } from 'react';
import { dateInputKeyDownHandler, goToNextDay, goToPreviousDay } from '../../utils/date';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import GlobalContext from '../../contexts/GlobalContext';
import './date-input.scss';

const DateInput = ({
    inputRef,
    activeDate,
    valueCallback = activeDate => activeDate.toDate(),
    setActiveDate = () => {},
    onChange = () => {},
    keyDownCallback = () => {},
    showOptionsCondition = true,
    iconSize = 10,
    canFocus = true,
    ...props
}) => {
    const { notification } = useContext(GlobalContext);
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        onChangeRef.current?.(activeDate);
    }, [activeDate]);
    
    return (
        <div className='date-input-container'>
            <input
                type='text'
                className='date-input'
                value={valueCallback(activeDate)}
                readOnly
                data-can-focus={canFocus}
                ref={inputRef}
                onKeyDown={e => {
                    dateInputKeyDownHandler(e, activeDate, setActiveDate, notification);
                    keyDownCallback(e);
                }}
                {...props}
            />
            { showOptionsCondition &&
                <div className='date-input-options'> {/* Date input options */}
                    <button
                        type='button'
                        onClick={() => goToNextDay(activeDate, setActiveDate, notification)}
                        >
                    <FaCaretUp size={iconSize} />
                    </button>
                    <button
                        type='button'
                        onClick={() => goToPreviousDay(activeDate, setActiveDate)}
                        >
                    <FaCaretDown size={iconSize} />
                    </button>
                </div>
            }
        </div>
    );
}

export default DateInput;