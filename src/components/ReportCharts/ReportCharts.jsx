import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const ReportCharts = ({ filter }) => {
    const [salesData, setSalesData] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/chart-data?filter=${filter}`
                );

                let sales, purchases, labels;
                if (filter === "Today") {
                    sales = response.data.sales.map((item) => item.total);
                    purchases = response.data.purchases.map((item) => item.total);
                    labels = response.data.sales.map((item) => `${item.hour}:00`);
                } else if (filter === "This Month") {
                    sales = response.data.sales.map((item) => item.total);
                    purchases = response.data.purchases.map((item) => item.total);
                    labels = response.data.sales.map((item) => `Day ${item.day}`);
                } else {
                    sales = response.data.sales.map((item) => item.total);
                    purchases = response.data.purchases.map((item) => item.total);
                    labels = response.data.sales.map((item) => item.month);
                }

                setSalesData(sales);
                setPurchaseData(purchases);
                setCategories(labels);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [filter]);

    const chartOptions = {
        chart: {
            type: "area",
            height: 350,
        },
        xaxis: {
            categories,
        },
        colors: ["#4154f1", "#2eca6a"],
        stroke: {
            curve: "smooth",
        },
        dataLabels: {
            enabled: false,
        },
    };

    const series = [
        { name: "Sales", data: salesData },
        { name: "Purchases", data: purchaseData },
    ];

    return <Chart options={chartOptions} series={series} type="area" height={350} />;
};

export default ReportCharts;


