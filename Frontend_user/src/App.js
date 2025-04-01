import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown từ PrimeReact
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import NotFound from "./NotFound";
import PptPage from "./PptPage";
import PngPage from "./PngPage";
import LoginPage from "./LoginPage";


function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation(); // 👈 Lấy đường dẫn hiện tại
  const isLoginPage = location.pathname === "/login"; // 👈 Kiểm tra có phải trang đăng nhập không

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.value);
  };

  return (
    <div className="App">
      {/* Chỉ hiển thị header khi KHÔNG phải trang Login */}
      {!isLoginPage && (
        <header className="header">
          <div className={`container-hero container ${isScrolled ? "hidden" : ""}`}>
            <div className="container hero">
              <div className="customer-support">
                <i className="bx bx-headphone"></i>
                <div className="content-customer-support">
                  <span className="text">Hỗ trợ khách hàng</span>
                  <span className="number">0378656586</span>
                </div>
              </div>
              <div className="container-logo">
                <img src={`/logo.png`} alt="Logo" width={50} height={50} className="logo" />
                <h1 className="logo">
                  <a href="/">XPoint</a>
                </h1>
              </div>
              <div className="container-user">
                <a href="/login"><i className="bx bxs-user"></i></a>
                <i className="bx bxs-grid-alt"></i>
                <div className="content-shopping-cart"></div>
              </div>
            </div>
          </div>

          {/* Navbar */}
          <div className="container-navbar">
            <nav className="navbar container">
              <i className="fa-solid fa-bars"></i>
              <ul className="menu">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/ppt">PowerPoint</a></li>
                <li><a href="/png">Hình ảnh PNG</a></li>
                <li><a href="/about">Hình Nền</a></li>
                <li><a href="/notfound">Mẫu</a></li>
              </ul>

              {/* Thanh tìm kiếm với Dropdown */}
              <form className="search-form">
                <div className="search-box">
                  <Dropdown
                    value={selectedCategory}
                    options={[
                      { label: "PowerPoint", value: 1, to: "/ppt" },
                      { label: "Hình ảnh PNG", value: 2, to: "/png" },
                      { label: "Hình nền", value: 3, to: "/about" }
                    ]}
                    optionLabel="label"
                    placeholder="Powerpoint"
                    onChange={handleCategoryChange}
                    className="dropdown-search"
                  />
                  <input type="search" placeholder="Tìm kiếm.." className="search-input" />
                  <button className="btn-search">
                    <i className="bx bx-search-alt"></i>
                  </button>
                </div>
              </form>
            </nav>
          </div>
        </header>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/ppt" element={<PptPage />} />
        <Route path="/png" element={<PngPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* Chỉ hiển thị footer khi KHÔNG phải trang Login */}
      {!isLoginPage && (
        <footer className="footer">
          <div className="container container-footer">
            <div className="menu-footer">
              <div className="contact-info">
                <p className="title-footer">Thông tin liên hệ</p>
                <ul>
                  <li>Địa chỉ: 24, Nhân Hoà, Mỹ Hào, Hưng Yên</li>
                  <li>Điện thoại: 123-456-7890</li>
                  <li>Email: xpoint@support.com</li>
                </ul>
                <div className="social-icons">
                  <span className="facebook"><i className='bx bxl-facebook'></i></span>
                  <span className="twitter"><i className='bx bxl-twitter'></i></span>
                  <span className="youtube"><i className='bx bxl-youtube'></i></span>
                  <span className="pinterest"><i className='bx bxl-pinterest-alt'></i></span>
                  <span className="instagram"><i className='bx bxl-instagram'></i></span>
                </div>
              </div>
              <div className="information">
                <p className="title-footer">Thông tin</p>
                <ul>
                  <li><a href="#">Cung cấp thông tin</a></li>
                  <li><a href="#">Chính trị riêng tư</a></li>
                  <li><a href="#">Liên hệ</a></li>
                </ul>
              </div>
              <div className="my-account">
                <p className="title-footer">Hiểu thêm</p>
                <ul>
                  <li><a href="#">Lịch sử của Xpoint</a></li>
                  <li><a href="#">Danh sách mong muốn</a></li>
                </ul>
              </div>
              <div className="newsletter">
                <p className="title-footer">Thông tin Xpoint</p>
                <div className="content">
                  <p>Hãy đăng ký để theo dõi chúng tôi</p>
                  <input type="email" placeholder="Kết nối để biết thêm thông tin..." />
                  <button>Đăng ký</button>
                </div>
              </div>
            </div>
            <div className="copyright">
              <p>Bản quyền của Đỗ Thị Xuân &copy; 2025</p>
              <img src="/img/payment.png" alt="Pagos" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
