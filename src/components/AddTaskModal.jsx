
import {useState, useEffect} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, ToggleButtonGroup, ToggleButton, Typography} from "@mui/material";

const PRIORITY_OPTIONS = [
    {
        value: "high",
        label: "High",
        color: "#D93025"
    }, {
        value: "medium",
        label: "Medium",
        color: "#E8710A"
    }, {
        value: "low",
        label: "Low",
        color: "#1E8E3E"
    }
];

const EMPTY_FORM = {title: "", tag: "Default", priority: "medium"};

export default function AddTaskModal({open, onClose, onSubmit, initialTask}) {

    const [form, setForm] = useState(EMPTY_FORM);

    const isEdit = Boolean(initialTask);

    useEffect(() => {

        if (open) {
            setForm(initialTask ? {title: initialTask.title, tag: initialTask.tag, priority: initialTask.priority} : EMPTY_FORM);
        }
    }, [open, initialTask]);

    const handleSubmit = () => {

        const title = form.title.trim();

        if (!title) return;

        onSubmit({...form, title, tag: form.tag.trim() || "Default"});

        onClose();

    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            handleSubmit();

        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{sx: {borderRadius: 3, border: "1px solid", borderColor: "divider"}}}>
            <DialogTitle sx={{pb: 1, fontWeight: 500}}>{isEdit ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogContent sx={{pt: "8px !important"}}>
                <Stack spacing={2.5} sx={{mt: 0.5}}>
                    <TextField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} onKeyDown={handleKeyDown} autoFocus fullWidth size="small" inputProps={{"aria-label": "Task title", maxLength: 120}}/>
                    <TextField label="Tag" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} onKeyDown={handleKeyDown} fullWidth size="small" helperText="Leave blank to use Default" inputProps={{"aria-label": "Task tag", maxLength: 24}}/>
                    <Stack spacing={1}>
                        <Typography variant="body2" sx={{color: "text.secondary", fontWeight: 500}}>
                            Priority
                        </Typography>
                        <ToggleButtonGroup value={form.priority} exclusive onChange={(_, v) => v && setForm({...form, priority: v})} size="small" fullWidth aria-label="Task priority">
                            {PRIORITY_OPTIONS.map((p) => (
                                <ToggleButton key={p.value} value={p.value} sx={{borderRadius: "20px !important", mx: 0.4, border: "1px solid #DADCE0 !important", "&.Mui-selected": {bgcolor: `${p.color}14`, color: p.color, borderColor: `${p.color} !important`, "&:hover": {bgcolor: `${p.color}1F`}}}}>
                                    {p.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2.5}}>
                <Button onClick={onClose} sx={{color: "text.secondary"}}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!form.title.trim()} disableElevation>
                    {isEdit ? "Save" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
