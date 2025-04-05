import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import "./UserPage.css"; // CSS tùy chỉnh

function UserPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { label: "Trung tâm cá nhân của tôi", key: "profile", icon: "pi pi-user" },
    { label: "Lịch sử tải về", key: "downloads", icon: "pi pi-download" },
    { label: "Đánh giá của tôi", key: "reviews", icon: "pi pi-star" },
    { label: "Theo dõi", key: "follow", icon: "pi pi-heart" },
  ];

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        // Fetch user data
        const userResponse = await fetch("http://localhost:1000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser({
          name: userData.user.ten,
          id: userData.user.id,
          status: userData.user.quyen === "admin" ? "Quản trị viên" : "Người sử dụng miễn phí",
          avatar: "https://via.placeholder.com/80",
          role: "Tên thiết kế cơ bản",
          position: "Tiêu đề công việc của bạn",
          phone: "",
          email: userData.user.email,
          password: "********",
        });

        // Fetch download history
        const downloadResponse = await fetch(
          `http://localhost:1000/lichsutaixuongs/user/${userData.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!downloadResponse.ok) {
          throw new Error("Failed to fetch download history");
        }
        const downloadData = await downloadResponse.json();

        // Process each download history entry
        const downloadItems = await Promise.all(
          downloadData.map(async (item) => {
            let downloadedItem = null;
            let type = null;

            if (item.mau_powerpoint_id) {
              const powerpointResponse = await fetch(
                `http://localhost:1000/maupowerpoints/${item.mau_powerpoint_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (powerpointResponse.ok) {
                const powerpointData = await powerpointResponse.json();
                downloadedItem = {
                  title: powerpointData.tieu_de || "Không có tiêu đề",
                  image: powerpointData.duong_dan_anh_nho || "https://via.placeholder.com/80",
                  description: powerpointData.mo_ta || "Không có mô tả",
                  author: "air", // Placeholder, update if API provides this
                  size: "1200 * 1200", // Placeholder, update if API provides this
                  status: "Need Credit", // Placeholder, update if API provides this
                };
                type = "PowerPoint";
              }
            } else if (item.hinh_anh_id) {
              const imageResponse = await fetch(
                `http://localhost:1000/hinhanhs/${item.hinh_anh_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                downloadedItem = {
                  title: imageData.tieu_de || "Không có tiêu đề",
                  image: imageData.duong_dan_anh_nho || "https://via.placeholder.com/80",
                  description: imageData.mo_ta || "Không có mô tả",
                  author: "air", // Placeholder, update if API provides this
                  size: "1200 * 1200", // Placeholder, update if API provides this
                  status: "Need Credit", // Placeholder, update if API provides this
                };
                type = "Hình ảnh";
              }
            }

            return {
              type: type || "Không xác định",
              title: downloadedItem ? downloadedItem.title : "Không có tiêu đề",
              image: downloadedItem ? downloadedItem.image : "https://via.placeholder.com/80",
              description: downloadedItem ? downloadedItem.description : "Không có mô tả",
              author: downloadedItem ? downloadedItem.author : "Không rõ",
              size: downloadedItem ? downloadedItem.size : "Không rõ",
              status: downloadedItem ? downloadedItem.status : "Free",
              date: item.thoi_gian_tai || "Không rõ",
            };
          })
        );
        setDownloadHistory(downloadItems);

        // Fetch reviews
        const reviewsResponse = await fetch(
          `http://localhost:1000/danhgias/user/${userData.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(
          reviewsData.map((item) => ({
            id: item.id,
            content: item.binh_luan || "Không có nội dung",
            rating: item.diem_danh_gia || 5,
            date: item.ngay_tao || "Không rõ",
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!user) {
    return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>;
  }

  return (
    <div className="user-page">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          {sidebarItems.map((item) => (
            <li
              key={item.key}
              className={`sidebar-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeSection === "profile" && (
          <div className="profile">
            <div className="user-info">
              <Avatar image={user.avatar} size="xlarge" shape="circle" />
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>ID: {user.id}</p>
                <span className="user-status">{user.status}</span>
              </div>
              <Button label="Trở thành thành viên" className="upgrade-btn" />
            </div>

            {/* Social Media Buttons */}
            <div className="social-buttons">
              <h4>Tài khoản liên kết</h4>
              <Button
                label="Tiếp tục sử dụng Facebook"
                icon="pi pi-facebook"
                className="p-button-info"
              />
              <Button
                label="Tiếp tục sử dụng Google"
                icon="pi pi-google"
                className="p-button-danger"
              />
              <Button
                label="Tiếp tục sử dụng Twitter"
                icon="pi pi-twitter"
                className="p-button-secondary"
              />
            </div>

            {/* User Data */}
            <div className="user-data">
              <h4>Dữ liệu của bạn</h4>
              <div className="data-item">
                <label>Tên thiết kế cơ bản</label>
                <p>{user.role}</p>
              </div>
              <div className="data-item">
                <label>Chức danh</label>
                <p>{user.position}</p>
              </div>
              <div className="data-item">
                <label>Số điện thoại</label>
                <p>{user.phone || "Chưa có số điện thoại"}</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="account-info">
              <h4>Thông tin tài khoản</h4>
              <div className="data-item">
                <label>Tên người dùng *</label>
                <p>{user.name}</p>
              </div>
              <div className="data-item">
                <label>Email *</label>
                <p>{user.email}</p>
              </div>
              <div className="data-item">
                <label>Mật khẩu *</label>
                <p>{user.password}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "downloads" && (
          <div className="downloads">
            <h2>Lịch sử tải về của tói</h2>
            <div className="filter-bar">
              <Button label="PowerPoint" className="filter-btn active" />
              <Button label="Hình ảnh" className="filter-btn" />
              <Button label="Mẫu" className="filter-btn" />
              <Button label="Hiệu ứng văn bản" className="filter-btn" />
              <Button label="Hình MINH Họa" className="filter-btn" />
            </div>
            <div className="download-header">
              <span>Thông tin hình ảnh</span>
              <span></span> {/* Empty header for the middle column */}
              <span>Thông tin tùy quyện</span>
            </div>
            {downloadHistory.length > 0 ? (
              downloadHistory.map((item, index) => (
                <div key={index} className="download-item">
                  <div className="download-image-info">
                    <img src={item.image} alt={item.title} className="download-img" />
                    <div className="download-info">
                      <h4>{item.title}</h4>
                      <p>
                        tác giả: {item.author} <br />
                        kích thước: {item.size} <br />
                        Thời gian tải xuống: {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="download-status">
                    {item.status === "Need Credit" && (
                      <span className="need-credit">Need Credit!</span>
                    )}
                  </div>
                  <div className="download-permission">
                    <p>
                      <i className="pi pi-money-bill permission-icon free"></i> Ghi phép miễn phí
                    </p>
                    <p>
                      <i className="pi pi-ban permission-icon non-commercial"></i> Không sử dụng thương mại
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có lịch sử tải về.</p>
            )}
          </div>
        )}

        {activeSection === "reviews" && (
          <div className="reviews">
            <h2>Đánh giá của tôi</h2>
            {reviews.length > 0 ? (
              reviews.map((item, index) => (
                <div key={index} className="review-item">
                  <p>
                    <strong>Nội dung:</strong> {item.content} <br />
                    <strong>Điểm:</strong> {item.rating} <br />
                    <strong>Ngày đánh giá:</strong> {item.date}
                  </p>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào.</p>
            )}
          </div>
        )}

        {activeSection === "follow" && (
          <div className="follow">
            <h2>Theo dõi</h2>
            <p>Chưa có nội dung theo dõi.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;