import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link} from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [count,setCount] = useState(0)
  const [itemsPerPage, setItemPerPage] = useState(10);
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const [currentPage, setCurrentPage] = useState();




useEffect(()=>{
    fetch("http://localhost:5000/productsCount")
    .then(res=> res.json())
    .then(data=>{
        console.log(data.count)
        setCount(data.count)
    })
},[])


  // methood-1
  // const pages =[]
  //     for(let i=0; i <numberOfPages ; i++){
  //       pages.push(i)
  //     }
  // total pages array methood two
  const pages = [...Array(numberOfPages).keys()];
  console.log(pages);
  //
  const handlePerChanges = (e)=>{
     setItemPerPage(parseInt(e.target.value))
            setCurrentPage(1)
     
  }

  const handlePrev=()=>{
   if(currentPage > 1){
    setCurrentPage(currentPage -1)
   }
  }
  const handleNext=()=>{
    if(currentPage <  numberOfPages){
        setCurrentPage(currentPage +1)
       }
  }
// 
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
//   

useEffect(() => {
    fetch(`http://localhost:5000/productsCount?page=${currentPage}&size=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) =>{
        setProducts(data.products)
        console.log(data)
      })
  }, [currentPage]);



  //

//   useEffect(() => {
//     const storedCart = getShoppingCart();
//     const savedCart = [];
//     // step 1: get id of the addedProduct
//     for (const id in storedCart) {
//       // step 2: get product from products state by using id
//       const addedProduct = products.find((product) => product._id === id);
//       if (addedProduct) {
//         // step 3: add quantity
//         const quantity = storedCart[id];
//         addedProduct.quantity = quantity;
//         // step 4: add the added product to the saved cart
//         savedCart.push(addedProduct);
//       }
//       // console.log('added Product', addedProduct)
//     }
//     // step 5: set the cart
//     setCart(savedCart);
//   }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      {/*  */}

      <div className="pagination">
        <p>{currentPage}</p>
          <button onClick={handlePrev}>Prev</button>
          {
            pages.map((i, index)=> <button key={index} onClick={()=>setCurrentPage(i+1)} >
                 {i+1}
            </button>)
          }
           <button onClick={handleNext}>Next</button>
        <select value={itemsPerPage} onChange={handlePerChanges} name="" id="">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
          </select>
      </div>
    </div>
  );
};

export default Shop;
