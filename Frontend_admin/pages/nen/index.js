import React, { useState, useEffect, useRef } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import axios from 'axios';
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function HinhnenImg() {
    const [layout, setLayout] = useState("grid");
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hinhnenImgs, setImage] = useState([]);
    const [filteredPowerpoints, setFilteredPowerpoints] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const toast = useRef(null);
   
    const [formData, setFormData] = useState({
            tieu_de: '', mo_ta: '', danh_muc_id: '', nguoi_dung_id: '',
            duong_dan_anh_nho: ''
        });

        useEffect(() => {
            fetchPowerPoints();
            fetchCategories();
        }, []);
        useEffect(() => {
            if (selectedCategory) {
                setFilteredPowerpoints(hinhnenImgs.filter((img) => img.danh_muc_id === selectedCategory));
            } else {
                setFilteredPowerpoints(hinhnenImgs);
            }
        }, [selectedCategory, hinhnenImgs]);
        useEffect(() => {
            if (globalFilterValue) {
                setFilteredPowerpoints(
                    hinhnenImgs.filter((img) =>
                        img.tieu_de.toLowerCase().includes(globalFilterValue.toLowerCase()) ||
                        img.mo_ta.toLowerCase().includes(globalFilterValue.toLowerCase())
                    )
                );
            } else {
                setFilteredPowerpoints(hinhnenImgs);
            }
        }, [globalFilterValue, hinhnenImgs]);
        const fetchPowerPoints = () => {
            axios
                .get("http://localhost:1000/hinhanhs")
                .then((response) => setImage(response.data))
                .catch((error) => console.error("Error fetching images:", error));
        };
        const handleCategoryChange = (e) => {
            setSelectedCategory(e.value);
        };
        const fetchCategories = () => {
            axios.get('http://localhost:1000/danhmucs')
                .then(response => setCategories(response.data))
                .catch(error => console.error('Error fetching categories:', error));
        };
    
        const openDialog = (hinhnenImg = null) => {
            setIsEditing(!!hinhnenImg);
            setFormData(
                hinhnenImg || {
                    id: "",
                    tieu_de: "",
                    mo_ta: "",
                    danh_muc_id: "",
                    nguoi_dung_id: "",
                    duong_dan_anh_nho: "",
                }
            );
            setSelectedFile(null);
            setSelectedImage(null);
            setDialogVisible(true);
        };
    
        const handleFileChange = (event, type) => {
            const file = event.target.files[0];
            if (!file) return;
    
            if (type === "image") {
                setSelectedImage(file);
                setFormData({ ...formData, duong_dan_anh_nho: URL.createObjectURL(file) });
            } else if (type === "file") {
                setSelectedFile(file);
                setFormData({ ...formData, duong_dan_tap_tin: file.name });
            }
        };
    
        const handleSave = async () => {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("tieu_de", formData.tieu_de);
                formDataToSend.append("mo_ta", formData.mo_ta);
                formDataToSend.append("danh_muc_id", formData.danh_muc_id);
    
                if (selectedImage) formDataToSend.append("thumbnail", selectedImage);
                if (selectedFile) formDataToSend.append("file", selectedFile);
    
                let response;
                if (isEditing) {
                    response = await axios.put(`http://localhost:1000/hinhanhs/${formData.id}`, formDataToSend, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } else {
                    response = await axios.post("http://localhost:1000/hinhanhs", formDataToSend, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }
    
                fetchPowerPoints();
                setDialogVisible(false);
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
                });
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không thể lưu dữ liệu",
                });
            }
        };    
        const handleDelete = (id) => {
            confirmDialog({
                message: "Bạn có chắc chắn muốn xóa mẫu PowerPoint này?",
                header: "Xác nhận xóa",
                icon: "pi pi-exclamation-triangle",
                accept: async () => {
                    try {
                        await axios.delete(`http://localhost:1000/hinhanhs/${id}`);
                        fetchPowerPoints();
                        toast.current.show({
                            severity: "success",
                            summary: "Xóa thành công",
                            detail: "Mẫu PowerPoint đã được xóa",
                            life: 3000
                        });
                    } catch (error) {
                        toast.current.show({
                            severity: "error",
                            summary: "Lỗi",
                            detail: "Không thể xóa. Vui lòng thử lại!",
                            life: 3000
                        });
                    }
                },
                reject: () => {
                    toast.current.show({
                        severity: "info",
                        summary: "Hủy",
                        detail: "Hủy thao tác xóa",
                        life: 3000
                    });
                }
            });
        };
        const handleDownload = (filePath) => {
            const link = document.createElement('a');
            link.href = `http://localhost:1000${filePath}`; // Link tới file PowerPoint
            link.download = true; // Tự động tải về mà không cần mở lên
            link.click(); // Bắt đầu tải xuống
          };
    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={selectedCategory} options={categories.map(cat => ({ label: cat.ten, value: cat.id }))} 
                optionLabel="label" placeholder="Chọn danh mục" onChange={handleCategoryChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    onChange={(e) => setGlobalFilterValue(e.target.value)}
                    placeholder="Nhập tìm kiếm..."
                />
            </span>
            <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={() => openDialog()} />
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const itemTemplate = (hinhnenImg, layout) => {
        if (!hinhnenImg) return;
        if (layout === "list") {
          return (
            <div className="col-12">
              <div className="flex flex-column md:flex-row align-items-center p-3 border-1 surface-border">
                <img src={hinhnenImg.duong_dan_anh_nho} alt={hinhnenImg.tieu_de} className="w-10rem shadow-2 mr-5" />
                <div className="flex-1">
                    <div className="flex-1 justify-content-center mt-2">
                        <h5 className="font-bold">{hinhnenImg.tieu_de}</h5>
                        <p>{hinhnenImg.mo_ta}</p>
                    </div>
                    <Rating value={hinhnenImg.rating} readOnly cancel={false} />
                </div>
                <div className="flex gap-2">
                  <Button label="Sửa" icon="pi pi-pencil" className="p-button-warning p-button-sm" onClick={() => openDialog(hinhnenImg)} />
                  <Button label="Xóa" icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(hinhnenImg.id)} />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="col-12 md:col-4">
              <div className="card border-1 surface-border p-3 text-center">
                <img src={hinhnenImg.duong_dan_anh_nho} alt={hinhnenImg.tieu_de} className="w-full shadow-2" height={200} />
                <h5 className="mt-3 font-bold">{hinhnenImg.tieu_de}</h5>
                <p>{hinhnenImg.mo_ta}</p>
                <div className="flex justify-content-center mt-2">
                    <Rating value={hinhnenImg.rating} readOnly cancel={false} />
                </div>
                <div className="flex justify-content-center gap-2 mt-2">
                  <Button label="Sửa" icon="pi pi-pencil" className="p-button-warning p-button-sm" onClick={() => openDialog(hinhnenImg)} />
                  <Button label="Xóa" icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(hinhnenImg.id)} />
                </div>
              </div>
            </div>
          );
        }
      };
    const [imagePreview, setImagePreview] = useState(formData.duong_dan_anh_nho || "");
        const [pptFileName, setPptFileName] = useState(formData.duong_dan_tap_tin || "");
    
        const onImageSelect = (e) => {
            const file = e.files[0];
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setImagePreview(objectUrl);
                handleFileChange({ target: { files: [file] } }, "image");
            }
        };
    
        const onFileSelect = (e) => {
            const file = e.files[0];
            if (file) {
                setPptFileName(file.name);
                handleFileChange({ target: { files: [file] } }, "file");
            }
        };
    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h4>Danh mục - Hình nền</h4>
            <DataView
                value={filteredPowerpoints}
                layout={layout}
                paginator
                rows={6}
                itemTemplate={itemTemplate}
                header={
                    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
                        <Dropdown
                            value={selectedCategory}
                            options={[
                                { label: "Tất cả bộ sưu tập", value: null }, // Thêm tùy chọn này vào đầu danh sách
                                ...categories.map((cat) => ({ label: cat.ten, value: cat.id }))
                            ]}
                            placeholder="Chọn danh mục"
                            onChange={(e) => setSelectedCategory(e.value)}
                        />
                        <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                value={globalFilterValue}
                                onChange={(e) => setGlobalFilterValue(e.target.value)}
                                placeholder="Nhập tìm kiếm..."
                            />
                        </span>
                        <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={() => openDialog()} />
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>
                }
            />
            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header={isEditing ? "Chỉnh sửa" : "Thêm mới"} className="w-6">
                <div className="grid p-fluid">
                    <div className="col-6">
                        <label>Tiêu đề</label>
                        <InputText value={formData.tieu_de} onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })} />

                        <label>Mô tả</label>
                        <InputText value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} />

                        <label>Danh mục</label>
                        <Dropdown value={formData.danh_muc_id} options={categories.map((cat) => ({ label: cat.ten, value: cat.id }))} 
                            onChange={(e) => setFormData({ ...formData, danh_muc_id: e.value })} placeholder="Chọn danh mục" />
                    </div>
                    <div className="col-6">
                                        {/* Upload ảnh */}
                                        
                                                {formData.duong_dan_anh_nho && (
                                                        <img src={formData.duong_dan_anh_nho} alt="Ảnh xem trước" width="150" className="mt-2 border-round-lg shadow-1" />
                                                    )}
                                                <div className="mb-4">
                                                    <label className="font-bold block mb-2">Chọn ảnh</label>
                                                    <FileUpload mode="basic" accept="image/*" customUpload auto chooseLabel="Chọn ảnh" onSelect={onImageSelect} />
                                                </div>
                                        </div>
                </div>
                <div className="col-12 text-center mt-3">
                    <Button label="Lưu" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
                </div>
            </Dialog>
        </div>
    );
}
