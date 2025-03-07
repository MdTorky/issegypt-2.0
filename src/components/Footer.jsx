import React from 'react'
import logo from '../assets/img/logo.png'
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';

const Footer = ({ languageText, language }) => {

    const socialParentVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }
    };

    const socialChildVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" } },
        exit: { opacity: 0, y: -100 }
    };
    return (

        <div className="bg-redtheme">
            <div className="max-w-2xl mx-auto text-white py-10">
                <div className="text-center">
                    <AnimatePresence>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={socialParentVariants}
                            transition={{ duration: 0.5 }}
                            className="text-white flex justify-center gap-1">
                            {[
                                { link: "https://www.instagram.com/issegypt/", icon: "mdi:instagram", bg: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]", text: languageText.instagram },
                                { link: "https://www.facebook.com/Eg.UTM", icon: "qlementine-icons:facebook-16", bg: "bg-gradient-to-r from-[#00c6ff] to-[#0072ff]", text: languageText.facebook },
                                { link: "https://www.linkedin.com/company/issegypt", icon: "tabler:brand-linkedin", bg: "bg-[#0A66C2]", text: languageText.linkedin },
                                { link: "https://www.youtube.com/@issegypt", icon: "mingcute:youtube-fill", bg: "bg-[#FF0000]", text: languageText.youtube },
                                { link: "https://linktr.ee/issegypt", icon: "tabler:brand-linktree", bg: "bg-[#acdc5c]", text: languageText.linktree }
                            ].map(({ link, icon, bg, text }, index) => (
                                <motion.div
                                    key={index}
                                    variants={socialChildVariants} // All children use the same variants
                                    whileHover={{ scale: 1.2, y: 10 }}
                                    transition={{ duration: 0.5 }}
                                    onClick={() => window.open(link, "_blank")}
                                    className="socailHomeButton group"
                                >
                                    <Icon icon={icon} />
                                    <div className={`socailHomeButtonText ${bg}`}>{text}</div>
                                </motion.div>
                            ))}

                        </motion.div>
                    </AnimatePresence>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={socialParentVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h3
                            variants={socialChildVariants} // All children use the same variants
                            transition={{ duration: 0.7 }}
                            className="text-3xl mt-5">{languageText.ISSEGYPTUTM}</motion.h3>
                        <motion.p
                            variants={socialChildVariants} // All children use the same variants
                            transition={{ duration: 1 }}
                            className='text-gray-400'>{languageText.ISSEGYPTDESC}</motion.p>
                    </motion.div>
                </div>
                <AnimatePresence>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"

                        variants={socialParentVariants}
                        transition={{ duration: 0.5 }}
                        className="mt-3 text-xl text-white flex flex-wrap justify-center gap-5">

                        <motion.div
                            variants={socialChildVariants} // All children use the same variants
                            whileHover={{ scale: 1.2, y: 10 }}
                            transition={{ duration: 0.5 }}>
                            <Link to="/" className='flex items-center gap-2'>
                                <Icon icon='solar:home-2-bold' />{languageText.Home}
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={socialChildVariants} // All children use the same variants
                            whileHover={{ scale: 1.2, y: 10 }}
                            transition={{ duration: 0.5 }}>
                            <Link to="/services" className='flex items-center gap-2'>
                                <Icon icon='ri:service-fill' />{languageText.HelpingHand}
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={socialChildVariants} // All children use the same variants
                            whileHover={{ scale: 1.2, y: 10 }}
                            transition={{ duration: 0.5 }}>
                            <Link to="/about" className='flex items-center gap-2'>
                                <Icon icon='fluent:people-20-filled' />{languageText.AboutUs}
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={socialChildVariants} // All children use the same variants
                            whileHover={{ scale: 1.2, y: 10 }}
                            transition={{ duration: 0.5 }}>
                            <Link to="/gallery" className='flex items-center gap-2'>
                                <Icon icon='solar:gallery-wide-bold' />{languageText.Gallery}
                            </Link>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
                    <p className="order-2 md:order-1 mt-8 md:mt-0"> {languageText.ISSEGYPTRights}</p>
                    <div className="order-1 md:order-2">
                        <Link to="https://issegypt.vercel.app/terms&Conditions" className="px-2">{languageText.TermsConditions}</Link>
                        <Link className={`px-2 ${language === "en" ? "border-l" : "border-r"}`}>{languageText.PrivacyPolicy}</Link>
                        <Link onClick={() => window.open("https://wa.me/201554206775", '_blank')} className={`px-2 ${language === "en" ? "border-l" : "border-r"}`}>{languageText.AnyInquires}</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer