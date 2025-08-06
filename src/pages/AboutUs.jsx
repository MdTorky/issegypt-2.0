import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import logo from '../assets/img/logo.png'
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import useFetchData from "../hooks/useFetchData";
import { useFormsContext } from '../hooks/useFormContext';
import Loader from '../components/loaders/Loader'
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import roleChecker from "../components/MemberLoader";
import FacultyCard from '../components/cards/FacultyCard';
import ImageCarousel from '../components/ImageCarousel';
import images from '../data/events.json'
import ScrollToTop from '../components/ScrollToTop';

const AboutUs = ({ language, languageText, api }) => {
    const shouldReduceMotion = useReducedMotion();
    const {
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
    } = useScrollAnimations();


    const [committeeType, setCommitteeType] = useState("Board")
    const [memberCommittee, setMemberCommittee] = useState("ISS Egypt")
    const [eventType, setEventType] = useState("Social")
    const [memberKey, setMemberKey] = useState(0);

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


    const selectedMember = membersData?.find(
        (member) => member.committee === memberCommittee && member.type === "President"
    ) || null;

    useEffect(() => {
        if (selectedMember) {
            setMemberKey((prev) => prev + 1); // Increment key to trigger re-animation
        }
    }, [selectedMember]);


    const committees = [
        { name: languageText.President, background: "https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Board", committee: "ISS Egypt" },
        { name: languageText.VicePresident, background: "https://t4.ftcdn.net/jpg/04/89/68/23/360_F_489682374_ckc0OVyT6Av0NGcuYbwBSCxy62blF4CQ.jpg", type: "Board", committee: "Vice" },
        { name: languageText.Secretary, background: "https://img.pikbest.com/wp/202408/geometric-abstract-pattern-wave-patterns-on-space-texture-background-a-simple-illustration_9910582.jpg!w700wp", type: "Board", committee: "Secretary" },
        { name: languageText.Treasurer, background: "https://i0.wp.com/picjumbo.com/wp-content/uploads/abstract-smoke-background-free-image.jpeg?w=600&quality=80", type: "Board", committee: "Treasurer" },
        { name: languageText.Academic, background: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Main", committee: "Academic" },
        { name: languageText.Social, background: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Main", committee: "Social" },
        { name: languageText.Culture, background: "https://images.unsplash.com/photo-1487800940032-1cf211187aea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Main", committee: "Culture" },
        { name: languageText.Sport, background: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Main", committee: "Sports" },
        { name: languageText.Media, background: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Sub", committee: "Media" },
        { name: languageText.HR, background: "https://images.unsplash.com/photo-1604373337044-8529c3632763?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Sub", committee: "HR" },
        { name: languageText.Women, background: "https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Sub", committee: "WomenAffairs" },
        { name: languageText.PublicRelation, background: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", type: "Sub", committee: "PR" }
    ]


    const committeeTypes = [
        { name: languageText.TheBoard, background: "https://i0.wp.com/picjumbo.com/wp-content/uploads/soft-smoke-abstract-background-free-image.jpeg?w=600&quality=80", committee: "Board" },
        { name: languageText.MainCommittees, background: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", committee: "Main" },
        { name: languageText.SubCommittees, background: "https://images.unsplash.com/photo-1513346940221-6f673d962e97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", committee: "Sub" },
    ]

    const achievements = [
        { name: "Best ISS for 2024", aName: "أفضل أتحاد لسنة 2024", img: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740618997/Home%20Page/Awards_s3qcjv.jpg", icon: "material-symbols:award-star-rounded", desc: "ISS Egypt has won several awards in 2024, including: \n\n- First place for the best cultural booth at the level of Malaysian universities, honored by the Minister of Higher Education \n- First place for the best union in UTM for the year 2023/2024 AD\n- Leadership Award for Eng. Abdul Rahman Reda, head of ISS Egypt for 2024", aDesc: "الاتحاد قد حصل على عدة جوائز لسنة 2024 منها..\n\n - المركز الأول لأفضل بوث ثقافي على مستوى الجامعات الماليزية بتكريم وزير التعليم العالي\n - المركز الأول لأفضل اتحاد في UTM لعام ٢٠٢٣/٢٠٢٤ م\n - جائزة القيادة  للمهندس عبدالرحمن رضا رئيس الاتحاد لعام 2024" },
        { name: "Tioman Island Trip", aName: "رحلة جزيرة تيومان", img: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740620267/Home%20Page/Tioman_copy_ca6isk.png", icon: "mdi:island", desc: "ISS Egypt organized the largest student-organized trip in UTM, a 3 trip to Tioman Island that featured a variety of activities including as snorkeling, kayaking, ferry rides, beach activities, and much more.", aDesc: "نظم التحاد المصري أكبر رحلة طلابية منظمة في جامعة تورنتو ميسيسوجا، وهي رحلة لمدة ثلاثة أيام إلى جزيرة تيومان والتي تضمنت مجموعة متنوعة من الأنشطة بما في ذلك الغطس والتجديف بالكاياك وركوب العبارات وأنشطة الشاطئ وأكثر من ذلك بكثير." },
        { name: "Best Booth in Malaysia", aName: "أفضل بوث في ماليزيا", img: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740620033/Home%20Page/Magnet_sxznvr.jpg", icon: "ion:magnet", desc: "ISS Egypt 2023/2024 won first place at the level of Malaysian universities in the MAGNET International Student Unions Gathering, in the presence and honoring of the Minister of Higher Education and the university officials.", aDesc: "حصل الاتحاد المصري لعام 2023/2024 على المركز الاول على مستوى الجامعات الماليزية في تجمع الاتحادات الطلابية الدولية MAGNET وذلك بحضور وتكريم السيد وزير التعليم العالي والسادة المسؤلين في الجامعة" },
    ]


    const events = [
        { name: languageText.SocialCommittee, committee: "Social", background: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: languageText.AcademicCommittee, committee: "Academic", background: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: languageText.CultureCommittee, committee: "Culture", background: "https://images.unsplash.com/photo-1487800940032-1cf211187aea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: languageText.SportCommittee, committee: "Sport", background: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: languageText.WomenCommittee, committee: "Women", background: "https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: languageText.General, committee: "General", background: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ]

    const { data: galleryData, galleryLoading, galleryError } = useFetchData(`${api}/api/gallery`);
    useEffect(() => {
        if (galleryData && !galleryLoading && !galleryError) {
            dispatch({
                type: "SET_ITEM",
                collection: "galleries",
                payload: galleryData,
            });
        }
    }, [galleryData, galleryLoading, galleryError, dispatch]);


    const filteredImages = galleryData?.length
        ? galleryData.filter((image) => image?.committee === eventType).sort((a, b) => a.time - b.time)
        : [];


    // setMemberCommittee
    const MemberButton = ({ committee, setValue, value }) => {
        return (
            <motion.button
                variants={InputChildVariants}
                whileHover={{ scale: 1.1 }}
                // whileTap={{ scale: 0.5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                onClick={() => setValue(committee?.committee)}
                className={` relative ring-6 dark:ring-whitetheme/80 border-5 border-whitetheme dark:border-darktheme2 rounded-br-2xl rounded-tl-2xl bg-cover bg-center 2xl:w-[400px] lg:w-[300px] md:w-[300px] w-[150px] py-3 px-3 cursor-pointer backdrop-brightness-50 overflow-hidden ${committee?.committee === value ? "!ring-redtheme scale-105 rounded-none" : ""}`}
                style={{ backgroundImage: `url(${committee?.background})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-50" />

                {/* Button Text */}
                <h2 className="relative text-sm md:text-4xl md:leading-10 leading-3 text-center text-white">
                    {committee?.name}
                </h2>
            </motion.button>
        );
    };





    const EventsCard = ({ event }) => {
        return (
            <motion.div
                variants={InViewVariant}
                className=' flex flex-col gap-6 lg:w-1/3 p-3 bg-whitetheme dark:bg-darktheme  rounded-4xl shadow-2xl group ' >
                <div className='relative bg-cover bg-center  '>

                    <img src={event.img} alt="" className=' flex items-center rounded-4xl object-cover lg:h-[400px] w-full lg:group-hover:h-[500px] transition-all duration-300 ease-in-out' />
                    <div className={`absolute -bottom-5 ring-5 ring-whitetheme dark:ring-darktheme rounded-full bg-redtheme text-whitetheme p-3 text-3xl transition-all duration-300 ${language === "en" ? "left-6" : "right-6"}`}>
                        <Icon icon={event.icon} />
                    </div>
                </div>
                <div className="px-3">
                    <h1 className=' text-darktheme2 dark:text-whitetheme text-3xl'>{language === "en" ? event.name : event.aName}</h1>
                    <p className='text-gray-400 whitespace-break-spaces'>{language === "en" ? event.desc : event.aDesc}</p>
                </div>

            </motion.div >
        )
    }

    const handleLinkedInClick = (member) => {
        if (member.linkedIn) {
            window.open(member.linkedIn);
        } else {
            alert(languageText.noLinkedIn)
            return
        }
    };

    const ref = useRef(null);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const isInView = useInView(ref);
    const isInView1 = useInView(ref1);
    const isInView2 = useInView(ref2);
    const isInView3 = useInView(ref3);

    const InputChildVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                staggerChildren: 0.5
            }
        },
        exit: {
            opacity: 0, y: 50, transform: {
                staggerChildren: 0.5
            }
        },
        inView: {
            x: isInView3 ? 1 : 0
        }
    };

    const InViewVariant = {
        hidden: { opacity: 0, y: -100 }, // Start hidden, move up
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.5 },
        },
    }


    return (
        <div className='justify-center'>
            <motion.div className="relative w-full flex-col bg-cover bg-center ">
                <div className='flex lg:flex-row flex-col-reverse lg:justify-between items-center lg:items-end lg:px-30 px-10'>
                    <motion.div
                        initial={{ x: language === "en" ? -200 : 200, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: language === "en" ? -200 : 200, opacity: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                    >
                        <h1 className='lg:mt-40 text-darktheme dark:text-whitetheme lg:text-7xl text-6xl lg:text-start text-center'>{languageText.ISSEGYPTUTM}, <span className='text-redtheme'>{languageText.WhoAreWe}</span></h1>
                        <p className='mb-10 text-gray-400 text-2xl lg:text-start text-center'>{languageText.DiscoverOurJoruney}</p>
                    </motion.div>
                    <motion.img
                        initial={{ x: language === "en" ? 200 : -200, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: language === "en" ? 200 : -200, opacity: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 200 }}

                        src={logo} alt="" className='mt-20 lg:mt-0 w-[250px]' />
                    {/* <div className='w-[100px]'>
                    </div> */}
                </div>

                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "90%", opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
                    className="relative z-20 flex  m-auto items-end w-[90%] h-130 rounded-4xl bg-[url(https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740087762/Home%20Page/Eid_kgoenn.jpg)] bg-cover bg-bottom ring-3 ring-darktheme border-5 border-whitetheme dark:border-darktheme2 dark:ring-whitetheme ">
                    <div className='bg-darktheme/50 absolute w-full h-full rounded-4xl '></div>
                    <div className='p-5 z-10'>
                        <AnimatePresence>
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                // exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
                                className="isolate  w-full rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 text-sm md:text-2xl  mx-auto text-whitetheme2 p-5 relative ">
                                <h1 className='z-10'>
                                    {languageText.AboutDesc}
                                    <span className='text-whitetheme italic'>
                                        {languageText.JoinShaping}
                                    </span>
                                </h1>
                                <motion.div
                                    initial={{ y: 200, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 200, opacity: 0 }}
                                    transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                                    className='text-sm rounded-lg bg-redtheme text-whitetheme p-2 absolute -top-5'>
                                    {languageText.ISSEGYPTUTM}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </motion.div>
            </motion.div >



            {/* Achievements */}
            <motion.div
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"} // Trigger animation when in view
                variants={{
                    visible: { transition: { staggerChildren: 0.5 } }, // Stagger effect
                }}
                className='flex lg:flex-row flex-col mt-6 px-6 lg:px-30 justify-center gap-5'>
                <motion.div
                    variants={InViewVariant}
                    whileHover={{ width: "100%", transition: { duration: 0.7, type: "spring" } }}
                    className='flex justify-between items-center w-full lg:w-1/3 bg-[#D3D3D3]/50 rounded-2xl p-10 ring-3 ring-darktheme border-5 border-whitetheme dark:border-darktheme2 dark:ring-whitetheme'>
                    <div>
                        <h1 className='text-6xl tracking-wider text-darktheme2 '>230+</h1>
                        <p className='text-2xl text-gray-400'>{languageText.EventsCreated}</p>
                    </div>
                    <Icon icon="mdi:event-multiple-check" className='text-7xl text-darktheme2' />
                </motion.div>
                <motion.div
                    variants={InViewVariant}
                    whileHover={{ width: "100%", transition: { duration: 0.7, type: "spring" } }} className='flex justify-between items-center w-full lg:w-1/3 bg-[#D3D3D3]/50 rounded-2xl p-10 ring-3 ring-darktheme border-5 border-whitetheme dark:border-darktheme2 dark:ring-whitetheme'>
                    <div>
                        <h1 className='text-6xl tracking-wider text-darktheme2'>400+</h1>
                        <p className='text-2xl text-gray-400'>{languageText.EgyptianStudents}</p>
                    </div>
                    <Icon icon="fluent:people-queue-20-filled" className='text-7xl text-darktheme2' />
                </motion.div>
                <motion.div
                    variants={InViewVariant}
                    whileHover={{ width: "100%", transition: { duration: 0.7, type: "spring" } }} className='flex justify-between items-center w-full lg:w-1/3 bg-darktheme2/90 rounded-2xl p-10 ring-3 ring-darktheme border-5 border-whitetheme dark:border-darktheme dark:ring-whitetheme'>
                    <div>
                        <h1 className='text-6xl tracking-wider text-whitetheme'>50+</h1>
                        <p className='text-2xl text-gray-400'>{languageText.AwardsWon}</p>
                    </div>
                    <Icon icon="flowbite:award-solid" className='text-7xl text-whitetheme' />
                </motion.div>
            </motion.div>



            {/* Know the Team */}
            <div
                className='lg:my-10 flex flex-col justify-center items-center gap-2 lg:gap-10 mt-20'>
                <motion.h1

                    animate={{
                        y: isInView1 ? 0 : -100,
                        opacity: isInView1 ? 1 : 0,
                        transition: { duration: 0.9, type: "spring", stiffness: 100 }
                    }}
                    className={`formTitle !text-6xl justify-center lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4`}>
                    {(() => {
                        const words = languageText.KnowTeam.split(" ");
                        const lastWord = words.pop(); // Remove the last word
                        return (
                            <>
                                {words.join(" ")}
                                {words.length > 0 && " "}
                                <span className="text-darktheme2 dark:text-whitetheme2">{lastWord}</span>
                            </>
                        );
                    })()}
                </motion.h1>

                <div
                    ref={ref1}
                    className=' flex flex-col lg:flex-row justify-between items-center w-full md:p-10 2xl:px-35 gap-20 lg:gap-0'>

                    {/* Left Side*/}
                    <AnimatePresence>
                        <motion.div
                            // initial={{ x: language === "en" ? -100 : 100, opacity: 0 }}
                            // animate={{ x: 0, opacity: 1 }}
                            // exit={{ x: language === "en" ? -100 : 100, opacity: 0 }}
                            // transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            animate={{
                                x: isInView1 ? 0 : language === "en" ? -100 : 100,
                                opacity: isInView1 ? 1 : 0,
                                transition: { duration: 0.5, type: "spring", stiffness: 200, delay: 0.2 }
                            }}
                            className='flex flex-col lg:gap-2 justify-center '>
                            <p className='text-2xl text-redtheme dark:text-whitetheme text-center mb-3 '> {languageText.ChooseCommittee}</p>
                            <motion.div
                                className='flex flex-row flex-wrap lg:flex-col justify-center !items-center w-full m-auto gap-5'>
                                {committeeTypes.map((committee) => (
                                    <MemberButton committee={committee} setValue={setCommitteeType} value={committeeType} />

                                ))}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Middle Side */}
                    {loading ? (
                        <Loader text={languageText.Loading} />
                    ) : selectedMember && (
                        <motion.div
                            animate={{
                                scale: isInView1 ? 1 : 0,
                                opacity: isInView1 ? 1 : 0,
                                transition: { duration: 0.5, type: "spring", stiffness: 100, delay: 0.6 }
                            }}

                            className='order-3 lg:order-1 w-full flex flex-col items-center justify-center relative'>
                            <div className=' bg-gradient-to-b from-redtheme2/80 to-transparent rounded-t-[200px] flex justify-center relative w-[300px] h-[350px] md:w-[400px] md:h-[450px] m-auto'>
                                <div className="absolute ring-redtheme2 dark:ring-whitetheme dark:border-darktheme2 border-whitetheme border-10 ring-8 w-full h-full rounded-[40px] md:rounded-4xl rounded-t-[200px] md:rounded-t-[200px]" />
                                <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full h-70 bg-gradient-to-t from-darktheme2 via-darktheme2/90 dark:via-darktheme2 to-transparent z-20 rounded-b-[30px] " >

                                </div>
                                <div className={`absolute text-whitetheme h-fit left-0 right-0 flex text-5xl md:text-7xl m-auto  justify-center text-center  z-0 ${language === "en" ? "w-[95%] top-20" : "w-[50%] top-20"}`}>
                                    {roleChecker({
                                        languageText: languageText,
                                        committee: selectedMember.committee,
                                        role: selectedMember.type,
                                    })}</div>


                                <div className='absolute m-auto w-80 md:w-95 bottom-0 overflow-hidden'>
                                    <AnimatePresence mode='wait'>
                                        <motion.img
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 100, opacity: 0 }}
                                            transition={{ duration: 0.5, type: "spring", stiffness: 100, ease: "easeInOut" }}
                                            key={memberKey}
                                            // onLoad={handleImageLoad}
                                            onError={() => setIsLoading(false)}
                                            src={selectedMember.img} alt=""
                                            // loading="lazy"
                                            className='w-fit overflow-hidden z-10  ' />
                                    </AnimatePresence>

                                </div>

                                {/* Social Media and Name */}
                                <div className='absolute flex justify-between w-[85%] bottom-10 z-20 items-center text-whitetheme m-auto'>
                                    <AnimatePresence mode='wait'>
                                        <motion.h1
                                            initial={{ y: -100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -100, opacity: 0 }}
                                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                                            key={memberKey}

                                            className='text-5xl lg:text-6xl w-[50%] '>{language === "en" ? selectedMember.name : selectedMember.arabicName}
                                        </motion.h1>
                                    </AnimatePresence>
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            initial={{ x: language === "en" ? 50 : -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: language === "en" ? 50 : -50, opacity: 0 }}
                                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                                            key={memberKey}
                                            className='flex flex-col gap-3'>
                                            <motion.div
                                                whileHover={{ scale: 1.2, }}
                                                transition={{ duration: 0.5, }}
                                                className="socailHomeButton flex justify-center !p-1 !text-3xl group !ring-3 ring-whitetheme !rounded-xl"
                                            >
                                                <Link
                                                    onClick={() =>
                                                        window.open(`http://wa.me/${selectedMember.phone}`, "_blank")
                                                    }
                                                >
                                                    <Icon icon="ant-design:whats-app-outlined" />
                                                    <div className={`socailHomeButtonText bg-darktheme2`}>{languageText.WhatsApp}</div>
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.2, }}
                                                transition={{ duration: 0.5 }}
                                                className="socailHomeButton flex justify-center !p-1 !text-3xl group !ring-3 ring-whitetheme !rounded-xl"
                                            >
                                                <Link
                                                    onClick={() =>
                                                        window.open(`mailto:${selectedMember.email}`, "_blank")
                                                    }
                                                >
                                                    <Icon icon="entypo:email" />
                                                    <div className={`socailHomeButtonText bg-darktheme2`}>{languageText.Email}</div>
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.2, }}
                                                transition={{ duration: 0.5 }}
                                                className="socailHomeButton flex justify-center !p-1 !text-3xl group !ring-3 ring-whitetheme !rounded-xl"
                                            >
                                                <Link
                                                    onClick={() =>
                                                        window.open(handleLinkedInClick(selectedMember))
                                                    }
                                                >
                                                    <Icon icon="tabler:brand-linkedin" />
                                                    <div className={`socailHomeButtonText bg-darktheme2`}>{languageText.linkedin}</div>
                                                </Link>
                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>


                            {/* Faculty */}
                            <div className='flex flex-col z-20 mt-5 items-center'>
                                <AnimatePresence mode='wait'>
                                    <motion.h1
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                                        key={memberKey}
                                        className='flex items-center gap-2 text-3xl md:text-4xl bg-gradient-to-t from-darktheme2/80 via-redtheme2 to-transparent text-whitetheme ring-redtheme2 dark:ring-whitetheme ring-6 border-4 border-whitetheme dark:border-darktheme2 px-5 py-2 rounded-2xl'>
                                        <FacultyCard languageText={languageText} faculty={selectedMember.faculty} />
                                    </motion.h1>
                                </AnimatePresence>
                                <p className='flex items-center gap-2 text-2xl text-redtheme'></p>
                            </div>
                        </motion.div>
                    )}

                    {/* Right Side */}
                    <motion.div
                        animate={{
                            x: isInView1 ? 0 : language === "en" ? 100 : -100,
                            opacity: isInView1 ? 1 : 0,
                            transition: { duration: 0.5, type: "spring", stiffness: 200, delay: 0.4 }
                        }}
                        // initial={{ x: language === "en" ? 100 : -100, opacity: 0 }}
                        // animate={{ x: 0, opacity: 1 }}
                        // exit={{ x: language === "en" ? 100 : -100, opacity: 0 }}
                        // transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                        className='flex flex-col gap-4 md:mb-0 mb-20 z-30 order-2 lg:order-3  '>
                        <p className='text-2xl text-redtheme dark:text-whitetheme text-center'>{languageText.ChooseRole}</p>
                        <div className='flex md:flex-col gap-5 flex-wrap justify-center md:px-0 px-2'>

                            {committees.filter((committee) => committee.type === committeeType).map((committee) => (
                                <MemberButton committee={committee} setValue={setMemberCommittee} value={selectedMember?.committee} />

                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Mission And Vision */}
                <div
                    ref={ref2}
                    className='bg-gray-500 dark:bg-darktheme w-full flex flex-col lg:gap-5 gap-20 justify-center items-center py-10 px-7 overflow-hidden lg:mt-0 mt-10'>
                    <motion.h1
                        animate={{
                            y: isInView2 ? 0 : 50,
                            opacity: isInView2 ? 1 : 0,
                            transition: { duration: 0.5, type: "spring", stiffness: 200 }
                        }}

                        className='text-white text-6xl'>{languageText.MissionVision}</motion.h1>
                    <div className='flex lg:flex-row flex-col lg:px-20 lg:gap-10 gap-15 '>
                        <motion.div
                            animate={{
                                x: isInView2 ? 0 : -100,
                                opacity: isInView2 ? 1 : 0,
                                display: isInView2 ? "flex" : "hidden",
                                transition: { duration: 0.8, type: "spring", stiffness: 100 }
                            }}
                            // whileHover={{ border: "3px" }}
                            className='relative flex flex-col bg-redtheme border-4 border-gray-500 dark:border-darktheme ring-4 lg:ring-0 ring-redtheme rounded-xl lg:items-end justify-center py-10 px-5 shadow-lg lg:w-1/2 text-center hover:ring-4 group'>
                            <h1 className='text-whitetheme2 text-4xl lg:text-end lg:mt-0 mt-25'>{languageText.Mission}</h1>
                            <p className="2xl:w-[90%] xl:w-[80%] lg:text-end text-gray-400"> {languageText.MissionDesc}</p>
                            <Icon icon="mage:goals" className={`absolute -top-10 left-0 right-0 lg:top-auto lg:mx-0 mx-auto flex lg:my-auto text-[100px] p-4 bg-whitetheme2 w-fit h-fit rounded-full ring-10 dark:ring-darktheme ring-gray-500 border-8 border-redtheme bg-clip-border text-redtheme group-hover:scale-105 transition duration-200 ease-in-out ${language === "en" ? "lg:!-left-15" : "lg:!-right-15"}`} />
                        </motion.div>


                        <motion.div
                            animate={{
                                x: isInView2 ? 0 : 100,
                                display: isInView2 ? "flex" : "hidden",
                                opacity: isInView2 ? 1 : 0,
                                transition: { duration: 0.8, type: "spring", stiffness: 100 }
                            }}
                            className='relative flex flex-col bg-whitetheme2 rounded-xl justify-center py-10 px-5 border-4 border-gray-500 dark:border-darktheme lg:ring-0 ring-4 ring-whitetheme2 shadow-lg lg:w-1/2 text-center lg:text-start hover:ring-4  group'>
                            <h1 className='text-redtheme text-4xl lg:mt-0 mt-25'>{languageText.Vision}</h1>
                            <p className="2xl:w-[90%] xl:w-[80%] text-gray-800">{languageText.VisionDesc}</p>

                            <Icon icon="fluent:eye-lines-20-filled" className={`absolute -top-10 -left-0 -right-0 lg:top-auto lg:mx-0 mx-auto flex lg:my-auto text-[100px] p-4 bg-redtheme w-fit h-fit rounded-full ring-10 dark:ring-darktheme ring-gray-500 border-8 border-whitetheme2 bg-clip-border text-whitetheme2 group-hover:scale-105 transition duration-200 ease-in-out ${language === "en" ? "lg:!-right-15 lg:left-auto" : "lg:!-left-15 lg:right-auto"}`} />
                        </motion.div>
                    </div>
                </div>

                {/* Signature Events */}
                <AnimatePresence>
                    <div
                        ref={ref3}
                        className='flex flex-col gap-10 lg:gap-5 px-5 lg:px-20 lg:mt-0 mt-20'>
                        <motion.h1
                            animate={{
                                y: isInView3 ? 0 : -100,
                                opacity: isInView3 ? 1 : 0
                            }}
                            className='text-redtheme dark:text-whitetheme text-center text-6xl'>{languageText.SignatureEvents} <span className='text-darktheme2 dark:text-redtheme  whitetheme'>{languageText.Achievements}</span></motion.h1>

                        <motion.div
                            initial="hidden"
                            animate={isInView3 ? "visible" : "hidden"} // Trigger animation when in view
                            variants={{
                                visible: { transition: { staggerChildren: 0.5 } }, // Stagger effect
                            }}
                            className='flex flex-col lg:flex-row gap-4 justify-center'>

                            {achievements.map((event) => (
                                <EventsCard event={event} />
                            ))}
                        </motion.div>
                    </div>
                </AnimatePresence>


                {/* ISS Egypt Event */}
                <div className='flex flex-col gap-5 px-5 lg:px-30 my-10 w-full'>
                    <motion.h1
                        className='text-redtheme dark:text-whitetheme text-center text-6xl'>{languageText.ISSEgyptEvents}
                    </motion.h1>

                    <div className='flex flex-col gap-10 lg:flex-row justify-evenly items-center w-full '>
                        <AnimatePresence>
                            <motion.div
                                className='flex flex-col gap-2 justify-center '>
                                <p className='text-2xl text-redtheme dark:text-whitetheme text-center mb-3 '> {languageText.ChooseCommittee}</p>
                                <motion.div
                                    className='flex flex-row flex-wrap lg:flex-col justify-center !items-center w-full m-auto gap-5'>
                                    {events.map((event) => (
                                        <MemberButton committee={event} setValue={setEventType} value={eventType} />

                                    ))}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        <div className='lg:pt-20'>
                            <ImageCarousel images={filteredImages} language={language} />
                        </div>

                    </div>
                </div>

            </div>
            <ScrollToTop languageText={languageText} />

        </div >
    )
}

export default AboutUs