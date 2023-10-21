/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from "./Chart.module.css";
import "./chart.css";
import { useRecoilState } from 'recoil';
import { cartItemCount, loginState } from '../../atoms';
import { useIsLogin } from '../../utils/LoginUtils';
import { sendAxiosRequest } from '../../utils/userUtils';

interface ProductChartProps{
  date: string;
  period: string;
}

interface ProductData{
  productTitle: string;
  orderedQuantity: number;
}

const ProductChart = ({date, period}: ProductChartProps) => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);
  const [ProductChartData, setProductChartData] = useState<PieChartData[]>([]);
  const isLogined = useIsLogin();

  useEffect(() => {
    if(isLogined){
      sendAxiosRequest('/mypage/titlechart', 'get', loginToken, setLoginToken, setCartCount, {searchDate:date, period:period})
      .then((response) => {
        console.log(response);

        const processedData = response?.map((res: ProductData)=>{
          return {
            name:res.productTitle,
            y:res.orderedQuantity,
          }
        }) 

        setProductChartData(processedData);
        })

      .catch(console.error);
    }
    }, [period]);

    console.log(ProductChartData);
    

  const options = {
    colors: ['#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0'],
    // colors: ['#5566c6', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9', '#E8EAF6'],
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    credits: {enabled: false},//워터마크
    title: {
      text: '상품'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      // data: ProductChartData,
      data: [
        {
        y: 1,
        name: "11",
      },
      {
        y: 1,
        name: "11",
      },
      {
        y: 1,
        name: "11",
      },
      {
        y: 1,
        name: "11",
      },
      {
        y: 1,
        name: "11",
      },
      {
        y: 1,
        name: "11",
      },
    ]
    }]
  };

  return (
    <div style={{maxWidth:'600px'}} className={styles.productChart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ProductChart;
