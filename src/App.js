import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Timeline } from './pages/Timeline';
import { Login } from './pages/Login';
import { UserPage } from './pages/UserPage';
import { Search } from './pages/Search';
import { Register } from './pages/Register';
function existsJWT() {
    const token = localStorage.getItem("jwt");
    console.log(localStorage);
    return token && token !== "";
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Protected routes */}
                <Route
                    path="/"
                    element={existsJWT() ? <Timeline /> : <Navigate to="/login" replace />
                    }></Route>

                <Route path="/:username" element={<UserPage />} />

                <Route
                    path="/search"
                    element={<Search />}
                ></Route>
                {/* Public routes */}
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>

            </Routes>
        </Router>
    )
}

export default App;
