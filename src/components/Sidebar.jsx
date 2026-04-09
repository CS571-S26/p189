
import {Box, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography, Chip} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";

const SIDEBAR_W = 256;

const TABS = [
    {key: "pending", label: "Pending", icon: <AssignmentIcon />},
    {key: "history", label: "History", icon: <HistoryIcon />}
];

export default function Sidebar({tab, onTabChange, pendingCount, historyCount}) {

    const counts = {pending: pendingCount, history: historyCount};

    return (
        <Paper elevation={0} sx={{width: {xs: 68, md: SIDEBAR_W}, minHeight: "100vh", borderRight: "1px solid", borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column", pt: 2.5, transition: "width 0.25s ease"}}>
            <Box sx={{px: 2.5, mb: 1, display: {xs: "none", md: "block"}}}>
                <Typography variant="body2" sx={{color: "text.secondary", fontWeight: 500}}>
                    Navigation
                </Typography>
            </Box>

            <List disablePadding sx={{px: 1, mt: 0.5}}>
                {TABS.map((t) => {

                    const selected = tab === t.key;

                    return (
                        <ListItemButton key={t.key} selected={selected} onClick={() => onTabChange(t.key)} sx={{borderRadius: "24px", mb: 0.5, py: 1, px: 1.5, "&.Mui-selected": {bgcolor: "#E8F0FE", color: "primary.dark", "&:hover": {bgcolor: "#D2E3FC"}}, "&:hover": {bgcolor: "#F1F3F4"}}}>
                            <ListItemIcon sx={{minWidth: 36, color: selected ? "primary.main" : "text.secondary"}}>
                                {t.icon}
                            </ListItemIcon>
                            <ListItemText primary={t.label} sx={{display: {xs: "none", md: "block"}, "& .MuiTypography-root": {fontWeight: selected ? 600 : 400, fontSize: "0.9rem"}}}/>
                            <Chip label={counts[t.key]} size="small" sx={{display: {xs: "none", md: "flex"}, height: 22, minWidth: 22, fontSize: 12, fontWeight: 600, bgcolor: selected ? "primary.main" : "#E8EAED", color: selected ? "#FFFFFF" : "text.secondary", "& .MuiChip-label": {px: 0.8}}}/>
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );
}
