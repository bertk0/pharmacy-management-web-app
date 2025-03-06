import { useState, useEffect } from "react";
import Card from "../Card/Card";
import { getTotalSales , getTotalPurchases} from "../../services/dashboard.service";


const ListCard = () => {
    const [cards, setCards] = useState([
        {
            "_id": 1,
            "name": "Sales",
            "icon": "bi bi-currency-dollar",
            "amount": 0 ,
        },
        {
            "_id": 2,
            "name": "Purchases",
            "icon": "bi bi-cart",
            "amount": 0 ,
        },
        {
            "_id": 3,
            "name": "Patients",
            "icon": "bi bi-people",
            "amount": 0, // Tidak memiliki filter, data statis
        },
    ]);

    const fetchAll = async () => {
        try {
            const salesResponse = await getTotalSales();
            const purchaseResponse = await getTotalPurchases();

            setCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.name === "Sales") {
                        return { ...card, amount: salesResponse };
                    }
                    if (card.name === "Purchases") {
                        return { ...card, amount: purchaseResponse };
                    }
                    if (card.name === "Patients") {
                        return {...card, amount: salesResponse };
                    }
                    return card; // Kartu lain tidak berubah
                })
            );
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleFilterChangeCallback = (newFilter) => {
        console.log("Filter changed in child:", newFilter);
        fetchAll(); // Trigger ulang fetchAll
    };

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        console.log(cards)
    }, [cards]);

    return (
        <>
            {cards.map((card) => (
                <Card key={card._id} card={card} onFilterChange={handleFilterChangeCallback} />
            ))}
        </>
    );
};

export default ListCard;












