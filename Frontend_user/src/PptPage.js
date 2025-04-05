import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./ppt.css";
import { useNavigate } from "react-router-dom";

function PptPage() {
  const [powerpoints, setPowerpoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Phân trang
  const [first, setFirst] = useState(0);
  const itemsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:1000/danhmucs")
      .then((response) => response.json())
      .then((data) => {
        setCategories(shuffleArray(data).slice(0, 5));
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

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFirst(0);
  };

  const handleDownload = async (ppt) => {
    try {
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
        mau_powerpoint_id: ppt.id, // ID of the PowerPoint being downloaded
        hinh_anh_id: null, // No image ID since this is a PowerPoint download
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
        throw new Error("Failed to save download history");
      }

      // Proceed with the file download
      const link = document.createElement("a");
      link.href = `http://localhost:1000${ppt.duong_dan_tap_tin}`;
      link.download = true;
      link.click();
    } catch (error) {
      console.error("Error during download:", error);
      // Optionally, show an error message to the user
      alert("Có lỗi xảy ra khi tải xuống. Vui lòng thử lại!");
    }
  };

  const handlePowerPointClick = (ppt) => {
    navigate("/about", { state: { powerpoint: ppt } });
  };

  return (
    <>
      <section className="top-categories">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> PowerPoint
        </p>
        <h1 className="heading-1">Mẫu PowerPoint Miễn Phí và Google Trang Trình Bày</h1>

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

        <div className="container-categories top">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không có mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.slice(first, first + itemsPerPage).map((ppt, index) => (
              <div className="card-category" key={index} onClick={() => handlePowerPointClick(ppt)}>
                <img
                  src={ppt.duong_dan_anh_nho}
                  alt={ppt.tieu_de}
                  className="template-img"
                />
                <div className="overlay">
                  {ppt.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button
                    className="download-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click cha
                      handleDownload(ppt); // Pass the entire ppt object
                    }}
                  >
                    <i className="bx bx-download"></i> PowerPoint
                  </button>
                  <p className="template-title">{ppt.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>

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