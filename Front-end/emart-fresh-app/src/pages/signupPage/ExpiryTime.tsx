import{ useState, useEffect, useRef } from "react";

interface ExpiryTimeProps {
  onClose: () => void;
  enableSendBtn?: () => void;
  callCount: number;
}

function ExpiryTime({ onClose, enableSendBtn, callCount }: ExpiryTimeProps) {
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);
  const timerInterval = 1000;
  const targetTime = 10;
  const elapsedTimeRef = useRef(0); // useRef를 사용하여 변수 유지

  const clearTimer = () => {
    setMinutes(0);
    setSeconds(30);
    elapsedTimeRef.current = 0;
  };

  useEffect(() => {
    clearTimer();
  }, [callCount]);

  useEffect(() => {
    console.log("timer useffect!!");

    const timer = setInterval(() => {
      elapsedTimeRef.current += 1; // useRef로 변수 값을 갱신

      if (elapsedTimeRef.current === targetTime) {
        enableSendBtn(); // 버튼 활성화 함수 호출
      }

      if (minutes === 0 && seconds === 0) {
        clearInterval(timer); 
        onClose(); // 상위 컴포넌트에서 전달받은 콜백 호출
      } else {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }
    }, timerInterval);

    return () => {
      clearInterval(timer);
    };
  }, [minutes, seconds]);

  return (
    <div>
      <p>
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
}

export default ExpiryTime;
