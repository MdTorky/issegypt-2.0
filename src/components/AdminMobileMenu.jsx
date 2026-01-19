import React from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import SelectField from "./formInputs/SelectField";
import roleChecker from "../components/MemberLoader";

const AdminMobileMenu = ({
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

    const menuVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={`lg:hidden fixed z-[200] top-16 ${language === "en" ? "right-4" : "left-4"} p-3 rounded-full bg-darktheme2/80 backdrop-blur-md border border-white/10 text-white shadow-lg`}
                onClick={toggleNavbar}
            >
                <Icon icon={isOpen ? "solar:close-circle-bold" : "solar:hamburger-menu-broken"} className="text-2xl" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-100 bg-darktheme2/95 backdrop-blur-xl lg:hidden flex flex-col p-6 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-center mb-8 mt-10">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-3" />
                            <span className="text-2xl font-bold text-white tracking-wide">{languageText.ISSEgyptAdmin}</span>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Icon icon="solar:magnifer-linear" className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg ${language === "en" ? "left-3" : "right-3"}`} />
                                <input
                                    type="text"
                                    placeholder={languageText.Search}
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white focus:outline-none focus:ring-2 focus:ring-redtheme/50"
                                />
                            </div>
                        </div>

                        {/* Committee Selector (If applicable) */}
                        {setCommitteeType && UserType("All") && (
                            <div className="mb-4">
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
                        )}

                        {/* Links */}
                        <div className="flex-1 space-y-2">
                            {filteredLinks.map((link) => (
                                <div key={link.name}>
                                    <Link
                                        to={link.path || "#"}
                                        onClick={(e) => {
                                            if (link.dropdown) {
                                                e.preventDefault();
                                                setDropdownOpen(dropdownOpen === link.name ? null : link.name);
                                            } else {
                                                toggleNavbar(); // Close on click
                                                setActiveLink(link.name);
                                            }
                                        }}
                                        className={`flex items-center p-4 rounded-xl transition-all
                        ${(location.pathname === link.path && !link.dropdown)
                                                ? "bg-redtheme text-white shadow-lg"
                                                : "bg-white/5 text-gray-200 hover:bg-white/10"
                                            }
                    `}
                                    >
                                        <Icon icon={link.icon} className="text-2xl" />
                                        <span className={`flex-1 font-medium ${language === "en" ? "ml-4" : "mr-4"}`}>{link.name}</span>
                                        {link.dropdown && (
                                            <Icon icon={dropdownOpen === link.name ? "solar:alt-arrow-up-bold-duotone" : "solar:alt-arrow-down-bold-duotone"} />
                                        )}
                                    </Link>

                                    <AnimatePresence>
                                        {link.dropdown && dropdownOpen === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden pl-4 pr-4"
                                            >
                                                <div className={`mt-2 space-y-2 border-l-2 ${language === "en" ? "border-white/10 ml-4" : "border-white/10 mr-4"}`}>
                                                    {link.dropdown.map((subLink) => (
                                                        <Link
                                                            key={subLink.name}
                                                            to={subLink.path}
                                                            onClick={toggleNavbar}
                                                            className={`flex items-center p-3 rounded-lg text-sm
                                    ${location.pathname === subLink.path ? "text-redtheme bg-redtheme/10 font-bold" : "text-gray-400 hover:text-white"}
                                    ${language === "en" ? "ml-2" : "mr-2"}
                                `}
                                                        >
                                                            <Icon icon={subLink.icon} className="mr-3 text-lg" />
                                                            {subLink.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>




                        {/* Profile Footer */}
                        <div className="mt-auto pt-6 border-t border-white/10">
                            {membersLoading ? (
                                <div className="flex justify-center"><Icon icon="eos-icons:loading" className="text-2xl animate-spin text-redtheme" /></div>
                            ) : (
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                                    <img
                                        src={currentMember?.img || "/placeholder.png"}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-redtheme"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-white font-bold truncate">{language === "en" ? currentMember?.name : currentMember?.arabicName}</h4>
                                        <p className="text-xs text-gray-400 truncate">
                                            {roleChecker({
                                                languageText: languageText,
                                                committee: currentMember?.committee,
                                                role: currentMember?.type,
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 bg-redtheme text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        <Icon icon="solar:logout-2-bold-duotone" />
                                    </button>
                                </div>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminMobileMenu;
