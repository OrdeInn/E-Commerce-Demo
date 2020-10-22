import React, {useState} from "react"
import Fade from "react-reveal/Fade";

function Cart(props) {
    const cartProducts = props.cartProducts;
    const [showForm, setShowForm] = useState(false);
    const [order, setOrder] = useState({
        name: "",
        email: "",
        address: "",
    });

    function handleInput(event) {
        setOrder({...order, [event.target.name]: event.target.value});
    }

    function createOrder(event){
        let totalPrice = 0;
        cartProducts.forEach( product => {
            totalPrice += product.price * product.count;
        });

        const orderToSend = {
            ...order,
            total: totalPrice ,
            cartProducts: cartProducts 
        }
        event.preventDefault();
        props.createOrder(orderToSend);
        console.log(orderToSend);
    }
    
    return (

        <div>
        {cartProducts.length === 0 ? (<div className="cart cart-header">Your Cart is Empty</div>)
        : (<div className="cart cart-header">You have {props.numOfCartItems} items in your Cart.</div>)}

        <div className="cart">
            <Fade left cascade>
            <ul className="cart-items">
                {cartProducts.map( item => {
                    return (
                        <li key={item._id}>
                            <div className="cart-image">
                                <img src={item.image} alt={item.title}></img>
                            </div>
                            <div className="cart-item-description">
                                <div>{item.title}</div>
                                <div className="right">
                                    ${item.price} x {item.count} {"   "}
                                    <button className = "button" onClick={() => props.removeFromCart(item)}>
                                        Remove
                                    </button> 
                                </div>  
                            </div>
                        </li>
                    );
                })}
            </ul>
            </Fade>
        </div>

        {cartProducts.length !== 0 && (
            <div className="cart">
                <div className="total">
                    <div>
                        Total:{" "}
                        ${cartProducts.reduce((a,c) => a + c.price * c.count, 0)}
                    </div>
                    <button onClick={() => {
                        setShowForm(true);
                    }} className="button primary">Proceed</button>
                </div>
            </div>
        )}


        {showForm && (<div className="cart">
            
            <form>
            <Fade right cascade>
                <ul className="form-container">
                    <li>
                        <label>Email</label>
                        <input
                        name="email"
                        type="email"
                        required
                        onChange={handleInput}>
                        </input>
                    </li>
                    <li>
                        <label>Name</label>
                        <input
                        name="name"
                        type="text"
                        required
                        onChange={handleInput}>
                        </input>
                    </li>
                    <li>
                        <label>Address</label>
                        <input
                        name="address"
                        type="text"
                        required
                        onChange={handleInput}>
                        </input>
                    </li>
                    <li>
                        <button type="submit" className="button primary" onClick={createOrder}>CheckOut</button>
                    </li>
                </ul>
                </Fade>
            </form>
            
        </div>)}
        </div>
    )
}


export default Cart;