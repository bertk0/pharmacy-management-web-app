import './sideBar.css';
import navList from '../../data/navItem';
import NavItem from './NavItem';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <aside id='sidebar' className='sidebar'>
            <ul className="sidebar-nav" id='sidebar-nav'>
                <li className='nav-item'>
                    {/* <a href="/" className='nav-link'>
                        <i className='bi bi-grid'></i>
                        <span>Dashboard</span>
                    </a> */}

                    <Link to="/" className='nav-link'>
                        <i className='bi bi-grid'></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li className='nav-item'>
                    <a
                        href="/"
                        className='nav-link collapsed'
                        data-bs-target='#components-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-menu-button-wide'></i>
                        <span>Master Data</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </a>
                    <ul
                        id='components-nav'
                        className='nav-content collapse'
                        data-bs-parent='#sidebar-nav'
                    >
                        <li>
                            <Link to="/medicine">
                                <i className='bi bi-circle'></i>
                                <span>Obat</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/patient">
                                <i className='bi bi-circle'></i>
                                <span>Pasien</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctor">
                                <i className='bi bi-circle'></i>
                                <span>Dokter</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/supplier">
                                <i className='bi bi-circle'></i>
                                <span>Supplier</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className='nav-item'>
                    <a
                        href="/"
                        className='nav-link collapsed'
                        data-bs-target='#forms-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-journal-text'></i>
                        <span>Transaction</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </a>
                    <ul
                        id='forms-nav'
                        className='nav-content collapse'
                        data-bs-parent='#sidebar-nav'
                    >
                        <li>
                            <Link to="/sale">
                                <i className='bi bi-circle'></i>
                                <span>Sale Transaction</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/purchase">
                                <i className='bi bi-circle'></i>
                                <span>Purchase Transaction</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className='nav-item'>
                    <a
                        href="/"
                        className='nav-link collapsed'
                        data-bs-target='#tables-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-layout-text-window-reverse'></i>
                        <span>Forecast</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </a>
                    <ul
                        id='tables-nav'
                        className='nav-content collapse'
                        data-bs-parent='#sidebar-nav'
                    >
                        <li>
                            <Link to="/forecast_medicine">
                                <i className='bi bi-circle'></i>
                                <span>Medicine Forecast</span>
                            </Link>
                        </li>
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>Other Forecast</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li className='nav-item'>
                    <a
                        href="/"
                        className='nav-link collapsed'
                        data-bs-target='#charts-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-bar-chart'></i>
                        <span>Charts</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </a>
                    <ul
                        id='charts-nav'
                        className='nav-content collapse'
                        data-bs-parent='#sidebar-nav'
                    >
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>Charts.js</span>
                            </a>
                        </li>
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>ApexCharts</span>
                            </a>
                        </li>
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>ExCharts</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li className='nav-item'>
                    <a
                        href="/"
                        className='nav-link collapsed'
                        data-bs-target='#icons-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-gem'></i>
                        <span>Icons</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </a>
                    <ul
                        id='icons-nav'
                        className='nav-content collapse'
                        data-bs-parent='#sidebar-nav'
                    >
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>Bootstrap Icons</span>
                            </a>
                        </li>
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>Remix Icons</span>
                            </a>
                        </li>
                        <li>
                            <a href="/">
                                <i className='bi bi-circle'></i>
                                <span>Boxicons</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li className='nav-heading'>Pages</li>
                {navList.map(nav => (
                    <NavItem key={nav._id} nav={nav} />
                ))}


            </ul>
        </aside>
    );
}

export default SideBar;