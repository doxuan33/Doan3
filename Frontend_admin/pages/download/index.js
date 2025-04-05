import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { format } from "date-fns"; // Định dạng ngày tháng

const Download = () => {
    const [downloads, setDownloads] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nguoi_dung_id: "", mau_powerpoint_id: "" });
    const toast = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:1000/lichsutaixuongs");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setDownloads(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // Mở Dialog để thêm mới
    const handleAdd = () => {
        setFormData({ nguoi_dung_id: "", mau_powerpoint_id: "" });
        setIsEditing(false);
        setDialogVisible(true);
    };

    // Mở Dialog để chỉnh sửa
    const handleEdit = (rowData) => {
        setFormData({ id: rowData.id, nguoi_dung_id: rowData.nguoi_dung_id, mau_powerpoint_id: rowData.mau_powerpoint_id });
        setIsEditing(true);
        setDialogVisible(true);
    };

    // Gửi dữ liệu lên API để thêm hoặc sửa
    const handleSave = async () => {
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:1000/lichsutaixuongs/${formData.id}`
                : "http://localhost:1000/lichsutaixuongs";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Lỗi khi lưu dữ liệu");

            toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!",
                life: 3000,
            });

            fetchData();
            setDialogVisible(false);
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
        }
    };

    // Xóa lịch sử tải xuống
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            try {
                const response = await fetch(`http://localhost:1000/lichsutaixuongs/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Lỗi khi xóa dữ liệu");

                toast.current.show({
                    severity: "warn",
                    summary: "Đã xóa",
                    detail: "Xóa lịch sử tải xuống thành công!",
                    life: 3000,
                });

                fetchData();
            } catch (error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
            }
        }
    };

    // Header của bảng
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
                </span>
                <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={handleAdd} />
            </div>
        );
    };

    // Cột "Hành động"
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => handleEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
            </div>
        );
    };

    // Hiển thị ngày tháng đúng định dạng
    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Lịch sử tải xuống</h5>
                    <DataTable
                        value={downloads}
                        paginator
                        rows={10}
                        loading={loading}
                        emptyMessage="Không có dữ liệu."
                        globalFilter={globalFilter}
                        header={renderHeader()}
                    >
                        <Column 
                            header="STT" 
                            body={(rowData, { rowIndex }) => rowIndex + 1} style={{ width: "4rem", textAlign: "center" }} 
                        />
                        <Column field="nguoi_dung_id" header="ID Người Dùng" sortable style={{ minWidth: "10rem" }} />
                        <Column field="mau_powerpoint_id" header="ID PowerPoint" sortable style={{ minWidth: "10rem" }} />
                        <Column field="thoi_gian_tai" header="Thời Gian" body={(rowData) => formatDate(rowData.thoi_gian_tai)} sortable style={{ minWidth: "14rem" }} />
                        <Column body={actionBodyTemplate} header="Hành động" style={{ minWidth: "10rem" }} />
                    </DataTable>
                </div>
            </div>

            {/* Dialog Thêm/Sửa */}
            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header={isEditing ? "Chỉnh sửa" : "Thêm mới"} className="w-6">
                <div className="grid p-fluid">
                    <div className="col-12">
                        <label htmlFor="nguoi_dung_id">ID Người Dùng</label>
                        <InputText
                            id="nguoi_dung_id"
                            value={formData.nguoi_dung_id}
                            onChange={(e) => setFormData({ ...formData, nguoi_dung_id: e.target.value })}
                        />

                        <label htmlFor="mau_powerpoint_id">ID PowerPoint</label>
                        <InputText
                            id="mau_powerpoint_id"
                            value={formData.mau_powerpoint_id}
                            onChange={(e) => setFormData({ ...formData, mau_powerpoint_id: e.target.value })}
                        />
                    </div>

                    <div className="col-12 text-center mt-3">
                        <Button label="Lưu" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Download;
