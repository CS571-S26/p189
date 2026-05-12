
import {Checkbox, Typography} from "@mui/material";

import {MOTION_FAST, MOTION_EASE} from "../javascripts/shared";

const CHECKBOX_SX = {
    p: 0.5, 
    color: "#C5CCD7", 
    transition: `color ${MOTION_FAST}ms ${MOTION_EASE}, transform ${MOTION_FAST}ms ${MOTION_EASE}`, 
    backfaceVisibility: "hidden", 
    transform: "translateZ(0)", 
    "&.Mui-checked": {color: "primary.main"}, 
    "&:hover": {transform: "scale(1.05) translateZ(0)"}, 
    "&:active": {transform: "scale(0.95) translateZ(0)"}
};

const labelSx = (checked, isSmall) => ({
    fontSize: isSmall ? 11 : 11.5, 
    fontWeight: checked ? 600 : 500, 
    color: checked ? "primary.main" : "text.secondary", 
    letterSpacing: checked ? "0.02em" : 0, 
    lineHeight: 1.3, 
    minWidth: 30, 
    transition: `color ${MOTION_FAST}ms ${MOTION_EASE}, font-weight ${MOTION_FAST}ms ${MOTION_EASE}`, 
    userSelect: "none", 
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    whiteSpace: "nowrap"
});

export default function StatusToggle({checked, onChange, label, size = "medium"}) {

    const isSmall = size === "small";

    const ariaLabel = label ? `Mark "${label}" as ${checked ? "pending" : "done"}` : `Mark as ${checked ? "pending" : "done"}`;

    return (
        <span className="inline-flex items-center min-w-0" style={{gap: isSmall ? 2 : 4}}>
            <Checkbox checked={checked} onChange={onChange} size="small" aria-label={ariaLabel} sx={CHECKBOX_SX}/>
            <Typography sx={labelSx(checked, isSmall)}>{checked ? "Done" : "Open"}</Typography>
        </span>
    );
}
