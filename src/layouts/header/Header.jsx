import { useContext } from 'react';
import Navigation from '../navigation/Navigaiton';
import SettingsMenu from './components/settings-menu/SettingsMenu';
import GlobalContext from '../../contexts/GlobalContext';
import './header.scss';

const Header = () => {
    const { headerRef } = useContext(GlobalContext);

    return (
        <header id='header' ref={headerRef}>
            <div id='header-left'>
                <h1>Expense Tracker</h1>
            </div>
            <div id='header-right'>
                <Navigation />
                <SettingsMenu />
            </div>
        </header>
    );
}

export default Header;