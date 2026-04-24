
import {Box, Typography, Stack, Grow} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import TaskCard from "../components/TaskCard";

const GRID_SX = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 2
};

export default function Dashboard({tasks, onTogglePin, onToggleDone, onDelete, onEditTitle}) {

    const isEmpty = tasks.length === 0;

    const pinnedTasks = tasks.filter((t) => t.isPinned);

    const otherTasks = tasks.filter((t) => !t.isPinned);

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 12, overflowY: "auto", maxWidth: 1400, width: "100%", mx: "auto"}}>
            {isEmpty ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 16, color: "text.secondary"}}>
                    <InboxIcon sx={{fontSize: 56, mb: 1.5, opacity: 0.28}}/>
                    <Typography variant="body1">
                        All clear — no pending tasks!
                    </Typography>
                    <Typography variant="body2" sx={{mt: 0.5, opacity: 0.8}}>
                        Click the + button to create one.
                    </Typography>
                </Stack>
            ) : (
                <Stack spacing={4}>
                    {pinnedTasks.length > 0 && (
                        <Box>
                            <Typography variant="caption" sx={{display: "block", color: "primary.main", fontWeight: 600, letterSpacing: "0.08em", fontSize: 11, mb: 2}}>
                                PINNED · {pinnedTasks.length}
                            </Typography>
                            <Box sx={GRID_SX}>
                                {pinnedTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={220 + i * 60}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete} onEditTitle={onEditTitle}/>
                                    </Grow>
                                ))}
                            </Box>
                        </Box>
                    )}
                    {otherTasks.length > 0 && (
                        <Box>
                            {pinnedTasks.length > 0 && (
                                <Typography variant="caption" sx={{display: "block", color: "text.secondary", fontWeight: 600, letterSpacing: "0.08em", fontSize: 11, mb: 2}}>
                                    OTHERS · {otherTasks.length}
                                </Typography>
                            )}
                            <Box sx={GRID_SX}>
                                {otherTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={220 + i * 60}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete} onEditTitle={onEditTitle}/>
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
