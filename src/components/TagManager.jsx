
import {useMemo} from "react";
import {Box, Chip, Stack, Typography, Fade} from "@mui/material";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CloseIcon from "@mui/icons-material/Close";

/* ── Tag filter rail ────────────────────────────────────
   Self-contained tag-based filter for any task list.
   Derives counts directly from the `tasks` prop so the
   parent never needs to pre-aggregate, and pairs the
   chip strip with a leading "Filter" legend (matches the
   "Sort" legend on the sibling toolbar) and a fade-in
   "Clear" affordance — chasing the active tag back down
   to the All chip is a real ergonomic win when tags
   start scrolling off the right edge.

   Returns null when there's only the implicit Default
   tag and no active filter — nothing useful to render. */

const MONO_LABEL_SX = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase"
};

const CHIP_BASE_SX = {
    height: 28,
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
    cursor: "pointer",
    transition: "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease"
};

function tagChipSx(selected) {
    return {
        ...CHIP_BASE_SX,
        bgcolor: selected ? "primary.main" : "background.paper",
        color: selected ? "#FFFFFF" : "text.secondary",
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        boxShadow: "none",
        "&:hover": {bgcolor: selected ? "primary.dark" : "rgba(31,111,235,0.06)", borderColor: selected ? "primary.dark" : "primary.light"},
        "&:active": {boxShadow: "none", transform: "scale(0.97)"},
        "&:focus-visible": {outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2, boxShadow: "none"}
    };
}

export default function TagManager({tasks, activeTag, onChange}) {
    const tagCounts = useMemo(() => {
        const map = new Map();

        for (const t of tasks) {
            const tag = t.tag || "Default";

            map.set(tag, (map.get(tag) || 0) + 1);
        }

        return Array.from(map.entries()).sort((a, b) => {
            if (a[0] === "Default") return 1;

            if (b[0] === "Default") return -1;

            return a[0].localeCompare(b[0]);
        });
    }, [tasks]);

    if (tagCounts.length <= 1 && !activeTag) return null;

    const activeCount = activeTag ? tagCounts.find(([t]) => t === activeTag)?.[1] || 0 : tasks.length;

    const announcement = activeTag ? `Filtered by ${activeTag}: ${activeCount} of ${tasks.length} tasks` : `Showing all ${tasks.length} tasks`;

    return (
        <Box sx={{flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 1.1, overflow: "hidden"}}>
            <Box sx={{display: {xs: "none", sm: "inline-flex"}, alignItems: "center", gap: 0.6, color: "text.secondary", flexShrink: 0}}>
                <LabelOutlinedIcon sx={{fontSize: 14}} />
                <Typography sx={MONO_LABEL_SX}>Filter</Typography>
            </Box>

            <Box sx={{flex: 1, minWidth: 0, overflowX: "auto", "&::-webkit-scrollbar": {height: 0}}}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{flexWrap: "nowrap"}}>
                    <Chip label={`All · ${tasks.length}`} size="small" onClick={() => onChange(null)} aria-label="Show all tags" aria-pressed={activeTag === null} sx={tagChipSx(activeTag === null)} />
                    {tagCounts.map(([tag, count]) => {
                        const selected = activeTag === tag;

                        return <Chip key={tag} label={`${tag} · ${count}`} size="small" onClick={() => onChange(selected ? null : tag)} aria-label={`Filter by tag ${tag}`} aria-pressed={selected} sx={tagChipSx(selected)} />;
                    })}
                </Stack>
            </Box>

            <Fade in={Boolean(activeTag)} unmountOnExit>
                <Box component="button" type="button" onClick={() => onChange(null)} aria-label="Clear tag filter" sx={{flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 0.4, cursor: "pointer", color: "primary.main", bgcolor: "transparent", border: "1px solid transparent", fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", px: 1, py: 0.5, borderRadius: 999, transition: "background-color 0.18s ease, border-color 0.18s ease", "&:hover": {bgcolor: "rgba(31,111,235,0.08)", borderColor: "rgba(31,111,235,0.18)"}, "&:focus-visible": {outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1}}}>
                    <CloseIcon sx={{fontSize: 12}} />
                    Clear
                </Box>
            </Fade>

            {/* Visually-hidden live region — announces filter changes to screen readers */}
            <Box aria-live="polite" sx={{position: "absolute", width: 1, height: 1, p: 0, m: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0}}>
                {announcement}
            </Box>
        </Box>
    );
}
