import profileImg from '../../images/profile.png';

const NavAvatar = () => {
    return(
        <li className="nav-item dropdown pe-3">
            <a 
                href="#"
                className="nav-link nav-profile d-flex align-items-center pe-0"
                data-bs-toggle="dropdown"
            >
                <img src={profileImg} alt="Profile" className='rounded-circle' />
                <span className='d-none d-md-block dropdown-toggle ps-2'>D Luffy</span>
            </a>

            <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'> 
                <li className='dropdown-header'>
                    <h6>Luffy</h6>
                    <span>Blockchain Enginer</span>
                </li>
                <li>
                    <hr className='dropdown-divider'/>
                </li>

                <li>
                    <a 
                        href="users.profile.html"
                        className='dropdown-item d-flex align-items-center'
                    >
                        <i className='bi bi-person'></i>
                        <span>My Profile</span>
                    </a>
                </li>


                <li>
                    <hr className='dropdown-divider'/>
                </li>

                <li>
                    <a 
                        href="users.profile.html"
                        className='dropdown-item d-flex align-items-center'
                    >
                        <i className='bi bi-gear'></i>
                        <span>Account Settings</span>
                    </a>
                </li>


                <li>
                    <hr className='dropdown-divider'/>
                </li>

                <li>
                    <a 
                        href="users.profile.html"
                        className='dropdown-item d-flex align-items-center'
                    >
                        <i className='bi bi-question-circle'></i>
                        <span>Need Help?</span>
                    </a>
                </li>

                <li>
                    <hr className='dropdown-divider'/>
                </li>

                <li>
                    <a 
                        href="#"
                        className='dropdown-item d-flex align-items-center'
                    >
                        <i className='bi bi-box-arrow-right'></i>
                        <span>Sign Out</span>
                    </a>
                </li>

            </ul>
        </li>
    );
}

export default NavAvatar;