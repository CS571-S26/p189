
import {memo, useState, useCallback} from "react";
import {Box, Stack, Typography, TextField, Button, IconButton, Tooltip} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

import {LABEL_SX, SUBTASK_ITEM_SX, SUBTASK_INPUT_SX, SUBTASK_ADD_BTN_SX, DELETE_ICON_SX} from "../javascripts/shared";

function SubtaskDraftEditor({subtasks, onAdd, onRemove}) {

    const [draft, setDraft] = useState("");

    const handleAdd = useCallback(() => {

        const t = draft.trim();

        if (!t) return;

        onAdd(t);

        setDraft("");

    }, [draft, onAdd]);

    const handleDraftChange = useCallback((e) => {
        setDraft(e.target.value);
    }, []);

    const handleKeyDown = useCallback((e) => {

        if (e.isComposing || e.nativeEvent?.isComposing || e.key !== "Enter" || e.shiftKey) return;

        e.preventDefault();

        handleAdd();

    }, [handleAdd]);

    return (
        <Stack spacing={1}>
            <Typography sx={LABEL_SX}>Subtasks {subtasks.length > 0 && `· ${subtasks.length}`}</Typography>
            {subtasks.length > 0 && (
                <Stack spacing={0.75}>
                    {subtasks.map((s) => (
                        <Box key={s.id} sx={SUBTASK_ITEM_SX}>
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full ml-1" style={{backgroundColor: "#C5CCD7"}}/>
                            <Typography className="flex-1 min-w-0 truncate" sx={{fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.3, ml: 1.25}}>
                                {s.title}
                            </Typography>
                            <Tooltip title="Remove">
                                <IconButton size="small" onClick={() => onRemove(s.id)} aria-label={`Remove subtask "${s.title}"`} sx={DELETE_ICON_SX}>
                                    <DeleteOutlinedIcon sx={{fontSize: 16}}/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ))}
                </Stack>
            )}
            <div className="flex items-center gap-2">
                <TextField value={draft} onChange={handleDraftChange} onKeyDown={handleKeyDown} placeholder="Add a subtask" size="small" fullWidth slotProps={{htmlInput: {"aria-label": "New subtask title", maxLength: 80}}} sx={SUBTASK_INPUT_SX}/>
                <Button onClick={handleAdd} disabled={!draft.trim()} size="small" startIcon={<AddIcon sx={{fontSize: 16}}/>} disableElevation className="shrink-0" sx={SUBTASK_ADD_BTN_SX}>Add</Button>
            </div>
        </Stack>
    );
}

export default memo(SubtaskDraftEditor);
