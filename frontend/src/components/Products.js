import React, {useState} from "react";
import Fade from "react-reveal/Fade";
import Modal from "react-modal";
import Zoom from "react-reveal/Zoom";

function Products(props) {

    const [modalProduct, setModalProduct] = useState(null);

    function openModal(product) {
        setModalProduct(product);
    }

    function closeModal() {
        setModalProduct(null);
    }

    


    return (
        <div>
            <Fade bottom cascade>
            <ul className="products">
                {!props.products ? <div>Loading...</div>
                :props.products.map(product => (
                    <li key={product._id}>
                        <div className="product">
                            <a href={"#" + product._id} onClick={() => openModal(product)}>
                                <img src = {product.image} alt={product.title}></img>
                                <p>{product.title}</p>
                            </a>
                            <div className="product-price">
                                <div>{product.price}</div>
                                <button className="button primary" onClick={() => {
                                    props.addToCart(product)}
                                    }>Add To Cart</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            </Fade>

            {modalProduct && 
            <Modal isOpen={true} onRequestClose={closeModal}>
                <Zoom>
                    <button onClick={closeModal} className="close-modal">X</button>
                    <div className="product-details">
                        <img src={modalProduct.image} alt={modalProduct.description}></img>
                        <div className="product-details-description">
                            <p>{modalProduct.title}</p>
                            <div>
                                <p className="modal-price">${modalProduct.price}</p>
                                <button className="button primary" onClick={() => {
                                    props.addToCart(modalProduct)}
                                    }>Add To Cart</button>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </Modal>}
        </div>
    );
}

export default Products;