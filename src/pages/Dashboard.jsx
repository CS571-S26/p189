
import {useMemo} from "react";
import {Box, Typography, Stack, Grow} from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import EventIcon from "@mui/icons-material/Event";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TaskCard from "../components/TaskCard";
import TagManager from "../components/TagManager";
import SortingToolbar from "../components/SortingToolbar";

const GRID_SX = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 2.25,
    alignItems: "start"
};

const PRIORITY_RANK = {high: 0, medium: 1, low: 2};

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function compareTasks(a, b, sortBy) {
    if (sortBy === "deadline") {
        if (!a.deadline && !b.deadline) return b.createdAt - a.createdAt;

        if (!a.deadline) return 1;

        if (!b.deadline) return -1;

        return a.deadline.localeCompare(b.deadline);
    }

    if (sortBy === "priority") {
        const diff = (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);

        return diff !== 0 ? diff : b.createdAt - a.createdAt;
    }

    if (sortBy === "tag") {
        const cmp = (a.tag || "").localeCompare(b.tag || "");

        return cmp !== 0 ? cmp : b.createdAt - a.createdAt;
    }

    return b.createdAt - a.createdAt;
}

function StatCell({icon, label, value, color}) {
    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 1.4, px: 2, py: 1.4, borderRadius: "14px", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", flex: 1, minWidth: 140, transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s", "&:hover": {borderColor: color, transform: "translateY(-1px)", boxShadow: `0 4px 12px -4px ${color}28`}}}>
            <Box sx={{width: 36, height: 36, borderRadius: "10px", bgcolor: `${color}1A`, color: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>{icon}</Box>
            <Box sx={{minWidth: 0}}>
                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", lineHeight: 1}}>{label}</Typography>
                <Typography sx={{fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.020em", color: "text.primary", lineHeight: 1.15, mt: 0.4}}>{value}</Typography>
            </Box>
        </Box>
    );
}

export default function Dashboard({tasks, sortBy, tagFilter, onSortChange, onTagFilterChange, onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask}) {
    const filteredTasks = useMemo(() => (tagFilter ? tasks.filter((t) => (t.tag || "Default") === tagFilter) : tasks), [tasks, tagFilter]);

    const pinnedTasks = useMemo(() => filteredTasks.filter((t) => t.isPinned).sort((a, b) => compareTasks(a, b, sortBy)), [filteredTasks, sortBy]);

    const otherTasks = useMemo(() => filteredTasks.filter((t) => !t.isPinned).sort((a, b) => compareTasks(a, b, sortBy)), [filteredTasks, sortBy]);

    const stats = useMemo(() => {
        const today = todayStr();

        let dueToday = 0;

        let overdue = 0;

        for (const t of tasks) {
            if (!t.deadline) continue;

            if (t.deadline === today) dueToday++;
            else if (t.deadline < today) overdue++;
        }

        return {dueToday, overdue, pinned: tasks.filter((t) => t.isPinned).length};
    }, [tasks]);

    const isEmpty = filteredTasks.length === 0;

    const hasAnyTask = tasks.length > 0;

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 12, maxWidth: 1400, width: "100%", mx: "auto"}}>
            {/* Stats strip */}
            {hasAnyTask && (
                <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} sx={{mb: 3}}>
                    <StatCell icon={<EventIcon sx={{fontSize: 19}} />} label="Due today" value={stats.dueToday} color="#1F6FEB" />
                    <StatCell icon={<WarningAmberRoundedIcon sx={{fontSize: 19}} />} label="Overdue" value={stats.overdue} color="#D93025" />
                    <StatCell icon={<PushPinIcon sx={{fontSize: 19}} />} label="Pinned" value={stats.pinned} color="#7C5CFA" />
                </Stack>
            )}

            {hasAnyTask && (
                <Stack direction={{xs: "column", md: "row"}} spacing={1.5} alignItems={{xs: "stretch", md: "center"}} sx={{mb: 3}}>
                    <TagManager tasks={tasks} activeTag={tagFilter} onChange={onTagFilterChange} />
                    <Box sx={{flexShrink: 0, display: "flex", justifyContent: {xs: "flex-start", md: "flex-end"}}}>
                        <SortingToolbar sortBy={sortBy} onChange={onSortChange} />
                    </Box>
                </Stack>
            )}

            {isEmpty ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 12, color: "text.secondary"}}>
                    {tagFilter ? (
                        <>
                            <Box sx={{width: 88, height: 88, borderRadius: "50%", bgcolor: "rgba(31,111,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5}}>
                                <SearchOffIcon sx={{fontSize: 44, color: "text.secondary", opacity: 0.6}} />
                            </Box>
                            <Typography sx={{fontWeight: 600, fontSize: "1.05rem", color: "text.primary", mb: 0.4}}>No tasks tagged “{tagFilter}”</Typography>
                            <Typography sx={{fontSize: "0.88rem", color: "text.secondary"}}>Try a different tag or clear the filter.</Typography>
                        </>
                    ) : (
                        <>
                            <Box sx={{width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, rgba(31,111,235,0.10) 0%, rgba(124,92,250,0.10) 100%)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5}}>
                                <InboxOutlinedIcon sx={{fontSize: 42, color: "primary.main"}} />
                            </Box>
                            <Typography sx={{fontWeight: 600, fontSize: "1.05rem", color: "text.primary", mb: 0.4}}>All clear — inbox zero!</Typography>
                            <Typography sx={{fontSize: "0.88rem", color: "text.secondary"}}>Tap the + button to capture your next task.</Typography>
                        </>
                    )}
                </Stack>
            ) : (
                <Stack spacing={4}>
                    {pinnedTasks.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                                <PushPinIcon sx={{fontSize: 14, color: "primary.main"}} />
                                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: "primary.main", fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, textTransform: "uppercase"}}>Pinned · {pinnedTasks.length}</Typography>
                            </Stack>
                            <Box sx={GRID_SX}>
                                {pinnedTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={220 + i * 50}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete} onEditTitle={onEditTitle} onAddSubtask={onAddSubtask} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask} />
                                    </Grow>
                                ))}
                            </Box>
                        </Box>
                    )}
                    {otherTasks.length > 0 && (
                        <Box>
                            {pinnedTasks.length > 0 && <Typography sx={{display: "block", fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, mb: 2, textTransform: "uppercase"}}>Others · {otherTasks.length}</Typography>}
                            <Box sx={GRID_SX}>
                                {otherTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={220 + i * 50}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete} onEditTitle={onEditTitle} onAddSubtask={onAddSubtask} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask} />
                                    </Grow>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}
