import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./ppt.css";
import { useLocation, useNavigate } from "react-router-dom";

function PngPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Pagination
  const [first, setFirst] = useState(0);
  const itemsPerPage = 16; // Display 16 items per page

  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");

  // Load favorites from localStorage when component mounts
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

  // Save favorites to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch categories and set selected category from URL
  useEffect(() => {
    fetch("http://localhost:1000/danhmucs")
      .then((response) => response.json())
      .then((data) => {
        setCategories(shuffleArray(data).slice(0, 5));
        setLoadingCategories(false);

        // If a category is passed in the URL, find and set it
        if (categoryFromUrl) {
          const matchedCategory = data.find(
            (cat) => cat.ten.toLowerCase() === categoryFromUrl.toLowerCase()
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        setLoadingCategories(false);
      });
  }, [categoryFromUrl]);

  // Fetch Images based on category and search query
  const fetchImages = (searchQuery = "") => {
    setLoading(true);
    let url = "http://localhost:1000/hinhanhs";
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.append("danh_muc_id", selectedCategory.id);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    url += params.toString() ? `?${params.toString()}` : "";

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
  };

  // Handle search results or fetch Images based on category/search
  useEffect(() => {
    const searchResults = location.state?.searchResults;
    const searchQuery = location.state?.searchQuery;

    if (searchResults && searchQuery) {
      setImages(searchResults);
      setLoading(false);
    } else {
      fetchImages(searchQuery || "");
    }
  }, [location.state, selectedCategory]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFirst(0);
    navigate(`/png${category ? `?category=${encodeURIComponent(category.ten)}` : ""}`);
  };

  const handleDownload = async (image) => {
    try {
      if (!image.duong_dan_anh_nho) {
        throw new Error("Không tìm thấy đường dẫn hình ảnh để tải xuống.");
      }

      const token = localStorage.getItem("token");
      let userId = null;

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

      const downloadHistory = {
        nguoi_dung_id: userId,
        mau_powerpoint_id: null,
        hinh_anh_id: image.id,
      };

      const response = await fetch("http://localhost:1000/lichsutaixuongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(downloadHistory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save download history");
      }

      const fileResponse = await fetch(image.duong_dan_anh_nho, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!fileResponse.ok) {
        throw new Error("Không thể tải hình ảnh: " + fileResponse.statusText);
      }

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = image.tieu_de || "image";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during download:", error.message);
      alert(`Có lỗi xảy ra khi tải xuống: ${error.message}`);
    }
  };

  const handleImageClick = (image) => {
    navigate("/about", { state: { image: image, favorites } });
  };

  const handleFavoriteClick = (image, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === image.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== image.id);
      } else {
        return [...prevFavorites, image];
      }
    });
  };

  return (
    <>
      <section className="top-categories-1">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> Hình ảnh
          {selectedCategory && (
            <>
              <i className="bx bx-chevron-right"></i> {selectedCategory.ten}
            </>
          )}
        </p>
        <h1 className="heading-1">
          {location.state?.searchQuery
            ? `Kết quả tìm kiếm cho "${location.state.searchQuery}"`
            : "Hình ảnh và bộ sưu tập"}
        </h1>

        <div className="content">
          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="buttons left_content">
              <button
                onClick={() => handleCategoryClick(null)}
                className={!selectedCategory ? "active" : ""}
              >
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

        <div className="container-categories-1 top left_content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : images.length === 0 ? (
            <p>Không có hình ảnh nào.</p>
          ) : (
            images.slice(first, first + itemsPerPage).map((image, index) => (
              <div
                className="card-category-1"
                key={index}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.duong_dan_anh_nho}
                  alt={image.tieu_de}
                  width={350}
                  height={200}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === image.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(image, e)}
                  ></i>
                  {/* Hiển thị badge dựa trên la_pro */}
                  <span className={image.la_pro ? "badge-pro" : "badge-free"}>
                    {image.la_pro ? "Pro" : "Miễn phí"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={(e) => {
                      e.stopPropagation();
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