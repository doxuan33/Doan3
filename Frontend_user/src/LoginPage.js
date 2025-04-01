import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styles from "./login.module.css";

const LoginPage = ({ history }) => { // Added `history` for navigation after successful login
  const navigate = useNavigate(); // Thay history bằng navigate
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    ten: "",
    emailOrUsername: "",
    mat_khau: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleSignUp = () => setIsSignUp((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = isSignUp
      ? "http://localhost:1000/auth/register"
      : "http://localhost:1000/auth/login";
    
    const data = isSignUp
      ? { ten: formData.ten, email: formData.emailOrUsername, mat_khau: formData.mat_khau }
      : { emailOrUsername: formData.emailOrUsername, mat_khau: formData.mat_khau };
    
    try {
      const response = await axios.post(url, data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Chuyển hướng sau khi login thành công
      } else {
        setErrorMessage(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Có lỗi xảy ra");
    }
    setIsLoading(false);
  };
  return (
    <>
      <Helmet>
        <title>Đăng nhập - MyApp</title>
      </Helmet>
      <div className="fullscreen-bg">
        <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
        <div className={`${styles.formContainer} ${styles.signUp}`}>
            <form onSubmit={handleSubmit}>
              <h1>Tạo tài khoản</h1>
              <div className="social-icons">
                {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                  <a key={index} href="#" className={styles.icon}>
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
              {errorMessage && <div className={styles.error}>{errorMessage}</div>}
              <input
                type="text"
                placeholder="Họ và tên"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Email"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                name="mat_khau"
                value={formData.mat_khau}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          </div>

          <div className={`${styles.formContainer} ${styles.signIn}`}>
            <form onSubmit={handleSubmit}>
              <h1>Đăng nhập</h1>
              <div className="social-icons">
                {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                  <a key={index} href="#" className={styles.icon}>
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
              {errorMessage && <div className={styles.error}>{errorMessage}</div>}
              <input
                type="email"
                placeholder="Email"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                name="mat_khau"
                value={formData.mat_khau}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          </div>

          {/* Hiệu ứng chuyển đổi */}
          <div className={styles.toggleContainer}>
            <div className={styles.toggle}>
              <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                <h1>Chào mừng trở lại!</h1>
                <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng</p>
                <button className={styles.hidden} onClick={toggleSignUp}>Đăng nhập</button>
              </div>
              <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                <h1>Xin chào, bạn!</h1>
                <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng</p>
                <button className={styles.hidden} onClick={toggleSignUp}>Đăng ký</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default LoginPage;
