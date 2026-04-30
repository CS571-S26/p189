
import {useState} from "react";
import {Box, Stack, Typography, IconButton, TextField, Button, LinearProgress, Tooltip} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import StatusToggle from "./StatusToggle";

function computeProgress(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;

    const total = subtasks.reduce((acc, s) => acc + (s.weight || 1), 0);

    if (total === 0) return 0;

    const done = subtasks.reduce((acc, s) => acc + (s.done ? s.weight || 1 : 0), 0);

    return Math.round((done / total) * 100);
}

export default function SubtaskList({taskId, subtasks = [], onAddSubtask, onToggleSubtask, onDeleteSubtask}) {
    const [draft, setDraft] = useState("");

    const progress = computeProgress(subtasks);

    const completedCount = subtasks.filter((s) => s.done).length;

    const readOnly = !onAddSubtask;

    const handleAdd = () => {
        const next = draft.trim();

        if (!next) return;

        onAddSubtask(taskId, next);

        setDraft("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            handleAdd();
        }
    };

    const complete = progress === 100;

    return (
        <Box sx={{px: 2.25, pt: 1.5, pb: 1.75, bgcolor: "rgba(31,111,235,0.025)", borderTop: "1px solid", borderColor: "divider"}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 0.85}}>
                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 500, letterSpacing: "0.10em", fontSize: 10, textTransform: "uppercase"}}>
                    Subtasks · {completedCount}/{subtasks.length}
                </Typography>
                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: complete ? "success.main" : "primary.main", fontWeight: 600, fontSize: 11, letterSpacing: "0.02em"}}>{progress}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} aria-label="Subtask progress" sx={{height: 5, borderRadius: 3, bgcolor: "rgba(15,24,40,0.06)", mb: 1.25, "& .MuiLinearProgress-bar": {bgcolor: complete ? "success.main" : "primary.main", borderRadius: 3, transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)"}}} />
            {subtasks.length > 0 && (
                <Stack spacing={0.25} sx={{mb: readOnly ? 0 : 1}}>
                    {subtasks.map((s) => (
                        <Stack key={s.id} direction="row" alignItems="center" spacing={0.5} sx={{minHeight: 32}}>
                            {onToggleSubtask ? <StatusToggle checked={s.done} onChange={() => onToggleSubtask(taskId, s.id)} label={s.title} size="small" /> : <Box sx={{width: 6, height: 6, borderRadius: "50%", bgcolor: s.done ? "primary.main" : "#C5CCD7", flexShrink: 0, ml: 1, mr: 0.75}} />}
                            <Typography sx={{flex: 1, minWidth: 0, fontSize: "0.85rem", color: "text.primary", textDecoration: s.done ? "line-through" : "none", opacity: s.done ? 0.55 : 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "opacity 0.18s"}}>{s.title}</Typography>
                            {onDeleteSubtask && (
                                <Tooltip title="Remove subtask">
                                    <IconButton size="small" onClick={() => onDeleteSubtask(taskId, s.id)} aria-label={`Delete subtask "${s.title}"`} sx={{color: "text.secondary", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                                        <DeleteOutlineIcon sx={{fontSize: 16}} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    ))}
                </Stack>
            )}
            {!readOnly && (
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add a subtask" size="small" fullWidth variant="outlined" inputProps={{"aria-label": "New subtask title", maxLength: 80}} sx={{"& .MuiOutlinedInput-root": {bgcolor: "background.paper", fontSize: "0.85rem"}}} />
                    <Button onClick={handleAdd} disabled={!draft.trim()} size="small" startIcon={<AddIcon sx={{fontSize: 16}} />} disableElevation sx={{flexShrink: 0, fontSize: "0.8rem", px: 1.5}}>
                        Add
                    </Button>
                </Stack>
            )}
        </Box>
    );
}
