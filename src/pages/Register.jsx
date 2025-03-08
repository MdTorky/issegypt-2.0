import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InputField from "../components/formInputs/InputField";
import SelectField from "../components/formInputs/SelectField";
import FormButton from "../components/formInputs/FormButton";
import { useParams } from "react-router-dom";
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';
import { Icon } from "@iconify/react";
import ErrorContainer from "../components/formInputs/ErrorContainer";
import { useAuthContext } from '../hooks/useAuthContext';
import Loader from "../components/loaders/Loader";
import { useNavigate } from "react-router-dom";

const Register = ({ language, languageText, api }) => {
    const { authType } = useParams();
    const { user } = useAuthContext()

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/adminDashboard', { replace: true }); // Redirect to login
        }
    }, [user, navigate]);


    const [isLogin, setIsLogin] = useState(authType);

    // const [successMessage, setSuccessMessage] =useState()

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [committee, setCommittee] = useState();

    const [loginEmail, setLoginEmail] = useState()
    const [loginPassword, setLoginPassword] = useState()


    const { login, loginError, loginLoading, loginSuccess, setLoginError, setLoginSuccess } = useLogin(api, languageText)
    const { register, registerLoading, setRegisterError, registerError, registerSuccess, setRegisterSuccess } = useRegister(api, languageText)

    const type = "admin"
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        await login(loginEmail, loginPassword)
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        await register(email, password, committee, type)
    }

    const committeeOptions = [
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

    const parentStagger = {
        visible: { transition: { staggerChildren: 0.2, } },
        exit: {
            transition: { staggerChildren: 0.1, },
        }

    };
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_+\-=[\];':"\\|,./?]).{8,}$/;

    const PasswordStrengthChecker = () => {
        const rules = [
            { regex: /^.{8,}$/, text: languageText.CharRegex },
            { regex: /^(?=.*[a-z])(?=.*[A-Z]).+$/, text: languageText.LetterRegex },
            { regex: /.*\d.*/, text: languageText.DigitRegex },

            { regex: /[!@#$%&*_+\-=[\];':"\\|,./?]/, text: languageText.SpecialRegex }
        ];



        return (
            <motion.div

                className="bg-gradient-to-r from-whitetheme to-whitetheme2 dark:from-darktheme2 dark:to-darktheme2 ring-redtheme ring-3 border-whitetheme dark:border-black border-5 lg:w-[65%] p-3 rounded-xl">
                {rules.map(({ regex, text }, index) => {
                    const isValid = regex.test(password);
                    return (
                        <p key={index} className={`text-whitetheme text-sm flex items-center gap-2 ${isValid ? "!text-green-500" : "!text-redtheme"} `}>
                            <Icon icon={isValid ? "solar:check-read-linear" : "ci:close-md"} className={` rounded !text-whitetheme ${isValid ? "!bg-green-500" : "!bg-redtheme"}`} />
                            {text}
                        </p>
                    );
                })}
            </motion.div>
        );
    };


    return (

        <div className={`flex h-screen w-full items-center p-4 overflow-hidden relative `}>
            <AnimatePresence mode="popLayout">
                {/* Register Form */}
                {(isLogin === "register") && (
                    registerLoading ?
                        (
                            <motion.div
                                initial={{ opacity: 0, x: language === "en" ? 200 : -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: language === "en" ? 200 : -200 }}
                                transition={{ duration: 0.8, ease: "linear" }}
                                className={`relative lg:absolute lg:w-2/5 p-8 lg:py-30 flex flex-col justify-center  m-auto rounded-xl ${language === "ar" ? "lg:right-20" : " lg:left-20"}`}>
                                <Loader text={languageText.Registering} />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: language === "en" ? 200 : -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: language === "en" ? 200 : -200 }}
                                transition={{ duration: 0.8, ease: "linear" }}
                                className={`relative lg:absolute lg:w-2/5 p-8 lg:py-30 flex flex-col justify-center  m-auto rounded-xl   ${language === "ar" ? "lg:right-20" : " lg:left-20"}`}>
                                {/* <div class="absolute w-100 h-100 bg-whitetheme blur-[50px] -left-1/2 -top-1/2"></div>
                        <div class="absolute w-100 h-100 bg-whitetheme blur-[50px] -right-1/2 -top-1/2"></div> */}

                                <motion.h2
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0 }} //

                                    transition={{ duration: 0.9, delay: 0.1, type: "spring" }}

                                    className="text-4xl lg:text-6xl bg-gradient-to-r from-redtheme to-redtheme2 bg-clip-text text-transparent text-center font-bold mb-10 m-auto">
                                    {languageText.Register} <span className="text-darktheme2 dark:text-whitetheme">{languageText.Account}</span>
                                </motion.h2>
                                <motion.form
                                    onSubmit={handleRegisterSubmit}
                                    variants={parentStagger}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col gap-4 lg:mb-10 items-center w-full lg:w-[70%] m-auto">
                                    <InputField
                                        placeholder={languageText.EMAIL}
                                        iconValue="entypo:email"
                                        icon="entypo:email"
                                        type="email"
                                        language={language}
                                        languageText={languageText}

                                        required={true}
                                        setValue={setEmail}
                                        regex={null}
                                    />
                                    <InputField
                                        placeholder={languageText.PASSWORD}
                                        iconValue="solar:lock-password-bold"
                                        icon="solar:lock-password-broken"
                                        type="password"
                                        language={language}
                                        languageText={languageText}

                                        required={true}
                                        setValue={setPassword}
                                        regex={passwordRegex}

                                    />
                                    {password && <PasswordStrengthChecker />}
                                    <SelectField
                                        options={committeeOptions}
                                        placeholder={languageText.ChooseCommittee}
                                        iconValue="fluent:people-team-16-filled"
                                        icon="fluent:people-team-16-regular"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setCommittee}
                                        regex={null}


                                    />
                                    <FormButton icon="stash:signin-alt" text={languageText.CreateAccount} />
                                    <AnimatePresence mode="popLayout">
                                        {registerError &&
                                            <ErrorContainer error={registerError} setError={setRegisterError} />
                                        }

                                    </AnimatePresence>
                                    <motion.button
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{
                                            opacity: 1, y: 0,
                                            transition: {
                                                type: "spring",
                                                stiffness: 100,
                                                duration: 1
                                            }
                                        }}
                                        exit={{
                                            opacity: 0, y: -50, transition: {
                                                type: "spring",
                                                stiffness: 100,
                                                duration: 1
                                            }
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                        }}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLogin("login") }}
                                        className="m-auto -mt-2 text-1xl text-darktheme dark:text-whitetheme cursor-pointer">{languageText.HaveAccount} <span className="text-redtheme">{languageText.Login}</span></motion.button>

                                </motion.form>


                            </motion.div>
                        )
                )}



                {/* LOGIN FORM */}
                {isLogin === "login" && (
                    loginLoading ? (<motion.div
                        key="login"
                        initial={{ opacity: 0, x: -100 }} // Start from the right
                        animate={{ opacity: 1, x: 0 }} // Animate to the center
                        exit={{ opacity: 0, x: -100 }} // Exit to the right
                        transition={{ duration: 0.8, ease: "linear" }}
                        className={`lg:absolute w-full lg:w-2/5 p-8 flex flex-col justify-center overflow-hidden ${language === "ar" ? "lg:left-20" : "lg:right-20"}`}
                    >
                        <Loader text={languageText.LogginIn} />
                    </motion.div>) : (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -100 }} // Start from the right
                            animate={{ opacity: 1, x: 0 }} // Animate to the center
                            exit={{ opacity: 0, x: -100 }} // Exit to the right
                            transition={{ duration: 0.8, ease: "linear" }}
                            className={`lg:absolute m-auto lg:w-2/5 p-8 flex flex-col justify-center overflow-hidden ${language === "ar" ? "lg:left-20" : "lg:right-20"}`}
                        >
                            <motion.h2
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0, scale: 0 }} //

                                transition={{ duration: 0.9, delay: 0.1, type: "spring" }}

                                className="text-6xl  text-darktheme2 dark:text-whitetheme text-center font-bold mb-10 m-auto">
                                {languageText.AdminSignUpPage} <span className="bg-gradient-to-r from-redtheme to-redtheme2 bg-clip-text text-transparent">{languageText.LoginSignUpPage}</span>
                            </motion.h2>
                            <motion.form
                                onSubmit={handleLoginSubmit}
                                variants={parentStagger}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col gap-4 mb-10 items-center w-full lg:w-[70%] m-auto">
                                <InputField
                                    placeholder={languageText.EMAIL}
                                    iconValue="entypo:email"
                                    icon="entypo:email"
                                    type="email"
                                    language={language}
                                    languageText={languageText}

                                    required={true}
                                    setValue={setLoginEmail}
                                />
                                <InputField
                                    placeholder={languageText.PASSWORD}
                                    iconValue="solar:lock-password-bold"
                                    icon="solar:lock-password-broken"
                                    type="password"
                                    language={language}
                                    languageText={languageText}

                                    required={true}
                                    setValue={setLoginPassword}
                                />
                                <FormButton icon="stash:signin-alt" text={languageText.Login} />
                                <AnimatePresence mode="popLayout">
                                    {loginError &&
                                        <ErrorContainer error={loginError} setError={setLoginError} />
                                    }

                                </AnimatePresence>
                                {user && <motion.button
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{
                                        opacity: 1, y: 0,
                                        transition: {
                                            type: "spring",
                                            stiffness: 100,
                                            duration: 1
                                        }
                                    }}
                                    exit={{
                                        opacity: 0, y: -50, transition: {
                                            type: "spring",
                                            stiffness: 100,
                                            duration: 1
                                        }
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                    }}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLogin("register") }}
                                    className="m-auto -mt-2 text-1xl dark:text-whitetheme text-darktheme cursor-pointer">{languageText.NewUser} <span className="text-redtheme">{languageText.Register}</span>
                                </motion.button>}
                            </motion.form>
                        </motion.div>
                    )
                )}


                <motion.div
                    key="image"
                    // initial={{ right: 0, left: "inherit" }}
                    // animate={{
                    //     right: isLogin === "login" ? "inherit" : 0, left: isLogin === "login" ? 0 : "inherit",
                    // }}

                    initial={
                        language === "en"
                            ? { right: 0, left: "inherit" } // English (LTR)
                            : { left: 0, right: "inherit" } // Arabic (RTL)
                    }

                    animate={
                        language === "en"
                            ? {
                                left: isLogin === "login" ? 0 : 1000,
                                right: isLogin === "login" ? 1000 : 0,
                            }
                            : {
                                right: isLogin === "login" ? 0 : 1000,
                                left: isLogin === "login" ? -1000 : 0,
                            }
                    }



                    //     initial={
                    //       language === "en"
                    //           ? { right: 0, left: "inherit" } // English (LTR)
                    //           : { left: 0, right: "inherit" } // Arabic (RTL)
                    //   }

                    // animate={{
                    //     left: language === "en" ? (isLogin === "login" ? 0 : "inherit") : (isLogin === "login" ? "inherit" : 0),
                    //     right: language === "en" ? (isLogin === "login" ? "inherit" : 0) : (isLogin === "login" ? 0 : "inherit"),
                    // }}
                    transition={{ duration: 0.8, }}
                    className="hidden lg:flex lg:absolute top-0 right-0 w-1/2 h-full bg-cover bg-center brightness-50"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1629468855534-450d7c4c5f72?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
                    }}>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {/* {loginSuccess && <SuccessMessage languageText={languageText} text={loginSuccess} setValue={setLoginSuccess} language={language} />} */}
            </AnimatePresence>
            <AnimatePresence>
                {/* {registerSuccess && <SuccessMessage languageText={languageText} text={registerSuccess} setValue={setRegisterSuccess} language={language} />} */}
            </AnimatePresence>

        </div >
    );
};

export default Register;
