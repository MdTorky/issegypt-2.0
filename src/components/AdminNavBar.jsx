import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import UserType from "./UserType";
import { Link, useLocation } from 'react-router-dom'
import useFetchData from "../hooks/useFetchData";
import { useAuthContext } from '../hooks/useAuthContext';
import { useFormsContext } from '../hooks/useFormContext';
import SmallLoader from "./loaders/SmallLoader";
import roleChecker from "../components/MemberLoader";
import SelectField from "./formInputs/SelectField";
import { useLogout } from "../hooks/useLogout";
import SuccessMessage from "./formInputs/SuccessMessage";


const AdminNavBar = ({ languageText, api, language, setCommitteeType }) => {
    const { user } = useAuthContext()
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Dashboard");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleNavbar = () => setIsOpen(!isOpen);

    const { logout, logoutSuccess, setLogoutSuccess } = useLogout(languageText)


    // Simulated search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const links = [
        { name: languageText.Dashboard, icon: "lets-icons:home", path: "/adminDashboard" },
        {
            name: languageText.Forms,
            icon: "fluent:form-20-filled",
            dropdown: [
                { name: languageText.AddForm, path: "/addForm", icon: "fluent:form-new-20-filled" },
                { name: languageText.MyForms, path: "/myForms", icon: "fluent:form-sparkle-20-filled" },
            ],
        },
        {
            name: languageText.Members,
            icon: "fluent:people-20-filled",
            dropdown: [
                { name: languageText.MyMembers, path: "", icon: "fluent:people-eye-20-filled" },
            ],
        },
        // ...(UserType("All") ? [{
        //     name: languageText.Internships,
        //     icon: "hugeicons:permanent-job",
        //     dropdown: [
        //         { name: languageText.AddInternship, path: "/addIntern", icon: "mdi:office-building-plus" },
        //     ],
        // },
        // {
        //     name: languageText.Gallery,
        //     icon: "solar:gallery-wide-bold",
        //     dropdown: [
        //         { name: languageText.AddGallery, path: "", icon: "fluent:image-add-20-filled" },
        //     ],
        // },
        // {
        //     name: languageText.Services,
        //     icon: "ri:service-fill",
        //     dropdown: [
        //         { name: languageText.AddService, path: "/addService", icon: "fluent:bot-add-16-filled" },
        //         { name: languageText.AddHelpingHand, path: "/addHelpingHand", icon: "mdi:cog" },
        //     ],
        // },
        // {
        //     name: languageText.Products,
        //     icon: "game-icons:clothes",
        //     dropdown: [
        //         { name: languageText.ProductsData, path: "/productsData", icon: "mage:package-box-fill" },
        //     ],
        // }
        // ] : []),
        ...(UserType("Social") ? [{
            name: "Emoji Quiz",
            icon: "fluent:emoji-hint-16-filled",
            dropdown: [
                { name: "Host Page", path: "/host/ISSEMOJI", icon: "carbon:bastion-host" },
                { name: "Edit Points", path: "/editpoints/ISSEMOJI", icon: "mdi:progress-star-four-points" },
                { name: "Results", path: "/results/ISSEMOJI", icon: "game-icons:podium" },
            ],
        }
        ] : []),
    ].filter(Boolean);


    const committeList = [
        { label: languageText.All, value: "All", icon: "fluent:select-all-off-16-filled" },
        ...(UserType("All") ? [{
            label: user?.committee,
            value: user?.committee
        }] : []),
        ...(UserType("Admin") ? [{
            label: languageText.PresidentOnly,
            value: "ISS Egypt",
            icon: "emojione-monotone:flag-for-egypt"
        }, {
            label: languageText.VicePresident,
            value: "Vice",
            icon: "fontisto:person"
        }, {
            label: languageText.Secretary,
            value: "Secretary",
            icon: "mingcute:document-2-fill"
        }, {
            label: languageText.Treasurer,

            value: "Treasurer",
            icon: "fluent:money-16-filled"
        },
        ] : []),
        { value: "Social", label: languageText.SocialCommittee, icon: "solar:people-nearby-bold" },
        { value: "Academic", label: languageText.AcademicCommittee, icon: "heroicons:academic-cap-solid" },
        { value: "Culture", label: languageText.CultureCommittee, icon: "mdi:religion-islamic" },
        { value: "Sports", label: languageText.SportCommittee, icon: "fluent-mdl2:more-sports" },
        { value: "Media", label: languageText.MediaCommittee, icon: "ic:outline-camera" },
        { value: "WomenAffairs", label: languageText.WomenCommittee, icon: "healthicons:woman" },
        { value: "PR", label: languageText.PublicRelation, icon: "material-symbols:public" },
        { value: "HR", label: languageText.HR, icon: "fluent:people-community-add-20-filled" },
    ];

    const filteredLinks = links
        .map((link) => {
            if (link.dropdown) {
                const filteredDropdown = link.dropdown.filter((subLink) =>
                    subLink.name.toLowerCase().includes(searchQuery)
                );
                if (filteredDropdown.length > 0) {
                    return { ...link, dropdown: filteredDropdown };
                }
            } else if (link.name.toLowerCase().includes(searchQuery)) {
                return link;
            }
            return null;
        })
        .filter(Boolean);


    const { dispatch } = useFormsContext();


    const { data: membersData, loading: membersLoading, error: membersError } = useFetchData(`${api}/api/member`);
    useEffect(() => {
        if (membersData && !membersLoading && !membersError) {
            dispatch({
                type: "SET_ITEM",
                collection: "members",
                payload: membersData,
            });
        }
    }, [membersData, membersLoading, membersError, dispatch]);

    const currentMember = membersData?.find((member) => member?.committee === user?.committee && UserType("All"));


    const handleClick = () => {
        logout()
    }

    return (
        <div className="lg:h-screen">
            <motion.div
                className={`hidden lg:block relative top-30 left-0 bg-darktheme2  dark:ring-2 ring-whitetheme lg:h-170 text-whitetheme 
                    ${isOpen ? "w-64" : "w-20"}
                    ${language === "en" ? "rounded-r-xl" : "rounded-l-xl"}`}
                initial={{ width: 256 }}
                animate={{ width: isOpen ? 256 : 80 }}
            >
                {/* Logo and Title */}
                <div className={`flex items-center duration-300 ease-in-out p-4 ${isOpen ? "justify-between" : "justify-center"}`}>
                    <div className="flex items-center space-x-2">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className={`h-8 w-8 duration-300 ease-in-out ${!isOpen && "mx-auto"}`}
                        />
                        {isOpen && <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: isOpen ? 1 : 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-bold">{languageText.ISSEgyptAdmin}</motion.span>}
                    </div>
                    <button
                        className="block "
                        onClick={toggleNavbar}
                    >
                        <Icon icon="solar:hamburger-menu-broken" className={`text-2xl top-10 p-1 absolute bg-darktheme2  ring-4 ring-whitetheme rounded-full cursor-pointer hover:scale-120 duration-300 ease-in-out
                            ${language === "en" ? "-right-3" : "-left-3"}
                            `} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className={`px-4 py-2 ${!isOpen && "hidden"}`}>
                    <input
                        type="text"
                        placeholder={languageText.Search}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-3 py-2 rounded-md bg-darktheme text-whitetheme focus:outline-none duration-500 focus:ring-3 ring-darktheme border-2 border-darktheme2"
                    />
                </div>

                {/* Links */}
                <nav className="mt-4">
                    {filteredLinks.map((link) => (
                        <div key={link.name}>
                            <Link to={link.path}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-redtheme duration-300 ${location.pathname === link.path ? "bg-whitetheme text-darktheme2" : ""
                                    } ${!isOpen && "justify-center"}`}
                                onClick={(e) => {
                                    if (link.dropdown) {
                                        e.preventDefault()
                                        setDropdownOpen(dropdownOpen === link.name ? null : link.name);
                                    } else {
                                        setActiveLink(link.name);
                                    }
                                }}
                            >

                                <Icon icon={link.icon} className="text-xl" />
                                {isOpen && <span className={`${language === "en" ? "ml-4" : "mr-4"}`}>{link.name}</span>}
                                {link.dropdown && isOpen && (
                                    <Icon
                                        icon={
                                            dropdownOpen === link.name
                                                ? "solar:alt-arrow-up-bold-duotone"
                                                : "solar:alt-arrow-down-bold-duotone"
                                        }
                                        className={`text-sm 
                                            ${language === "en" ? "ml-auto" : "mr-auto"}`}
                                    />
                                )}

                            </Link>
                            <AnimatePresence>
                                {link.dropdown && dropdownOpen === link.name && (
                                    <motion.div
                                        className={`!items-center flex flex-col ${isOpen && (language === "en" ? "pl-8 items-start" : "pr-8 items-start")}`}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {link.dropdown.map((subLink) => (
                                            <Link to={subLink.path}
                                                key={subLink.name}
                                                className={`flex items-center  px-4 py-2 cursor-pointer  hover:bg-redtheme duration-300 gap-2 w-full ${location.pathname === subLink.path ? "bg-whitetheme text-darktheme2" : ""}
                                                ${isOpen ? "" : "justify-center"}
                                                `}
                                            >
                                                <Icon icon={subLink.icon} className="text-xl" />
                                                {isOpen && <span>{subLink.name}</span>
                                                }
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {setCommitteeType && UserType("Secretary") && <div className="absolute bottom-20 w-full p-4">
                    {membersLoading ? (
                        <div className="w-full justify-center flex">
                            <SmallLoader />
                        </div>
                    ) : (
                        isOpen && <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: isOpen ? 1 : 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col">
                            <SelectField
                                options={committeList}
                                placeholder={languageText.ChooseCommittee}
                                iconValue="fluent:people-team-16-filled"
                                icon="fluent:people-team-16-regular"
                                language={language}
                                languageText={languageText}
                                setValue={setCommitteeType}
                                regex={null}
                            // value={user?.committee}
                            />
                        </motion.div>
                    )}
                </div>
                }

                {/* Profile Section */}
                <div className="absolute bottom-0 w-full p-4 border-t  border-gray-700">

                    {membersLoading ? (
                        <div className="w-full justify-center flex">
                            <SmallLoader />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-whitetheme ring-3 ring-whitetheme border-3 border-darktheme2 rounded-full overflow-hidden flex items-center">
                                <img
                                    src={currentMember?.img}
                                    alt="Profile"
                                    className="object-cover"
                                />
                            </div>
                            {isOpen && <motion.div
                                initial={{ scale: 0, x: language === "en" ? -100 : 100 }}
                                animate={{ scale: isOpen ? 1 : 0, x: isOpen ? 0 : language === "en" ? 100 : -100 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col">
                                <span className=" text-lg">{language === "en" ? currentMember?.name : currentMember?.arabicName}</span>
                                <p className="text-sm text-gray-400 -mt-2">
                                    {roleChecker({
                                        languageText: languageText,
                                        committee: currentMember?.committee,
                                        role: currentMember?.type,
                                    })}

                                </p>
                            </motion.div>
                            }


                            {isOpen && <button className={`${language === "en" ? "right-5" : "left-5"} absolute flex text-whitetheme items-center text-xs lg:text-lg gap-2 bg-redtheme p-2 mx-auto rounded-xl border-2 border-darktheme cursor-pointer hover:scale-120 transition duration-300 group`}
                                onClick={handleClick}>
                                <Icon icon="stash:signout-alt" />
                                <div className="inputIconText !bg-radial from-redtheme to-redtheme !text-whitetheme">
                                    {languageText.Logout}
                                </div>
                            </button>}
                        </div>
                    )}
                </div>
            </motion.div>















































































            {/* PHONE VIEW */}
            <div className=" lg:hidden p-4">
                <button
                    className={` ${language === "en" ? "right-5" : "left-5"} fixed flex m-auto justify-center w-fit top-18  z-100 `}
                    onClick={toggleNavbar}
                >
                    <Icon icon="solar:hamburger-menu-broken" className="text-2xl bg-darktheme2/95 ring-3 ring-whitetheme rounded cursor-pointer hover:scale-120 duration-300 ease-in-out text-whitetheme" />
                </button>
                <AnimatePresence mode="wait">
                    <motion.div
                        className={`w-full  fixed top-20 left-0 right-0 bg-darktheme2/95 rounded-xl h-160  text-white z-10  ${isOpen ? "block" : "hidden"
                            }`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                        {/* Logo and Title */}
                        <div className={`flex items-center duration-300 ease-in-out p-4 ${isOpen ? "justify-between" : "justify-center"}`}>
                            <div className="flex items-center space-x-2">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className={`h-8 w-8 duration-300 ease-in-out ${!isOpen && "mx-auto"}`}
                                />
                                <motion.span
                                    className="text-lg font-bold">{languageText.ISSEgyptAdmin}</motion.span>
                            </div>
                        </div>



                        {/* Search Bar */}
                        <div className={`px-4 py-2 ${!isOpen && "hidden"}`}>
                            <input
                                type="text"
                                placeholder={languageText.Search}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 rounded-md bg-darktheme text-whitetheme focus:outline-none duration-500 focus:ring-3 ring-darktheme border-2 border-darktheme2"
                            />
                        </div>

                        {setCommitteeType && UserType("Secretary") && <div className="absolute top-28 w-full p-4">
                            {membersLoading ? (
                                <div className="w-full justify-center flex">
                                    <SmallLoader />
                                </div>
                            ) : (
                                <motion.div
                                    className="flex flex-col">
                                    <SelectField
                                        options={committeList}
                                        placeholder={languageText.ChooseCommittee}
                                        iconValue="fluent:people-team-16-filled"
                                        icon="fluent:people-team-16-regular"
                                        language={language}
                                        languageText={languageText}
                                        setValue={setCommitteeType}
                                        regex={null}
                                    // value={user?.committee}
                                    />
                                </motion.div>
                            )}
                        </div>
                        }


                        {/* Links */}
                        <nav className={UserType("All") && setCommitteeType ? `mt-18` : "mt-4"}>
                            {filteredLinks.map((link) => (
                                <div key={link.name}>
                                    <Link to={link.path}
                                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-redtheme duration-300 ${location.pathname === link.path ? "bg-whitetheme text-darktheme2" : ""
                                            } ${!isOpen && "justify-center"}`}
                                        onClick={(e) => {
                                            if (link.dropdown) {
                                                e.preventDefault()
                                                setDropdownOpen(dropdownOpen === link.name ? null : link.name);
                                            } else {
                                                setActiveLink(link.name);
                                            }
                                        }}
                                    >

                                        <Icon icon={link.icon} className="text-xl" />
                                        {isOpen && <span className={`${language === "en" ? "ml-4" : "mr-4"}`}>{link.name}</span>}
                                        {link.dropdown && isOpen && (
                                            <Icon
                                                icon={
                                                    dropdownOpen === link.name
                                                        ? "solar:alt-arrow-up-bold-duotone"
                                                        : "solar:alt-arrow-down-bold-duotone"
                                                }
                                                className={`text-sm 
                                            ${language === "en" ? "ml-auto" : "mr-auto"}`}
                                            />
                                        )}

                                    </Link>
                                    <AnimatePresence>
                                        {link.dropdown && dropdownOpen === link.name && (
                                            <motion.div
                                                className={`items-center flex flex-col ${isOpen && (language === "en" ? "pl-8 items-start" : "pr-8 items-start")}`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {link.dropdown.map((subLink) => (
                                                    <Link to={subLink.path}
                                                        key={subLink.name}
                                                        className={`flex items-center px-4 py-2 cursor-pointer  hover:bg-redtheme duration-300 gap-2 w-full ${location.pathname === subLink.path ? "bg-whitetheme text-darktheme2" : ""
                                                            }`}
                                                    >
                                                        <Icon icon={subLink.icon} className="text-xl" />
                                                        {isOpen && <span>{subLink.name}</span>
                                                        }
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>



                        {/* Profile Section */}
                        <div className="absolute bottom-0 w-full p-4 border-t  border-gray-700">

                            {membersLoading ? (
                                <div className="w-full justify-center flex">
                                    <SmallLoader />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-whitetheme ring-3 ring-whitetheme border-3 border-darktheme2 rounded-full overflow-hidden flex items-center">
                                        <img
                                            src={currentMember?.img}
                                            alt="Profile"
                                            className="object-cover"
                                        />
                                    </div>
                                    {isOpen && <motion.div
                                        initial={{ scale: 0, x: language === "en" ? -100 : 100 }}
                                        animate={{ scale: isOpen ? 1 : 0, x: isOpen ? 0 : language === "en" ? 100 : -100 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col">
                                        <span className=" text-lg">{language === "en" ? currentMember?.name : currentMember?.arabicName}</span>
                                        <p className="text-sm text-gray-400 -mt-2">
                                            {roleChecker({
                                                languageText: languageText,
                                                committee: currentMember?.committee,
                                                role: currentMember?.type,
                                            })}

                                        </p>
                                    </motion.div>
                                    }
                                    {isOpen && <button className={` ${language === "en" ? "right-5" : "left-5"}absolute flex text-whitetheme items-center text-xs lg:text-lg gap-2 bg-redtheme p-2 mx-auto rounded-xl border-2 border-darktheme cursor-pointer hover:scale-120 transition duration-300 group`}
                                        onClick={handleClick}>
                                        <Icon icon="stash:signout-alt" />{languageText.Logout}
                                    </button>}
                                </div>
                            )}
                        </div>
                    </motion.div>



                </AnimatePresence>



            </div>
            <AnimatePresence>
                {logoutSuccess && <SuccessMessage languageText={languageText} text={logoutSuccess} setValue={setLogoutSuccess} language={language} />}
            </AnimatePresence>
        </div>
    );
};

export default AdminNavBar;