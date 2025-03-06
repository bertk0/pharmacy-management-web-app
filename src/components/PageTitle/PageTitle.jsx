import './pageTitle.css'

const PageTitle = (props) => {

    const {pagetitle, breadcrumb} = props

 return (
    <div className='pagetitle'>
        <h1>{pagetitle}</h1>
        <nav>
            <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                    <a href="/">
                        <i className='bi bi-house-door'></i>
                    </a>
                </li>
                <li className='breadcrumb-item active'>{breadcrumb}</li>
            </ol>
        </nav>
    </div>
 );
}

export default PageTitle;