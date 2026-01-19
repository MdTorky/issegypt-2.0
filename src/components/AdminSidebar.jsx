import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import SelectField from "./formInputs/SelectField";
import roleChecker from "../components/MemberLoader";

const AdminSidebar = ({
    isOpen,
    toggleNavbar,
    languageText,
    language,
    filteredLinks,
    searchQuery,
    activeLink,
    setActiveLink,
    dropdownOpen,
    setDropdownOpen,
    handleSearch,
    currentMember,
    membersLoading,
    setCommitteeType,
    UserType,
    committeList,
    handleLogout,
}) => {
    const location = useLocation();

    const sidebarVariants = {
        expanded: { width: 285, transition: { type: "spring", stiffness: 100, damping: 20 } },
        collapsed: { width: 85, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.div
            variants={sidebarVariants}
            initial={isOpen ? "expanded" : "collapsed"}
            animate={isOpen ? "expanded" : "collapsed"}
            className={`hidden lg:flex flex-col h-4/5 my-auto relative top-0 bottom-0 ${language === "en" ? "left-0 border-r rounded-r-3xl" : "right-0 border-l rounded-l-3xl"} bg-darktheme2/95 backdrop-blur-xl border-white/10 shadow-2xl z-50 text-whitetheme `}
        >
            {/* <motion.div
            variants={sidebarVariants}
            initial={isOpen ? "expanded" : "collapsed"}
            animate={isOpen ? "expanded" : "collapsed"}
            className={`hidden lg:flex flex-col h-screen sticky top-0 ${language === "en" ? "left-0 border-r" : "right-0 border-l"} bg-darktheme2/95 backdrop-blur-xl border-white/10 shadow-2xl z-50 text-whitetheme `}
        ></motion.div> */}
            {/* Header / Logo */}
            <div className={`flex items-center p-6 ${isOpen ? "justify-between" : "justify-center"} h-20`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <motion.img
                        src="/logo.png"
                        alt="Logo"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        layout
                    />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-xl font-bold  tracking-wide whitespace-nowrap text-glow"
                            >
                                {languageText.ISSEgyptAdmin}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Toggle Button (Absolute) */}
            <button
                onClick={toggleNavbar}
                className={`absolute top-6 ${language === "en" ? "-right-3" : "-left-3"} z-100 p-1.5 rounded-full bg-redtheme border-4 border-whitetheme  text-white hover:scale-110 transition-transform shadow-lg focus:outline-none ring-2 ring-white/20`}
            >
                <Icon icon={isOpen ? "solar:double-alt-arrow-left-bold-duotone" : "solar:double-alt-arrow-right-bold-duotone"} className={`text-sm ${language === "ar" && "rotate-180"}`} />
            </button>


            {/* Search Bar */}
            <div className={`px-4 mb-4 transition-all duration-300 ${!isOpen ? "opacity-0 pointer-events-none h-0 p-0" : "opacity-100"}`}>
                <div className="relative group">
                    <Icon icon="solar:magnifer-linear" className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg ${language === "en" ? "left-3" : "right-3"}`} />
                    <input
                        type="text"
                        placeholder={languageText.Search}
                        value={searchQuery}
                        onChange={handleSearch}
                        className={`w-full bg-darktheme/50 border border-white/10 rounded-xl py-2.5 ${language === "en" ? "pl-10 pr-4" : "pr-10 pl-4"} text-sm focus:outline-none focus:ring-2 focus:ring-redtheme/50 focus:border-redtheme/50 transition-all placeholder:text-gray-500`}
                    />
                </div>
            </div>

            {/* Navigation Links - Scrollable Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 px-3 space-y-1.5">
                {filteredLinks.map((link) => {
                    const isActive = location.pathname === link.path || (link.dropdown && link.dropdown.some(sub => location.pathname === sub.path));

                    return (
                        <div key={link.name}>
                            <Link
                                to={link.path || "#"}
                                onClick={(e) => {
                                    if (link.dropdown) {
                                        e.preventDefault();
                                        if (!isOpen) toggleNavbar(); // Auto expand on click if collapsed
                                        setDropdownOpen(dropdownOpen === link.name ? null : link.name);
                                    } else {
                                        setActiveLink(link.name);
                                    }
                                }}
                                className={`relative flex items-center px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive
                                        ? "bg-redtheme text-white shadow-[0_0_20px_rgba(163,22,33,0.4)]"
                                        : "hover:bg-white/5 text-gray-300 hover:text-white"
                                    }
                ${!isOpen && "justify-center"}
              `}
                            >
                                <Icon icon={link.icon} className={`text-2xl min-w-[24px] transition-transform duration-300 ${!isOpen && "group-hover:scale-125"}`} />

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className={`flex items-center flex-1 ${language === "en" ? "ml-4" : "mr-4"} overflow-hidden`}
                                        >
                                            <span className="font-medium truncate text-sm">{link.name}</span>
                                            {link.dropdown && (
                                                <Icon
                                                    icon="solar:alt-arrow-down-bold-duotone"
                                                    className={`text-xs ml-auto transition-transform duration-300 ${dropdownOpen === link.name ? "rotate-180" : ""}`}
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed state */}
                                {!isOpen && (
                                    <div className={`absolute ${language === "en" ? "left-full ml-4" : "right-full mr-4"} top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl`}>
                                        {link.name}
                                    </div>
                                )}

                                {/* Active indicator bar */}
                                {isActive && !isOpen && (
                                    <motion.div layoutId="activeIndicator" className={`absolute ${language === "en" ? "left-0" : "right-0"} top-2 bottom-2 w-1 bg-redtheme rounded-r-full`} />
                                )}

                            </Link>

                            {/* Dropdown Items */}
                            <AnimatePresence>
                                {isOpen && link.dropdown && dropdownOpen === link.name && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden bg-black/20 rounded-lg mt-1 mx-1"
                                    >
                                        {link.dropdown.map((subLink) => (
                                            <Link
                                                key={subLink.name}
                                                to={subLink.path}
                                                className={`flex items-center px-4 py-2.5 text-sm transition-colors gap-3
                                            ${location.pathname === subLink.path
                                                        ? "text-redtheme bg-white/5 font-semibold"
                                                        : "text-gray-400 hover:text-white hover:bg-white/5"}
                                            ${language === "en" ? "pl-11" : "pr-11"}
                                            `}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${location.pathname === subLink.path ? "bg-redtheme" : "bg-gray-600"}`}></div>
                                                {subLink.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>

            {/* Committee Selector (If applicable) */}
            {setCommitteeType && UserType("All") && (
                <div className={`px-4 mb-2 transition-all duration-300 ${!isOpen && "hidden"}`}>
                    <div className="bg-darktheme/50 rounded-xl p-1 border border-white/5">
                        {membersLoading ? (
                            <div className="h-10 animate-pulse bg-white/5 rounded-lg"></div>
                        ) : (
                            <SelectField
                                options={committeList}
                                placeholder={languageText.ChooseCommittee}
                                iconValue="fluent:people-team-16-filled"
                                icon="fluent:people-team-16-regular"
                                language={language}
                                languageText={languageText}
                                setValue={setCommitteeType}
                                regex={null}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Footer / Profile Section */}
            <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-3xl">
                {membersLoading ? (
                    <div className="flex justify-center"><Icon icon="eos-icons:loading" className="text-2xl animate-spin text-redtheme" /></div>
                ) : (
                    <div className={`flex items-center ${!isOpen ? "justify-center" : "gap-3"}`}>
                        <div className="relative group cursor-pointer">
                            <motion.div
                                className="w-10 h-10 rounded-full bg-linear-to-tr from-redtheme to-redtheme2 p-[2px]"
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={currentMember?.img || "/placeholder.png"}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-darktheme2"
                                />
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex flex-col flex-1 overflow-hidden"
                                >
                                    <span className="text-sm font-bold truncate text-whitetheme">{language === "en" ? currentMember?.name : currentMember?.arabicName}</span>
                                    <span className="text-xs text-gray-400 truncate">
                                        {roleChecker({
                                            languageText: languageText,
                                            committee: currentMember?.committee,
                                            role: currentMember?.type,
                                        })}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isOpen && (
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-redtheme/20 text-gray-400 hover:text-redtheme transition-colors"
                                title={languageText.Logout}
                            >
                                <Icon icon="solar:logout-2-bold-duotone" className="text-xl" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminSidebar;
