
import {useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect, memo, startTransition} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Box, ToggleButtonGroup, ToggleButton, Typography, Switch, FormControlLabel, Collapse} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {renderTimeViewClock} from "@mui/x-date-pickers/timeViewRenderers";

import FrequencySelector from "./FrequencySelector";
import SubtaskDraftEditor from "./SubtaskDraftEditor";

import {PRIORITY_OPTIONS, LABEL_SX, defaultDeadline, defaultTriggerTime, toPickerDate, fromPickerDate, PICKER_SLOT_PROPS, uid, MOTION_FAST, MOTION_BASE, MOTION_EASE, priorityToggleSx, scheduleBackgroundTask, cancelBackgroundTask} from "../javascripts/shared";

const EMPTY_FORM = {title: "", tag: "Default", priority: "medium", deadline: ""};

const EMPTY_SCHEDULE = {frequency: "weekly", weekDays: [1, 3, 5], monthDays: [1]};

const BG = "#FBFCFE";

const EDGE_COLOR = "251, 252, 254";

const PAPER_SX = {maxHeight: "92vh", display: "flex", flexDirection: "column", bgcolor: BG, backgroundColor: BG, backgroundImage: "none", backdropFilter: "none", WebkitBackdropFilter: "none", contain: "layout style", overflow: "hidden", isolation: "isolate"};

const TITLE_SX = {pb: 1, fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.020em", flexShrink: 0};

const SCROLL_SHELL_SX = {flex: "1 1 auto", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, backgroundColor: BG, isolation: "isolate"};

const EDGE_BASE_SX = {position: "absolute", left: 0, right: 0, zIndex: 1, pointerEvents: "none", transition: `opacity 120ms ${MOTION_EASE}`, willChange: "opacity"};

const TOP_EDGE_SX = {...EDGE_BASE_SX, top: 0, height: 36, background: `linear-gradient(to bottom, rgba(${EDGE_COLOR}, 0.98), rgba(${EDGE_COLOR}, 0))`};

const BOTTOM_EDGE_SX = {...EDGE_BASE_SX, bottom: 0, height: 40, background: `linear-gradient(to top, rgba(${EDGE_COLOR}, 0.98), rgba(${EDGE_COLOR}, 0))`};

const CONTENT_SX = {
    pt: "8px !important",
    pb: "24px !important",
    overflowX: "hidden",
    overflowY: "auto",
    flex: "1 1 auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    scrollBehavior: "auto",
    backgroundColor: BG,
    "&::-webkit-scrollbar": {display: "none"},
    scrollbarWidth: "none",
    msOverflowStyle: "none"
};

const ACTIONS_SX = {px: 3, pt: 1.25, pb: 2.5, flexShrink: 0, bgcolor: BG, backgroundColor: BG, backgroundImage: "linear-gradient(to bottom, rgba(251, 252, 254, 0.96), #FBFCFE 38%)", borderTop: 0, boxShadow: "0 -10px 22px -22px rgba(15, 24, 40, 0.22)"};

const SWITCH_LABEL_SX = {fontWeight: 600, fontSize: "0.875rem", letterSpacing: "-0.005em"};

const FIELD_ROW_SX = {contain: "layout style"};

const SCHEDULE_BOX_SX = {pt: 1, px: 0.5, pb: 2, contain: "layout style", isolation: "isolate"};

const SCHEDULE_PLACEHOLDER_SX = {height: 0, overflow: "hidden", pointerEvents: "none", visibility: "hidden"};

const TRANSITION_DURATION = {enter: MOTION_BASE, exit: MOTION_FAST};

const TITLE_INPUT_PROPS = {
    htmlInput: {"aria-label": "Task title", maxLength: 120}
};

const TAG_INPUT_PROPS = {
    htmlInput: {"aria-label": "Task tag", maxLength: 24}
};

const DEADLINE_SLOT_PROPS = {

    ...PICKER_SLOT_PROPS,

    toolbar: {hidden: false},

    layout: {

        sx: {
            "& .MuiTimeClock-root": {margin: "auto"}
        }
    },

    textField: {size: "small", fullWidth: true, helperText: "Defaults to one hour from now"}

};

const extractTime = (deadline) => (deadline?.includes("T") ? deadline.slice(11, 16) : "");

const DeadlineField = memo(function DeadlineField({value, onChange}) {

    const pickerValue = useMemo(() => toPickerDate(value), [value]);

    return <DateTimePicker label="Deadline" value={pickerValue} onChange={onChange} ampm={false} viewRenderers={{hours: renderTimeViewClock, minutes: renderTimeViewClock}} closeOnSelect slotProps={DEADLINE_SLOT_PROPS}/>;

});

const PriorityPicker = memo(function PriorityPicker({value, onChange}) {

    return (
        <Stack spacing={1} sx={FIELD_ROW_SX}>
            <Typography sx={LABEL_SX}>Priority</Typography>
            <ToggleButtonGroup value={value} exclusive onChange={onChange} size="small" fullWidth aria-label="Task priority">
                {PRIORITY_OPTIONS.map((p) => (
                    <ToggleButton key={p.value} value={p.value} sx={priorityToggleSx(p)}>
                        {p.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Stack>
    );
});

const ScheduleOptions = memo(function ScheduleOptions({show, ready, schedule, onFrequencyChange, onWeekDaysChange, onMonthDaysChange}) {

    if (!ready && !show) return <Box aria-hidden sx={SCHEDULE_PLACEHOLDER_SX}/>;

    return (
        <Collapse in={show} timeout={TRANSITION_DURATION} unmountOnExit={false} mountOnEnter={false} sx={{overflow: "visible", "& .MuiCollapse-wrapper": {overflow: "visible"}, "& .MuiCollapse-wrapperInner": {overflow: "visible"}}}>
            <Box sx={{...SCHEDULE_BOX_SX, opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-4px)", transition: `opacity ${MOTION_BASE}ms ${MOTION_EASE}, transform ${MOTION_BASE}ms ${MOTION_EASE}`}}>
                <FrequencySelector frequency={schedule.frequency} weekDays={schedule.weekDays} monthDays={schedule.monthDays} onFrequencyChange={onFrequencyChange} onWeekDaysChange={onWeekDaysChange} onMonthDaysChange={onMonthDaysChange}/>
            </Box>
        </Collapse>
    );
});

function createDraft(initialTask) {
    return {form: initialTask ? {title: initialTask.title, tag: initialTask.tag, priority: initialTask.priority, deadline: initialTask.deadline || ""} : {...EMPTY_FORM, deadline: defaultDeadline()}, subtasks: initialTask?.subtasks?.map((s) => ({...s})) || [], saveAsTemplate: false, schedule: EMPTY_SCHEDULE, submitting: false};
}

export default function AddTaskModal({open, onClose, onSubmit, onAddSchedule, initialTask}) {

    const [draft, setDraft] = useState(() => createDraft(initialTask));

    const [edges, setEdges] = useState({top: false, bottom: false});

    const [scheduleReady, setScheduleReady] = useState(false);

    const [pickerReady, setPickerReady] = useState(false);

    const contentRef = useRef(null);

    const submittingRef = useRef(false);

    const focusFrameRef = useRef(0);

    const scrollFrameRef = useRef(0);

    const scheduleIdleRef = useRef(null);

    const scheduleFrameRef = useRef(0);

    const pickerFrameRef = useRef(0);

    const titleInputRef = useRef(null);

    const {form, subtasks, saveAsTemplate, schedule, submitting} = draft;

    const isEdit = Boolean(initialTask);

    const measureEdges = useCallback(() => {

        const node = contentRef.current;

        if (!node) return;

        const overflow = node.scrollHeight - node.clientHeight > 2;

        const next = {top: overflow && node.scrollTop > 2, bottom: overflow && node.scrollTop + node.clientHeight < node.scrollHeight - 2};

        setEdges((prev) => (prev.top === next.top && prev.bottom === next.bottom ? prev : next));

    }, []);

    useEffect(() => {

        if (!open) {

            setEdges({top: false, bottom: false});

            setScheduleReady(false);

            setPickerReady(false);

            cancelBackgroundTask(scheduleIdleRef.current);

            if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);

            if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);

            if (scheduleFrameRef.current) cancelAnimationFrame(scheduleFrameRef.current);

            if (pickerFrameRef.current) cancelAnimationFrame(pickerFrameRef.current);

            scheduleIdleRef.current = null;

            scheduleFrameRef.current = 0;

            pickerFrameRef.current = 0;

            focusFrameRef.current = 0;

            scrollFrameRef.current = 0;

            return undefined;

        }

        submittingRef.current = false;

        setPickerReady(false);

        setDraft(createDraft(initialTask));

        focusFrameRef.current = requestAnimationFrame(() => {

            focusFrameRef.current = 0;

            titleInputRef.current?.focus({preventScroll: true});

            measureEdges();

            pickerFrameRef.current = requestAnimationFrame(() => {

                pickerFrameRef.current = 0;

                setPickerReady(true);

            });
        });

        scheduleIdleRef.current = scheduleBackgroundTask(() => {

            scheduleIdleRef.current = null;

            setScheduleReady(true);

        });

        return () => {

            cancelBackgroundTask(scheduleIdleRef.current);

            if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);

            if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);

            if (scheduleFrameRef.current) cancelAnimationFrame(scheduleFrameRef.current);

            if (pickerFrameRef.current) cancelAnimationFrame(pickerFrameRef.current);

            scheduleIdleRef.current = null;

            scheduleFrameRef.current = 0;

            pickerFrameRef.current = 0;

            focusFrameRef.current = 0;

            scrollFrameRef.current = 0;

        };
    }, [open, initialTask, measureEdges]);

    useLayoutEffect(() => {

        if (!open || !contentRef.current) return undefined;

        const node = contentRef.current;

        let frame = 0;

        const scheduleMeasure = () => {

            if (frame) return;

            frame = requestAnimationFrame(() => {

                frame = 0;

                measureEdges();

            });
        };

        if (typeof ResizeObserver === "undefined") {

            scheduleMeasure();

            return () => {
                if (frame) cancelAnimationFrame(frame);
            };
        }

        const resizeObserver = new ResizeObserver(scheduleMeasure);

        resizeObserver.observe(node);

        if (node.firstElementChild) resizeObserver.observe(node.firstElementChild);

        scheduleMeasure();

        return () => {

            resizeObserver.disconnect();

            if (frame) cancelAnimationFrame(frame);

        };
    }, [open, subtasks.length, saveAsTemplate, measureEdges]);

    const handleTitleChange = useCallback((e) => {

        const title = e.target.value;

        setDraft((prev) => (prev.form.title === title ? prev : {...prev, form: {...prev.form, title}}));

    }, []);

    const handleTagChange = useCallback((e) => {

        const tag = e.target.value;

        setDraft((prev) => (prev.form.tag === tag ? prev : {...prev, form: {...prev.form, tag}}));

    }, []);

    const handleDeadlineChange = useCallback((date) => {

        const deadline = fromPickerDate(date);

        setDraft((prev) => (prev.form.deadline === deadline ? prev : {...prev, form: {...prev.form, deadline}}));

    }, []);

    const handlePriorityChange = useCallback((_, priority) => {

        if (!priority) return;

        setDraft((prev) => (prev.form.priority === priority ? prev : {...prev, form: {...prev.form, priority}}));

    }, []);

    const handleTemplateChange = useCallback((e) => {

        const saveAsTemplate = e.target.checked;

        startTransition(() => {
            setDraft((prev) => (prev.saveAsTemplate === saveAsTemplate ? prev : {...prev, saveAsTemplate}));
        });

        if (!saveAsTemplate || scheduleReady || scheduleFrameRef.current) return;

        cancelBackgroundTask(scheduleIdleRef.current);

        scheduleIdleRef.current = null;

        scheduleFrameRef.current = requestAnimationFrame(() => {

            scheduleFrameRef.current = 0;

            setScheduleReady(true);

        });
    }, [scheduleReady]);

    const handleFrequencyChange = useCallback((frequency) => {
        setDraft((prev) => (prev.schedule.frequency === frequency ? prev : {...prev, schedule: {...prev.schedule, frequency}}));
    }, []);

    const handleWeekDaysChange = useCallback((weekDays) => {
        setDraft((prev) => ({...prev, schedule: {...prev.schedule, weekDays}}));
    }, []);

    const handleMonthDaysChange = useCallback((monthDays) => {
        setDraft((prev) => ({...prev, schedule: {...prev.schedule, monthDays}}));
    }, []);

    const addSubtask = useCallback((title) => {
        setDraft((prev) => ({...prev, subtasks: [...prev.subtasks, {id: uid(), title, done: false, weight: 1}]}));
    }, []);

    const removeSubtask = useCallback((id) => {
        setDraft((prev) => ({...prev, subtasks: prev.subtasks.filter((s) => s.id !== id)}));
    }, []);

    const handleSubmit = useCallback(() => {

        const title = form.title.trim();

        if (!title || submittingRef.current) return;

        submittingRef.current = true;

        setDraft((prev) => ({...prev, submitting: true}));

        const payload = {...form, title, tag: form.tag.trim() || "Default", deadline: form.deadline || null, subtasks};

        onSubmit(payload);

        if (saveAsTemplate && onAddSchedule) {

            const time = extractTime(form.deadline) || defaultTriggerTime();

            onAddSchedule({title: payload.title, tag: payload.tag, priority: payload.priority, triggerTime: time, subtasks, ...schedule});

        }

        onClose();

    }, [form, onAddSchedule, onClose, onSubmit, saveAsTemplate, schedule, subtasks]);

    const handleKeyDown = useCallback((e) => {

        if (e.isComposing || e.nativeEvent?.isComposing || e.key !== "Enter" || e.shiftKey) return;

        e.preventDefault();

        handleSubmit();

    }, [handleSubmit]);

    const handleScroll = useCallback(() => {

        if (scrollFrameRef.current) return;

        scrollFrameRef.current = requestAnimationFrame(() => {

            scrollFrameRef.current = 0;

            measureEdges();

        });
    }, [measureEdges]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock transitionDuration={TRANSITION_DURATION} slotProps={{backdrop: {sx: {backgroundColor: "rgba(15, 24, 40, 0.18)", backdropFilter: "none", WebkitBackdropFilter: "none"}}, paper: {sx: PAPER_SX}, root: {sx: {"& .MuiDialog-container": {py: 2}}}}}>
            <DialogTitle sx={TITLE_SX}>{isEdit ? "Edit Task" : "New Task"}</DialogTitle>
            <Box sx={SCROLL_SHELL_SX}>
                <Box aria-hidden sx={{...TOP_EDGE_SX, opacity: edges.top ? 1 : 0}}/>
                <DialogContent ref={contentRef} onScroll={handleScroll} sx={CONTENT_SX}>
                    <Stack spacing={2.5} sx={{mt: 0.5}}>
                        <TextField label="Title" value={form.title} onChange={handleTitleChange} onKeyDown={handleKeyDown} inputRef={titleInputRef} fullWidth size="small" slotProps={TITLE_INPUT_PROPS}/>
                        <Stack direction={{xs: "column", sm: "row"}} spacing={2} sx={FIELD_ROW_SX}>
                            <TextField label="Tag" value={form.tag} onChange={handleTagChange} onKeyDown={handleKeyDown} fullWidth size="small" helperText="Leave blank for Default" slotProps={TAG_INPUT_PROPS}/>
                            {pickerReady ? <DeadlineField value={form.deadline} onChange={handleDeadlineChange}/> : <TextField label="Deadline" value={form.deadline.replace("T", " ")} disabled fullWidth size="small" helperText="Defaults to one hour from now"/>}
                        </Stack>
                        <PriorityPicker value={form.priority} onChange={handlePriorityChange}/>
                        <SubtaskDraftEditor subtasks={subtasks} onAdd={addSubtask} onRemove={removeSubtask}/>
                        {!isEdit && onAddSchedule && (
                            <Stack spacing={1.5} sx={{pt: 0.5, contain: "layout style"}}>
                                <FormControlLabel control={<Switch checked={saveAsTemplate} onChange={handleTemplateChange} size="small"/>} label={<Typography sx={SWITCH_LABEL_SX}>Also save as recurring template</Typography>} sx={{ml: 0}}/>
                                <ScheduleOptions show={saveAsTemplate} ready={scheduleReady} schedule={schedule} onFrequencyChange={handleFrequencyChange} onWeekDaysChange={handleWeekDaysChange} onMonthDaysChange={handleMonthDaysChange}/>
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <Box aria-hidden sx={{...BOTTOM_EDGE_SX, opacity: edges.bottom ? 1 : 0}}/>
            </Box>
            <DialogActions sx={ACTIONS_SX}>
                <Button onClick={onClose} sx={{color: "text.secondary"}}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.title.trim()} disableElevation>
                    {isEdit ? "Save" : saveAsTemplate ? "Create & Schedule" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
