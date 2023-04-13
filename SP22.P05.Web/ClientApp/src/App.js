import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./Components/Navbar.css";
import BaseNavbar from './Components/NavBar/BaseNavbar'
import PublisherNavbar from './Components/NavBar/PublisherNavbar'
import UserNavbar from './Components/NavBar/UserNavbar'
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ManageProducts from "./Pages/ManageProducts";
import FullLibrary from "./Pages/FullLibrary";
import ProductList from "./Pages/Products";
import ProductsAdd from "./Pages/ProductsAdd";
import EditProduct from "./Pages/EditProduct";


function App() {
    const [login, setLogin] = useState(null);
    const [navSwitch, setNavSwitch] = useState()

  useEffect(() => {
      axios.get("./api/authentication/me")
          .then(res => { 
              if (res.status === 200) {
                  setLogin(true)
                  setNavSwitch(res.data.roles[0])
              } else {
                  setLogin(false)
              }
          })

  }, []);

  return (
      <div className='app'>
          {
              (!login) ? (
                  <BaseNavbar trigger={login} setTrigger={setLogin} />
              ) : (
                  (navSwitch === 'User') ? (<UserNavbar trigger={login} setTrigger={setLogin} />) : (<PublisherNavbar trigger={login} setTrigger={setLogin} />)
              )
          }
        {/* Pages Switch */}
          <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/ProductsAdd" element={<ProductsAdd />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/ManageProducts" element={<ManageProducts />} />
              <Route path="/FullLibrary" element={<FullLibrary />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/EditProduct" element={<EditProduct />} />
              <Route path="/Register" element={<Register />} />
          </Routes>
        </div>
  );
}

export default App;
