import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";

function HomePage() {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const timeRunning = 3000;
  const timeAutoNext = 7000;

  const [powerpoints, setPowerpoints] = useState([]);
  const [images, setImages] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingPowerpoints, setLoadingPowerpoints] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // Thêm state để quản lý slide hiện tại
  const [carouselDirection, setCarouselDirection] = useState(""); // Quản lý hướng chuyển động

  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = location.state?.searchQuery;
  const searchResults = location.state?.searchResults;

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchPowerpoints = (query = "") => {
    setLoadingPowerpoints(true);
    let url = "http://localhost:1000/maupowerpoints";
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPowerpoints(data.slice(0, 5));
        setLoadingPowerpoints(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu PowerPoint:", error);
        setLoadingPowerpoints(false);
      });
  };

  const fetchImages = (query = "") => {
    setLoadingImages(true);
    let url = "http://localhost:1000/hinhanhs";
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setImages(data.slice(0, 5));
        setLoadingImages(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu hình ảnh:", error);
        setLoadingImages(false);
      });
  };

  const fetchBackgrounds = (query = "") => {
    setLoadingBackgrounds(true);
    let url = "http://localhost:1000/hinhanhs";
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setBackgrounds(data.slice(0, 8));
        setLoadingBackgrounds(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu hình nền:", error);
        setLoadingBackgrounds(false);
      });
  };

  useEffect(() => {
    if (searchResults && searchQuery) {
      const isPowerpointSearch = location.state?.selectedCategory?.value === 1;
      const isImageSearch = location.state?.selectedCategory?.value === 2;

      if (isPowerpointSearch) {
        setPowerpoints(searchResults.slice(0, 5));
        setLoadingPowerpoints(false);
        fetchImages();
        fetchBackgrounds();
      } else if (isImageSearch) {
        setImages(searchResults.slice(0, 5));
        setBackgrounds(searchResults.slice(0, 8));
        setLoadingImages(false);
        setLoadingBackgrounds(false);
        fetchPowerpoints();
      }
    } else {
      fetchPowerpoints(searchQuery || "");
      fetchImages(searchQuery || "");
      fetchBackgrounds(searchQuery || "");
    }
  }, [location.state, searchQuery]);

  // Carousel functionality
  useEffect(() => {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    const handleNext = () => showSlider("next");
    const handlePrev = () => showSlider("prev");

    // Chỉ thêm sự kiện nếu các nút tồn tại
    if (nextButton && prevButton) {
      nextButton.addEventListener("click", handleNext);
      prevButton.addEventListener("click", handlePrev);

      // Tự động chuyển slide
      const autoSlide = setInterval(() => {
        showSlider("next");
      }, timeAutoNext);

      // Cleanup khi component unmount
      return () => {
        nextButton.removeEventListener("click", handleNext);
        prevButton.removeEventListener("click", handlePrev);
        clearInterval(autoSlide);
      };
    }
  }, []);

  const showSlider = (type) => {
    // Kiểm tra các ref có tồn tại trước khi thao tác
    if (!carouselRef.current || !sliderRef.current || !thumbnailRef.current) {
      console.warn("One or more refs are not attached to DOM elements yet.");
      return;
    }

    const sliderItems = sliderRef.current.children;
    const thumbnailItems = thumbnailRef.current.children;

    // Đảm bảo có phần tử để thao tác
    if (sliderItems.length === 0 || thumbnailItems.length === 0) {
      console.warn("No slider or thumbnail items available.");
      return;
    }

    if (type === "next") {
      sliderRef.current.appendChild(sliderItems[0]);
      thumbnailRef.current.appendChild(thumbnailItems[0]);
      setCarouselDirection("next");
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1]);
      thumbnailRef.current.prepend(thumbnailItems[thumbnailItems.length - 1]);
      setCarouselDirection("prev");
    }

    // Reset class sau animation
    setTimeout(() => {
      setCarouselDirection("");
    }, timeRunning);
  };

  const handleItemClick = (item, type) => {
    if (type === "powerpoint") {
      navigate("/about", { state: { powerpoint: item, favorites } });
    } else if (type === "image" || type === "background") {
      navigate("/about", { state: { image: item, favorites } });
    }
  };

  const handleFavoriteClick = (item, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === item.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  };

  const handleClearSearch = () => {
    navigate("/", { state: {} });
    fetchPowerpoints();
    fetchImages();
    fetchBackgrounds();
  };

  const blogs = [
    {
      img: "img/blog_1.png",
      alt: "Imagen Blog 1",
      title: "Bộ mẫu Microsoft",
      description:
        "20,0000 mẫu Ứng dụng Microsoft 365 miễn phí và cao cấp bao gồm Word, Excel, Powerpoint.",
    },
    {
      img: "img/blog_2.png",
      alt: "Imagen Blog 2",
      title: "Bộ mẫu của Google",
      description:
        "Hỗ trợ các mẫu Google Workspace miễn phí và cao cấp trong Google Tài liệu, Trang tính, Trang trình bày.",
    },
    {
      img: "img/blog_3.png",
      alt: "Imagen Blog 3",
      title: "Bộ mẫu Adobe",
      description:
        "70,000+ mẫu đám mây sáng tạo adobe miễn phí và cao cấp trong photoshop, illustrator, indesign, pdf.",
    },
  ];

  return (
    <>
      {/* Slider */}
      <section className="banner">
        <div className={`carousel ${carouselDirection}`} ref={carouselRef}>
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

      {/* PowerPoint Section */}
      <section className="top-categories">
        <h1 className="heading-1">
          {searchQuery && location.state?.selectedCategory?.value === 1
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Mẫu PowerPoint thịnh hành"}
        </h1>
        {searchQuery && (
          <div className="content">
            <button onClick={handleClearSearch} className="clear-search-btn">
              Xóa tìm kiếm
            </button>
          </div>
        )}
        <div className="container-categories">
          {loadingPowerpoints ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không tìm thấy mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.map((ppt, index) => (
              <div
                className="card-category"
                key={index}
                onClick={() => handleItemClick(ppt, "powerpoint")}
              >
                <img
                  src={ppt.duong_dan_anh_nho}
                  alt={ppt.tieu_de}
                  className="template-img"
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === ppt.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(ppt, e)}
                  ></i>
                  {ppt.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    <i className="bx bx-download"></i> PowerPoint
                  </button>
                  <p className="template-title">{ppt.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Images Section */}
      <section className="top-categories top">
        <h1 className="heading-1">Hình ảnh và bộ sưu tập</h1>
        <div className="container-categories">
          {[
            { img: "/img/noel-bg.png", title: "Lễ giáng sinh", free: true },
            { img: "/img/ad3.jpg", title: "Ẩm thực", free: true },
            {
              img: "https://thuthuatnhanh.com/wp-content/uploads/2021/01/hinh-anh-sapa-dep-thung-lung-hung-vi.jpg",
              title: "Quang cảnh",
              free: false,
            },
            {
              img: "https://img3.thuthuatphanmem.vn/uploads/2019/06/17/hinh-anh-dep-ngo-nghinh-ve-dong-vat_102855690.jpg",
              title: "Động vật",
              free: true,
            },
            {
              img: "https://antimatter.vn/wp-content/uploads/2022/06/anh-bau-troi-va-hoa.jpg",
              title: "Vườn hoa",
              free: false,
            },
          ].map((category, index) => (
            <div className="card-category" key={index}>
              <img src={category.img} alt={category.title} className="template-img" />
              <div className="overlay">
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

      {/* Backgrounds Section */}
      <section className="top-categories top">
        <h1 className="heading-1">
          {searchQuery && location.state?.selectedCategory?.value === 2
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Hình nền sáng tạo"}
        </h1>
        {searchQuery && (
          <div className="content">
            <button onClick={handleClearSearch} className="clear-search-btn">
              Xóa tìm kiếm
            </button>
          </div>
        )}
        <div className="container-categories">
          {loadingBackgrounds ? (
            <p>Đang tải dữ liệu...</p>
          ) : backgrounds.length === 0 ? (
            <p>Không tìm thấy hình nền nào.</p>
          ) : (
            backgrounds.slice(0, 4).map((bg, index) => (
              <div
                className="card-category-1"
                key={index}
                onClick={() => handleItemClick(bg, "background")}
              >
                <img
                  src={bg.duong_dan_anh_nho}
                  alt={bg.tieu_de}
                  width={350}
                  height={200}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === bg.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(bg, e)}
                  ></i>
                  {bg.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    Xem thêm về bộ sưu tập
                  </button>
                  <p className="template-title">{bg.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="container-categories top">
          {loadingBackgrounds ? (
            <p>Đang tải dữ liệu...</p>
          ) : backgrounds.length <= 4 ? (
            <p>Không có thêm hình nền để hiển thị.</p>
          ) : (
            backgrounds.slice(4, 8).map((bg, index) => (
              <div
                className="card-category-1"
                key={index}
                onClick={() => handleItemClick(bg, "background")}
              >
                <img
                  src={bg.duong_dan_anh_nho}
                  alt={bg.tieu_de}
                  width={350}
                  height={200}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === bg.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(bg, e)}
                  ></i>
                  {bg.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    Xem thêm về bộ sưu tập
                  </button>
                  <p className="template-title">{bg.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <img
          src="https://images2.thanhnien.vn/Uploaded/hoangnam/2022_09_06/anh-4-1709.jpeg"
          alt="Gallery Img1"
          className="gallery-img-1"
        />
        <img
          src="https://canhrau.com/wp-content/uploads/2020/09/mau-template-powerpoint-dep-nhat-hinh-4.jpg"
          alt="Gallery Img2"
          className="gallery-img-2"
        />
        <img
          src="https://canhrau.com/wp-content/uploads/2020/09/mau-template-powerpoint-dep-nhat-hinh-12.jpg"
          alt="Gallery Img3"
          className="gallery-img-3"
        />
        <img
          src="https://img.thuthuattinhoc.vn/uploads/2019/02/01/slide-dep-cho-thuyet-trinh_101043422.jpg"
          className="gallery-img-4"
        />
        <img
          src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/cach-lam-Powerpoint-dep.png"
          className="gallery-img-5"
        />
      </section>

      {/* Blogs Section */}
      <section className="container blogs">
        <h1 className="heading-1">Cung cấp hỗ trợ cho nhiều định dạng tập tin</h1>
        <div className="container-blogs">
          {blogs.map((blog, index) => (
            <div className="card-blog" key={index}>
              <div className="container-img">
                <img src={blog.img} alt={blog.alt} />
                <div className="button-group-blog">
                  <span>
                    <i className="bx bx-search-alt"></i>
                  </span>
                  <span>
                    <i className="bx bx-link"></i>
                  </span>
                </div>
              </div>
              <div className="content-blog">
                <h3>{blog.title}</h3>
                <span>{blog.date}</span>
                <p>{blog.description}</p>
                <div className="btn-read-more">Đọc thêm</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;