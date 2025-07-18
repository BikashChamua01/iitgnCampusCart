import React, { useEffect, useRef } from "react";
import { Carousel, CarouselItem } from "@/components/ui/carousel"; // Use your carousel lib
import { motion } from "framer-motion";

const images = [
  "/carousel1.jpg",
  "/carousel2.jpg",
  "/carousel3.jpg",
];

const CarouselHome = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Autoplay audio after user interaction
    const playAudio = () => {
      audioRef.current?.play().catch((e) => console.log("Audio blocked:", e));
      window.removeEventListener("click", playAudio);
    };
    window.addEventListener("click", playAudio);
  }, []);

  return (
    <div className="relative w-full">
      <Carousel className="rounded-xl shadow-lg overflow-hidden">
        {images.map((img, idx) => (
          <CarouselItem key={idx} className="w-full h-[300px] md:h-[400px]">
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <h2 className="text-lg md:text-xl font-bold">
                Buy and Sell within IITGN
              </h2>
              <p className="text-sm md:text-base">
                Connect with students to trade items easily and securely through Campus Cart.
              </p>
            </div>
          </CarouselItem>
        ))}
      </Carousel>

      <audio ref={audioRef} src="/bg_music.mp3" loop />
    </div>
  );
};

export default CarouselHome;
