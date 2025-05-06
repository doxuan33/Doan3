import React, { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";
import "./App.css";
import { useLocation } from "react-router-dom";

const PPTTemplate = () => {
  const location = useLocation();
  const { powerpoint, image } = location.state || {};
  const item = powerpoint || image; // Use either powerpoint or image
  const isPowerpoint = !!powerpoint; // Check if the item is a PowerPoint
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailImages, setDetailImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedPowerpoints, setRelatedPowerpoints] = useState([]);
  const [relatedBackgrounds, setRelatedBackgrounds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const thumbnailRef = useRef(null);

  // Hàm cuộn thumbnail sang trái
  const scrollThumbnailsLeft = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  // Hàm cuộn thumbnail sang phải
  const scrollThumbnailsRight = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    if (item) {
      if (isPowerpoint) {
        // Lấy ảnh chi tiết của PowerPoint
        fetch(`http://localhost:1000/maupowerpointanhchitiets/mau-powerpoint/${item.id}`)
          .then((response) => response.json())
          .then((data) => {
            const images = Array.isArray(data)
              ? data.map((img) => ({
                  src: `http://localhost:1000${img.duong_dan_anh}`,
                  alt: `Ảnh chi tiết ${img.thu_tu + 1}`,
                }))
              : [];
            setDetailImages(images);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy ảnh chi tiết:", error);
            setDetailImages([]);
            setLoading(false);
          });
      } else {
        // For images, use the single image as the detail image
        setDetailImages([
          {
            src: item.duong_dan_anh_nho,
            alt: item.tieu_de,
          },
        ]);
        setLoading(false);
      }

      // Lấy 5 danh sách mẫu PowerPoint ngẫu nhiên
      fetch(`http://localhost:1000/maupowerpoints?limit=5&random=true`)
        .then((response) => response.json())
        .then((data) => {
          const powerpoints = Array.isArray(data)
            ? data.map((item) => ({
                id: item.id,
                tieu_de: item.tieu_de,
                duong_dan_anh_nho: item.duong_dan_anh_nho,
                mo_ta: item.mo_ta,
                la_pro: item.la_pro, // Lấy la_pro
                gia: item.gia, // Lấy gia
              }))
            : [];
          setRelatedPowerpoints(powerpoints);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy mẫu PowerPoint ngẫu nhiên:", error);
          setRelatedPowerpoints([]);
        });

      // Lấy 8 danh sách hình nền sáng tạo ngẫu nhiên
      fetch(`http://localhost:1000/hinhanhs?limit=8&random=true`)
        .then((response) => response.json())
        .then((data) => {
          const backgrounds = Array.isArray(data)
            ? data.map((item) => ({
                id: item.id,
                tieu_de: item.tieu_de,
                duong_dan_anh_nho: item.duong_dan_anh_nho,
                mo_ta: item.mo_ta,
                la_pro: item.la_pro, // Lấy la_pro
                gia: item.gia, // Lấy gia
              }))
            : [];
          setRelatedBackgrounds(backgrounds);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy hình nền sáng tạo ngẫu nhiên:", error);
          setRelatedBackgrounds([]);
        });

      // Lấy danh sách đánh giá và thông tin người dùng
      const endpoint = isPowerpoint
        ? `http://localhost:1000/danhgias/powerpoint/${item.id}`
        : `http://localhost:1000/danhgias/image/${item.id}`;
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể lấy danh sách đánh giá");
          }
          return response.json();
        })
        .then(async (data) => {
          const reviewsData = Array.isArray(data) ? data : [];
          const reviewsWithUserNames = await Promise.all(
            reviewsData.map(async (review) => {
              try {
                const userResponse = await fetch(
                  `http://localhost:1000/nguoidungs/${review.nguoi_dung_id}`
                );
                if (!userResponse.ok) {
                  throw new Error(`Không thể lấy thông tin người dùng ${review.nguoi_dung_id}`);
                }
                const userData = await userResponse.json();
                return {
                  user: userData.ten || "Người dùng ẩn danh",
                  rating: review.diem_danh_gia || 5,
                  comment: review.binh_luan || "Không có bình luận.",
                  date: review.ngay_tao || "2025-04-03",
                };
              } catch (error) {
                console.error(`Lỗi khi lấy thông tin người dùng ${review.nguoi_dung_id}:`, error);
                return {
                  user: "Người dùng ẩn danh",
                  rating: review.diem_danh_gia || 5,
                  comment: review.binh_luan || "Không có bình luận.",
                  date: review.ngay_tao || "2025-04-03",
                };
              }
            })
          );
          setReviews(reviewsWithUserNames);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy đánh giá:", error);
          setReviews([
            { user: "Nguyễn Văn A", rating: 4.5, comment: "Hình ảnh rất đẹp!", date: "2025-04-01" },
            { user: "Trần Thị B", rating: 5, comment: "Rất phù hợp cho thiết kế của tôi.", date: "2025-03-30" },
          ]);
        });
    }
  }, [item, isPowerpoint]);

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev === 0 ? detailImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev === detailImages.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = async () => {
    try {
      // Show dialog if la_pro is true without proceeding to save duong_dan_tap_tin
      if (isPowerpoint && item.la_pro) {
        const dialog = document.createElement("div");
        dialog.className = "dialog-overlay";
        dialog.innerHTML = `
          <div class="dialog-content">
            <button class="dialog-close">×</button>
            <h2>Mở khóa các tính năng và nội dung cao cấp</h2>
            <p>Học và nâng cấp lên thành viên cao cấp. Hoặc đăng nhập nếu bạn đã là thành viên.</p>
            <div class="dialog-countdown">
              <span class="countdown-label">GIÁM GIÁ COUNTDOWN</span>
              <span class="countdown-time">55 MIN 27 S 28 MS</span>
            </div>
            <div class="dialog-features">
              <div class="feature-item">
                <span class="feature-icon">🔍</span>
                <span>Tài khoản giới hạn</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🤖</span>
                <span>Công cụ với tính năng AI</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">©</span>
                <span>Ưu quyền nhân bản</span>
              </div>
              <div class="feature-item toggle">
                <span>Gói một năm</span>
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="dialog-price">
              <span class="highlight">ƯU ĐÃI ĐẶC BIỆT!</span>
              <span class="price">$6 USD/tháng</span>
            </div>
            <button class="dialog-button">Mua Ngay</button>
            <p class="dialog-cancel">Hủy bất cứ lúc nào</p>
          </div>
        `;
        document.body.appendChild(dialog);

        // Add styles
        const style = document.createElement("style");
        style.textContent = `
          .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .dialog-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            position: relative;
            width: 500px; /* Increased width for better appearance */
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .dialog-close {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }
          .dialog-content h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333;
          }
          .dialog-content p {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          .dialog-countdown {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #f39c12;
            font-weight: bold;
            margin: 15px 0;
            font-size: 16px;
          }
          .countdown-label {
            margin-right: 10px;
          }
          .countdown-time {
            background: #f39c12;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
          }
          .dialog-features {
            margin: 20px 0;
            text-align: left;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 16px;
            color: #333;
          }
          .feature-icon {
            margin-right: 10px;
            font-size: 20px;
          }
          .feature-item.toggle {
            justify-content: space-between;
            align-items: center;
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 20px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #f39c12;
          }
          input:checked + .slider:before {
            transform: translateX(20px);
          }
          .dialog-price {
            margin: 20px 0;
            font-size: 18px;
            color: #333;
          }
          .highlight {
            display: block;
            color: #e74c3c;
            font-weight: bold;
            font-size: 16px;
          }
          .price {
            font-size: 24px;
            font-weight: bold;
          }
          .dialog-button {
            background: #f39c12;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            margin: 10px 0;
            transition: background 0.3s;
          }
          .dialog-button:hover {
            background: #e67e22;
          }
          .dialog-cancel {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
        `;
        document.head.appendChild(style);

        // Close dialog
        const closeButton = dialog.querySelector(".dialog-close");
        closeButton.addEventListener("click", () => {
          document.body.removeChild(dialog);
          document.head.removeChild(style);
        });
      }
    } catch (error) {
      console.error("Error during download:", error.message);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!item) {
    return <div>Không có dữ liệu nào được chọn.</div>;
  }

  return (
    <div className="ppt-container">
      <p className="ppt-description">
        Trang chủ <i className="bx bx-chevron-right"></i> {isPowerpoint ? "PowerPoint" : "Hình ảnh"}
      </p>
      <h1 className="ppt-title">{item.tieu_de}</h1>

      <div className="ppt-content">
        <div className="ppt-image-container">
          {loading ? (
            <p>Đang tải ảnh chi tiết...</p>
          ) : detailImages.length === 0 ? (
            <img src={item.duong_dan_anh_nho} alt={item.tieu_de} className="ppt-image" />
          ) : (
            <>
              <img
                src={detailImages[selectedIndex].src}
                alt={detailImages[selectedIndex].alt}
                className="ppt-image"
              />
              {detailImages.length > 1 && (
                <>
                  <div className="ppt-counter">
                    {selectedIndex + 1}/{detailImages.length}
                  </div>
                  <button className="ppt-nav ppt-prev" onClick={prevSlide}>
                    ❮
                  </button>
                  <button className="ppt-nav ppt-next" onClick={nextSlide}>
                    ❯
                  </button>
                  <div className="ppt-thumbnails-container">
                    <div className="ppt-thumbnails" ref={thumbnailRef}>
                      {detailImages.map((img, index) => (
                        <img
                          key={index}
                          src={img.src}
                          alt={img.alt}
                          className={`ppt-thumbnail ${selectedIndex === index ? "active" : ""}`}
                          onClick={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          <div className="ppt-detail">
            <h2>{item.tieu_de}</h2>
            <p><h3>Mẫu PowerPoint và Hình ảnh tải miễn phí</h3></p>
            <p>{item.mo_ta || "Không có mô tả."}</p>
            {/* Hiển thị trạng thái la_pro và giá nếu la_pro = true */}
            <p>Loại: <span className="text-highlight">{item.la_pro ? "Pro" : "Miễn phí"}</span></p>
            {item.la_pro && item.gia && (
              <p>Giá: <span className="text-highlight">{item.gia} VNĐ</span></p>
            )}
            <p>
              Chủ đề: <span className="text-highlight">Lịch sử, Giáo dục, Đơn giản, Kế hoạch</span>
            </p>
          </div>

          <div className="ppt-tags">
            <span className="tag">Lịch sử</span>
            <span className="tag">Giáo dục</span>
            <span className="tag">Mẫu tối giản</span>
            <span className="tag">Kế hoạch</span>
            <span className="tag">Năm</span>
            <span className="tag">Đánh giá hiệu suất</span>
            <span className="tag tag-more">+22</span>
          </div>
        </div>

        <div className="ppt-info">
          <p className="ppt-description">
            {isPowerpoint
              ? "Mẫu PowerPoint này có giấy phép bản quyền và có sẵn để sử dụng thương mại."
              : "Hình ảnh này có giấy phép bản quyền và có sẵn để sử dụng thương mại."}{" "}
            Nâng cấp lên gói Premium cá nhân{" "}
            <span className="text-orange">
              Hoặc Nâng cấp lên thành viên cao cấp của công ty nhiên chính hãng để giấy phép.
            </span>{" "}
            <a href="#" className="text-orange">
              Bấm vào đây
            </a>
          </p>
          <button
            className="ppt-btn ppt-btn-orange"
            onClick={handleDownload}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "10px", fontSize: "16px" }}
          >
            <span style={{ marginRight: "5px" }}>
              <i className="bx bxs-download"></i>
            </span>{" "}
            {isPowerpoint ? "PowerPoint" : "Hình ảnh"}
          </button>

          <div className="ppt-btn-group" style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
            <button className="ppt-btn text-gray" style={{ flex: 1, marginRight: "5px" }}>
              <i className="bx bxs-info-circle"></i> Thông tin
            </button>
            <button className="ppt-btn text-gray" style={{ flex: 1, marginRight: "5px" }}>
              <i className="bx bxs-heart"></i> Giữ
            </button>
            <button className="ppt-btn text-gray" style={{ flex: 1 }}>
              <i className="bx bxs-share-alt"></i> Chia sẻ
            </button>
          </div>

          <h3 className="ppt-license" style={{ fontSize: "16px", margin: "10px 0" }}>
            Phạm vi ủy quyền: <span className="text-orange">Giấy phép thương mại</span>
          </h3>
          <h4 style={{ fontSize: "14px", margin: "5px 0" }}>
            Đối tượng được ủy quyền: <span className="text-green">Cá nhân</span>{" "}
            <span className="text-gray">Doanh nghiệp</span>
          </h4>

          <div className="ppt-license-details" style={{ margin: "10px 0" }}>
            <img src="/img/giayphep.jpg" alt="Giấy phép" style={{ width: "100%", marginBottom: "10px" }} />
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>🔒</span> Đảm bảo bản quyền
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>📜</span> Giấy phép PRF cho mục đích thương mại cá nhân
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>🚫</span> Không cần phí chỉ thích nguồn tác phẩm
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>📥</span> Tải xuống không giới hạn tài sản Premium
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>📄</span> Hóa đơn trực tuyến
              </li>
            </ul>
          </div>

          <div className="ppt-btn-group" style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button className="ppt-btn ppt-btn-gray" style={{ flex: 1, marginRight: "5px" }}>
              <span style={{ marginRight: "5px" }}>📜</span> Giấy phép cá nhân
            </button>
            <button className="ppt-btn ppt-btn-green" style={{ flex: 1 }}>
              <span style={{ marginRight: "5px" }}>📈</span> Nâng cấp ngay bây giờ
            </button>
          </div>
        </div>
      </div>

      {/* Phần đánh giá */}
      <div className="ppt-reviews" style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Đánh giá</h2>
        <div className="rating-summary" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <div className="average-rating" style={{ marginRight: "20px" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold" }}>{averageRating}</span>/5
          </div>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`bx ${index < Math.round(averageRating) ? "bxs-star" : "bx-star"}`}
                style={{ color: "#f39c12", fontSize: "24px" }}
              ></i>
            ))}
          </div>
          <span style={{ marginLeft: "10px", color: "#666" }}>({reviews.length} đánh giá)</span>
        </div>

        <div className="review-list">
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                className="review-item"
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #ddd",
                  marginBottom: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <div>
                    <span style={{ fontWeight: "bold" }}>{review.user}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bx ${i < Math.round(review.rating) ? "bxs-star" : "bx-star"}`}
                          style={{ color: "#f39c12", fontSize: "16px" }}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <span style={{ color: "#666", fontSize: "14px" }}>{review.date}</span>
                </div>
                <p style={{ margin: "5px 0 0 0" }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mẫu PowerPoint thịnh hành */}
      <section className="top-categories top">
        <h1 className="heading-1">Mẫu PowerPoint thịnh hành</h1>
        <div className="container-categories">
          {relatedPowerpoints.slice(0, 5).map((category, index) => (
            <div className="card-category" key={index}>
              <img src={category.duong_dan_anh_nho} alt={category.tieu_de} className="template-img" />
              <div className="overlay">
                <span className={category.la_pro ? "badge-pro" : "badge-free"}>
                  {category.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">
                  <i className="bx bx-download"></i> PowerPoint
                </button>
                <p className="template-title">{category.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hình nền sáng tạo */}
      <section className="top-categories top">
        <h1 className="heading-1">Hình nền sáng tạo</h1>
        <div className="container-categories">
          {relatedBackgrounds.slice(0, 4).map((category, index) => (
            <div className="card-category-1" key={index}>
              <img src={category.duong_dan_anh_nho} alt={category.tieu_de} width={350} height={200} />
              <div className="overlay">
                <span className={category.la_pro ? "badge-pro" : "badge-free"}>
                  {category.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">Xem thêm về bộ sưu tập</button>
                <p className="template-title">{category.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="container-categories top">
          {relatedBackgrounds.slice(4, 8).map((category, index) => (
            <div className="card-category-1" key={index}>
              <img src={category.duong_dan_anh_nho} alt={category.tieu_de} width={350} height={200} />
              <div className="overlay">
                <span className={category.la_pro ? "badge-pro" : "badge-free"}>
                  {category.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">Xem thêm về bộ sưu tập</button>
                <p className="template-title">{category.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PPTTemplate;