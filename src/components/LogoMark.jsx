
import {Box, Typography} from "@mui/material";

/* ── Brand mark ─────────────────────────────────────────
   The canonical TaskFlow brand element. Centralizing the
   gradient square + checkmark glyph here means the brand
   evolves in one place rather than drifting between the
   sidebar, the landing hero, and any future surface
   (auth screens, error states, share images) that needs
   to look like TaskFlow.

   Props
   ─────
   • size          glyph edge length in px
   • withWordmark  render the "TaskFlow" wordmark inline
   • wordmarkText  override the wordmark string
   • legend        small mono caption under the wordmark
                   (e.g. "v 1.0", "Local-first")
   • interactive   add a subtle hover lift; suitable for
                   clickable home-link contexts
   • sx            forwarded to the outer container        */

export default function LogoMark({size = 40, withWordmark = false, wordmarkText = "TaskFlow", legend, interactive = false, sx}) {
    const r = size * 0.28;

    const mark = (
        <Box className="tf-logo-glyph" sx={{width: size, height: size, borderRadius: `${r}px`, background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 55%, #6FA0FB 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 0 rgba(255,255,255,0.20) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, 0 4px 14px rgba(31,111,235,0.28)", position: "relative", overflow: "hidden", transition: "transform 0.22s ease, box-shadow 0.22s ease"}}>
            <Box aria-hidden sx={{position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)", pointerEvents: "none"}} />
            <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" style={{position: "relative", zIndex: 1}}>
                <path d="M4.5 12.5L9.75 17.75L19.5 7.25" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))"}} />
            </svg>
        </Box>
    );

    const interactiveSx = interactive ? {cursor: "pointer", "&:hover .tf-logo-glyph": {transform: "translateY(-1px)", boxShadow: "0 1px 0 rgba(255,255,255,0.20) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, 0 8px 20px rgba(31,111,235,0.36)"}} : {};

    if (!withWordmark) {
        return <Box sx={{display: "inline-flex", ...interactiveSx, ...sx}}>{mark}</Box>;
    }

    return (
        <Box sx={{display: "inline-flex", alignItems: "center", gap: 1.25, minWidth: 0, ...interactiveSx, ...sx}}>
            {mark}
            <Box sx={{display: "flex", flexDirection: "column", lineHeight: 1, minWidth: 0}}>
                <Typography component="span" sx={{fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.022em", color: "text.primary", whiteSpace: "nowrap"}}>
                    {wordmarkText}
                </Typography>
                {legend && (
                    <Typography component="span" sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, fontWeight: 500, letterSpacing: "0.16em", color: "text.secondary", textTransform: "uppercase", mt: 0.4, whiteSpace: "nowrap"}}>
                        {legend}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
