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
    const { layoutConfig } = useContext(LayoutContext);

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

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const [danhMucs, setDanhMucs] = useState([]);
        const [globalFilter, setGlobalFilter] = useState('');
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch("http://localhost:3000/danhmucs");
                    
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
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Số lượt tải</span>
                            <div className="text-900 font-medium text-xl">547.687.495</div>
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
                            <div className="text-900 font-medium text-xl">274.685</div>
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
                            <div className="text-900 font-medium text-xl">28441</div>
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
                            <div className="text-900 font-medium text-xl">13.495 </div>
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
                    <h5>Danh mục</h5>
                    <DataTable 
                                            value={danhMucs} 
                                            paginator 
                                            rows={10} 
                                            loading={loading} 
                                            emptyMessage="Không có danh mục nào."
                                        >
                                            <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }} />
                                            <Column field="ten" header="Tên danh mục" sortable style={{ minWidth: '12rem' }} />
                                            <Column field="mo_ta" header="Mô tả" sortable style={{ minWidth: '16rem' }} />
                                        </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Best Selling Products</h5>
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
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                                <div className="mt-1 text-600">Clothing</div>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-orange-500 h-full" style={{ width: '50%' }} />
                                </div>
                                <span className="text-orange-500 ml-3 font-medium">%50</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                                <div className="mt-1 text-600">Accessories</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-cyan-500 h-full" style={{ width: '16%' }} />
                                </div>
                                <span className="text-cyan-500 ml-3 font-medium">%16</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                                <div className="mt-1 text-600">Accessories</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-pink-500 h-full" style={{ width: '67%' }} />
                                </div>
                                <span className="text-pink-500 ml-3 font-medium">%67</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                                <div className="mt-1 text-600">Office</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-green-500 h-full" style={{ width: '35%' }} />
                                </div>
                                <span className="text-green-500 ml-3 font-medium">%35</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                                <div className="mt-1 text-600">Accessories</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-purple-500 h-full" style={{ width: '75%' }} />
                                </div>
                                <span className="text-purple-500 ml-3 font-medium">%75</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                                <div className="mt-1 text-600">Clothing</div>
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '40%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%40</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
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
                                    <p>Chúng tôi cod thể giúp gì được cho bạn </p>
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
                <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{ borderRadius: '1rem', background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)' }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">TAKE THE NEXT STEP</div>
                        <div className="text-white font-medium text-5xl">Try PrimeBlocks</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="https://www.primefaces.org/primeblocks-react" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
