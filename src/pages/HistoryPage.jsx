
import {Box, Typography, Stack, Grow} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import TaskCard from "../components/TaskCard";

const GRID_SX = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 2.25
};

export default function HistoryPage({tasks, onTogglePin, onToggleDone, onDelete}) {
    const isEmpty = tasks.length === 0;

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 8, maxWidth: 1400, width: "100%", mx: "auto"}}>
            {isEmpty ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 12, color: "text.secondary"}}>
                    <Box sx={{width: 88, height: 88, borderRadius: "50%", bgcolor: "rgba(15,24,40,0.04)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5}}>
                        <HistoryIcon sx={{fontSize: 42, color: "text.secondary", opacity: 0.6}} />
                    </Box>
                    <Typography sx={{fontWeight: 600, fontSize: "1.05rem", color: "text.primary", mb: 0.4}}>No completed tasks yet</Typography>
                    <Typography sx={{fontSize: "0.88rem", color: "text.secondary"}}>Finished tasks will show up here for reference.</Typography>
                </Stack>
            ) : (
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                        <HistoryIcon sx={{fontSize: 14, color: "text.secondary"}} />
                        <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, textTransform: "uppercase"}}>Completed · {tasks.length}</Typography>
                    </Stack>
                    <Box sx={GRID_SX}>
                        {tasks.map((task, i) => (
                            <Grow in key={task.id} timeout={220 + i * 50}>
                                <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete} />
                            </Grow>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
