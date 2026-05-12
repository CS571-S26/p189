
import {useMemo, useRef, useEffect, useLayoutEffect, useCallback} from "react";
import {Box, Chip, Stack, Typography, Fade} from "@mui/material";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CloseIcon from "@mui/icons-material/Close";

import {RADIUS_MD, MOTION_FAST, MOTION_EASE, PRIMARY_HOVER, tactileTransition, FOCUS_RING_SX, MONO_SX, SCROLL_HIDE_SX, normalizeTag, normalizeTagFilter, GLASS_TONES, glassSurfaceSx} from "../javascripts/shared";

const FADE_PX = 64;

export function tagChipSx(selected) {

    const tone = selected ? GLASS_TONES.primary : GLASS_TONES.neutral;

    return {
        height: 30, 
        px: 0, 
        minWidth: "auto", 
        display: "inline-flex", 
        alignItems: "center", 
        justifyContent: "center", 
        cursor: "pointer", 
        ...glassSurfaceSx({radius: RADIUS_MD, backgroundColor: tone.backgroundColor, borderColor: tone.borderColor, boxShadow: tone.boxShadow}), 
        color: tone.color, 
        fontFamily: '"JetBrains Mono", monospace', 
        fontWeight: selected ? 700 : 600, 
        fontSize: 11.5, 
        letterSpacing: "0.01em", 
        userSelect: "none", 
        "& .MuiChip-label": {px: 1.15}, 
        WebkitFontSmoothing: "antialiased", 
        backfaceVisibility: "hidden", 
        transition: `transform ${MOTION_FAST}ms ${MOTION_EASE}, background-color ${MOTION_FAST}ms ${MOTION_EASE}, box-shadow ${MOTION_FAST}ms ${MOTION_EASE}, color ${MOTION_FAST}ms ${MOTION_EASE}, border-color ${MOTION_FAST}ms ${MOTION_EASE}`, 
        zIndex: selected ? 1 : 0, 
        "&:hover": {backgroundColor: tone.hoverBackgroundColor, borderColor: tone.hoverBorderColor, boxShadow: tone.hoverBoxShadow, transform: "translateY(-1px)"}, 
        "&:active": {transform: "scale(0.96)"}, 
        ...FOCUS_RING_SX
    };
}

const CLEAR_BTN_SX = {
    color: "primary.main", 
    bgcolor: "transparent", 
    border: "1px solid transparent", 
    ...MONO_SX, 
    fontSize: 10, 
    fontWeight: 600, 
    letterSpacing: "0.10em", 
    textTransform: "uppercase", 
    px: 1, 
    py: 0.5, 
    borderRadius: 999, 
    transition: tactileTransition("transform, background-color, border-color", 200), 
    "&:hover": {bgcolor: PRIMARY_HOVER, borderColor: "rgba(31, 111, 235, 0.18)", transform: "translateY(-1px)"}, 
    "&:active": {transform: "scale(0.96)"}, 
    "&:focus-visible": {outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1}
};

const FILTER_LABEL_SHELL_SX = {display: {xs: "none", sm: "inline-flex"}, alignItems: "center", gap: 0.6, color: "text.secondary", flexShrink: 0};

const FILTER_LABEL_SX = {...MONO_SX, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em"};

const SCROLL_BOX_SX = {
    flex: 1, 
    minWidth: 0, 
    overflowX: "auto", 
    overflowY: "visible", 
    overscrollBehaviorX: "contain", 
    overscrollBehaviorY: "none", 
    touchAction: "pan-x", 
    WebkitOverflowScrolling: "touch", 
    ...SCROLL_HIDE_SX, 
    cursor: {xs: "auto", md: "grab"}, 
    userSelect: "none"
};

const STACK_SX = {alignItems: "center", flexWrap: "nowrap", width: "max-content", px: "3px", py: "3px"};

export default function TagManager({tasks = [], activeTag, onChange}) {

    const scrollRef = useRef(null);

    const isDraggingRef = useRef(false);

    const hasDraggedRef = useRef(false);

    const dragRef = useRef({x: 0, left: 0});

    const tagCounts = useMemo(() => {

        const map = new Map();

        const safeTasks = Array.isArray(tasks) ? tasks : [];

        for (const t of safeTasks) {

            const tag = normalizeTag(t?.tag);

            map.set(tag, (map.get(tag) || 0) + 1);

        }

        return Array.from(map.entries()).sort((a, b) => {

            if (a[0] === "Default") return 1;

            if (b[0] === "Default") return -1;

            return a[0].localeCompare(b[0]);

        });
    }, [tasks]);

    const updateMasks = useCallback(() => {

        const el = scrollRef.current;

        if (!el) return;

        const {scrollLeft, scrollWidth, clientWidth} = el;

        const maxScroll = scrollWidth - clientWidth;

        const atStart = scrollLeft <= 4;

        const atEnd = maxScroll <= 4 || scrollLeft >= maxScroll - 4;

        let mask;

        if (atStart && atEnd) {
            mask = "none";
        } else if (atStart) {
            mask = `linear-gradient(to right, black 0px, black calc(100% - ${FADE_PX}px), transparent 100%)`;
        } else if (atEnd) {
            mask = `linear-gradient(to right, transparent 0px, black ${FADE_PX}px, black 100%)`;
        } else {
            mask = `linear-gradient(to right, transparent 0px, black ${FADE_PX}px, black calc(100% - ${FADE_PX}px), transparent 100%)`;
        }

        el.style.webkitMaskImage = mask;

        el.style.maskImage = mask;

    }, []);

    useLayoutEffect(() => {
        updateMasks();
    }, [tagCounts, activeTag, updateMasks]);

    useEffect(() => {

        const el = scrollRef.current;

        if (!el || typeof ResizeObserver === "undefined") return undefined;

        const observer = new ResizeObserver(updateMasks);

        observer.observe(el);

        return () => observer.disconnect();

    }, [updateMasks]);

    useEffect(() => {

        const el = scrollRef.current;

        if (!el) return undefined;

        const onWheel = (e) => {

            const maxScroll = el.scrollWidth - el.clientWidth;

            if (maxScroll <= 0) return;

            const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

            if (dominantDelta === 0) return;

            const nextLeft = Math.max(0, Math.min(maxScroll, el.scrollLeft + dominantDelta));

            if (nextLeft === el.scrollLeft) return;

            e.preventDefault();

            el.scrollLeft = nextLeft;

            requestAnimationFrame(updateMasks);

        };

        el.addEventListener("wheel", onWheel, {passive: false});

        return () => el.removeEventListener("wheel", onWheel);

    }, [updateMasks]);

    useEffect(() => {

        const onMove = (e) => {

            if (!isDraggingRef.current) return;

            const dx = e.clientX - dragRef.current.x;

            if (Math.abs(dx) > 8) hasDraggedRef.current = true;

            if (scrollRef.current) {

                scrollRef.current.scrollLeft = dragRef.current.left - dx;

                updateMasks();

            }
        };

        const onUp = () => {

            if (!isDraggingRef.current) return;

            isDraggingRef.current = false;

            if (scrollRef.current) scrollRef.current.style.cursor = "grab";

            window.setTimeout(() => {
                hasDraggedRef.current = false;
            }, 0);
        };

        window.addEventListener("mousemove", onMove);

        window.addEventListener("mouseup", onUp);

        return () => {

            window.removeEventListener("mousemove", onMove);

            window.removeEventListener("mouseup", onUp);

        };
    }, [updateMasks]);

    const onMouseDown = useCallback((e) => {

        if (e.button !== 0 || !scrollRef.current) return;

        isDraggingRef.current = true;

        hasDraggedRef.current = false;

        dragRef.current = {x: e.clientX, left: scrollRef.current.scrollLeft};

        scrollRef.current.style.cursor = "grabbing";

    }, []);

    const onClickCapture = useCallback((e) => {

        if (hasDraggedRef.current) {

            hasDraggedRef.current = false;

            e.stopPropagation();

        }
    }, []);

    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const selectedTag = normalizeTagFilter(activeTag);

    if (tagCounts.length <= 1 && !selectedTag) return null;

    const announcement = selectedTag ? `Filtered by ${selectedTag}: ${tagCounts.find(([t]) => t === selectedTag)?.[1] || 0} of ${safeTasks.length} tasks` : `Showing all ${safeTasks.length} tasks`;

    return (
        <div className="flex-1 min-w-0 flex items-center gap-2">
            <Box sx={FILTER_LABEL_SHELL_SX}>
                <LabelOutlinedIcon sx={{fontSize: 14}}/>
                <Typography className="uppercase" sx={FILTER_LABEL_SX}>
                    {"Filter"}
                </Typography>
            </Box>
            <Box ref={scrollRef} onMouseDown={onMouseDown} onClickCapture={onClickCapture} onScroll={updateMasks} sx={SCROLL_BOX_SX}>
                <Stack direction="row" spacing={0.75} sx={STACK_SX}>
                    <Chip label={`All · ${safeTasks.length}`} size="small" onClick={() => onChange(null)} aria-label="Show all tags" aria-pressed={selectedTag === null} sx={tagChipSx(selectedTag === null)}/>
                    {tagCounts.map(([tag, count]) => (
                        <Chip key={tag} label={`${tag} · ${count}`} size="small" onClick={() => onChange(selectedTag === tag ? null : tag)} aria-label={`Filter by tag ${tag}`} aria-pressed={selectedTag === tag} sx={tagChipSx(selectedTag === tag)}/>
                    ))}
                </Stack>
            </Box>
            <Fade in={Boolean(selectedTag)} unmountOnExit>
                <Box component="button" type="button" onClick={() => onChange(null)} aria-label="Clear tag filter" className="shrink-0 inline-flex items-center gap-1 cursor-pointer" sx={CLEAR_BTN_SX}>
                    <CloseIcon sx={{fontSize: 12}}/>
                    {"Clear"}
                </Box>
            </Fade>
            <span aria-live="polite" className="sr-only">
                {announcement}
            </span>
        </div>
    );
}

