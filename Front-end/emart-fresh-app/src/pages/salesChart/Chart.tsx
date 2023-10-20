/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import styles from "./Chart.module.css";
import SalesChart from './SalesChart';
import ProductTypeChart from './ProductTypeChart';
import ProductChart from './ProductChart';
import { PickerCalendar } from './PickerCalendar';
import { useState } from 'react';
import { useEffect } from 'react';
import { useIsLogin } from '../../utils/LoginUtils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Chart = () => {
  const [selectOption, setSelectOption] = useState('weekly');
  const nowYear = dayjs().year();
  const nowMonth = dayjs().month()+1;
  const nowDate = dayjs().date();
  const [date, setDate] = useState<string>(nowYear + "-" + nowMonth + "-" + nowDate);
  const isLogined = useIsLogin();
  const navigate = useNavigate();


  useEffect(() => {
    if(!isLogined){
      toast.error('로그인이 필요한 서비스입니다');
      navigate('/login');
      return;
    }
  }, [date, selectOption])

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
            <div className={styles.lineChart}>
              <SalesChart date={date} period={selectOption}/>
            </div>
            <div className={styles.pieCharts}>
              <ProductTypeChart date={date} period={selectOption}/>
              <ProductChart date={date} period={selectOption}/>
            </div>
        </div>
    </div>
  )
}

export default Chart