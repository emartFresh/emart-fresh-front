/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './Chart.module.css';
import './chart.css';

export default function SalesChart() {
  const [salesData, setSalseData] = useState({});

  // fetch('/data.json')
  // .then((response) => {
  //   console.log(response);  
  // })

  const options = {
    colors: ['#f9bb00', '#333333'],
    chart: {
      type: 'line',
    },
    credits: { enabled: false },
    title: {
      text: '매출액',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yAxis: {
      title: {
        text: '매출액',
      },
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    series: [
      {
        name: '매출액1',
        data: [0, 200, 150, 300, 250, 800], // 첫 번째 선 그래프
      },
      {
        name: '매출액2',
        data: [50, 150, 80, 200, 180, 300], // 두 번째 선 그래프
      },
    ],
  };

  const chartStyle = {
    maxWidth: '1000px',
    width: '100%',
  };

  return (
    <div style={chartStyle} className={styles.salesChart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
