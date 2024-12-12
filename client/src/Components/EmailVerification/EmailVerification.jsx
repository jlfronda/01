import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

import './EmailVerification.css';

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };


  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    try {
      await verifyEmail(verificationCode);
      navigate('/'); // redirects you to the mainpage
      toast.success("Email verified successfully");
    } catch (error) {
      console.log('Error response', error.response);
      console.log(error);
      toast.error('Failed to verify email');
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== "")) {
      handleSubmit(new Event('submit'));
    }
  }, [code]);

  return (
    <div className="container">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="digitContainer">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="6" // This makes the uiser copy and paste of verification code
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="inputCode"
            />
          ))}
        </div>
        <button type="submit" className="verifyButton">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmailVerification;