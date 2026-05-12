
export const pad2 = (n) => String(n).padStart(2, "0");

export const uid = () => {

    const cryptoApi = globalThis.crypto;

    if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();

    if (cryptoApi?.getRandomValues) return `${Date.now()}-${cryptoApi.getRandomValues(new Uint32Array(1))[0].toString(36)}`;

    return `${Date.now()}-${Math.floor(Math.random() * 0xffffffff).toString(36)}`;

};

export const localDateStr = (date = new Date()) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const todayStr = () => localDateStr();

export const PRIORITY_RANK = {high: 0, medium: 1, low: 2};

export const SORT_VALUES = ["deadline", "priority", "tag", "created"];

export const OVERDUE_ACTIONS = ["none", "archive", "delete"];

export const DEFAULT_PREFS = {sortBy: "deadline", overdueAction: "none", tagFilter: null};

export function normalizeSortBy(value) {
    return SORT_VALUES.includes(value) ? value : DEFAULT_PREFS.sortBy;
}

export function normalizeTag(value) {

    const tag = typeof value === "string" ? value.trim() : "";

    return tag || "Default";

}

export function normalizeTagFilter(value) {

    const tag = typeof value === "string" ? value.trim() : "";

    return tag || null;

}

export function normalizeDeadline(value) {

    if (!value) return null;

    if (typeof value === "string") return value;

    if (value instanceof Date && !isNaN(value.getTime())) return fromPickerDate(value);

    return null;

}

export function normalizeSubtasks(subtasks) {

    return Array.isArray(subtasks) ? subtasks.map((s, index) => ({
          id: s?.id || `sub-${index}-${uid()}`, 
          title: typeof s?.title === "string" && s.title.trim() ? s.title : "Untitled subtask", 
          done: Boolean(s?.done), 
          weight: Number.isFinite(s?.weight) && s.weight > 0 ? s.weight : 1
      })) : [];
}

export function normalizeTask(task, index = 0) {

    const createdAt = Number(task?.createdAt);

    const title = typeof task?.title === "string" && task.title.trim() ? task.title : "Untitled task";

    const priority = PRIORITY_RANK[task?.priority] === undefined ? "medium" : task.priority;

    return {
        id: task?.id || `task-${index}-${uid()}`, 
        title, 
        tag: normalizeTag(task?.tag), 
        priority, 
        deadline: normalizeDeadline(task?.deadline), 
        isPinned: Boolean(task?.isPinned), 
        done: Boolean(task?.done), 
        subtasks: normalizeSubtasks(task?.subtasks), 
        createdAt: Number.isFinite(createdAt) ? createdAt : Date.now() - index
    };
}

export function normalizeTasks(tasks) {
    return Array.isArray(tasks) ? tasks.map(normalizeTask) : [];
}

export function normalizeOverdueAction(value) {

    if (value === "complete") return "archive";

    return OVERDUE_ACTIONS.includes(value) ? value : DEFAULT_PREFS.overdueAction;

}

export function normalizePrefs(value = {}) {
    return {sortBy: normalizeSortBy(value.sortBy), overdueAction: normalizeOverdueAction(value.overdueAction), tagFilter: normalizeTagFilter(value.tagFilter)};
}

export function normalizeDayList(value, min, max, fallback) {

    const list = Array.isArray(value) ? value : fallback;

    const unique = [...new Set(list.map(Number).filter((n) => Number.isInteger(n) && n >= min && n <= max))].sort((a, b) => a - b);

    return unique.length > 0 ? unique : fallback;

}

export function normalizeSchedule(template, index = 0) {

    const createdAt = Number(template?.createdAt);

    const lastTriggered = Number(template?.lastTriggered);

    const frequency = ["daily", "weekly", "monthly"].includes(template?.frequency) ? template.frequency : "weekly";

    const triggerTime =/^\d{2}:\d{2}$/.test(template?.triggerTime || "") ? template.triggerTime : defaultTriggerTime();

    return {
        id: template?.id || `schedule-${index}-${uid()}`, 
        title: typeof template?.title === "string" && template.title.trim() ? template.title.trim() : "Untitled template", 
        tag: normalizeTag(template?.tag), 
        priority: PRIORITY_RANK[template?.priority] === undefined ? "medium" : template.priority, 
        frequency, 
        weekDays: normalizeDayList(template?.weekDays, 0, 6, [1, 3, 5]), 
        monthDays: normalizeDayList(template?.monthDays, 1, 31, [1]), 
        triggerTime, 
        subtasks: normalizeSubtasks(template?.subtasks).map(({title, weight}) => ({title, weight})), 
        isActive: template?.isActive !== false, 
        lastTriggered: Number.isFinite(lastTriggered) ? lastTriggered : null, 
        createdAt: Number.isFinite(createdAt) ? createdAt : Date.now() - index
    };
}

export function normalizeSchedules(schedules) {
    return Array.isArray(schedules) ? schedules.map(normalizeSchedule) : [];
}

export function compareTasks(a, b, sortBy) {

    const order = normalizeSortBy(sortBy);

    const createdA = Number.isFinite(Number(a?.createdAt)) ? Number(a.createdAt) : 0;

    const createdB = Number.isFinite(Number(b?.createdAt)) ? Number(b.createdAt) : 0;

    const fallback = createdB - createdA;

    if (order === "deadline") {

        const deadlineA = typeof a?.deadline === "string" ? a.deadline : "";

        const deadlineB = typeof b?.deadline === "string" ? b.deadline : "";

        if (!deadlineA && !deadlineB) return fallback;

        if (!deadlineA) return 1;

        if (!deadlineB) return -1;

        const cmp = deadlineA.localeCompare(deadlineB);

        return cmp !== 0 ? cmp : fallback;

    }

    if (order === "priority") {

        const diff = (PRIORITY_RANK[a?.priority] ?? 3) - (PRIORITY_RANK[b?.priority] ?? 3);

        return diff !== 0 ? diff : fallback;

    }

    if (order === "tag") {

        const cmp = normalizeTag(a?.tag).localeCompare(normalizeTag(b?.tag));

        return cmp !== 0 ? cmp : fallback;

    }
    return fallback;
}

export function parseClockTime(value, fallbackHour = 23, fallbackMinute = 59) {

    const [rawHour, rawMinute] = (value || "").split(":").map(Number);

    return {hour: Number.isFinite(rawHour) ? rawHour : fallbackHour, minute: Number.isFinite(rawMinute) ? rawMinute : fallbackMinute};

}

export function subtaskStats(subtasks = []) {

    let total = 0;

    let done = 0;

    let weightTotal = 0;

    let weightDone = 0;

    for (const subtask of subtasks) {

        const weight = Number.isFinite(subtask.weight) && subtask.weight > 0 ? subtask.weight : 1;

        total += 1;

        weightTotal += weight;

        if (subtask.done) {

            done += 1;

            weightDone += weight;

        }
    }

    const progress = weightTotal === 0 ? 0 : Math.round((weightDone/ weightTotal) * 100);

    return {total, done, progress, complete: total > 0 && done === total};

}

export function formatTaskDeadline(iso, now = new Date()) {

    if (!iso || typeof iso !== "string") return null;

    const hasTime = iso.includes("T");

    const datePart = hasTime ? iso.slice(0, 10) : iso;

    const deadline = new Date(hasTime ? iso : `${datePart}T23:59:59`);

    if (isNaN(deadline.getTime())) return null;

    const today = localDateStr(now);

    const overdue = deadline.getTime() < now.getTime();

    const startOfToday = new Date(`${today}T00:00:00`);

    const startOfTarget = new Date(`${datePart}T00:00:00`);

    const diffDays = Math.round((startOfTarget - startOfToday)/ 86400000);

    const timeLabel = hasTime ? deadline.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit", hour12: false}) : "";

    if (diffDays === 0) return {label: hasTime ? `Today ${timeLabel}` : "Today", overdue, soon: !overdue, datePart};

    if (diffDays === 1) return {label: hasTime ? `Tomorrow ${timeLabel}` : "Tomorrow", overdue: false, soon: true, datePart};

    if (diffDays === -1) return {label: "Yesterday", overdue: true, soon: false, datePart};

    const dateLabel = deadline.toLocaleDateString(undefined, {month: "short", day: "numeric"});

    if (diffDays < 0) return {label: dateLabel, overdue: true, soon: false, datePart};

    return {label: hasTime && diffDays <= 6 ? `${dateLabel} ${timeLabel}` : dateLabel, overdue: false, soon: diffDays <= 3, datePart};

}

export const MOTION_EASE = "cubic-bezier(0.2, 0, 0, 1)";

export const MOTION_FAST = 200;

export const MOTION_BASE = 225;

export const MOTION_SLOW = 250;

export const RADIUS_SM = 10;

export const RADIUS_MD = 12;

export const RADIUS_LG = 16;

export const HOVER_LIFT = "translateY(-1px)";

export const ACTIVE_SCALE = "scale(0.96)";

export const ACTIVE_SCALE_SOFT = "scale(0.99)";

export const STAGGER_MS = 18;

export const STAGGER_CAP_MS = 144;

export const staggerDelay = (index, step = STAGGER_MS, cap = STAGGER_CAP_MS) => `${Math.min(index * step, cap)}ms`;

export const SPECULAR_HIGHLIGHT = "inset 0 1px 0 rgba(255, 255, 255, 0.25)";

export const SURFACE_SPECULAR = "inset 0 1px 0 rgba(255, 255, 255, 0.70)";

export const SEALER_SHADOW = "0 0 0 0.5px rgba(15, 24, 40, 0.04)";

export const CARD_SHADOW = `${SEALER_SHADOW}, 0 1px 2px rgba(15, 24, 40, 0.035), 0 5px 14px -12px rgba(15, 24, 40, 0.10), ${SURFACE_SPECULAR}`;

export const CARD_SHADOW_HOVER = `${SEALER_SHADOW}, 0 9px 22px -14px rgba(15, 24, 40, 0.16), 0 3px 8px -6px rgba(15, 24, 40, 0.07), ${SURFACE_SPECULAR}`;

export const BUTTON_SHADOW = `${SEALER_SHADOW}, 0 1px 2px rgba(15, 24, 40, 0.05), ${SPECULAR_HIGHLIGHT}`;

export const BUTTON_SHADOW_HOVER = `${SEALER_SHADOW}, 0 6px 14px -8px rgba(31, 111, 235, 0.32), ${SPECULAR_HIGHLIGHT}`;

export const GLASS_BACKDROP_FILTER = "saturate(160%) blur(14px)";

export const GLASS_BG_SOFT = "rgba(255, 255, 255, 0.62)";

export const GLASS_BG = "rgba(255, 255, 255, 0.72)";

export const GLASS_BG_STRONG = "rgba(255, 255, 255, 0.84)";

export const GLASS_BORDER = "rgba(229, 233, 240, 0.90)";

export const GLASS_SHADOW = `${SEALER_SHADOW}, 0 8px 20px -14px rgba(15, 24, 40, 0.14), 0 1px 2px rgba(15, 24, 40, 0.04), ${SURFACE_SPECULAR}`;

export const GLASS_SHADOW_HOVER = `${SEALER_SHADOW}, 0 14px 28px -18px rgba(15, 24, 40, 0.18), 0 4px 10px rgba(15, 24, 40, 0.06), ${SURFACE_SPECULAR}`;

export const GLASS_TONES = {

    neutral: {
        backgroundColor: GLASS_BG_SOFT, 
        hoverBackgroundColor: GLASS_BG_STRONG, 
        borderColor: GLASS_BORDER, 
        hoverBorderColor: "rgba(210, 217, 228, 0.96)", 
        boxShadow: GLASS_SHADOW, 
        hoverBoxShadow: GLASS_SHADOW_HOVER, 
        color: "text.secondary"
    }, 

    primary: {
        backgroundColor: "rgba(31, 111, 235, 0.10)", 
        hoverBackgroundColor: "rgba(31, 111, 235, 0.14)", 
        borderColor: "rgba(31, 111, 235, 0.18)", 
        hoverBorderColor: "rgba(31, 111, 235, 0.24)", 
        boxShadow: `${SEALER_SHADOW}, 0 8px 18px -14px rgba(31, 111, 235, 0.28), 0 1px 2px rgba(31, 111, 235, 0.08), ${SURFACE_SPECULAR}`, 
        hoverBoxShadow: `${SEALER_SHADOW}, 0 14px 24px -18px rgba(31, 111, 235, 0.32), 0 4px 10px rgba(31, 111, 235, 0.10), ${SURFACE_SPECULAR}`, 
        color: "primary.dark"
    }, 

    success: {
        backgroundColor: "rgba(30, 142, 62, 0.10)", 
        hoverBackgroundColor: "rgba(30, 142, 62, 0.14)", 
        borderColor: "rgba(30, 142, 62, 0.18)", 
        hoverBorderColor: "rgba(30, 142, 62, 0.24)", 
        boxShadow: `${SEALER_SHADOW}, 0 8px 18px -14px rgba(30, 142, 62, 0.24), 0 1px 2px rgba(30, 142, 62, 0.08), ${SURFACE_SPECULAR}`, 
        hoverBoxShadow: `${SEALER_SHADOW}, 0 14px 24px -18px rgba(30, 142, 62, 0.28), 0 4px 10px rgba(30, 142, 62, 0.10), ${SURFACE_SPECULAR}`, 
        color: "success.main"
    }, 

    error: {
        backgroundColor: "rgba(217, 48, 37, 0.10)", 
        hoverBackgroundColor: "rgba(217, 48, 37, 0.14)", 
        borderColor: "rgba(217, 48, 37, 0.18)", 
        hoverBorderColor: "rgba(217, 48, 37, 0.24)", 
        boxShadow: `${SEALER_SHADOW}, 0 8px 18px -14px rgba(217, 48, 37, 0.22), 0 1px 2px rgba(217, 48, 37, 0.08), ${SURFACE_SPECULAR}`, 
        hoverBoxShadow: `${SEALER_SHADOW}, 0 14px 24px -18px rgba(217, 48, 37, 0.26), 0 4px 10px rgba(217, 48, 37, 0.10), ${SURFACE_SPECULAR}`, 
        color: "error.main"
    }
};

export function glassSurfaceSx({radius = RADIUS_MD, backgroundColor = GLASS_BG_STRONG, borderColor = GLASS_BORDER, boxShadow = GLASS_SHADOW} = {}) {

    return {
        borderRadius: `${radius}px`, 
        border: "1px solid", 
        borderColor, 
        backgroundColor, 
        backgroundClip: "padding-box", 
        backdropFilter: GLASS_BACKDROP_FILTER, 
        WebkitBackdropFilter: GLASS_BACKDROP_FILTER, 
        boxShadow
    };
}

export const tactileTransition = (props = "transform, box-shadow, background-color, border-color, color", duration = MOTION_BASE) => `${props} ${duration}ms ${MOTION_EASE}`;

export function scheduleBackgroundTask(callback) {

    if (typeof callback !== "function") return null;

    const scheduler = globalThis.scheduler;

    if (scheduler?.postTask) {

        const controller = new AbortController();

        scheduler.postTask(callback, {priority: "background", signal: controller.signal}).catch(() => {});

        return {type: "postTask", controller};

    }

    if (globalThis.requestIdleCallback) {
        return {type: "idle", id: globalThis.requestIdleCallback(callback, {timeout: 300})};
    }
    return {type: "timeout", id: globalThis.setTimeout(callback, 0)};
}

export function cancelBackgroundTask(task) {

    if (!task) return;

    if (task.type === "postTask") {

        task.controller?.abort();

        return;

    }

    if (task.type === "idle" && globalThis.cancelIdleCallback) {

        globalThis.cancelIdleCallback(task.id);

        return;

    }

    if (task.type === "timeout") {
        globalThis.clearTimeout(task.id);
    }
}

export const TACTILE_SX = {
    transition: tactileTransition(), 
    backfaceVisibility: "hidden", 
    backgroundClip: "padding-box", 
    WebkitFontSmoothing: "antialiased", 
    MozOsxFontSmoothing: "grayscale", 
    "&:hover": {transform: HOVER_LIFT}, 
    "&:active": {transform: ACTIVE_SCALE}
};

export const FOCUS_RING_SX = {
    "&:focus-visible": {outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2}
};

export function defaultTriggerTime() {

    const d = new Date();

    d.setHours(d.getHours() + 1, 0, 0, 0);

    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

}

export function defaultDeadline() {

    const d = new Date();

    d.setHours(d.getHours() + 1, 0, 0, 0);

    return `${localDateStr(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

}

export function parseDeadline(s) {

    if (!s || typeof s !== "string") return null;

    const d = s.includes("T") ? new Date(s) : new Date(`${s}T23:59:59`);

    return isNaN(d.getTime()) ? null : d;

}

export function toPickerDate(s) {

    if (!s || typeof s !== "string") return null;

    const d = new Date(s.includes("T") ? s : `${s}T00:00:00`);

    return isNaN(d.getTime()) ? null : d;

}

export function fromPickerDate(d) {

    if (!d || isNaN(d.getTime())) return "";

    return `${localDateStr(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

}

export function timeToDate(hhmm) {

    if (!hhmm || typeof hhmm !== "string") return null;

    const [h, m] = hhmm.split(":").map(Number);

    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;

    const d = new Date();

    d.setHours(h, m, 0, 0);

    return d;

}

export function dateToTime(d) {

    if (!d || isNaN(d.getTime())) return "";

    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

}

export function toggleDayInList(list, day) {

    const safeList = Array.isArray(list) ? list : [];

    const next = safeList.includes(day) ? safeList.filter((d) => d !== day) : [...safeList, day].sort((a, b) => a - b);

    return next.length > 0 ? next : [day];

}

export function toCols(items, numCols) {

    const cols = Array.from({length: Math.max(1, numCols)}, () => []);

    const safeItems = Array.isArray(items) ? items : [];

    safeItems.forEach((item, i) => cols[i % cols.length].push(item));

    return cols;

}

export const PRIMARY_HOVER = "rgba(31, 111, 235, 0.08)";

export const PRIMARY_PRESSED = "rgba(31, 111, 235, 0.12)";

export const PRIMARY_FOCUS = "rgba(31, 111, 235, 0.12)";

export const SURFACE_HOVER = "rgba(15, 24, 40, 0.04)";

export const SURFACE_PRESSED = "rgba(15, 24, 40, 0.08)";

export const ERROR_HOVER = "rgba(217, 48, 37, 0.08)";

export const PRIORITY_OPTIONS = [
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

export const PRIORITY_META = {
    high: {label: "High", color: "#D93025", soft: "rgba(217, 48, 37, 0.10)", bg: "#FCE8E6"}, 
    medium: {label: "Medium", color: "#E8710A", soft: "rgba(232, 113, 10, 0.10)", bg: "#FEF3E8"}, 
    low: {label: "Low", color: "#1E8E3E", soft: "rgba(30, 142, 62, 0.10)", bg: "#E6F4EA"}
};

export const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function priorityToggleSx(p) {

    return {

        flex: 1, 

        py: 0.85, 

        fontWeight: 600, 

        borderRadius: `${RADIUS_MD}px !important`, 

        backgroundClip: "padding-box", 

        border: "1px solid !important", 

        borderColor: "rgba(0, 0, 0, 0.06) !important", 

        boxShadow: `${SEALER_SHADOW}, ${SURFACE_SPECULAR}`, 

        transition: `transform ${MOTION_FAST}ms ${MOTION_EASE}, background-color ${MOTION_FAST}ms ${MOTION_EASE}, box-shadow ${MOTION_FAST}ms ${MOTION_EASE}, color ${MOTION_FAST}ms ${MOTION_EASE}, border-color ${MOTION_FAST}ms ${MOTION_EASE}`, 

        ...TACTILE_SX, 

        "&:hover": {
            bgcolor: `${p.color}0F`, 
            transform: HOVER_LIFT, 
            boxShadow: `0 4px 12px -2px rgba(15, 24, 40, 0.08), ${SURFACE_SPECULAR}`
        }, 

        "&:active": {transform: ACTIVE_SCALE}, 

        "&.Mui-selected": {
            zIndex: 1, 
            bgcolor: `${p.color}14`, 
            color: p.color, 
            borderColor: `${p.color} !important`, 
            boxShadow: `${SEALER_SHADOW}, 0 4px 12px -4px ${p.color}50, ${SURFACE_SPECULAR}`, 
            "&:hover": {bgcolor: `${p.color}1F`, transform: HOVER_LIFT}, 
            "&:active": {transform: ACTIVE_SCALE}
        }
    };
}

export const LABEL_SX = {
    fontFamily: '"JetBrains Mono", monospace', 
    color: "text.secondary", 
    fontWeight: 500, 
    letterSpacing: "0.10em", 
    fontSize: 10, 
    textTransform: "uppercase"
};

export const MONO_SX = {fontFamily: '"JetBrains Mono", monospace'};

export const SCROLL_HIDE_SX = {
    "&::-webkit-scrollbar": {display: "none"}, 
    scrollbarWidth: "none", 
    msOverflowStyle: "none"
};

export const DELETE_ICON_SX = {
    color: "text.secondary", 
    "&:hover": {bgcolor: ERROR_HOVER, color: "error.main"}, 
    "&:active": {bgcolor: "rgba(217, 48, 37, 0.12)"}
};

export const SUBTASK_INPUT_SX = {"& .MuiOutlinedInput-root": {fontSize: "0.85rem"}};

export const SUBTASK_ADD_BTN_SX = {fontSize: "0.8rem", px: 1.5};

export const SUBTASK_ITEM_SX = {

    display: "flex", 

    alignItems: "center", 

    minHeight: 36, 

    px: 1.25, 

    py: 0.4, 

    ...glassSurfaceSx({radius: RADIUS_SM, backgroundColor: GLASS_BG, boxShadow: GLASS_SHADOW}), 

    ...TACTILE_SX, 

    transition: tactileTransition("transform, border-color, background-color, box-shadow"), 

    "&:hover": {
        backgroundColor: GLASS_BG_STRONG, 
        borderColor: GLASS_TONES.primary.borderColor, 
        boxShadow: GLASS_SHADOW_HOVER, 
        transform: HOVER_LIFT
    }, 

    "&:active": {transform: ACTIVE_SCALE_SOFT}

};

export function dayButtonSx(selected) {

    const tone = selected ? GLASS_TONES.primary : GLASS_TONES.neutral;

    return {

        height: 32, 

        minWidth: 38, 

        px: 1, 

        display: "inline-flex", 

        alignItems: "center", 

        justifyContent: "center", 

        cursor: "pointer", 

        ...glassSurfaceSx({
            radius: RADIUS_MD, 
            backgroundColor: tone.backgroundColor, 
            borderColor: tone.borderColor, 
            boxShadow: tone.boxShadow
        }), 

        color: tone.color, 

        fontFamily: '"JetBrains Mono", monospace', 

        fontWeight: selected ? 600 : 500, 

        fontSize: 11.5, 

        letterSpacing: "0.02em", 

        userSelect: "none", 

        WebkitFontSmoothing: "antialiased", 

        backfaceVisibility: "hidden", 

        transition: `transform ${MOTION_FAST}ms ${MOTION_EASE}, background-color ${MOTION_FAST}ms ${MOTION_EASE}, box-shadow ${MOTION_FAST}ms ${MOTION_EASE}, color ${MOTION_FAST}ms ${MOTION_EASE}, border-color ${MOTION_FAST}ms ${MOTION_EASE}`, 

        zIndex: selected ? 1 : 0, 

        "&:hover": {
            backgroundColor: tone.hoverBackgroundColor, 
            borderColor: tone.hoverBorderColor, 
            boxShadow: tone.hoverBoxShadow, 
            transform: HOVER_LIFT
        }, 

        "&:active": {transform: ACTIVE_SCALE}, 

        ...FOCUS_RING_SX

    };
}

export const PICKER_SLOT_PROPS = {

    actionBar: {actions: ["accept"]}, 

    popper: {sx: {zIndex: 1500}}, 

    desktopPaper: {

        sx: {
            borderRadius: `${RADIUS_LG}px`, 
            border: "1px solid #E5E9F0", 
            backgroundClip: "padding-box", 
            boxShadow: `${SEALER_SHADOW}, 0 20px 48px -12px rgba(15, 24, 40, 0.22), 0 8px 18px -8px rgba(15, 24, 40, 0.10), ${SURFACE_SPECULAR}`, 
            overflow: "hidden", 
            "& .MuiPickersLayout-contentWrapper": {pt: 1, pb: 1}, 
            "& .MuiTimeClock-root": {mt: 1, mb: 1.5}, 
            "& .MuiMultiSectionDigitalClock-root": {my: 0.5}, 
            "& .MuiDateCalendar-root": {mt: 0.5}
        }
    }, 

    mobilePaper: {

        sx: {
            borderRadius: `${RADIUS_LG}px`, 
            border: "1px solid #E5E9F0", 
            backgroundClip: "padding-box", 
            boxShadow: `${SEALER_SHADOW}, ${SURFACE_SPECULAR}`, 
            "& .MuiTimeClock-root": {my: 1.5}
        }
    }
};
