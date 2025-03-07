import React from 'react'
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";


const FormButton = ({ text, icon }) => {
    return (
        <motion.button
            type="submit"

            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1, scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    duration: 1,
                    delay: 0.2
                }
            }}
            exit={{
                opacity: 0, scale: 0, transition: {
                    type: "spring",
                    stiffness: 100,
                    duration: 1
                }
            }}
            whileHover={{
                scale: 1.1,
            }}
            whileTap={{
                scale: 0.7
            }}
            className="formButton"><Icon icon={icon} />{text}
        </motion.button>
    )
}

export default FormButton