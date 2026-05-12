
import {Box, ToggleButtonGroup, ToggleButton, Tooltip, Typography} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import FlagIcon from "@mui/icons-material/Flag";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SortIcon from "@mui/icons-material/Sort";

import {MONO_SX, MOTION_EASE, normalizeSortBy, glassSurfaceSx, GLASS_BG_STRONG, GLASS_SHADOW, GLASS_TONES} from "../javascripts/shared";

export const DEFAULT_SORT_OPTIONS = [
    {
        value: "deadline", 
        label: "Deadline", 
        icon: <EventIcon sx={{fontSize: 16}}/>, 
        hint: "Soonest deadline first"
    }, {
        value: "priority", 
        label: "Priority", 
        icon: <FlagIcon sx={{fontSize: 16}}/>, 
        hint: "Highest priority first"
    }, {
        value: "tag", 
        label: "Tag", 
        icon: <LabelOutlinedIcon sx={{fontSize: 16}}/>, 
        hint: "Group by tag"
    }, {
        value: "created", 
        label: "Created", 
        icon: <AccessTimeIcon sx={{fontSize: 16}}/>, 
        hint: "Most recently added first"
    }
];

const GROUP_SX = {
    display: "flex", 
    flexWrap: "nowrap", 
    gap: 1, 
    p: 0.5, 
    ...glassSurfaceSx({backgroundColor: GLASS_BG_STRONG, boxShadow: GLASS_SHADOW}), 
    "& .MuiToggleButtonGroup-grouped": {border: "0 !important", borderRadius: "10px !important"}
};

const neutralTone = GLASS_TONES.neutral;

const activeTone = GLASS_TONES.primary;

const BUTTON_SX = {

    px: 1.6, 

    py: 0.55, 

    gap: 0.8, 

    minHeight: 32, 

    ...glassSurfaceSx({radius: 10, backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none"}), 

    color: "text.secondary", 

    fontSize: "0.78rem", 

    fontWeight: 600, 

    textTransform: "none", 

    transition: `transform 225ms ${MOTION_EASE}, background-color 225ms ${MOTION_EASE}, color 225ms ${MOTION_EASE}, box-shadow 225ms ${MOTION_EASE}, border-color 225ms ${MOTION_EASE}`, 

    "&.Mui-selected": {

        backgroundColor: activeTone.backgroundColor, 

        borderColor: activeTone.borderColor, 

        boxShadow: activeTone.boxShadow, 

        color: activeTone.color, 

        "&:hover": {
            backgroundColor: activeTone.hoverBackgroundColor, 
            borderColor: activeTone.hoverBorderColor, 
            boxShadow: activeTone.hoverBoxShadow
        }
    }, 

    "&:not(.Mui-selected):hover": {
        backgroundColor: neutralTone.hoverBackgroundColor, 
        borderColor: neutralTone.borderColor, 
        boxShadow: neutralTone.boxShadow, 
        transform: "translateY(-1px)"
    }, 

    "&:not(.Mui-selected):active": {
        backgroundColor: neutralTone.hoverBackgroundColor, 
        borderColor: neutralTone.hoverBorderColor, 
        boxShadow: neutralTone.hoverBoxShadow, 
        transform: "scale(0.96)"
    }
};

export default function SortingToolbar({sortBy, onChange, options = DEFAULT_SORT_OPTIONS, label = "Sort"}) {

    const safeOptions = Array.isArray(options) && options.length > 0 ? options : DEFAULT_SORT_OPTIONS;

    const activeSort = normalizeSortBy(sortBy);

    const activeLabel = safeOptions.find((o) => o.value === activeSort)?.label;

    return (
        <span className="inline-flex items-center gap-2 shrink-0">
            <Box sx={{display: {xs: "none", md: "inline-flex"}, alignItems: "center", gap: 0.6, color: "text.secondary"}}>
                <SortIcon sx={{fontSize: 14}}/>
                <Typography className="uppercase" sx={{...MONO_SX, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em"}}>{label}</Typography>
            </Box>
            <ToggleButtonGroup value={activeSort} exclusive onChange={(_, v) => v && onChange?.(normalizeSortBy(v))} size="small" sx={GROUP_SX}>
                {safeOptions.map((o) => (
                    <Tooltip key={o.value} title={o.hint || `Sort by ${o.label.toLowerCase()}`} placement="bottom">
                        <ToggleButton value={o.value} sx={BUTTON_SX}>
                            {o.icon}
                            <Box component="span" sx={{display: {xs: "none", sm: "inline"}}}>{o.label}</Box>
                        </ToggleButton>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
            <span aria-live="polite" className="sr-only">{activeLabel ? `Sorted by ${activeLabel.toLowerCase()}` : ""}</span>
        </span>
    );
}
