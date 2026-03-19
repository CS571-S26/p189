
import "./styles/index.css";

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {HashRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Placeholder from "./pages/Placeholder.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<Placeholder/>}/>
            </Routes>
        </HashRouter>
    </StrictMode>
);
