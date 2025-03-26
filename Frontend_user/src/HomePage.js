import React, { useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css"; // Import file CSS riêng để hỗ trợ animation

function HomePage() {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const timeRunning = 3000;
  const timeAutoNext = 7000;

  useEffect(() => {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    nextButton.addEventListener("click", () => showSlider("next"));
    prevButton.addEventListener("click", () => showSlider("prev"));

    let autoSlide = setInterval(() => {
      showSlider("next");
    }, timeAutoNext);

    return () => {
      nextButton.removeEventListener("click", () => showSlider("next"));
      prevButton.removeEventListener("click", () => showSlider("prev"));
      clearInterval(autoSlide);
    };
  }, []);

  const showSlider = (type) => {
    const sliderItems = sliderRef.current.children;
    const thumbnailItems = thumbnailRef.current.children;

    if (type === "next") {
      sliderRef.current.appendChild(sliderItems[0]);
      thumbnailRef.current.appendChild(thumbnailItems[0]);
      carouselRef.current.classList.add("next");
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1]);
      thumbnailRef.current.prepend(thumbnailItems[thumbnailItems.length - 1]);
      carouselRef.current.classList.add("prev");
    }

    setTimeout(() => {
      carouselRef.current.classList.remove("next");
      carouselRef.current.classList.remove("prev");
    }, timeRunning);
  };

  return (
    <>
      {/* Slider */}
      <section className="banner">
        <div className="carousel" ref={carouselRef}>
          <div className="list" ref={sliderRef}>
            {[1, 2, 3, 4].map((index) => (
              <div className="item" key={index}>
                <img
                  src={`/img/blog-${index}.png`}
                  alt={`Slide ${index}`}
                  width={800}
                  height={400}
                />
                <div className="content">
                  <div className="author">XPOINT</div>
                  <div className="title">Mẫu PowerPoint,</div>
                  <div className="title">Hình ảnh</div>
                  <div className="topic">TẢI MIỄN PHÍ</div>
                  <div className="des">
                    Cập nhật hình ảnh, mẫu thuyết trình mới nhất
                  </div>
                  <div className="buttons">
                    <button>XEM THÊM</button>
                    <button>ĐĂNG KÝ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="thumbnail" ref={thumbnailRef}>
            {[1, 2, 3, 4].map((index) => (
              <div className="item" key={index}>
                <img
                  src={`/img/new-${index}.png`}
                  alt={`Thumbnail ${index}`}
                  width={200}
                  height={100}
                />
              </div>
            ))}
          </div>

          <div className="arrows">
            <button id="prev">&lt;</button>
            <button id="next">&gt;</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container container-features">
        {[
          { icon: "/img/feat-1.png", title: "Mẫu Powerpoint" },
          { icon: "/img/feat-2.png", title: "Giáo dục" },
          { icon: "/img/feat-3.png", title: "Việc Kinh Doanh" },
          { icon: "/img/feat-4.png", title: "Tiếp Thị" },
          { icon: "/img/feat-5.png", title: "Đa Mục đích" },
        ].map((feature, index) => (
          <a href="/" className="card-feature" key={index}>
            <img src={feature.icon} alt={feature.title} className="icon" />
            <div className="feature-content">
              <span>{feature.title}</span>
            </div>
          </a>
        ))}
      </section>
      {/* Categories */}
      <section className=" top-categories">
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
        <h1 className="heading-1">Hình ảnh và bộ sưu tập</h1>
        <div className="container-categories">
          {[
            { img: "/img/noel-bg.png", title: "Lễ giáng sinh", free: true },
            { img: "/img/ad3.jpg", title: "Ẩm thực", free: true },
            { img: "https://thuthuatnhanh.com/wp-content/uploads/2021/01/hinh-anh-sapa-dep-thung-lung-hung-vi.jpg", title: "Quang cảnh", free: false },
            { img: "https://img3.thuthuatphanmem.vn/uploads/2019/06/17/hinh-anh-dep-ngo-nghinh-ve-dong-vat_102855690.jpg", title: "Động vật", free: true },
            { img: "https://antimatter.vn/wp-content/uploads/2022/06/anh-bau-troi-va-hoa.jpg", title: "Vường hoa", free: false },
          ].map((category, index) => (
            <div className="card-category" key={index}>
              {/* Ảnh template */}
              <img src={category.img} alt={category.title} className="template-img" />

              {/* Nút PowerPoint - hiển thị khi hover */}
              <div className="overlay">
                {/* Nhãn miễn phí */}
                {category.free && <span className="badge-free">Miễn phí</span>}
                <button className="download-btn">
                <i className="bx bx-download"></i> Download
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
      {/* Gallery Section */}
      <section className="gallery">
        <img src="https://png.pngtree.com/png-clipart/20221026/original/pngtree-businessman-pointing-on-blank-board-for-presentation-png-image_8723556.png" alt="Gallery Img1" className="gallery-img-1" />
        <img src="https://tuyendung.kfcvietnam.com.vn/Data/Sites/1/media/blog/thuyet-trinh.jpg" alt="Gallery Img2" className="gallery-img-2" />
        <img src="https://bizuni.vn/kien-thuc-quan-tri/wp-content/uploads/2019/01/v119-sasi-69-business_1_2-1.jpg" alt="Gallery Img3" className="gallery-img-3" />
        <img src="https://tailieu.vn/image/template/thumbnail/2013/20130720/855/thumb/661x347/855__1947-slide1.jpg" className="gallery-img-4" />
        <img src="https://png.pngtree.com/png-clipart/20230110/original/pngtree-laboratory-research-and-genetic-engineering-concept-png-image_8900778.png" className="gallery-img-5" />
      </section>
    </>
  );
}

export default HomePage;
