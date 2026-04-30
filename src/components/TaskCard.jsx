
import {forwardRef, useState, useRef, useMemo} from "react";
import {Card, CardContent, Typography, Box, IconButton, Chip, Tooltip, Stack, TextField, Divider, Collapse} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import ChecklistIcon from "@mui/icons-material/Checklist";
import StatusToggle from "./StatusToggle";
import SubtaskList from "./SubtaskList";
import PriorityBadge, {PRIORITY} from "./PriorityBadge";

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function formatDeadline(iso) {
    if (!iso) return null;

    const today = todayStr();

    if (iso === today) return {label: "Today", overdue: false, soon: true};

    const t = new Date(today + "T00:00:00");

    const d = new Date(iso + "T00:00:00");

    const diffDays = Math.round((d - t) / 86400000);

    if (diffDays === 1) return {label: "Tomorrow", overdue: false, soon: true};

    if (diffDays === -1) return {label: "Yesterday", overdue: true, soon: false};

    if (diffDays < 0) return {label: d.toLocaleDateString(undefined, {month: "short", day: "numeric"}), overdue: true, soon: false};

    return {label: d.toLocaleDateString(undefined, {month: "short", day: "numeric"}), overdue: false, soon: diffDays <= 3};
}

const TaskCard = forwardRef(function TaskCard({task, onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask, ...rest}, ref) {
    const [editing, setEditing] = useState(false);

    const [draft, setDraft] = useState(task.title);

    const [expanded, setExpanded] = useState(false);

    const cancelledRef = useRef(false);

    const subtasks = task.subtasks || [];

    const hasSubtasks = subtasks.length > 0;

    const canEditSubtasks = Boolean(onAddSubtask);

    const showExpand = hasSubtasks || canEditSubtasks;

    const deadline = useMemo(() => formatDeadline(task.deadline), [task.deadline]);

    const priorityMeta = PRIORITY[task.priority] || PRIORITY.low;

    const subtaskSummary = useMemo(() => {
        if (!hasSubtasks) return null;

        const done = subtasks.filter((s) => s.done).length;

        return {done, total: subtasks.length, complete: done === subtasks.length};
    }, [subtasks, hasSubtasks]);

    const startEdit = () => {
        setDraft(task.title);

        cancelledRef.current = false;

        setEditing(true);
    };

    const commitEdit = () => {
        if (cancelledRef.current) {
            cancelledRef.current = false;

            setEditing(false);

            return;
        }

        const next = draft.trim();

        if (next && next !== task.title) onEditTitle(task.id, next);

        setEditing(false);
    };

    const cancelEdit = () => {
        cancelledRef.current = true;

        setDraft(task.title);

        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            e.preventDefault();

            cancelEdit();
        }
    };

    return (
        <Card ref={ref} {...rest} sx={{position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "background.paper", opacity: task.done ? 0.62 : 1, borderColor: task.isPinned ? "rgba(31,111,235,0.32)" : "divider", transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s cubic-bezier(0.4,0,0.2,1), border-color 0.22s, opacity 0.22s", "&:hover": {transform: "translateY(-3px)", borderColor: "rgba(31,111,235,0.32)", boxShadow: "0 14px 28px -10px rgba(15,24,40,0.16), 0 6px 14px -8px rgba(15,24,40,0.08)"}}}>
            {/* Pinned badge */}
            {task.isPinned && (
                <Box sx={{position: "absolute", top: 11, right: 11, width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 100%)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, boxShadow: "0 2px 6px rgba(31,111,235,0.32)"}}>
                    <PushPinIcon sx={{fontSize: 12, color: "#FFFFFF"}} />
                </Box>
            )}

            <CardContent sx={{flex: 1, display: "flex", flexDirection: "column", position: "relative", p: 2.25, pl: 2.75, pb: "12px !important", "&:last-child": {pb: "12px !important"}}}>
                {/* Priority accent bar — scoped to content area, won't cross the divider */}
                <PriorityBadge priority={task.priority} variant="bar" inset={10} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1.25, pr: task.isPinned ? 3.5 : 0}}>
                    <PriorityBadge priority={task.priority} variant="dot" />
                    {deadline && (
                        <Box sx={{display: "inline-flex", alignItems: "center", gap: 0.45, px: 0.95, py: 0.3, borderRadius: 999, bgcolor: deadline.overdue && !task.done ? "#FCE8E6" : deadline.soon ? "rgba(31,111,235,0.08)" : "rgba(15,24,40,0.04)", color: deadline.overdue && !task.done ? "error.main" : deadline.soon ? "primary.dark" : "text.secondary", flexShrink: 0}}>
                            <EventIcon sx={{fontSize: 12}} />
                            <Typography sx={{fontSize: 10.5, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.02em"}}>{deadline.overdue && !task.done ? "Overdue" : deadline.label}</Typography>
                        </Box>
                    )}
                </Stack>

                <Box sx={{flex: 1, minHeight: 0}}>
                    {editing ? (
                        <TextField value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={handleKeyDown} autoFocus size="small" fullWidth variant="standard" inputProps={{"aria-label": "Edit task title", maxLength: 120}} />
                    ) : (
                        <Typography variant="subtitle1" onDoubleClick={onEditTitle ? startEdit : undefined} sx={{fontWeight: 600, fontSize: "0.96rem", lineHeight: 1.4, letterSpacing: "-0.012em", color: "text.primary", textDecoration: task.done ? "line-through" : "none", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word", cursor: onEditTitle ? "text" : "default"}}>
                            {task.title}
                        </Typography>
                    )}
                </Box>

                <Stack direction="row" spacing={0.75} alignItems="center" sx={{mt: 1.25, minWidth: 0, flexWrap: "wrap", rowGap: 0.5}}>
                    <Chip label={task.tag} size="small" variant="outlined" sx={{height: 22, fontSize: 11, fontWeight: 500, borderColor: "divider", color: "text.secondary", bgcolor: "rgba(15,24,40,0.025)", maxWidth: "100%", "& .MuiChip-label": {px: 1, overflow: "hidden", textOverflow: "ellipsis"}}} />
                    {subtaskSummary && <Chip icon={<ChecklistIcon sx={{fontSize: 13}} />} label={`${subtaskSummary.done}/${subtaskSummary.total}`} size="small" sx={{height: 22, fontSize: 11, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', bgcolor: subtaskSummary.complete ? "#E6F4EA" : "rgba(15,24,40,0.05)", color: subtaskSummary.complete ? "success.main" : "text.secondary", border: "none", "& .MuiChip-icon": {color: subtaskSummary.complete ? "success.main" : "text.secondary", ml: 0.5, mr: -0.25}, "& .MuiChip-label": {px: 0.85}}} />}
                </Stack>
            </CardContent>

            <Divider sx={{borderColor: "divider"}} />

            <Stack direction="row" alignItems="center" sx={{pl: 1.5, pr: 0.85, py: 0.4}}>
                <StatusToggle checked={task.done} onChange={() => onToggleDone(task.id)} label={task.title} />
                <Box sx={{flex: 1}} />
                {showExpand && (
                    <Tooltip title={expanded ? "Hide subtasks" : "Show subtasks"}>
                        <IconButton size="small" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"} aria-expanded={expanded} sx={{color: expanded ? "primary.main" : "text.secondary", "&:hover": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.main"}}}>
                            <ExpandMoreIcon sx={{fontSize: 20, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s"}} />
                        </IconButton>
                    </Tooltip>
                )}
                {onEditTitle && !editing && (
                    <Tooltip title="Edit title">
                        <IconButton size="small" onClick={startEdit} aria-label="Edit task title" sx={{color: "text.secondary", "&:hover": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.main"}}}>
                            <EditOutlinedIcon sx={{fontSize: 18}} />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title={task.isPinned ? "Unpin" : "Pin to top"}>
                    <IconButton size="small" onClick={() => onTogglePin(task.id)} aria-label={task.isPinned ? "Unpin task" : "Pin task"} sx={{color: task.isPinned ? "primary.main" : "text.secondary", "&:hover": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.main"}}}>
                        {task.isPinned ? <PushPinIcon sx={{fontSize: 18}} /> : <PushPinOutlinedIcon sx={{fontSize: 18}} />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="Delete task" sx={{color: "text.secondary", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                        <DeleteOutlineIcon sx={{fontSize: 18}} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {showExpand && (
                <Collapse in={expanded} timeout={240} unmountOnExit>
                    <SubtaskList taskId={task.id} subtasks={subtasks} onAddSubtask={onAddSubtask} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask} />
                </Collapse>
            )}
        </Card>
    );
});

export default TaskCard;
