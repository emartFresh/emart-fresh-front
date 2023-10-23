/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import styles from '../page_css/Signup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import ExpiryTime from './ExpiryTime';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface FormState {
    signupId: string;
    signupPassword: string;
    signupPasswordCheck: string;
    signupName: string;
    signupEmail: string;
    certificationCode: string;
}

interface Messages {
    id: string;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    certificationCode: string;
}

interface Validity {
    isIdValid: boolean;
    isIdDuplicated: boolean;
    isPasswordValid: boolean;
    isPasswordConfirmValid: boolean;
    isNameValid: boolean;
    isEmailValid: boolean;
    isEmailDuplicated: boolean;
    isCertificationCode?: boolean;
}

const Signup = () => { 

    const navigate = useNavigate();

    const initialFormState: FormState = {
        signupId: '',
        signupPassword: '',
        signupPasswordCheck: '',
        signupName: '',
        signupEmail: '',
        certificationCode: '',
    };

    const [formData, setFormData] = useState<FormState>(initialFormState);

    const [messages, setMessages] = useState<Messages>({
        id: '',
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        certificationCode: '',
    });

    const [formValidity, setFormValidity] = useState<Validity>({
        isIdValid: false,
        isIdDuplicated: false,
        isPasswordValid: false,
        isPasswordConfirmValid: false,
        isNameValid: false,
        isEmailValid: false,
        isEmailDuplicated: false,
        isCertificationCode: false,
    })

    const spaceRegex = /\s/;
    const idRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}$/;
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,16}$/;
    const nameRegex = /^[가-힣]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const [showCertCodeInput, setShowCertCodeInput] = useState<boolean>(false);
    const [emailCertCode, setEmailCertCode] = useState<string>('');
    const [showExpiryTime, setShowExpiryTime] = useState<boolean>(false);

    const [enableInput, setEnableInput]= useState<boolean>(false);
    const [enableCodeSendBtn, setEnableCodeSendBtn] = useState<boolean>(false);
    const [enableCodeCertBtn, setEnableCodeCertBtn] = useState<boolean>(false);
    const [codeSendCount, setCodeSendCount] = useState<number>(0);
    const [isAllValid, setIsAllValid] = useState<boolean>(false);    
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(()=> {
        isFormValid();
    },[formValidity]);

    const isFormValid = () => {
        const copyObj = {...formValidity};
        delete copyObj.isCertificationCode;
        const enable = Object.values(copyObj).every(Boolean);
        setEnableCodeSendBtn(enable);
        setIsAllValid(enable);
    };

    const isSingupValid = () => {
        const validity = Object.values(formValidity).every(Boolean);
        return validity;
    };

    const handleStartTimer = () => {
      setShowExpiryTime(true);
      handleMessageChange('certificationCode','');
      setEnableInput(true);
      setEnableCodeCertBtn(true);
    };
  
    const handleCloseExpiryTime = () => {
      setShowExpiryTime(false);
      handleMessageChange('certificationCode','인증 시간이 만료되었습니다. 다시 시도해주세요.');
      setEmailCertCode('');
      setEnableCodeCertBtn(false);
    };
    
    const handleSignup = async(signupData:FormState) => {
        if(isSingupValid()){
            await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/add`, {
                memberId: signupData.signupId,
                memberPw: signupData.signupPassword,
                memberName: signupData.signupName,
                memberEmail: signupData.signupEmail, 
            })
            .then((response) => {
                console.log(response.data);
                console.log(response.status);  
                toast.success('회원가입이 완료되었습니다.');
                navigate('/login')
            })
            .catch(() => toast.error('회원가입에 실패했습니다.'));
        }
    }

    const handleInputChange = (fieldName: keyof FormState, value: string) => {
        setFormData({
            ...formData,
            [fieldName]: value,
        });
    };

    const handleMessageChange = (fieldName: keyof Messages, value: string) => {
        setMessages({
            ...messages,
            [fieldName]: value,
        })
    }

    const handleValidityChange = (fieldName: keyof Validity, value: boolean) => {
        setFormValidity({
            ...formValidity,
            [fieldName]: value,
        })
    }

    const validateId = (value: string) => {
        if (value.trim() === '') { 
            handleMessageChange('id', '아이디를 입력해주세요.');
            handleValidityChange('isIdValid', false);
        }else if(spaceRegex.test(value)){
            handleMessageChange('id','아이디는 띄어쓰기 없이 입력해주세요.');
            handleValidityChange('isIdValid', false);
        }else if (!idRegex.test(value)) {
            handleMessageChange('id', '아이디는 영문과 숫자를 포함하고, 최소 8자 최대 12자로 입력해주세요.');
            handleValidityChange('isIdValid', false);
        }else {
            handleMessageChange('id', '');
            handleValidityChange('isIdValid', true);
        }
    }

    const idDuplicateCheck = async(signupId: string) => {
        if(formValidity.isIdValid){
            await axios.get(`${import.meta.env.VITE_BACK_PORT}/member/idCheck`, {
                params: {
                    memberId: signupId,
                },
            })
            .then((response) => {
                if(response.status === 200){
                    console.log("아이디 중복체크 >> 사용가능한 아이디");
                    handleValidityChange('isIdDuplicated', true);
                    handleMessageChange('id', '사용가능한 아이디입니다.')
                }
            })
            .catch(() => {
                console.log("아이디 중복체크 >> 이미 존재하는 아이디");
                handleValidityChange('isIdDuplicated', false);
                handleMessageChange('id','이미 존재하는 아이디입니다.')
            })
        }
    }

    const validatePassword = (value: string) => {
        if (value.trim() === '') {
            handleMessageChange('password','비밀번호를 입력해주세요.');
            handleValidityChange('isPasswordValid', false);
        }else if(spaceRegex.test(value)){
            handleMessageChange('password','비밀번호는 띄어쓰기 없이 입력해주세요.');
            handleValidityChange('isPasswordValid', false);
        }else if(!pwRegex.test(value)){
            handleMessageChange('password','비밀번호는 영문/숫자/특수문자를 포함하고, 최소 8자 최대 16자로 입력해주세요.');
            handleValidityChange('isPasswordValid', false);
        }else if(value === formData.signupId){
            handleMessageChange('password','비밀번호는 아이디와 동일할 수 없습니다.');
            handleValidityChange('isPasswordValid', false);
        } else {
            handleMessageChange('password','');
            handleValidityChange('isPasswordValid', true);
        }
    }

    const validatePasswordConfirm = (value: string) => {
        if (value.trim() === '') {
            handleMessageChange('passwordConfirm','확인 비밀번호을 입력해주세요.');
            handleValidityChange('isPasswordConfirmValid', false);
        } else if(value !== formData.signupPassword){
            handleMessageChange('passwordConfirm','비밀번호를 동일하게 입력해주세요');
            handleValidityChange('isPasswordConfirmValid', false);
        }else if(value === formData.signupPassword){
            handleMessageChange('passwordConfirm', '');
            handleValidityChange('isPasswordConfirmValid', true);
        }
    }
    const validateName = (value: string) => {
        if (value.trim() === '') {
            handleMessageChange('name','이름을 입력해주세요.');
            handleValidityChange('isNameValid', false);
        } else if(spaceRegex.test(value)){
            handleMessageChange('name','이름에는 띄어쓰기를 포함할 수 없습니다.')
            handleValidityChange('isNameValid', false);
        } else if(!nameRegex.test(value)){
            handleMessageChange('name','이름은 완성된 한글 글자로 입력해야합니다.');
            handleValidityChange('isNameValid', false);
        } else if (value.trim().length < 2 || 5 < value.trim().length) {  
            handleMessageChange('name','이름은 최소 2자에서 최대 5자로 입력해주세요.');
            handleValidityChange('isNameValid', false);
        } else {
            handleMessageChange('name','');
            handleValidityChange('isNameValid', true);
        }
    }
                                                                                                                        
    const validateEmail = (value: string) => {
        if(value.trim() === ''){
            handleMessageChange('email','이메일을 입력해주세요.');
            handleValidityChange('isEmailValid', false);
        } else if(spaceRegex.test(value)){
            handleMessageChange('email',' 이메일은 띄어쓰기를 포함할 수 없습니다.')
            handleValidityChange('isEmailValid', false);
        } else if(!emailRegex.test(value)){
            handleMessageChange('email','이메일 형식이 유효하지 않습니다.');
            handleValidityChange('isEmailValid', false);
        } else{
            handleMessageChange('email','');
            handleValidityChange('isEmailValid', true);
        }
    }

    const emailDuplicateCheck = async(signupEmail: string) => {
        if(formValidity.isEmailValid){
            await axios.get(`${import.meta.env.VITE_BACK_PORT}/member/emailCheck`, {
                params: {
                    memberEmail: signupEmail,
                },
            })
            .then((response) => {
                if(response.status === 200){
                    console.log("이메일 중복체크 >> 사용가능한 이메일");
                    handleMessageChange('email', '사용가능한 이메일입니다.')
                    handleValidityChange('isEmailDuplicated', true);
                }
            })
            .catch((error) => {
                console.error(error.response.data);
                console.log("이메일 중복체크 >> 이미 존재하는 이메일");
                handleMessageChange('email','이미 존재하는 이메일입니다.')
                handleValidityChange('isEmailDuplicated', false);
            })
        }
    }
    
    const clickCertBtn = async(signupEmail: string) => {
        setShowCertCodeInput(true);
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/checkVerifyEmail`,{memberEmail: signupEmail})
        .then((response) => {
            toast.success('인증번호를 전송했습니다.');
        }).catch(() => {
            toast.error('인증번호 전송에 실패했습니다. 관리자에게 문의해주세요.');
        })
    };

    const validateCertificationCode = async(value:string) => {

        const trimValue = value.replace(/\s+/g, '');

        // if(isBeforeGetCode()){
        //     handleMessageChange('certificationCode','인증번호가 일치하지않습니다.');
        //     handleValidityChange('isCertificationCode', false);
        //     console.log("인증 코드 불일치");
        //     return;
        // }

        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/checkAccountEmailVerification`,{
            memberEmail: formData.signupEmail,
            verificationCode: trimValue
        })
        .then((response) => {
            handleMessageChange('certificationCode', '인증이 완료되었습니다.');
            handleValidityChange('isCertificationCode', true);
            setShowExpiryTime(false);
            setEnableCodeCertBtn(false);
            setEnableCodeSendBtn(false);
            setIsComplete(true);
        })
        .catch(() => {
            handleMessageChange('certificationCode','인증번호가 일치하지않습니다.')
            handleValidityChange('isCertificationCode', false);
        })
    };
        

    // const isBeforeGetCode = () => {
    //     return emailCertCode === '';
    // }
    
  return (
    <div className={styles.container}>
        <h2 className={styles.title}>회원가입</h2>
        <div className={styles.signupForm}>
            <div className={styles.inputWrap}>
                <div className={styles.centeredContent}>
                    <TextField
                        label="ID"
                        type="text"
                        autoComplete="off"
                        variant="standard"
                        disabled={enableInput}
                        className={styles.signupId} 
                        onChange={(e) => {
                            handleInputChange('signupId', e.target.value);
                            validateId(e.target.value);
                        }}
                        onBlur={() => {
                            if (formValidity.isIdValid) {
                                idDuplicateCheck(formData.signupId);
                            }
                        }}
                    />
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className={`${styles.inputValueCheckIcon} ${formValidity.isIdValid && formValidity.isIdDuplicated ? styles.valid : styles.invalid}`}
                    />
                </div>
                <p className={styles.message}>{messages.id}</p>
            </div>
            <div className={styles.inputWrap}>
                <div className={styles.centeredContent}>
                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="off"
                        variant="standard"
                        disabled={enableInput}
                        className={styles.signupPw} 
                        onChange={(e) => {handleInputChange('signupPassword', e.target.value); validatePassword(e.target.value);}}
                    />
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className={`${styles.inputValueCheckIcon} ${formValidity.isPasswordValid ? styles.valid : styles.invalid}`}
                    />
                </div>
                <p className={styles.message} >{messages.password}</p>
            </div>
            <div className={styles.inputWrap}>
                <div className={styles.centeredContent}>
                    <TextField
                        label="Password Check"
                        type="password"
                        autoComplete="off"
                        variant="standard"
                        disabled={enableInput}
                        className={styles.signupPwCheck} 
                        onChange={(e) => {handleInputChange('signupPasswordCheck', e.target.value); validatePasswordConfirm(e.target.value);}}
                    />
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className={`${styles.inputValueCheckIcon} ${formValidity.isPasswordConfirmValid ? styles.valid : styles.invalid}`}
                    />
                </div>
                <p className={styles.message}>{messages.passwordConfirm}</p>
            </div>
            <div className={styles.inputWrap}>
                <div className={styles.centeredContent}>
                    <TextField
                        label="Name"
                        type="text"
                        autoComplete="off"
                        variant="standard"
                        disabled={enableInput}
                        className={styles.signupName}
                        onChange={(e) => {handleInputChange('signupName', e.target.value); validateName(e.target.value);}}
                    />
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className={`${styles.inputValueCheckIcon} ${formValidity.isNameValid ? styles.valid : styles.invalid}`}
                    />
                </div>
                <p className={styles.message}>{messages.name}</p>
            </div>
            <div className={`${styles.inputWrap} ${styles.emailInputWrap}`}>
                <div className={styles.emailCenteredContent}>
                    <TextField
                        label="Email"
                        type="text"
                        autoComplete="off"
                        variant="standard"
                        disabled={enableInput}
                        className={styles.signupEmail} 
                        onChange={(e) => {
                            handleInputChange('signupEmail', e.target.value); 
                            validateEmail(e.target.value);
                        }}
                        onBlur={() => {
                            if (formValidity.isEmailValid) {
                                emailDuplicateCheck(formData.signupEmail);
                            }
                        }}
                    />
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className={`${styles.inputValueCheckIcon} ${styles.emailValueCheckIcon} ${formValidity.isEmailValid && formValidity.isEmailDuplicated ? styles.valid : styles.invalid}`}
                    />
                    <button 
                        className={styles.emailCertificationBtn} 
                        disabled={!isAllValid || !enableCodeSendBtn || isComplete}
                        onClick={() => {                            
                            clickCertBtn(formData.signupEmail);
                            setCodeSendCount(()=>codeSendCount+1);
                            setEnableCodeSendBtn(false);  
                            handleStartTimer();
                        }}
                    >인증번호받기</button>
                </div>
                <p className={`${styles.message} ${styles.emailMessage}`}>{messages.email}</p>
            </div>

            {showCertCodeInput && (
                <div className={`${styles.inputWrap} ${styles.emailInputWrap}`}>
                    <div className={styles.emailCenteredContent}>
                        <TextField
                            label="Certification Code"
                            type="text"
                            autoComplete="off"
                            variant="standard"
                            disabled={isSingupValid()}
                            className={styles.emailCertCode} 
                            onChange={(e) => handleInputChange('certificationCode', e.target.value) }
                        />
                        <FontAwesomeIcon 
                            icon={faCircleCheck} 
                            className={`${styles.inputValueCheckIcon} ${styles.emailValueCheckIcon} ${formValidity.isCertificationCode ? styles.valid : styles.invalid}`}
                        />
                        <button 
                            className={styles.emailCertificationBtn} 
                            onClick={() => validateCertificationCode(formData.certificationCode)}
                            disabled={!enableCodeCertBtn}
                        >인증하기</button>
                    </div>
                    <p className={`${styles.message} ${styles.emailMessage}`}>{messages.certificationCode}</p>

                    <p className={styles.timer}>
                        {showExpiryTime && (
                            <ExpiryTime 
                                callCount={codeSendCount}
                                onClose={handleCloseExpiryTime}
                                enableSendBtn={() => setEnableCodeSendBtn(true)} />
                        )}
                    </p>
                </div>
            )}
            <div className={styles.loginLinkWrap}>
                <Link to='/login' className={styles.loginLink}>이미 회원이신가요?</Link>
            </div>
            <button 
                className={styles.signupBtn} 
                onClick={() => handleSignup(formData)}
                disabled={!isSingupValid()}
            >회원가입</button>
        </div>
    </div>
  )
}

export default Signup