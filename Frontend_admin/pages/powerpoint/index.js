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

export default function PowerPoint() {
    const [layout, setLayout] = useState('grid');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [powerpoints, setPowerpoints] = useState([]);
    const [filteredPowerpoints, setFilteredPowerpoints] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        tieu_de: '', mo_ta: '', danh_muc_id: '', nguoi_dung_id: '',
        duong_dan_tap_tin: '', duong_dan_anh_nho: ''
    });

    useEffect(() => {
        fetchPowerPoints();
        fetchCategories();
    }, []);
    useEffect(() => {
        if (selectedCategory) {
            setFilteredPowerpoints(powerpoints.filter(ppt => ppt.danh_muc_id === selectedCategory));
        } else {
            setFilteredPowerpoints(powerpoints);
        }
    }, [selectedCategory, powerpoints]);
    useEffect(() => {
        if (globalFilterValue) {
            const lowerCaseFilter = globalFilterValue.toLowerCase();
            setFilteredPowerpoints(
                powerpoints.filter((ppt) =>
                    ppt.tieu_de.toLowerCase().includes(lowerCaseFilter) ||
                    ppt.mo_ta.toLowerCase().includes(lowerCaseFilter)
                )
            );
        } else {
            setFilteredPowerpoints(powerpoints);
        }
    }, [globalFilterValue, powerpoints]);    
    const fetchPowerPoints = () => {
        axios.get('http://localhost:1000/maupowerpoints')
            .then(response => setPowerpoints(response.data))
            .catch(error => console.error('Error fetching powerpoints:', error));
    };
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.value);
    };
    const fetchCategories = () => {
        axios.get('http://localhost:1000/danhmucs')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    };

    const openDialog = (powerpoint = null) => {
        setIsEditing(!!powerpoint);
        setFormData(powerpoint || { tieu_de: '', mo_ta: '', danh_muc_id: '', nguoi_dung_id: '', duong_dan_tap_tin: '', duong_dan_anh_nho: '' });
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
        console.log("Dữ liệu gửi lên API:", formData);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("tieu_de", formData.tieu_de);
            formDataToSend.append("mo_ta", formData.mo_ta);
            formDataToSend.append("danh_muc_id", formData.danh_muc_id);

            if (selectedImage) formDataToSend.append("thumbnail", selectedImage);
            if (selectedFile) formDataToSend.append("file", selectedFile);

            let response;
            if (isEditing) {
                response = await axios.put(`http://localhost:1000/maupowerpoints/${formData.id}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                response = await axios.post("http://localhost:1000/maupowerpoints", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            console.log("Phản hồi từ API:", response.data);
            fetchPowerPoints();
            setDialogVisible(false);
            toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
            });
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error.response ? error.response.data : error);
            toast.current.show({
                severity: "error",
                summary: "Lỗi",
                detail: error.response?.data?.message || "Không thể lưu dữ liệu",
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
                    await axios.delete(`http://localhost:1000/maupowerpoints/${id}`);
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
    const itemTemplate = (powerpoint, layout) => {
        if (!powerpoint) return;
        if (layout === 'list') {
            return (
                <div className='col-12'>
                    <div className="flex flex-column md:flex-row align-items-center p-3 border-1 surface-border">
                        <img src={powerpoint.duong_dan_anh_nho} alt={powerpoint.tieu_de} className="w-10rem shadow-2 mr-5" />
                        <div className="flex-1">
                            <h5 className="mt-3 font-bold">{powerpoint.tieu_de}</h5>
                            <p>{powerpoint.mo_ta}</p>
                            <Rating value={powerpoint.rating || 5} readOnly cancel={false} />
                        </div>
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" className="p-button-warning p-button-sm" onClick={() => openDialog(powerpoint)} />
                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(powerpoint.id)} />
                            <Button icon="pi pi-download" className="p-button-outlined p-button-sm" onClick={() => handleDownload(powerpoint.duong_dan_tap_tin)} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="col-12 md:col-4">
                    <div className="card border-1 surface-border p-3 text-center">
                        <img src={powerpoint.duong_dan_anh_nho} alt={powerpoint.tieu_de} className="w-full shadow-2"/>
                        <h5 className="mt-3 font-bold">{powerpoint.tieu_de}</h5>
                        <p>{powerpoint.mo_ta}</p>
                        <div className="flex justify-content-center mt-2">
                            <Rating value={powerpoint.rating || 5} readOnly cancel={false} />
                        </div>
                        <div className="flex justify-content-center gap-2 mt-2">
                            <Button icon="pi pi-pencil" className="p-button-warning p-button-sm" onClick={() => openDialog(powerpoint)} />
                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(powerpoint.id)} />
                            <Button icon="pi pi-download" className="p-button-outlined p-button-sm" onClick={() => handleDownload(powerpoint.duong_dan_tap_tin)} />
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
            <h4>Danh mục - Mẫu PowerPoint</h4>
            <DataView value={filteredPowerpoints} layout={layout} paginator rows={6} itemTemplate={itemTemplate} header={
                <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
                    <Dropdown value={selectedCategory} 
                    options={[
                        { label: "Tất cả bộ sưu tập", value: null }, // Thêm tùy chọn này vào đầu danh sách
                        ...categories.map((cat) => ({ label: cat.ten, value: cat.id }))
                    ]}
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
            } />
           <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header={isEditing ? "Chỉnh sửa" : "Thêm mới"} className="w-6">
                <div className="grid p-fluid">
                    <div className="col-6">
                        <label htmlFor="tieu_de">Tiêu đề</label>
                        <InputText id="tieu_de" value={formData.tieu_de} onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })} />

                        <label htmlFor="mo_ta">Mô tả</label>
                        <InputText id="mo_ta" value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} />

                        <label htmlFor="danh_muc_id">Danh mục</label>
                        <Dropdown id="danh_muc_id" value={formData.danh_muc_id} options={categories.map(cat => ({ label: cat.ten, value: cat.id }))} onChange={(e) => setFormData({ ...formData, danh_muc_id: e.value })} placeholder="Chọn danh mục" />
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

                            {/* Upload tập tin PowerPoint */}
                            <div>
                                <label className="font-bold block mb-2">Chọn tập tin PowerPoint</label>
                                <FileUpload mode="basic" accept=".ppt,.pptx" customUpload auto chooseLabel="Chọn file" onSelect={onFileSelect} />
                                {formData.duong_dan_tap_tin && <p className="mt-2 text-green-600 font-medium">{formData.duong_dan_tap_tin}</p>}
                            </div>
                    </div>

                    <div className="col-12 text-center mt-3">
                        <Button label="Lưu" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
