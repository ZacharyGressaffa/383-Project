import React from 'react'
import "./ItemCard.css";

function ItemCard( props) {
    return (
        <div className='card'>
        <div className='card_body'>
                <img className= 'img' src={props.img} alt=''/>
            <h2 className='card_title'>{props.name}</h2>
            <p className='card_desc'>{props.desc}</p>
        </div>
        <button className='btn'>View Item</button>
    </div>
    )
}

export default ItemCard;
/*
    Link to card I followed : https://www.youtube.com/watch?v=4KxHcbQ8GYQ
    CSS is in SCSS and not compatible with project... :-(
*/