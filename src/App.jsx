import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import languageData from './data/language.json';
import { useLanguage } from './contexts/languageContext';
import { Routes, Route, useLocation } from 'react-router-dom';
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



  // dark:bg-darktheme2 bg-whitetheme
  return (
    <div className={`min-h-screen  transition-all duration-300 ${language == 'ar' ? "font-modernpro arabic" : "font-tanker"} ${darkMode ? "backgroundDark" : "backgroundWhite"}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleLanguage={toggleLanguage} language={language} languageText={languageText} />
      <Routes location={location} key={location.key}>
        <Route exact path="/" element={<Home language={language} languageText={languageText} api={api} />} />
        <Route path="/services" element={<HelpingHand language={language} languageText={languageText} api={api} />} />
        <Route path="/gallery" element={<Gallery language={language} languageText={languageText} api={api} />} />
        <Route path="/about" element={<AboutUs language={language} languageText={languageText} api={api} />} />
        <Route path="/shop" element={<Shop language={language} languageText={languageText} api={api} />} />
        <Route path="/internships" element={<Internships language={language} languageText={languageText} api={api} />} />
        <Route path="/product/:id" element={<Product language={language} languageText={languageText} api={api} />} />
        <Route path="/purchase/:id" element={<Purchase language={language} languageText={languageText} api={api} />} />
        <Route path="/drive/:id" element={<DriveExplorer language={language} languageText={languageText} api={api} />} />
        <Route path="/gallery/:id" element={<GalleryImages language={language} languageText={languageText} api={api} />} />
        <Route path="/reference/:id" element={<Reference language={language} languageText={languageText} api={api} />} />
        <Route path="/auth/:authType" element={<Register language={language} languageText={languageText} api={api} />} />

        {/* Admin */}
        <Route path="/adminDashboard" element={<AdminDashboard language={language} languageText={languageText} api={api} />} />
        <Route path="/myForms" element={<MyForms language={language} languageText={languageText} api={api} />} />
        <Route path="/productsData" element={<ProductsData language={language} languageText={languageText} api={api} />} />
        <Route path="/addForm" element={<AddForm language={language} languageText={languageText} api={api} />} />
        <Route path="/editForm/:id" element={<EditForm language={language} languageText={languageText} api={api} />} />
        <Route path="/form/:link" element={<CreatedForm language={language} languageText={languageText} api={api} />} />
        <Route path="/formData/:id" element={<FormData language={language} languageText={languageText} api={api} />} />
        <Route path="/editgallery/:id" element={<EditGallery language={language} languageText={languageText} api={api} />} />
        <Route path="/editIntern/:id" element={<EditInternship language={language} languageText={languageText} api={api} />} />

        {/* Forms */}
        <Route path="/addService" element={<ServiceForm language={language} languageText={languageText} api={api} />} />
        <Route path="/addHelpingHand" element={<HelpingHandForm language={language} languageText={languageText} api={api} />} />
        <Route path="/services/:link" element={<Service language={language} languageText={languageText} api={api} />} />
        <Route path="/editHelpingHand/:id" element={<EditHelpingHand language={language} languageText={languageText} api={api} />} />
        <Route path="/addIntern" element={<AddInternship language={language} languageText={languageText} api={api} />} />

        <Route path="*" element={<NotFound darkMode={darkMode} language={language} languageText={languageText} />} />
      </Routes>
      <BottomNavbar languageText={languageText} language={language} />
      <Footer languageText={languageText} language={language} />
      <AnimatePresence>
        {popUp && <PopUpCard desc={popDesc} title={popTitle} atitle={popATitle} language={language} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
