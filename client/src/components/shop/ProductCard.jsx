import { FaRupeeSign, FaStar, FaHeart, FaBan } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishlist, deleteFromWishlist } from "@/store/wishlist-slice";
import BuyRequestDialogBox from "./BuyRequestDialogBox";

const ProductCard = ({ product, isWishlisted }) => {
  const {
    _id,
    title,
    price,
    originalPrice,
    category,
    condition,
    images = [],
    rating = 0,
    numReviews = 0,
    soldOut,
    buyer,
  } = product;
  // console.log(buyer);

  const dispatch = useDispatch();
  const imageUrl = images[0]?.url || "/placeholder.png";

  const discount =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const getConditionStyles = (condition) => {
    switch (condition) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Like New":
        return "bg-indigo-100 text-indigo-700";
      case "Good":
        return "bg-green-100 text-green-700";
      case "Fair":
        return "bg-yellow-100 text-yellow-700";
      case "Poor":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      dispatch(deleteFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <div className="relative group block bg-white rounded-xl p-1 overflow-hidden w-full max-w-xs mx-auto transition-shadow duration-300 shadow hover:shadow-[0_4px_20px_0_rgba(138,43,226,0.4)]">
      {/* Watermark Overlay for Sold Out */}
      {soldOut && (
        <div className="absolute inset-0 z-30 bg-transparent flex items-center justify-center pointer-events-none">
          <span className="transform -rotate-45  w-full text-5xl font-extrabold text-red-900 opacity-50 flex justify-around items-center gap-2 ">
            SOLD OUT
            <FaBan className="mt-2 -mb-1" />
          </span>
          {/* <div> */}
          {/* {buyer && <p className="transform -rotate-45  w-full  font-extrabold text-red-900 opacity-50 flex justify-center items-center ">bought by {buyer.userName}</p>}
          {buyer && <p className="transform -rotate-45  w-full  font-extrabold text-red-900 opacity-50 flex justify-center items-center  "> {buyer.email}</p>} */}
          {/* </div> */}
        </div>
      )}

      {/* Card Content (Clicks Disabled if soldOut) */}
      <div className={soldOut ? "pointer-events-none" : ""}>
        <Link to={`/shop/products/${_id}`}>
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-101 rounded-xl"
            />
            {/* wishlist button */}
            <button
              onClick={handleWishlist}
              className="group absolute top-3 right-4 outline-none cursor-pointer z-10 bg-transparent border-none w-fit"
              aria-label="Toggle wishlist"
            >
              <FaHeart
                className={`heart-icon w-6 h-6 transition-all duration-300
                  ${
                    isWishlisted
                      ? "text-red-600 fancy-pop"
                      : "text-white not-wishlisted hover:text-red-100 heart-outline"
                  }`}
              />
            </button>

            {/* discount tag */}
            {discount && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
                -{discount}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-2 flex flex-col gap-1">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              {[...Array(5)]?.map((_, idx) => (
                <FaStar
                  key={idx}
                  className={idx < rating ? "" : "text-gray-300"}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
            </div>
            {/* <div className="flex items-center gap-1 text-yellow-500 text-sm">
               { buyer && <p>Buyer : <br/>{buyer.userName}<br/>{buyer.email}</p>}
           
            </div> */}
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
                {category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full ${getConditionStyles(
                  condition
                )}`}
              >
                {condition}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span className="text-lg font-bold text-[#6a0dad] flex items-center">
                <FaRupeeSign className="text-sm mr-1" />
                {price}
              </span>
              {originalPrice && (
                <span className="line-through text-gray-400 text-sm">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Buy Request Button */}
        <div className="flex gap-1 m-2">
          <BuyRequestDialogBox imageUrl={imageUrl} product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
