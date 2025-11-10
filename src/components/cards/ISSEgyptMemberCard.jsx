import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../assets/img/logo.png";
import roleChecker from "../../components/MemberLoader";
import { useAuthContext } from '../../hooks/useAuthContext';

const ISSEgyptMember = ({ member, language, languageText }) => {
    const { user } = useAuthContext()

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


            {/* No Hover */}
            <motion.div className="relative w-[300px] h-[450px] bg-white dark:bg-darktheme2 cursor-pointer overflow-hidden rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] flex ring-1 ring-gray-400">
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
                        <h1 className="text-center">{language === "en" ? member.name : member.arabicName}</h1>
                        <p className="text-2xl text-gray-400 text-center">
                            {roleChecker({
                                languageText: languageText,
                                committee: member.committee,
                                role: member.type,
                            })}
                        </p>
                    </div>
                </div>


                {/* Social Media Icons (Slide In From Left) */}
                <ul className="absolute top-0 left-0 p-0 m-0">
                    {[1, 2, 3, 4].map((index) => {
                        // Condition to apply to ALL list items except index 4 (Admin)
                        const defaultClasses = "w-10 h-8 border-b border-black/10 bg-whitetheme dark:bg-darktheme flex items-center justify-center text-redtheme dark:text-whitetheme text-lg";

                        if (index === 4) {
                            if (user.committee === "Admin") {
                                return (
                                    <motion.li
                                        key={index}
                                        // NEW: Custom classes for the Admin/Edit button
                                        className="w-10 h-8 border-b border-black/10 bg-redtheme flex items-center justify-center text-whitetheme text-lg"
                                    >
                                        <Link
                                            to={`/editMember/${member._id}`}
                                            className="hover:scale-120 hover:text-redtheme hover:p-2 hover:bg-whitetheme transition duration-300"
                                        >
                                            <Icon icon="fluent:person-edit-16-filled" />
                                        </Link>
                                    </motion.li>
                                );
                            }

                            return null;
                        }

                        return (
                            <motion.li
                                key={index}
                                className={defaultClasses}
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
                                {/* Index 4 logic moved outside the map function content for conditional rendering of the whole LI */}
                            </motion.li>
                        );
                    })}
                </ul>
            </motion.div>
        </>
        // </motion.div>
    );
};

export default ISSEgyptMember;
