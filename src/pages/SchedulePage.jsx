
import {useState, useRef, useEffect, useCallback, useMemo, startTransition} from "react";
import {Box, Card, CardContent, Typography, Stack, TextField, Button, ToggleButtonGroup, ToggleButton, IconButton, Tooltip, Switch, Select, MenuItem, FormControl, InputLabel, Divider} from "@mui/material";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {renderTimeViewClock} from "@mui/x-date-pickers/timeViewRenderers";

import PriorityBadge from "../components/PriorityBadge";
import FrequencySelector from "../components/FrequencySelector";
import SubtaskDraftEditor from "../components/SubtaskDraftEditor";

import {PRIORITY_OPTIONS, LABEL_SX, MONO_SX, WEEK_LABELS, defaultTriggerTime, timeToDate, dateToTime, PICKER_SLOT_PROPS, PRIMARY_HOVER, ERROR_HOVER, SEALER_SHADOW, SURFACE_SPECULAR, CARD_SHADOW, CARD_SHADOW_HOVER, MOTION_FAST, uid, tactileTransition, priorityToggleSx, parseClockTime, normalizeOverdueAction, glassSurfaceSx, GLASS_TONES, staggerDelay} from "../javascripts/shared";

const OVERDUE_OPTIONS = [
    {value: "none", label: "Keep as-is"}, 
    {value: "archive", label: "Archive to History"}, 
    {value: "delete", label: "Delete permanently"}
];

const ACTION_ICON_SX = {width: 34, height: 34, color: "text.secondary", "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}, "&:active": {bgcolor: "rgba(31, 111, 235, 0.12)"}};

const DELETE_ICON_SX = {...ACTION_ICON_SX, "&:hover": {bgcolor: ERROR_HOVER, color: "error.main"}, "&:active": {bgcolor: "rgba(217, 48, 37, 0.12)"}};

const PILL_SX = {height: 20, px: 0.85, fontSize: 10.5, display: "inline-flex", alignItems: "center", ...glassSurfaceSx({radius: 999, backgroundColor: GLASS_TONES.neutral.backgroundColor, borderColor: GLASS_TONES.neutral.borderColor, boxShadow: GLASS_TONES.neutral.boxShadow})};

const OVERDUE_MENU_PROPS = {disableScrollLock: true, transitionDuration: {enter: MOTION_FAST, exit: MOTION_FAST}, slotProps: {paper: {sx: {mt: 0.75}}, backdrop: {sx: {backgroundColor: "transparent"}}}, MenuListProps: {sx: {p: 1}}};

const createEmptyForm = () => ({title: "", tag: "Default", priority: "medium", frequency: "weekly", weekDays: [1, 3, 5], monthDays: [1], triggerTime: defaultTriggerTime()});

function formatFrequency(t) {

    if (t.frequency === "daily") return "Daily";

    if (t.frequency === "weekly") return (t.weekDays || []).map((d) => WEEK_LABELS[d]).join(", ") || "Weekly";

    if (t.frequency === "monthly") {

        const days = t.monthDays || [];

        return days.length <= 3 ? `Monthly on ${days.join(", ")}` : `Monthly on ${days.length} days`;

    }
    return "Custom";
}

function nextTriggerLabel(template) {

    if (!template.isActive) return "Paused";

    const now = new Date();

    const today = now.getDay();

    const {hour, minute} = parseClockTime(template.triggerTime);

    const fmt = (d, opts) => d.toLocaleDateString(undefined, opts);

    const withTime = (d) => `${fmt(d, {weekday: "short", month: "short", day: "numeric"})} · ${template.triggerTime || "--:--"}`;

    const isFutureTimeToday = () => {

        const next = new Date(now);

        next.setHours(hour, minute, 0, 0);

        return next.getTime() > now.getTime();

    };

    if (template.frequency === "daily") {

        const next = new Date(now);

        if (!isFutureTimeToday()) next.setDate(next.getDate() + 1);

        return `Next: ${withTime(next)}`;

    }

    if (template.frequency === "weekly") {

        const days = (template.weekDays || []).slice().sort((a, b) => a - b);

        if (days.length === 0) return "";

        for (const d of days) {

            if (d > today || (d === today && isFutureTimeToday())) {

                const next = new Date(now);

                next.setDate(next.getDate() + (d - today));

                return `Next: ${withTime(next)}`;

            }
        }

        const next = new Date(now);

        next.setDate(next.getDate() + (7 - today + days[0]));

        return `Next: ${withTime(next)}`;

    }

    if (template.frequency === "monthly") {

        const todayDate = now.getDate();

        const days = (template.monthDays || []).slice().sort((a, b) => a - b);

        if (days.length === 0) return "";

        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        for (const d of days) {

            const clamped = Math.min(d, last);

            if (clamped > todayDate || (clamped === todayDate && isFutureTimeToday())) {

                const next = new Date(now.getFullYear(), now.getMonth(), clamped);

                return `Next: ${withTime(next)}`;

            }
        }

        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();

        const next = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(days[0], lastDay));

        return `Next: ${withTime(next)}`;

    }
    return "";
}

export default function SchedulePage({templates = [], overdueAction, onAdd, onUpdate, onToggle, onDelete, onSetOverdueAction}) {

    const [form, setForm] = useState(createEmptyForm);

    const [subtasks, setSubtasks] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const formRef = useRef(null);

    const submittingRef = useRef(false);

    const isEditing = editingId !== null;

    const safeTemplates = useMemo(() => (Array.isArray(templates) ? templates : []), [templates]);

    const overdueValue = normalizeOverdueAction(overdueAction);

    useEffect(() => {

        setSubmitting(false);

        submittingRef.current = false;

    }, [editingId]);

    const resetForm = () => {

        setForm(createEmptyForm());

        setSubtasks([]);

        setEditingId(null);

    };

    const handleSubmit = () => {

        const title = form.title.trim();

        if (!title || submittingRef.current) return;

        submittingRef.current = true;

        setSubmitting(true);

        const time = form.triggerTime || defaultTriggerTime();

        const payload = {...form, title, tag: form.tag.trim() || "Default", triggerTime: time, subtasks};

        if (isEditing && onUpdate) onUpdate(editingId, payload);

        else onAdd(payload);

        resetForm();

        submittingRef.current = false;

        setSubmitting(false);

    };

    const handleStartEdit = (template) => {

        startTransition(() => {

            setForm({title: template.title, tag: template.tag, priority: template.priority, frequency: template.frequency, weekDays: template.weekDays || [1, 3, 5], monthDays: template.monthDays || [1], triggerTime: template.triggerTime || defaultTriggerTime()});

            setSubtasks((template.subtasks || []).map((s, i) => ({id: `edit-${template.id}-${i}`, title: s.title, weight: s.weight || 1, done: false})));

            setEditingId(template.id);

        });

        requestAnimationFrame(() => formRef.current?.scrollIntoView({behavior: "smooth", block: "start"}));

    };

    const handleKeyDown = (e) => {

        if (e.isComposing || e.nativeEvent?.isComposing || e.key !== "Enter" || e.shiftKey) return;

        e.preventDefault();

        handleSubmit();

    };

    const addSubtask = useCallback((title) => {
        setSubtasks((prev) => [...prev, {id: uid(), title, done: false, weight: 1}]);
    }, []);

    const removeSubtask = useCallback((id) => {
        setSubtasks((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const handleDeleteTemplate = (id) => {

        if (editingId === id) resetForm();

        onDelete(id);

    };

    return (
        <Box component="main" className="flex-1 w-full mx-auto" sx={{px: {xs: 2, sm: 4}, pt: {xs: 2, sm: 3}, pb: 12, maxWidth: 980}}>
            <Stack spacing={3}>
                <Card sx={{bgcolor: "#FFFFFF", boxShadow: CARD_SHADOW}}>
                    <CardContent sx={{p: {xs: 2.5, sm: 3.25}}}>
                        <Typography sx={{...LABEL_SX, mb: 0.6}}>Overdue Behavior</Typography>
                        <Typography sx={{color: "text.secondary", mb: 2.25, lineHeight: 1.55, fontSize: "0.88rem"}}>Choose what happens when a task's deadline has passed without completion.</Typography>
                        <FormControl size="small" fullWidth sx={{maxWidth: 360}}>
                            <InputLabel id="overdue-action-label">When a task is overdue</InputLabel>
                            <Select labelId="overdue-action-label" value={overdueValue} label="When a task is overdue" onChange={(e) => onSetOverdueAction(e.target.value)} MenuProps={OVERDUE_MENU_PROPS}>
                                {OVERDUE_OPTIONS.map((o) => (
                                    <MenuItem key={o.value} value={o.value} sx={{borderRadius: "10px", fontSize: "0.875rem", fontWeight: 600, py: 1.25, mb: 0.75, "&:last-child": {mb: 0}, "&.Mui-selected": {bgcolor: "primary.main", color: "#FFFFFF", "&:hover": {bgcolor: "primary.dark"}}, "&:hover": {bgcolor: "rgba(15, 24, 40, 0.06)"}}}>
                                        {o.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
                <Card ref={formRef} sx={{bgcolor: "#FFFFFF", transition: tactileTransition("border-color, box-shadow"), ...(isEditing && {borderColor: "primary.main", boxShadow: `${SEALER_SHADOW}, 0 0 0 3px rgba(31, 111, 235, 0.10), 0 0 16px -6px rgba(31, 111, 235, 0.10), ${SURFACE_SPECULAR}`})}}>
                    <CardContent sx={{p: {xs: 2.5, sm: 3.25}}}>
                        <div className="flex items-center justify-between mb-5">
                            <Typography sx={LABEL_SX}>{isEditing ? "Edit Recurring Template" : "New Recurring Template"}</Typography>
                            {isEditing && <Typography sx={{...MONO_SX, fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "primary.main"}}>Editing</Typography>}
                        </div>
                        <Stack spacing={2}>
                            <TextField label="Task title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" slotProps={{htmlInput: {"aria-label": "Recurring task title", maxLength: 120}}}/>
                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                <TextField label="Tag" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" helperText="Leave blank for Default" slotProps={{htmlInput: {"aria-label": "Recurring task tag", maxLength: 24}}}/>
                                <TimePicker label="Trigger time" value={timeToDate(form.triggerTime)} onChange={(d) => setForm({...form, triggerTime: dateToTime(d)})} ampm={false} viewRenderers={{hours: renderTimeViewClock, minutes: renderTimeViewClock}} closeOnSelect={true} slotProps={{...PICKER_SLOT_PROPS, toolbar: {hidden: false}, layout: {sx: {"& .MuiTimeClock-root": {margin: "auto"}}}, textField: {size: "small", fullWidth: true, helperText: "Deadline for auto-created tasks"}}}/>
                            </Stack>
                            <Stack spacing={1}>
                                <Typography sx={LABEL_SX}>Priority</Typography>
                                <ToggleButtonGroup value={form.priority} exclusive onChange={(_, v) => v && setForm({...form, priority: v})} size="small" fullWidth aria-label="Recurring task priority">
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <ToggleButton key={p.value} value={p.value} sx={priorityToggleSx(p)}>
                                            {p.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Stack>
                            <FrequencySelector frequency={form.frequency} weekDays={form.weekDays} monthDays={form.monthDays} onFrequencyChange={(frequency) => setForm((f) => ({...f, frequency}))} onWeekDaysChange={(weekDays) => setForm((f) => ({...f, weekDays}))} onMonthDaysChange={(monthDays) => setForm((f) => ({...f, monthDays}))}/>
                            <SubtaskDraftEditor subtasks={subtasks} onAdd={addSubtask} onRemove={removeSubtask}/>
                            <div className="flex items-center gap-2">
                                <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.title.trim()} startIcon={isEditing ? <CheckIcon/> : <AddIcon/>} disableElevation>
                                    {isEditing ? "Save Changes" : "Add Template"}
                                </Button>
                                {isEditing && (
                                    <Button onClick={resetForm} sx={{color: "text.secondary"}}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </Stack>
                    </CardContent>
                </Card>
                <Box>
                    <div className="flex items-center gap-2 mb-3.5">
                        <EventRepeatOutlinedIcon sx={{fontSize: 14, color: "text.secondary"}}/>
                        <Typography sx={{...MONO_SX, color: "text.secondary", fontWeight: 600, letterSpacing: "0.14em", fontSize: 10.5, textTransform: "uppercase"}}>Active Templates · {safeTemplates.length}</Typography>
                    </div>
                    {safeTemplates.length === 0 ? (
                        <Stack sx={{alignItems: "center", justifyContent: "center", py: 7, color: "text.secondary"}}>
                            <Box className="flex items-center justify-center" sx={{width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(124, 92, 250, 0.10)", mb: 2}}>
                                <EventRepeatOutlinedIcon sx={{fontSize: 38, color: "secondary.main"}}/>
                            </Box>
                            <Typography sx={{fontWeight: 600, fontSize: "1rem", color: "text.primary", mb: 0.4}}>No recurring templates yet</Typography>
                            <Typography sx={{fontSize: "0.85rem"}}>Add one above to auto-spawn tasks on a schedule.</Typography>
                        </Stack>
                    ) : (
                        <Stack spacing={1.5}>
                            {safeTemplates.map((t, i) => {

                                const freqLabel = formatFrequency(t);

                                const tplSubtasks = t.subtasks || [];

                                const isCurrentlyEditing = editingId === t.id;

                                return (
                                    <div key={t.id} className="animate-fade-in-up" style={{animationDelay: staggerDelay(i)}}>
                                        <Card sx={{bgcolor: "#FFFFFF", opacity: t.isActive ? 1 : 0.6, position: "relative", overflow: "hidden", transition: tactileTransition("transform, border-color, box-shadow, opacity"), backfaceVisibility: "hidden", backgroundClip: "padding-box", boxShadow: CARD_SHADOW, "&:hover": {transform: "translateY(-1px)", borderColor: "rgba(31, 111, 235, 0.24)", boxShadow: CARD_SHADOW_HOVER}, "&:active": {transform: "scale(0.99)"}, ...(isCurrentlyEditing && {borderColor: "primary.main", boxShadow: `${SEALER_SHADOW}, 0 0 0 3px rgba(31, 111, 235, 0.10), 0 0 16px -6px rgba(31, 111, 235, 0.10), ${SURFACE_SPECULAR}`})}}>
                                            <PriorityBadge priority={t.priority} variant="bar" inset={12}/>
                                            <CardContent sx={{p: 2.25, pl: 2.75, "&:last-child": {pb: 2.25}}}>
                                                <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} sx={{alignItems: {xs: "stretch", sm: "center"}}}>
                                                    <Box className="flex-1 min-w-0">
                                                        <Typography className="truncate" sx={{fontWeight: 600, fontSize: "0.97rem", letterSpacing: "-0.012em", lineHeight: 1.3}}>
                                                            {t.title}
                                                        </Typography>
                                                        <div className="flex items-center flex-wrap gap-1.5 mt-1.5" style={{rowGap: 4}}>
                                                            <Box component="span" sx={{...PILL_SX, fontWeight: 500, color: "text.secondary"}}>
                                                                {t.tag}
                                                            </Box>
                                                            <Box component="span" sx={{...PILL_SX, ...MONO_SX, fontWeight: 700, backgroundColor: GLASS_TONES.primary.backgroundColor, borderColor: GLASS_TONES.primary.borderColor, boxShadow: GLASS_TONES.primary.boxShadow, color: GLASS_TONES.primary.color}}>
                                                                {freqLabel}
                                                            </Box>
                                                            {t.triggerTime && (
                                                                <Box component="span" sx={{...PILL_SX, ...MONO_SX, gap: 0.5, fontWeight: 600, backgroundColor: GLASS_TONES.primary.backgroundColor, borderColor: GLASS_TONES.primary.borderColor, boxShadow: GLASS_TONES.primary.boxShadow, color: GLASS_TONES.primary.color}}>
                                                                    <AccessTimeIcon sx={{fontSize: 11}}/>
                                                                    {t.triggerTime}
                                                                </Box>
                                                            )}
                                                            {tplSubtasks.length > 0 && (
                                                                <Box component="span" sx={{...PILL_SX, gap: 0.5, fontWeight: 500, color: "text.secondary"}}>
                                                                    <ChecklistIcon sx={{fontSize: 12}}/>
                                                                    {`${tplSubtasks.length} subtask${tplSubtasks.length !== 1 ? "s" : ""}`}
                                                                </Box>
                                                            )}
                                                            <Typography sx={{...MONO_SX, color: "text.secondary", fontSize: 10.5, fontWeight: 500}}>{nextTriggerLabel(t)}</Typography>
                                                        </div>
                                                    </Box>
                                                    <Divider flexItem orientation="vertical" sx={{display: {xs: "none", sm: "block"}, borderColor: "divider"}}/>
                                                    <div className="flex items-center gap-0.5 shrink-0 sm:justify-start justify-end">
                                                        <Tooltip title={t.isActive ? "Pause" : "Resume"}>
                                                            <div className="flex items-center h-[34px]">
                                                                <Switch checked={t.isActive} onChange={() => onToggle(t.id)} size="small" slotProps={{input: {"aria-label": `${t.isActive ? "Pause" : "Resume"} template "${t.title}"`}}} sx={{transform: "scale(0.9)", transformOrigin: "center"}}/>
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip title="Edit template">
                                                            <IconButton size="small" onClick={() => handleStartEdit(t)} aria-label={`Edit template "${t.title}"`} sx={{...ACTION_ICON_SX, color: isCurrentlyEditing ? "primary.main" : "text.secondary"}}>
                                                                <EditOutlinedIcon sx={{fontSize: 18}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete template">
                                                            <IconButton size="small" onClick={() => handleDeleteTemplate(t.id)} aria-label={`Delete template "${t.title}"`} sx={DELETE_ICON_SX}>
                                                                <DeleteOutlinedIcon sx={{fontSize: 18}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
