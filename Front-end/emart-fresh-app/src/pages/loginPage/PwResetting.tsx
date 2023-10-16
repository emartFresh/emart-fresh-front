import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import styles from '../page_css/PwResetting.module.css';

interface pwresettingProps {
    pwInquiryId: string;
    closeModal: () => void;
}

const PwResetting = ({pwInquiryId, closeModal}: pwresettingProps) => {
    const [newPw, setNewPw] = useState('');
    const [newPwMessage, setNewPwMessage] = useState('');
    const [pwCheckMessage, setPwCheckMessage] = useState('');
    const [isValidNewPw, setIsValidNewPw] = useState(false);
    const [isValidPwCheck, setIsValidPwCheck] = useState(false);

    const spaceRegex = /\s/;
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,16}$/;


    const handlePwSetting = async() => {
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/updatePw`, 
        {
            memberId: pwInquiryId,
            memberPw: newPw,
        })
        .then((response) => {
            console.log(response.data);
            toast.success('비밀번호가 변경되었습니다. 다시 로그인 해주세요.');
            closeModal();
        })
        .catch((error) => {
            console.error(error);
            toast.error('비밀번호 변경에 실패했습니다.');
        })
    }

    const validatePw = (value: string) => {
      if (value.trim() === '') {
          setNewPwMessage('비밀번호를 입력해주세요.');
          setIsValidNewPw(false);
      }else if(spaceRegex.test(value)){
          setNewPwMessage('비밀번호는 띄어쓰기 없이 입력해주세요.');
          setIsValidNewPw(false);
      }else if(!pwRegex.test(value)){
          setNewPwMessage('비밀번호는 영문/숫자/특수문자를 포함하고, 최소 8자 최대 16자로 입력해주세요.');
          setIsValidNewPw(false);
      }else if(value === pwInquiryId){
          setNewPwMessage('비밀번호는 아이디와 동일할 수 없습니다.');
          setIsValidNewPw(false);
      } else {
          setNewPwMessage('');
          setIsValidNewPw(true);
      }
  }

  const validatePwCheck = (value: string) => {
      if (value.trim() === '') {
          setPwCheckMessage('확인 비밀번호을 입력해주세요.');
          setIsValidPwCheck(false);
      } else if(value !== newPw){
          setPwCheckMessage('비밀번호를 동일하게 입력해주세요');
          setIsValidPwCheck(false);
      }else if(value === newPw){
          setPwCheckMessage('');
          setIsValidPwCheck(true);
      }
  }
    

  return (
    <div className={styles.pwResettingWrap}>
      <div>
        <input type="password" className={styles.pwInput} placeholder='새 비밀번호를 입력하세요' onChange={(e) => {setNewPw(e.target.value), validatePw(e.target.value)}}/>
        <p>{newPwMessage}</p>
      </div>
      <div>
        <input type="password" className={styles.pwInput} placeholder='새 비밀번호 확인을 입력하세요' onChange={(e) => {validatePwCheck(e.target.value)}}/>
        <p>{pwCheckMessage}</p>
      </div>
        <button className={styles.pwSettingBtn} disabled={!isValidNewPw || !isValidPwCheck} onClick={handlePwSetting}>비밀번호 재설정</button>
    </div>
  )
}

export default PwResetting