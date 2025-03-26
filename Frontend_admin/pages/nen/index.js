import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';

export default function Danhmuc() {
    const [layout, setLayout] = useState('grid');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);

    const categories = [
        { img: "https://antimatter.vn/wp-content/uploads/2022/08/hinh-nen-bien.jpg", title: "Biển cả", free: true, rating: 4.5 },
        { img: "https://png.pngtree.com/background/20230427/original/pngtree-landscape-winter-snow-covered-japanese-village-with-a-bridge-covered-in-picture-image_2497611.jpg", title: "Mùa đông", free: true, rating: 4 },
        { img: "https://image.tienphong.vn/600x315/Uploaded/2023/rwbvhvobvvimsb/2021_09_06/6-nhom-trai-cay-de-an-buoi-sang-5711.jpg", title: "Hoa quả", free: false, rating: 5 },
        { img: "https://khoinguonsangtao.vn/wp-content/uploads/2022/09/hinh-nen-cay-xanh-4k-cho-may-tinh.jpg", title: "Khu rừng", free: true, rating: 3.5 },
        { img: "https://img4.thuthuatphanmem.vn/uploads/2020/06/22/anh-nen-anime-2k_092516251.jpg", title: "Bầu trời", free: false, rating: 5 },
        { img: "https://mega.com.vn/media/news/2707_nen-background-pp-chu-de-hoc-tap7.jpg", title: "Học tập", free: false, rating: 4.2 },
        { img: "https://png.pngtree.com/thumb_back/fh260/background/20240909/pngtree-chinese-new-year-red-background-with-hanging-lanterns-image_16133909.jpg", title: "Ngày lễ", free: false, rating: 5 },
        { img: "https://png.pngtree.com/thumb_back/fh260/background/20241231/pngtree-ancestor-worship-tomb-sweeping-day-image_16531970.jpg", title: "Khám phá", free: false, rating: 4.2 },
    ];

    const sortOptions = [
        { label: 'Giáo dục', value: '!rating' },
        { label: 'Tiếp thị', value: '!rating' },
        { label: 'Kinh doanh', value: '!rating' },
        { label: 'Kế hoạch', value: 'rating' }
    ];

    const onFilter = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const onSortChange = (event) => {
        const value = event.value;
        setSortKey(value);
        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Danh mục" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Nhập tìm kiếm.." />
            </span>
            <Button label="Thêm" icon="pi pi-plus" className="p-button-success" />
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const itemTemplate = (category, layout) => {
        if (!category) return;
        
        if (layout === 'list') {
            return (
                <div className="col-12">
                    <div className="flex flex-column md:flex-row align-items-center p-3 border-1 surface-border">
                        <img src={category.img} alt={category.title} className="w-10rem shadow-2 mr-5" />
                        <div className="flex-1">
                            <h5 className="font-bold">{category.title}</h5>
                            <Rating value={category.rating} readOnly cancel={false} />
                            {category.free && <span className="badge-free ml-2">Miễn phí</span>}
                        </div>
                        <div className="flex gap-2">
                            <Button label="Sửa" icon="pi pi-pencil" className="p-button-warning p-button-sm" />
                            <Button label="Xóa" icon="pi pi-trash" className="p-button-danger p-button-sm" />
                            <Button label="Download" icon="pi pi-download" className="p-button-outlined p-button-sm" />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="col-12 md:col-4">
                    <div className="card border-1 surface-border p-3 text-center">
                        <img src={category.img} alt={category.title} className="w-full shadow-2" height={200}/>
                        <h5 className="mt-3 font-bold">{category.title}</h5>
                        <Rating value={category.rating} readOnly cancel={false} />
                        {category.free && <span className="badge-free">Miễn phí</span>}
                        <div className="flex justify-content-center gap-2 mt-2">
                            <Button icon="pi pi-pencil" className="p-button-warning p-button-sm" />
                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm" />
                            <Button icon="pi pi-download" className="p-button-outlined p-button-sm" />
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="card">
            <h4>Danh mục - Hình nền</h4>
            <DataView 
                value={categories} 
                layout={layout} 
                paginator 
                rows={6} 
                sortOrder={sortOrder} 
                sortField={sortField} 
                itemTemplate={itemTemplate} 
                header={dataViewHeader} 
            />
        </div>
    );
}
