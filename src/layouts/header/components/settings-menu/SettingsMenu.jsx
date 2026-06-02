import { useContext, useRef } from 'react';
import { exportData } from '../../../../utils/backup';
import DarkModeButton from '../../../../components/dark-mode-button/DarkModeButton';
import Dialog from '../../../../components/dialog/Dialog';
import { importedDataValidation } from '../../../../utils/validation';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import GlobalContext from '../../../../contexts/GlobalContext';
import './settings-menu.scss';

const SettingsMenu = () => {
    const { expenses, expensesOperations, expenseCategories, expenseCategoriesOperations, globalState, globalOperations, themeMode, setThemeMode, notification } = useContext(GlobalContext);
    const importInputFileRef = useRef(null);
    const importButtonHandleClick = () => {
        if (!importInputFileRef || !importInputFileRef.current) {
            new notification('alert', 'Error');
            return;
        }
        importInputFileRef.current.click();
    }
    const menuOptions = [
        {
            title: `${themeMode} Mode`,
            icon: <DarkModeButton themeMode={themeMode} callback={newThemeMode => { setThemeMode(newThemeMode) }} />,
            onClick: () => { setThemeMode(themeMode === 'light' ? 'dark' : 'light') }
        },
        {
            title: 'Export',
            icon: <FiDownload />,
            onClick: () => { exportData(expenses, expenseCategories, notification) },
        },
        {
            title: 'Import',
            icon: <FiUpload />,
            onClick: importButtonHandleClick,
        },
    ];

    const importInputFileChangeHandler = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            console.log(data);
            if (!importedDataValidation(data.expenses, data.expenseCategories)) {
                new notification('alert', 'Invalid file format!');
                return;
            }

            // Show dialog
            const messages = [
                'Choose import method',
                'Merge: Add to current data',
                'Replace: Overwrite all data',
            ];
            const onMerge = () => {
                expensesOperations.merge(data.expenses, ['id']);
                expenseCategoriesOperations.merge(data.expenseCategories, ['id', 'name']);
                new notification('success', 'Data imported!', 'New data merged successfully!')
            }
            const onReplace = () => {
                expensesOperations.overWrite(data.expenses);
                expenseCategoriesOperations.overWrite(data.expenseCategories);
                new notification('success', 'Data imported!', 'New data replaced successfully!')
            }
            const onClose = () => {
                globalOperations.set('dialog', null);
            };
            globalOperations.set('dialog', {
                messages,
                onOk: onMerge,
                onCancel: onReplace,
                onClose,
                okButtonText: 'Merge',
                cancelButtonText: 'Replace',
            });
        }
        reader.readAsText(file);
        e.target.value = '';
    }

    return (
        <>
            <div
                id='settings-menu-container'
                onMouseLeave={() => { globalOperations.set('showSettingsMenu', false) }}
            >
                <div
                    id='settings-menu-button'
                    onClick={() => { globalOperations.toggle('showSettingsMenu') }}
                >
                    <IoSettingsOutline size={20} />
                </div>
                { globalState.showSettingsMenu &&
                    <ul id='settings-menu'>
                        { menuOptions.map(option => (
                            <li key={option.title} onClick={option.onClick}>
                                <div className='menu-item-title'>{ option.title }</div>
                                <div className='menu-item-icon'>{ option.icon }</div>
                            </li>
                        ))}
                    </ul>
                }
                <input
                    type='file'
                    name='input-file'
                    accept=".json"
                    style={{display: 'none'}}
                    ref={importInputFileRef}
                    onChange={importInputFileChangeHandler}
                />
            </div>
            { globalState.dialog &&
                <Dialog
                    messages={globalState.dialog.messages}
                    onOk={globalState.dialog.onOk}
                    onCancel={globalState.dialog.onCancel}
                    onClose={globalState.dialog.onClose}
                    okButtonText={globalState.dialog.okButtonText}
                    cancelButtonText={globalState.dialog.cancelButtonText}
                    align='center'
                />
            }
        </>
    );
}

export default SettingsMenu;