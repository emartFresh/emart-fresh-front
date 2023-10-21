import { useState } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const InquiryFormWrap = styled.div`
    width: 100%;
    height: 22em;
    border-top: 0;
    padding-top: 3.8em;
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

const InquiryButton = styled.button`
    display: block;
    margin: 0 auto;
    margin-top: 3.5em;
    width: 12em;
    padding: 0.8em 0;
    font-size: 0.9em;
`;



//수정 : const IdInquiry = (): JSX.Element => {
const IdInquiry = () => {
    const [inquiryName, setInquiryName] = useState<string>('');
    const [inquiryEmail, setInquiryEmail] = useState<string>('');
    const [resultId, setResultId] = useState<string>('');

        const findId = async() => {
            if(inquiryName === '' || inquiryEmail === ''){
                toast.error('이름 또는 이메일을 입력해주세요.');
            }

            if(inquiryName !== '' && inquiryEmail !== ''){
                await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/findId`, {
                    memberName: inquiryName,
                    memberEmail: inquiryEmail
                })
                .then((response) => {
                    console.log(response.data);
                    setResultId(response.data);
                })
                .catch(() => toast.error('아이디 찾기에 실패했습니다.'));
            }
        }

  return (
    <InquiryFormWrap>
        {resultId === '' ?
        <>
            <InquiryInput type="text" name='inquiryName' placeholder='이름을 입력해주세요' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryName(e.target.value)}/>
            <InquiryInput type="text" name='inquiryEmail' placeholder='이메일을 입력해주세요' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryEmail(e.target.value)}/>
            <InquiryButton onClick={findId}>아이디 찾기</InquiryButton>
        </>
        :
        <>
            <p>{`조회 요청하신 아이디는 ${resultId}입니다.`}</p>
            <Link to='/login'>로그인 페이지로 이동</Link>
        </>
        
        }
    </InquiryFormWrap>
  )
}

export default IdInquiry