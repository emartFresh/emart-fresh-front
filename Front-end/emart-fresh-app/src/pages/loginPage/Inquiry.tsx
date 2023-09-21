import { useState } from 'react'
import styles from '../page_css/Inquiry.module.css'
import IdInquiry from './IdInquiry';
import PwInquiry from './PwInquiry';

interface Colors{
    idTypeColor:string,
    pwTypeColor:string
}


const Inquiry = () => {
    const [inquiryType, setInquiryType] = useState<string>('id');
    const [colors, setColors] = useState<Colors>({
        idTypeColor:'rgba(249, 187, 0, 0.8)',
        pwTypeColor:'white'
    });

    const idTypeSelect = {backgroundColor: colors.idTypeColor}
    const pwTypeSelect = {backgroundColor: colors.pwTypeColor}

    const handleInquiryType = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.target as HTMLButtonElement;
        if(btn.id === 'idInquiry'){
            setColors({idTypeColor:'rgba(249, 187, 0, 0.8)', pwTypeColor:'white'});
            setInquiryType('id');
        }
        else if (btn.id === 'pwInquiry'){
            setColors({idTypeColor:'white', pwTypeColor:'rgba(249, 187, 0, 0.8)'});
            setInquiryType('pw');
        }
    }

  return (
    <div className={styles.container}>
        <div>
            <div className={styles.inquiryBtnWrap}>
                    <button id='idInquiry' style={idTypeSelect} className={`${styles.inquiryBtn} ${styles.inquiryBtnLeft}`} onClick={(e)=> handleInquiryType(e)}>아이디 찾기</button>
                    <button id='pwInquiry' style={pwTypeSelect} className={`${styles.inquiryBtn} ${styles.inquiryBtnRight}`} onClick={(e)=> handleInquiryType(e)}>비밀번호 찾기</button>
            </div>
            <div className={styles.inquirtComponents}>
                {inquiryType === 'id' && <IdInquiry />}
                {inquiryType === 'pw' && <PwInquiry />}
            </div>
        </div>
    </div>
  )
}

export default Inquiry