
import {Box, Typography, Stack, Grow} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import PushPinIcon from "@mui/icons-material/PushPin";
import TaskCard from "../components/TaskCard";

export default function Dashboard({tasks, tab, onTogglePin, onToggleDone, onDelete}) {

    const isEmpty = tasks.length === 0;

    const title = tab === "pending" ? "Pending Tasks" : "Completed History";

    const pinnedTasks = tasks.filter((t) => t.isPinned);

    const otherTasks = tasks.filter((t) => !t.isPinned);

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, py: 4, overflowY: "auto"}}>
            <Typography variant="h5" sx={{mb: 3}}>
                {title}
            </Typography>
            {isEmpty ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 12, color: "text.secondary"}}>
                    <InboxIcon sx={{fontSize: 56, mb: 1.5, opacity: 0.28}} />
                    <Typography variant="body1">
                        {tab === "pending" ? "All clear — no pending tasks!" : "No completed tasks yet."}
                    </Typography>
                </Stack>
            ) : tab === "history" ? (
                <Stack spacing={1.5}>
                    {tasks.map((task, i) => (
                        <Grow in key={task.id} timeout={250 + i * 80}>
                            <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete}/>
                        </Grow>
                    ))}
                </Stack>
            ) : (
                <Stack spacing={3}>
                    {pinnedTasks.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={0.8} sx={{mb: 1.5}}>
                                <PushPinIcon sx={{fontSize: 18, color: "primary.main"}} />
                                <Typography variant="body2" sx={{color: "primary.main", fontWeight: 600, letterSpacing: "0.04em"}}>
                                    PINNED
                                </Typography>
                            </Stack>
                            <Stack spacing={1.5}>
                                {pinnedTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={250 + i * 80}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete}/>
                                    </Grow>
                                ))}
                            </Stack>
                        </Box>
                    )}
                    {otherTasks.length > 0 && (
                        <Box>
                            {pinnedTasks.length > 0 && (
                                <Typography variant="body2" sx={{color: "text.secondary", fontWeight: 600, letterSpacing: "0.04em", mb: 1.5}}>
                                    OTHERS
                                </Typography>
                            )}
                            <Stack spacing={1.5}>
                                {otherTasks.map((task, i) => (
                                    <Grow in key={task.id} timeout={250 + i * 80}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete}/>
                                    </Grow>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}
