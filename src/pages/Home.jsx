import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useFormsContext } from '../hooks/useFormContext'
import useFetchData from "../hooks/useFetchData";
import { Icon } from "@iconify/react";
import MemberCard from "../components/cards/MemberCard";
import MemberCardLoader from "../components/loaders/MemberCardLoader";
import buttonVariant from "../components/animations/ButtonVariant";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import ImageCarousel from "../components/ImageCarousel";
import { useAuthContext } from '../hooks/useAuthContext';
import HandCard from "../components/cards/HandCard";
import HandCardLoader from "../components/loaders/HandCardLoader";
import images from '../data/events.json'
import ScrollToTop from "../components/ScrollToTop";
import Loader from "../components/loaders/Loader";
import SplitText from "../utils/SplitText";


const Home = ({ languageText, language, api }) => {
    const { user } = useAuthContext()
    const { members, services, dispatch } = useFormsContext();
    const {
        scaleDown,
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
        widthDown,
        imageTitleYDown,
        imageDescriptionOpacity,
        handTitleOpacity,
        xRight
    } = useScrollAnimations();

    const [slides, setSlides] = useState([
        { id: 1, imgSrc: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1753429912/Home%20Page/IMG_8141_senu7c.jpg", title: "Welcome Day", aTitle: "يوم الترحيب", description: "Where ISS Egypt Welcomes New Students and gives them a hand in their upcoming years", aDescription: "حيث رحب الاتحاد المصري بالطلاب الجدد وقدم لهم المساعدة في سنواتهم القادمة" },
        { id: 2, imgSrc: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740088072/Home%20Page/ACD_vk9ajm.jpg", title: "Arabic Culture Day", aTitle: "اليوم الثقافي العربي", description: "ISS Egypt represented Egypt in the Arabic Culture Day 2024", aDescription: "مثل الاتحاد المصري مصر في اليوم الثقافي العربي 2024" },
        { id: 3, imgSrc: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1740087762/Home%20Page/Eid_kgoenn.jpg", title: "Eid Al-Adha Celebrations", aTitle: "احتفالات عيد الأضحى", description: "ISS Egypt celebrates Eid with all the Muslim Students", aDescription: "الاتحاد المصري يحتفل بالعيد مع جميع الطلاب المسلمين" },
        { id: 4, imgSrc: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1753430655/Home%20Page/IMG_3714_ix2xcq.jpg", title: "Universities Nations Cup", aTitle: "كأس الأمم الجامعية", description: "ISS Egypt hosted the largest futsal tournament, featuring ten universities from Malaysia.", aDescription: "أقام الاتحاد المصري أكبر بطولة لكرة القدم الخماسية، بمشاركة عشر جامعات من ماليزيا." },
        { id: 5, imgSrc: "https://res.cloudinary.com/dmv4mxgn5/image/upload/v1753430800/Home%20Page/Langkawi_dgb5ch.jpg", title: "Langkawi Trip", aTitle: "رحلة لنكاوي", description: "ISS Egypt organized a trip to Langkawi Island, offering students an unforgettable experience exploring its natural beauty and vibrant culture.", aDescription: "نظم الاتحاد المصري رحلة إلى جزيرة لنكاوي، مما وفر للطلاب تجربة لا تُنسى لاستكشاف جمالها الطبيعي وثقافتها النابضة بالحياة." }
    ]);

    const selectSlide = (index) => {
        if (index === 0) return;

        const newSlides = [...slides];
        const selected = newSlides.splice(index, 1)[0];
        newSlides.unshift(selected);

        setSlides(newSlides);
    };

    // Go to the next slide
    const nextSlide = () => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            const firstSlide = newSlides.shift();
            newSlides.push(firstSlide);
            return newSlides;
        });
    };

    // Go to the previous slide
    const prevSlide = () => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            const lastSlide = newSlides.pop();
            newSlides.unshift(lastSlide);
            return newSlides;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 10000);

        return () => clearInterval(interval);
    }, []);



    const { data: fetchedMembers, loading: memberLoading, error: memberError } = useFetchData(`${api}/api/member`);
    useEffect(() => {
        if (fetchedMembers && !memberLoading && !memberError) {
            dispatch({
                type: "SET_ITEM",
                collection: "members",
                payload: fetchedMembers,
            });
        }
    }, [fetchedMembers, memberLoading, memberError, dispatch]);

    const { data: serviceData, loading: serviceLoading, error: serviceError } = useFetchData(`${api}/api/service`);
    useEffect(() => {
        if (serviceData && !serviceLoading && !serviceError) {
            dispatch({
                type: "SET_ITEM",
                collection: "services",
                payload: serviceData,
            });
        }
    }, [serviceError, dispatch]);


    const filteredMembers =
        members?.filter((member) => member.memberId >= 1 && member.memberId <= 4).sort(
            (a, b) => a.memberId - b.memberId) || []

    const committeeFilter = members?.filter((member) => member.committee === user?.committee);
    const userFilter = committeeFilter.find((member) => member.type === 'President' || member.type === 'VicePresident' || member.type === 'Admin');


    const socialParentVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }
    };

    const socialChildVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { type: "spring" } },
        exit: { opacity: 0, x: -100 }
    };


    const extraHands = [
        {
            name: "Internships",
            aName: "التدريب",
            description: "Find a Job Quicker",
            aDescription: "دورلك على شغل يرم عظمك",
            icon: "hugeicons:permanent-job",
            url: "/internships"
        }
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


    const filteredSocialImages = galleryData?.length
        ? galleryData.filter((image) => image?.committee === "Social").sort((a, b) => a.time - b.time)
        : [];

    const filteredAcademicImages = galleryData?.length
        ? galleryData.filter((image) => image?.committee === "Academic").sort((a, b) => a.time - b.time)
        : [];

    const filteredCultureImages = galleryData?.length
        ? galleryData.filter((image) => image?.committee === "Culture").sort((a, b) => a.time - b.time)
        : [];

    // const filteredSocialImages = images.filter((image) => {
    //     return image.committee === "Social";
    // });

    // const filteredAcademicImages = images.filter((image) => {
    //     return image.committee === "Academic";
    // });

    // const filteredCultureImages = images.filter((image) => {
    //     return image.committee === "Culture";
    // });
    const displayOrder = [0, 1, 2, 4, 5];

    return (
        <div>
            <div className="relative w-full h-screen overflow-hidden">
                {/* Background Image Transition */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={slides[0].id}
                        src={slides[0].imgSrc}
                        alt={slides[0].title}
                        className="absolute w-full h-full inset-0 object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        style={{
                            scale: scaleBackground,
                            y: translateY,
                        }}
                    />
                </AnimatePresence>

                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-darktheme2 via-darktheme/50 to-black/30 z-0" />

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4 md:px-20">
                    <div className="text-center max-w-7xl mx-auto flex flex-col items-center gap-6 ">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-bold tracking-[0.2em] text-red-500 uppercase text-sm md:text-xl drop-shadow-md"
                        >
                            {languageText.ISSEGYPTUTM}
                        </motion.div>

                        <div className="overflow-hidden">
                            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-bold text-white uppercase text-center leading-tight drop-shadow-xl ${language === "en" ? "font-anton tracking-wide" : "font-modernpro"}`}>
                                {language === "en" ? slides[0].title : slides[0].aTitle}
                            </h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-white/80 text-lg md:text-2xl max-w-3xl text-center leading-relaxed font-light drop-shadow-lg"
                        >
                            {language === "en" ? slides[0].description : slides[0].aDescription}
                        </motion.p>
                    </div>
                </div>


                {/* Glass Carousel Thumbs */}
                <div className={`absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4`}>
                    <AnimatePresence mode="popLayout">
                        {slides.map((slide, index) => (
                            <motion.div
                                key={slide.id}
                                className={`relative cursor-pointer rounded-xl border-5 border-whitetheme/0 overflow-hidden shadow-2xl transition-all duration-300
                                                   ${index === 0 ? 'w-24 h-36 md:w-32 md:h-48 ring-3 ring-redtheme translate-y-[-10px]' : 'w-16 h-24 md:w-20 md:h-32 opacity-60 hover:opacity-100 hover:scale-105 glass-card'}
                                               `}
                                onClick={() => selectSlide(index)}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <img
                                    src={slide.imgSrc}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-3/4 md:top-1/2 -translate-y-1/2 w-full flex justify-between px-4 md:px-12 z-20 pointer-events-none">
                    <button
                        onClick={prevSlide}
                        className="pointer-events-auto p-4 rounded-full glass-card glass-card-hover text-white hover:text-redtheme transition-all group"
                    >
                        <Icon icon={language == "en" ? "solar:map-arrow-left-bold-duotone" : "solar:map-arrow-right-bold-duotone"} className="text-3xl md:text-4xl group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="pointer-events-auto p-4 rounded-full glass-card glass-card-hover text-white hover:text-redtheme transition-all group"
                    >
                        <Icon icon={language == "en" ? "solar:map-arrow-right-bold-duotone" : "solar:map-arrow-left-bold-duotone"} className="text-3xl md:text-4xl group-hover:scale-110 transition-transform" />
                    </button>
                </div>


                <div className={`absolute top-24 ${language === "en" ? "right-4 md:right-10" : "left-4 md:left-10"} z-20`}>
                    <motion.div
                        className="flex flex-col gap-3 glass-card p-3 rounded-full"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        {[
                            { link: "https://www.instagram.com/issegypt/", icon: "mdi:instagram", color: "hover:text-pink-500" },
                            { link: "https://www.facebook.com/Eg.UTM", icon: "qlementine-icons:facebook-16", color: "hover:text-blue-500" },
                            { link: "https://www.linkedin.com/company/issegypt", icon: "tabler:brand-linkedin", color: "hover:text-blue-600" },
                            { link: "https://www.youtube.com/@issegypt", icon: "mingcute:youtube-fill", color: "hover:text-red-500" },
                            { link: "https://linktr.ee/issegypt", icon: "tabler:brand-linktree", color: "hover:text-green-500" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`text-white/70 text-2xl transition-all duration-300 hover:scale-110 ${social.color}`}
                            >
                                <Icon icon={social.icon} />
                            </a>
                        ))}
                    </motion.div>
                </div>
                {/* Social Media Accounts */}
                {/* <AnimatePresence>
                    <motion.div
                        className={`absolute flex justify-center lg:flex-col gap-3 top-[15%] lg:top-auto lg:bottom-20 text-red-900 left-0 right-0 ${language === "en" ? "lg:left-10 lg:right-auto" : "lg:right-10 lg:left-auto"}`}
                        initial="hidden"
                        whileInView="visible"
                        style={{ x: xRight }}

                        variants={socialParentVariants}
                        transition={{ duration: 0.5 }}
                    >
                        {[
                            { link: "https://www.instagram.com/issegypt/", icon: "mdi:instagram", bg: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]", text: languageText.instagram },
                            { link: "https://www.facebook.com/Eg.UTM", icon: "qlementine-icons:facebook-16", bg: "bg-gradient-to-r from-[#00c6ff] to-[#0072ff]", text: languageText.facebook },
                            { link: "https://www.linkedin.com/company/issegypt", icon: "tabler:brand-linkedin", bg: "bg-[#0A66C2]", text: languageText.linkedin },
                            { link: "https://www.youtube.com/@issegypt", icon: "mingcute:youtube-fill", bg: "bg-[#FF0000]", text: languageText.youtube },
                            { link: "https://linktr.ee/issegypt", icon: "tabler:brand-linktree", bg: "bg-[#acdc5c]", text: languageText.linktree }
                        ].map(({ link, icon, bg, text }, index) => (
                            <motion.div
                                key={index}
                                variants={socialChildVariants} // All children use the same variants
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => window.open(link, "_blank")}
                                className="socailHomeButton group"
                            >
                                <Icon icon={icon} />
                                <div className={`socailHomeButtonText ${bg}`}>{text}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence> */}

            </div>



            {/* Services */}
            <div className="my-20 overflow-hidden px-2">
                <motion.h1
                    className="text-center text-redtheme text-6xl lg:text-8xl"
                    style={{ opacity: handTitleOpacity }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    {languageText.NeedAHand}
                </motion.h1>
                <motion.p
                    className="text-center text-gray-500 dark:text-gray-200 text-xl lg:text-3xl"
                    style={{ opacity: handTitleOpacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    {languageText.NeedAHandDesc}
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-10 my-10 justify-center"
                >


                    {serviceLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <HandCardLoader key={index} />
                        )) :
                        <motion.div
                            className="flex flex-wrap gap-10 justify-center px-2"
                            initial="hidden"
                            whileInView="visible"
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
                                exit: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
                            }}
                            style={{ opacity: handTitleOpacity }}
                        >

                            {extraHands.map((hand) => (
                                <HandCard
                                    service={hand}
                                    language={language}
                                    languageText={languageText}
                                />
                            ))}
                            {serviceData
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .slice(0, 6)
                                .filter((_, idx) => displayOrder.includes(idx))
                                .map((service, index) => (
                                    <HandCard
                                        key={index}
                                        index={index}
                                        service={service}
                                        language={language}
                                        languageText={languageText}
                                    />
                                ))}
                        </motion.div>
                    }
                </motion.div>

            </div>

            {/* Team */}

            <div className="my-20 py-10 bg-gray-300 dark:bg-gray-800">
                <motion.h1 className="text-center text-redtheme text-6xl">
                    {languageText.KnowTeam}
                </motion.h1>

                <motion.p className="text-center text-gray-500 text-3xl mb-10">
                    {languageText.KnowTeamDesc}

                </motion.p>

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
                    {memberLoading ? (
                        <>
                            <MemberCardLoader />
                            <MemberCardLoader />
                            <MemberCardLoader />
                            <MemberCardLoader />
                        </>) :
                        filteredMembers.map((member) => (

                            <motion.div
                                variants={{
                                    hidden: { y: -300, opacity: 0 },
                                    visible: { y: 0, opacity: 1, transition: { type: "spring" } },
                                }}
                                transition={{ duration: 0.5 }}>
                                <MemberCard member={member} language={language} languageText={languageText} />
                            </motion.div>
                        ))}
                </motion.div>
            </div>


            <div>

                <motion.h1 className="text-center text-redtheme text-6xl">
                    {languageText.ISSEgyptEvents}

                </motion.h1>

                <motion.p className="text-center text-gray-500 dark:text-gray-200 text-3xl">
                    {languageText.ISSEgyptEventsDesc}

                </motion.p>
                {galleryLoading && (
                    <Loader text={languageText.Loading} />
                )}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } },
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center flex-wrap p-10 items-center gap-5">

                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="text-4xl text-redtheme">{languageText.SocialCommittee}</h1>
                        <ImageCarousel images={filteredSocialImages} language={language} />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="text-4xl text-redtheme">{languageText.AcademicCommittee}</h1>
                        <ImageCarousel images={filteredAcademicImages} language={language} />

                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="text-4xl text-redtheme">{languageText.CultureCommittee}</h1>
                        <ImageCarousel images={filteredCultureImages} language={language} />
                    </div>

                </motion.div>
            </div>
            <ScrollToTop languageText={languageText} />

        </div>
    );
};

export default Home;
