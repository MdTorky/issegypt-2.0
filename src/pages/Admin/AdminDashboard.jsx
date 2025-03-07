// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import useFetchData from "../../hooks/useFetchData";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserType from "../../components/UserType";
import Loader from "../../components/loaders/Loader";
import { Icon } from "@iconify/react";



const AdminDashboard = ({ languageText, language, api }) => {

    const { dispatch, forms, members } = useFormsContext();
    const { user } = useAuthContext();
    const [committeeType, setCommitteeType] = useState(user?.committee);


    useEffect(() => {
        if (user?.committee) {
            setCommitteeType(user.committee);
        }
    }, [user]);


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

    const { data: formsData, loading: formsLoading, error: formsError } = useFetchData(`${api}/api/forms`);
    useEffect(() => {
        if (formsData && !formsLoading && !formsError) {
            dispatch({
                type: "SET_ITEM",
                collection: "forms",
                payload: formsData,
            });
        }
    }, [formsData, formsLoading, formsError, dispatch]);

    const isUserType = UserType("All"); // Move outside render logic

    const currentMember = membersData?.find(
        (member) => member?.committee === user?.committee && isUserType
    );

    // Get All Normal Members
    const allMembersFilter = membersData?.filter((member) => member.type === 'Member' || member.type === 'VicePresident' || member.type === 'BestMember').sort((a, b) => a.name.localeCompare(b.name));

    // Get All Normal Members based on the Logged User Committee and Select Committee Type
    const currentCommitteeMembersFilter = membersData?.filter((member) => member.committee === committeeType && (member.type === 'Member' || member.type === 'VicePresident' || member.type === 'BestMember')).sort((a, b) => a.name.localeCompare(b.name));

    // Get All Forms based on the Logged User Committee and Select Committee Type
    const currentCommitteeFormsFilter = formsData?.filter((form) => form.type === committeeType);



    // Display Forms and Members Based on All Committee Type Choice
    const AllFormsDisplay = committeeType === "All" ? forms : currentCommitteeFormsFilter;
    const AllMembersDisplay = committeeType === "All" ? allMembersFilter : currentCommitteeMembersFilter;




    return (
        <div className="lg:flex h-screen">
            {/* Navbar */}
            <AdminNavBar languageText={languageText} language={language} api={api} setCommitteeType={setCommitteeType} />

            {/* Main Content */}
            {membersLoading || formsLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <Loader text={languageText.Loading} />
                </div>
            ) : (
                <div className=" mt-20 flex flex-col gap-10 p-8 overflow-y-auto overflow-x-hidden w-full">
                    <div className="text-center lg:text-start">
                        <h1 className="text-5xl font-bold text-redtheme">{languageText.Welcome} <span className="text-darktheme dark:text-whitetheme">{language === "en" ? currentMember?.name : currentMember?.arabicName}</span></h1>
                        <p className="text-gray-600">
                            {languageText.AdminDesc}
                        </p>
                    </div>
                    <div className="w-full lg:justify-end justify-center flex flex-wrap gap-3 lg:gap-10">

                        <div className="adminDashboardCard group">
                            <div className="flex flex-col">
                                <p className="lg:text-2xl text-gray-300">{languageText.TotalMembers}</p>
                                <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">{AllMembersDisplay.length}</h1>
                            </div>
                            <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                                <Icon icon="fluent:people-32-filled" />
                            </div>
                        </div>

                        <div className="adminDashboardCard group">
                            <div className="flex flex-col">
                                <p className="lg:text-2xl text-gray-300">{languageText.TotalForms}</p>
                                <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">{AllFormsDisplay.length}</h1>
                            </div>
                            <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                                <Icon icon="fluent:form-multiple-20-filled" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
