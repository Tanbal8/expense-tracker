import { useCallback, useEffect, useState } from 'react';
import './dialog.scss';

const Dialog = ({
    messages,
    onOk = () => {},
    onCancel = () => {},
    onClose = () => {},
    okButtonText = 'OK',
    cancelButtonText = 'Cancel',
    align = 'left',
}) => {
    const [isClicked, setIsClicked] = useState(true);
    const buttonClickHandler = useCallback(status => {
        setIsClicked(true);
        setTimeout(() => {
            status ? onOk() : onCancel();
            onClose(status);
        }, 200);
    }, [onOk, onCancel, onClose]);

    useEffect(() => {
        const keyDownHandler = e => {
            if (e.key === 'Enter') buttonClickHandler(true);
        }

        setIsClicked(false);

        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);

        }
    }, [buttonClickHandler]);

    return (
        <div className='dialog-overlay'>
            <div className={`dialog ${!isClicked ? 'scale-1' : ''}`}>
                <div className='dialog-messages' style={{textAlign: align}}>
                    { messages.map((message, index) => (
                        <div key={`message-${index}`}>{ message }</div>
                    )) }
                </div>
                <div className='dialog-buttons'>
                    <button className='dialog-buttons-ok-button' onClick={() => buttonClickHandler(true)}>{ okButtonText }</button>
                    <button className='dialog-buttons-cancel-button' onClick={() => buttonClickHandler(false)}>{ cancelButtonText }</button>
                </div>
            </div>
        </div>
    );
}

export default Dialog;