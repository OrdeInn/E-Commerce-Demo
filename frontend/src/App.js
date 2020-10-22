import React, {useState, useEffect} from 'react';
import Products from "./components/Products";
import Filter from "./components/Filter";
import Cart from "./components/Cart";
import Modal from "react-modal";
import Zoom from "react-reveal/Zoom";

function App() {

  const [products, setProducts] = useState([]);
  const [productsToPass, setProductsToPass] = useState(products);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const[order, setOrder] = useState();

  const [cartProducts, setCartProducts] = useState( localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [] ) ;
  const [numOfCartItems, setNumOfCartItems] = useState( localStorage.getItem("numberOfCartItems") ? JSON.parse(localStorage.getItem("numberOfCartItems")) : 0);

  useEffect(() => {
    fetch("/api/products")
    .then(res => res.json())
    .then(
        (result) => {
            setIsLoaded(true);
            setProducts(result);
            setProductsToPass(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);

        }
    )
  }, [])



  function filterProducts(event) {

    let allProducts = products.slice();

    if(event.target.value !== "ALL"){
      let size = event.target.value;
      console.log(size);

      let newProducts = allProducts.filter(product => product.availableSizes.indexOf(size) >= 0 );
      console.log(newProducts)
      setProductsToPass(newProducts);
    }else{
      setProductsToPass(allProducts);
    }
  }

  function sortProducts(event) {
    let sort = event.target.value;
    let sortedProducts = products.slice();
    sortedProducts.sort( (a,b) => {
      if(sort === "lowest"){
        if(a.price > b.price){ return 1; }
        else { return -1;}
      }
      else if(sort === "highest"){
        if(a.price < b.price) { return 1;}
        else { return -1;}
      }else{
        if(a._id < b._id){ return 1;}
        else{ return -1;}
      }
    })
    setProductsToPass(sortedProducts);    
  }



  function addToCart(product) {

    let alreadyExist = false;
    let copyCartProducts = cartProducts.slice();

    if(copyCartProducts.length > 0 ){
      copyCartProducts.forEach( cartProduct => {
        if(cartProduct._id === product._id){
          alreadyExist = true;
          cartProduct.count++;
        }
      })
    }

    if(!alreadyExist){

      copyCartProducts = [...copyCartProducts, {...product, count: 1}];
      setCartProducts(copyCartProducts);
    }

    setNumOfCartItems(numOfCartItems+1);
    localStorage.setItem("cartItems", JSON.stringify(copyCartProducts));
    localStorage.setItem("numberOfCartItems", numOfCartItems+1);
}

  function removeFromCart(item) {

    let copyCartProducts = cartProducts.slice();
    
    for(let i=0; i < cartProducts.length; i++){

      if(cartProducts[i]._id === item._id){
        if(copyCartProducts[i].count === 1){
          copyCartProducts.splice(i, 1);
          
        }else{
          copyCartProducts[i].count--;
        }
        break;
      }
    }
    console.log(copyCartProducts)
    setCartProducts(copyCartProducts);
    setNumOfCartItems(numOfCartItems-1)
    localStorage.setItem("cartItems", JSON.stringify(copyCartProducts));
    localStorage.setItem("numberOfCartItems", numOfCartItems-1);
  }


  function createOrder(order) {

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(order)
    }

    fetch("/api/orders", requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      localStorage.clear("cartItems");
      setOrder(data);
      setCartProducts([]);
    });
    
  }

  function closeOrderModal(){
    setOrder();
  }


  if(error){
    return (<div>Error: {error.message}</div>);
  }else if(!isLoaded) {
    return (<div>Loading...</div>);
  }else {
    return (
      <div className="grid-container">
        <header>
          <a href="/">Shopping Cart</a>
        </header>
        <main>
          <div className = "content">
            <div className="main">
              <Filter count={products && products.length} filterProduct = {filterProducts} sortProducts={sortProducts}/>
              <Products products={productsToPass} addToCart={addToCart}/>
            </div>
            <div className="sidebar">
              <Cart cartProducts = {cartProducts} numOfCartItems={numOfCartItems} removeFromCart={removeFromCart} createOrder={createOrder}/>
            </div>
          </div>
        </main>
        <footer>
          All Rights Reserved
        </footer>

        {/* Move this Modal to Cart component*/}
        {order && 
        <Modal isOpen={true} onRequestClose={closeOrderModal}>
          <Zoom>
          <button onClick={closeOrderModal} className="close-modal">X</button>
          <div className="order-details">
            <h3 className="success-message" >Successfully</h3>
            <h2>Order {order._id}</h2>
            <ul>
              <li>
                <div>Name:</div>
                <div>{order.name}</div>
              </li>
              <li>
                <div>Email:</div>
                <div>{order.email}</div>
              </li>
              <li>
                <div>Address:</div>
                <div>{order.address}</div>
              </li>
              <li>
                <div>Total:</div>
                <div>${order.total}</div>
              </li>
              <li>
                <div>Cart Items:</div>
                <div>{order.cartProducts.map( product => {
                  return(
                  <div>
                    {product.count} {" x "} {product.title}
                  </div>);
                })}</div>
              </li>
            </ul>
          </div>
          </Zoom>
        </Modal>}
      </div>
    );
  }
}

export default App;
