
import {cloneElement} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, IconButton, Tooltip, Avatar} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const W_EXPANDED = 248;

const W_COLLAPSED = 72;

const TABS = [
    {
        key: "pending",
        label: "Pending",
        icon: <AssignmentIcon/>,
        path: "/dashboard"
    }, {
        key: "history",
        label: "History",
        icon: <HistoryIcon/>,
        path: "/history"
    }
];

export default function Sidebar({pendingCount, historyCount, collapsed, onToggleCollapsed}) {

    const location = useLocation();

    const navigate = useNavigate();

    const counts = {pending: pendingCount, history: historyCount};

    return (
        <Paper elevation={0} sx={{width: collapsed ? W_COLLAPSED : W_EXPANDED, minHeight: "100vh", borderRight: "1px solid", borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column", transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden", flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start"}}>
            <Box sx={{height: 72, display: "flex", alignItems: "center", px: collapsed ? 0 : 2, flexShrink: 0, justifyContent: collapsed ? "center" : "space-between"}}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1.2, minWidth: 0}}>
                    <Avatar sx={{width: 34, height: 34, bgcolor: "#E8F0FE", color: "primary.main", flexShrink: 0}}>
                        <CheckCircleOutlineIcon sx={{fontSize: 19}}/>
                    </Avatar>
                    {!collapsed && (
                        <Typography variant="h6" sx={{fontSize: "1.1rem", fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap"}}>
                            TaskFlow
                        </Typography>
                    )}
                </Box>
                {!collapsed && (
                    <Tooltip title="Collapse sidebar" arrow placement="bottom">
                        <IconButton onClick={onToggleCollapsed} aria-label="Collapse sidebar" size="small" sx={{color: "text.secondary", "&:hover": {bgcolor: "#F1F3F4", color: "primary.main"}}}>
                            <ChevronLeftIcon sx={{fontSize: 22}}/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {!collapsed && (
                <Box sx={{px: 2.5, mt: 0.5, mb: 0.5}}>
                    <Typography variant="caption" sx={{color: "text.secondary", fontWeight: 600, letterSpacing: "0.08em", fontSize: 10.5, textTransform: "uppercase"}}>
                        Workspace
                    </Typography>
                </Box>
            )}
            <List disablePadding sx={{px: collapsed ? 1 : 1.25, mt: collapsed ? 1 : 0.75, flex: 1}}>
                {TABS.map((t) => {

                    const selected = location.pathname === t.path;

                    const button = (
                        <ListItemButton selected={selected} onClick={() => navigate(t.path)} sx={{borderRadius: "24px", mb: 0.5, py: 1, px: collapsed ? 0 : 1.5, justifyContent: collapsed ? "center" : "flex-start", minHeight: 44, "&.Mui-selected": {bgcolor: "#E8F0FE", color: "primary.dark", "&:hover": {bgcolor: "#D2E3FC"}}, "&:hover": {bgcolor: "#F1F3F4"}}}>
                            <ListItemIcon sx={{minWidth: collapsed ? "auto" : 36, color: selected ? "primary.main" : "text.secondary", justifyContent: "center"}}>{t.icon}</ListItemIcon>
                            {!collapsed && (
                                <>
                                    <ListItemText primary={t.label} sx={{"& .MuiTypography-root": {fontWeight: selected ? 600 : 400, fontSize: "0.9rem"}}}/>
                                    <Chip label={counts[t.key]} size="small" sx={{height: 22, minWidth: 22, fontSize: 12, fontWeight: 600, bgcolor: selected ? "primary.main" : "#E8EAED", color: selected ? "#FFFFFF" : "text.secondary", "& .MuiChip-label": {px: 0.8}}}/>
                                </>
                            )}
                        </ListItemButton>
                    );

                    if (collapsed) {

                        return (
                            <Tooltip key={t.key} title={`${t.label} · ${counts[t.key]}`} arrow placement="right">
                                {button}
                            </Tooltip>
                        );
                    }

                    return cloneElement(button, {key: t.key});

                })}
            </List>
            {collapsed && (
                <Box sx={{display: "flex", justifyContent: "center", py: 1.5, flexShrink: 0}}>
                    <Tooltip title="Expand sidebar" arrow placement="right">
                        <IconButton onClick={onToggleCollapsed} aria-label="Expand sidebar" size="small" sx={{width: 36, height: 36, color: "text.secondary", bgcolor: "#F1F3F4", "&:hover": {bgcolor: "#E8F0FE", color: "primary.main"}}}>
                            <ChevronRightIcon sx={{fontSize: 20}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Paper>
    );
}
