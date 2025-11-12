import React, { useState } from 'react';
import '../../Login.css';
import { useNavigate } from 'react-router-dom';
import { path } from '../../untils/constant';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (!email) {
      newErrors.email = 'Email không được để trống!';
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email không hợp lệ!';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Mật khẩu không được để trống!';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp!';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', confirmPassword: '' });
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      setVerificationSent(true);
      console.log('User registered and verification sent:', user.email);
    } catch (error) {
      console.error('Registration failed:', error.code, error.message);
      const newErrors = { ...errors };
      switch (error.code) {
        case 'auth/email-already-in-use':
          newErrors.email = 'Email này đã được sử dụng!';
          break;
        case 'auth/invalid-email':
          newErrors.email = 'Email không hợp lệ!';
          break;
        case 'auth/weak-password':
          newErrors.password = 'Mật khẩu quá yếu!';
          break;
        default:
          newErrors.email = error.message || 'Đăng ký thất bại';
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-body">
      <form className="login-card" onSubmit={handleRegister}>
        <h3>Đăng ký tài khoản</h3>

        {verificationSent ? (
          <>
            <div className="error" style={{ color: '#a7f3d0', alignSelf: 'center' }}>
              Email xác minh đã được gửi đến {email}. Vui lòng kiểm tra hộp thư và xác minh tài khoản trước khi đăng nhập!
            </div>
            <button
              type="button"
              className="btn-login"
              onClick={() => navigate(path.LOGIN)}
              style={{ marginTop: '20px' }}
            >
              Quay lại đăng nhập
            </button>
          </>
        ) : (
          <>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <div className="error">{errors.email}</div>}

            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {errors.password && <div className="error">{errors.password}</div>}

            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </>
        )}

        <div className="w-full flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <p className="text-white">
              Đã có tài khoản?{' '}
              <span
                className="ml-2 text-blue-200 cursor-pointer hover:underline font-medium"
                onClick={() => navigate(path.LOGIN)}
              >
                Đăng nhập ngay
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;