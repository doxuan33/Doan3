import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const TableDemo = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDanhMuc, setSelectedDanhMuc] = useState({ id: null, ten: "", mo_ta: "" });
    const [isEdit, setIsEdit] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    // 🔹 Load danh mục từ API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:1000/danhmucs");
            const data = await response.json();
            setDanhMucs(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
        setLoading(false);
    };

    // 🔹 Mở dialog (Thêm/Sửa)
    const openDialog = (danhMuc = { id: null, ten: "", mo_ta: "" }) => {
        setSelectedDanhMuc(danhMuc);
        setIsEdit(!!danhMuc.id);
        setDialogVisible(true);
    };

    // 🔹 Xử lý lưu danh mục (Thêm/Sửa)
    const saveDanhMuc = async () => {
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `http://localhost:1000/danhmucs/${selectedDanhMuc.id}` : "http://localhost:1000/danhmucs";
        
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedDanhMuc),
            });

            if (!response.ok) throw new Error("Lưu thất bại!");

            toast.current.show({ severity: "success", summary: "Thành công", detail: isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!", life: 3000 });
            fetchData();
            setDialogVisible(false);
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: error.message, life: 3000 });
        }
    };

    // 🔹 Xác nhận & Xóa danh mục
    const confirmDelete = (id) => {
        confirmDialog({
            message: "Bạn có chắc chắn muốn xóa danh mục này?",
            header: "Xác nhận xóa",
            icon: "pi pi-exclamation-triangle",
            accept: async () => {
                try {
                    const response = await fetch(`http://localhost:1000/danhmucs/${id}`, { 
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!response.ok) throw new Error("Xóa thất bại!");

                    toast.current.show({ severity: "warn", summary: "Đã xóa", detail: "Xóa thành công!", life: 3000 });

                    // ✅ Cập nhật danh sách sau khi xóa
                    setDanhMucs(prevDanhMucs => prevDanhMucs.filter(danhMuc => danhMuc.id !== id));
                } catch (error) {
                    toast.current.show({ severity: "error", summary: "Lỗi", detail: error.message, life: 3000 });
                }
            },
            reject: () => {
                toast.current.show({ severity: "info", summary: "Hủy", detail: "Hủy thao tác xóa", life: 3000 });
            }
        });
    };    

    // 🔹 Render header
    const renderHeader = () => (
        <div className="flex justify-content-between p-3" style={{ backgroundColor: "#EAF9F7", color: "#EAF9F7" }}>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
            <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={() => openDialog()} />
        </div>
    );
    // 🔹 Render nút hành động
    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-sm" onClick={() => openDialog(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => confirmDelete(rowData.id)} />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ConfirmDialog /> {/* ✅ Thêm ConfirmDialog */}
                    <h5 className="mb-3">Quản lý danh mục</h5>

                    <DataTable
                        value={danhMucs}
                        paginator rows={10}
                        loading={loading}
                        emptyMessage="Không có danh mục nào."
                        globalFilter={globalFilter}
                        header={renderHeader()}
                    >
                        {/* Cột Số thứ tự */}
                        <Column 
                            header="STT" 
                            body={(rowData, { rowIndex }) => rowIndex + 1} style={{ width: "4rem", textAlign: "center" }} 
                        />
                        <Column field="ten" header="Tên danh mục" sortable style={{ width: "12rem" }} />
                        <Column field="mo_ta" header="Mô tả" sortable style={{ width: "16rem" }} />
                        <Column body={actionBodyTemplate} header="Hành động" style={{ width: "10rem" }} />
                    </DataTable>
                    {/* 🔥 Dialog Thêm/Sửa danh mục */}
                    <Dialog header={isEdit ? "Sửa danh mục" : "Thêm danh mục"} visible={dialogVisible} onHide={() => setDialogVisible(false)} modal>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="ten">Tên danh mục</label>
                            <InputText id="ten" value={selectedDanhMuc.ten} onChange={(e) => setSelectedDanhMuc({ ...selectedDanhMuc, ten: e.target.value })} />
                            <label htmlFor="moTa">Mô tả</label>
                            <InputText id="moTa" value={selectedDanhMuc.mo_ta} onChange={(e) => setSelectedDanhMuc({ ...selectedDanhMuc, mo_ta: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <Button label="Hủy" className="p-button-secondary" onClick={() => setDialogVisible(false)} />
                            <Button label="Lưu" className="p-button-success" onClick={saveDanhMuc} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
