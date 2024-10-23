import Header from "./components/Header"
import Footer from './components/Footer'
import Home from "./pages/Home"
import Register from "./pages/user/Register"
import Login from "./pages/user/Login"
import Profil from "./pages/user/Profil"
import ReadTome from './pages/ReadTome'
import Admin from "./pages/admin/Admin"
import AddTome from "./pages/admin/tome/AddTome"
import EditTome from "./pages/admin/tome/EditTome"
import CommentDetail from "./pages/admin/comment/commentDetail"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermOfUse from "./pages/TermOfUse"

import './styles/styles.css'
import {Routes, Route, Navigate} from "react-router-dom"

import RequireAuth from "./helpers/require-auth"

function App() {
  return (
    <div className="app">
     <Header />
     <Routes>
        <Route path="/" element={<RequireAuth child={Home} auth={false} admin={false} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<RequireAuth child={Profil} auth={true} admin={false}/>} />
        <Route path="/tomes/:tomeId" element={<RequireAuth child={ReadTome} auth={false} admin={false}/>} />
        <Route path="/admin" element={<RequireAuth child={Admin} auth={true} admin={true}/>} />
        <Route path="/addTome" element={<RequireAuth child={AddTome} auth={true} admin={true}/>} />
        <Route path="/editTome/:id" element={<RequireAuth child={EditTome} auth={true} admin={true}/>} />
        <Route path="/commentDetail/:id" element={<RequireAuth child={CommentDetail} auth={true} admin={true}/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermOfUse />} />
        <Route path="*" element={<Navigate to="/" />} />
     </Routes>
     <Footer />
    </div>
  )
}

export default App
