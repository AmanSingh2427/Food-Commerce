// AdminHome.js (or equivalent)

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import NavbarAdmin from './components/NavbarAdmin';

const AdminHome = () => {
  const [orderData, setOrderData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const chartContainer = useRef(null); // Reference to the chart container element

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/order-history'); // Replace with your backend endpoint
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const chartOrders = (data) => {
      // Check if chart container and data are available
      if (chartContainer.current && data.length > 0) {
        // Destroy existing chart instance if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }

        const months = data.map(entry => entry.month);
        const orders = data.map(entry => entry.total_orders);

        const ctx = chartContainer.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Orders per Month',
              data: orders,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: true
                }
              }
            }
          }
        });

        // Set the new chart instance to state
        setChartInstance(newChartInstance);
      }
    };

    chartOrders(orderData);

    // Cleanup: Destroy chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [orderData]);

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto px-4 mt-8">
        <h4 className="text-3xl font-bold mb-4">Orders Per Month</h4>
        <div className="bg-white rounded-lg shadow-md p-6">
          <canvas ref={chartContainer} id="orderChart" width="400" height="170"></canvas>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
