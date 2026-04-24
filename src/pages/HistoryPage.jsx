
import {Box, Typography, Stack, Grow} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import TaskCard from "../components/TaskCard";

const GRID_SX = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 2
};

export default function HistoryPage({tasks, onTogglePin, onToggleDone, onDelete}) {

    const isEmpty = tasks.length === 0;

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 8, overflowY: "auto", maxWidth: 1400, width: "100%", mx: "auto"}}>
            {isEmpty ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 16, color: "text.secondary"}}>
                    <HistoryIcon sx={{fontSize: 56, mb: 1.5, opacity: 0.28}}/>
                    <Typography variant="body1">
                        No completed tasks yet.
                    </Typography>
                    <Typography variant="body2" sx={{mt: 0.5, opacity: 0.8}}>
                        Finished tasks will show up here.
                    </Typography>
                </Stack>
            ) : (
                <Box>
                    <Typography variant="caption" sx={{display: "block", color: "text.secondary", fontWeight: 600, letterSpacing: "0.08em", fontSize: 11, mb: 2}}>
                        COMPLETED · {tasks.length}
                    </Typography>
                    <Box sx={GRID_SX}>
                        {tasks.map((task, i) => (
                            <Grow in key={task.id} timeout={220 + i * 60}>
                                <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete}/>
                            </Grow>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
