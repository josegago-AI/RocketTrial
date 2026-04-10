import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
import Import from './pages/Import';
import Investments from './pages/Investments';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Income": Income,
    "Expenses": Expenses,
    "Analytics": Analytics,
    "Goals": Goals,
    "Settings": Settings,
    "Accounts": Accounts,
    "Import": Import,
    "Investments": Investments,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};