import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const footerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.6, 0.01, 0.3, 0.97] },
  },
};

const linkHover = {
  hidden: { color: "#bddfff" },
  hover: { color: "#ffffff", scale: 1.05, transition: { duration: 0.2 } },
};

const PageFooter = () => (
  <footer
    className="relative overflow-hidden mt-32 text-white"
    style={{
      background: "linear-gradient(120deg, #2e1963 0%, #3e2a8f 68%, #6e44d1 100%)",
    }}
  >
    {/* Smooth Top Wave Overlay */}
    <svg
      viewBox="0 0 1440 120"
      className="absolute -top-8 left-0 w-full h-32 z-0 pointer-events-none"
      preserveAspectRatio="none"
    >
      <path
        d="M0,32 C360,120 1080,0 1440,80 L1440,0 L0,0 Z"
        fill="rgba(255,255,255,0.07)"
      />
    </svg>

    {/* Animated Content */}
    <motion.div
      className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* About */}
      <div>
        <h2 className="text-2xl font-extrabold mb-4 tracking-wide">
          Campus Market
        </h2>
        <p className="text-gray-200 leading-relaxed">
          Buy and sell on your campus seamlessly.<br />
          Modern, secure, and student-first.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
        <ul className="space-y-2">
          {["Home", "Products", "My Listings", "Login"]?.map((label) => (
            <motion.li
              key={label}
              initial="hidden"
              whileHover="hover"
              variants={linkHover}
              className="text-gray-300 text-base"
            >
              <a href="#">{label}</a>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Contact</h3>
        <ul className="space-y-3 text-gray-300 text-base">
          <motion.li
            initial="hidden"
            whileHover="hover"
            variants={linkHover}
            className="flex items-center"
          >
            <span className="font-medium text-gray-100 mr-1">Email:</span>
            <a href="mailto:iitgncampuscart.com">iitgncampuscart.com</a>
          </motion.li>
          <motion.li
            initial="hidden"
            whileHover="hover"
            variants={linkHover}
            className="flex items-center"
          >
            <span className="font-medium text-gray-100 mr-1">WhatsApp:</span>
            <a href="#">+91 98765 43210</a>
          </motion.li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
        <div className="flex space-x-5">
          {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin]?.map((Icon, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0.8, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.1, transition: { duration: 0.2 } }}
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white"
              aria-label={["Facebook", "Instagram", "Twitter", "LinkedIn"][i]}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Copyright */}
    <motion.div
      className="relative z-10 text-center py-4 border-t border-white/20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
      viewport={{ once: true }}
    >
      <p className="text-gray-300 text-sm tracking-wider">
        © {new Date().getFullYear()} Campus Market. All rights reserved.
      </p>
    </motion.div>
  </footer>
);

export default PageFooter;
