import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./ppt.css";
import { useLocation, useNavigate } from "react-router-dom";

function PptPage() {
  const [powerpoints, setPowerpoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Pagination
  const [first, setFirst] = useState(0);
  const itemsPerPage = 20;

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

  // Fetch PowerPoints based on category and search query
  const fetchPowerPoints = (searchQuery = "") => {
    setLoading(true);
    let url = "http://localhost:1000/maupowerpoints";
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
        setPowerpoints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu PowerPoint:", error);
        setLoading(false);
      });
  };

  // Handle search results or fetch PowerPoints based on category/search
  useEffect(() => {
    const searchResults = location.state?.searchResults;
    const searchQuery = location.state?.searchQuery;

    if (searchResults && searchQuery) {
      setPowerpoints(searchResults);
      setLoading(false);
    } else {
      fetchPowerPoints(searchQuery || "");
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
    navigate(`/ppt${category ? `?category=${encodeURIComponent(category.ten)}` : ""}`);
  };

  const handleDownload = async (ppt) => {
    try {
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
        mau_powerpoint_id: ppt.id,
        hinh_anh_id: null,
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
        throw new Error("Failed to save download history");
      }

      const link = document.createElement("a");
      link.href = `http://localhost:1000${ppt.duong_dan_tap_tin}`;
      link.download = true;
      link.click();
    } catch (error) {
      console.error("Error during download:", error);
      alert("Có lỗi xảy ra khi tải xuống. Vui lòng thử lại!");
    }
  };

  const handlePowerPointClick = (ppt) => {
    navigate("/about", { state: { powerpoint: ppt, favorites } });
  };

  const handleFavoriteClick = (ppt, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === ppt.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== ppt.id);
      } else {
        return [...prevFavorites, ppt];
      }
    });
  };

  const navigateToUserPage = () => {
    navigate("/user", { state: { favorites } });
  };

  return (
    <>
      <section className="top-categories-1">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> PowerPoint
          {selectedCategory && (
            <>
              <i className="bx bx-chevron-right"></i> {selectedCategory.ten}
            </>
          )}
        </p>
        <h1 className="heading-1">
          {location.state?.searchQuery
            ? `Kết quả tìm kiếm cho "${location.state.searchQuery}"`
            : "Mẫu PowerPoint Miễn Phí và Google Trang Trình Bày"}
        </h1>

        <div className="content left_content">
          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="buttons">
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

        <div className="container-categories top">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không tìm thấy mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.slice(first, first + itemsPerPage).map((ppt, index) => (
              <div
                className="card-category"
                key={index}
                onClick={() => handlePowerPointClick(ppt)}
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
                  {/* Hiển thị badge dựa trên la_pro */}
                  <span className={ppt.la_pro ? "badge-pro" : "badge-free"}>
                    {ppt.la_pro ? <i class='bx bxs-crown'></i> : "Miễn phí"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(ppt);
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