
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, IconButton, Tooltip} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HistoryIcon from "@mui/icons-material/History";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoMark from "./LogoMark";

const W_EXPANDED = 256;

const W_COLLAPSED = 76;

const TABS = [
    {
        key: "pending",
        label: "Pending",
        icon: <AssignmentOutlinedIcon />,
        path: "/dashboard"
    },
    {
        key: "history",
        label: "History",
        icon: <HistoryIcon />,
        path: "/history"
    },
    {
        key: "schedule",
        label: "Schedule",
        icon: <EventRepeatOutlinedIcon />,
        path: "/schedule"
    }
];

export default function Sidebar({pendingCount, historyCount, scheduleCount, collapsed, onToggleCollapsed}) {
    const location = useLocation();

    const navigate = useNavigate();

    const counts = {pending: pendingCount, history: historyCount, schedule: scheduleCount};

    return (
        <Paper elevation={0} component="aside" sx={{width: collapsed ? W_COLLAPSED : W_EXPANDED, height: "100%", borderRight: "1px solid", borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column", transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden", flexShrink: 0, bgcolor: "background.paper", zIndex: 2}}>
            {/* Brand */}
            <Box sx={{height: 76, display: "flex", alignItems: "center", px: collapsed ? 0 : 2.25, flexShrink: 0, justifyContent: collapsed ? "center" : "space-between"}}>
                {collapsed ? <LogoMark size={36} /> : <LogoMark size={36} withWordmark legend="v 1.0" />}
                {!collapsed && (
                    <Tooltip title="Collapse" placement="bottom">
                        <IconButton onClick={onToggleCollapsed} aria-label="Collapse sidebar" size="small" sx={{color: "text.secondary", "&:hover": {bgcolor: "rgba(31,111,235,0.06)", color: "primary.main"}}}>
                            <ChevronLeftIcon sx={{fontSize: 22}} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {!collapsed && (
                <Box sx={{px: 2.75, mt: 0.25, mb: 0.75}}>
                    <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 500, letterSpacing: "0.14em", fontSize: 10, textTransform: "uppercase"}}>Workspace</Typography>
                </Box>
            )}

            {/* Nav */}
            <List disablePadding sx={{px: collapsed ? 1 : 1.5, mt: collapsed ? 1 : 0.25, flex: 1}}>
                {TABS.map((t) => {
                    const selected = location.pathname === t.path;

                    const button = (
                        <ListItemButton key={t.key} selected={selected} onClick={() => navigate(t.path)} sx={{borderRadius: "14px", mb: 0.5, py: 1.05, px: collapsed ? 0 : 1.75, justifyContent: collapsed ? "center" : "flex-start", minHeight: 46, transition: "background-color 0.18s, color 0.18s", "&.Mui-selected": {bgcolor: "primary.main", color: "#FFFFFF", "&:hover": {bgcolor: "primary.dark"}}, "&:hover": {bgcolor: "rgba(15,24,40,0.04)"}}}>
                            <ListItemIcon sx={{minWidth: collapsed ? "auto" : 36, color: selected ? "#FFFFFF" : "text.secondary", justifyContent: "center", "& .MuiSvgIcon-root": {fontSize: 21}}}>{t.icon}</ListItemIcon>
                            {!collapsed && (
                                <>
                                    <ListItemText primary={t.label} sx={{"& .MuiTypography-root": {fontWeight: selected ? 600 : 500, fontSize: "0.92rem", letterSpacing: "-0.005em"}}} />
                                    <Chip label={counts[t.key]} size="small" sx={{height: 22, minWidth: 26, fontSize: 11.5, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', bgcolor: selected ? "rgba(255,255,255,0.22)" : "rgba(15,24,40,0.06)", color: selected ? "#FFFFFF" : "text.secondary", "& .MuiChip-label": {px: 0.85}}} />
                                </>
                            )}
                        </ListItemButton>
                    );

                    if (collapsed) {
                        return (
                            <Tooltip key={t.key} title={`${t.label} · ${counts[t.key]}`} placement="right">
                                {button}
                            </Tooltip>
                        );
                    }

                    return button;
                })}
            </List>

            {/* Footer */}
            {collapsed ? (
                <Box sx={{display: "flex", justifyContent: "center", py: 1.5, flexShrink: 0}}>
                    <Tooltip title="Expand" placement="right">
                        <IconButton onClick={onToggleCollapsed} aria-label="Expand sidebar" size="small" sx={{width: 38, height: 38, color: "text.secondary", bgcolor: "rgba(15,24,40,0.04)", "&:hover": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.main"}}}>
                            <ChevronRightIcon sx={{fontSize: 20}} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <Box sx={{px: 2.75, py: 2, borderTop: "1px solid", borderColor: "divider", flexShrink: 0}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Box sx={{width: 7, height: 7, borderRadius: "50%", bgcolor: "success.main", boxShadow: "0 0 0 3px rgba(30,142,62,0.18)"}} />
                        <Typography sx={{fontSize: 11, color: "text.secondary", fontWeight: 500}}>Local-first · Synced offline</Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}
