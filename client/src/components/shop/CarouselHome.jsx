import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import banner1 from "../../assets/baner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";

const banners = [
  {
    id: 1,
    imageUrl: banner1,
    heading: "Welcome to CampusCart",
    subheading: "All your campus essentials, all in one place",
  },
  {
    id: 2,
    imageUrl: banner2,
    heading: "Shop, Sell, Save",
    subheading: "Great prices from real students",
  },
  {
    id: 3,
    imageUrl: banner3,
    heading: "Hostel Ready?",
    subheading: "Get furniture & supplies in minutes",
  },
];

// Custom animation classes
// Add this inside your global CSS (e.g., index.css or a Tailwind css file)
// or use Tailwind animation utilities with @keyframes in tailwind.config.js:

/*
@keyframes slideUpFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) perspective(500px) rotateX(20deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) perspective(500px) rotateX(0deg);
  }
}

.animate-slideUpFadeIn {
  animation: slideUpFadeIn 0.6s ease forwards;
}
*/

// For demo here, I'll inline a style block with the above CSS.

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <>
      {/* Inline styles for demo: ideally move to your global CSS */}
      <style>{`
        @keyframes slideUpFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) perspective(500px) rotateX(20deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) perspective(500px) rotateX(0deg);
          }
        }
        .animate-slideUpFadeIn {
          animation: slideUpFadeIn 0.6s ease forwards;
        }
        .text-3d {
          text-shadow:
            1px 1px 0 #7c3aed,
            2px 2px 2px rgba(0,0,0,0.25);
        }
      `}</style>

      <div className="w-full mx-auto">
        {/* Main carousel */}
        <div
          ref={sliderRef}
          className="keen-slider rounded-xl overflow-hidden shadow-xl"
        >
          {banners?.map((banner, idx) => (
            <div
              key={banner.id}
              className="keen-slider__slide relative h-[250px] sm:h-[400px] md:h-[450px]"
            >
              <img
                src={banner.imageUrl}
                alt={banner.heading}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4">
                <h2
                  className={`text-xl sm:text-3xl md:text-4xl font-bold mb-2 text-3d ${
                    currentSlide === idx ? "animate-slideUpFadeIn" : "opacity-0"
                  }`}
                  aria-live={currentSlide === idx ? "polite" : "off"}
                >
                  {banner.heading}
                </h2>
                <p
                  className={`text-sm sm:text-lg ${
                    currentSlide === idx ? "animate-slideUpFadeIn" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0.15s" }}
                  aria-live={currentSlide === idx ? "polite" : "off"}
                >
                  {banner.subheading}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center mt-4 gap-2">
          {banners?.map((banner, idx) => (
            <img
              key={banner.id}
              src={banner.imageUrl}
              alt="Thumbnail"
              className={`w-8 h-4 sm:w-15 sm:h-10  object-cover rounded ring-2 cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? "ring-violet-500" : "ring-transparent"
              }`}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageCarousel;
