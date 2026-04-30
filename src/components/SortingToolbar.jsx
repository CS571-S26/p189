
import {Box, ToggleButtonGroup, ToggleButton, Tooltip, Typography} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import FlagIcon from "@mui/icons-material/Flag";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SortIcon from "@mui/icons-material/Sort";

/* ── Sorting toolbar ────────────────────────────────────
   Pill-style sort selector. Configurable via `options`
   so it can be reused for any collection that exposes
   sortable axes (tasks today; archives, schedules, or
   any future list view tomorrow). Each option declares
   its label, icon, and an optional `hint` that surfaces
   the *behaviour* of the sort beyond the bare label —
   "by deadline" doesn't tell a user whether soonest or
   latest comes first, the hint does.

   The component also exposes a hidden live-region
   readout of the current sort so screen readers
   announce the change when the user taps a different
   pill — easy to overlook in a purely visual toggle. */

const MONO_LABEL_SX = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase"
};

export const DEFAULT_SORT_OPTIONS = [
    {value: "deadline", label: "Deadline", icon: <EventIcon sx={{fontSize: 16}} />, hint: "Soonest deadline first"},
    {value: "priority", label: "Priority", icon: <FlagIcon sx={{fontSize: 16}} />, hint: "Highest priority first"},
    {value: "tag", label: "Tag", icon: <LabelOutlinedIcon sx={{fontSize: 16}} />, hint: "Group by tag"},
    {value: "created", label: "Created", icon: <AccessTimeIcon sx={{fontSize: 16}} />, hint: "Most recently added first"}
];

export default function SortingToolbar({sortBy, onChange, options = DEFAULT_SORT_OPTIONS, label = "Sort"}) {
    const active = options.find((o) => o.value === sortBy);

    return (
        <Box sx={{display: "inline-flex", alignItems: "center", gap: 1.1, flexShrink: 0}}>
            <Box sx={{display: {xs: "none", md: "inline-flex"}, alignItems: "center", gap: 0.6, color: "text.secondary"}}>
                <SortIcon sx={{fontSize: 14}} />
                <Typography sx={MONO_LABEL_SX}>{label}</Typography>
            </Box>

            <ToggleButtonGroup value={sortBy} exclusive onChange={(_, v) => v && onChange(v)} size="small" aria-label="Sort tasks by" sx={{bgcolor: "background.paper", borderRadius: 999, p: 0.4, border: "1px solid", borderColor: "divider", boxShadow: "0 1px 2px rgba(15,24,40,0.03)", gap: 0, flexWrap: "nowrap"}}>
                {options.map((o) => (
                    <Tooltip key={o.value} title={o.hint || `Sort by ${o.label.toLowerCase()}`} placement="bottom">
                        <ToggleButton value={o.value} aria-label={o.hint || `Sort by ${o.label.toLowerCase()}`} sx={{px: 1.5, py: 0.55, gap: 0.6, border: "0 !important", borderRadius: "999px !important", color: "text.secondary", fontSize: "0.78rem", fontWeight: 600, textTransform: "none", transition: "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease", "&.Mui-selected": {bgcolor: "primary.main", color: "#FFFFFF", boxShadow: "0 2px 6px rgba(31,111,235,0.28)", "&:hover": {bgcolor: "primary.dark"}}, "&:hover": {bgcolor: "rgba(15,24,40,0.04)"}}}>
                            {o.icon}
                            <Box component="span" sx={{display: {xs: "none", sm: "inline"}}}>
                                {o.label}
                            </Box>
                        </ToggleButton>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>

            {/* Visually-hidden live region — announces sort changes to screen readers */}
            <Box aria-live="polite" sx={{position: "absolute", width: 1, height: 1, p: 0, m: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0}}>
                {active ? `Sorted by ${active.label.toLowerCase()}` : ""}
            </Box>
        </Box>
    );
}
