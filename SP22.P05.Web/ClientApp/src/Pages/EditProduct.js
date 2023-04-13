import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Components/Popup';
import 'bootstrap/dist/css/bootstrap.min.css'
import './editproduct.css'
import { Card, Button } from 'react-bootstrap'


function EditProduct(props) {

    const [data, setData] = useState([]);
    const [inactive, setInactive] = useState([]);
    const [ID, setID] = useState([])
    const [poppy, setPoppy] = useState({ trigger: 'false' })

    useEffect(() => {
        const getId = () => {
            axios.get("./api/authentication/me")
            .then(res => {
                getData(res.data.id)
                getInactive(res.data.id)
            })
        }

        const getData = (id) => {
            setPoppy({trigger: 'false'})
            axios.get(`api/publisher/products/${id}/all`)
                .then(res => {
                    setData(res.data)
                })
        }
        getId();

        const getInactive = (id) => {
            axios.get(`api/publisher/products/${id}/inactive`)
            .then(res=>{
                setInactive(res.data)
            })
        }
    }, []);

    const edit = identify => {
        setPoppy(true)
        setID(identify)
    }

    const Delete = (id, prodId) => {
        axios.delete(`api/publisher/products/disable/${prodId}/${id}`)
            .then(function (response) {
                window.location.reload();
            })
    }

    const Enable = (id, prodId) => {
        axios.post(`api/publisher/products/enable/${prodId}/${id}`)
            .then(function (response) {
                window.location.reload();
            })
    }

    const Del = id => {
        axios.get("./api/authentication/me")
            .then(res => {
                Delete(id, res.data.id)
            })
    }

    const Create = id => {
        axios.get("./api/authentication/me")
            .then(res => {
                Enable(id, res.data.id)
            })
    }

    return (
        <div className='cont'>
            <div className='roww'>
                <h1 className="label">Enabled</h1>
                <div className='rows'>
                    {
                    data.map && data.map((item, idx) => {
                        return (
                            <div key={item.id}>
                        
                                <Card key={item.id} style={{ width: '18rem' }}>
                                    <Popup key={item.id} id={ID} trigger={poppy} setTrigger={setPoppy}></Popup>
                                    <Card.Body key={item.id}>
                                        <Card.Img className='img' key={item.id} variant='top' src={item.imageURL} />
                                        <Card.Title key={item.id}>{item.name}</Card.Title>
                                        <Card.Text key={item.id}>{item.description}</Card.Text>
                                        <Card.Text key={item.id}>${item.price}</Card.Text>
                                        <Button key={item.id} onClick={() => edit(item.id)} variant="primary">Update</Button>
                                        <Button key={item.id} onClick={() => Del(item.id)} variant="primary">Disable</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                    }
                </div>
                <h1 className="label">Disabled</h1>
                <div className='rows'>
                    {
                    inactive.map && inactive.map((item, idx) => {
                        return (
                            <div key={item.id}>
                        
                                <Card key={item.id} style={{ width: '18rem' }}>
                                    <Card.Body key={item.id}>
                                        <Card.Img className='img' key={item.id} variant='top' src={item.imageURL} />
                                        <Card.Title key={item.id}>{item.name}</Card.Title>
                                        <Card.Text key={item.id}>{item.description}</Card.Text>
                                        <Card.Text key={item.id}>${item.price}</Card.Text>
                                        <Button key={item.id} onClick={() => Create(item.id)} variant="primary">Enable</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    );
}

export default EditProduct;
