import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

// Responsive Google Map Embed for IIT Gandhinagar
function GoogleMapIITGN() {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md mb-8" style={{ aspectRatio: "16/9" }}>
      <iframe
        title="IIT Gandhinagar Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0594222881793!2d72.68580477528188!3d23.215635809397614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2bb4d9e61711%3A0xb050ef7b9cb5dc14!2sIIT%20Gandhinagar!5e0!3m2!1sen!2sin!4v1715541560511!5m2!1sen!2sin"
        width="100%"
        height="100%"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
      />
    </div>
  );
}

// Animated, minimalist "How It Works" horizontal process
function AnimatedProcessFlow() {
  const steps = [
    { label: "Browse", icon: "🔍", desc: "View available products." },
    { label: "Wishlist", icon: "⭐", desc: "Save your favorites." },
    { label: "Request", icon: "📨", desc: "Send a buy request with a message." },
    { label: "Response", icon: "✅❌", desc: "Sellers accept or decline." },
    { label: "Contact", icon: <><FaEnvelope className="inline" /> <FaWhatsapp className="inline ml-1" /></>, desc: "Direct chat to finalize." },
    { label: "Sell", icon: "📸", desc: "List your own items easily." },
  ];

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.18 } },
      }}
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.93 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 24, delay: i*0.04 } },
          }}
          className="flex flex-col items-center bg-white border border-violet-100 rounded-xl px-3 py-5 min-w-[115px] shadow transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="bg-violet-50 text-3xl md:text-4xl rounded-full flex items-center justify-center w-14 h-14 mb-2 border border-violet-200">
            {step.icon}
          </div>
          <div className="text-violet-700 font-semibold text-sm mb-1">{step.label}</div>
          <div className="text-gray-500 text-xs text-center max-w-[90px]">{step.desc}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen  p-0 md:px-8 pb-14 pt-0 text-gray-800">
      <motion.main
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, type: "spring", damping: 25 }}
        className="max-w-6xl mx-auto px-6 md:px-10 py-10 mt-8 relative"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-violet-800 mb-4 tracking-tight">About CampusMart</h1>
        <p className="text-lg md:text-xl mb-7">
          CampusMart is IIT Gandhinagar’s trusted student marketplace: Buy, sell, and connect securely within your campus community.
        </p>
        <section className="mb-12">
          <GoogleMapIITGN />
        </section>

        <motion.h2 className="text-2xl font-semibold text-violet-600 mb-2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          Our Mission
        </motion.h2>
        <motion.p className="mb-6 text-base"
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          To create a sustainable, convenient, and trustworthy environment for student-to-student commerce inside IITGN.
        </motion.p>

        <motion.h2 className="text-2xl font-semibold text-violet-600 mb-3 mt-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          How It Works
        </motion.h2>
        <AnimatedProcessFlow />

        <motion.h2 className="text-2xl font-semibold text-violet-600 mt-8 mb-2"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          Platform Highlights
        </motion.h2>
        <motion.ul className="mb-7 text-base grid grid-cols-1 md:grid-cols-2 gap-3 marker:text-violet-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
        >
          <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>Browse, wishlist, and discover any item</motion.li>
          <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>Send tailored buy requests directly</motion.li>
          <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>Reach sellers via IITGN email or WhatsApp <FaEnvelope className="inline ml-1" /><FaWhatsapp className="inline ml-1" /></motion.li>
          <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>Easily list your own products with photos and pricing</motion.li>
        </motion.ul>

        <motion.h2 className="text-2xl font-semibold text-violet-600 mb-2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.09 }}
        >
          Community Guidelines
        </motion.h2>
        <motion.p className="mb-7 text-base"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          All users are verified by IITGN email. Always remain respectful and professional; misuse of the platform will result in swift action.
        </motion.p>

        <motion.h2 className="text-xl font-semibold text-gray-700 mb-2"
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          Need Help?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.21 }}
        >
          Contact: <a href="mailto:iitgncampuscart.gmail.com" className="text-violet-700 underline ml-1">support@campusmart.in</a>
        </motion.p>
      </motion.main>
    </div>
  );
}
