import React, { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";
const images = [
  { src: "/img/new-1.png", alt: "Hình 1" },
  { src: "/img/new-2.png", alt: "Hình 2" },
  { src: "/img/new-3.png", alt: "Hình 3" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  { src: "/img/new-4.png", alt: "Hình 4" },
  
  { src: "/img/new-4.png", alt: "Hình 4" },
];

const PPTTemplate = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <div className="ppt-container">
      <p className="ppt-description">Trang chủ <i class='bx bx-chevron-right'></i> PowerPoint</p>
      {/* Header */}
      <h1 className="ppt-title">Khí Quyển Giáng Thiết Kế Ppt Mẫu</h1>

      {/* Main Content */}
      <div className="ppt-content">
        {/* Image Section */}
        <div className="ppt-image-container">
          <img
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            className="ppt-image"
          />
          {/* Bộ đếm slide */}
          <div className="ppt-counter">
            {selectedIndex + 1}/{images.length}
          </div>

          {/* Nút điều hướng trái/phải */}
          <button className="ppt-nav ppt-prev" onClick={prevSlide}>
            ❮
          </button>
          <button className="ppt-nav ppt-next" onClick={nextSlide}>
            ❯
          </button>

          {/* Hình thu nhỏ */}
          <div className="ppt-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className={`ppt-thumbnail ${selectedIndex === index ? "active" : ""}`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
          <div className="ppt-detail">
            <p>
              Đây là một mẫu PowerPoint hoàn hảo cho bài thuyết trình của bạn. Với thiết kế chuyên nghiệp và dễ sử dụng, 
              mẫu này giúp bạn truyền tải thông điệp một cách hiệu quả. Nó có thể được sử dụng cho nhiều mục đích khác nhau, 
              bao gồm giáo dục, doanh nghiệp, và tiếp thị.
            </p>
            <p>
              Chủ đề: <span className="text-highlight">Lịch sử, Giáo dục, Đơn giản, Kế hoạch</span>
            </p>
          </div>

          {/* Tags */}
          <div className="ppt-tags">
            <span className="tag">Lịch sử</span>
            <span className="tag">Giáo dục</span>
            <span className="tag">Mẫu tối giản</span>
            <span className="tag">Kế hoạch</span>
            <span className="tag">Năm</span>
            <span className="tag">Đánh giá hiệu suất</span>
            <span className="tag tag-more">+22</span> {/* Nút hiển thị thêm tag */}
          </div>
        </div>
        
        {/* Info Section */}
        <div className="ppt-info">
          <p className="ppt-description">
            Hình ảnh này có giấy phép bản quyền và có sẵn để sử dụng thương mại.
          </p>
          <button className="ppt-btn ppt-btn-orange">📂 PowerPoint</button>

          <div className="ppt-btn-group">
            <button className="ppt-btn">Thông tin</button>
            <button className="ppt-btn">Giống</button>
            <button className="ppt-btn">Chia sẻ</button>
          </div>

          {/* License */}
          <h3 className="ppt-license">
            Phạm vi ủy quyền: <span className="text-green">Giấy phép thương mại</span>
          </h3>
          <div className="ppt-btn-group">
            <button className="ppt-btn ppt-btn-green">Ủy quyền cá nhân</button>
            <button className="ppt-btn ppt-btn-gray">Ủy quyền doanh nghiệp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPTTemplate;
