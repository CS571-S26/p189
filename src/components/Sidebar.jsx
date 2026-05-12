
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, IconButton, Tooltip} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HistoryIcon from "@mui/icons-material/History";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import LogoMark from "./LogoMark";

import {MONO_SX, PRIMARY_HOVER, MOTION_EASE, MOTION_BASE, SEALER_SHADOW, SURFACE_SPECULAR} from "../javascripts/shared";

const W_EXPANDED = 256;

const W_COLLAPSED = 72;

const EASE = MOTION_EASE;

const DUR = MOTION_BASE;

const TABS = [
    {key: "pending", label: "Pending", icon: <AssignmentOutlinedIcon/>, path: "/dashboard"}, 
    {key: "history", label: "History", icon: <HistoryIcon/>, path: "/history"}, 
    {key: "schedule", label: "Schedule", icon: <EventRepeatOutlinedIcon/>, path: "/schedule"}
];

const PAPER_SX = {height: "100%", borderRight: "1px solid", borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column", transition: `width ${DUR}ms ${EASE}`, overflow: "hidden", flexShrink: 0, bgcolor: "rgba(255,255,255,0.90)", boxShadow: `${SEALER_SHADOW}, inset -1px 0 0 rgba(255,255,255,0.5), 1px 0 6px rgba(15,24,40,0.02)`, zIndex: 2};

const ICON_BTN_SX = {
    color: "text.secondary", 
    "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}
};

const ITEM_SX = {

    borderRadius: "12px", 

    mb: 0.5, 

    py: 1, 

    minHeight: 44, 

    overflow: "hidden", 

    transition: `transform ${DUR}ms ${EASE}, background-color ${DUR}ms ${EASE}, color ${DUR}ms ${EASE}, box-shadow ${DUR}ms ${EASE}, padding ${DUR}ms ${EASE}`, 

    "&.Mui-selected": {
        bgcolor: "primary.main", 
        color: "#FFFFFF", 
        boxShadow: `${SEALER_SHADOW}, 0 4px 12px -3px rgba(31, 111, 235, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.25)`, 
        "&:hover": {bgcolor: "primary.dark"}
    }, 

    "&:not(.Mui-selected):hover": {bgcolor: "rgba(15, 24, 40, 0.04)", transform: "translateY(-1px)"}, 

    "&:not(.Mui-selected):active": {bgcolor: "rgba(15, 24, 40, 0.08)", transform: "scale(0.96)"}

};

const HEADER_SHELL_SX = {position: "relative", height: 72, flexShrink: 0};

const FOOTER_SHELL_SX = {flexShrink: 0, height: 56, position: "relative"};

const NAV_SHELL_SX = {flex: 1, overflow: "hidden", px: 1.5, pt: 0.25};

const WORKSPACE_LABEL_SX = {...MONO_SX, color: "text.secondary", fontWeight: 500, letterSpacing: "0.14em", fontSize: 10, whiteSpace: "nowrap"};

const STATUS_LABEL_SX = {fontSize: 11, color: "text.secondary", fontWeight: 500, whiteSpace: "nowrap"};

const STATUS_DOT_STYLE = {backgroundColor: "#1E8E3E", boxShadow: "0 0 0 3px rgba(30, 142, 62, 0.18)"};

const FOOTER_EXPAND_BTN_SX = {
    width: 36, 
    height: 36, 
    color: "text.secondary", 
    bgcolor: "rgba(15, 24, 40, 0.04)", 
    boxShadow: `${SEALER_SHADOW}, ${SURFACE_SPECULAR}`, 
    "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}
};

function CountChip({value, selected}) {
    return <Chip label={value} size="small" sx={{height: 22, minWidth: 26, fontSize: 11.5, fontWeight: 700, flexShrink: 0, ...MONO_SX, bgcolor: selected ? "rgba(255, 255, 255, 0.22)" : "rgba(15, 24, 40, 0.06)", color: selected ? "#FFFFFF" : "text.secondary", "& .MuiChip-label": {px: 0.85}}}/>;
}

function cfLayer(visible, slideDir = -1) {

    return {
        opacity: visible ? 1 : 0, 
        transform: visible ? "translateX(0)" : `translateX(${slideDir * 3}px)`, 
        transition: visible ? `opacity 225ms 30ms, transform 225ms 30ms ${EASE}` : `opacity 75ms, transform 75ms ${EASE}`, 
        pointerEvents: visible ? "auto" : "none"
    };
}

export default function Sidebar({pendingCount, historyCount, scheduleCount, collapsed, onToggleCollapsed}) {

    const location = useLocation();

    const navigate = useNavigate();

    const counts = {pending: pendingCount, history: historyCount, schedule: scheduleCount};

    const exp = !collapsed;

    return (
        <Paper elevation={0} component="aside" sx={{...PAPER_SX, width: collapsed ? W_COLLAPSED : W_EXPANDED}}>
            <Box sx={HEADER_SHELL_SX}>
                <Box sx={{position: "absolute", inset: 0, px: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", ...cfLayer(exp, -1)}}>
                    <LogoMark size={36} withWordmark legend="v 1.0"/>
                    <Tooltip title="Collapse" placement="bottom">
                        <IconButton onClick={onToggleCollapsed} aria-label="Collapse sidebar" size="small" sx={ICON_BTN_SX}>
                            <ChevronLeftIcon sx={{fontSize: 22}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...cfLayer(!exp, 1)}}>
                    <LogoMark size={36}/>
                </Box>
            </Box>
            <Box sx={{px: 2.75, height: 28, flexShrink: 0, display: "flex", alignItems: "center", opacity: exp ? 1 : 0, transition: exp ? "opacity 225ms 40ms" : "opacity 200ms"}}>
                <Typography className="uppercase" sx={WORKSPACE_LABEL_SX}>Workspace</Typography>
            </Box>
            <Box sx={NAV_SHELL_SX}>
                <List disablePadding>
                    {TABS.map((t) => {

                        const selected = location.pathname === t.path;

                        return (
                            <Tooltip key={t.key} title={collapsed ? `${t.label} · ${counts[t.key]}` : ""} placement="right" disableHoverListener={!collapsed}>
                                <ListItemButton selected={selected} onClick={() => navigate(t.path)} sx={{...ITEM_SX, px: collapsed ? 0 : 1.75}}>
                                    <ListItemIcon sx={{minWidth: "auto", width: collapsed ? "100%" : 36, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, color: selected ? "#FFFFFF" : "text.secondary", transition: `width ${DUR}ms ${EASE}`, "& .MuiSvgIcon-root": {fontSize: 21}}}>{t.icon}</ListItemIcon>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 1, overflow: "hidden", maxWidth: collapsed ? 0 : 200, opacity: collapsed ? 0 : 1, transition: `max-width ${DUR}ms ${EASE}, opacity ${collapsed ? "200ms" : "225ms 30ms"}`}}>
                                        <ListItemText primary={t.label} sx={{"& .MuiTypography-root": {fontWeight: selected ? 600 : 500, fontSize: "0.92rem", letterSpacing: "-0.005em", whiteSpace: "nowrap"}}}/>
                                        <CountChip value={counts[t.key]} selected={selected}/>
                                    </Box>
                                </ListItemButton>
                            </Tooltip>
                        );
                    })}
                </List>
            </Box>
            <Box sx={FOOTER_SHELL_SX}>
                <Box sx={{position: "absolute", inset: 0, px: 2.75, display: "flex", alignItems: "center", borderTop: "1px solid", borderColor: "divider", ...cfLayer(exp, -1)}}>
                    <div className="flex items-center gap-2">
                        <span className="w-[7px] h-[7px] rounded-full shrink-0" style={STATUS_DOT_STYLE}/>
                        <Typography sx={STATUS_LABEL_SX}>Local-first · Offline ready</Typography>
                    </div>
                </Box>
                <Box sx={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid", borderColor: "divider", ...cfLayer(!exp, 1)}}>
                    <Tooltip title="Expand" placement="right">
                        <IconButton onClick={onToggleCollapsed} aria-label="Expand sidebar" size="small" sx={FOOTER_EXPAND_BTN_SX}>
                            <ChevronRightIcon sx={{fontSize: 20}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Paper>
    );
}

