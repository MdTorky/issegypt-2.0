import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/languageContext';
import { FormsContextProvider } from './contexts/formContext.jsx';
import { AuthContextProvider } from './contexts/authContext.jsx';
import { PopupProvider } from "./contexts/PopupContext.jsx";
import { SuccessMessageProvider } from "./contexts/successMessageContext.jsx"; // Import the provider



createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <FormsContextProvider>
      <LanguageProvider>
        <PopupProvider>
          <SuccessMessageProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SuccessMessageProvider>
        </PopupProvider>
      </LanguageProvider>
    </FormsContextProvider>
  </AuthContextProvider>
  ,
)
