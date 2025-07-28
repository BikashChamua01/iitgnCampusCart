import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaInfoCircle } from "react-icons/fa";

// Google Map component with enhanced styling
function GoogleMapIITGN() {
  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden shadow-lg mb-12 relative"
      style={{ aspectRatio: "16/9" }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <iframe
        title="IIT Gandhinagar Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0594222881793!2d72.68580477528188!3d23.215635809397614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2bb4d9e61711%3A0xb050ef7b9cb5dc14!2sIIT%20Gandhinagar!5e0!3m2!1sen!2sin!4v1715541560511!5m2!1sen!2sin"
        width="100%"
        height="80%"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
        className="filter brightness-95 hover:brightness-100 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

// Enhanced process flow with modern design
function AnimatedProcessFlow() {
  const steps = [
    { label: "Browse", icon: "🔍", desc: "View available products." },
    { label: "Wishlist", icon: "⭐", desc: "Save your favorites." },
    { label: "Request", icon: "📨", desc: "Send a buy request with a message." },
    { label: "Response", icon: "✅❌", desc: "Sellers accept or decline." },
    {
      label: "Contact",
      icon: (
        <>
          <FaEnvelope className="inline" /> <FaWhatsapp className="inline ml-1" />
        </>
      ),
      desc: "Direct chat to finalize.",
    },
    { label: "Sell", icon: "📸", desc: "List your own items easily." },
  ];

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4 py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.9 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: i * 0.1 
              },
            },
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -8,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          className="relative group"
        >
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-6 min-w-[130px] shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-violet-200">
            {/* Connection line for desktop */}
            {i !== steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-0.5 bg-gradient-to-r from-violet-200 to-violet-100 z-0" />
            )}
            
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 text-4xl rounded-2xl flex items-center justify-center w-16 h-16 mb-3 border border-violet-100/50 group-hover:from-violet-100 group-hover:to-violet-200 transition-all duration-300">
              {step.icon}
            </div>
            <div className="text-violet-700 font-semibold text-sm mb-1 group-hover:text-violet-800 transition-colors">
              {step.label}
            </div>
            <div className="text-gray-600 text-xs text-center leading-relaxed">
              {step.desc}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

const platformHighlights = [
  {
    text: "Browse, wishlist, and discover any item with ease.",
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
  },
  {
    text: "Send tailored buy requests directly to sellers.",
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
  },
  {
    text: (
      <>
        Connect via IITGN email or WhatsApp <FaEnvelope className="inline ml-1" />
        <FaWhatsapp className="inline ml-1" />
      </>
    ),
    gradient: "from-purple-50 to-violet-50",
    iconColor: "text-purple-600",
  },
  {
    text: "List your own products with photos and pricing effortlessly.",
    gradient: "from-orange-50 to-amber-50",
    iconColor: "text-orange-600",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-0 md:px-8 pb-20 pt-0 text-gray-800">
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 80, damping: 20 }}
        className="max-w-7xl w-full mx-auto px-6 md:px-12 mt-8 relative"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-violet-800 via-violet-700 to-violet-600 bg-clip-text text-transparent mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About CampusMart
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            IIT Gandhinagar's trusted student marketplace — connecting students through
            secure, convenient commerce within our campus community.
          </motion.p>
        </div>

        {/* Map Section */}
        <GoogleMapIITGN />

        {/* Mission Section */}
        <motion.section
          className="mb-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            To foster a sustainable, convenient, and trustworthy ecosystem for
            student-to-student commerce, promoting community connection and
            responsible resource sharing within IIT Gandhinagar.
          </motion.p>
        </motion.section>

        {/* Process Flow Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <AnimatedProcessFlow />
        </motion.section>

        {/* Platform Highlights */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Platform Highlights
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {platformHighlights.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { 
                      duration: 0.7, 
                      type: "spring",
                      stiffness: 100
                    },
                  },
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  transition: { duration: 0.3 }
                }}
                className={`flex items-center bg-gradient-to-br ${item.gradient} backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-xl rounded-3xl px-8 py-8 transition-all duration-500 group cursor-pointer`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/80 ${item.iconColor} text-xl font-bold shadow-sm mr-6 group-hover:scale-110 transition-transform duration-300`}>
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 text-lg font-medium text-gray-700 leading-relaxed">
                  {item.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Community Guidelines */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Community Guidelines
          </motion.h2>
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm border border-gray-100 rounded-3xl px-8 py-8 flex items-start gap-6 shadow-sm hover:shadow-lg transition-all duration-500"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700 text-xl shadow-sm">
                <FaInfoCircle />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-700 leading-relaxed">
                All users are verified through IITGN email addresses, ensuring a secure
                and trusted community. We maintain high standards of respect and
                professionalism — any misuse will result in swift action to protect our
                community.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <motion.footer
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-xl md:text-2xl font-semibold text-gray-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Need Help?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Contact us at{" "}
            <motion.a
              href="mailto:support@campusmart.in"
              className="text-violet-700 font-medium hover:text-violet-800 transition-colors duration-300 underline decoration-violet-200 hover:decoration-violet-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              support@campusmart.in
            </motion.a>
          </motion.p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
