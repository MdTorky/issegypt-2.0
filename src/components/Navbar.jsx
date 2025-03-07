import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react"
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import SuccessMessage from "./formInputs/SuccessMessage";
import { Link } from "react-router-dom";

const Navbar = ({ toggleDarkMode, darkMode, toggleLanguage, language, languageText }) => {
    const { user } = useAuthContext()


    const navVariant = {
        hidden: {
            y: -100,
        },
        visible: {
            y: 0,
            transition: { type: "spring", duration: 1, stiffness: 100 }
        }
    }

    return (
        <>
            <motion.div
                variants={navVariant}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between w-full p-5 fixed bg-transparent z-100">
                <h1 className="text-darktheme  dark:text-white text-3xl md:text-6xl transition duration-300">{languageText.ISS}<span className="text-redtheme"> {languageText.EGYPT} </span></h1>
                <div className="flex gap-1 md:gap-5">

                    {/* {user.email} */}
                    {user && <Link className="flex text-whitetheme items-center text-xs lg:text-lg gap-2 bg-redtheme px-1 md:px-2 rounded-full border-2 border-darktheme cursor-pointer hover:scale-120 transition duration-300"
                        to="/adminDashboard">
                        <Icon icon="eos-icons:admin" />{languageText.Admin}
                    </Link>}


                    {/* Language Switch */}
                    <label className="inline-flex items-center relative cursor-pointer">
                        <input
                            className="peer hidden"
                            id="language"
                            type="checkbox"
                            checked={language === "ar"}
                            onChange={toggleLanguage}
                        />
                        <div className="relative w-[50px] h-[22px] md:w-[90px] md:h-[40px]
                    
                    bg-whitetheme dark:bg-zinc-500  rounded-full 
                        after:absolute after:content-[''] 
                        
                        after:h-[20px] after:w-[20px] md:after:w-[35px] md:after:h-[35px] 
                        
                        after:bg-darktheme peer-checked:after:bg-darktheme after:rounded-full 
                        
                        md:after:top-[2.5px] after:top-[1.3px] md:after:left-[7px] md:active:after:w-[40px] md:peer-checked:after:left-[83px] md:peer-checked:after:translate-x-[-100%] after:left-[3.88px] active:after:w-[20px] peer-checked:after:left-[46.11px] peer-checked:after:translate-x-[-90%]

                        shadow-sm duration-300 after:duration-300 after:shadow-md ring-1 ring-gray-300 dark:ring-zinc-700">
                        </div>


                        <Icon icon="circle-flags:uk" className="peer-checked:opacity-60 absolute w-3 h-3 md:w-6 md:h-6 md:left-[13px] left-[7.5px]" />
                        <Icon icon="circle-flags:ps" className="opacity-60 peer-checked:opacity-90 absolute w-3 h-3 md:w-6 md:h-6 md:right-[13px] right-[7.5px]" />
                    </label>



                    {/* Dark Mode Switch */}
                    <label className="inline-flex items-center relative cursor-pointer">
                        <input
                            className="peer hidden"
                            id="darkMode"
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                        />
                        <div className="relative w-[50px] h-[22px] md:w-[90px] md:h-[40px] 

                    bg-whitetheme dark:bg-zinc-500 peer-checked:bg-zinc-500 rounded-full 
                        after:absolute after:content-[''] 

                        after:h-[20px] after:w-[20px] md:after:w-[35px] md:after:h-[35px] 

                        after:bg-gradient-to-r after:from-orange-500 after:to-yellow-400 peer-checked:after:from-darktheme 
                        peer-checked:after:to-darktheme after:rounded-full 

                   md:after:top-[2.5px] after:top-[1.3px] md:after:left-[7px] md:active:after:w-[40px] md:peer-checked:after:left-[83px] md:peer-checked:after:translate-x-[-100%] after:left-[3.88px] active:after:w-[20px] peer-checked:after:left-[46.11px] peer-checked:after:translate-x-[-90%]
                        
                        shadow-sm duration-300 after:duration-300 after:shadow-md ring-gray-300 dark:ring-zinc-700">
                        </div>

                        <Icon icon="mingcute:sun-fog-fill" className="peer-checked:opacity-60 absolute  w-3 h-3 md:w-6 md:h-6 md:left-[13px] left-[7.5px] text-whitetheme" />
                        <Icon icon="mingcute:moon-fog-fill" className="opacity-60 peer-checked:opacity-90 peer-checked:text-white absolute  w-3 h-3 md:w-6 md:h-6 md:right-[13px] right-[7.5px] text-darktheme dark:text-white" />
                    </label>
                </div>


            </motion.div>

        </>
    );
};

export default Navbar;
