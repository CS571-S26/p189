
import React, {useState, useMemo, useCallback, useEffect} from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import {ThemeProvider, createTheme, CssBaseline, Box, Fab, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import AddTaskModal from "./components/AddTaskModal";

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
                    "&:hover": {boxShadow: "0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)"}
                }
            }
        },

        MuiCard: {

            styleOverrides: {
                root: {borderRadius: 14, border: "1px solid #E8EAED", boxShadow: "none", transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s"}
            }
        },

        MuiPaper: {

            styleOverrides: {
                root: {backgroundImage: "none"}
            }
        },

        MuiTooltip: {

            defaultProps: {
                arrow: true,
                enterDelay: 300,
                enterNextDelay: 150
            },

            styleOverrides: {

                tooltip: {
                    backgroundColor: "#3C4043",
                    color: "#FFFFFF",
                    fontSize: 11.5,
                    fontWeight: 500,
                    padding: "6px 10px",
                    borderRadius: 6,
                    boxShadow: "0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)"
                },

                arrow: {
                    color: "#3C4043"
                }
            }
        }
    }
});

/* ── Initial Tasks ───────────────────────────────────────── */

const INITIAL_TASKS = [
    {
        id: "1",
        title: "Hello World?",
        isPinned: true,
        priority: "high",
        tag: "Life",
        done: false,
        createdAt: Date.now() - 172800000
    },
    {
        id: "2",
        title: "TaskFlow",
        isPinned: false,
        priority: "medium",
        tag: "Project",
        done: false,
        createdAt: Date.now() - 86400000
    },
    {
        id: "3",
        title: "An Open Task?",
        isPinned: true,
        priority: "low",
        tag: "Default",
        done: false,
        createdAt: Date.now() - 259200000
    }
];

/* ── Persistence ──────────────────────────────────────── */

const STORAGE_KEY = "taskflow.tasks.v1";

const SIDEBAR_KEY = "taskflow.sidebar.collapsed";

function loadTasks() {

    try {

        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw === null) return INITIAL_TASKS;

        const parsed = JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : INITIAL_TASKS;

    } catch {
        return INITIAL_TASKS;
    }
}

function loadCollapsed() {

    try {
        return localStorage.getItem(SIDEBAR_KEY) === "1";
    } catch {
        return false;
    }
}

/* ── Protected Route ──────────────────────────────────── */

function ProtectedRoute({isLoggedIn, children}) {
    return isLoggedIn ? children : <Navigate to="/" replace/>;
}

/* ── App ──────────────────────────────────────────────── */

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [tasks, setTasks] = useState(loadTasks);

    const [modalOpen, setModalOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(loadCollapsed);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch {
           /* storage quota/ privacy mode — ignore */
        }
    }, [tasks]);

    useEffect(() => {

        try {
            localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
        } catch {
           /* ignore */
        }
    }, [collapsed]);

    const login = useCallback(() => setIsLoggedIn(true), []);

    const logout = useCallback(() => setIsLoggedIn(false), []);

    const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

    const togglePin = useCallback((id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, isPinned: !t.isPinned} : t)));
    }, []);

    const toggleDone = useCallback((id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, done: !t.done} : t)));
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const editTitle = useCallback((id, title) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, title} : t)));
    }, []);

    const addTask = useCallback((data) => {

        const newTask = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: data.title,
            tag: data.tag,
            priority: data.priority,
            isPinned: false,
            done: false,
            createdAt: Date.now()
        };

        setTasks((prev) => [newTask, ...prev]);

    }, []);

    const sortedTasks = useMemo(() => {

        const pending = tasks.filter((t) => !t.done);

        const pinned = pending.filter((t) => t.isPinned);

        const rest = pending.filter((t) => !t.isPinned);

        return [...pinned, ...rest];

    }, [tasks]);

    const historyTasks = useMemo(() => tasks.filter((t) => t.done), [tasks]);

    const shell = (title, content) => (
        <Box sx={{display: "flex", minHeight: "100vh", bgcolor: "background.default"}}>
            <Sidebar pendingCount={sortedTasks.length} historyCount={historyTasks.length} collapsed={collapsed} onToggleCollapsed={toggleCollapsed}/>
            <Box sx={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative"}}>
                <Navigation onLogout={logout} title={title}/>
                {content}
                <Tooltip title="Add task" arrow placement="left">
                    <Fab color="primary" onClick={() => setModalOpen(true)} aria-label="Add task" sx={{position: "fixed", bottom: 32, right: 32, boxShadow: "0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)", "&:hover": {boxShadow: "0 3px 8px 2px rgba(60,64,67,0.18), 0 1px 2px 0 rgba(60,64,67,0.3)"}}}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes>
                <Route path="/" element={<LandingPage onLogin={login} isLoggedIn={isLoggedIn}/>}/>
                <Route path="/dashboard" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            {shell("Pending Tasks",
                                <Dashboard tasks={sortedTasks} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask} onEditTitle={editTitle}/>
                            )}
                        </ProtectedRoute>
                }/>
                <Route path="/history" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            {shell("Completed History",
                                <HistoryPage tasks={historyTasks} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask}/>
                            )}
                        </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
            <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addTask}/>
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
