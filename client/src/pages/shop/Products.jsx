// import React from "react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchAllProducts } from "../../store/product-slice";
// import ProductCard from "../../components/shop/ProductCard";


// const ShopProducts = () => {
//   const dispatch = useDispatch()
//   useEffect(() => {
//     dispatch(fetchAllProducts())
//   }, [dispatch])

//   const {products} = useSelector((state)=>state.shopProducts)
//   console.log(products)
  
//   return <>
//     <div>All the products are..
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product)=>
//         {
//           return <ProductCard product ={product} key = {product._id}/>
//         })}
//       </div>
//     </div>
//   </>;
// };

// export default ShopProducts;





// src/pages/ProductList.jsx
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from "../../store/product-slice";
import ProductCard from "../../components/shop/ProductCard";
import { motion } from "framer-motion";

const ShopProducts = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const {products} = useSelector((state)=>state.shopProducts)
  console.log(products)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-cream-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#6a0dad] text-center mb-10">
          Explore All Products
        </h1>

        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {products.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopProducts;
