const TopSellingItem = (props) => {
    const { item } = props;

    return (
        <tr>
            <th scope="row" style={{ color: "#012970" }}>
                {item.medicine_name}
            </th>
            <td>
                {item.total_quantity_sold}
            </td>
            <td>{Number(item.total_revenue).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR"
            })}</td>
        </tr>
    );
}

export default TopSellingItem;