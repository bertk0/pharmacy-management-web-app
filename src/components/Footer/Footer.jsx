import './footer.css';

const Footer = () => {
    return (
       <footer id='footer' className='footer'>
            <div className='copyright'>
                &copy; CopyRight{' '}
                <strong>
                    <span>Pharmacy Royal</span>
                </strong>
                . All Rights Reserved
            </div>
            <div className='credits'>
                Designed by <a href="#">bert</a>
            </div>
       </footer>
    );
}

export default Footer;