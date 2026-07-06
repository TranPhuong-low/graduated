import React from 'react';
import { motion } from 'framer-motion';

export default function FadeInSection({ children, id, className, zIndex }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.2 }}
      className={`relative min-h-screen w-full ${className}`}
      style={{ zIndex }}
    >
      {children}
    </motion.section>
  );
}