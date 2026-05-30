import { Link } from 'react-router-dom';
import './navigation.scss';

const navigationItems = [
    {
        title: 'Dashboard',
        path: '/',
    },
    {
        title: 'Reports',
        path: '/reports',
    },
    {
        title: 'Categories',
        path: '/categories',
    },
];

const Navigation = () => {
    return (
        <nav id='navigation'>
            <ul id='navigation-list'>
                { navigationItems.map(item => (
                    <li key={item.title}>
                        <Link to={item.path}>
                            { item.title }
                        </Link>
                    </li>
                ))
                }
            </ul>
        </nav>
    );
}

export default Navigation;