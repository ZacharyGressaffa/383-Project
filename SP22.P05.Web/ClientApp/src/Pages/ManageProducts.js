import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import './editproduct.css'
import { Row, Container, Col, Button } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";


function ManageProducts() {
    const [data, setData] = useState([]);

    const dataSet = (id) => {
        axios.get(`api/user/products/${id}/active`)
            .then(res => {
                setData(res.data)
            })
    }

    useEffect(() => {
        axios.get("./api/authentication/me")
            .then(res => {
                dataSet(res.data.id)
            })
    }, []);

    const Del = id => {
        axios.get("./api/authentication/me")
            .then(res => {
                KISS(id, res.data.id)
            })
    }

    const KISS = (prodId, userId) => {
        axios.delete(`api/user/products/disable/${userId}/${prodId}`)
            .then(res =>  {
                check()
            })
    }

    const check = () => {
        axios.get("./api/authentication/me")
            .then(res => {
                dataSet(res.data.id)
            })
    }

    return (
        <div className='cont'>
            <Container className='roww'>
                <Row>
                    <h1 className='label'>Your Software</h1>
                    {data.map &&
                        data.map((item, idx) => {
                            return (
                                (item.tag === 'Software') ? (
                                    <Col key={item.id}>
                                        <ProductCard
                                            key={(item.id, item.title, item.description, item.price)}
                                            title={item.name}
                                            image={item.imageURL}
                                            price={item.price}
                                        />
                                        <Button variant='danger' onClick={() => Del(item.id)}>Uninstall</Button>
                                    </Col>
                                ) : ''
                            );
                        })}
                    <Col></Col>
                    <h1 className='label'>Your Games</h1>
                    {data.map &&
                        data.map((item, idx) => {
                            return (
                                (item.tag === 'Game') ? (
                                    <Col key={item.id}>
                                        <ProductCard
                                            key={(item.id, item.title, item.description, item.price)}
                                            title={item.name}
                                            image={item.imageURL}
                                            price={item.price}
                                        />
                                        <Button variant='danger' onClick={() => Del(item.id)}>Uninstall</Button>
                                    </Col>
                                ) : ''
                            );
                        })}
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

export default ManageProducts;