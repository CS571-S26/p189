
import {Checkbox} from "@mui/material";

export default function StatusToggle({checked, onChange, title}) {
    return <Checkbox checked={checked} onChange={onChange} size="small" aria-label={`Mark "${title}" as ${checked ? "pending" : "done"}`} sx={{p: 0.75, color: "#DADCE0", "&.Mui-checked": {color: "primary.main"}}}/>;
}
