"use client";
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function CalculatorReturnChart({ data, labels, title }) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title || "Estimated Returns",
                data: data,
                borderColor: "rgba(34, 197, 94, 1)", // Green-500
                backgroundColor: "rgba(34, 197, 94, 0.1)", // Green-500 with opacity
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
    };

    return (
        <div className="w-full h-full min-h-[150px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
