import React, { useContext, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import AppConfig from '../../layout/AppConfig';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();
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
        <div className="App">
            <header className="header">
                <div className="container-hero container">
                    <div className="container hero">
                        <div className="customer-support">
                            <i className="bx bx-headphone"></i>
                            <div className="content-customer-support">
                                <span className="text">Hỗ trợ khách hàng</span>
                                <span className="number">0378656586</span>
                            </div>
                        </div>

                        <div className="container-logo">
                            <img src={`/layout/images/logo.png`} alt="Logo" width={50} height={50} className="logo" />
                            <h1 className="logo">
                                <a href="/">XPoint</a>
                            </h1>
                        </div>

                        <div className="container-user">
                            <i className="bx bxs-user"></i>
                            <i className="bx bxs-grid-alt"></i>
                        </div>
                    </div>
                </div>
                <div className="container-navbar">
                <nav className="navbar container">
                    <i className="fa-solid fa-bars"></i>
                    <ul className="menu">
                    <li><a href="/home">Trang chủ</a></li>
                    <li><a href="/home">PowerPoint</a></li>
                    <li><a href="/notfound">Hình ảnh PNG</a></li>
                    <li><a href="/notfound">Hình Nền</a></li>
                    <li><a href="#">Mẫu</a></li>
                    </ul>
                    <form className="search-form">
                    <input type="search" placeholder="Tìm kiếm..." />
                    <button className="btn-search">
                        <i className="bx bx-search-alt"></i>
                    </button>
                    </form>
                </nav>
                </div>
            </header>

            {/* Slider */}
            <section className="banner section">
                <div className="carousel" ref={carouselRef}>
                    <div className="list" ref={sliderRef}>
                        {[1, 2, 3, 4].map((index) => (
                            <div className="item" key={index}>
                                <img src={`/layout/img/blog-${index}.png`} alt={`Slide ${index}`} width={800} height={400} />
                                <div className="content">
                                    <div className="author">XPOINT</div>
                                    <div className="title">Mẫu PowerPoint,</div>
                                    <div className="title">Hình ảnh</div>
                                    <div className="topic">TẢI MIỄN PHÍ</div>
                                    <div className="des">Cập nhật hình ảnh, mẫu thuyết trình mới nhất</div>
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
                                <img src={`/layout/img/new-${index}.png`} alt={`Thumbnail ${index}`} width={200} height={100} />
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
                { icon: "/layout/img/feat-1.png", title: "Mẫu Powerpoint" },
                { icon: "/layout/img/feat-2.png", title: "Giáo dục" },
                { icon: "/layout/img/feat-3.png", title: "Việc Kinh Doanh" },
                { icon: "/layout/img/feat-4.png", title: "Tiếp Thị" },
                { icon: "/layout/img/feat-5.png", title: "Đa Mục đích" },
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
                    { img: "/layout/img/top-1.png", title: "Powerpoint chủ đề cầu vồng", free: true },
                    { img: "/layout/img/top-2.png", title: "Find A Rainbow Day", free: true },
                    { img: "/layout/img/top-3.png", title: "Arabic Style Marketing Plan", free: false },
                    { img: "/layout/img/top-4.png", title: "Happy Father's Day", free: true },
                    { img: "/layout/img/top-5.png", title: "Happy Father's Day", free: false },
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
                    { img: "/layout/img/noel-bg.png", title: "Lễ giáng sinh", free: true },
                    { img: "/layout/img/ad3.jpg", title: "Ẩm thực", free: true },
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
            </section>
            {/* Gallery Section */}
            <section className="gallery">
                <img src="/layout/img/gallery1.jpg" alt="Gallery Img1" className="gallery-img-1" />
                <img src="/layout/img/gallery2.jpg" alt="Gallery Img2" className="gallery-img-2" />
                <img src="/layout/img/gallery3.jpg" alt="Gallery Img3" className="gallery-img-3" />
                <img src="/layout/img/gallery4.jpg" alt="Gallery Img4" className="gallery-img-4" />
                <img src="/layout/img/gallery5.jpg" alt="Gallery Img5" className="gallery-img-5" />
            </section>
            {/* Footer */}
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
                        </div>
                    </div>
                    <div className="copyright">
                        <p>Bản quyền của Đỗ Thị Xuân&copy; 2025</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LandingPage;
