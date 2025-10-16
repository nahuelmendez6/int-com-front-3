import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // opcional, solo si usas componentes JS como modal, dropdown
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  </StrictMode>,
)
