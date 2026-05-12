
import {Box, Typography} from "@mui/material";

import {MONO_SX, SEALER_SHADOW, SPECULAR_HIGHLIGHT, MOTION_EASE} from "../javascripts/shared";

const GLYPH_SHADOW = `${SEALER_SHADOW}, ${SPECULAR_HIGHLIGHT}, inset 0 -1px 0 rgba(0, 0, 0, 0.08), 0 4px 14px rgba(31, 111, 235, 0.28)`;

const GLYPH_SHADOW_HOVER = `${SEALER_SHADOW}, ${SPECULAR_HIGHLIGHT}, inset 0 -1px 0 rgba(0, 0, 0, 0.08), 0 8px 20px rgba(31, 111, 235, 0.36)`;

export default function LogoMark({size = 40, withWordmark = false, wordmarkText = "TaskFlow", legend, interactive = false, sx}) {

    const r = size * 0.28;

    const mark = (
        <Box className="tf-logo-glyph relative inline-flex items-center justify-center shrink-0 overflow-hidden" sx={{width: size, height: size, borderRadius: `${r}px`, background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 55%, #6FA0FB 100%)", boxShadow: GLYPH_SHADOW, transition: `transform 225ms ${MOTION_EASE}, box-shadow 225ms ${MOTION_EASE}`, backfaceVisibility: "hidden", backgroundClip: "padding-box"}}>
            <span aria-hidden className="absolute top-0 left-0 right-0 pointer-events-none" style={{height: "50%", background: "linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, transparent 100%)"}}/>
            <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" className="relative z-[1]">
                <path d="M4.5 12.5L9.75 17.75L19.5 7.25" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18))"}}/>
            </svg>
        </Box>
    );

    const interactiveSx = interactive ? {cursor: "pointer", "&:hover .tf-logo-glyph": {transform: "translateY(-1px)", boxShadow: GLYPH_SHADOW_HOVER}, "&:active .tf-logo-glyph": {transform: "scale(0.96)"}} : {};

    if (!withWordmark) {
        return (
            <Box className="inline-flex" sx={{...interactiveSx, ...sx}}>
                {mark}
            </Box>
        );
    }

    return (
        <Box className="inline-flex items-center gap-2.5 min-w-0" sx={{...interactiveSx, ...sx}}>
            {mark}
            <span className="flex flex-col leading-none min-w-0">
                <Typography component="span" className="whitespace-nowrap" sx={{fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.022em", color: "text.primary"}}>
                    {wordmarkText}
                </Typography>
                {legend && (
                    <Typography component="span" className="whitespace-nowrap uppercase" sx={{...MONO_SX, fontSize: 9.5, fontWeight: 500, letterSpacing: "0.16em", color: "text.secondary", mt: 0.4}}>
                        {legend}
                    </Typography>
                )}
            </span>
        </Box>
    );
}
