import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import HomePage from "./pages/HomePage"
import DetailPage from "./pages/DetailPage"
import FavouritePage from "./pages/FavouritePage"
import ComparePage from "./pages/ComparePage"
import TripMatcherPage from "./pages/TripMatcherPage"
import NotFoundPage from "./pages/NotFoundPage"
import ToastProvider from "./context/ToastProvider"
import TravelListsProvider from "./context/TravelListsProvider"

function App() {

  return (
    <ToastProvider>
      <TravelListsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/travels/:id" element={<DetailPage />} />
              <Route path="/destinazioni-preferite" element={<FavouritePage />} />
              <Route path="/comparazione-viaggi" element={<ComparePage />} />
              <Route path="/trova-il-tuo-viaggio" element={<TripMatcherPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TravelListsProvider>
    </ToastProvider>
  )
}

export default App
