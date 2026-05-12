
import {memo, useCallback} from "react";
import {Stack, Typography, ToggleButtonGroup, ToggleButton} from "@mui/material";

import {WEEK_LABELS, LABEL_SX, dayButtonSx, toggleDayInList, SEALER_SHADOW, SURFACE_SPECULAR, RADIUS_MD, tactileTransition} from "../javascripts/shared";

const FREQ_OPTIONS = ["daily", "weekly", "monthly"];

const MONTH_DAYS = Array.from({length: 31}, (_, i) => i + 1);

const GROUP_SX = {

    gap: 1, 

    "& .MuiToggleButtonGroup-grouped": {
        border: "1px solid !important", 
        borderColor: "rgba(0, 0, 0, 0.06) !important", 
        marginLeft: "0 !important", 
        "&.Mui-selected": {borderColor: "#1F6FEB !important"}
    }
};

const FREQ_TOGGLE_SX = {

    flex: 1, 

    textTransform: "capitalize", 

    fontWeight: 600, 

    py: 0.85, 

    borderRadius: `${RADIUS_MD}px !important`, 

    backgroundClip: "padding-box", 

    boxShadow: `${SEALER_SHADOW}, ${SURFACE_SPECULAR}`, 

    transition: tactileTransition("transform, background-color, box-shadow, color, border-color"), 

    border: "1px solid !important", 

    borderColor: "rgba(0, 0, 0, 0.06) !important", 

    "&:hover": {bgcolor: "rgba(31, 111, 235, 0.06)", transform: "translateY(-1px)"}, 

    "&:active": {transform: "scale(0.96)"}, 

    "&.Mui-selected": {
        zIndex: 1, 
        bgcolor: "rgba(31, 111, 235, 0.08)", 
        color: "primary.main", 
        border: "1px solid !important", 
        borderColor: "#1F6FEB !important", 
        boxShadow: `${SEALER_SHADOW}, 0 4px 12px -4px rgba(31, 111, 235, 0.35), ${SURFACE_SPECULAR}`, 
        "&:hover": {bgcolor: "rgba(31, 111, 235, 0.12)", transform: "translateY(-1px)"}, 
        "&:active": {transform: "scale(0.96)"}
    }
};

const FrequencySelector = memo(function FrequencySelector({frequency, weekDays, monthDays, onFrequencyChange, onWeekDaysChange, onMonthDaysChange}) {

    const handleFrequencyChange = useCallback((_, value) => {
        if (value) onFrequencyChange(value);
    }, [onFrequencyChange]);

    const handleWeekDayClick = useCallback((day) => {
        onWeekDaysChange(toggleDayInList(weekDays, day));
    }, [onWeekDaysChange, weekDays]);

    const handleMonthDayClick = useCallback((day) => {
        onMonthDaysChange(toggleDayInList(monthDays, day));
    }, [monthDays, onMonthDaysChange]);

    return (
        <Stack spacing={2} sx={{pb: 0.5, overflow: "visible"}}>
            <Stack spacing={1}>
                <Typography sx={LABEL_SX}>Frequency</Typography>
                <ToggleButtonGroup value={frequency} exclusive onChange={handleFrequencyChange} size="small" fullWidth sx={GROUP_SX}>
                    {FREQ_OPTIONS.map((f) => (
                        <ToggleButton key={f} value={f} sx={FREQ_TOGGLE_SX}>
                            {f}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>
            {frequency === "weekly" && (
                <Stack spacing={1}>
                    <Typography sx={LABEL_SX}>Repeat on</Typography>
                    <div className="flex flex-wrap gap-1.5 pb-1">
                        {WEEK_LABELS.map((label, i) => {

                            const selected = weekDays.includes(i);

                            return (
                                <Typography key={i} component="button" type="button" onClick={() => handleWeekDayClick(i)} aria-pressed={selected} aria-label={`Toggle ${label}`} sx={dayButtonSx(selected)}>
                                    {label.toUpperCase()}
                                </Typography>
                            );
                        })}
                    </div>
                </Stack>
            )}
            {frequency === "monthly" && (
                <Stack spacing={1} sx={{pb: 0.5, overflow: "visible"}}>
                    <Typography sx={LABEL_SX}>Repeat on days</Typography>
                    <div className="grid grid-cols-7 gap-1.5 pb-1">
                        {MONTH_DAYS.map((day) => {

                            const selected = monthDays.includes(day);

                            return (
                                <Typography key={day} component="button" type="button" onClick={() => handleMonthDayClick(day)} aria-pressed={selected} aria-label={`Toggle day ${day}`} sx={{...dayButtonSx(selected), minWidth: 0, px: 0}}>
                                    {day}
                                </Typography>
                            );
                        })}
                    </div>
                    <Typography sx={{color: "text.secondary", fontSize: 11, lineHeight: 1.4}}>If a selected day doesn't exist in a given month, the task triggers on the last day.</Typography>
                </Stack>
            )}
        </Stack>
    );
});

export default FrequencySelector;
