import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./dev_login.css";
import { useNavigate } from "react-router-dom";


function ProductsAdd() {
    const nav = useNavigate();
    const [data, setData] = useState({ tag: '', genre: '', url: '' })
    const [image, setImage] = useState("");

    const Delay = () => {
        axios.get("./api/authentication/me")
            .then(res => {
                Add(res.data.id)
            })
    }



    const Add = (id) => {
        console.log(data);
        axios.post(`api/publisher/products/${id}/add`, {
            //PublisherID
            Name: data.name,
            Description: data.description,
            Price: data.price,
            Tag: data.tag,
            Genre: data.genre,
            ImageURL: data.url
        })
            .then(function (response) {
                console.log(response)
                setData({
                    ...data,
                    user: '',
                })
            })
            .then(() => {
                nav("/editproduct");
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    const uploadImage = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "zxlgrbce");
        await axios.post(
            "https://api.cloudinary.com/v1_1/dykljnsoi/image/upload", formData
        ).then(async (response) => {
            const imgurl = await response.data.secure_url;
            setData({ ...data, url: imgurl });
        });
    };



    useEffect(() => {
        Delay();
        //eslint-disable-next-line
    }, [data.url]);


    return (
        <body className='body__login'>
            <div className='container__login'>
                <form className='form' onSubmit={uploadImage}>
                    <h1 className='form__title'>Add Products</h1>
                    {image &&
                        <img src={URL.createObjectURL(image)} alt="loading" style={{ height: 200, width: 300 }} />
                    }
                    <input
                        type="file"
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                        }} />
                    <div className='form__input-group'>
                        <input
                            type="text"
                            className="form__input"
                            placeholder="Name"
                            onChange={e => setData({ ...data, name: e.target.value })} value={data.name}
                        />
                    </div>
                    <div className='form__input-group'>
                        <input
                            type="number"
                            className="form__input"
                            placeholder="Price"
                            onChange={e => setData({ ...data, price: e.target.value })} value={data.price}
                        />
                    </div>
                    <div className='form__input-group'>
                        <input
                            type="text"
                            className="form__input"
                            placeholder="Description"
                            onChange={e => setData({ ...data, description: e.target.value })} value={data.description}
                        />
                    </div>
                    <div className='form__input-group'>
                        <label >Game</label>
                        <input type="radio" checked={data.tag === "Game"} value="Game"
                            onChange={(e) => setData({ ...data, tag: e.target.value })}
                        />
                        <label >Software</label>
                        <input type="radio" checked={data.tag === "Software"} value="Software"
                            onChange={(e) => setData({ ...data, tag: e.target.value })}
                        />

                        <h1>{data.genre}</h1>
                    </div>
                    {data.tag === "Game" && (
                        <div>
                            <select name="gameList" id="gameList" onChange={(e) => setData({ ...data, genre: e.target.value })}>
                                <option >Select a genre</option>
                                <option value="Action">Action</option>
                                <option value="FPS">FPS</option>
                                <option value="Strategy">Strategy</option>
                                <option value="Role-Playing">Role-Playing</option>
                            </select>
                        </div>
                    )}
                    {data.tag === "Software" && (
                        <div>
                            <select name="softwareList" id="softwareList" onChange={(e) => setData({ ...data, genre: e.target.value })}>
                                <option >Select a genre</option>
                                <option value="Music">Music</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Finance">Finance</option>
                                <option value="Developer Tools">Developer Tools</option>
                            </select>
                        </div>
                    )}
                    <button className='form__button' type='submit'>Add Product</button>
                </form>
            </div>
        </body>
    )
}

export default ProductsAdd;