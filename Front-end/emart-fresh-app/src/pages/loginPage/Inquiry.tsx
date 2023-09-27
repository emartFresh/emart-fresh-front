import { useState } from 'react'
import styles from '../page_css/Inquiry.module.css'
import IdInquiry from './IdInquiry';
import PwInquiry from './PwInquiry';
import PwResetting from './PwResetting';

interface Colors{
    idTypeColor:string,
    pwTypeColor:string
}


const Inquiry = ({closeModal}) => {
    const [inquiryType, setInquiryType] = useState<string>('id');
    const [pwResetting, setPwResetting] = useState<boolean>(false);
    const [pwInquiryId, setPwInquiryId] = useState<string>('');

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
            setPwResetting(false);
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
            {/* 수정 : 비밀번호 재설정 페이지에서 아이디 찾기로 넘어갔을 때 / 페이지 이동시 현재 인증 정보가 초기화됩니다. 그래도 이동하시겠습니까? */}
            <div className={styles.inquirtComponents}>
                {inquiryType === 'id' && <IdInquiry />}
                {inquiryType === 'pw' && !pwResetting && <PwInquiry setPwResetting={setPwResetting} pwInquiryId={pwInquiryId} setPwInquiryId={setPwInquiryId}/>}
                {inquiryType === 'pw' && pwResetting && <PwResetting pwInquiryId={pwInquiryId} closeModal={closeModal}/>}
            </div>
        </div>
    </div>
  )
}

export default Inquiry