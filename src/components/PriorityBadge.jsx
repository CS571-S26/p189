
import {Chip} from "@mui/material";

const PRIORITY = {
    high: {label: "High", color: "#D93025", bg: "#FCE8E6"},
    medium: {label: "Medium", color: "#E8710A", bg: "#FEF3E8"},
    low: {label: "Low", color: "#1E8E3E", bg: "#E6F4EA"}
};

export default function PriorityBadge({priority}) {

    const p = PRIORITY[priority] || PRIORITY.low;

    return <Chip label={p.label} size="small" sx={{height: 22, fontSize: 11, fontWeight: 600, bgcolor: p.bg, color: p.color, border: "none"}}/>;

}

export {PRIORITY};
