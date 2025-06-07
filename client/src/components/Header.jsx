import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import {useNavigate} from 'react-router-dom'
import { AppContext } from "../context/AppContext";
const Header = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate(); 

const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  };
  return (
    <motion.div
      className="flex flex-col justify-center items-center text-center my-20"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500
      
      "
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p>Best text to image Generator</p>
        <img src={assets.star_icon} alt="Star Icon" />
      </motion.div>
      <motion.h1
        className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 2 }}
        animate={{ opacity: 1 }}
      >
        Turn text to
        <span className="text-blue-600"> image </span>in Seconds.
      </motion.h1>
      <motion.p
        className="text-center max-w-xl mx-auto mt-5"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 2 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Unleash your Creativity with <span className="text-blue-600">AI </span>{" "}
        . Turn your imagination into visual art in seconds - just type, and
        watch the magic happen
      </motion.p>
      <motion.button
        onClick={onClickHandler}
        className="sm:text-lg text-white bg-black mt-4 px-6 py-2.5 flex items-center gap-2 rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          default: { duration: 0.5 },
          opacity: { delay: 0.8, duration: 1 },
        }}
      >
        <img src={assets.star_group} alt="Star Group" className="h-8" />
        Generate Image
      </motion.button>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {Array(6)
          .fill("")
          .map((item, index) => (
            <img
              src={assets.sample_img_2}
              alt="Sample Image"
              key={index}
              width={70}
            />
          ))}
      </div>
      <div className=" mt-2 text-lg">
        <p className="text-[#545454]">Generated images from imagify..</p>
      </div>
    </motion.div>
  );
};

export default Header;
