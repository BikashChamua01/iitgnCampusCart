import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UnauthPage = () => {
  return (
    <div className=" md:min-h-screen flex flex-row flex-wrap-reverse justify-center">
      {/* Left: Content Section */}
      <div className="  md:h-screen flex flex-1/2 flex-col justify-center bg-[#fef3ff] py-10 md:px-20 text-[#2b2b2b] text-center h-fit">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-[#5b0d92]">CampusCart</span>
        </h1>
        <p className="md:mb-6 text-sm md:text-lg leading-relaxed">
          You are not the <span className="text-[#6a0dad]">Admin</span>
        </p>
        <Link
          to="/auth/login"
          className="bg-[#6a0dad] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a099a] transition duration-300 inline-block mt-4 mx-auto"
        >
          Login to Continue
        </Link>
      </div>
      {/* Right: Image on top in small, right in md+ */}
      <motion.div
  className="flex flex-1/2 items-center md:pt-0 pt-20 justify-center bg-[#f9f9f9] px-1 py-1 md:py-0"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <motion.img
    src="/images/unauth-hero-img.png"
    alt="Unauthorized Access"
    className="w-[60%] md:w-[90%] max-w-md h-auto drop-shadow-xl"
    animate={{
      y: [0, -10, 0], // move up then down
      scale: [1, 1.02, 1], // slight pulsing
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
  />
</motion.div>

    </div>
  );
};

export default UnauthPage;
