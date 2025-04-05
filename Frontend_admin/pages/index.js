import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const [topDownloads, setTopDownloads] = useState([]);
    const [topImages, setTopImages] = useState([]);
    const [polarData, setPolarData] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);

    // State variables for totals
    const [totalDownloads, setTotalDownloads] = useState(0);
    const [totalPowerPoints, setTotalPowerPoints] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatNumber = (value) => {
        return value.toLocaleString('en-US');
    };

    // Fetch total downloads
    useEffect(() => {
        fetch("http://localhost:1000/lichsutaixuongs/total")
            .then((res) => res.json())
            .then((data) => setTotalDownloads(data))
            .catch((err) => console.error("Lỗi tải tổng lượt tải:", err));
    }, []);

    // Fetch total PowerPoints
    useEffect(() => {
        fetch("http://localhost:1000/maupowerpoints/total")
            .then((res) => res.json())
            .then((data) => setTotalPowerPoints(data))
            .catch((err) => console.error("Lỗi tải tổng mẫu PowerPoint:", err));
    }, []);

    // Fetch total users
    useEffect(() => {
        fetch("http://localhost:1000/nguoidungs/total")
            .then((res) => res.json())
            .then((data) => setTotalUsers(data))
            .catch((err) => console.error("Lỗi tải tổng người dùng:", err));
    }, []);

    // Fetch total reviews
    useEffect(() => {
        fetch("http://localhost:1000/danhgias/total")
            .then((res) => res.json())
            .then((data) => setTotalReviews(data))
            .catch((err) => console.error("Lỗi tải tổng đánh giá:", err));
    }, []);

    // Fetch top downloaded PowerPoints
    useEffect(() => {
        fetch("http://localhost:1000/maupowerpoints/top-downloads")
            .then((res) => res.json())
            .then((data) => {
                setTopDownloads(data);
                const labels = data.map(item => item.tieu_de);
                const downloadCounts = data.map(item => item.luot_tai);
                const backgroundColors = ['#42A5F5', '#66BB6A', '#FFA726'];
                setPolarData({
                    labels: labels,
                    datasets: [
                        {
                            data: downloadCounts,
                            backgroundColor: backgroundColors
                        }
                    ]
                });
            })
            .catch((err) => console.error("Lỗi tải dữ liệu PowerPoint:", err));
    }, []);

    // Fetch top downloaded images
    useEffect(() => {
        fetch("http://localhost:1000/hinhanhs/top-downloads")
            .then((res) => res.json())
            .then((data) => {
                const maxDownloads = Math.max(...data.map(item => item.luot_tai), 1);
                const imagesWithPercentage = data.map(item => ({
                    ...item,
                    percentage: Math.round((item.luot_tai / maxDownloads) * 100)
                }));
                setTopImages(imagesWithPercentage);
            })
            .catch((err) => console.error("Lỗi tải dữ liệu hình ảnh:", err));
    }, []);

    const [danhMucs, setDanhMucs] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:1000/danhmucs");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Dữ liệu danh mục:", data);
                setDanhMucs(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const progressBarColors = [
        'bg-orange-500',
        'bg-cyan-500',
        'bg-pink-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-teal-500'
    ];

    const textColors = [
        'text-orange-500',
        'text-cyan-500',
        'text-pink-500',
        'text-green-500',
        'text-purple-500',
        'text-teal-500'
    ];

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Số lượt tải</span>
                            <div className="text-900 font-medium text-xl">{formatNumber(totalDownloads)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-download" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">+2.569 </span>
                    <span className="text-500">lượt tải trong ngày</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Mẫu powerpoint</span>
                            <div className="text-900 font-medium text-xl">{formatNumber(totalPowerPoints)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-word" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">52+ </span>
                    <span className="text-500">Mẫu mới tải lên</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Người dùng</span>
                            <div className="text-900 font-medium text-xl">{formatNumber(totalUsers)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">+158 </span>
                    <span className="text-500">người dùng mới</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Đánh giá</span>
                            <div className="text-900 font-medium text-xl">{formatNumber(totalReviews)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">11.947 </span>
                    <span className="text-500">đánh giá 5*</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Hình ảnh tải nhiều</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu1.current.toggle(event)} />
                            <Menu
                                ref={menu1}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {topImages.length > 0 ? (
                            topImages.map((image, index) => (
                                <li key={image.id} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{image.tieu_de}</span>
                                        <div className="mt-1 text-600">lượt tải: {image.luot_tai || '0'}</div>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex align-items-center">
                                        <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                            <div className={`${progressBarColors[index % progressBarColors.length]} h-full`} style={{ width: `${image.percentage}%` }} />
                                        </div>
                                        <span className={`${textColors[index % textColors.length]} ml-3 font-medium`}>{image.percentage}%</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-600">Không có dữ liệu hình ảnh tải nhiều.</li>
                        )}
                    </ul>
                </div>
                <div className="card">
                    <h5>Danh mục</h5>
                    <DataTable 
                        value={danhMucs} 
                        paginator 
                        rows={8} 
                        loading={loading} 
                        emptyMessage="Không có danh mục nào."
                    >
                        <Column 
                            header="STT" 
                            body={(rowData, { rowIndex }) => rowIndex + 1} style={{ width: "4rem", textAlign: "center" }} 
                        />
                        <Column field="ten" header="Tên danh mục" sortable style={{ minWidth: '12rem' }} />
                        <Column field="mo_ta" header="Mô tả" sortable style={{ minWidth: '16rem' }} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Top 3 PowerPoint có lượt tải nhiều nhất</h5>
                    {polarData && <Chart type="polarArea" data={polarData} />}
                </div>

                <div className="card">
                    <div className="content-data">
                        <div className="chat-box">
                            <p className="day"><span>Hôm nay</span></p>
                            <div className="msg">
                                <img 
                                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                                    alt="User" 
                                />
                                <div className="chat">
                                    <div className="profile">
                                        <span className="username">Alan</span>
                                        <span className="time">18:30</span>
                                    </div>
                                    <p>Xin chào</p>
                                </div>
                            </div>
                            <div className="msg me">
                                <div className="chat">
                                    <div className="profile">
                                        <span className="time">18:30</span>
                                    </div>
                                    <p>Chúng tôi có thể giúp gì được cho bạn </p>
                                </div>
                            </div>
                            <div className="msg me">
                                <div className="chat">
                                    <div className="profile">
                                        <span className="time">18:30</span>
                                    </div>
                                    <p>Để biết thêm chi tiết hãy liên hệ với chúng tôi</p>
                                </div>
                            </div>
                            <div className="msg me">
                                <div className="chat">
                                    <div className="profile">
                                        <span className="time">18:30</span>
                                    </div>
                                    <p>Xin cảm ơn.</p>
                                </div>
                            </div>
                        </div>
                        <form action="#">
                            <div className="form-group flex">
                                <input type="text" placeholder="Type..." className="p-inputtext" />
                                <button type="submit" className="btn-send">
                                    <i className='pi pi-send'></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;