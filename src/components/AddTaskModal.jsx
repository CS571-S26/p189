
import {useState, useEffect} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, ToggleButtonGroup, ToggleButton, Typography, Box, IconButton, Tooltip, Chip, Switch, FormControlLabel, Collapse} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

const PRIORITY_OPTIONS = [
    {value: "high", label: "High", color: "#D93025"},
    {value: "medium", label: "Medium", color: "#E8710A"},
    {value: "low", label: "Low", color: "#1E8E3E"}
];

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EMPTY_FORM = {title: "", tag: "Default", priority: "medium", deadline: ""};

const EMPTY_SCHEDULE = {frequency: "weekly", weekDays: [1, 3, 5], monthDays: [1]};

const SECTION_LABEL_SX = {fontFamily: '"JetBrains Mono", monospace', color: "text.secondary", fontWeight: 500, letterSpacing: "0.10em", fontSize: 10, textTransform: "uppercase"};

export default function AddTaskModal({open, onClose, onSubmit, onAddSchedule, initialTask}) {
    const [form, setForm] = useState(EMPTY_FORM);

    const [subtasks, setSubtasks] = useState([]);

    const [subtaskDraft, setSubtaskDraft] = useState("");

    const [saveAsTemplate, setSaveAsTemplate] = useState(false);

    const [schedule, setSchedule] = useState(EMPTY_SCHEDULE);

    const isEdit = Boolean(initialTask);

    useEffect(() => {
        if (open) {
            setForm(initialTask ? {title: initialTask.title, tag: initialTask.tag, priority: initialTask.priority, deadline: initialTask.deadline || ""} : EMPTY_FORM);

            setSubtasks(initialTask?.subtasks?.map((s) => ({...s})) || []);

            setSubtaskDraft("");

            setSaveAsTemplate(false);

            setSchedule(EMPTY_SCHEDULE);
        }
    }, [open, initialTask]);

    const handleSubmit = () => {
        const title = form.title.trim();

        if (!title) return;

        const payload = {...form, title, tag: form.tag.trim() || "Default", deadline: form.deadline || null, subtasks};

        onSubmit(payload);

        if (saveAsTemplate && onAddSchedule) {
            onAddSchedule({title: payload.title, tag: payload.tag, priority: payload.priority, subtasks, ...schedule});
        }

        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();

            if (e.target.getAttribute("aria-label") === "New subtask title") {
                handleAddSubtask();
            } else {
                handleSubmit();
            }
        }
    };

    const handleAddSubtask = () => {
        const t = subtaskDraft.trim();

        if (!t) return;

        setSubtasks((prev) => [...prev, {id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: t, done: false, weight: 1}]);

        setSubtaskDraft("");
    };

    const toggleWeekDay = (day) => {
        setSchedule((s) => {
            const has = s.weekDays.includes(day);

            const next = has ? s.weekDays.filter((d) => d !== day) : [...s.weekDays, day].sort((a, b) => a - b);

            return {...s, weekDays: next.length > 0 ? next : [day]};
        });
    };

    const toggleMonthDay = (day) => {
        setSchedule((s) => {
            const has = s.monthDays.includes(day);

            const next = has ? s.monthDays.filter((d) => d !== day) : [...s.monthDays, day].sort((a, b) => a - b);

            return {...s, monthDays: next.length > 0 ? next : [day]};
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{sx: {maxHeight: "92vh"}}}>
            <DialogTitle sx={{pb: 1, fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.020em"}}>{isEdit ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogContent sx={{pt: "8px !important"}}>
                <Stack spacing={2.5} sx={{mt: 0.5}}>
                    <TextField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} onKeyDown={handleKeyDown} autoFocus fullWidth size="small" inputProps={{"aria-label": "Task title", maxLength: 120}} />

                    <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                        <TextField label="Tag" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" helperText="Leave blank for Default" inputProps={{"aria-label": "Task tag", maxLength: 24}} />
                        <TextField label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} fullWidth size="small" helperText="Optional" InputLabelProps={{shrink: true}} inputProps={{"aria-label": "Task deadline"}} />
                    </Stack>

                    <Stack spacing={1}>
                        <Typography sx={SECTION_LABEL_SX}>Priority</Typography>
                        <ToggleButtonGroup value={form.priority} exclusive onChange={(_, v) => v && setForm({...form, priority: v})} size="small" fullWidth aria-label="Task priority">
                            {PRIORITY_OPTIONS.map((p) => (
                                <ToggleButton key={p.value} value={p.value} sx={{flex: 1, fontWeight: 600, py: 0.85, "&.Mui-selected": {bgcolor: `${p.color}14`, color: p.color, borderColor: `${p.color} !important`, "&:hover": {bgcolor: `${p.color}1F`}}}}>
                                    {p.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Stack>

                    {/* Subtasks */}
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

                    {/* Save as recurring */}
                    {!isEdit && onAddSchedule && (
                        <Stack spacing={1.5} sx={{pt: 0.5}}>
                            <FormControlLabel control={<Switch checked={saveAsTemplate} onChange={(e) => setSaveAsTemplate(e.target.checked)} size="small" />} label={<Typography sx={{fontWeight: 600, fontSize: "0.875rem", letterSpacing: "-0.005em"}}>Also save as recurring template</Typography>} sx={{ml: 0}} />
                            <Collapse in={saveAsTemplate} timeout={220}>
                                <Stack spacing={2} sx={{pt: 0.5, pl: 0.5}}>
                                    <Stack spacing={1}>
                                        <Typography sx={SECTION_LABEL_SX}>Frequency</Typography>
                                        <ToggleButtonGroup value={schedule.frequency} exclusive onChange={(_, v) => v && setSchedule((s) => ({...s, frequency: v}))} size="small" fullWidth aria-label="Recurring frequency">
                                            {["daily", "weekly", "monthly"].map((f) => (
                                                <ToggleButton key={f} value={f} sx={{flex: 1, textTransform: "capitalize", fontWeight: 600, py: 0.85, "&.Mui-selected": {bgcolor: "rgba(31,111,235,0.10)", color: "primary.dark", borderColor: "primary.main !important", "&:hover": {bgcolor: "rgba(31,111,235,0.16)"}}}}>
                                                    {f}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    </Stack>

                                    {schedule.frequency === "weekly" && (
                                        <Stack spacing={1}>
                                            <Typography sx={SECTION_LABEL_SX}>Repeat on</Typography>
                                            <Stack direction="row" spacing={0.5} sx={{flexWrap: "wrap", gap: 0.5}}>
                                                {WEEK_LABELS.map((label, i) => (
                                                    <Chip key={i} label={label} size="small" onClick={() => toggleWeekDay(i)} aria-pressed={schedule.weekDays.includes(i)} sx={{cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: '"JetBrains Mono", monospace', bgcolor: schedule.weekDays.includes(i) ? "primary.main" : "transparent", color: schedule.weekDays.includes(i) ? "#fff" : "text.secondary", border: "1px solid", borderColor: schedule.weekDays.includes(i) ? "primary.main" : "#DDE2EA", "&:hover": {bgcolor: schedule.weekDays.includes(i) ? "primary.dark" : "rgba(31,111,235,0.06)"}}} />
                                                ))}
                                            </Stack>
                                        </Stack>
                                    )}

                                    {schedule.frequency === "monthly" && (
                                        <Stack spacing={1}>
                                            <Typography sx={SECTION_LABEL_SX}>Repeat on days</Typography>
                                            <Box sx={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5}}>
                                                {Array.from({length: 31}, (_, i) => i + 1).map((d) => (
                                                    <Chip key={d} label={d} size="small" onClick={() => toggleMonthDay(d)} aria-pressed={schedule.monthDays.includes(d)} sx={{cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: '"JetBrains Mono", monospace', height: 28, bgcolor: schedule.monthDays.includes(d) ? "primary.main" : "transparent", color: schedule.monthDays.includes(d) ? "#fff" : "text.secondary", border: "1px solid", borderColor: schedule.monthDays.includes(d) ? "primary.main" : "#DDE2EA", "& .MuiChip-label": {px: 0.5}, "&:hover": {bgcolor: schedule.monthDays.includes(d) ? "primary.dark" : "rgba(31,111,235,0.06)"}}} />
                                                ))}
                                            </Box>
                                            <Typography sx={{color: "text.secondary", fontSize: 11, lineHeight: 1.4}}>If a selected day doesn't exist in a given month, the task triggers on the last day of that month.</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Collapse>
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2.5}}>
                <Button onClick={onClose} sx={{color: "text.secondary"}}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!form.title.trim()} disableElevation>
                    {isEdit ? "Save" : saveAsTemplate ? "Create & Schedule" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
