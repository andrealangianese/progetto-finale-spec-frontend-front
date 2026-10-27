import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import NavBar from "./components/NavBar"
import DetailPage from "./components/DetailPage"
import FavouritePage from "./components/FavouritePage"
import ComparePage from "./components/ComparePage"
import NotFoundPage from "./components/NotFoundPage"
import TripMatcherPage from "./components/TripMatcherPage"
import ToastProvider from "./context/ToastProvider"
import TravelListsProvider from "./context/TravelListsProvider"
import "./App.css"

function App() {

  return (
    <ToastProvider>
      <TravelListsProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/travels/:id" element={<DetailPage />} />
            <Route path="/destinazioni-preferite" element={<FavouritePage />} />
            <Route path="/comparazione-viaggi" element={<ComparePage />} />
            <Route path="/trova-il-tuo-viaggio" element={<TripMatcherPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TravelListsProvider>
    </ToastProvider>
  )
}

export default App
