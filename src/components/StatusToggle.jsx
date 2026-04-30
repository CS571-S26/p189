
import {Checkbox, Stack, Typography} from "@mui/material";

export default function StatusToggle({checked, onChange, label, size = "medium"}) {
    const isSmall = size === "small";

    return (
        <Stack direction="row" alignItems="center" spacing={isSmall ? 0.25 : 0.5} sx={{minWidth: 0}}>
            <Checkbox checked={checked} onChange={onChange} size="small" aria-label={label ? `Mark "${label}" as ${checked ? "pending" : "done"}` : `Mark as ${checked ? "pending" : "done"}`} sx={{p: isSmall ? 0.5 : 0.75, color: "#C5CCD7", "&.Mui-checked": {color: "primary.main"}, transition: "color 0.15s"}} />
            <Typography sx={{fontSize: isSmall ? 11 : 11.5, fontWeight: checked ? 600 : 500, color: checked ? "primary.main" : "text.secondary", letterSpacing: checked ? "0.02em" : 0, transition: "color 0.15s, font-weight 0.15s", userSelect: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{checked ? "Done" : "Open"}</Typography>
        </Stack>
    );
}
