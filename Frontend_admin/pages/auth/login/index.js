import { useState, useRef } from 'react';
import Head from "next/head";
import styles from './index.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import AppConfig from '../../../layout/AppConfig';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import React from 'react';
const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const toast = useRef(null); // Thêm useRef
    const toggleSignUp = () => setIsSignUp((prev) => !prev);

    // Hàm xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:1000/auth/register', {
                ten: name,
                email: emailOrUsername,
                mat_khau: password,
                quyen: 'User' // Mặc định là User khi đăng ký, Admin cần được set thủ công trong DB
            });
            setError('');
            alert(response.data.message);
            toggleSignUp(); // Chuyển sang form đăng nhập sau khi đăng ký
        } catch (err) {
            setError(err.response?.data?.error || 'Đăng ký thất bại!');
        }
    };

    // Hàm xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đăng nhập
            const response = await axios.post('http://localhost:1000/auth/login', {
                emailOrUsername,
                mat_khau: password,
            });
            
            const { token } = response.data;
            // Lưu token vào localStorage
            localStorage.setItem('token', token);

            // Gọi API để lấy thông tin người dùng
            const userResponse = await axios.get('http://localhost:1000/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = userResponse.data.user;

            // Kiểm tra quyền Admin
            if (!user.quyen || user.quyen !== 'Admin') { // Kiểm tra nếu quyen không tồn tại hoặc không phải Admin
                setError('Chỉ Admin mới được phép đăng nhập!');
                localStorage.removeItem('token'); // Xóa token nếu không phải Admin
                return;
            }

            setError('');
            // Hiển thị thông báo đẹp hơn
            toast.current.show({ 
                severity: 'success', 
                summary: 'Thành công', 
                detail: 'Đăng nhập thành công!', 
                life: 3000 
            });

            // Chờ 1.5s rồi chuyển hướng
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại!');
        }
    };

    return (
        <>
            <Head>
                <title>Đăng nhập / Đăng ký</title>
            </Head>
            <div className="fullscreen-bg">
            <Toast ref={toast} />
                <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
                    {/* Đăng ký */}
                    <div className={`${styles.formContainer} ${styles.signUp} ${isSignUp ? styles.show : styles.hide}`}>
                        <form onSubmit={handleRegister}>
                            <h1>Tạo tài khoản</h1>
                            <div className="social-icons">
                                {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                                    <a key={index} href="#" className={styles.icon}>
                                        <FontAwesomeIcon icon={icon} />
                                    </a>
                                ))}
                            </div>
                            <span>hoặc sử dụng email của bạn để đăng ký</span>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit">Đăng ký</button>
                        </form>
                    </div>

                    {/* Đăng nhập */}
                    <div className={`${styles.formContainer} ${styles.signIn} ${!isSignUp ? styles.show : styles.hide}`}>
                        <form onSubmit={handleLogin}>
                            <h1>Đăng nhập</h1>
                            <div className="social-icons">
                                {[faGooglePlusG, faFacebookF, faGithub, faLinkedinIn].map((icon, index) => (
                                    <a key={index} href="#" className={styles.icon}>
                                        <FontAwesomeIcon icon={icon} />
                                    </a>
                                ))}
                            </div>
                            <span>hoặc sử dụng email và mật khẩu của bạn</span>
                            <input
                                type="text"
                                placeholder="Email hoặc tên người dùng"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <a href="#">Quên mật khẩu?</a>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit">Đăng nhập</button>
                        </form>
                    </div>

                    {/* Hiệu ứng chuyển đổi */}
                    <div className={styles.toggleContainer}>
                        <div className={styles.toggle}>
                            <div className={`${styles.togglePanel} ${styles.toggleLeft} ${isSignUp ? styles.hide : styles.show}`}>
                                <h1>Chào mừng trở lại!</h1>
                                <p>Nhập thông tin cá nhân để sử dụng tất cả các tính năng</p>
                                <button className={styles.hidden} onClick={toggleSignUp}>Đăng nhập</button>
                            </div>
                            <div className={`${styles.togglePanel} ${styles.toggleRight} ${isSignUp ? styles.show : styles.hide}`}>
                                <h1>Xin chào, bạn!</h1>
                                <p>Đăng ký để khám phá các tính năng tuyệt vời</p>
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