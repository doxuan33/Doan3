import React, { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";
import "./App.css";
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
            <button className="ppt-btn"><i class='bx bxs-info-circle' ></i> Thông tin</button>
            <button className="ppt-btn"><i class='bx bxs-heart'></i> Yêu thích</button>
            <button className="ppt-btn"><i class='bx bxs-share-alt' ></i> Chia sẻ</button>
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
      <section className=" top-categories top">
        <h1 className="heading-1">Mẫu PowerPoint thịnh hành</h1>
        <div className="container-categories">
          {[
            { img: "/img/top-1.png", title: "Powerpoint chủ đề cầu vồng", free: true },
            { img: "/img/top-2.png", title: "Find A Rainbow Day", free: true },
            { img: "/img/top-3.png", title: "Arabic Style Marketing Plan", free: false },
            { img: "/img/top-4.png", title: "Happy Father's Day", free: true },
            { img: "/img/top-5.png", title: "Happy Father's Day", free: false },
          ].map((category, index) => (
            <div className="card-category" key={index}>
              {/* Ảnh template */}
              <img src={category.img} alt={category.title} className="template-img" />

              {/* Nút PowerPoint - hiển thị khi hover */}
              <div className="overlay">
                {/* Nhãn miễn phí */}
                {category.free && <span className="badge-free">Miễn phí</span>}
                <button className="download-btn">
                  <i className="bx bx-download"></i> PowerPoint
                </button>
                <p className="template-title">{category.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className=" top-categories top">
        <h1 className="heading-1">Hình nền sáng tạo</h1>
        <div className="container-categories">
          {[
            { img: "https://img4.thuthuatphanmem.vn/uploads/2020/06/22/anh-nen-anime-2k_092516251.jpg", title: "Bầu trời", free: true },
            { img: "https://mega.com.vn/media/news/2707_nen-background-pp-chu-de-hoc-tap7.jpg", title: "Học tập", free: false },
            { img: "https://png.pngtree.com/thumb_back/fh260/background/20240909/pngtree-chinese-new-year-red-background-with-hanging-lanterns-image_16133909.jpg", title: "Ngày lễ", free: true },
            { img: "https://png.pngtree.com/thumb_back/fh260/background/20241231/pngtree-ancestor-worship-tomb-sweeping-day-image_16531970.jpg", title: "Khám phá", free: false },
          ].map((category, index) => (
            <div className="card-category-1" key={index}>
              {/* Ảnh template */}
              <img src={category.img} alt={category.title} width={350} height={200}/>

              {/* Nút PowerPoint - hiển thị khi hover */}
              <div className="overlay">
                {/* Nhãn miễn phí */}
                {category.free && <span className="badge-free">Miễn phí</span>}
                <button className="download-btn">
                  Xem thêm về bộ sưu tập
                </button>
                <p className="template-title">{category.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="container-categories top">
          {[
            { img: "https://antimatter.vn/wp-content/uploads/2022/08/hinh-nen-bien.jpg", title: "Biển cả", free: true },
            { img: "https://png.pngtree.com/background/20230427/original/pngtree-landscape-winter-snow-covered-japanese-village-with-a-bridge-covered-in-picture-image_2497611.jpg", title: "Mùa đông", free: false },
            { img: "https://image.tienphong.vn/600x315/Uploaded/2023/rwbvhvobvvimsb/2021_09_06/6-nhom-trai-cay-de-an-buoi-sang-5711.jpg", title: "Hoa quả", free: true },
            { img: "https://khoinguonsangtao.vn/wp-content/uploads/2022/09/hinh-nen-cay-xanh-4k-cho-may-tinh.jpg", title: "Khu rừng", free: false },
          ].map((category, index) => (
            <div className="card-category-1" key={index}>
              {/* Ảnh template */}
              <img src={category.img} alt={category.title} width={350} height={200}/>

              {/* Nút PowerPoint - hiển thị khi hover */}
              <div className="overlay">
                {/* Nhãn miễn phí */}
                {category.free && <span className="badge-free">Miễn phí</span>}
                <button className="download-btn">
                  Xem thêm về bộ sưu tập
                </button>
                <p className="template-title">{category.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    
  );
};

export default PPTTemplate;
