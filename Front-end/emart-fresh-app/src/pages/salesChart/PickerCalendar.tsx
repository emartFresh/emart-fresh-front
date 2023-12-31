/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import styles from "./Chart.module.css";

interface PickerProps{
    setDate: React.Dispatch<React.SetStateAction<string>>;
}

export const PickerCalendar = ({setDate} : PickerProps) => {
    const handleDate = (e: dayjs.Dayjs) => {
        const dayjs = e as Dayjs;
        const year = e.year();
        const month = e.month() + 1;
        const day = e.date();
     
        setDate(year + "-" + month + "-" + day);
    }
  return (
    <div className={styles.pickerContainer}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={[
                'DatePicker',
                ]}
            >
                <DemoItem label="조회할 날짜를 선택하세요">
                    <DatePicker defaultValue={dayjs()} onChange={(e) => handleDate(e)}/>
                    {/* <DatePicker defaultValue={dayjs()} onChange={(e) => console.log(e)}/> */}
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    </div>
  )
}
