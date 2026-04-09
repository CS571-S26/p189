
import {forwardRef} from "react";
import {Card, CardContent, Typography, Box, IconButton, Chip, Checkbox, Tooltip, Stack} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const PRIORITY = {
    high: {label: "High", color: "#D93025", bg: "#FCE8E6"},
    medium: {label: "Medium", color: "#E8710A", bg: "#FEF3E8"},
    low: {label: "Low", color: "#1E8E3E", bg: "#E6F4EA"}
};

const TaskCard = forwardRef(function TaskCard({task, onTogglePin, onToggleDone, onDelete, ...rest}, ref) {

    const p = PRIORITY[task.priority] || PRIORITY.low;

    return (
        <Card ref={ref} {...rest} sx={{position: "relative", bgcolor: task.isPinned ? "#F0F4FF" : "background.paper", boxShadow: task.isPinned ? "inset 3px 0 0 0 #1A73E8" : "none", transition: "background-color 0.2s, box-shadow 0.2s", "&:hover": task.isPinned ? {boxShadow: "inset 3px 0 0 0 #1A73E8, 0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)"} : undefined}}>
            <CardContent sx={{display: "flex", alignItems: "center", gap: 1, py: "14px !important", "&:last-child": {pb: "14px !important"}}}>
                <Checkbox checked={task.done} onChange={() => onToggleDone(task.id)} aria-label={`Mark "${task.title}" as ${task.done ? "pending" : "done"}`} sx={{color: "#DADCE0", "&.Mui-checked": {color: "primary.main"}}}/>
                <Box sx={{flex: 1, minWidth: 0}}>
                    <Typography variant="body1" sx={{fontWeight: 400, textDecoration: task.done ? "line-through" : "none", color: task.done ? "text.secondary" : "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                        {task.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{mt: 0.8}}>
                        <Chip label={p.label} size="small" sx={{height: 22, fontSize: 11, fontWeight: 600, bgcolor: p.bg, color: p.color, border: "none"}}/>
                        <Chip label={task.tag} size="small" variant="outlined" sx={{height: 22, fontSize: 11, fontWeight: 500, borderColor: "#DADCE0", color: "text.secondary"}}/>
                    </Stack>
                </Box>
                <Tooltip title={task.isPinned ? "Unpin" : "Pin to top"} arrow>
                    <IconButton size="small" onClick={() => onTogglePin(task.id)} aria-label={task.isPinned ? "Unpin task" : "Pin task"} sx={{color: task.isPinned ? "primary.main" : "#DADCE0", "&:hover": {bgcolor: "#E8F0FE", color: "primary.main"}}}>
                        {task.isPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                    <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="Delete task" sx={{color: "#DADCE0", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardContent>
        </Card>
    );
});

export default TaskCard;
