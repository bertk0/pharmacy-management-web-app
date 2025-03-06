import { useState } from "react";
import CardFilter from "../CardFilter/CardFilter";
import "./card.css";

const Card = ({ card , onFilterChange}) => {
    const [filter, setFilter] = useState("Today");

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter); // Update filter khusus untuk card ini
        if (onFilterChange) {
            onFilterChange(newFilter); // Panggil callback parent
        }
    };

    const getFormattedAmount = () => {
        if (card.name === "Sales" ) {
            if (filter === "Today") {
                return "Rp " + parseFloat(card.amount.total_sales_today).toLocaleString("id-ID");
            }
            if (filter === "This Month") {
                return "Rp " + parseFloat(card.amount.total_sales_month).toLocaleString("id-ID");
            }
            if (filter === "This Year") {
                return "Rp " + parseFloat(card.amount.total_sales_year).toLocaleString("id-ID");
            }
        } else if (card.name === "Purchases") {
            if (filter === "Today") {
                return "Rp " + parseFloat(card.amount.total_purchases_today).toLocaleString("id-ID");
            }
            if (filter === "This Month") {
                return "Rp " + parseFloat(card.amount.total_purchases_month).toLocaleString("id-ID");
            }
            if (filter === "This Year") {
                return "Rp " + parseFloat(card.amount.total_purchases_year).toLocaleString("id-ID");
            }
        } else if (card.name === "Patients") {
            if (filter === "Today") {
                return card.amount.total_patients_today;
            }
            if (filter === "This Month") {
                return card.amount.total_patients_month;
            }
            if (filter === "This Year") {
                return card.amount.total_patients_year;
            }
        }
        return parseFloat(card.amount).toLocaleString("id-ID");
    };

    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card info-card sales-card">
                <CardFilter filterChange={handleFilterChange} />
                <div className="card-body">
                    <h5 className="card-title">
                        {card.name} <span>| {filter}</span>
                    </h5>
                    <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i className={card.icon}></i>
                        </div>
                        <div className="ps-3">
                            <h6>{getFormattedAmount()}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;






