"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaShareSquare, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <motion.div className="text-3xl font-bold mb-4 md:mb-0 space-y-3">
            <motion.span whileHover={{ scale: 1.25 }}>GLA Codify</motion.span>
            <motion.p className="text-base font-medium ">
              Empowering Students to Solve, Code, and Succeed!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex space-x-4"
          >
            <motion.a
              whileHover={{ y: -3 }}
              href="https://github.com/chman-chaudhary/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-2xl" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3 }}
              href="https://www.linkedin.com/in/chman-chaudhary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-2xl" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3 }}
              href="https://twitter.com/chman_chaudhary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-2xl" />
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p>
            &copy; {new Date().getFullYear()} GLA Codify. All rights reserved.
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center mt-8 border-t-[1px] border-gray-300 pt-4"
      >
        <div className="flex justify-center gap-x-2">
          Developed with ❤️ by{" "}
          <a
            href="https://portfolio-chaman-chaudhary.vercel.app/"
            target="_blank"
            className="flex items-center hover:-translate-y-1 hover:scale-105 hover:underline hover:text-blue-100 transition duration-300 ease-in-out"
          >
            Chaman Chaudhary <FaShareSquare className="size-4 ml-1" />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};
