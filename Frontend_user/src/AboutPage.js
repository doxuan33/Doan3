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
                free: false,
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
                free: false,
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
      // Validate the URL before proceeding
      const downloadUrl = isPowerpoint
        ? `http://localhost:1000${item.duong_dan_tap_tin}` // Prepend for PowerPoints
        : item.duong_dan_anh_nho; // Use as-is for images since it already includes http://localhost:1000
  
      if (!downloadUrl) {
        throw new Error("Không tìm thấy đường dẫn tệp để tải xuống.");
      }
  
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      let userId = null;
  
      // If token exists, fetch the user ID
      if (token) {
        const userResponse = await fetch("http://localhost:1000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.user.id;
        } else {
          console.error("Failed to fetch user data:", userResponse.statusText);
        }
      }
  
      // Prepare the download history data
      const downloadHistory = {
        nguoi_dung_id: userId, // Will be null if user is not logged in
        mau_powerpoint_id: isPowerpoint ? item.id : null, // PowerPoint ID if applicable
        hinh_anh_id: !isPowerpoint ? item.id : null, // Image ID if applicable
        // thoi_gian_tai is automatically set by the database
      };
  
      // Send POST request to save download history
      const response = await fetch("http://localhost:1000/lichsutaixuongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // Include token if user is logged in
        },
        body: JSON.stringify(downloadHistory),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save download history");
      }
  
      // Fetch the file as a blob
      const fileResponse = await fetch(downloadUrl, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }), // Include token if required by the server
        },
      });
  
      if (!fileResponse.ok) {
        throw new Error("Không thể tải tệp: " + fileResponse.statusText);
      }
  
      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = item.tieu_de || (isPowerpoint ? "powerpoint" : "image"); // Set a meaningful file name
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during download:", error.message);
      alert(`Có lỗi xảy ra khi tải xuống: ${error.message}`);
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
                {category.free && <span className="badge-free">Miễn phí</span>}
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
                {category.free && <span className="badge-free">Miễn phí</span>}
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
                {category.free && <span className="badge-free">Miễn phí</span>}
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