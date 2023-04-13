import React, { useState } from 'react';
import axios from 'axios';
import './Popup.css';

function Popup(props) {
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const update = (idr) => {
        axios.put(`api/publisher/products/update/${idr}/${props.id}`, {
            name: data.name,
            description: data.description,
            price: data.price,
            tag: data.tag,
            genre: data.genre,
            imageURL: data.url
        })
            .then(function (response) {
                window.location.reload();
            })
    }

    const handleSubmit = e => {
        e.preventDefault();
        submit2();
    }

    const submit2 = () => {
        axios.get("./api/authentication/me")
            .then(res => {
                update(res.data.id)
            })
    }

    const button = e => {
        axios.get(`/api/products/${props.id}`)
            .then(res => {
                setTitle(res.data.name)
                setDesc(res.data.description)
                setPrice(res.data.price)
                setData(res.data)
            })
    }

    return (props.trigger === true) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <form className='form' onSubmit={handleSubmit}>
                    <h1 className='mid'>Edit</h1>
                    {image &&
                        <img src={URL.createObjectURL(image)} alt="loading" style={{ height: 200, width: 300 }} />
                    }
                    <input
                        type="file"
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                        }} />
                    <div className='form__input-group'>
                        <text>Title</text>
                        <input
                            type="text"
                            className="form__input"
                            autofocus
                            placeholder={title}
                            onChange={e => setData({ ...data, name: e.target.value })} value={data.name}
                        />
                    </div>
                    <div className='form__input-group'>
                        <text>Description</text>
                        <input
                            type="text"
                            className="form__input"
                            placeholder={desc}
                            onChange={e => setData({ ...data, description: e.target.value })} value={data.description}
                        />
                    </div>
                    <div className='form__input-group'>
                        <text>Price</text>
                        <input
                            type="number"
                            className="form__input"
                            placeholder={price}
                            onChange={e => setData({ ...data, price: e.target.value })} value={data.price}
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
                    <button type='submit'>Update</button>
                    <button type='button' onClick={e => button()}>Use Existing Info</button>
                </form>
                <button onClick={() => props.setTrigger(false)} className='btn'>close</button>
            </div>
        </div>
    ) : '';
}

export default Popup;