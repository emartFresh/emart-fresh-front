/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './Chart.module.css';
import './chart.css';
import { useIsLogin } from '../../utils/LoginUtils';
import { sendAxiosRequest } from '../../utils/userUtils';
import { useRecoilState } from 'recoil';
import { cartItemCount, loginState } from '../../atoms';
import { useEffect } from 'react';

interface SalesChartProps{
  date: string;
  period: string;
}

export default function SalesChart({date, period}: SalesChartProps) {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);
  const [salesData, setSalseData] = useState<SalesChartData[]>([]);
  const isLogined = useIsLogin();
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);

  useEffect(() => {
  if(isLogined){
    sendAxiosRequest('/mypage/saleschart', 'get', loginToken, setLoginToken, setCartCount, {searchDate:date, period:period})
    .then((response) => {
      const res: SalesChartData[] = JSON.parse(JSON.stringify(response));
      setSalseData(res);

      // if(typeof response === typeof SalesChartData){
      //   const res:SalesChartData[] = response as SalesChartData[];
      // }

      setXAxisData(
        response.map((data: SalesChartData) => {
        return data.orderedDate;        
      }))

      setSeriesData(
        response.map((data: SalesChartData) => {
        return data.totalAmount;        
      }))
  

    })
    .catch(console.error);
  }
  }, []);
  


  const options = {
    colors: ['#333333'],
    chart: {
      type: 'line',
    },
    credits: { enabled: false },
    title: {
      text: '매출액',
    },
    xAxis: {
      categories: xAxisData,
    },
    yAxis: {
      title: {
        text: '매출액(만원)',
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
        name: '매출액',
        // data: [242153, 123489, 243215, 854321, 641234, 123479, 548767],
        data: seriesData,
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
