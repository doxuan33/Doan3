import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./ppt.css";
import { useNavigate } from "react-router-dom";

function PngPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Phân trang
  const [first, setFirst] = useState(0);
  const itemsPerPage = 16; // Updated to 16 items per page to display 16 images before paginating

  const navigate = useNavigate();

  // Fetch categories
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

  // Fetch images based on selected category
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:1000/hinhanhs";
    if (selectedCategory) {
      url += `?danh_muc_id=${selectedCategory.id}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu hình ảnh:", error);
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

  const handleDownload = async (image) => {
    try {
      // Validate the image URL
      if (!image.duong_dan_anh_nho) {
        throw new Error("Không tìm thấy đường dẫn hình ảnh để tải xuống.");
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
        mau_powerpoint_id: null, // No PowerPoint ID since this is an image download
        hinh_anh_id: image.id, // ID of the image being downloaded
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
  
      // Fetch the image as a blob
      const fileResponse = await fetch(image.duong_dan_anh_nho, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }), // Include token if required by the server
        },
      });
  
      if (!fileResponse.ok) {
        throw new Error("Không thể tải hình ảnh: " + fileResponse.statusText);
      }
  
      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = image.tieu_de || "image"; // Set a meaningful file name
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

  const handleImageClick = (image) => {
    navigate("/about", { state: { image: image } }); // Navigate to PPTTemplate with image data
  };

  return (
    <>
      <section className="top-categories top">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> Hình ảnh
        </p>
        <h1 className="heading-1">Hình ảnh và bộ sưu tập</h1>

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

        <div className="container-categories-1 top">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : images.length === 0 ? (
            <p>Không có hình ảnh nào.</p>
          ) : (
            images.slice(first, first + itemsPerPage).map((image, index) => (
              <div className="card-category-1" key={index} onClick={() => handleImageClick(image)}>
                <img
                  src={image.duong_dan_anh_nho}
                  alt={image.tieu_de}
                  width={350}
                  height={200}
                />
                <div className="overlay">
                  {image.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button
                    className="download-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      handleDownload(image);
                    }}
                  >
                    Tải Hình ảnh
                  </button>
                  <p className="template-title">{image.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <Paginator
          first={first}
          rows={itemsPerPage}
          totalRecords={images.length}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}

export default PngPage;