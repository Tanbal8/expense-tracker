import './dark-mode-button.scss';

const DarkModeButton = ({ themeMode, callback, changeThemeMode }) => {
    const handleClick = () => {
        const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
        callback(newThemeMode);
    }

    return (
        <div id='dark-mode-button' onClick={handleClick} data-theme-mode={themeMode}>
            <div id='dark-mode-button-circle'></div>
            { themeMode === 'light' ?
                <div id='dark-mode-button-sun-rays'>
                    { Array.from({ length: sunRaysCount }).map((_, index) => (
                        <div key={index} style={{
                            transform: `rotate(${index * (360 / sunRaysCount)}deg)`
                        }} />
                    )) }
                </div>
                : <div id="dark-mode-button-up-layer" />
            }
        </div>
    );
}

const sunRaysCount = 8;

export default DarkModeButton;