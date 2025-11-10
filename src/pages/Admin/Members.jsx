import React, { useEffect, useState } from 'react'
import SearchInput from '../../components/formInputs/SearchInput';
import SelectField from '../../components/formInputs/SelectField';
import useFetchData from "../../hooks/useFetchData";
import { useFormsContext } from '../../hooks/useFormContext';
import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from '../../components/loaders/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from '../../components/ScrollToTop';
import ISSEgyptMember from '../../components/cards/ISSEgyptMemberCard';

const Members = ({ languageText, language, api }) => {

    const [committee, setCommittee] = useState("")
    const [searchQuery, setSearchQuery] = useState("");

    const { dispatch } = useFormsContext();

    const { data: membersData, loading, error } = useFetchData(`${api}/api/member`);
    useEffect(() => {
        if (membersData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "members",
                payload: membersData,
            });
        }
    }, [membersData, error, dispatch]);


    const committeeOptions = [
        { value: "", label: languageText.All },
        { value: "ISS Egypt", label: languageText.President, icon: "emojione-monotone:flag-for-egypt" },
        { value: "Vice", label: languageText.VicePresident, icon: "fontisto:person" },
        { value: "Secretary", label: languageText.Secretary, icon: "mingcute:document-2-fill" },
        { value: "Treasurer", label: languageText.Treasurer, icon: "fluent:money-16-filled" },
        { value: "Social", label: languageText.SocialPresident, icon: "solar:people-nearby-bold" },
        { value: "Academic", label: languageText.AcademicPresident, icon: "heroicons:academic-cap-solid" },
        { value: "Culture", label: languageText.CulturePresident, icon: "mdi:religion-islamic" },
        { value: "Sports", label: languageText.SportPresident, icon: "fluent-mdl2:more-sports" },
        { value: "Media", label: languageText.MediaPresident, icon: "ic:outline-camera" },
        { value: "WomenAffairs", label: languageText.WomenPresident, icon: "healthicons:woman" },
        { value: "PR", label: languageText.PublicRelation, icon: "material-symbols:public" },
        { value: "HR", label: languageText.HR, icon: "fluent:people-community-add-20-filled" },
    ];


    const filteredAndSortedMembers = membersData
        ?.filter((member) => {
            const searchRegex = new RegExp(searchQuery, 'i');
            return (
                // 1. Existing search filter by name/arabicName
                (searchRegex.test(member.name) || searchRegex.test(member.arabicName)) &&
                // 2. Existing committee filter
                (!committee || member.committee === committee) &&
                // 3. NEW: Filter out members with committee 'Admin'
                member.committee !== 'Admin'
            )
        })
        // 4. NEW: Sort members by memberId in ascending order
        ?.sort((a, b) => {
            // Assuming memberId is a number or can be reliably compared as one
            return a.memberId - b.memberId;
        });

    // We now use filteredAndSortedMembers in the rendering logic
    const membersToDisplay = filteredAndSortedMembers;



    return (
        <div>
            <div className="relative w-full flex items-center justify-center bg-cover bg-center"

                style={{ backgroundImage: "url('')" }}>
                {/* Content */}
            </div>

            <div className='my-10 flex flex-col justify-center items-center gap-10 mt-30'>

                {/* <h1 className={`formTitle !text-7xl lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4 ${language === "ar" && "flex-row-reverse "}`}>{languageText.ISSEGYPT} <span className='text-darktheme2 dark:text-whitetheme2'>{languageText.Gallery}</span></h1> */}
                <h1
                    className={`formTitle !text-7xl justify-center lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4`}>
                    {(() => {
                        const words = languageText.ISSEGYPTMembers.split(" ");
                        const lastWord = words.pop(); // Remove the last word
                        return (
                            <>
                                {words.join(" ")} {/* Join remaining words */}
                                {words.length > 0 && " "} {/* Add space if needed */}
                                <span className="text-darktheme2 dark:text-whitetheme2">{lastWord}</span>
                            </>
                        );
                    })()}
                </h1>
                <div className='lg:w-2/4 w-full flex  lg:flex-row justify-center items-center z-20 gap-2 lg:gap-10 flex-col-reverse'>
                    <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />
                    <div className='w-[40%] lg:w-[30%]'>
                        <SelectField
                            options={committeeOptions}
                            placeholder={languageText.ChooseCommittee}
                            iconValue="fluent:people-team-16-filled"
                            icon="fluent:people-team-16-regular"
                            language={language}
                            languageText={languageText}
                            setValue={setCommittee}
                            regex={null}
                            value={committee}
                        />
                    </div>



                </div>

                {loading ? (
                    <Loader text={languageText.Loading} />
                ) :
                    !membersToDisplay || membersToDisplay.length <= 0 ? (
                        <div className="w-full flex justify-center items-center p-5 rounded-xl text-whitetheme">
                            <div className="noData text-4xl lg:text-8xl">
                                <Icon icon="iconamoon:dislike-fill" />{languageText.NoEventYet}
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence>

                            <motion.div
                                className="flex flex-wrap gap-15 items-center justify-center"
                                initial="hidden"
                                whileInView="visible"
                                // viewport={{ once: true }}
                                variants={{
                                    visible: { transition: { staggerChildren: 0.2 } },
                                }}
                                transition={{ duration: 0.5 }}

                            >
                                {membersToDisplay.map((member) => (

                                    <motion.div
                                    >
                                        <ISSEgyptMember member={member} language={language} languageText={languageText} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
            </div>
            <ScrollToTop languageText={languageText} />


        </div>
    )
}

export default Members