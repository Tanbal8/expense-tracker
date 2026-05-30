import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard-page/DashboardPage";
import ReportsPage from "../pages/reports-page/ReportsPage";
import CategoriesPage from "../pages/categories-page/CategoriesPage";
import Layout from "../layouts/Layout";

const AppRouter = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
        </Layout>
    );
}

export default AppRouter;