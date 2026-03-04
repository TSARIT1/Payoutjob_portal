import React, { useState, useEffect } from 'react';
import './style.css';

const OtpVerification = ({ email, onComplete, cooldown = 45 }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(cooldown);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setOtpError('');
    
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
    
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const verifyOtp = (enteredOtp) => {
    if (enteredOtp.length === 6) {
      // Simulate verification
      setTimeout(() => {
        onComplete();
      }, 500);
    } else {
      setOtpError('Please enter a valid 6-digit OTP');
    }
  };

  const handleResendOtp = () => {
    console.log('Resending OTP to:', email);
    setResendDisabled(true);
    setCountdown(cooldown);
  };

  return (
    <div className="emp-otp-container">
      <p>We've sent a verification code to <strong>{email}</strong></p>
      <div className="emp-otp-inputs">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleOtpChange(e.target, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            className="emp-otp-input"
            autoFocus={index === 0}
          />
        ))}
      </div>
      {otpError && <p className="emp-error">{otpError}</p>}
      <p className="emp-otp-resend">
        Didn't receive code?{' '}
        <button
          type="button"
          className="emp-resend-btn"
          onClick={handleResendOtp}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
        </button>
      </p>
    </div>
  );
};

export default OtpVerification;