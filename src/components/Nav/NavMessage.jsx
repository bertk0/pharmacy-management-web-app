import messageImg from '../../images/profile.png';

const NavMessage = () => {
    return (
        <li className="nav-item dropdown">
            <a href="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                    You have 3 new messages
                    <a href="#">
                        <span className="badge rounded-pill bg-primary p-2 ms-2">View All</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                    <a href="#">
                        <img src={messageImg} alt="messageImage" className="rounded-circle" />
                        <div>
                            <h4>Edward Newgate</h4>
                            <p>
                                Untuk obat paramcetahol sudah mau habis , mohon restock bang!!
                            </p>
                            <p>4hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                    <a href="#">
                        <img src={messageImg} alt="messageImage" className="rounded-circle" />
                        <div>
                            <h4>Monkey d luffy</h4>
                            <p>
                                Untuk obat paramcetahol sudah mau habis , mohon restock bang!!
                            </p>
                            <p>4hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                    <a href="#">
                        <img src={messageImg} alt="messageImage" className="rounded-circle" />
                        <div>
                            <h4>Boa Hancock</h4>
                            <p>
                                Untuk obat paramcetahol sudah mau habis , mohon restock bang!!
                            </p>
                            <p>4hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                    <a href="#">Show All Message</a>
                </li>

            </ul>
        </li>
    );
}

export default NavMessage;