
import {memo, useDeferredValue, useMemo} from "react";
import {Box, Typography, Stack, useTheme, useMediaQuery} from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import EventIcon from "@mui/icons-material/Event";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TaskCard from "../components/TaskCard";
import TagManager from "../components/TagManager";
import SortingToolbar from "../components/SortingToolbar";

import {MONO_SX, toCols, SEALER_SHADOW, SURFACE_SPECULAR, RADIUS_LG, RADIUS_SM, tactileTransition, localDateStr, compareTasks, normalizeTag, normalizeTagFilter, normalizeSortBy, staggerDelay} from "../javascripts/shared";

const STAT_CELL_SX = {gap: 1.5, px: 2, py: 1.5, minWidth: 140, borderRadius: `${RADIUS_LG}px`, border: "1px solid", borderColor: "divider", bgcolor: "#FFFFFF", backgroundClip: "padding-box", boxShadow: `${SEALER_SHADOW}, 0 1px 2px rgba(15, 24, 40, 0.03), ${SURFACE_SPECULAR}`, transition: tactileTransition("transform, box-shadow, border-color"), backfaceVisibility: "hidden"};

const STAT_LABEL_SX = {...MONO_SX, fontSize: 9.5, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", lineHeight: 1};

const STAT_VALUE_SX = {fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.020em", color: "text.primary", lineHeight: 1.15, mt: 0.35};

const SECTION_LABEL_SX = {...MONO_SX, fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, textTransform: "uppercase"};

const CARD_VIRTUAL_STYLE = {contentVisibility: "auto", containIntrinsicSize: "188px", contain: "layout style", padding: "6px 6px 14px", overflow: "visible"};

const EMPTY_TITLE_SX = {fontWeight: 600, fontSize: "1.05rem", color: "text.primary", mb: 0.4};

const EMPTY_HINT_SX = {fontSize: "0.88rem"};

function StatCell({icon, label, value, color}) {

    return (
        <Box className="flex items-center flex-1" sx={{...STAT_CELL_SX, "&:hover": {transform: "translateY(-1px)", borderColor: `${color}40`, boxShadow: `${SEALER_SHADOW}, 0 6px 16px -8px rgba(15, 24, 40, 0.14), 0 0 0 1px ${color}18, ${SURFACE_SPECULAR}`}}}>
            <Box className="flex items-center justify-center shrink-0" sx={{width: 36, height: 36, borderRadius: `${RADIUS_SM}px`, bgcolor: `${color}14`, color, boxShadow: SURFACE_SPECULAR}}>
                {icon}
            </Box>
            <Box className="min-w-0">
                <Typography sx={STAT_LABEL_SX}>{label}</Typography>
                <Typography className="tabular-nums" sx={STAT_VALUE_SX}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function SectionHeader({label, count, color = "text.secondary", icon}) {

    return (
        <Box className="flex items-center gap-2 mb-3.5">
            {icon}
            <Typography sx={{...SECTION_LABEL_SX, color}}>
                {label} · {count}
            </Typography>
        </Box>
    );
}

function EmptyState({tagFilter}) {

    return (
        <Stack alignItems="center" justifyContent="center" sx={{mt: 12, color: "text.secondary", contain: "layout paint style"}}>
            {tagFilter ? (
                <>
                    <Box className="flex items-center justify-center" sx={{width: 84, height: 84, borderRadius: "50%", bgcolor: "rgba(31, 111, 235, 0.06)", mb: 2.5}}>
                        <SearchOffIcon sx={{fontSize: 40, color: "text.secondary", opacity: 0.6}}/>
                    </Box>
                    <Typography sx={EMPTY_TITLE_SX}>No tasks tagged "{tagFilter}"</Typography>
                    <Typography sx={EMPTY_HINT_SX}>Try a different tag or clear the filter.</Typography>
                </>
            ) : (
                <>
                    <Box className="flex items-center justify-center" sx={{width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg, rgba(31, 111, 235, 0.08) 0%, rgba(124, 92, 250, 0.08) 100%)", mb: 2.5}}>
                        <InboxOutlinedIcon sx={{fontSize: 40, color: "primary.main"}}/>
                    </Box>
                    <Typography sx={EMPTY_TITLE_SX}>All clear — inbox zero!</Typography>
                    <Typography sx={EMPTY_HINT_SX}>Tap the + button to capture your next task.</Typography>
                </>
            )}
        </Stack>
    );
}

const TaskColumns = memo(function TaskColumns({cols, numCols, cardHandlers}) {

    return (
        <div className="flex gap-4 -mx-1 px-1 pt-1 pb-2 overflow-visible">
            {cols.map((col, ci) => (
                <div key={ci} className="flex-1 min-w-0 flex flex-col gap-2 overflow-visible">
                    {col.map((task, ri) => {

                        const index = ri * numCols + ci;

                        return (
                            <div key={task.id} className="animate-fade-in-up" style={{...CARD_VIRTUAL_STYLE, animationDelay: staggerDelay(index)}}>
                                <TaskCard task={task} {...cardHandlers}/>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
});

function Dashboard({tasks = [], sortBy, tagFilter, onSortChange, onTagFilterChange, onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask}) {

    const theme = useTheme();

    const is2 = useMediaQuery(theme.breakpoints.up("sm"));

    const is3 = useMediaQuery(theme.breakpoints.up("md"));

    const is4 = useMediaQuery(theme.breakpoints.up("lg"));

    const numCols = is4 ? 4 : is3 ? 3 : is2 ? 2 : 1;

    const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

    const activeSort = useDeferredValue(normalizeSortBy(sortBy));

    const activeTag = useDeferredValue(normalizeTagFilter(tagFilter));

    const filteredTasks = useMemo(() => (activeTag ? safeTasks.filter((t) => normalizeTag(t?.tag) === activeTag) : safeTasks), [safeTasks, activeTag]);

    const pinnedTasks = useMemo(() => filteredTasks.filter((t) => t?.isPinned).sort((a, b) => compareTasks(a, b, activeSort)), [filteredTasks, activeSort]);

    const otherTasks = useMemo(() => filteredTasks.filter((t) => !t?.isPinned).sort((a, b) => compareTasks(a, b, activeSort)), [filteredTasks, activeSort]);

    const pinnedCols = useMemo(() => toCols(pinnedTasks, numCols), [pinnedTasks, numCols]);

    const otherCols = useMemo(() => toCols(otherTasks, numCols), [otherTasks, numCols]);

    const cardHandlers = useMemo(() => ({onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask}), [onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask]);

    const stats = useMemo(() => {

        const now = Date.now();

        const today = localDateStr(new Date(now));

        let dueToday = 0, overdue = 0, pinned = 0;

        for (const t of safeTasks) {

            if (t.isPinned) pinned++;

            if (!t.deadline) continue;

            const hasTime = t.deadline.includes("T");

            const dl = hasTime ? new Date(t.deadline) : new Date(`${t.deadline}T23:59:59`);

            const time = dl.getTime();

            if (isNaN(time)) continue;

            const datePart = hasTime ? t.deadline.slice(0, 10) : t.deadline;

            if (time < now) overdue++;

            else if (datePart === today) dueToday++;

        }
        return {dueToday, overdue, pinned};
    }, [safeTasks]);

    const isEmpty = filteredTasks.length === 0;

    const hasAnyTask = safeTasks.length > 0;

    return (
        <Box component="main" className="flex-1 w-full mx-auto" sx={{px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 12, maxWidth: 1400}}>
            {hasAnyTask && (
                <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} sx={{mb: 3}}>
                    <StatCell icon={<EventIcon sx={{fontSize: 19}}/>} label="Due today" value={stats.dueToday} color="#1F6FEB"/>
                    <StatCell icon={<WarningAmberRoundedIcon sx={{fontSize: 19}}/>} label="Overdue" value={stats.overdue} color="#D93025"/>
                    <StatCell icon={<PushPinIcon sx={{fontSize: 19}}/>} label="Pinned" value={stats.pinned} color="#7C5CFA"/>
                </Stack>
            )}
            {hasAnyTask && (
                <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", md: "minmax(0, 1fr) auto"}, alignItems: {xs: "stretch", md: "center"}, gap: 1.5, mb: 3}}>
                    <TagManager tasks={safeTasks} activeTag={activeTag} onChange={onTagFilterChange}/>
                    <Box sx={{display: "flex", minWidth: "max-content", justifyContent: {xs: "flex-start", md: "flex-end"}}}>
                        <SortingToolbar sortBy={activeSort} onChange={onSortChange}/>
                    </Box>
                </Box>
            )}
            {isEmpty ? (
                <EmptyState tagFilter={activeTag}/>
            ) : (
                <Stack spacing={4}>
                    {pinnedTasks.length > 0 && (
                        <Box>
                            <SectionHeader label="Pinned" count={pinnedTasks.length} color="primary.main" icon={<PushPinIcon sx={{fontSize: 14, color: "primary.main"}}/>}/>
                            <TaskColumns cols={pinnedCols} numCols={numCols} cardHandlers={cardHandlers}/>
                        </Box>
                    )}
                    {otherTasks.length > 0 && (
                        <Box>
                            {pinnedTasks.length > 0 && <SectionHeader label="Others" count={otherTasks.length}/>}
                            <TaskColumns cols={otherCols} numCols={numCols} cardHandlers={cardHandlers}/>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}

export default memo(Dashboard);
