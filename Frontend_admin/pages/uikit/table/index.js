import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const TableDemo = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:1000/danhmucs", {
                    method: "GET",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Dữ liệu danh mục:", data);

                if (Array.isArray(data)) {
                    setDanhMucs(data);
                } else {
                    console.error("Dữ liệu không đúng định dạng:", data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ Hàm render header với nút "Thêm"
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Tìm kiếm..."
                    />
                </span>
                <Button
                    label="Thêm"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() => alert("Thêm danh mục!")}
                />
            </div>
        );
    };

    // ✅ Hàm render cột "Hành động" với nút "Sửa" & "Xoá"
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-warning"
                    onClick={() => alert(`Sửa danh mục: ${rowData.ten}`)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => alert(`Xoá danh mục: ${rowData.ten}`)}
                />
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Danh mục</h5>
                    <DataTable
                        value={danhMucs}
                        paginator
                        rows={10}
                        loading={loading}
                        emptyMessage="Không có danh mục nào."
                        globalFilter={globalFilter}
                        header={renderHeader()}
                    >
                        <Column field="id" header="ID" sortable style={{ minWidth: "5rem" }} />
                        <Column field="ten" header="Tên danh mục" sortable style={{ minWidth: "12rem" }} />
                        <Column field="mo_ta" header="Mô tả" sortable style={{ minWidth: "16rem" }} />
                        <Column body={actionBodyTemplate} header="Hành động" style={{ minWidth: "10rem" }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
