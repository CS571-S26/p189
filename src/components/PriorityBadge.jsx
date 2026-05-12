
import {Chip, Box, Typography} from "@mui/material";

import {PRIORITY_META, MONO_SX, SEALER_SHADOW, SURFACE_SPECULAR} from "../javascripts/shared";

export default function PriorityBadge({priority, variant = "chip", inset = 10}) {

    const p = PRIORITY_META[priority] || PRIORITY_META.low;

    if (variant === "dot") {

        return (
            <span className="inline-flex items-center gap-2 min-w-0 h-[18px]">
                <span className="shrink-0 w-[7px] h-[7px] rounded-full mt-[0.5px]" style={{backgroundColor: p.color, boxShadow: `0 0 0 3px ${p.soft}`}}/>
                <Typography sx={{...MONO_SX, fontSize: 10, fontWeight: 600, lineHeight: 1, letterSpacing: "0.10em", textTransform: "uppercase", color: p.color}}>{p.label}</Typography>
            </span>
        );
    }

    if (variant === "bar") {
        return <Box aria-hidden sx={{position: "absolute", left: 10, top: inset, bottom: inset, width: 2.5, borderRadius: 999, bgcolor: p.color, boxShadow: `0 0 0 0.5px ${p.soft}`}}/>;
    }
    return <Chip label={p.label} size="small" sx={{height: 22, fontSize: 11, fontWeight: 600, bgcolor: p.bg, color: p.color, border: "none", backgroundClip: "padding-box", boxShadow: `${SEALER_SHADOW}, ${SURFACE_SPECULAR}`}}/>;
}
