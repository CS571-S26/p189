
import {useState, useRef, useMemo, useEffect, useCallback, memo} from "react";
import {Card, CardContent, Typography, Box, IconButton, Chip, Tooltip, TextField} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import ChecklistIcon from "@mui/icons-material/Checklist";

import StatusToggle from "./StatusToggle";
import SubtaskList from "./SubtaskList";
import PriorityBadge from "./PriorityBadge";

import {MONO_SX, PRIMARY_HOVER, ERROR_HOVER, SEALER_SHADOW, SURFACE_SPECULAR, SPECULAR_HIGHLIGHT, CARD_SHADOW, CARD_SHADOW_HOVER, MOTION_BASE, tactileTransition, formatTaskDeadline, subtaskStats, glassSurfaceSx, GLASS_TONES} from "../javascripts/shared";

const ACTION_SX = {
    width: 32, 
    height: 32, 
    color: "text.secondary", 
    "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}, 
    "&:active": {bgcolor: "rgba(31, 111, 235, 0.12)"}
};

const DELETE_HOVER_SX = {
    ...ACTION_SX, 
    "&:hover": {bgcolor: ERROR_HOVER, color: "error.main"}, 
    "&:active": {bgcolor: "rgba(217, 48, 37, 0.12)"}
};

const CARD_SX = {
    position: "relative", 
    display: "flex", 
    flexDirection: "column", 
    overflow: "hidden", 
    isolation: "isolate", 
    bgcolor: "#FFFFFF", 
    backgroundClip: "padding-box", 
    boxShadow: CARD_SHADOW, 
    transition: tactileTransition("transform, box-shadow, border-color, opacity"), 
    backfaceVisibility: "hidden", 
    contain: "layout style", 
    "&:hover": {transform: "translateY(-1px)", borderColor: "rgba(31, 111, 235, 0.24)", boxShadow: CARD_SHADOW_HOVER}
};

const PIN_BADGE_STYLE = {background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 100%)", boxShadow: `${SEALER_SHADOW}, 0 2px 6px rgba(31, 111, 235, 0.28), ${SPECULAR_HIGHLIGHT}`};

const PILL_LABEL_SX = {...MONO_SX, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1, textTransform: "uppercase"};

const TITLE_SX_BASE = {fontWeight: 600, fontSize: "0.96rem", lineHeight: 1.4, letterSpacing: "-0.012em", color: "text.primary", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word"};

const TAG_CHIP_SX = {
    height: 22, 
    fontSize: 11, 
    fontWeight: 500, 
    ...glassSurfaceSx({radius: 999, backgroundColor: GLASS_TONES.neutral.backgroundColor, borderColor: GLASS_TONES.neutral.borderColor, boxShadow: GLASS_TONES.neutral.boxShadow}), 
    color: "text.secondary", 
    maxWidth: "100%", 
    "& .MuiChip-label": {px: 1, overflow: "hidden", textOverflow: "ellipsis"}
};

const FOOTER_SX = {borderTop: "1px solid", borderColor: "divider", boxShadow: SURFACE_SPECULAR};

const EXPAND_ICON_BASE_SX = {fontSize: 20, transition: tactileTransition("transform", MOTION_BASE), backfaceVisibility: "hidden"};

function deadlineTone(deadline, isOverdue) {

    if (isOverdue) return GLASS_TONES.error;

    if (deadline?.soon) return GLASS_TONES.primary;

    return GLASS_TONES.neutral;

}

function DeadlinePill({deadline, isOverdue}) {

    const tone = deadlineTone(deadline, isOverdue);

    return (
        <Box className="inline-flex items-center gap-1 shrink-0" sx={{height: 20, px: 0.85, ...glassSurfaceSx({radius: 999, backgroundColor: tone.backgroundColor, borderColor: tone.borderColor, boxShadow: tone.boxShadow}), color: tone.color}}>
            <EventIcon sx={{fontSize: 11}}/>
            <Typography sx={PILL_LABEL_SX}>{isOverdue ? "Overdue" : deadline.label}</Typography>
        </Box>
    );
}

const TaskCard = memo(function TaskCard({task, onTogglePin, onToggleDone, onDelete, onEditTitle, onAddSubtask, onToggleSubtask, onDeleteSubtask}) {

    const [editing, setEditing] = useState(false);

    const [draft, setDraft] = useState(task.title);

    const [expanded, setExpanded] = useState(false);

    const cancelledRef = useRef(false);

    const subtasks = useMemo(() => (Array.isArray(task.subtasks) ? task.subtasks : []), [task.subtasks]);

    const showExpand = subtasks.length > 0 || Boolean(onAddSubtask);

    const deadline = useMemo(() => formatTaskDeadline(task.deadline), [task.deadline]);

    const isOverdue = deadline?.overdue && !task.done;

    const subtaskSummary = useMemo(() => (subtasks.length > 0 ? subtaskStats(subtasks) : null), [subtasks]);

    useEffect(() => {
        if (!editing) setDraft(task.title);
    }, [editing, task.title]);

    const startEdit = useCallback(() => {

        setDraft(task.title);

        cancelledRef.current = false;

        setEditing(true);

    }, [task.title]);

    const commitEdit = useCallback(() => {

        if (cancelledRef.current) {

            cancelledRef.current = false;

            setEditing(false);

            return;

        }

        const next = draft.trim();

        if (next && next !== task.title) onEditTitle(task.id, next);

        setEditing(false);

    }, [draft, onEditTitle, task.id, task.title]);

    const cancelEdit = useCallback(() => {

        cancelledRef.current = true;

        setDraft(task.title);

        setEditing(false);

    }, [task.title]);

    const subtaskTone = subtaskSummary?.complete ? GLASS_TONES.success : GLASS_TONES.neutral;

    return (
        <Card sx={{...CARD_SX, opacity: task.done ? 0.62 : 1, borderColor: task.isPinned ? "rgba(31, 111, 235, 0.24)" : "divider"}}>
            {task.isPinned && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full inline-flex items-center justify-center z-[1]" style={PIN_BADGE_STYLE}>
                    <PushPinIcon sx={{fontSize: 12, color: "#FFFFFF"}}/>
                </div>
            )}
            <CardContent sx={{p: 2.25, pl: 2.75, pb: "12px !important", flex: 1, display: "flex", flexDirection: "column", position: "relative"}}>
                <PriorityBadge priority={task.priority} variant="bar" inset={10}/>
                <div className="flex items-center gap-2 mb-2.5 min-h-[20px]" style={{paddingRight: task.isPinned ? 28 : 0}}>
                    <PriorityBadge priority={task.priority} variant="dot"/>
                    {deadline && <DeadlinePill deadline={deadline} isOverdue={isOverdue}/>}
                </div>
                <Box sx={{minHeight: 44}}>
                    {editing ? (
                        <TextField value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={(e) => {

                                if (e.isComposing || e.nativeEvent?.isComposing) return;

                                if (e.key === "Enter") {

                                    e.preventDefault();

                                    e.currentTarget.blur();

                                } else if (e.key === "Escape") {

                                    e.preventDefault();

                                    cancelEdit();

                                }
                            }} autoFocus size="small" fullWidth variant="standard" slotProps={{htmlInput: {"aria-label": "Edit task title", maxLength: 120}}}
                       />
                    ) : (
                        <Typography variant="subtitle1" onDoubleClick={onEditTitle ? startEdit : undefined} sx={{...TITLE_SX_BASE, textDecoration: task.done ? "line-through" : "none", cursor: onEditTitle ? "text" : "default"}}>
                            {task.title}
                        </Typography>
                    )}
                </Box>
                <div className="flex items-center gap-1.5 flex-wrap mt-2.5" style={{rowGap: 4}}>
                    <Chip label={task.tag} size="small" variant="outlined" sx={TAG_CHIP_SX}/>
                    {subtaskSummary && (
                        <Chip icon={<ChecklistIcon sx={{fontSize: 13}}/>} label={`${subtaskSummary.done}/${subtaskSummary.total}`} size="small" sx={{height: 22, fontSize: 11, fontWeight: 700, ...MONO_SX, ...glassSurfaceSx({radius: 999, backgroundColor: subtaskTone.backgroundColor, borderColor: subtaskTone.borderColor, boxShadow: subtaskTone.boxShadow}), color: subtaskTone.color, "& .MuiChip-icon": {color: subtaskTone.color, ml: 0.5, mr: -0.25}, "& .MuiChip-label": {px: 0.85}}}/>
                    )}
                </div>
            </CardContent>
            <Box className="flex items-center pl-3 pr-1 h-[42px]" sx={FOOTER_SX}>
                <StatusToggle checked={task.done} onChange={() => onToggleDone(task.id)} label={task.title}/>
                <div className="flex-1"/>
                {showExpand && (
                    <Tooltip title={expanded ? "Hide subtasks" : "Show subtasks"}>
                        <IconButton size="small" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"} aria-expanded={expanded} sx={{...ACTION_SX, color: expanded ? "primary.main" : "text.secondary"}}>
                            <ExpandMoreIcon sx={{...EXPAND_ICON_BASE_SX, transform: expanded ? "rotate(180deg)" : "rotate(0deg)"}}/>
                        </IconButton>
                    </Tooltip>
                )}
                {onEditTitle && !editing && (
                    <Tooltip title="Edit title">
                        <IconButton size="small" onClick={startEdit} aria-label="Edit task title" sx={ACTION_SX}>
                            <EditOutlinedIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title={task.isPinned ? "Unpin" : "Pin to top"}>
                    <IconButton size="small" onClick={() => onTogglePin(task.id)} aria-label={task.isPinned ? "Unpin task" : "Pin task"} sx={{...ACTION_SX, color: task.isPinned ? "primary.main" : "text.secondary"}}>
                        {task.isPinned ? <PushPinIcon sx={{fontSize: 18}}/> : <PushPinOutlinedIcon sx={{fontSize: 18}}/>}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="Delete task" sx={DELETE_HOVER_SX}>
                        <DeleteOutlinedIcon sx={{fontSize: 18}}/>
                    </IconButton>
                </Tooltip>
            </Box>
            {showExpand && (
                <div style={{display: "grid", gridTemplateRows: expanded ? "1fr" : "0fr", transition: tactileTransition("grid-template-rows"), willChange: expanded ? "grid-template-rows" : "auto"}}>
                    <div style={{overflow: "hidden", minHeight: 0}}>
                        {expanded && <SubtaskList taskId={task.id} subtasks={subtasks} onAddSubtask={onAddSubtask} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask}/>}
                    </div>
                </div>
            )}
        </Card>
    );
});

export default TaskCard;
