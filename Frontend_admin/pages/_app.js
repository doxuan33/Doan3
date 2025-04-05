import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter(); // Cần khai báo router trước khi dùng

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Nếu chưa có token và không phải trang đăng nhập thì chuyển hướng
        if (!token && router.pathname !== '/auth/login') {
            router.push('/auth/login');
        }
    }, [router]); // Sửa từ `router.pathname` thành `router` để tránh lỗi 

    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}
