import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <>
    <head>
        
		    <link rel="shortcut icon" href="/img/logo.png" type="image/x-icon"></link>
        <title>XPoint</title>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
        <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script>
        <script src="https://app.embed.im/whatsapp.js" data-phone="" data-theme="1" defer></script>
        
      </head>
    <div style={{"background-color":"#FFFFFF"}}>
        <BrowserRouter>
        <App />
      </BrowserRouter>,
      {/* document.getElementById('root') */}
  </div>
  </>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
