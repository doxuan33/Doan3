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
    const [detailImages, setDetailImages] = useState([]); // Existing detail images
    const [newDetailImages, setNewDetailImages] = useState([]); // Newly uploaded detail images
    const toast = useRef(null);
    const fileUploadRef = useRef(null); // Ref for FileUpload to reset it
    const detailFileUploadRef = useRef(null); // Ref for detail images FileUpload

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

    const fetchCategories = () => {
        axios.get('http://localhost:1000/danhmucs')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    };

    const fetchDetailImages = (mauPowerpointId) => {
        axios.get(`http://localhost:1000/maupowerpointanhchitiets/mau-powerpoint/${mauPowerpointId}`)
            .then(response => setDetailImages(Array.isArray(response.data) ? response.data : []))
            .catch(error => console.error('Error fetching detail images:', error));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.value);
    };

    const openDialog = (powerpoint = null) => {
        setIsEditing(!!powerpoint);
        setFormData(powerpoint || { tieu_de: '', mo_ta: '', danh_muc_id: '', nguoi_dung_id: '', duong_dan_tap_tin: '', duong_dan_anh_nho: '' });
        setSelectedFile(null);
        setSelectedImage(null);
        setNewDetailImages([]);
        setDetailImages([]);
        if (powerpoint) {
            fetchDetailImages(powerpoint.id);
        }
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

    const handleDetailImageSelect = (e) => {
        const files = e.files;
        setNewDetailImages(prev => [...prev, ...files]);
        if (detailFileUploadRef.current) {
            detailFileUploadRef.current.clear(); // Reset FileUpload to allow multiple selections
        }
    };

    const removeDetailImage = async (index, isExisting = false) => {
        if (isEditing && isExisting) {
            const imageToDelete = detailImages[index];
            try {
                await axios.delete(`http://localhost:1000/maupowerpointanhchitiets/${imageToDelete.id}`);
                const updatedImages = detailImages.filter((_, i) => i !== index);
                setDetailImages(updatedImages);
                toast.current.show({
                    severity: "success",
                    summary: "Xóa thành công",
                    detail: "Ảnh chi tiết đã được xóa",
                    life: 3000
                });
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không thể xóa ảnh chi tiết",
                    life: 3000
                });
            }
        } else {
            const updatedImages = newDetailImages.filter((_, i) => i !== index);
            setNewDetailImages(updatedImages);
        }
    };

    const handleSave = async () => {
        try {
            // Step 1: Prepare and send PowerPoint data
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
    
            // Log the response to debug
            console.log("PowerPoint API Response:", response.data);
    
            // Step 2: Extract powerpointId and validate it
            const powerpointId = isEditing ? formData.id : (response.data.id || response.data.insertId || response.data.data?.id);
            if (!powerpointId || isNaN(powerpointId)) {
                throw new Error("Không thể lấy ID của PowerPoint vừa tạo. Kiểm tra phản hồi từ API.");
            }
    
            // Step 3: Handle detail images only if PowerPoint is successfully created/updated
            if (newDetailImages.length > 0) {
                const detailImagePromises = newDetailImages.map((image, i) => {
                    const detailFormData = new FormData();
                    detailFormData.append("mau_powerpoint_id", powerpointId);
                    detailFormData.append("duong_dan_anh", image);
                    detailFormData.append("thu_tu", i);
    
                    return axios.post("http://localhost:1000/maupowerpointanhchitiets", detailFormData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    }).then(detailResponse => {
                        console.log("Detail Image API Response:", detailResponse.data);
                        return detailResponse;
                    });
                });
    
                // Wait for all detail images to be uploaded
                await Promise.all(detailImagePromises).catch(error => {
                    console.error("Error uploading detail images:", error.response ? error.response.data : error.message);
                    throw new Error("Lỗi khi lưu ảnh chi tiết, nhưng PowerPoint đã được lưu.");
                });
            }
    
            // Step 4: Refresh PowerPoint list and show success message
            fetchPowerPoints();
            setDialogVisible(false);
            toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
                life: 3000
            });
        } catch (error) {
            console.error("Error saving data:", error.response ? error.response.data : error.message);
            toast.current.show({
                severity: "error",
                summary: "Lỗi",
                detail: error.response?.data?.error || error.message || "Không thể lưu dữ liệu",
                life: 3000
            });
        }
    };
    const handleDelete = (id) => {
        confirmDialog({
            message: "Bạn có chắc chắn muốn xóa mẫu PowerPoint này? (Các ảnh chi tiết cũng sẽ bị xóa)",
            header: "Xác nhận xóa",
            icon: "pi pi-exclamation-triangle",
            accept: async () => {
                try {
                    await axios.delete(`http://localhost:1000/maupowerpoints/${id}`);
                    fetchPowerPoints();
                    toast.current.show({
                        severity: "success",
                        summary: "Xóa thành công",
                        detail: "Mẫu PowerPoint và ảnh chi tiết đã được xóa",
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
        link.href = `http://localhost:1000${filePath}`;
        link.download = true;
        link.click();
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
                        <img src={powerpoint.duong_dan_anh_nho} alt={powerpoint.tieu_de} className="w-10 shadow-2"/>
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

    const onImageSelect = (e) => {
        const file = e.files[0];
        if (file) {
            setSelectedImage(file);
            setFormData({ ...formData, duong_dan_anh_nho: URL.createObjectURL(file) });
            if (fileUploadRef.current) {
                fileUploadRef.current.clear(); // Reset FileUpload to allow multiple selections
            }
        }
    };

    const onFileSelect = (e) => {
        const file = e.files[0];
        if (file) {
            setSelectedFile(file);
            setFormData({ ...formData, duong_dan_tap_tin: file.name });
            if (fileUploadRef.current) {
                fileUploadRef.current.clear(); // Reset FileUpload to allow multiple selections
            }
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
                            { label: "Tất cả bộ sưu tập", value: null },
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
            <Dialog 
                visible={dialogVisible} 
                onHide={() => setDialogVisible(false)} 
                header={isEditing ? "Chỉnh sửa mẫu PowerPoint" : "Thêm mới mẫu PowerPoint"} 
                className="w-10" 
                style={{ maxWidth: '800px' }} // Giới hạn chiều rộng tối đa
                footer={
                    <div className="text-center">
                        <Button 
                            label="Lưu" 
                            icon="pi pi-check" 
                            className="p-button-success" 
                            onClick={handleSave} 
                        />
                    </div>
                }
            >
                <div className="p-fluid p-3"> {/* Thêm padding tổng thể */}
                    <div className="grid">
                        {/* Cột trái */}
                        <div className="col-6">
                            <div className="field mb-4"> {/* Thêm khoảng cách giữa các field */}
                                <label htmlFor="tieu_de" className="font-bold block mb-2">Tiêu đề</label>
                                <InputText 
                                    id="tieu_de" 
                                    value={formData.tieu_de} 
                                    onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })} 
                                    placeholder="Nhập tiêu đề" 
                                    className="w-full" 
                                />
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="mo_ta" className="font-bold block mb-2">Mô tả</label>
                                <InputText 
                                    id="mo_ta" 
                                    value={formData.mo_ta} 
                                    onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} 
                                    placeholder="Nhập mô tả" 
                                    className="w-full" 
                                />
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="danh_muc_id" className="font-bold block mb-2">Danh mục</label>
                                <Dropdown 
                                    id="danh_muc_id" 
                                    value={formData.danh_muc_id} 
                                    options={categories.map(cat => ({ label: cat.ten, value: cat.id }))} 
                                    onChange={(e) => setFormData({ ...formData, danh_muc_id: e.value })} 
                                    placeholder="Chọn danh mục" 
                                    className="w-full" 
                                />
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="col-6">
                            <div className="field mb-4">
                                <label className="font-bold block mb-2">Ảnh chủ đề</label>
                                {formData.duong_dan_anh_nho && (
                                    <img 
                                        src={formData.duong_dan_anh_nho} 
                                        alt="Ảnh xem trước" 
                                        className="mt-2 border-round-lg shadow-2" 
                                        style={{ width: '100%', maxWidth: '200px', height: 'auto' }} 
                                    />
                                )}
                                <FileUpload 
                                    ref={fileUploadRef} 
                                    mode="basic" 
                                    accept="image/*" 
                                    customUpload 
                                    auto 
                                    chooseLabel="Chọn ảnh chủ đề" 
                                    onSelect={onImageSelect} 
                                    className="mt-2" 
                                />
                            </div>

                            <div className="field mb-4">
                                <label className="font-bold block mb-2">Tập tin PowerPoint</label>
                                <FileUpload 
                                    ref={fileUploadRef} 
                                    mode="basic" 
                                    accept=".ppt,.pptx" 
                                    customUpload 
                                    auto 
                                    chooseLabel="Chọn file PowerPoint" 
                                    onSelect={onFileSelect} 
                                />
                                {formData.duong_dan_tap_tin && (
                                    <p className="mt-2 text-green-600 font-medium">{formData.duong_dan_tap_tin}</p>
                                )}
                            </div>
                        </div>

                        {/* Phần ảnh chi tiết */}
                        <div className="col-12">
                            <div className="field mb-4">
                                <label className="font-bold block mb-2">Ảnh chi tiết</label>
                                <FileUpload 
                                    ref={detailFileUploadRef} 
                                    mode="basic" 
                                    accept="image/*" 
                                    multiple 
                                    customUpload 
                                    auto 
                                    chooseLabel="Chọn ảnh chi tiết" 
                                    onSelect={handleDetailImageSelect} 
                                />
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {detailImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className="flex flex-column align-items-center" 
                                            style={{ width: '18%' }}
                                        >
                                            <img 
                                                src={`http://localhost:1000${img.duong_dan_anh}`} 
                                                alt="Detail" 
                                                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }} 
                                            />
                                            <Button 
                                                icon="pi pi-trash" 
                                                className="p-button-danger p-button-sm mt-1" 
                                                onClick={() => removeDetailImage(index, true)} 
                                            />
                                        </div>
                                    ))}
                                    {newDetailImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className="flex flex-column align-items-center" 
                                            style={{ width: '18%' }}
                                        >
                                            <img 
                                                src={URL.createObjectURL(img)} 
                                                alt="New Detail" 
                                                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }} 
                                            />
                                            <Button 
                                                icon="pi pi-trash" 
                                                className="p-button-danger p-button-sm mt-1" 
                                                onClick={() => removeDetailImage(index)} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}