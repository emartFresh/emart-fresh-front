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
  const [xText, setXText] = useState<string>('');
  const [seriesData, setSeriesData] = useState<number[]>([]);

  useEffect(() => {
  if(isLogined){
    sendAxiosRequest('/mypage/saleschart', 'get', loginToken, setLoginToken, setCartCount, {searchDate:date, period:period})
    .then((response) => {
      const res: SalesChartData[] = JSON.parse(JSON.stringify(response));
      setSalseData(res);

      // 수정
      // if(typeof response === typeof SalesChartData){
      //   const res:SalesChartData[] = response as SalesChartData[];
      // }

      setXText(
        period === 'weekly' ? '일'
        : period === 'monthly' ?  '주'
        : period === 'yearly' ?  '분기'
        : '분류 없음'
      )

      if(period === 'weekly'){
        setXAxisData(
          response?.map((data: SalesChartData) => {
          return data.orderedDate;        
        }))
      }else{
        setXAxisData(
          response?.map((data: SalesChartData) => {
          return data.quarter;        
        }))
      }

      setSeriesData(
        response?.map((data: SalesChartData) => {
        return data.totalAmount;        
      }))
    })
    .catch(console.error);
  }
  }, [period]);


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
      title:{
        text: xText,
      }
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
        data: seriesData,
        //data: [331300, 82300, 481300,  97300, 64300, 44300, 741300]
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
