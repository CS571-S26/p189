
import {useState, useMemo} from "react";
import {Box, Stack, Typography, IconButton, TextField, Button, LinearProgress, Tooltip} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

import StatusToggle from "./StatusToggle";

import {SUBTASK_ITEM_SX, SUBTASK_INPUT_SX, SUBTASK_ADD_BTN_SX, DELETE_ICON_SX, MONO_SX, subtaskStats} from "../javascripts/shared";

const SHELL_SX = {px: 2.25, pt: 1.5, pb: 1.75, bgcolor: "rgba(31, 111, 235, 0.02)", borderTop: "1px solid", borderColor: "divider"};

const HEADER_SX = {...MONO_SX, color: "text.secondary", fontWeight: 500, letterSpacing: "0.10em", fontSize: 10, mb: 0.85};

const TITLE_SX_BASE = {fontSize: "0.85rem", color: "text.primary", transition: "opacity 225ms cubic-bezier(0.2, 0, 0, 1)", ml: 0.75};

const DELETE_BTN_SX = {...DELETE_ICON_SX, ml: 0.5};

const INPUT_SX = {

    "& .MuiOutlinedInput-root": {
        ...SUBTASK_INPUT_SX["& .MuiOutlinedInput-root"], 
        bgcolor: "background.paper"
    }
};

export default function SubtaskList({taskId, subtasks = [], onAddSubtask, onToggleSubtask, onDeleteSubtask}) {

    const [draft, setDraft] = useState("");

    const stats = useMemo(() => subtaskStats(subtasks), [subtasks]);

    const readOnly = !onAddSubtask;

    const complete = stats.complete;

    const handleAdd = () => {

        const next = draft.trim();

        if (!next) return;

        onAddSubtask(taskId, next);

        setDraft("");

    };

    return (
        <Box sx={SHELL_SX}>
            <Typography className="uppercase" sx={HEADER_SX}>
                Subtasks · {stats.done}/{stats.total}
            </Typography>
            <LinearProgress variant="determinate" value={stats.progress} aria-label="Subtask progress" sx={{height: 5, borderRadius: 3, bgcolor: "rgba(15, 24, 40, 0.06)", mb: 1.25, "& .MuiLinearProgress-bar": {bgcolor: complete ? "success.main" : "primary.main", borderRadius: 3, transition: "transform 225ms cubic-bezier(0.2, 0, 0, 1)"}}}/>
            {subtasks.length > 0 && (
                <Stack spacing={0.75} sx={{mb: readOnly ? 0 : 1.25}}>
                    {subtasks.map((s) => (
                        <Box key={s.id} sx={SUBTASK_ITEM_SX}>
                            {onToggleSubtask ? (
                                <StatusToggle checked={s.done} onChange={() => onToggleSubtask(taskId, s.id)} label={s.title} size="small"/>
                            ) : (
                                <span className="inline-flex items-center justify-center shrink-0 w-7 h-7">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: s.done ? "#1F6FEB" : "#C5CCD7"}}/>
                                </span>
                            )}
                            <Typography className="flex-1 min-w-0 truncate" sx={{...TITLE_SX_BASE, textDecoration: s.done ? "line-through" : "none", opacity: s.done ? 0.55 : 1}}>
                                {s.title}
                            </Typography>
                            {onDeleteSubtask && (
                                <Tooltip title="Remove subtask">
                                    <IconButton size="small" onClick={() => onDeleteSubtask(taskId, s.id)} aria-label={`Delete subtask "${s.title}"`} sx={DELETE_BTN_SX}>
                                        <DeleteOutlinedIcon sx={{fontSize: 16}}/>
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
            {!readOnly && (
                <div className="flex items-center gap-2">
                    <TextField value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (!e.isComposing && !e.nativeEvent?.isComposing && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }}} placeholder="Add a subtask" size="small" fullWidth slotProps={{htmlInput: {"aria-label": "New subtask title", maxLength: 80}}} sx={INPUT_SX}/>
                    <Button onClick={handleAdd} disabled={!draft.trim()} size="small" startIcon={<AddIcon sx={{fontSize: 16}}/>} disableElevation className="shrink-0" sx={SUBTASK_ADD_BTN_SX}>Add</Button>
                </div>
            )}
        </Box>
    );
}
