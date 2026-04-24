
import {forwardRef, useState, useRef} from "react";
import {Card, CardContent, Typography, Box, IconButton, Chip, Tooltip, Stack, TextField, Divider} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StatusToggle from "./StatusToggle";
import {PRIORITY} from "./PriorityBadge";

const TaskCard = forwardRef(function TaskCard({task, onTogglePin, onToggleDone, onDelete, onEditTitle, ...rest}, ref) {

    const [editing, setEditing] = useState(false);

    const [draft, setDraft] = useState(task.title);

    const cancelledRef = useRef(false);

    const p = PRIORITY[task.priority] || PRIORITY.low;

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
        <Card ref={ref} {...rest} sx={{position: "relative", display: "flex", flexDirection: "column", height: "100%", minHeight: 168, overflow: "hidden", bgcolor: task.isPinned ? "#FAFBFF" : "background.paper", opacity: task.done ? 0.62 : 1, transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s", "&:hover": {transform: "translateY(-2px)", boxShadow: "0 2px 4px -1px rgba(60,64,67,0.1), 0 4px 10px 0 rgba(60,64,67,0.12), 0 1px 14px 0 rgba(60,64,67,0.08)"}}}>
            {task.isPinned && (
                <Box sx={{position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: "50%", bgcolor: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1}}>
                    <PushPinIcon sx={{fontSize: 12, color: "primary.main"}}/>
                </Box>
            )}
            <CardContent sx={{flex: 1, display: "flex", flexDirection: "column", p: 2.25, pb: "12px !important", "&:last-child": {pb: "12px !important"}}}>
                <Stack direction="row" alignItems="center" spacing={0.8} sx={{mb: 1.25}}>
                    <Box sx={{width: 6, height: 6, borderRadius: "50%", bgcolor: p.color}}/>
                    <Typography variant="caption" sx={{color: p.color, fontWeight: 600, letterSpacing: "0.06em", fontSize: 10.5, textTransform: "uppercase"}}>
                        {p.label}
                    </Typography>
                </Stack>
                <Box sx={{flex: 1, minHeight: 0, pr: task.isPinned ? 3.5 : 0}}>
                    {editing ? (
                        <TextField value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={handleKeyDown} autoFocus size="small" fullWidth variant="standard" inputProps={{"aria-label": "Edit task title", maxLength: 120}}/>
                    ) : (
                        <Typography variant="subtitle1" onDoubleClick={onEditTitle ? startEdit : undefined} sx={{fontWeight: 500, fontSize: "0.95rem", lineHeight: 1.4, color: "text.primary", textDecoration: task.done ? "line-through" : "none", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word", cursor: onEditTitle ? "text" : "default"}}>
                            {task.title}
                        </Typography>
                    )}
                </Box>
                <Box sx={{mt: 1.25, display: "flex", minWidth: 0}}>
                    <Chip label={task.tag} size="small" variant="outlined" sx={{height: 22, fontSize: 11, fontWeight: 500, borderColor: "#DADCE0", color: "text.secondary", maxWidth: "100%", "& .MuiChip-label": {px: 1, overflow: "hidden", textOverflow: "ellipsis"}}}/>
                </Box>
            </CardContent>
            <Divider sx={{borderColor: "#EEF0F2"}}/>
            <Stack direction="row" alignItems="center" sx={{pl: 0.5, pr: 0.75, py: 0.25}}>
                <StatusToggle checked={task.done} onChange={() => onToggleDone(task.id)} title={task.title}/>
                <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11.5, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ml: 0.25}}>
                    {task.done ? "Done" : "Open"}
                </Typography>
                {onEditTitle && !editing && (
                    <Tooltip title="Edit title" arrow>
                        <IconButton size="small" onClick={startEdit} aria-label="Edit task title" sx={{color: "text.secondary", "&:hover": {bgcolor: "#E8F0FE", color: "primary.main"}}}>
                            <EditOutlinedIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title={task.isPinned ? "Unpin" : "Pin to top"} arrow>
                    <IconButton size="small" onClick={() => onTogglePin(task.id)} aria-label={task.isPinned ? "Unpin task" : "Pin task"} sx={{color: task.isPinned ? "primary.main" : "text.secondary", "&:hover": {bgcolor: "#E8F0FE", color: "primary.main"}}}>
                        {task.isPinned ? <PushPinIcon sx={{fontSize: 18}}/> : <PushPinOutlinedIcon sx={{fontSize: 18}}/>}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="Delete task" sx={{color: "text.secondary", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                        <DeleteOutlineIcon sx={{fontSize: 18}}/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Card>
    );
});

export default TaskCard;
