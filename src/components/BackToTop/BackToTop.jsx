import './backToTop.css';
import { useState, useEffect } from 'react';

const BackToTop = () => {
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScroll(window.scrollY);
        });
        return () => {
            window.removeEventListener('scroll', () => {
                setScroll(window.scrollY);
            });
        };
    }, [])

    const backToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <a 
            onClick={backToTop}
            className={`back-to-top d-flex align-items-center justify-content-center
                ${scroll > 100 ? 'active' : undefined}`}
        >
            <i className='bi bi-arrow-up-short'></i>
        </a>
    );

}
export default BackToTop;