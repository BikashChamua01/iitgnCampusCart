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
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product)=>
        {
          return <ProductCard product ={product} key = {product._id}/>
        })}
      </div>
    </div>
  </>;
};

export default ShopProducts;
