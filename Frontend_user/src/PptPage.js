import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";

function PptPage() {
  const [powerpoints, setPowerpoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Phân trang
  const [first, setFirst] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    // Lấy danh sách danh mục và xáo trộn ngẫu nhiên
    fetch("http://localhost:1000/danhmucs")
      .then((response) => response.json())
      .then((data) => {
        setCategories(shuffleArray(data).slice(0, 5)); // Chọn ngẫu nhiên 5 danh mục
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:1000/maupowerpoints";
    if (selectedCategory) {
      url += `?danh_muc_id=${selectedCategory.id}`;
    }
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPowerpoints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu PowerPoint:", error);
        setLoading(false);
      });
  }, [selectedCategory]);

  // Hàm xáo trộn mảng ngẫu nhiên
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Xử lý khi đổi trang
  const onPageChange = (event) => {
    setFirst(event.first);
  };

  // Xử lý chọn danh mục
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFirst(0); // Reset về trang đầu tiên
  };

  // Xử lý download
  const handleDownload = (filePath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:1000${filePath}`;
    link.download = true;
    link.click();
  };

  return (
    <>
      {/* Categories */}
      <section className="top-categories">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> PowerPoint
        </p>
        <h1 className="heading-1">Mẫu PowerPoint Miễn Phí và Google Trang Trình Bày</h1>

        {/* Danh mục */}
        <div className="content">
          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="buttons left_content">
              <button onClick={() => handleCategoryClick(null)} className={!selectedCategory ? "active" : ""}>
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={selectedCategory?.id === category.id ? "active" : ""}
                >
                  {category.ten}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Danh sách PowerPoint */}
        <div className="container-categories top">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không có mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.slice(first, first + itemsPerPage).map((ppt, index) => (
              <div className="card-category" key={index}>
                <img
                  src={ppt.duong_dan_anh_nho}
                  alt={ppt.tieu_de}
                  className="template-img"
                />

                <div className="overlay">
                  {ppt.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(ppt.duong_dan_tap_tin)}
                  >
                    <i className="bx bx-download"></i> PowerPoint
                  </button>
                  <p className="template-title">{ppt.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Phân trang */}
        <Paginator
          first={first}
          rows={itemsPerPage}
          totalRecords={powerpoints.length}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}

export default PptPage;
