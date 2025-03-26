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
];

const PPTTemplate = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="ppt-container">
      <p className="ppt-decscription">Trang chủ ➭ PowerPoint</p>
      {/* Header */}
      <h1 className="ppt-title">Khí Quyển Giáng Thiết Kế Ppt Mẫu</h1>

      {/* Main Content */}
      <div className="ppt-content">
        {/* Image Section */}
        <div className="ppt-image-container">
          <img src={selectedImage.src} alt={selectedImage.alt} className="ppt-image" />
          <span className="ppt-badge">Miễn phí</span>

          {/* Galleria Thumbnails */}
          <div className="ppt-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className={`ppt-thumbnail ${selectedImage.src === img.src ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
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
