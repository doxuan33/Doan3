import React, { useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css"; // Import file CSS riêng để hỗ trợ animation

function HomePage() {
  return (
    <>
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
    </>
  );
}

export default HomePage;
