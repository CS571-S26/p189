
import {useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Typography, Stack, Chip, Fade, Grow} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoMark from "../components/LogoMark";

const FEATURES = [
    {icon: <PushPinIcon />, color: "#1F6FEB", bg: "#DDE9FF", title: "Smart Pinning", desc: "Important tasks always float to the top, regardless of sort order or filters applied."},
    {icon: <FlagOutlinedIcon />, color: "#E8710A", bg: "#FEF3E8", title: "Tags & Priorities", desc: "Custom tags and three-tier priority levels keep every task in clear, sortable context."},
    {icon: <EventOutlinedIcon />, color: "#D93025", bg: "#FCE8E6", title: "Deadlines & Overdue", desc: "Visual due-date indicators with configurable overdue behavior — archive or auto-delete."},
    {icon: <ChecklistIcon />, color: "#1E8E3E", bg: "#E6F4EA", title: "Weighted Subtasks", desc: "Break tasks into weighted subtasks with progress that rolls up into a live completion bar."},
    {icon: <EventRepeatOutlinedIcon />, color: "#7C5CFA", bg: "#EEE8FE", title: "Recurring Schedule", desc: "Define daily, weekly, or monthly templates that auto-create tasks on the days you choose."},
    {icon: <CloudOffOutlinedIcon />, color: "#5A6B82", bg: "#EEF1F6", title: "Local-First", desc: "Runs entirely in your browser — no server, no signup, instant load, fully private."}
];

/* ── Hero preview card ─────────────────────────────── */

function PreviewCard({delay = 0, priority, title, tag, deadline, sub, pinned, rotate, top, left, right, scale = 1}) {
    const colors = {high: "#D93025", medium: "#E8710A", low: "#1E8E3E"};

    const c = colors[priority];

    return (
        <Grow in timeout={900} style={{transitionDelay: `${delay}ms`}}>
            <Box sx={{position: "absolute", top, left, right, width: 268, transform: `rotate(${rotate}deg) scale(${scale})`, transformOrigin: "center center", bgcolor: "#FFFFFF", borderRadius: "18px", border: "1px solid #ECEFF4", boxShadow: "0 18px 40px -16px rgba(15,24,40,0.20), 0 4px 12px -4px rgba(15,24,40,0.06)", overflow: "hidden"}}>
                {pinned && (
                    <Box sx={{position: "absolute", top: 11, right: 11, width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(31,111,235,0.32)", zIndex: 1}}>
                        <PushPinIcon sx={{fontSize: 11, color: "#fff"}} />
                    </Box>
                )}
                <Box sx={{p: 2, pl: 2.25, position: "relative"}}>
                    <Box aria-hidden sx={{position: "absolute", left: 6, top: 8, bottom: 8, width: 4, borderRadius: 999, bgcolor: c}} />
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1.1, pr: pinned ? 3 : 0}}>
                        <Stack direction="row" alignItems="center" spacing={0.85}>
                            <Box sx={{width: 7, height: 7, borderRadius: "50%", bgcolor: c, boxShadow: `0 0 0 3px ${c}1A`}} />
                            <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: c, fontWeight: 600, letterSpacing: "0.10em", fontSize: 9.5, textTransform: "uppercase"}}>{priority}</Typography>
                        </Stack>
                        {deadline && (
                            <Box sx={{display: "inline-flex", alignItems: "center", gap: 0.4, px: 0.85, py: 0.25, borderRadius: 999, bgcolor: deadline === "Overdue" ? "#FCE8E6" : "rgba(31,111,235,0.08)", color: deadline === "Overdue" ? "#D93025" : "primary.dark"}}>
                                <EventOutlinedIcon sx={{fontSize: 11}} />
                                <Typography sx={{fontSize: 10, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace'}}>{deadline}</Typography>
                            </Box>
                        )}
                    </Stack>
                    <Typography sx={{fontWeight: 600, fontSize: "0.92rem", lineHeight: 1.35, letterSpacing: "-0.012em", mb: 1.1, color: "text.primary"}}>{title}</Typography>
                    <Stack direction="row" spacing={0.6} alignItems="center">
                        <Box sx={{height: 22, px: 1, borderRadius: 999, border: "1px solid #ECEFF4", bgcolor: "rgba(15,24,40,0.025)", display: "inline-flex", alignItems: "center"}}>
                            <Typography sx={{fontSize: 10.5, fontWeight: 500, color: "text.secondary"}}>{tag}</Typography>
                        </Box>
                        {sub && (
                            <Box sx={{height: 22, px: 1, borderRadius: 999, bgcolor: "rgba(15,24,40,0.05)", display: "inline-flex", alignItems: "center", gap: 0.4}}>
                                <ChecklistIcon sx={{fontSize: 12, color: "text.secondary"}} />
                                <Typography sx={{fontSize: 10.5, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: "text.secondary"}}>{sub}</Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>
                <Box sx={{borderTop: "1px solid #ECEFF4", height: 32, bgcolor: "rgba(15,24,40,0.012)"}} />
            </Box>
        </Grow>
    );
}

export default function LandingPage({onLogin, isLoggedIn}) {
    const navigate = useNavigate();

    const pendingNav = useRef(false);

    /* Navigate after login state commits (fixes React batching race) */

    useEffect(() => {
        if (isLoggedIn && pendingNav.current) {
            pendingNav.current = false;

            navigate("/dashboard");
        }
    }, [isLoggedIn, navigate]);

    const handleEnter = () => {
        if (isLoggedIn) {
            navigate("/dashboard");
        } else {
            pendingNav.current = true;

            onLogin();
        }
    };

    return (
        <Box sx={{minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#F6F8FB", overflow: "hidden", position: "relative"}}>
            {/* Ambient gradient orbs */}
            <Box aria-hidden sx={{position: "absolute", top: -180, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,111,235,0.18) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(8px)"}} />
            <Box aria-hidden sx={{position: "absolute", top: 320, right: -160, width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,250,0.14) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(8px)"}} />

            {/* Dot grid */}
            <Box aria-hidden sx={{position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle, rgba(15,24,40,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)"}} />

            {/* Top brand bar */}
            <Box sx={{position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, width: "100%", mx: "auto", px: {xs: 3, sm: 4}, pt: {xs: 3, sm: 4}}}>
                <Stack direction="row" alignItems="center" spacing={1.4}>
                    <LogoMark size={32} withWordmark />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{display: {xs: "none", sm: "flex"}, alignItems: "center", gap: 0.8, color: "text.secondary"}}>
                        <Box sx={{width: 7, height: 7, borderRadius: "50%", bgcolor: "success.main", boxShadow: "0 0 0 3px rgba(30,142,62,0.18)"}} />
                        <Typography sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase"}}>Local · v 1.0</Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Hero */}
            <Box sx={{position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: {xs: "1fr", md: "1.05fr 0.95fr"}, alignItems: "center", maxWidth: 1200, width: "100%", mx: "auto", px: {xs: 3, sm: 4}, pt: {xs: 6, sm: 8, md: 10}, pb: {xs: 10, md: 14}, gap: {xs: 6, md: 4}}}>
                <Fade in timeout={700}>
                    <Box>
                        <Stack direction="row" spacing={1} sx={{mb: 3, flexWrap: "wrap", rowGap: 1}}>
                            <Chip label="No backend" size="small" variant="outlined" sx={{borderColor: "divider", color: "text.secondary", fontSize: 11.5, fontWeight: 600, bgcolor: "rgba(255,255,255,0.82)"}} />
                            <Chip label="No signup" size="small" variant="outlined" sx={{borderColor: "divider", color: "text.secondary", fontSize: 11.5, fontWeight: 600, bgcolor: "rgba(255,255,255,0.82)"}} />
                            <Chip label="Just tasks" size="small" variant="outlined" sx={{borderColor: "divider", color: "text.secondary", fontSize: 11.5, fontWeight: 600, bgcolor: "rgba(255,255,255,0.82)"}} />
                        </Stack>

                        <Typography component="h1" sx={{fontSize: {xs: "2.6rem", sm: "3.2rem", md: "3.9rem"}, fontWeight: 800, letterSpacing: "-0.038em", color: "text.primary", lineHeight: 1.04, mb: 2.5}}>
                            Pin what matters.
                            <Box component="span" sx={{display: "block", background: "linear-gradient(120deg, #1F6FEB 0%, #4F8AF7 50%, #7C5CFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>
                                Flow through the rest.
                            </Box>
                        </Typography>

                        <Typography sx={{fontSize: {xs: "1.02rem", sm: "1.12rem"}, color: "text.secondary", fontWeight: 400, maxWidth: 480, lineHeight: 1.65, mb: 4}}>A local-first task workspace with weighted subtasks, recurring templates, and pin-to-top focus. No accounts. No tracking. Just your work.</Typography>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} alignItems={{xs: "stretch", sm: "center"}}>
                            <Button variant="contained" size="large" onClick={handleEnter} disableElevation endIcon={<ArrowForwardIcon sx={{fontSize: 18}} />} aria-label={isLoggedIn ? "Go to dashboard" : "Get started with TaskFlow"} sx={{px: 3.5, py: 1.4, fontSize: "0.97rem", fontWeight: 600, borderRadius: 999, boxShadow: "0 6px 18px -4px rgba(31,111,235,0.45)", "&:hover": {boxShadow: "0 10px 28px -4px rgba(31,111,235,0.55)"}}}>
                                {isLoggedIn ? "Open Dashboard" : "Get Started"}
                            </Button>
                            <Box sx={{display: "inline-flex", alignItems: "center", gap: 1, color: "text.secondary", px: {xs: 0, sm: 1}}}>
                                <Box sx={{display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", bgcolor: "rgba(31,111,235,0.10)", color: "primary.main"}}>
                                    <Typography sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700}}>↵</Typography>
                                </Box>
                                <Typography sx={{fontSize: 12.5, fontWeight: 500}}>Press Enter on any input to save instantly</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Fade>

                {/* Floating preview cards */}
                <Box sx={{position: "relative", display: {xs: "none", md: "block"}, height: 460}}>
                    <PreviewCard delay={250} priority="high" title="Hello World?" tag="Life" deadline="Today" pinned rotate={-3} top={20} left={20} scale={1} />
                    <PreviewCard delay={420} priority="medium" title="TaskFlow" tag="Project" sub="1/2" rotate={2.5} top={170} left={100} scale={0.96} />
                    <PreviewCard delay={590} priority="low" title="An Open Task?" tag="Default" pinned rotate={-1.5} top={310} left={40} scale={0.92} />
                </Box>
            </Box>

            {/* Section divider */}
            <Box sx={{position: "relative", zIndex: 1, maxWidth: 1080, width: "100%", mx: "auto", px: 3}}>
                <Box sx={{height: 1, bgcolor: "divider"}} />
            </Box>

            {/* Features */}
            <Fade in timeout={1000}>
                <Box sx={{position: "relative", zIndex: 1, maxWidth: 1100, width: "100%", mx: "auto", px: 3, pt: {xs: 8, sm: 10}, pb: {xs: 8, sm: 12}}}>
                    <Box sx={{textAlign: "center", mb: {xs: 5, sm: 7}}}>
                        <Typography sx={{fontFamily: '"JetBrains Mono", monospace', color: "primary.main", fontWeight: 600, letterSpacing: "0.16em", fontSize: 11, textTransform: "uppercase", mb: 1.5}}>◆ What's inside</Typography>
                        <Typography sx={{fontSize: {xs: "1.65rem", sm: "2.05rem"}, fontWeight: 700, letterSpacing: "-0.026em", color: "text.primary", lineHeight: 1.2}}>
                            Everything you need.
                            <Box component="span" sx={{color: "text.secondary", fontWeight: 400}}>
                                {" "}
                                Nothing you don't.
                            </Box>
                        </Typography>
                    </Box>

                    <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)"}, gap: {xs: 2, sm: 2.5}}}>
                        {FEATURES.map((f, i) => (
                            <Grow in key={f.title} timeout={600 + i * 80}>
                                <Box sx={{position: "relative", p: {xs: 2.75, sm: 3.25}, borderRadius: "18px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", overflow: "hidden", transition: "border-color 0.28s, box-shadow 0.28s, transform 0.28s", "&:hover": {borderColor: f.color, transform: "translateY(-3px)", boxShadow: `0 14px 32px -10px ${f.color}28, 0 4px 12px -6px ${f.color}18`}, "&:hover .feat-icon": {transform: "scale(1.06)"}}}>
                                    <Box sx={{position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${f.bg} 0%, transparent 70%)`, opacity: 0.6, pointerEvents: "none", transform: "translate(30%, -30%)"}} />
                                    <Box className="feat-icon" sx={{position: "relative", width: 48, height: 48, borderRadius: "12px", bgcolor: f.bg, display: "flex", alignItems: "center", justifyContent: "center", mb: 2.25, color: f.color, transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", "& .MuiSvgIcon-root": {fontSize: 24}}}>
                                        {f.icon}
                                    </Box>
                                    <Typography sx={{fontWeight: 700, mb: 0.85, fontSize: "1rem", letterSpacing: "-0.014em"}}>{f.title}</Typography>
                                    <Typography sx={{color: "text.secondary", lineHeight: 1.65, fontSize: "0.86rem"}}>{f.desc}</Typography>
                                </Box>
                            </Grow>
                        ))}
                    </Box>
                </Box>
            </Fade>

            {/* Footer */}
            <Box sx={{position: "relative", zIndex: 1, textAlign: "center", pb: 4, color: "text.secondary"}}>
                <Typography sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", opacity: 0.6}}>Built with React · Material UI · runs locally</Typography>
            </Box>
        </Box>
    );
}
