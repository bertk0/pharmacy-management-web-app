const NavItem = (props) => {
    const {nav} = props

    return (
        <li className="nav-item">
        <a href="#" className='nav-link collapsed'>
            <i className={nav.icon}></i>
            <span>{nav.name}</span>
        </a>
    </li>
    );
}

export default NavItem;