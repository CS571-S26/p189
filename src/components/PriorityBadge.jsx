
import {Chip, Stack, Box, Typography} from "@mui/material";

/* ── Priority badge ─────────────────────────────────────
   Renders a task's priority in three flavors:

   • chip — full pill with label, used in toolbars/lists
   • dot  — colored dot + uppercase mono label, used as
            an inline-card meta line
   • bar  — vertical accent indicator on the left edge
            of a card. Implemented as a CENTERED, INSET
            pill so it never collides with the parent's
            rounded corners. The previous full-edge
            implementation was clipped by `overflow:hidden`
            on the parent and read as "truncated" — this
            variant is intentional, looks like a tab
            indicator, and works at any parent radius.   */

const PRIORITY = {
    high: {label: "High", color: "#D93025", bg: "#FCE8E6", soft: "rgba(217,48,37,0.10)"},
    medium: {label: "Medium", color: "#E8710A", bg: "#FEF3E8", soft: "rgba(232,113,10,0.10)"},
    low: {label: "Low", color: "#1E8E3E", bg: "#E6F4EA", soft: "rgba(30,142,62,0.10)"}
};

export default function PriorityBadge({priority, variant = "chip", inset = 10}) {
    const p = PRIORITY[priority] || PRIORITY.low;

    if (variant === "dot") {
        return (
            <Stack direction="row" alignItems="center" spacing={0.85} sx={{minWidth: 0}}>
                <Box sx={{width: 7, height: 7, borderRadius: "50%", bgcolor: p.color, flexShrink: 0, boxShadow: `0 0 0 3px ${p.soft}`}} />
                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: p.color, fontWeight: 600, letterSpacing: "0.10em", fontSize: 10, textTransform: "uppercase"}}>{p.label}</Typography>
            </Stack>
        );
    }

    if (variant === "bar") {
        return <Box aria-hidden sx={{position: "absolute", left: 6, top: inset, bottom: inset, width: 4, borderRadius: 999, bgcolor: p.color, boxShadow: `0 0 0 0.5px ${p.soft}`}} />;
    }

    return <Chip label={p.label} size="small" sx={{height: 22, fontSize: 11, fontWeight: 600, bgcolor: p.bg, color: p.color, border: "none"}} />;
}

export {PRIORITY};
