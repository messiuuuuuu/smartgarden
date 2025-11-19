import React, { useState, useEffect } from "react";
import '../../Login.css';
import { useNavigate } from "react-router-dom";
import { path } from "../../untils/constant";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { realtimedb } from "../../firebaseConfig";
import { signInWithGoogle } from "../../firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Tên đăng nhập và mật khẩu không được để trống!");
      return;
    }
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user.uid);

      const userRef = ref(realtimedb, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.exists() ? snapshot.val() : null;

      if (userData && Number(userData.role) === 1) {
        navigate(path.ADMIN);
      } else {
        navigate(path.DEVICELIST);
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email hoặc mật khẩu không đúng.");
      } else {
        setError(err.message || "Đăng nhập thất bại");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      console.log("Google sign in:", user.uid, user.email);

      const userRef = ref(realtimedb, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await set(userRef, {
          email: user.email || null,
          displayName: user.displayName || null,
          role: 0,
          createdAt: Date.now(),
        });
      }

      const userData = snapshot.exists() ? snapshot.val() : { role: 0 };
      if (Number(userData.role) === 1) {
        navigate(path.ADMIN);
      } else {
        navigate(path.DEVICELIST);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError(err.message || "Đăng nhập bằng Google thất bại");
    }
  };

  return (
    <div className="login-body">
      <form className="login-card" onSubmit={handleSubmit}>
        <h3>Đăng nhập</h3>

        <label>Email</label>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu của bạn"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         

        {error && <div className="error">{error}</div>}
        <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <span
            className="text-blue-200 cursor-pointer hover:underline "
            onClick={() => Swal.fire("Thông báo", "Hãy liên hệ Admin!", "info")}
            role="button"
          >
            Quên mật khẩu?
          </span>
        </div>

        <button type="submit" 
                className="btn-login">
                Đăng nhập
        </button>

        <div className="social-login text-white">
          <span>Hoặc đăng nhập bằng</span></div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn-google"
          aria-label="Sign in with Google"
        >
          <FcGoogle className="google-icon" />
          <span> Google</span>
        </button>

        <div className="w-full flex items-center justify-between mt-6">
          <div className="flex items-center gap-10">
            <p className="text-white">
              Chưa có tài khoản?{" "}
              <span
                className="ml-2 text-blue-200 cursor-pointer hover:underline font-medium"
                onClick={() => navigate(path.REGISTER)}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;