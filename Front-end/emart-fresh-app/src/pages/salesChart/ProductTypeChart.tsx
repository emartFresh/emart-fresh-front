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

interface SalesChartProps{
  date: string;
  period: string;
}

const getProductNameByType = (type:number)=>{
  return type === 1 ? "도시락"
  : type === 2 ? "김밥"
  : type === 3 ? "햄버거"
  : type === 4 ? "주먹밥"
  : type === 5 ? "샌드위치"
  : type === 6 ? "즉석식"
  : type === 7 ? "조리면"
  : "분류없음"

}
const ProductTypeChart = ({date, period}: SalesChartProps) => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);
  const [typeData, setTypeData] = useState<TypeChartData[]>([]);
  const isLogined = useIsLogin();

  useEffect(() => {
    if(isLogined){
      sendAxiosRequest('/mypage/typechart', 'get', loginToken, setLoginToken, setCartCount, {searchDate:date, period:period})
      .then((response) => {
        console.log(response);
        //const res: TypeChartData[] = JSON.parse(JSON.stringify(response));
        //setTypeData(res);

        const processedData = response?.map((ele)=>{
          return {
            name:getProductNameByType(Number(ele.productType)),
            y:ele.orderedQuantity,
          }
        }) 

        setTypeData(processedData);
        
        })

      .catch(console.error);
    }
    }, []);


  const options = {
    colors: ['#f9bb00', '#333333', '#666666', '#999999', '#bbbbbb', '#dddddd'],
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    credits: {enabled: false},//워터마크
    title: {
      text: '상품 타입'
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
      data: typeData,
      // {
      //   name: 'Chrome',
      //   y: 23.03,
      //   sliced: true,
      //   selected: true
      // },
    }]
  };

  return (
    <div style={{maxWidth:'500px'}} className={styles.productTypeChart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ProductTypeChart;
