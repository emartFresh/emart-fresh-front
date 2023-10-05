/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios'
import styled from 'styled-components';
import ExpiryTime from '../signupPage/ExpiryTime';

const InquiryFormWrap = styled.div`
    width: 100%;
    height: 50vh;
    border-top: 0;
    padding-top: 1.8em;
    align-items: center; /* 수평 가운데 정렬 */
    justify-content: center; /* 수직 가운데 정렬 */
`;

const InquiryInput = styled.input`
    margin: 0 auto;
    margin-top: 2.1em;
    width: 24em;
    padding: 0.8em 1.8em;
    font-size: 0.9em;
    display: block;
    border-radius: 0.5em;
    border: 0.1em solid rgba(0, 0, 0, 0.8);
    outline: none;
`;

const commonInputStyles = `
  margin-top: 2.1em;
  width: 24em;
  padding: 0.8em 1.8em;
  font-size: 0.9em;
  display: inline;
  border-radius: 0.5em;
  border: 0.1em solid rgba(0,0, 0, 0.8);
  outline: none;
  margin-left: 9em;
`;

const EmailInquiryInput = styled.input`
  ${commonInputStyles}
`;

const CertCodeInput = styled.input`
  ${commonInputStyles}
`;


const CertificationBtn = styled.button`
    display: inline;
    width: 8em;
    padding: 0.8em 0;
    font-size: 0.9em;
    margin-left: 1em;
`;

const InquiryButton = styled.button`
    display: block;
    margin: 0 auto;
    margin-top: 3.5em;
    width: 12em;
    padding: 0.8em 0;
    font-size: 0.9em;
`;

interface FormState {
    inquiryName: string;
    inquiryEmail: string;
    inquiryCertCode: string;
}

interface PwInquiryProps {
    setPwResetting: React.Dispatch<React.SetStateAction<boolean>>;
    pwInquiryId?: string;
    setPwInquiryId: React.Dispatch<React.SetStateAction<string>>;
  }


const PwInquiry = ({ setPwResetting, pwInquiryId, setPwInquiryId }: PwInquiryProps) => {

    const initialPwInquiryForm: FormState = {
        inquiryName : '',
        inquiryEmail : '',
        inquiryCertCode : '',
    }

    const [formData, setFormData] = useState<FormState>(initialPwInquiryForm); 
    const [enableCodeInput, setEnableCodeInput] = useState<boolean>(false);
    const [enableCodeSendBtn, setEnableCodeSendBtn] = useState<boolean>(false);
    const [enableResettingBtn, setEnableResettingBtn] = useState<boolean>(false);
    const [codeSendCount, setCodeSendCount] = useState<number>(0);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [completeCert, setCompleteCert] = useState<boolean>(false);


    const handleInputChange = (fieldName: keyof FormState, value: string) => {
        setFormData({
            ...formData,
            [fieldName]: value,
        });
    };

    const findUserInfo = async() => {        
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/findPw`,
        {
            memberEmail: formData.inquiryEmail,
            memberId: pwInquiryId,
            memberName: formData.inquiryName,
        })
        .then((response) => {
            console.log("일치하는 회원정보가 있음! >>> " + response.data);
            handleStartTimer();
            // 수정 : 이메일 전송까지 걸리는 시간 로딩 필요 
        }).catch(() => {
            console.log("일치하는 회원정보가 없습니다.");
            alert('일치하는 회원 정보가 없음! (임시 알림)');
        })
    };

    const checkCertCode = async() => {
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/checkVerificationCode`,
        {
            memberId: pwInquiryId,
            verificationCode: formData.inquiryCertCode,
        })
        .then((response) => {
            console.log("인증코드 일치 >>> " + response.data);
            setEnableCodeSendBtn(false);
            setEnableCodeInput(false);
            setEnableCodeSendBtn(false);
            setEnableResettingBtn(true);
            handleCloseTimer();
            setCompleteCert(true);
            alert('인증번호가 일치합니다. (임시 알림)');
        })
        .catch(() => {
            console.log("인증코드 일치하지 않음!!! ");
            alert('인증번호가 일치하지 않습니다. (임시 알림)');
        })
    }

    const handleStartTimer = () => {
        setShowTimer(true);
        setEnableCodeSendBtn(true);
        setEnableCodeInput(true);
    }

    const handleCloseTimer = () => {
        setShowTimer(false);
        setEnableCodeInput(false);
        setEnableCodeSendBtn(false);
    }

    return (
        <InquiryFormWrap>
            <InquiryInput
                type="text"
                name="inquiryId"
                placeholder="아이디를 입력해주세요"
                maxLength={12}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwInquiryId(e.target.value)}
            />
            <InquiryInput
                type="text"
                name="inquiryName"
                placeholder="이름을 입력해주세요"
                maxLength={5}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('inquiryName', e.target.value)}
            />
            <EmailInquiryInput
                type="text"
                name="inquiryEmail"
                placeholder="이메일을 입력해주세요"
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('inquiryEmail', e.target.value)}
            />
            <CertificationBtn disabled={enableCodeSendBtn} onClick={() => findUserInfo()}>인증번호 전송</CertificationBtn>

            <CertCodeInput 
                type="text"
                placeholder="인증번호를 입력해주세요"
                maxLength={6}
                disabled={!enableCodeInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('inquiryCertCode', e.target.value)}
            />
            <CertificationBtn onClick={checkCertCode} disabled={!enableCodeInput}>인증번호 확인</CertificationBtn>

            {showTimer && (
            <ExpiryTime 
                onClose={handleCloseTimer}
                enableSendBtn={() => setEnableCodeSendBtn(false)} 
                callCount={codeSendCount}
            />
            )}
            {completeCert && 
                <p>인증번호가 일치합니다.</p>
            }
            <InquiryButton disabled={!enableResettingBtn} onClick={() => setPwResetting(true)}>비밀번호 재설정</InquiryButton>
        </InquiryFormWrap>
    );
}

export default PwInquiry;