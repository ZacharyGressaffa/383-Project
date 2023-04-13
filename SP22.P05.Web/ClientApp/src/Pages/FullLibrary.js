import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap'
import ProductCard from "../Components/ProductCard";
import './editproduct.css'

function FullLibrary() {
    const [data, setData] = useState([]);
    const [inactive, setInactive] = useState([]);

    const dataSet = (id) => {
        axios.get(`api/user/products/${id}/inactive`)
            .then(res => {
                setInactive(res.data)
            })
    }

    const activeSet = (id) => {
        axios.get(`api/user/products/${id}/active`)
            .then(res => {
                setData(res.data)
            })
    }

    const installHandle = prodId => {
        axios.get("./api/authentication/me")
            .then(res => {
                install(res.data.id, prodId)
            })
    }

    const uninstallHandle = prodId => {
        axios.get("./api/authentication/me")
            .then(res => {
                uninstall(res.data.id, prodId)
            })
    }

    const install = (id, prodId) => {
        axios.post(`api/user/products/enable/${id}/${prodId}`)
            .then(res => {
                check()
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    const uninstall = (id, prodId) => {
        console.log(id + ' ' + prodId)
        axios.delete(`api/user/products/disable/${id}/${prodId}`)
            .then(res => {
                check()
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    const check = () => {
        axios.get("./api/authentication/me")
            .then(res => {
                dataSet(res.data.id)
                activeSet(res.data.id)
            })
    }

    useEffect(() => {
        axios.get("./api/authentication/me")
            .then(res => {
                dataSet(res.data.id)
                activeSet(res.data.id)
            })
    }, []);

    return (
        <div className='cont'>
            <div className='roww'>
                <h1 className='label'>Uninstalled:</h1>
                <div className='rows'>
                    {
                        inactive.map && inactive.map((item, idx) => {
                            return (
                                <div className='spacer' key={item.id}>
                                    <ProductCard
                                        key={(item.id, item.title, item.description, item.price)}
                                        title={item.name}
                                        image={item.imageURL}
                                        price={item.price}
                                    />
                                    <Button onClick={() => installHandle(item.id)} className="r294" variant='success'>Re-Install</Button>
                                </div>

                            )
                        })
                    }
                </div>
                <h1 className='label'>Installed</h1>
                <div className='rows'>
                    {
                        data.map && data.map((item, idx) => {
                            return (
                                <div className='spacer' key={item.id}>
                                    <ProductCard
                                        key={(item.id, item.title, item.description, item.price)}
                                        title={item.name}
                                        image={item.imageURL}
                                        price={item.price}
                                    />
                                    <Button onClick={() => uninstallHandle(item.id)} className="r294" variant='success'>Uninstall</Button>
                                </div>

                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default FullLibrary;