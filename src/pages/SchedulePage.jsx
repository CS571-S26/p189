
import {useState} from "react";
import {Box, Card, CardContent, Typography, Stack, TextField, Button, ToggleButtonGroup, ToggleButton, Chip, IconButton, Tooltip, Switch, Select, MenuItem, FormControl, InputLabel, Grow, Divider} from "@mui/material";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PriorityBadge from "../components/PriorityBadge";

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRIORITY_OPTIONS = [
    {value: "high", label: "High", color: "#D93025"},
    {value: "medium", label: "Medium", color: "#E8710A"},
    {value: "low", label: "Low", color: "#1E8E3E"}
];

const OVERDUE_OPTIONS = [
    {value: "none", label: "Keep as-is"},
    {value: "archive", label: "Archive to History"},
    {value: "delete", label: "Delete permanently"}
];

const EMPTY_FORM = {title: "", tag: "Default", priority: "medium", frequency: "weekly", weekDays: [1, 3, 5], monthDays: [1]};

const SECTION_LABEL_SX = {fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 500, letterSpacing: "0.10em", fontSize: 10, textTransform: "uppercase"};

function formatFrequency(t) {
    if (t.frequency === "daily") return "Daily";

    if (t.frequency === "weekly") return (t.weekDays || []).map((d) => WEEK_LABELS[d]).join(", ") || "Weekly";

    if (t.frequency === "monthly") {
        const days = t.monthDays || [];

        if (days.length <= 3) return `Monthly on ${days.join(", ")}`;

        return `Monthly on ${days.length} days`;
    }

    return "Custom";
}

function nextTriggerLabel(template) {
    if (!template.isActive) return "Paused";

    const now = new Date();

    const today = now.getDay();

    if (template.frequency === "daily") {
        const tomorrow = new Date(now);

        tomorrow.setDate(tomorrow.getDate() + 1);

        return `Next: ${tomorrow.toLocaleDateString(undefined, {month: "short", day: "numeric"})}`;
    }

    if (template.frequency === "weekly") {
        const days = (template.weekDays || []).slice().sort((a, b) => a - b);

        for (const d of days) {
            if (d > today) {
                const next = new Date(now);

                next.setDate(next.getDate() + (d - today));

                return `Next: ${next.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"})}`;
            }
        }

        const next = new Date(now);

        next.setDate(next.getDate() + (7 - today + days[0]));

        return `Next: ${next.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"})}`;
    }

    if (template.frequency === "monthly") {
        const todayDate = now.getDate();

        const days = (template.monthDays || []).slice().sort((a, b) => a - b);

        for (const d of days) {
            if (d > todayDate) {
                const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                const next = new Date(now.getFullYear(), now.getMonth(), Math.min(d, last));

                return `Next: ${next.toLocaleDateString(undefined, {month: "short", day: "numeric"})}`;
            }
        }

        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();

        const next = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(days[0], lastDay));

        return `Next: ${next.toLocaleDateString(undefined, {month: "short", day: "numeric"})}`;
    }

    return "";
}

export default function SchedulePage({templates, overdueAction, onAdd, onToggle, onDelete, onSetOverdueAction}) {
    const [form, setForm] = useState(EMPTY_FORM);

    const [subtasks, setSubtasks] = useState([]);

    const [subtaskDraft, setSubtaskDraft] = useState("");

    const handleAdd = () => {
        const title = form.title.trim();

        if (!title) return;

        onAdd({...form, title, tag: form.tag.trim() || "Default", subtasks});

        setForm(EMPTY_FORM);

        setSubtasks([]);

        setSubtaskDraft("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (e.target.getAttribute("aria-label") === "New subtask title") {
                handleAddSubtask();
            } else {
                handleAdd();
            }
        }
    };

    const handleAddSubtask = () => {
        const t = subtaskDraft.trim();

        if (!t) return;

        setSubtasks((prev) => [...prev, {id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: t, done: false, weight: 1}]);

        setSubtaskDraft("");
    };

    const toggleWeekDay = (day) => {
        setForm((f) => {
            const has = f.weekDays.includes(day);

            const next = has ? f.weekDays.filter((d) => d !== day) : [...f.weekDays, day].sort((a, b) => a - b);

            return {...f, weekDays: next.length > 0 ? next : [day]};
        });
    };

    const toggleMonthDay = (day) => {
        setForm((f) => {
            const has = f.monthDays.includes(day);

            const next = has ? f.monthDays.filter((d) => d !== day) : [...f.monthDays, day].sort((a, b) => a - b);

            return {...f, monthDays: next.length > 0 ? next : [day]};
        });
    };

    return (
        <Box component="main" sx={{flex: 1, px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 12, maxWidth: 980, width: "100%", mx: "auto"}}>
            <Stack spacing={3}>
                {/* Overdue settings */}
                <Card>
                    <CardContent sx={{p: {xs: 2.5, sm: 3.25}}}>
                        <Typography sx={{...SECTION_LABEL_SX, mb: 0.6}}>Overdue Behavior</Typography>
                        <Typography sx={{color: "text.secondary", mb: 2.25, lineHeight: 1.55, fontSize: "0.88rem"}}>Choose what happens when a task's deadline has passed without completion.</Typography>
                        <FormControl size="small" fullWidth sx={{maxWidth: 360}}>
                            <InputLabel id="overdue-action-label">When a task is overdue</InputLabel>
                            <Select labelId="overdue-action-label" value={overdueAction} label="When a task is overdue" onChange={(e) => onSetOverdueAction(e.target.value)}>
                                {OVERDUE_OPTIONS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>
                                        {o.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>

                {/* New template */}
                <Card>
                    <CardContent sx={{p: {xs: 2.5, sm: 3.25}}}>
                        <Typography sx={{...SECTION_LABEL_SX, mb: 2.25}}>New Recurring Template</Typography>
                        <Stack spacing={2}>
                            <TextField label="Task title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" inputProps={{"aria-label": "Recurring task title", maxLength: 120}} />
                            <TextField label="Tag" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" helperText="Leave blank for Default" inputProps={{"aria-label": "Recurring task tag", maxLength: 24}} />

                            <Stack spacing={1}>
                                <Typography sx={SECTION_LABEL_SX}>Priority</Typography>
                                <ToggleButtonGroup value={form.priority} exclusive onChange={(_, v) => v && setForm({...form, priority: v})} size="small" fullWidth aria-label="Recurring task priority">
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <ToggleButton key={p.value} value={p.value} sx={{flex: 1, fontWeight: 600, py: 0.85, "&.Mui-selected": {bgcolor: `${p.color}14`, color: p.color, borderColor: `${p.color} !important`, "&:hover": {bgcolor: `${p.color}1F`}}}}>
                                            {p.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Stack>

                            <Stack spacing={1}>
                                <Typography sx={SECTION_LABEL_SX}>Frequency</Typography>
                                <ToggleButtonGroup value={form.frequency} exclusive onChange={(_, v) => v && setForm({...form, frequency: v})} size="small" fullWidth aria-label="Recurring frequency">
                                    {["daily", "weekly", "monthly"].map((f) => (
                                        <ToggleButton key={f} value={f} sx={{flex: 1, textTransform: "capitalize", fontWeight: 600, py: 0.85, "&.Mui-selected": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.dark", borderColor: "primary.main !important", "&:hover": {bgcolor: "rgba(31,111,235,0.16)"}}}}>
                                            {f}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Stack>

                            {form.frequency === "weekly" && (
                                <Stack spacing={1}>
                                    <Typography sx={SECTION_LABEL_SX}>Repeat on</Typography>
                                    <Stack direction="row" spacing={0.5} sx={{flexWrap: "wrap", gap: 0.5}}>
                                        {WEEK_LABELS.map((label, i) => (
                                            <Chip key={i} label={label} size="small" onClick={() => toggleWeekDay(i)} aria-pressed={form.weekDays.includes(i)} sx={{cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: '"JetBrains Mono", monospace', bgcolor: form.weekDays.includes(i) ? "primary.main" : "transparent", color: form.weekDays.includes(i) ? "#fff" : "text.secondary", border: "1px solid", borderColor: form.weekDays.includes(i) ? "primary.main" : "#DDE2EA", "&:hover": {bgcolor: form.weekDays.includes(i) ? "primary.dark" : "rgba(31,111,235,0.06)"}}} />
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {form.frequency === "monthly" && (
                                <Stack spacing={1}>
                                    <Typography sx={SECTION_LABEL_SX}>Repeat on days</Typography>
                                    <Box sx={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5}}>
                                        {Array.from({length: 31}, (_, i) => i + 1).map((d) => (
                                            <Chip key={d} label={d} size="small" onClick={() => toggleMonthDay(d)} aria-pressed={form.monthDays.includes(d)} sx={{cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: '"JetBrains Mono", monospace', height: 28, bgcolor: form.monthDays.includes(d) ? "primary.main" : "transparent", color: form.monthDays.includes(d) ? "#fff" : "text.secondary", border: "1px solid", borderColor: form.monthDays.includes(d) ? "primary.main" : "#DDE2EA", "& .MuiChip-label": {px: 0.5}, "&:hover": {bgcolor: form.monthDays.includes(d) ? "primary.dark" : "rgba(31,111,235,0.06)"}}} />
                                        ))}
                                    </Box>
                                    <Typography sx={{color: "text.secondary", fontSize: 11, lineHeight: 1.4}}>If a selected day doesn't exist in a given month, the task triggers on the last day of that month.</Typography>
                                </Stack>
                            )}

                            <Stack spacing={1}>
                                <Typography sx={SECTION_LABEL_SX}>Subtasks {subtasks.length > 0 && `· ${subtasks.length}`}</Typography>
                                {subtasks.length > 0 && (
                                    <Stack spacing={0.25}>
                                        {subtasks.map((s) => (
                                            <Stack key={s.id} direction="row" alignItems="center" spacing={0.75} sx={{pl: 0.5, minHeight: 32}}>
                                                <Box sx={{width: 6, height: 6, borderRadius: "50%", bgcolor: "#C5CCD7", flexShrink: 0}} />
                                                <Typography sx={{flex: 1, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{s.title}</Typography>
                                                <Tooltip title="Remove">
                                                    <IconButton size="small" onClick={() => setSubtasks((prev) => prev.filter((x) => x.id !== s.id))} aria-label={`Remove subtask "${s.title}"`} sx={{color: "text.secondary", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                                                        <DeleteOutlineIcon sx={{fontSize: 16}} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField value={subtaskDraft} onChange={(e) => setSubtaskDraft(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add a subtask" size="small" fullWidth inputProps={{"aria-label": "New subtask title", maxLength: 80}} sx={{"& .MuiOutlinedInput-root": {fontSize: "0.85rem"}}} />
                                    <Button onClick={handleAddSubtask} disabled={!subtaskDraft.trim()} size="small" startIcon={<AddIcon sx={{fontSize: 16}} />} disableElevation sx={{flexShrink: 0, fontSize: "0.8rem", px: 1.5}}>
                                        Add
                                    </Button>
                                </Stack>
                            </Stack>

                            <Box>
                                <Button variant="contained" onClick={handleAdd} disabled={!form.title.trim()} startIcon={<AddIcon />} disableElevation>
                                    Add Template
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Templates list */}
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                        <EventRepeatOutlinedIcon sx={{fontSize: 14, color: "text.secondary"}} />
                        <Typography sx={{...SECTION_LABEL_SX, letterSpacing: "0.14em", fontSize: 10.5}}>Active Templates · {templates.length}</Typography>
                    </Stack>
                    {templates.length === 0 ? (
                        <Stack alignItems="center" justifyContent="center" sx={{py: 7, color: "text.secondary"}}>
                            <Box sx={{width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(124,92,250,0.10)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2}}>
                                <EventRepeatOutlinedIcon sx={{fontSize: 38, color: "secondary.main"}} />
                            </Box>
                            <Typography sx={{fontWeight: 600, fontSize: "1rem", color: "text.primary", mb: 0.4}}>No recurring templates yet</Typography>
                            <Typography sx={{fontSize: "0.85rem"}}>Add one above to auto-spawn tasks on a schedule.</Typography>
                        </Stack>
                    ) : (
                        <Stack spacing={1.5}>
                            {templates.map((t, i) => {
                                const freqLabel = formatFrequency(t);

                                const tplSubtasks = t.subtasks || [];

                                return (
                                    <Grow in key={t.id} timeout={220 + i * 50}>
                                        <Card sx={{borderRadius: "14px", opacity: t.isActive ? 1 : 0.6, transition: "opacity 0.22s, border-color 0.22s", position: "relative", overflow: "hidden", "&:hover": {borderColor: "rgba(31,111,235,0.32)"}}}>
                                            <PriorityBadge priority={t.priority} variant="bar" inset={12} />
                                            <CardContent sx={{p: 2.25, pl: 2.75, "&:last-child": {pb: 2.25}}}>
                                                <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} alignItems={{xs: "stretch", sm: "center"}}>
                                                    <Stack direction="row" alignItems="center" spacing={1.25} sx={{flex: 1, minWidth: 0}}>
                                                        <Box sx={{flex: 1, minWidth: 0}}>
                                                            <Typography sx={{fontWeight: 600, fontSize: "0.97rem", letterSpacing: "-0.012em", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{t.title}</Typography>
                                                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{mt: 0.6, flexWrap: "wrap", rowGap: 0.5}}>
                                                                <Chip label={t.tag} size="small" variant="outlined" sx={{height: 20, fontSize: 10.5, fontWeight: 500, borderColor: "divider", color: "text.secondary", bgcolor: "rgba(15,24,40,0.025)", "& .MuiChip-label": {px: 0.85}}} />
                                                                <Chip label={freqLabel} size="small" sx={{height: 20, fontSize: 10.5, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', bgcolor: "rgba(31,111,235,0.10)", color: "primary.dark", border: "none", "& .MuiChip-label": {px: 0.85}}} />
                                                                {tplSubtasks.length > 0 && <Chip icon={<ChecklistIcon sx={{fontSize: 12}} />} label={`${tplSubtasks.length} subtask${tplSubtasks.length > 1 ? "s" : ""}`} size="small" sx={{height: 20, fontSize: 10.5, bgcolor: "rgba(15,24,40,0.05)", color: "text.secondary", border: "none", "& .MuiChip-icon": {color: "text.secondary", ml: 0.5, mr: -0.25}, "& .MuiChip-label": {px: 0.85}}} />}
                                                                <Typography sx={{color: "text.secondary", fontSize: 10.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 500}}>{nextTriggerLabel(t)}</Typography>
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                    <Divider flexItem orientation="vertical" sx={{display: {xs: "none", sm: "block"}, borderColor: "divider"}} />
                                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{flexShrink: 0, justifyContent: {xs: "flex-end", sm: "flex-start"}}}>
                                                        <Tooltip title={t.isActive ? "Pause" : "Resume"}>
                                                            <Switch checked={t.isActive} onChange={() => onToggle(t.id)} size="small" inputProps={{"aria-label": `${t.isActive ? "Pause" : "Resume"} template "${t.title}"`}} />
                                                        </Tooltip>
                                                        <Tooltip title="Delete template">
                                                            <IconButton size="small" onClick={() => onDelete(t.id)} aria-label={`Delete template "${t.title}"`} sx={{color: "text.secondary", "&:hover": {bgcolor: "#FCE8E6", color: "error.main"}}}>
                                                                <DeleteOutlineIcon sx={{fontSize: 18}} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grow>
                                );
                            })}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
