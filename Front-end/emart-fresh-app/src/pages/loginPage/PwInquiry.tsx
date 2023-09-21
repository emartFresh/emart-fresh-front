/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios'
import styled from 'styled-components';

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

const PwInquiry = () => {
    const [inquiryId, setInquiryId] = useState<string>('');
    const [inquiryName, setInquiryName] = useState<string>('');
    const [inquiryEmail, setInquiryEmail] = useState<string>('');
    const [inquiryCode, setInquiryCode] = useState<string>('');
    const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
    const [emailCode ,setEmailCode] = useState<string>('');
    // showUpdatePw
    const [open, setOpen] = useState<boolean>(false);

    const findUserInfo = async() => {
        setShowCodeInput(true);
        
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/findPw`,
        {
            memberEmail: inquiryEmail,
            memberId: inquiryId,
            memberName: inquiryName
        })
        .then((response) => {
            console.log("일치하는 회원정보가 있음! >>> " + response.data);
        }).catch(() => {
            console.log("일치하는 회원정보가 없습니다.");
        })
    };


    const checkCertCode = async() => {
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/checkVerificationCode`,
        {
            memberId: inquiryId,
            verificationCode: inquiryCode
        })
        .then((response) => {
            console.log("인증코드 일치 >>> " + response.data);            
        })
        .catch(() => {
            console.log("인증코드 일치하지 않음!!! ");
        })
    }

    // TODO : 인증번호 전송 버튼 누르면 -> 인풋 다 막기 -> 코드 인풋 활성화
    // TODO : 인증번호 확인 버튼 눌러서 -> 코드입력 인풋까지 막고 -> 비밀번호 재설정 버튼 활성화 
    // TODO : 비밀번호 재설정은 모달로 띄우기 
    return (
        <InquiryFormWrap>
            <InquiryInput
                type="text"
                name="inquiryId"
                placeholder="아이디를 입력해주세요"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryId(e.target.value)}
            />
            <InquiryInput
                type="text"
                name="inquiryName"
                placeholder="이름을 입력해주세요"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryName(e.target.value)}
            />
            <EmailInquiryInput
                type="text"
                name="inquiryEmail"
                placeholder="이메일을 입력해주세요"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryEmail(e.target.value)}
            />
            <CertificationBtn onClick={findUserInfo}>인증번호 전송</CertificationBtn>

            <CertCodeInput 
                type="text"
                placeholder="인증번호를 입력해주세요"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryCode(e.target.value)}
            />
            <CertificationBtn onClick={checkCertCode}>인증번호 확인</CertificationBtn>

            <InquiryButton onClick={() => setOpen(true)}>비밀번호 재설정</InquiryButton>
        </InquiryFormWrap>
    );
}

export default PwInquiry;