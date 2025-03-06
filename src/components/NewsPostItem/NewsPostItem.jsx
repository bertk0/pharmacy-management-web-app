const NewsPostItem = (props) => {
    const {item} = props;
    const image = item.img;

    return (
        <div className="post-item clearfix">
            <img src={image} alt="" />
            <h4>
                <a href="#">{item.title}</a>
            </h4>
            <p>{item.subtitle}</p>
        </div>
    );
}

export default NewsPostItem;