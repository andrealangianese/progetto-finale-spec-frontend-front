import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import NavBar from "./components/NavBar"
import DetailPage from "./components/DetailPage"
import FavouritePage from "./components/FavouritePage"
import ComparePage from "./components/ComparePage"
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viaggi" element={<DetailPage />} />
          <Route path="/destinazioni-preferite" element={<FavouritePage />} />
          <Route path="/comparazione-viaggi" element={<ComparePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
