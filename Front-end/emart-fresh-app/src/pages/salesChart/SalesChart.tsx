import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './Chart.module.css';
import './chart.css';

export default function SalesChart() {
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
        data: [100, 200, 150, 300, 250, 400], // 첫 번째 선 그래프
      },
      {
        name: '매출액2',
        data: [50, 150, 80, 200, 180, 300], // 두 번째 선 그래프
      },
    ],
  };

  return (
    <div style={{ maxWidth: '600px' }} className={styles.salesChart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
