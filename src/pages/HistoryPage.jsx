
import {useMemo} from "react";
import {Box, Typography, Stack, useTheme, useMediaQuery} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import TaskCard from "../components/TaskCard";

import {MONO_SX, toCols, staggerDelay} from "../javascripts/shared";

const CARD_VIRTUAL_STYLE = {contentVisibility: "auto", containIntrinsicSize: "188px", contain: "layout style", padding: "6px 6px 14px", overflow: "visible"};

export default function HistoryPage({tasks = [], onTogglePin, onToggleDone, onDelete}) {

    const theme = useTheme();

    const is2 = useMediaQuery(theme.breakpoints.up("sm"));

    const is3 = useMediaQuery(theme.breakpoints.up("md"));

    const is4 = useMediaQuery(theme.breakpoints.up("lg"));

    const numCols = is4 ? 4 : is3 ? 3 : is2 ? 2 : 1;

    const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

    const cols = useMemo(() => toCols(safeTasks, numCols), [safeTasks, numCols]);

    return (
        <Box component="main" className="flex-1 w-full mx-auto" sx={{px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 8, maxWidth: 1400}}>
            {safeTasks.length === 0 ? (
                <Stack alignItems="center" justifyContent="center" sx={{mt: 12, color: "text.secondary"}}>
                    <Box className="flex items-center justify-center" sx={{width: 84, height: 84, borderRadius: "50%", bgcolor: "rgba(15, 24, 40, 0.04)", mb: 2.5}}>
                        <HistoryIcon sx={{fontSize: 40, color: "text.secondary", opacity: 0.6}}/>
                    </Box>
                    <Typography sx={{fontWeight: 600, fontSize: "1.05rem", color: "text.primary", mb: 0.4}}>No completed tasks yet</Typography>
                    <Typography sx={{fontSize: "0.88rem"}}>Finished tasks will show up here for reference.</Typography>
                </Stack>
            ) : (
                <Box>
                    <Box className="flex items-center gap-2 mb-3.5">
                        <HistoryIcon sx={{fontSize: 14, color: "text.secondary"}}/>
                        <Typography sx={{...MONO_SX, color: "text.secondary", fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, textTransform: "uppercase"}}>Completed · {safeTasks.length}</Typography>
                    </Box>
                    <div className="flex gap-4 -mx-1 px-1 pt-1 pb-2 overflow-visible">
                        {cols.map((col, ci) => (
                            <div key={ci} className="flex-1 min-w-0 flex flex-col gap-2 overflow-visible">
                                {col.map((task, ri) => (
                                    <div key={task.id} className="animate-fade-in-up" style={{...CARD_VIRTUAL_STYLE, animationDelay: staggerDelay(ri * numCols + ci)}}>
                                        <TaskCard task={task} onTogglePin={onTogglePin} onToggleDone={onToggleDone} onDelete={onDelete}/>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Box>
            )}
        </Box>
    );
}
