import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./UserPage.css";
import { useLocation, useNavigate } from "react-router-dom";

function UserPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("PowerPoint");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [selectedPowerPointId, setSelectedPowerPointId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    quyen: "", // Thêm trường quyen
    so_dien_thoai: "", // Thêm trường so_dien_thoai
    thoi_gian_het_han_hoi_vien: "", // Thêm trường thoi_gian_het_han_hoi_vien
  });
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = React.useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    let favoritesFromStorage = [];
    if (storedFavorites) {
      try {
        favoritesFromStorage = JSON.parse(storedFavorites);
        if (!Array.isArray(favoritesFromStorage)) {
          favoritesFromStorage = [];
        }
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        favoritesFromStorage = [];
      }
    }

    const favoritesFromState = location.state?.favorites || [];
    const mergedFavorites = [
      ...favoritesFromStorage,
      ...favoritesFromState.filter(
        (stateFav) =>
          !favoritesFromStorage.some((storedFav) => storedFav.id === stateFav.id)
      ),
    ];
    setFavorites(mergedFavorites);
    localStorage.setItem("favorites", JSON.stringify(mergedFavorites));
  }, [location.state]);

  const sidebarItems = [
    { label: "Trung tâm cá nhân của tôi", key: "profile", icon: "pi pi-user" },
    { label: "Lịch sử tải về", key: "downloads", icon: "pi pi-download" },
    { label: "Đánh giá của tôi", key: "reviews", icon: "pi pi-star" },
    { label: "Theo dõi", key: "follow", icon: "pi pi-heart" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          throw new Error("No token found. Please log in.");
        }

        const userResponse = await fetch("http://localhost:1000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        const userInfo = {
          id: userData.user.id,
          name: userData.user.ten,
          status:
            (userData.user.quyen ?? "") === "admin"
              ? "Quản trị viên"
              : "Người sử dụng miễn phí",
          avatar:
            "https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg",
          role: "Tên thiết kế cơ bản",
          position: "Tiêu đề công việc của bạn",
          email: userData.user.email || "",
          password: "********",
          quyen: userData.user.quyen || "", // Thêm quyen
          so_dien_thoai: userData.user.so_dien_thoai || "", // Thêm so_dien_thoai
          thoi_gian_het_han_hoi_vien: userData.user.thoi_gian_het_han_hoi_vien || "", // Thêm thoi_gian_het_han_hoi_vien
        };
        setUser(userInfo);
        setEditForm({
          name: userInfo.name,
          email: userInfo.email,
          password: "",
          confirmPassword: "",
          quyen: userInfo.quyen,
          so_dien_thoai: userInfo.so_dien_thoai,
          thoi_gian_het_han_hoi_vien: userInfo.thoi_gian_het_han_hoi_vien,
        });

        const downloadResponse = await fetch(
          `http://localhost:1000/lichsutaixuongs/user/${userData.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!downloadResponse.ok)
          throw new Error("Failed to fetch download history");
        const downloadData = await downloadResponse.json();

        const downloadItems = await Promise.all(
          downloadData.map(async (item) => {
            let downloadedItem = null;
            let type = null;

            if (item.mau_powerpoint_id) {
              const powerpointResponse = await fetch(
                `http://localhost:1000/maupowerpoints/${item.mau_powerpoint_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (powerpointResponse.ok) {
                const powerpointData = await powerpointResponse.json();
                downloadedItem = {
                  title: powerpointData.tieu_de || "Không có tiêu đề",
                  image:
                    powerpointData.duong_dan_anh_nho ||
                    "https://via.placeholder.com/80",
                  description:
                    powerpointData.mo_ta || "Không có mô tả",
                  author: "air",
                  size: "1200 * 1200",
                  status: "Need Credit",
                  powerPointId: item.mau_powerpoint_id,
                };
                type = "PowerPoint";
              }
            } else if (item.hinh_anh_id) {
              const imageResponse = await fetch(
                `http://localhost:1000/hinhanhs/${item.hinh_anh_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                downloadedItem = {
                  title: imageData.tieu_de || "Không có tiêu đề",
                  image:
                    imageData.duong_dan_anh_nho ||
                    "https://via.placeholder.com/80",
                  description: imageData.mo_ta || "Không có mô tả",
                  author: "air",
                  size: "1200 * 1200",
                  status: "Need Credit",
                };
                type = "Hình ảnh";
              }
            }

            return {
              type: type || "Không xác định",
              title: downloadedItem
                ? downloadedItem.title
                : "Không có tiêu đề",
              image: downloadedItem
                ? downloadedItem.image
                : "https://via.placeholder.com/80",
              description: downloadedItem
                ? downloadedItem.description
                : "Không có mô tả",
              author: downloadedItem ? downloadedItem.author : "Không rõ",
              size: downloadedItem ? downloadedItem.size : "Không rõ",
              status: downloadedItem ? downloadedItem.status : "Free",
              date: item.thoi_gian_tai || "Không rõ",
              powerPointId: downloadedItem?.powerPointId || null,
            };
          })
        );
        setDownloadHistory(downloadItems);

        const reviewsResponse = await fetch(
          `http://localhost:1000/danhgias/user/${userData.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsResponse.json();
        setReviews(
          reviewsData.map((item) => ({
            id: item.id,
            content: item.binh_luan || "Không có nội dung",
            rating: item.diem_danh_gia || 5,
            date: item.ngay_tao || "Không rõ",
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredDownloadHistory = downloadHistory.filter((item) =>
    filterType === "PowerPoint" ? item.type === "PowerPoint" : item.type === "Hình ảnh"
  );

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:1000/danhgias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nguoi_dung_id: user.id,
          mau_powerpoint_id: selectedPowerPointId,
          diem_danh_gia: reviewForm.rating,
          binh_luan: reviewForm.comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const reviewsResponse = await fetch(
        `http://localhost:1000/danhgias/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reviewsData = await reviewsResponse.json();
      setReviews(
        reviewsData.map((item) => ({
          id: item.id,
          content: item.binh_luan || "Không có nội dung",
          rating: item.diem_danh_gia || 5,
          date: item.ngay_tao || "Không rõ",
        }))
      );

      setShowReviewDialog(false);
      setReviewForm({ rating: 5, comment: "" });
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đánh giá đã được gửi",
        life: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err.message,
        life: 3000,
      });
    }
  };

  const openReviewDialog = (powerPointId) => {
    setSelectedPowerPointId(powerPointId);
    setIsEditingReview(false);
    setReviewForm({ rating: 5, comment: "" });
    setShowReviewDialog(true);
  };

  const openEditReviewDialog = (review) => {
    setEditingReview(review);
    setIsEditingReview(true);
    setReviewForm({
      rating: review.rating,
      comment: review.content,
    });
    setShowReviewDialog(true);
  };

  const handleEditReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1000/danhgias/${editingReview.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            diem_danh_gia: reviewForm.rating,
            binh_luan: reviewForm.comment,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update review");

      const reviewsResponse = await fetch(
        `http://localhost:1000/danhgias/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reviewsData = await reviewsResponse.json();
      setReviews(
        reviewsData.map((item) => ({
          id: item.id,
          content: item.binh_luan || "Không có nội dung",
          rating: item.diem_danh_gia || 5,
          date: item.ngay_tao || "Không rõ",
        }))
      );

      setShowReviewDialog(false);
      setReviewForm({ rating: 5, comment: "" });
      setEditingReview(null);
      setIsEditingReview(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đánh giá đã được cập nhật",
        life: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err.message,
        life: 3000,
      });
    }
  };

  const handleDeleteReview = (reviewId) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa đánh giá này?",
      header: "Xác nhận xóa đánh giá",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:1000/danhgias/${reviewId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to delete review");

          const reviewsResponse = await fetch(
            `http://localhost:1000/danhgias/user/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const reviewsData = await reviewsResponse.json();
          setReviews(
            reviewsData.map((item) => ({
              id: item.id,
              content: item.binh_luan || "Không có nội dung",
              rating: item.diem_danh_gia || 5,
              date: item.ngay_tao || "Không rõ",
            }))
          );

          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đánh giá đã được xóa",
            life: 3000,
          });
        } catch (err) {
          setError(err.message);
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: err.message,
            life: 3000,
          });
        }
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Hủy",
          detail: "Hủy thao tác xóa đánh giá",
          life: 3000,
        });
      },
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEditProfile = async () => {
    if (!editForm.name.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Tên người dùng không được để trống",
        life: 3000,
      });
      return;
    }

    if (!editForm.email.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Email không được để trống",
        life: 3000,
      });
      return;
    }

    if (!validateEmail(editForm.email)) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Email không hợp lệ",
        life: 3000,
      });
      return;
    }

    if (editForm.password) {
      if (!validatePassword(editForm.password)) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Mật khẩu phải có ít nhất 8 ký tự",
          life: 3000,
        });
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Mật khẩu xác nhận không khớp",
          life: 3000,
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        ten: editForm.name,
        email: editForm.email,
        mat_khau: editForm.password || undefined, // Gửi mat_khau nếu có thay đổi, không gửi nếu để trống
        quyen: editForm.quyen || user.quyen || undefined, // Giữ nguyên nếu không thay đổi
        so_dien_thoai: editForm.so_dien_thoai || user.so_dien_thoai || undefined,
        thoi_gian_het_han_hoi_vien:
          editForm.thoi_gian_het_han_hoi_vien || user.thoi_gian_het_han_hoi_vien || undefined,
      };

      // Loại bỏ các trường undefined trước khi gửi
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const response = await fetch(
        `http://localhost:1000/nguoidungs/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user information");
      }

      const updatedUserData = await response.json();
      setUser({
        ...user,
        name: updatedUserData.ten,
        email: updatedUserData.email,
        status: updatedUserData.quyen === "admin" ? "Quản trị viên" : "Người sử dụng miễn phí",
        quyen: updatedUserData.quyen,
        so_dien_thoai: updatedUserData.so_dien_thoai,
        thoi_gian_het_han_hoi_vien: updatedUserData.thoi_gian_het_han_hoi_vien,
        password: editForm.password ? "********" : user.password,
      });
      setEditForm({
        name: updatedUserData.ten,
        email: updatedUserData.email,
        password: "",
        confirmPassword: "",
        quyen: updatedUserData.quyen,
        so_dien_thoai: updatedUserData.so_dien_thoai,
        thoi_gian_het_han_hoi_vien: updatedUserData.thoi_gian_het_han_hoi_vien,
      });
      setIsEditingProfile(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thông tin tài khoản đã được cập nhật",
        life: 3000,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err.message || "Không thể cập nhật thông tin",
        life: 3000,
      });
    }
  };

  const handleDeleteAccount = () => {
    confirmDialog({
      message:
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!",
      header: "Xác nhận xóa tài khoản",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:1000/nguoidungs/${user.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete account");
          }

          localStorage.removeItem("token");
          localStorage.removeItem("favorites");
          window.location.href = "/login";
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Tài khoản đã được xóa",
            life: 3000,
          });
        } catch (err) {
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: err.message || "Không thể xóa tài khoản",
            life: 3000,
          });
        }
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Hủy",
          detail: "Hủy thao tác xóa tài khoản",
          life: 3000,
        });
      },
    });
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
          throw new Error("Failed to fetch user data");
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
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi tải xuống. Vui lòng thử lại!",
        life: 3000,
      });
    }
  };

  const handlePowerPointClick = (ppt) => {
    navigate("/about", { state: { powerpoint: ppt, favorites } });
  };

  const handleRemoveFavorite = (pptId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((fav) => fav.id !== pptId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== pptId)
      );
      return updatedFavorites;
    });
  };

  const handleChat = () => {
    toast.current.show({
      severity: "info",
      summary: "Thông báo",
      detail: "Chức năng chat sẽ sớm được triển khai!",
      life: 3000,
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(favorites.map((ppt) => ppt.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (pptId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(pptId)) {
        return prevSelected.filter((id) => id !== pptId);
      } else {
        return [...prevSelected, pptId];
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng chọn ít nhất một mục để xóa!",
        life: 3000,
      });
      return;
    }

    confirmDialog({
      message: `Bạn có chắc chắn muốn xóa ${selectedItems.length} mục đã chọn?`,
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFavorites((prevFavorites) => {
          const updatedFavorites = prevFavorites.filter(
            (fav) => !selectedItems.includes(fav.id)
          );
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setSelectedItems([]);
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đã xóa các mục đã chọn",
            life: 3000,
          });
          return updatedFavorites;
        });
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Hủy",
          detail: "Hủy thao tác xóa",
          life: 3000,
        });
      },
    });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!user)
    return (
      <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>
    );

  return (
    <div className="user-page">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="sidebar">
        <ul>
          {sidebarItems.map((item) => (
            <li
              key={item.key}
              className={`sidebar-item ${
                activeSection === item.key ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.key)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {activeSection === "profile" && (
          <div className="profile">
            <div className="user-info">
              <Avatar image={user.avatar} size="xlarge" shape="circle" />
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>ID: {user.id}</p>
                <span className="user-status">{user.status}</span>
              </div>
              <Button
                label="Trở thành thành viên"
                className="upgrade-btn"
              />
            </div>
            <div className="social-buttons">
              <h4>Tài khoản liên kết</h4>
              <Button
                label="Tiếp tục sử dụng Facebook"
                icon="pi pi-facebook"
                className="p-button-info"
              />
              <Button
                label="Tiếp tục sử dụng Google"
                icon="pi pi-google"
                className="p-button-danger"
              />
              <Button
                label="Tiếp tục sử dụng Twitter"
                icon="pi pi-twitter"
                className="p-button-secondary"
              />
            </div>
            <div className="user-data">
              <h4>Dữ liệu của bạn</h4>
              {isEditingProfile ? (
                <div className="edit-form">
                  <div className="data-item">
                    <label>Tên người dùng *</label>
                    <InputText
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Nhập tên người dùng"
                    />
                  </div>
                  <div className="data-item">
                    <label>Email *</label>
                    <InputText
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="data-item">
                    <label>Mật khẩu mới</label>
                    <InputText
                      type="password"
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({ ...editForm, password: e.target.value })
                      }
                      placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                    />
                  </div>
                  <div className="data-item">
                    <label>Xác nhận mật khẩu mới</label>
                    <InputText
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) =>
                        setEditForm({ ...editForm, confirmPassword: e.target.value })
                      }
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <div className="data-item">
                    <label>Quyền (nếu có)</label>
                    <InputText
                      value={editForm.quyen}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quyen: e.target.value })
                      }
                      placeholder="Nhập quyền (ví dụ: admin, user)"
                    />
                  </div>
                  <div className="data-item">
                    <label>Số điện thoại</label>
                    <InputText
                      value={editForm.so_dien_thoai}
                      onChange={(e) =>
                        setEditForm({ ...editForm, so_dien_thoai: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="data-item">
                    <label>Thời gian hết hạn hội viên</label>
                    <InputText
                      value={editForm.thoi_gian_het_han_hoi_vien}
                      onChange={(e) =>
                        setEditForm({ ...editForm, thoi_gian_het_han_hoi_vien: e.target.value })
                      }
                      placeholder="Nhập ngày (YYYY-MM-DD HH:MM:SS)"
                    />
                  </div>
                  <div className="data-item">
                    <Button
                      label="Lưu"
                      icon="pi pi-check"
                      className="p-button-success"
                      onClick={handleEditProfile}
                    />
                    <Button
                      label="Hủy"
                      icon="pi pi-times"
                      className="p-button-secondary"
                      onClick={() => setIsEditingProfile(false)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="data-item">
                    <label>Tên thiết kế cơ bản</label>
                    <p>{user.role}</p>
                  </div>
                  <div className="data-item">
                    <label>Chức danh</label>
                    <p>{user.position}</p>
                  </div>
                  <Button
                    label="Chỉnh sửa thông tin"
                    icon="pi pi-pencil"
                    className="p-button-primary"
                    onClick={() => setIsEditingProfile(true)}
                  />
                </>
              )}
            </div>
            <div className="account-info">
              <h4>Thông tin tài khoản</h4>
              <div className="data-item">
                <label>Tên người dùng *</label>
                <p>{user.name}</p>
              </div>
              <div className="data-item">
                <label>Email *</label>
                <p>{user.email}</p>
              </div>
              <div className="data-item">
                <label>Mật khẩu *</label>
                <p>{user.password}</p>
              </div>
              <div className="data-item">
                <label>Quyền</label>
                <p>{user.quyen || "Không xác định"}</p>
              </div>
              <div className="data-item">
                <label>Số điện thoại</label>
                <p>{user.so_dien_thoai || "Không có"}</p>
              </div>
              <div className="data-item">
                <label>Thời gian hết hạn hội viên</label>
                <p>{user.thoi_gian_het_han_hoi_vien || "Không có"}</p>
              </div>
              <Button
                label="Xóa tài khoản"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={handleDeleteAccount}
              />
            </div>
          </div>
        )}
        {activeSection === "downloads" && (
          <div className="downloads">
            <h2>Lịch sử tải về của tôi</h2>
            <div className="filter-bar">
              <Button
                label="PowerPoint"
                className={`filter-btn ${
                  filterType === "PowerPoint" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("PowerPoint")}
              />
              <Button
                label="Hình ảnh"
                className={`filter-btn ${
                  filterType === "Hình ảnh" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("Hình ảnh")}
              />
            </div>
            <div className="download-header">
              <span>Thông tin hình ảnh</span>
              <span></span>
              <span>Thông tin tùy chọn</span>
            </div>
            {filteredDownloadHistory.length > 0 ? (
              filteredDownloadHistory.map((item, index) => (
                <div key={index} className="download-item">
                  <div className="download-image-info">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="download-img"
                    />
                    <div className="download-info">
                      <h4>{item.title}</h4>
                      <p>
                        tác giả: {item.author} <br />
                        kích thước: {item.size} <br />
                        Thời gian tải xuống: {item.date}
                      </p>
                      {item.type === "PowerPoint" && (
                        <Button
                          label="Viết đánh giá"
                          icon="pi pi-star"
                          className="p-button-sm p-button-secondary"
                          onClick={() => openReviewDialog(item.powerPointId)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="download-status">
                    {item.status === "Need Credit" && (
                      <span className="need-credit">Need Credit!</span>
                    )}
                  </div>
                  <div className="download-permission">
                    <p>
                      <i className="pi pi-money-bill permission-icon free"></i>{" "}
                      Ghi phép miễn phí
                    </p>
                    <p>
                      <i className="pi pi-ban permission-icon non-commercial"></i>{" "}
                      Không sử dụng thương mại
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có lịch sử tải về cho {filterType}.</p>
            )}
          </div>
        )}
        {activeSection === "reviews" && (
          <div className="reviews">
            <h2>Đánh giá của tôi</h2>
            {reviews.length > 0 ? (
              reviews.map((item, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{user.name}</span>
                    <Rating
                      value={item.rating}
                      readOnly
                      cancel={false}
                      className="review-rating"
                    />
                  </div>
                  <p className="review-content">{item.content}</p>
                  <p className="review-date">Ngày đánh giá: {item.date}</p>
                  <div className="review-actions">
                    <Button
                      label="Sửa"
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-primary"
                      onClick={() => openEditReviewDialog(item)}
                    />
                    <Button
                      label="Xóa"
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                      onClick={() => handleDeleteReview(item.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào.</p>
            )}
          </div>
        )}
        {activeSection === "follow" && (
          <div className="follow">
            <h2>Danh sách yêu thích</h2>
            {favorites.length > 0 ? (
              <>
                <div className="follow-header">
                  <div className="select-all-container">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === favorites.length && favorites.length > 0}
                      onChange={handleSelectAll}
                    />
                    <span>Chọn tất cả</span>
                  </div>
                  <button
                    className="delete-selected-btn"
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.length === 0}
                  >
                    Xoá
                  </button>
                </div>
                <div className="follow-container">
                  {favorites.map((ppt, index) => (
                    <div className="follow-item" key={index}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(ppt.id)}
                        onChange={() => handleSelectItem(ppt.id)}
                        className="follow-checkbox"
                      />
                      <div className="follow-image-info">
                        <img
                          src={ppt.duong_dan_anh_nho}
                          alt={ppt.tieu_de}
                          className="follow-img"
                        />
                        <div className="follow-info">
                          <h4>{ppt.tieu_de}</h4>
                          <p>{ppt.favoritedAt || "Không rõ thời gian"}</p>
                        </div>
                      </div>
                      <div className="follow-actions">
                        {ppt.mien_phi && (
                          <span className="badge-free">Miễn phí</span>
                        )}
                        <button
                          className="download-btn"
                          onClick={() => handleDownload(ppt)}
                        >
                          <i className="bx bx-download"></i>
                        </button>
                        <button
                          className="remove-favorite-btn"
                          onClick={() => handleRemoveFavorite(ppt.id)}
                        >
                          <i className="pi pi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Chưa có PowerPoint nào trong danh sách yêu thích.</p>
            )}
          </div>
        )}
      </div>
      <Dialog
        header={isEditingReview ? "Sửa đánh giá" : "Viết đánh giá"}
        visible={showReviewDialog}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowReviewDialog(false);
          setIsEditingReview(false);
          setEditingReview(null);
          setReviewForm({ rating: 5, comment: "" });
        }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label>Điểm đánh giá</label>
            <Rating
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, rating: e.value })
              }
              cancel={false}
            />
          </div>
          <div className="p-field">
            <label>Bình luận</label>
            <InputTextarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
              rows={5}
              autoResize
            />
          </div>
          <Button
            label={isEditingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
            icon="pi pi-check"
            onClick={isEditingReview ? handleEditReviewSubmit : handleReviewSubmit}
            disabled={!reviewForm.comment}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default UserPage;