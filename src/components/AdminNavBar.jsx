import React, { useState, useEffect } from "react";
import UserType from "./UserType";
import useFetchData from "../hooks/useFetchData";
import { useAuthContext } from '../hooks/useAuthContext';
import { useFormsContext } from '../hooks/useFormContext';
import { useLogout } from "../hooks/useLogout";
import SuccessMessage from "./formInputs/SuccessMessage";
import { AnimatePresence } from "framer-motion";

// Import new components
import AdminSidebar from "./AdminSidebar";
import AdminMobileMenu from "./AdminMobileMenu";
import { useLocation } from "react-router-dom";

const AdminNavBar = ({ languageText, api, language, setCommitteeType }) => {
    const { user } = useAuthContext();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Dashboard");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleNavbar = () => setIsOpen(!isOpen);

    const { logout, logoutSuccess, setLogoutSuccess } = useLogout(languageText);

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
        // {
        //     name: languageText.Members,
        //     icon: "fluent:people-20-filled",
        //     dropdown: [
        //         { name: languageText.MyMembers, path: "", icon: "fluent:people-eye-20-filled" },
        //     ],
        // },
        ...(UserType("All") ? [
            {
                name: "E-GPT Dashboard",
                icon: "fluent:bot-sparkle-16-filled",
                path: "/egptDashboard"
            },
            {
                name: languageText.Internships,
                icon: "hugeicons:permanent-job",
                dropdown: [
                    { name: languageText.AddInternship, path: "/addIntern", icon: "mdi:office-building-plus" },
                ],
            },
            {
                name: languageText.Gallery,
                icon: "solar:gallery-wide-bold",
                dropdown: [
                    { name: languageText.AddGallery, path: "/addGallery", icon: "fluent:image-add-20-filled" },
                ],
            },
            {
                name: languageText.Services,
                icon: "ri:service-fill",
                dropdown: [
                    { name: languageText.AddService, path: "/addService", icon: "fluent:bot-add-16-filled" },
                    { name: languageText.AddHelpingHand, path: "/addHelpingHand", icon: "mdi:cog" },
                ],
            },
            {
                name: languageText.Products,
                icon: "game-icons:clothes",
                dropdown: [
                    { name: languageText.ProductsData, path: "/productsData", icon: "mage:package-box-fill" },
                ],
            },

        ] : []),
        ...(UserType("Admin") ? [
            {
                name: languageText.Members,
                icon: "fluent:people-20-filled",
                path: "/members"
            },]
            : []),
        // ...(UserType("Social") ? [{
        //     name: languageText.EmojiQuiz,
        //     icon: "fluent:emoji-hint-16-filled",
        //     dropdown: [
        //         { name: languageText.HostPage, path: "/host/ISSEMOJI", icon: "carbon:bastion-host" },
        //         { name: languageText.EditPoints, path: "/editpoints/ISSEMOJI", icon: "mdi:progress-star-four-points" },
        //         { name: languageText.Results, path: "/results/ISSEMOJI", icon: "game-icons:podium" },
        //     ],
        // }
        // ] : []),
    ].filter(Boolean);


    const committeList = [
        ...(UserType("Top2") ? [{
            label: languageText.All,
            value: "All",
            icon: "fluent:select-all-off-16-filled"
        }] : []),
        ...(UserType("All") ? [{
            label: user?.committee,
            value: user?.committee,
            icon: user?.committee === "ISS Egypt" ? "emojione-monotone:flag-for-egypt" : user?.committee === "Vice" ? "fontisto:person" : user?.committee === "Secretary" ? "mingcute:document-2-fill" : "fluent:money-16-filled"
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

    const currentMember = membersData?.find((member) => member?.committee === user?.committee);


    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <AdminSidebar
                isOpen={isOpen}
                toggleNavbar={toggleNavbar}
                languageText={languageText}
                language={language}
                filteredLinks={filteredLinks}
                searchQuery={searchQuery}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleSearch={handleSearch}
                currentMember={currentMember}
                membersLoading={membersLoading}
                setCommitteeType={setCommitteeType}
                UserType={UserType}
                committeList={committeList}
                handleLogout={handleLogout}
                location={location}
            />

            <AdminMobileMenu
                isOpen={isOpen}
                toggleNavbar={toggleNavbar}
                languageText={languageText}
                language={language}
                filteredLinks={filteredLinks}
                searchQuery={searchQuery}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleSearch={handleSearch}
                currentMember={currentMember}
                membersLoading={membersLoading}
                setCommitteeType={setCommitteeType}
                UserType={UserType}
                committeList={committeList}
                handleLogout={handleLogout}
                location={location}
            />

            {/* Wrapper to push content when sidebar is open (Desktop) */}
            {/* Note: In many admin dashboards, content is pushed. 
                 Since the original implementation pushed content via a div with width, 
                 we might need a placeholder div if the parent layout depends on it. 
                 The Sidebar is 'fixed', so we need a spacer. 
             */}
            {/* <div className={`hidden lg:block transition-all duration-300 ease-spring ${isOpen ? "w-[280px]" : "w-[85px]"} shrink-0`}></div> */}

            <AnimatePresence>
                {logoutSuccess && <SuccessMessage languageText={languageText} text={logoutSuccess} setValue={setLogoutSuccess} language={language} />}
            </AnimatePresence>
        </>
    );
};

export default AdminNavBar;