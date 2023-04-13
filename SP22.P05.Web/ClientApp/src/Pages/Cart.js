import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'
import './Cart.css';
import { useNavigate } from "react-router-dom";

function Cart(props) {
    const [data, setData] = useState([])
    const [userId, setUserId] = useState('2')
    const [cost, setCost] = useState(0)
    const [delay, setDelay] = useState('true')
    const nav = useNavigate();

    const checker = () => {
        axios.get("./api/authentication/me")
            .then(res => {
                if (res.status === 200) {
                    checkout()
                }
            })
            .catch(err => {
                console.log(err.response.status)
                if (err.response.status === 401) {
                    nav('/login')
                }
            })
    }

    const checkout = () => {
            axios.post(`api/user/products/checkout`, {
                products: props.prodId,
                userID: userId,
                disabled: 0
            })
                .then(e => {
                    nav("/manageproducts");
                })
                .catch(err => {
                    console.log(err.response)
                })
    }

    const remove = id => {
        for (var i = 0; i < props.prodId.length; i++) {
            if (props.prodId[i] === id) {
                props.prodId.splice(i, 1)
                //setTemp(temp => [...temp, props.prodId[i]])
            }
        }
        //props.setProdId(temp)
        //setTemp([])
        setData([])
        handleDelay()
    }

    const handleClose = () => {
        setDelay('true')
        props.setTrigger('false')
        setData([])
    }

    const handleList = datas => {
        setData(data => [...data, datas])
    }

    const addCost = datas => {
        setCost(cost => cost + datas)
    }

    const handleDelay = () => {
        setDelay('false')
        for (var i = 0; i < props.prodId.length; i++) {
            axios.get(`api/products/${props.prodId[i]}`)
                .then(res => {
                    handleList(res.data)
                    addCost(res.data.price)
                })
        }

    }

    useEffect(() => {
        axios.get("./api/authentication/me")
            .then(res => {
                setUserId(res.data.id)
            })

    }, [props.prodId]);

    return (props.trigger === 'true') ? (
        (delay === 'false') ? (
            <div className='cart'>
                <div className='cart-inner'>
                    <h1 className='h1'>Cart</h1>
                    {
                        data.map && data.map((item, idx) => {
                            return (
                                <div className="lineemup" key={item.id}>
                                    <div className='items'>
                                        <h2>{item.name}:</h2>
                                    </div>
                                    <div className='items'>
                                        <h3>${item.price}</h3>
                                    </div>
                                    <div className='buttons'>
                                        <Button onClick={() => remove(item.id)} variant='danger'>X</Button>
                                    </div>
                                </div>
                            )
                        })}
                    <div className="lineemup2">
                        <div className='items'>
                            <h2>Total:</h2>
                        </div>
                        <div className='items'>
                            <h3>${cost.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className='sbs'>
                        <Button variant='success'onClick={() => checker()} className='card-btn-scs'>Checkout</Button>
                        <Button onClick={() => handleClose()} className='card-btn-dngr'>close</Button>
                    </div>
                </div>
            </div>
        ) : (
                <div className='cart2'>
                    <div className='cart2-inner'>
                        <h3>Checkout or Remove your Items</h3>
                        <Button className='asdf' onClick={() => handleDelay() }>Okay!</Button>
                    </div>
                </div>
                )
    ) : '';
}
export default Cart;