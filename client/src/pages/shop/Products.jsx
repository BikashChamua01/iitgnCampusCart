import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from "../../store/product-slice";
import ProductCard from "../../components/shop/ProductCard";


const ShopProducts = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const {products} = useSelector((state)=>state.shopProducts)
  console.log(products)
  
  return <>
    <div>All the products are..
      <div>
        {products.map((product)=>
        {
          return <ProductCard product ={product} key = {product._id}/>
        })}
      </div>
    </div>
  </>;
};

export default ShopProducts;
