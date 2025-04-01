import { useState } from 'react';
import Head from "next/head";
import styles from './index.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import React from 'react';
import AppConfig from '../../../layout/AppConfig';

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleSignUp = () => setIsSignUp((prev) => !prev);

    return (
      <>
        <div className="fullscreen-bg">
            <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
            
            {/* Đăng ký */}
            <div className={`${styles.formContainer} ${styles.signUp} ${isSignUp ? styles.show : styles.hide}`}>
                <form>
                <h1>Tạo tài khoản</h1>
                <div className="social-icons">
                    {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                    <a key={index} href="#" className={styles.icon}>
                        <FontAwesomeIcon icon={icon} />
                    </a>
                    ))}
                </div>
                <span>hoặc sử dụng email của bạn để đăng ký</span>
                <input type="text" placeholder="Họ và tên" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Mật khẩu" required />
                <button type="submit">Đăng ký</button>
                </form>
            </div>

            {/* Đăng nhập */}
            <div className={`${styles.formContainer} ${styles.signIn} ${!isSignUp ? styles.show : styles.hide}`}>
                <form>
                <h1>Đăng nhập</h1>
                <div className="social-icons">
                    {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                    <a key={index} href="#" className={styles.icon}>
                        <FontAwesomeIcon icon={icon} />
                    </a>
                    ))}
                </div>
                <span>hoặc sử dụng email và mật khẩu của bạn</span>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Mật khẩu" required />
                <a href="#">Quên mật khẩu?</a>
                <button type="submit">Đăng nhập</button>
                </form>
            </div>

            {/* Hiệu ứng chuyển đổi */}
            <div className={styles.toggleContainer}>
                <div className={styles.toggle}>
                <div className={`${styles.togglePanel} ${styles.toggleLeft} ${isSignUp ? styles.hide : styles.show}`}>
                    <h1>Chào mừng trở lại!</h1>
                    <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                    <button className={styles.hidden} onClick={toggleSignUp}>Đăng nhập</button>
                </div>
                <div className={`${styles.togglePanel} ${styles.toggleRight} ${isSignUp ? styles.show : styles.hide}`}>
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

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LoginPage;
