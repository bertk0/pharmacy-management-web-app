import { Link } from "react-router-dom";

const RecentSalesTable = (props) => {
    const { items } = props;

    return (
        <table className="table table-borderless datatable">
            <thead className="table-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Invoice</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Total Payment</th>
                </tr>
            </thead>
            <tbody>
                {items &&
                    items.length > 0 &&
                    items.map((item, index) => {
                        const id_sale = item.id;
                        const url = `/sale/edit/${id_sale}`;
                        return (
                            <tr key={item.id}>
                            <th scope="row">
                                {1 + index}
                            </th>
                            <td>
                                <Link to={url} className="text-primary">
                                    {item.sale_invoice}
                                </Link>
                            </td>
                            <td>
                                {item.patient.name}

                            </td>
                            <td>{Number(item.total_payment).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR"
                            })}</td>
                        </tr>
                        );
                    } 
                       
                    )}

            </tbody>

        </table>
    );
}

export default RecentSalesTable;