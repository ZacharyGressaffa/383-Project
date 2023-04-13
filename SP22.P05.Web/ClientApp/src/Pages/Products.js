import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KwentinProducts.css";
import { Button } from 'react-bootstrap'
import { BsFillCartFill } from "react-icons/bs";
import Cart from './Cart';
import ProductCard from "../Components/ProductCard";
import BackToTop from "../Components/BackToTop";

function Products() {
    const [data, setData] = useState([]);
    //const [cartData, setCartData] = useState([]);
    const [prodId, setProdId] = useState([]);
    const [checkout, setCheckout] = useState({ trigger: 'false' });

    const handleClick = data => {
        setProdId([...prodId, data])
    }

    const handleCartBut = () => {
        
        setCheckout('true')
        
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios("/api/products");
            setData(result.data);
        };
        getData();
    }, []);

    return (
        <div className='cont'>
            <div className="roww">
                <h1 className='label'>Software:</h1>
                <div className='button'><BsFillCartFill size={70} className='thebut' type='button' onClick={() => handleCartBut()} /></div>
                <Cart trigger={checkout} setTrigger={setCheckout} prodId={prodId} setProdId={setProdId} />
                <div className='row'>
                    <h3 className='tagger'>Developer Tools</h3>
                    <div className='rows'>

                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Software' && item.genre === 'Developer Tools') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''
                                )
                            })
                        }

                    </div>
                    <h3 className='tagger'>Finance</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Software' && item.genre === 'Finance') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                    <h3 className='tagger'>Music</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Software' && item.genre === 'Music') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                    <h3 className='tagger'>Productivity</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Software' && item.genre === 'Productivity') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                </div>


                <h1 className='label'>Games:</h1>
                <div className='filler'><BsFillCartFill size={70}/></div>
                <div className='row'>
                    <h3 className='tagger'>Action</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Game' && item.genre === 'Action') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                    <h3 className='tagger'>FPS</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Game' && item.genre === 'FPS') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                    <h3 className='tagger'>Strategy</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Game' && item.genre === 'Strategy') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                    <h3 className='tagger'>Role-Playing</h3>
                    <div className='rows'>
                        {
                            data.map && data.map((item, idx) => {
                                return (
                                    (item.tag === 'Game' && item.genre === 'Role-Playing') ? (
                                        <div className='cardies' key={item.id}>
                                            <ProductCard
                                                key={(item.id, item.title, item.description, item.price)}
                                                title={item.name}
                                                image={item.imageURL}
                                                price={item.price}
                                            />
                                            <Button onClick={() => handleClick(item.id)} className="card-btn">Add to Cart</Button>
                                        </div>
                                    ) : ''

                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <BackToTop />
        </div>
    );
}

export default Products;