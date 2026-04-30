
import React, {useState, useMemo, useCallback, useEffect, useRef} from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import {ThemeProvider, createTheme, CssBaseline, Box, Fab, Tooltip, Zoom} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import SchedulePage from "./pages/SchedulePage";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import AddTaskModal from "./components/AddTaskModal";

/* ── Web fonts ──────────────────────────────────────────
   Injected at module load so we keep the project to a
   pure src/ structure (no bespoke index.html). Plus
   Jakarta Sans drives display + body, JetBrains Mono
   carries numerics & legends. */

if (typeof document !== "undefined" && !document.getElementById("__taskflow_fonts__")) {
    const head = document.head;

    const preconnect = document.createElement("link");

    preconnect.rel = "preconnect";

    preconnect.href = "https://fonts.googleapis.com";

    head.appendChild(preconnect);

    const preconnectGstatic = document.createElement("link");

    preconnectGstatic.rel = "preconnect";

    preconnectGstatic.href = "https://fonts.gstatic.com";

    preconnectGstatic.crossOrigin = "anonymous";

    head.appendChild(preconnectGstatic);

    const fontSheet = document.createElement("link");

    fontSheet.id = "__taskflow_fonts__";

    fontSheet.rel = "stylesheet";

    fontSheet.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

    head.appendChild(fontSheet);
}

/* ── Theme ──────────────────────────────────────────────
   Material foundation, Material 3-leaning surfaces,
   Plus Jakarta Sans for warmth + character without
   leaving the Material idiom. */

const FONT_DISPLAY = '"Plus Jakarta Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif';

const FONT_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

const ELEVATION = {
    soft: "0 1px 2px rgba(15,24,40,0.04), 0 1px 3px rgba(15,24,40,0.06)",
    floating: "0 12px 28px -10px rgba(15,24,40,0.18), 0 6px 12px -6px rgba(15,24,40,0.10)",
    fab: "0 6px 18px -4px rgba(31,111,235,0.45), 0 2px 6px rgba(31,111,235,0.20)"
};

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {main: "#1F6FEB", light: "#DDE9FF", dark: "#1556C2"},
        secondary: {main: "#7C5CFA"},
        error: {main: "#D93025"},
        warning: {main: "#E8710A"},
        success: {main: "#1E8E3E"},
        background: {default: "#F6F8FB", paper: "#FFFFFF"},
        text: {primary: "#0F1828", secondary: "#5A6B82", disabled: "#9AA6B8"},
        divider: "#E5E9F0"
    },

    typography: {
        fontFamily: FONT_DISPLAY,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        h3: {fontWeight: 300, letterSpacing: "-0.035em"},
        h4: {fontWeight: 400, letterSpacing: "-0.028em"},
        h5: {fontWeight: 500, letterSpacing: "-0.018em"},
        h6: {fontWeight: 600, letterSpacing: "-0.012em"},
        subtitle1: {fontWeight: 500, letterSpacing: "-0.005em"},
        body1: {letterSpacing: "-0.003em"},
        body2: {letterSpacing: "-0.003em"},
        button: {textTransform: "none", fontWeight: 600, letterSpacing: "-0.005em"},
        overline: {fontFamily: FONT_MONO, fontWeight: 500, letterSpacing: "0.10em"}
    },

    shape: {borderRadius: 14},

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {fontFamily: FONT_DISPLAY},
                "*::-webkit-scrollbar": {width: 10, height: 10},
                "*::-webkit-scrollbar-track": {background: "transparent"},
                "*::-webkit-scrollbar-thumb": {background: "#D2D9E4", borderRadius: 6, border: "2px solid transparent", backgroundClip: "padding-box"},
                "*::-webkit-scrollbar-thumb:hover": {background: "#B7C0CF", backgroundClip: "padding-box"}
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {borderRadius: 22, padding: "8px 22px", fontWeight: 600},
                contained: {boxShadow: "none", "&:hover": {boxShadow: "0 4px 12px -2px rgba(31,111,235,0.32)"}}
            }
        },

        MuiCard: {
            styleOverrides: {
                root: {borderRadius: 16, border: "1px solid #ECEFF4", boxShadow: ELEVATION.soft, transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s cubic-bezier(0.4,0,0.2,1), border-color 0.22s"}
            }
        },

        MuiPaper: {
            styleOverrides: {root: {backgroundImage: "none"}}
        },

        MuiTooltip: {
            defaultProps: {arrow: true, enterDelay: 320, enterNextDelay: 160},
            styleOverrides: {
                tooltip: {backgroundColor: "#0F1828", color: "#FFFFFF", fontSize: 11.5, fontWeight: 500, padding: "6px 10px", borderRadius: 8, boxShadow: ELEVATION.floating, fontFamily: FONT_DISPLAY},
                arrow: {color: "#0F1828"}
            }
        },

        MuiChip: {
            styleOverrides: {
                root: {fontFamily: FONT_DISPLAY, fontWeight: 500}
            }
        },

        MuiToggleButton: {
            styleOverrides: {
                root: {fontFamily: FONT_DISPLAY, textTransform: "none"}
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {borderRadius: 12, transition: "box-shadow 0.18s ease", "& .MuiOutlinedInput-notchedOutline": {borderColor: "#DDE2EA", transition: "border-color 0.15s"}, "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#B7C0CF"}, "&.Mui-focused": {boxShadow: "0 0 0 4px rgba(31,111,235,0.14)"}, "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderWidth: 1.5, borderColor: "#1F6FEB"}}
            }
        },

        MuiFab: {
            styleOverrides: {
                root: {boxShadow: ELEVATION.fab, "&:hover": {boxShadow: "0 10px 24px -4px rgba(31,111,235,0.55), 0 4px 8px rgba(31,111,235,0.25)"}}
            }
        },

        /* Dialog: layered above all surfaces. Slightly tinted
           paper so any white popover (native date picker, menu)
           that opens above it has clear separation, plus a
           dramatic shadow + 1px hairline border to define the
           edge against any underlying content. */

        MuiDialog: {
            styleOverrides: {
                paper: {borderRadius: 22, border: "1px solid #E5E9F0", backgroundColor: "#FBFCFE", backgroundImage: "none", boxShadow: "0 32px 80px -20px rgba(15,24,40,0.32), 0 12px 28px -12px rgba(15,24,40,0.18)"}
            }
        },

        MuiBackdrop: {
            styleOverrides: {
                root: {backgroundColor: "rgba(15,24,40,0.48)"}
            }
        },

        /* Popover & Menu: when these open above a Dialog (e.g.
           the priority Select inside a modal), they need to read
           as a distinct layer. Stronger shadow + hairline border
           give them a card-like elevation. */

        MuiPopover: {
            styleOverrides: {
                paper: {borderRadius: 14, border: "1px solid #E5E9F0", boxShadow: "0 18px 40px -12px rgba(15,24,40,0.22), 0 6px 16px -6px rgba(15,24,40,0.10)"}
            }
        },

        MuiMenu: {
            styleOverrides: {
                paper: {borderRadius: 14, border: "1px solid #E5E9F0", boxShadow: "0 18px 40px -12px rgba(15,24,40,0.22), 0 6px 16px -6px rgba(15,24,40,0.10)"},
                list: {paddingTop: 6, paddingBottom: 6}
            }
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {borderRadius: 8, marginInline: 6, paddingInline: 10, fontSize: "0.875rem", "&:hover": {backgroundColor: "rgba(31,111,235,0.06)"}, "&.Mui-selected": {backgroundColor: "rgba(31,111,235,0.10)", "&:hover": {backgroundColor: "rgba(31,111,235,0.14)"}}}
            }
        },

        /* ToggleButtonGroup: default behavior collapses borders
           between adjacent buttons (segmented-control look). For
           our pill-style groups we want individual pills with
           breathing room — flatten the grouped margins/borders
           so per-button sx can render true pills with `gap`. */

        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {gap: 8, flexWrap: "wrap"},
                grouped: {
                    margin: "0 !important",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#DDE2EA",
                    borderRadius: "999px !important",
                    "&:not(:first-of-type)": {marginLeft: "0 !important", borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: "#DDE2EA", borderTopLeftRadius: "999px !important", borderBottomLeftRadius: "999px !important"},
                    "&:not(:last-of-type)": {borderTopRightRadius: "999px !important", borderBottomRightRadius: "999px !important"}
                }
            }
        }
    }
});

/* ── Helpers ─────────────────────────────────────────── */

const todayStr = () => new Date().toISOString().slice(0, 10);

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ── Recurring trigger check ─────────────────────────── */

function shouldTriggerToday(template) {
    const now = new Date();

    const lastDate = new Date(template.lastTriggered).toISOString().slice(0, 10);

    if (lastDate === todayStr()) return false;

    if (template.frequency === "daily") return true;

    if (template.frequency === "weekly") {
        return (template.weekDays || []).includes(now.getDay());
    }

    if (template.frequency === "monthly") {
        const dayOfMonth = now.getDate();

        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const targetDays = template.monthDays || [];

        if (targetDays.includes(dayOfMonth)) return true;

        if (dayOfMonth === lastDayOfMonth) {
            return targetDays.some((d) => d > lastDayOfMonth);
        }

        return false;
    }

    return false;
}

/* ── Initial Tasks ───────────────────────────────────── */

const INITIAL_TASKS = [
    {id: "1", title: "Hello World?", isPinned: true, priority: "high", tag: "Life", done: false, deadline: todayStr(), subtasks: [], createdAt: Date.now() - 172800000},
    {
        id: "2",
        title: "TaskFlow",
        isPinned: false,
        priority: "medium",
        tag: "Project",
        done: false,
        deadline: null,
        subtasks: [
            {id: "2-a", title: "Review components", done: true, weight: 1},
            {id: "2-b", title: "Polish landing page", done: false, weight: 2}
        ],
        createdAt: Date.now() - 86400000
    },
    {id: "3", title: "An Open Task?", isPinned: true, priority: "low", tag: "Default", done: false, deadline: null, subtasks: [], createdAt: Date.now() - 259200000}
];

/* ── Persistence ──────────────────────────────────────── */

const STORAGE_KEY = "taskflow.tasks.v1";

const SCHEDULE_KEY = "taskflow.schedules.v1";

const PREFS_KEY = "taskflow.prefs.v1";

const SIDEBAR_KEY = "taskflow.sidebar.collapsed";

const DEFAULT_PREFS = {sortBy: "deadline", overdueAction: "none"};

function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (raw === null) return fallback;

        return JSON.parse(raw) ?? fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* quota / privacy mode */
    }
}

/* ── Protected Route ──────────────────────────────────── */

function ProtectedRoute({isLoggedIn, children}) {
    return isLoggedIn ? children : <Navigate to="/" replace />;
}

/* ── App ──────────────────────────────────────────────── */

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [tasks, setTasks] = useState(() => {
        const stored = load(STORAGE_KEY, null);

        return Array.isArray(stored) ? stored : INITIAL_TASKS;
    });

    const [schedules, setSchedules] = useState(() => {
        const stored = load(SCHEDULE_KEY, []);

        return Array.isArray(stored) ? stored : [];
    });

    const [prefs, setPrefs] = useState(() => ({...DEFAULT_PREFS, ...load(PREFS_KEY, {})}));

    const [tagFilter, setTagFilter] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(() => load(SIDEBAR_KEY, false));

    const recurringRanRef = useRef(false);

    /* Persistence */

    useEffect(() => save(STORAGE_KEY, tasks), [tasks]);

    useEffect(() => save(SCHEDULE_KEY, schedules), [schedules]);

    useEffect(() => save(PREFS_KEY, prefs), [prefs]);

    useEffect(() => save(SIDEBAR_KEY, collapsed), [collapsed]);

    /* Recurring schedule trigger on mount */

    useEffect(() => {
        if (recurringRanRef.current) return;

        recurringRanRef.current = true;

        const newTasks = [];

        let dirty = false;

        const updated = schedules.map((s) => {
            if (!s.isActive || !shouldTriggerToday(s)) return s;

            dirty = true;

            const subs = (s.subtasks || []).map((sub) => ({...sub, id: uid(), done: false}));

            newTasks.push({id: uid(), title: s.title, tag: s.tag, priority: s.priority, isPinned: false, done: false, deadline: null, subtasks: subs, createdAt: Date.now(), scheduleId: s.id});

            return {...s, lastTriggered: Date.now()};
        });

        if (dirty) {
            setSchedules(updated);

            setTasks((prev) => [...newTasks, ...prev]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Overdue handling */

    useEffect(() => {
        if (prefs.overdueAction === "none") return;

        const today = todayStr();

        setTasks((prev) => {
            let changed = false;

            const next = [];

            for (const t of prev) {
                if (!t.done && t.deadline && t.deadline < today) {
                    changed = true;

                    if (prefs.overdueAction === "delete") continue;

                    next.push({...t, done: true, isPinned: false});
                } else {
                    next.push(t);
                }
            }

            return changed ? next : prev;
        });
    }, [prefs.overdueAction]);

    /* ── Callbacks ──────────────────────────────────────── */

    const login = useCallback(() => setIsLoggedIn(true), []);

    const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

    const togglePin = useCallback((id) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, isPinned: !t.isPinned} : t))), []);

    const toggleDone = useCallback((id) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, done: !t.done} : t))), []);

    const deleteTask = useCallback((id) => setTasks((prev) => prev.filter((t) => t.id !== id)), []);

    const editTitle = useCallback((id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, title} : t))), []);

    const addTask = useCallback((data) => {
        const subs = (data.subtasks || []).map((s) => ({...s, id: uid()}));

        setTasks((prev) => [{id: uid(), title: data.title, tag: data.tag, priority: data.priority, deadline: data.deadline || null, isPinned: false, done: false, subtasks: subs, createdAt: Date.now()}, ...prev]);
    }, []);

    const addSubtask = useCallback((id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, subtasks: [...t.subtasks, {id: uid(), title, done: false, weight: 1}]} : t))), []);

    /* Subtask toggle with auto-complete: all subtasks done → parent done */

    const toggleSubtask = useCallback((id, subId) => {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id !== id) return t;

                const subs = t.subtasks.map((s) => (s.id === subId ? {...s, done: !s.done} : s));

                const allDone = subs.length > 0 && subs.every((s) => s.done);

                return {...t, subtasks: subs, ...(allDone && !t.done ? {done: true} : {})};
            })
        );
    }, []);

    const deleteSubtask = useCallback((id, subId) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, subtasks: t.subtasks.filter((s) => s.id !== subId)} : t))), []);

    const addSchedule = useCallback((data) => {
        const subs = (data.subtasks || []).map((s) => ({title: s.title, weight: s.weight || 1}));

        setSchedules((prev) => [{id: uid(), title: data.title, tag: data.tag, priority: data.priority, frequency: data.frequency, weekDays: data.weekDays || [1, 3, 5], monthDays: data.monthDays || [1], subtasks: subs, isActive: true, lastTriggered: Date.now(), createdAt: Date.now()}, ...prev]);
    }, []);

    const toggleScheduleActive = useCallback((id) => setSchedules((prev) => prev.map((s) => (s.id === id ? {...s, isActive: !s.isActive} : s))), []);

    const deleteSchedule = useCallback((id) => setSchedules((prev) => prev.filter((s) => s.id !== id)), []);

    const setSortBy = useCallback((sortBy) => setPrefs((p) => ({...p, sortBy})), []);

    const setOverdueAction = useCallback((overdueAction) => setPrefs((p) => ({...p, overdueAction})), []);

    /* ── Derived ────────────────────────────────────────── */

    const pendingTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

    const historyTasks = useMemo(() => tasks.filter((t) => t.done).sort((a, b) => b.createdAt - a.createdAt), [tasks]);

    /* ── Shell ──────────────────────────────────────────── */

    const shell = (title, content) => (
        <Box sx={{display: "flex", height: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden", "&::before": {content: '""', position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 18% 12%, rgba(31,111,235,0.05) 0%, transparent 42%), radial-gradient(circle at 92% 88%, rgba(124,92,250,0.04) 0%, transparent 45%)", pointerEvents: "none", zIndex: 0}}}>
            <Sidebar pendingCount={pendingTasks.length} historyCount={historyTasks.length} scheduleCount={schedules.length} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
            <Box data-scroll-root sx={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, position: "relative", zIndex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch"}}>
                <Navigation title={title} />
                {content}
                <Zoom in style={{transitionDelay: "120ms"}}>
                    <Tooltip title="New task" placement="left" arrow>
                        <Fab color="primary" onClick={() => setModalOpen(true)} aria-label="Add task" sx={{position: "fixed", bottom: {xs: 24, sm: 32}, right: {xs: 24, sm: 32}, zIndex: 1200}}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Zoom>
            </Box>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<LandingPage onLogin={login} isLoggedIn={isLoggedIn} />} />
                <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn}>{shell("Pending Tasks", <Dashboard tasks={pendingTasks} sortBy={prefs.sortBy} tagFilter={tagFilter} onSortChange={setSortBy} onTagFilterChange={setTagFilter} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask} onEditTitle={editTitle} onAddSubtask={addSubtask} onToggleSubtask={toggleSubtask} onDeleteSubtask={deleteSubtask} />)}</ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute isLoggedIn={isLoggedIn}>{shell("Completed History", <HistoryPage tasks={historyTasks} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask} />)}</ProtectedRoute>} />
                <Route path="/schedule" element={<ProtectedRoute isLoggedIn={isLoggedIn}>{shell("Recurring Schedule", <SchedulePage templates={schedules} overdueAction={prefs.overdueAction} onAdd={addSchedule} onToggle={toggleScheduleActive} onDelete={deleteSchedule} onSetOverdueAction={setOverdueAction} />)}</ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addTask} onAddSchedule={addSchedule} />
        </ThemeProvider>
    );
}

/* ── Mount ─────────────────────────────────────────────── */

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
);
