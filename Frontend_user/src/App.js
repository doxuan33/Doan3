import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import NotFound from "./NotFound";
import PptPage from "./PptPage";
import PngPage from "./PngPage";
import LoginPage from "./LoginPage";
import UserPage from "./UserPage";
// import ImageEditor from "./ImageEditor";
import AIPage from "./AIPage";
function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const op = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:1000/danhmucs");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:1000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedUser = response.data.user;
          setUser(fetchedUser);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setSelectedCategory({ label: "PowerPoint", value: 1, to: "/ppt" });
    }

    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const queryParams = new URLSearchParams(location.search);
      const categoryFromUrl = queryParams.get("category");
      if (categoryFromUrl) {
        const matchedCategory = categories.find(
          (cat) => cat.ten.toLowerCase() === categoryFromUrl.toLowerCase()
        );
        if (matchedCategory) {
          params.append("danh_muc_id", matchedCategory.id);
        }
      }

      if (selectedCategory?.value === 1 || (!selectedCategory && location.pathname === "/ppt")) {
        const response = await axios.get(
          `http://localhost:1000/maupowerpoints?${params.toString()}`
        );
        navigate("/ppt", {
          state: { searchResults: response.data, searchQuery },
          replace: true,
        });
      } else if (selectedCategory?.value === 2 || (!selectedCategory && location.pathname === "/png")) {
        const response = await axios.get(
          `http://localhost:1000/hinhanhs?${params.toString()}`
        );
        navigate("/png", {
          state: { searchResults: response.data, searchQuery },
          replace: true,
        });
      } else if (selectedCategory?.value === 3) {
        navigate("/about");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      navigate(selectedCategory?.value === 1 ? "/ppt" : "/png", {
        state: { searchResults: [], searchQuery },
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.value);
    setSearchQuery("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOverlayVisible(false);
    navigate("/login");
  };

  const goToLogin = () => {
    setIsOverlayVisible(false);
    navigate("/login");
  };

  const showOverlay = (e) => {
    setIsOverlayVisible(true);
    op.current.show(e);
  };

  const hideOverlay = () => {
    setIsOverlayVisible(false);
    op.current.hide();
  };

  const handleUserClick = () => {
    if (user) {
      navigate("/user");
    } else {
      navigate("/login");
    }
  };

  const handleCategoryClick = (category) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/ppt?category=${encodeURIComponent(category.ten)}`);
  };

  return (
    <div className="App">
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
                <button
                  type="button"
                  className="p-link"
                  onMouseEnter={showOverlay}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      if (!op.current?.isVisible()) hideOverlay();
                    }, 100);
                  }}
                  onClick={handleUserClick}
                  aria-label="User profile"
                >
                  <i className="bx bxs-user"></i>
                </button>
                <OverlayPanel
                  ref={op}
                  style={{ width: "300px", fontFamily: "Arial, sans-serif" }}
                  dismissable={false}
                  onMouseEnter={() => setIsOverlayVisible(true)}
                  onMouseLeave={hideOverlay}
                >
                  {user ? (
                    <div className="p-3" style={{ textAlign: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          label="Thoát đăng nhập"
                          className="p-button-text p-button-sm"
                          style={{ color: "#666", fontSize: "12px" }}
                          onClick={handleLogout}
                        />
                      </div>
                      <div style={{ margin: "10px 0" }}>
                        <img
                          src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg"
                          alt="Avatar"
                          style={{ borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }}
                          onClick={handleUserClick}
                        />
                        <h3 style={{ margin: "5px 0", fontSize: "16px" }}>{user.ten}</h3>
                        <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                          ID: {user.id || "82815496"}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: "#e0e0e0",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          người sử dụng miễn phí
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          margin: "10px 0",
                          fontSize: "14px",
                        }}
                      >
                        <div>
                          <strong>2</strong>
                          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                            Số lượt tải vé mỗi ngày
                          </p>
                        </div>
                        <div>
                          <strong>2</strong>
                          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                            Lượng tải xuống còn lại
                          </p>
                        </div>
                      </div>
                      <div style={{ margin: "10px 0" }}>
                        <Button
                          label="Giảm tới 80%"
                          className="p-button p-button-sm"
                          style={{
                            backgroundColor: "#ff4d4f",
                            border: "none",
                            width: "100%",
                            marginBottom: "10px",
                          }}
                        />
                        <Button
                          label="Tham gia kế hoạch doanh nghiệp"
                          className="p-button p-button-sm"
                          style={{
                            backgroundColor: "#fa8c16",
                            border: "none",
                            width: "100%",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "10px",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <i
                            className="pi pi-user"
                            style={{ fontSize: "20px", display: "block" }}
                          ></i>
                          <p style={{ margin: "5px 0 0" }}>Trung tâm cá nhân của tui</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <i
                            className="pi pi-briefcase"
                            style={{ fontSize: "20px", display: "block" }}
                          ></i>
                          <p style={{ margin: "5px 0 0" }}>Doanh nghiệp</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3" style={{ textAlign: "center" }}>
                      <h3 style={{ fontSize: "16px" }}>Vui lòng đăng nhập</h3>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        Đăng nhập để sử dụng các tính năng của trang web.
                      </p>
                      <Button
                        label="Đi đến đăng nhập"
                        className="p-button-primary p-button-sm"
                        onClick={goToLogin}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </OverlayPanel>
                <i className="bx bxs-grid-alt"></i>
                <div className="content-shopping-cart"></div>
              </div>
            </div>
          </div>

          <div className="container-navbar">
            <nav className="navbar container">
              <i className="fa-solid fa-bars"></i>
              <ul className="menu">
                <li><a href="/">XPOINT</a></li>
                <li
                  className="menu-item"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <a href="/ppt">PowerPoint</a>
                  {showDropdown && (
                    <div
                      className="dropdown-menu"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      {categories.length > 0 ? (
                        <ul className="dropdown-content">
                          {categories.map((category) => (
                            <li key={category.id} > 
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryClick(category);
                                }}
                              >
                                 <span className="text">{category.ten}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Loading categories...</p>
                      )}
                    </div>
                  )}
                </li>
                <li><a href="/png">Hình ảnh</a></li>
                {/* <li><a href="/about">Khung viền</a></li>
                <li><a href="/notfound">Mẫu</a></li> */}
              </ul>
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-box">
                  
                  <input type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="search-input"
                  />
                  <button type="submit" className="btn-search">
                    <i className="bx bx-search-alt"></i>
                  </button>
                </div>
              </form>
            </nav>
          </div>
        </header>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/ppt" element={<PptPage />} />
        <Route path="/png" element={<PngPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/user" element={<UserPage />} />
        {/* <Route path="/editor" element={<ImageEditor />} /> */}
        <Route path="/ai" element={<AIPage />} />
      </Routes>

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
                  <span className="facebook"><i className="bx bxl-facebook"></i></span>
                  <span className="twitter"><i className="bx bxl-twitter"></i></span>
                  <span className="youtube"><i className="bx bxl-youtube"></i></span>
                  <span className="pinterest"><i className="bx bxl-pinterest-alt"></i></span>
                  <span className="instagram"><i className="bx bxl-instagram"></i></span>
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
              <p>Bản quyền của Đỗ Thị Xuân © 2025</p>
              <img src="/img/payment.png" alt="Pagos" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;