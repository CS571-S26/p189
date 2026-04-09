
import React, {useState, useMemo, useCallback} from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import {ThemeProvider, createTheme, CssBaseline, Box} from "@mui/material";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";

const theme = createTheme({

    palette: {
        mode: "light",
        primary: {main: "#1A73E8", light: "#D2E3FC", dark: "#1557B0"},
        secondary: {main: "#E8710A"},
        error: {main: "#D93025"},
        warning: {main: "#F9AB00"},
        success: {main: "#1E8E3E"},
        background: {default: "#F8F9FA", paper: "#FFFFFF"},
        text: {primary: "#202124", secondary: "#5F6368"},
        divider: "#DADCE0"
    },

    typography: {
        fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
        h3: {fontWeight: 400},
        h5: {fontWeight: 500},
        h6: {fontWeight: 500},
        subtitle1: {fontWeight: 500},
        button: {textTransform: "none", fontWeight: 500}
    },

    shape: {borderRadius: 12},

    components: {

        MuiButton: {
            styleOverrides: {

                root: {borderRadius: 20, padding: "8px 24px"},

                contained: {

                    boxShadow: "none",

                    "&:hover": {
                        boxShadow: "0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)"
                    }
                }
            }
        },

        MuiCard: {
            styleOverrides: {
                root: {

                    borderRadius: 12,

                    border: "1px solid #DADCE0",

                    boxShadow: "none",

                    transition: "box-shadow 0.2s, border-color 0.2s",

                    "&:hover": {
                        boxShadow: "0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)"
                    }
                }
            }
        },

        MuiPaper: {
            styleOverrides: {root: {backgroundImage: "none"}}
        }
    }
});

/* ── Mock Tasks ───────────────────────────────────────── */

const INITIAL_TASKS = [
    {
        id: "1",
        title: "完成 React Router 路由配置",
        isPinned: true,
        priority: "high",
        tag: "Development",
        done: false,
        createdAt: Date.now() - 172800000
    }, {
        id: "2",
        title: "设计 Dashboard 布局方案",
        isPinned: false,
        priority: "medium",
        tag: "Design",
        done: false,
        createdAt: Date.now() - 86400000
    }, {
        id: "3",
        title: "调研 MUI 主题定制文档",
        isPinned: true,
        priority: "low",
        tag: "Research",
        done: false,
        createdAt: Date.now() - 259200000
    }, {
        id: "4",
        title: "配置 GitHub Pages 部署",
        isPinned: false,
        priority: "high",
        tag: "DevOps",
        done: false,
        createdAt: Date.now()
    }, {
        id: "5",
        title: "撰写项目 README 文档",
        isPinned: false,
        priority: "medium",
        tag: "Default",
        done: false,
        createdAt: Date.now() - 3600000
    }
];

/* ── Protected Route ──────────────────────────────────── */

function ProtectedRoute({isLoggedIn, children}) {
    return isLoggedIn ? children : <Navigate to="/" replace/>;
}

/* ── App ──────────────────────────────────────────────── */

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [tasks, setTasks] = useState(INITIAL_TASKS);

    const [sidebarTab, setSidebarTab] = useState("pending");

    const login = useCallback(() => setIsLoggedIn(true), []);

    const logout = useCallback(() => setIsLoggedIn(false), []);

    const togglePin = useCallback((id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, isPinned: !t.isPinned} : t)));
    }, []);

    const toggleDone = useCallback((id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, done: !t.done} : t)));
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const sortedTasks = useMemo(() => {

        const pending = tasks.filter((t) => !t.done);

        const pinned = pending.filter((t) => t.isPinned);

        const rest = pending.filter((t) => !t.isPinned);

        return [...pinned, ...rest];

    }, [tasks]);

    const historyTasks = useMemo(() => tasks.filter((t) => t.done), [tasks]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes>
                <Route path="/" element={<LandingPage onLogin={login} isLoggedIn={isLoggedIn}/>}/>
                <Route path="/dashboard" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <Box sx={{display: "flex", minHeight: "100vh", bgcolor: "background.default"}}>
                                <Sidebar tab={sidebarTab} onTabChange={setSidebarTab} pendingCount={sortedTasks.length} historyCount={historyTasks.length}/>
                                <Box sx={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
                                    <Navigation onLogout={logout}/>
                                    <Dashboard tasks={sidebarTab === "pending" ? sortedTasks : historyTasks} tab={sidebarTab} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask}/>
                                </Box>
                            </Box>
                        </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </ThemeProvider>
    );
}

/* ── Mount ─────────────────────────────────────────────── */

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter>
            <App/>
        </HashRouter>
    </React.StrictMode>
);
