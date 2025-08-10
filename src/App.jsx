import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import languageData from './data/language.json';
import { useLanguage } from './contexts/languageContext';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BottomNavbar from './components/BottomNavBar';
import Footer from './components/Footer';
import HelpingHand from './pages/HelpingHand';
import Register from './pages/Register';
import ServiceForm from './pages/Forms/ServiceForm';
import HelpingHandForm from './pages/Forms/HelpingHandForm';
import Service from './pages/Service';
import EditHelpingHand from './pages/Forms/EditHelpingHand';
import PopUpCard from './components/cards/PopUpCard';
import { AnimatePresence } from 'motion/react';
import { usePopup } from "./contexts/PopupContext";
import Gallery from './pages/Gallery';
import GalleryImages from './pages/GalleryImages';
import EditGallery from './pages/Forms/EditGallery';
import AboutUs from './pages/AboutUs';
import DriveExplorer from './pages/DriveExplorer';
import Shop from './pages/Shop/Shop';
import Product from './pages/Shop/Product';
import Purchase from './pages/Shop/Purchase';
import Reference from './pages/Shop/Reference';
import Internships from './pages/Internships';
import AddInternship from './pages/Forms/AddInternship';
import EditInternship from './pages/Forms/EditInternship';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MyForms from './pages/Admin/MyForms';
import AddForm from './pages/Forms/AddForm';
import EditForm from './pages/Forms/EditForm';
import CreatedForm from './pages/Admin/CreatedForm';
import FormData from './pages/Admin/FormData';
import ProductsData from './pages/Admin/ProductsData';
import NotFound from './pages/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';
import CreateQuiz from './pages/WelcomeQuiz/CreateQuiz';
import JoinQuiz from './pages/WelcomeQuiz/JoinQuiz';
import HostScreen from './pages/WelcomeQuiz/HostScreen';
import ParticipantScreen from './pages/WelcomeQuiz/ParticipantScreen';
import ResultsScreen from './pages/WelcomeQuiz/ResultsScreen';
import QuizCompleted from './pages/WelcomeQuiz/QuizCompleted';
import EditPoints from './pages/WelcomeQuiz/EditPoints';
import BankAccount from './pages/BankAccount';
import Chatbot from "./components/Chatbot";
import FeaturePopup from './components/FeaturePopup';
import EGPTDashboard from './pages/Admin/EGPTDashboard';
// import FormFiller from './pages/FormFiller';



function App() {
  const api = import.meta.env.VITE_APP_API_KEY;
  // const api = "http://localhost:4000";
  const location = useLocation()

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const { language, changeLanguage } = useLanguage();
  const languageText = languageData[language];

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };



  const { popUp, popDesc, popTitle, popATitle } = usePopup();


  const hiddenNavbarPaths = ["/join", "/participant/", "/auth/"];

  const hideNavbar = hiddenNavbarPaths.some(path => location.pathname.startsWith(path));


  const path = location.pathname;
  useEffect(() => {

    const titles = {
      "/": languageText.Home,
      "/services": languageText.HelpingHand,
      "/about": languageText.AboutUs,
      "/gallery": languageText.Gallery,
      "/shop": languageText.ISSEgyptShop,
      "/internships": languageText.Internships,
      "/adminDashboard": languageText.AdminDashboard,
      "/myForms": languageText.MyForms,
      "/productsData": languageText.ProductsData,
      "/addForm": languageText.AddForm,
      "/addService": languageText.AddService,
      "/addHelpingHand": languageText.AddHelpingHand,
      "/addIntern": languageText.AddInternship,
      "/join": languageText.EmojiQuiz,
      "/quizCompleted": languageText.QuizCompleted,
      "/auth/login": languageText.Login,
      "/auth/register": languageText.Register,
    };

    let pageTitle = titles[path] || languageText.ISSEgyptGateway; // Default title


    if (!titles[path]) {
      if (path.startsWith("/product/")) pageTitle = languageText.Product;
      else if (path.startsWith("/purchase/")) pageTitle = languageText.Purchase;
      else if (path.startsWith("/drive/")) pageTitle = languageText.DriveExplorer;
      else if (path.startsWith("/gallery/")) pageTitle = languageText.GalleryImages;
      else if (path.startsWith("/reference/")) pageTitle = languageText.Reference;
      else if (path.startsWith("/form/")) pageTitle = languageText.Form;
      else if (path.startsWith("/services/")) pageTitle = languageText.Services;
      else if (path.startsWith("/editForm/")) pageTitle = languageText.EditForm;
      else if (path.startsWith("/formData/")) pageTitle = languageText.FormData;
      else if (path.startsWith("/editgallery/")) pageTitle = languageText.EditGalleryForm;
      else if (path.startsWith("/editIntern/")) pageTitle = languageText.EditCompany;
      else if (path.startsWith("/host/")) pageTitle = languageText.HostPage;
      else if (path.startsWith("/results/")) pageTitle = languageText.Results;
      else if (path.startsWith("/editPoints/")) pageTitle = languageText.EditPoints;
      else if (path.startsWith("/participant/")) pageTitle = languageText.EmojiQuiz;
    }

    document.title = `${pageTitle} | ${languageText.ISSEgyptGateway}`;
  }, [location, languageText]);

  // dark:bg-darktheme2 bg-whitetheme
  return (
    <div className={`min-h-screen  transition-all duration-300 ${language == 'ar' ? "font-modernpro arabic" : "font-tanker"} ${darkMode ? "backgroundDark" : "backgroundWhite"}`}>
      <FeaturePopup />
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleLanguage={toggleLanguage} language={language} languageText={languageText} />
      <Chatbot api={api} language={language} languageText={languageText} />
      <Routes location={location} key={location.key}>
        <Route path="/form/67efd27e0e02456daf346e7d" element={<Navigate to="/form/welcomeday25" replace />} />
        <Route exact path="/" element={<Home language={language} languageText={languageText} api={api} />} />
        <Route path="/services" element={<HelpingHand language={language} languageText={languageText} api={api} />} />
        <Route path="/gallery" element={<Gallery language={language} languageText={languageText} api={api} />} />
        <Route path="/about" element={<AboutUs language={language} languageText={languageText} api={api} />} />
        <Route path="/shop" element={<Shop language={language} languageText={languageText} api={api} />} />
        <Route path="/bankaccount" element={<BankAccount language={language} languageText={languageText} api={api} />} />
        <Route path="/internships" element={<Internships language={language} languageText={languageText} api={api} />} />
        <Route path="/product/:id" element={<Product language={language} languageText={languageText} api={api} />} />
        <Route path="/purchase/:id" element={<Purchase language={language} languageText={languageText} api={api} />} />
        <Route path="/drive/:id" element={<DriveExplorer language={language} languageText={languageText} api={api} />} />
        <Route path="/gallery/:id" element={<GalleryImages language={language} languageText={languageText} api={api} />} />
        <Route path="/reference/:id" element={<Reference language={language} languageText={languageText} api={api} />} />
        <Route path="/auth/:authType" element={<Register language={language} languageText={languageText} api={api} />} />
        <Route path="/form/:link" element={<CreatedForm language={language} languageText={languageText} api={api} />} />
        <Route path="/services/:link" element={<Service language={language} languageText={languageText} api={api} />} />

        {/* Admin */}
        <Route path="/adminDashboard" element={<ProtectedRoute><AdminDashboard language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/egpt" element={<ProtectedRoute><EGPTDashboard language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/myForms" element={<ProtectedRoute><MyForms language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/productsData" element={<ProtectedRoute><ProductsData language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/editForm/:id" element={<ProtectedRoute><EditForm language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/formData/:id" element={<ProtectedRoute><FormData language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/editgallery/:id" element={<ProtectedRoute><EditGallery language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/editIntern/:id" element={<ProtectedRoute><EditInternship language={language} languageText={languageText} api={api} /></ProtectedRoute>} />

        {/* Forms */}
        <Route path="/addForm" element={<ProtectedRoute><AddForm language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/addService" element={<ProtectedRoute><ServiceForm language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/addHelpingHand" element={<ProtectedRoute><HelpingHandForm language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/editHelpingHand/:id" element={<ProtectedRoute><EditHelpingHand language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/addIntern" element={<ProtectedRoute><AddInternship language={language} languageText={languageText} api={api} /></ProtectedRoute>} />

        <Route path="/create" element={<ProtectedRoute><CreateQuiz api={api} /></ProtectedRoute>} />
        <Route path="/host/:code" element={<ProtectedRoute><HostScreen api={api} language={language} languageText={languageText} /></ProtectedRoute>} />
        <Route path="/results/:code" element={<ProtectedRoute><ResultsScreen language={language} languageText={languageText} api={api} /></ProtectedRoute>} />
        <Route path="/editPoints/:code" element={<ProtectedRoute><EditPoints api={api} languageText={languageText} /></ProtectedRoute>} />

        <Route path="/join" element={<JoinQuiz language={language} languageText={languageText} api={api} />} />
        <Route path="/participant/:code" element={<ParticipantScreen language={language} languageText={languageText} api={api} />} />
        <Route path="/quizCompleted" element={<QuizCompleted languageText={languageText} api={api} />} />


        <Route path="*" element={<NotFound darkMode={darkMode} language={language} languageText={languageText} />} />
      </Routes>
      {!hideNavbar &&
        <BottomNavbar languageText={languageText} language={language} />
      }
      <Footer languageText={languageText} language={language} />

      <AnimatePresence>
        {popUp && <PopUpCard desc={popDesc} title={popTitle} atitle={popATitle} language={language} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
