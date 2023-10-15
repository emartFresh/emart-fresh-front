/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import styles from "./Chart.module.css";
import SalesChart from './SalesChart';
import ProductTypeChart from './ProductTypeChart';
import ProductChart from './ProductChart';
import { PickerCalendar } from './PickerCalendar';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from '../../atoms';

const Chart = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [selectOption, setSelectOption] = useState('weekly');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    // sendAxiosRequest('', 'get', loginToken, setLoginToken, {})
    //   .then(() => {})
    //   .catch();
    console.log(date);
  }, [date])

  const clickButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const btn = e.target as HTMLButtonElement;
    setSelectOption(btn.id);
  }
  
  return (
    <div>
        <div className={styles.selectDateContainer}>
            <PickerCalendar setDate={setDate}/>
            <div className={styles.selectBtnWrap}>
              <button 
                id='weekly' 
                className={`${styles.weeklyOptionBtn} ${selectOption === 'weekly' ? styles.selectedOptionBtn : ''}`}
                onClick={(e) => clickButton(e)}>주간 조회하기</button>
              <button 
                id='monthly' 
                className={`${styles.monthlyOptionBtn} ${selectOption === 'monthly' ? styles.selectedOptionBtn : ''}`}
                onClick={(e) => clickButton(e)}>월간 조회하기</button>
              <button 
                id='yearly' 
                className={`${styles.yearlyOptionBtn} ${selectOption === 'yearly' ? styles.selectedOptionBtn : ''}`}
                onClick={(e) => clickButton(e)}>연간 조회하기</button>
            </div>
        </div>
        
        <div className={styles.chartContainer}>
            <SalesChart/>
            <div>
              <ProductTypeChart/>
              <ProductChart/>
            </div>
        </div>
    </div>
  )
}

export default Chart