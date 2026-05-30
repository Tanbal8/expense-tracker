import Header from "./header/Header";
import Footer from "./footer/Footer";
import GoToTopButton from '../components/go-to-top-button/GoToTopButton';
const Layout = ({ children }) => {
    return (
        <>
            <Header />
            { children }
            <Footer />
            <GoToTopButton />
        </>
    )
}

export default Layout;