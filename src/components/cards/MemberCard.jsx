import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../assets/img/logo.png";
import roleChecker from "../../components/MemberLoader";

const MemberCard = ({ member, language, languageText }) => {
    const handleLinkedInClick = () => {
        if (member.linkedIn) {
            window.open(member.linkedIn);
        } else {
            Swal.fire({
                title: languageText.noLinkedIn,
                showClass: {
                    popup: "animate__animated animate__fadeInUp animate__faster",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutDown animate__faster",
                },
                confirmButtonText: "OK", // Custom text for the "OK" button
                confirmButtonColor: "var(--theme)",
            });
        }
    };
    // Detect if the device supports hover or not
    const shouldReduceMotion = useReducedMotion();

    return (
        <>
            <motion.div
                className="relative w-[300px] h-[450px] bg-white dark:bg-darktheme2 cursor-pointer overflow-hidden rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] hidden lg:flex ring-1 ring-gray-400 group"
                whileHover="hover"
                transition={{ duration: 0.4 }}
                variants={{
                    hover: { scale: 1.05 },
                }}
            >
                {/* Overlay Effect */}
                <motion.div
                    className="absolute top-0 left-full w-full h-full bg-white/20 skew-x-[45deg]"
                    variants={{
                        initial: { left: "170%" },
                        hover: { left: "-170%" },
                    }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    animate={!shouldReduceMotion ? {} : { left: "-170%" }}
                />

                {/* Image with Shimmer Effect */}
                <motion.div
                    className="relative w-full h-full overflow-hidden"
                    whileHover="hover" // Trigger hover state for all child elements
                    initial="initial" // Initial state for all child elements
                >
                    {/* Image */}
                    <motion.img
                        src={member.img}
                        alt="Profile"
                        className="w-full h-full object-cover grayscale"
                        style={{
                            backgroundImage: `url(${logo}), linear-gradient(225deg, rgba(163,22,33,1) 0%, rgba(98,5,13,1) 100%)`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                        variants={{
                            initial: { filter: "grayscale(100%)", scale: 1 },
                            hover: { filter: "grayscale(0%)", scale: 1.2 },
                        }}
                        transition={{ duration: 2 }}
                    />
                    <div
                        className="absolute bottom-0 left-0 right-0 flex m-auto w-full h-80 bg-gradient-to-t from-darktheme2/10 via-darktheme2/10 opacity-0
                        transition-all duration-300 group-hover:opacity-100 
                        group-hover:from-darktheme2 group-hover:via-darktheme/90 to-transparent z-10"
                    ></div>
                    <div
                        className={` absolute flex flex-col items-center bottom-10 m-auto left-0 right-0 text-4xl text-whitetheme z-20 w-[85%] translate-y-20 group-hover:translate-y-0 opacity-0 transition-all duration-500 group-hover:opacity-100  `}
                    >
                        <h1>{language === "en" ? member.name : member.arabicName}</h1>
                        <p className="text-2xl text-gray-400">
                            {roleChecker({
                                languageText: languageText,
                                committee: member.committee,
                                role: member.type,
                            })}
                        </p>
                    </div>
                    {/* Shimmer Overlay - Only shows on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10"
                        initial={{ x: "-100%", y: "0%" }}
                        variants={{
                            initial: { opacity: 0, x: "-100%", y: "0%" },
                            hover: { opacity: 1, x: "100%", y: "0%" },
                        }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        animate={!shouldReduceMotion ? {} : { opacity: 0 }}
                    />


                    <ul className="absolute top-0 left-0 p-0 m-0">
                        {[1, 2, 3].map((index) => (
                            <motion.li
                                key={index}
                                className="w-10 h-10 border-b border-black/10 bg-white dark:bg-darktheme2 flex items-center justify-center text-redtheme dark:text-whitetheme text-lg"
                                variants={{
                                    initial: {
                                        opacity: 0,
                                        x: -50,
                                    },
                                    hover: {
                                        opacity: 1,
                                        x: 0,
                                    },
                                }}
                                transition={{ duration: 0.5, delay: index * 0.3 }}
                            >
                                {index === 1 && (
                                    <Link
                                        onClick={() => window.open(`http://wa.me/${member.phone}`, "_blank")}
                                        className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                    >
                                        <Icon icon="ant-design:whats-app-outlined" />
                                    </Link>
                                )}
                                {index === 2 && (
                                    <Link
                                        onClick={() => window.open(`mailto:${member.email}`, "_blank")}
                                        className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                    >
                                        <Icon icon="entypo:email" />
                                    </Link>
                                )}
                                {index === 3 && (
                                    <Link
                                        onClick={handleLinkedInClick}
                                        className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                    >
                                        <Icon icon="tabler:brand-linkedin" />
                                    </Link>
                                )}
                            </motion.li>
                        ))}
                    </ul>

                </motion.div>

                {/* Social Media Icons (Slide In From Left) */}

            </motion.div>

            {/* No Hover */}

            <motion.div className="relative w-[300px] h-[450px] bg-white dark:bg-darktheme2 cursor-pointer overflow-hidden rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] flex lg:hidden ring-1 ring-gray-400">
                {/* Overlay Effect */}
                <motion.div className="absolute top-0 left-full w-full h-full skew-x-[45deg]" />

                {/* Image with Shimmer Effect */}
                <div className="relative w-full h-full overflow-hidden">
                    <motion.img
                        src={member.img}
                        alt="Profile"
                        className="w-full h-full object-cover scale-120"
                        style={{
                            backgroundImage: `url(${logo}), linear-gradient(225deg, rgba(163,22,33,1) 0%, rgba(98,5,13,1) 100%)`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <div
                        className="absolute bottom-0 left-0 right-0 flex m-auto w-full h-80 bg-gradient-to-t from-darktheme2
                        transition-all duration-300 via-darktheme/90 to-transparent z-10"
                    ></div>
                    <div
                        className={` absolute flex flex-col items-center bottom-10 m-auto left-0 right-0 text-4xl text-whitetheme z-20 w-[85%] transition-all duration-500  `}
                    >
                        <h1>{language === "en" ? member.name : member.arabicName}</h1>
                        <p className="text-2xl text-gray-400">
                            {roleChecker({
                                languageText: languageText,
                                committee: member.committee,
                                role: member.type,
                            })}
                        </p>
                    </div>
                </div>

                {/* Name (Falling Paper Effect) */}
                {/* <motion.h2
                    className="absolute bottom-0 w-full text-center text-xl bg-whitetheme dark:bg-darktheme2 p-2 m-0 text-darktheme dark:text-whitetheme2"
                >
                    {language === 'ar' ? <p>{member.arabicName}</p> : <p>{member.name}</p>}
                    <p className="text-sm text-gray-400">
                        {roleChecker({ languageText: languageText, committee: member.committee, role: member.type })}</p>
                </motion.h2> */}

                {/* Social Media Icons (Slide In From Left) */}
                <ul className="absolute top-0 left-0 p-0 m-0">
                    {[1, 2, 3].map((index) => (
                        <motion.li
                            key={index}
                            className="w-10 h-10 border-b border-black/10 bg-whitetheme dark:bg-darktheme flex items-center justify-center text-redtheme dark:text-whitetheme text-lg"
                        >
                            {index === 1 && (
                                <Link
                                    onClick={() =>
                                        window.open(`http://wa.me/${member.phone}`, "_blank")
                                    }
                                    className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                >
                                    <Icon icon="ant-design:whats-app-outlined" />
                                </Link>
                            )}
                            {index === 2 && (
                                <Link
                                    onClick={() =>
                                        window.open(`mailto:${member.email}`, "_blank")
                                    }
                                    className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                >
                                    <Icon icon="entypo:email" />
                                </Link>
                            )}
                            {index === 3 && (
                                <Link
                                    onClick={handleLinkedInClick}
                                    className="hover:scale-120 hover:text-whitetheme hover:p-2 hover:bg-red-900 transition duration-300"
                                >
                                    <Icon icon="tabler:brand-linkedin" />
                                </Link>
                            )}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </>
        // </motion.div>
    );
};

export default MemberCard;
