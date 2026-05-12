
import "./tailwind/tailwind.css";

import {useState, useMemo, useCallback, useEffect, useRef, memo, startTransition} from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import {ThemeProvider, createTheme, CssBaseline, Box, Fab, Tooltip} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import AddIcon from "@mui/icons-material/Add";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import SchedulePage from "./pages/SchedulePage";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import AddTaskModal from "./components/AddTaskModal";

import {uid, todayStr, defaultTriggerTime, parseDeadline, pad2, localDateStr, MOTION_FAST, MOTION_BASE, RADIUS_SM, RADIUS_MD, RADIUS_LG, SEALER_SHADOW, SPECULAR_HIGHLIGHT, SURFACE_SPECULAR, BUTTON_SHADOW, BUTTON_SHADOW_HOVER, CARD_SHADOW, tactileTransition, parseClockTime, normalizeTasks, normalizeTask, normalizeSchedules, normalizeSchedule, normalizePrefs, normalizeSortBy, normalizeTagFilter, normalizeOverdueAction, DEFAULT_PREFS, glassSurfaceSx, GLASS_BG_STRONG} from "./javascripts/shared";

const FONT_DISPLAY = '"Plus Jakarta Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif';

const FONT_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

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
        h6: {fontWeight: 600, letterSpacing: "-0.014em"}, 
        subtitle1: {fontWeight: 500, letterSpacing: "-0.006em"}, 
        body1: {letterSpacing: "-0.003em"}, 
        body2: {letterSpacing: "-0.003em"}, 
        button: {textTransform: "none", fontWeight: 600, letterSpacing: "-0.005em"}, 
        overline: {fontFamily: FONT_MONO, fontWeight: 500, letterSpacing: "0.10em"}
    }, 

    shape: {borderRadius: RADIUS_MD}, 

    components: {

        MuiCssBaseline: {

            styleOverrides: {
                body: {fontFamily: FONT_DISPLAY}, 
                "*::-webkit-scrollbar": {width: 8, height: 8}, 
                "*::-webkit-scrollbar-track": {background: "transparent"}, 
                "*::-webkit-scrollbar-thumb": {background: "#D2D9E4", borderRadius: 6, border: "2px solid transparent", backgroundClip: "padding-box"}, 
                "*::-webkit-scrollbar-thumb:hover": {background: "#B7C0CF", backgroundClip: "padding-box"}
            }
        }, 

        MuiButton: {

            styleOverrides: {

                root: {borderRadius: RADIUS_MD, padding: "8px 22px", fontWeight: 600, transition: tactileTransition(), backfaceVisibility: "hidden", backgroundClip: "padding-box"}, 

                contained: {
                    boxShadow: BUTTON_SHADOW, 
                    "&:hover": {boxShadow: BUTTON_SHADOW_HOVER, transform: "scale(1.05)"}, 
                    "&:active": {transform: "scale(0.96)"}
                }, 

                text: {
                    "&:hover": {backgroundColor: "rgba(31, 111, 235, 0.08)"}
                }
            }
        }, 

        MuiCard: {

            styleOverrides: {
                root: {borderRadius: RADIUS_LG, border: "1px solid #E5E9F0", backgroundClip: "padding-box", boxShadow: CARD_SHADOW, transition: tactileTransition("transform, box-shadow, border-color, opacity"), backfaceVisibility: "hidden"}
            }
        }, 

        MuiPaper: {

            styleOverrides: {
                root: {backgroundImage: "none", backgroundClip: "padding-box"}
            }
        }, 

        MuiTooltip: {

            defaultProps: {arrow: true, enterDelay: 320, enterNextDelay: 160}, 

            styleOverrides: {
                tooltip: {backgroundColor: "#0F1828", color: "#FFFFFF", fontSize: 11.5, fontWeight: 500, padding: "6px 10px", borderRadius: RADIUS_SM, boxShadow: `${SEALER_SHADOW}, 0 8px 24px -8px rgba(15, 24, 40, 0.20)`, fontFamily: FONT_DISPLAY}, 
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

                root: {
                    fontFamily: FONT_DISPLAY, 
                    textTransform: "none", 
                    transition: tactileTransition(), 
                    backgroundClip: "padding-box", 
                    "&:active": {transform: "scale(0.96)"}
                }
            }
        }, 

        MuiOutlinedInput: {

            styleOverrides: {

                root: {
                    borderRadius: RADIUS_MD, 
                    backgroundClip: "padding-box", 
                    transition: tactileTransition("box-shadow, border-color, background-color"), 
                    "& .MuiOutlinedInput-notchedOutline": {borderColor: "#E5E9F0", transition: tactileTransition("border-color")}, 
                    "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#B7C0CF"}, 
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderWidth: 1.5, borderColor: "#1F6FEB"}
                }
            }
        }, 

        MuiIconButton: {

            styleOverrides: {

                root: {
                    borderRadius: "50%", 
                    transition: tactileTransition(), 
                    "&:hover": {transform: "scale(1.05)"}, 
                    "&:active": {transform: "scale(0.96)"}
                }
            }
        }, 

        MuiFab: {

            styleOverrides: {

                root: {
                    boxShadow: `${SEALER_SHADOW}, 0 6px 16px -4px rgba(31, 111, 235, 0.40), 0 2px 6px rgba(31, 111, 235, 0.18), ${SPECULAR_HIGHLIGHT}`, 
                    transition: tactileTransition(), 
                    "&:hover": {boxShadow: `${SEALER_SHADOW}, 0 8px 24px -4px rgba(31, 111, 235, 0.50), 0 4px 8px rgba(31, 111, 235, 0.22), ${SPECULAR_HIGHLIGHT}`, transform: "scale(1.05)"}, 
                    "&:active": {transform: "scale(0.96)"}
                }
            }
        }, 

        MuiBackdrop: {

            styleOverrides: {
                root: {backgroundColor: "rgba(15, 24, 40, 0.04)", backdropFilter: "none", WebkitBackdropFilter: "none"}
            }
        }, 

        MuiDialog: {

            defaultProps: {

                transitionDuration: {enter: MOTION_BASE, exit: MOTION_FAST}, 

                slotProps: {

                    backdrop: {
                        sx: {backgroundColor: "rgba(15, 24, 40, 0.18)", backdropFilter: "none", WebkitBackdropFilter: "none"}
                    }
                }
            }, 

            styleOverrides: {

                paper: {
                    ...glassSurfaceSx({radius: RADIUS_LG, backgroundColor: "#FBFCFE", boxShadow: `${SEALER_SHADOW}, 0 12px 28px -12px rgba(15, 24, 40, 0.16), 0 32px 80px -20px rgba(15, 24, 40, 0.12), ${SURFACE_SPECULAR}`}), 
                    backgroundImage: "none", 
                    backdropFilter: "none", 
                    WebkitBackdropFilter: "none", 
                    overflow: "visible"
                }
            }
        }, 

        MuiPopover: {

            defaultProps: {
                disableScrollLock: true, 
                transitionDuration: {enter: MOTION_FAST, exit: MOTION_FAST}
            }, 

            styleOverrides: {

                paper: {
                    ...glassSurfaceSx({radius: RADIUS_MD, backgroundColor: GLASS_BG_STRONG, boxShadow: `${SEALER_SHADOW}, 0 1px 4px rgba(15, 24, 40, 0.04), 0 12px 24px -6px rgba(15, 24, 40, 0.12), ${SURFACE_SPECULAR}`})
                }
            }
        }, 

        MuiMenu: {

            defaultProps: {disableScrollLock: true}, 

            styleOverrides: {

                paper: {
                    ...glassSurfaceSx({radius: RADIUS_MD, backgroundColor: GLASS_BG_STRONG, boxShadow: `${SEALER_SHADOW}, 0 1px 4px rgba(15, 24, 40, 0.04), 0 12px 24px -6px rgba(15, 24, 40, 0.12), ${SURFACE_SPECULAR}`})
                }, 

                list: {paddingTop: 6, paddingBottom: 6}

            }
        }, 

        MuiMenuItem: {

            styleOverrides: {

                root: {

                    borderRadius: RADIUS_SM, 

                    marginInline: 6, 

                    paddingInline: 10, 

                    fontSize: "0.875rem", 

                    transition: tactileTransition("background-color, color, transform", MOTION_FAST), 

                    "&:active": {transform: "scale(0.98)"}, 

                    "&:hover": {backgroundColor: "rgba(31, 111, 235, 0.08)"}, 

                    "&.Mui-selected": {
                        backgroundColor: "rgba(31, 111, 235, 0.12)", 
                        "&:hover": {backgroundColor: "rgba(31, 111, 235, 0.16)"}
                    }
                }
            }
        }, 

        MuiToggleButtonGroup: {

            styleOverrides: {

                root: {gap: 6, flexWrap: "wrap"}, 

                grouped: {
                    margin: "0 !important", 
                    borderWidth: 1, 
                    borderStyle: "solid", 
                    borderColor: "#E5E9F0", 
                    borderRadius: `${RADIUS_MD}px !important`, 
                    "&:not(:first-of-type)": {marginLeft: "0 !important", borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: "#E5E9F0", borderTopLeftRadius: "12px !important", borderBottomLeftRadius: "12px !important"}, 
                    "&:not(:last-of-type)": {borderTopRightRadius: "12px !important", borderBottomRightRadius: "12px !important"}
                }
            }
        }, 

        MuiLinearProgress: {

            styleOverrides: {
                root: {borderRadius: 4, backgroundColor: "rgba(15, 24, 40, 0.06)", boxShadow: SEALER_SHADOW}, 
                bar: {borderRadius: 4, transition: tactileTransition("transform", MOTION_BASE)}
            }
        }, 

        MuiSwitch: {

            styleOverrides: {

                root: {
                    "& .MuiSwitch-thumb": {boxShadow: `${SEALER_SHADOW}, 0 1px 3px rgba(15, 24, 40, 0.16)`, transition: tactileTransition("transform, box-shadow", MOTION_FAST)}, 
                    "&:active .MuiSwitch-thumb": {transform: "scale(0.95)"}
                }
            }
        }
    }
});

function seedEveningDeadline() {

    const d = new Date();

    d.setHours(20, 0, 0, 0);

    return `${localDateStr(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

}

function triggerTimeHasPassed(triggerTime) {

    const {hour, minute} = parseClockTime(triggerTime);

    const target = new Date();

    target.setHours(hour, minute, 0, 0);

    return target.getTime() <= Date.now();

}

function shouldTriggerToday(template) {

    const now = new Date();

    const last = template.lastTriggered ? new Date(template.lastTriggered) : null;

    const lastDate = last && !isNaN(last.getTime()) ? localDateStr(last) : null;

    if (lastDate === todayStr() || !triggerTimeHasPassed(template.triggerTime)) return false;

    if (template.frequency === "daily") return true;

    if (template.frequency === "weekly") return (template.weekDays || []).includes(now.getDay());

    if (template.frequency === "monthly") {

        const dayOfMonth = now.getDate();

        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const targetDays = template.monthDays || [];

        if (targetDays.includes(dayOfMonth)) return true;

        return dayOfMonth === lastDayOfMonth && targetDays.some((d) => d > lastDayOfMonth);

    }
    return false;
}

function taskFromTemplate(template) {

    const subs = (template.subtasks || []).map((sub) => ({...sub, id: uid(), done: false}));

    const time = template.triggerTime || defaultTriggerTime();

    return {id: uid(), title: template.title, tag: template.tag, priority: template.priority, isPinned: false, done: false, deadline: `${todayStr()}T${time}`, subtasks: subs, createdAt: Date.now(), scheduleId: template.id};

}

function resolveDueSchedules(schedules) {

    const spawnedTasks = [];

    let changed = false;

    const now = Date.now();

    const safeSchedules = Array.isArray(schedules) ? schedules : [];

    const nextSchedules = safeSchedules.map((s) => {

        if (!s.isActive || !shouldTriggerToday(s)) return s;

        changed = true;

        spawnedTasks.push(taskFromTemplate(s));

        return {...s, lastTriggered: now};

    });
    return changed ? {schedules: nextSchedules, spawnedTasks} : {schedules, spawnedTasks};
}

function computeInitialState() {

    const storedTasks = load(STORAGE_KEY, null);

    const storedSchedules = load(SCHEDULE_KEY, []);

    const baseTasks = Array.isArray(storedTasks) ? normalizeTasks(storedTasks) : null;

    const baseSchedules = normalizeSchedules(storedSchedules);

    const resolvedTasks = baseTasks ?? normalizeTasks(INITIAL_TASKS);

    const due = resolveDueSchedules(baseSchedules);

    return {tasks: due.spawnedTasks.length > 0 ? normalizeTasks([...due.spawnedTasks, ...resolvedTasks]) : resolvedTasks, schedules: due.schedules};

}

const INITIAL_TASKS = [
    {
        id: "1", 
        title: "Hello World?", 
        isPinned: true, 
        priority: "high", 
        tag: "Life", 
        done: false, 
        deadline: seedEveningDeadline(), 
        subtasks: [], 
        createdAt: Date.now() - 172800000
    }, {
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
    }, {
        id: "3", title: "An Open Task?", 
        isPinned: true, 
        priority: "low", 
        tag: "Default", 
        done: false, 
        deadline: null, 
        subtasks: [], 
        createdAt: Date.now() - 259200000
    }
];

const STORAGE_KEY = "taskflow.tasks.v1";

const SCHEDULE_KEY = "taskflow.schedules.v1";

const PREFS_KEY = "taskflow.prefs.v1";

const SIDEBAR_KEY = "taskflow.sidebar.collapsed";

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

        return true;

    } catch {
        return false;
    }
}

const FAB_SX = {
    position: "fixed", 
    bottom: {xs: 24, sm: 32}, 
    right: {xs: 24, sm: 32}, 
    zIndex: 1200, 
    transform: "translate3d(0, 0, 0)", 
    backfaceVisibility: "hidden"
};

const TaskComposer = memo(function TaskComposer({onSubmit, onAddSchedule}) {

    const [open, setOpen] = useState(false);

    const openFrameRef = useRef(0);

    const cancelPendingOpen = useCallback(() => {

        if (!openFrameRef.current) return;

        cancelAnimationFrame(openFrameRef.current);

        openFrameRef.current = 0;

    }, []);

    const openModal = useCallback(() => {

        cancelPendingOpen();

        openFrameRef.current = requestAnimationFrame(() => {

            openFrameRef.current = 0;

            startTransition(() => setOpen(true));

        });
    }, [cancelPendingOpen]);

    const closeModal = useCallback(() => {

        cancelPendingOpen();

        setOpen(false);

    }, [cancelPendingOpen]);

    useEffect(() => cancelPendingOpen, [cancelPendingOpen]);

    return (
        <>
            <Tooltip title="New task" placement="left" arrow>
                <Fab color="primary" onClick={openModal} aria-label="Add task" sx={FAB_SX}>
                    <AddIcon/>
                </Fab>
            </Tooltip>
            <AddTaskModal open={open} onClose={closeModal} onSubmit={onSubmit} onAddSchedule={onAddSchedule}/>
        </>
    );
});

function App() {

    const [initState] = useState(computeInitialState);

    const [tasks, setTasks] = useState(initState.tasks);

    const [schedules, setSchedules] = useState(initState.schedules);

    const [prefs, setPrefs] = useState(() => normalizePrefs(load(PREFS_KEY, DEFAULT_PREFS)));

    const [collapsed, setCollapsed] = useState(() => load(SIDEBAR_KEY, false));

    const schedulesRef = useRef(schedules);

    useEffect(() => {
        schedulesRef.current = schedules;
    }, [schedules]);

    useEffect(() => {
        save(STORAGE_KEY, tasks);
    }, [tasks]);

    useEffect(() => {
        save(SCHEDULE_KEY, schedules);
    }, [schedules]);

    useEffect(() => {
        save(PREFS_KEY, prefs);
    }, [prefs]);

    useEffect(() => {
        save(SIDEBAR_KEY, collapsed);
    }, [collapsed]);

    const applyOverdueAction = useCallback(() => {

        if (prefs.overdueAction === "none") return;

        const now = Date.now();

        setTasks((prev) => {

            let changed = false;

            const next = [];

            for (const t of prev) {

                if (!t.done && t.deadline) {

                    const dl = parseDeadline(t.deadline);

                    if (dl && dl.getTime() < now) {

                        changed = true;

                        if (prefs.overdueAction === "delete") continue;

                        const subs = (t.subtasks || []).map((s) => (s.done ? s : {...s, done: true}));

                        next.push({...t, done: true, isPinned: false, subtasks: subs});

                        continue;

                    }
                }

                next.push(t);

            }
            return changed ? next : prev;
        });
    }, [prefs.overdueAction]);

    useEffect(() => {

        applyOverdueAction();

        if (prefs.overdueAction === "none") return undefined;

        const id = window.setInterval(applyOverdueAction, 60000);

        return () => window.clearInterval(id);

    }, [applyOverdueAction, prefs.overdueAction]);

    const spawnDueTemplates = useCallback(() => {

        const due = resolveDueSchedules(schedulesRef.current);

        if (due.spawnedTasks.length === 0) return;

        schedulesRef.current = due.schedules;

        setSchedules(due.schedules);

        setTasks((current) => normalizeTasks([...due.spawnedTasks, ...current]));

    }, []);

    useEffect(() => {

        spawnDueTemplates();

        const id = window.setInterval(spawnDueTemplates, 60000);

        return () => window.clearInterval(id);

    }, [spawnDueTemplates]);

    const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

    const togglePin = useCallback((id) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, isPinned: !t.isPinned} : t))), []);

    const toggleDone = useCallback((id) => {

        setTasks((prev) => prev.map((t) => {

            if (t.id !== id) return t;

            if (t.done) return {...t, done: false, subtasks: (t.subtasks || []).map((s) => ({...s, done: false}))};

            const subs = (t.subtasks || []).map((s) => (s.done ? s : {...s, done: true}));

            return {...t, done: true, isPinned: false, subtasks: subs};

        }));
    }, []);

    const deleteTask = useCallback((id) => setTasks((prev) => prev.filter((t) => t.id !== id)), []);

    const editTitle = useCallback((id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, title} : t))), []);

    const addTask = useCallback((data) => {

        const subs = (data.subtasks || []).map((s) => ({...s, id: uid()}));

        setTasks((prev) => [normalizeTask({id: uid(), title: data.title, tag: data.tag, priority: data.priority, deadline: data.deadline || null, isPinned: false, done: false, subtasks: subs, createdAt: Date.now()}), ...prev]);

    }, []);

    const addSubtask = useCallback((id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, subtasks: [...(t.subtasks || []), {id: uid(), title, done: false, weight: 1}]} : t))), []);

    const toggleSubtask = useCallback((id, subId) => {

        setTasks((prev) => prev.map((t) => {

            if (t.id !== id) return t;

            const subs = (t.subtasks || []).map((s) => (s.id === subId ? {...s, done: !s.done} : s));

            const allDone = subs.length > 0 && subs.every((s) => s.done);

            return {...t, subtasks: subs, ...(allDone && !t.done ? {done: true, isPinned: false} : {})};

        }));
    }, []);

    const deleteSubtask = useCallback((id, subId) => setTasks((prev) => prev.map((t) => (t.id === id ? {...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subId)} : t))), []);

    const commitSchedules = useCallback((updater) => {

        setSchedules((prev) => {

            const next = updater(prev);

            schedulesRef.current = next;

            return next;

        });
    }, []);

    const addSchedule = useCallback((data) => {

            const subs = (data.subtasks || []).map((s) => ({title: s.title, weight: s.weight || 1}));

            const time = data.triggerTime || defaultTriggerTime();

            const now = Date.now();

            const schedule = normalizeSchedule({id: uid(), title: data.title, tag: data.tag, priority: data.priority, frequency: data.frequency, weekDays: data.weekDays, monthDays: data.monthDays, triggerTime: time, subtasks: subs, isActive: true, lastTriggered: triggerTimeHasPassed(time) ? now : null, createdAt: now});

            commitSchedules((prev) => [schedule, ...prev]);

    }, [commitSchedules]);

    const updateSchedule = useCallback((id, data) => {

            const subs = (data.subtasks || []).map((s) => ({title: s.title, weight: s.weight || 1}));

            const time = data.triggerTime || defaultTriggerTime();

            commitSchedules((prev) => prev.map((s) => (s.id === id ? normalizeSchedule({...s, title: data.title, tag: data.tag, priority: data.priority, frequency: data.frequency, weekDays: data.weekDays, monthDays: data.monthDays, triggerTime: time, subtasks: subs}) : s)));

    }, [commitSchedules]);

    const toggleScheduleActive = useCallback((id) => commitSchedules((prev) => prev.map((s) => (s.id === id ? {...s, isActive: !s.isActive} : s))), [commitSchedules]);

    const deleteSchedule = useCallback((id) => commitSchedules((prev) => prev.filter((s) => s.id !== id)), [commitSchedules]);

    const setSortBy = useCallback((sortBy) => {

        const nextSort = normalizeSortBy(sortBy);

        startTransition(() => setPrefs((p) => (p.sortBy === nextSort ? p : {...p, sortBy: nextSort})));

    }, []);

    const setTagFilter = useCallback((tagFilter) => {

        const nextTag = normalizeTagFilter(tagFilter);

        startTransition(() => setPrefs((p) => (p.tagFilter === nextTag ? p : {...p, tagFilter: nextTag})));

    }, []);

    const setOverdueAction = useCallback((overdueAction) => {

        const nextAction = normalizeOverdueAction(overdueAction);

        setPrefs((p) => (p.overdueAction === nextAction ? p : {...p, overdueAction: nextAction}));

    }, []);

    const pendingTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

    const historyTasks = useMemo(() => tasks.filter((t) => t.done).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)), [tasks]);

    const shell = (title, content, showFab = false) => (
        <Box className="grid grid-cols-[auto_1fr] h-screen overflow-hidden" sx={{bgcolor: "background.default"}}>
            <Box aria-hidden className="fixed inset-0 pointer-events-none" sx={{backgroundImage: "radial-gradient(circle at 18% 12%, rgba(31, 111, 235, 0.04) 0%, transparent 40%), radial-gradient(circle at 88% 85%, rgba(124, 92, 250, 0.03) 0%, transparent 42%)", zIndex: 0}}/>
            <Sidebar pendingCount={pendingTasks.length} historyCount={historyTasks.length} scheduleCount={schedules.length} collapsed={collapsed} onToggleCollapsed={toggleCollapsed}/>
            <Box data-scroll-root className="flex flex-col overflow-y-auto overflow-x-hidden" sx={{zIndex: 1, WebkitOverflowScrolling: "touch"}}>
                <Navigation title={title}/>
                {content}
                {showFab && <TaskComposer onSubmit={addTask} onAddSchedule={addSchedule}/>}
            </Box>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/dashboard" element={shell("Pending Tasks", <Dashboard tasks={pendingTasks} sortBy={prefs.sortBy} tagFilter={prefs.tagFilter} onSortChange={setSortBy} onTagFilterChange={setTagFilter} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask} onEditTitle={editTitle} onAddSubtask={addSubtask} onToggleSubtask={toggleSubtask} onDeleteSubtask={deleteSubtask}/>, true)}/>
                <Route path="/history" element={shell("Completed History", <HistoryPage tasks={historyTasks} onTogglePin={togglePin} onToggleDone={toggleDone} onDelete={deleteTask}/>)}/>
                <Route path="/schedule" element={shell("Recurring Schedule", <SchedulePage templates={schedules} overdueAction={prefs.overdueAction} onAdd={addSchedule} onUpdate={updateSchedule} onToggle={toggleScheduleActive} onDelete={deleteSchedule} onSetOverdueAction={setOverdueAction}/>)}/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </ThemeProvider>
    );
}

const rootElement = document.getElementById("root");

const root = globalThis.__TASKFLOW_ROOT__ || ReactDOM.createRoot(rootElement);

globalThis.__TASKFLOW_ROOT__ = root;

root.render(
    <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <App/>
        </LocalizationProvider>
    </HashRouter>
);
