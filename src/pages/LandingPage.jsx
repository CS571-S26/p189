
import {useNavigate} from "react-router-dom";
import {Box, Button, CardContent, Typography, Stack, Chip, Fade} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import LogoMark from "../components/LogoMark";

import {MONO_SX, SEALER_SHADOW, SPECULAR_HIGHLIGHT, CARD_SHADOW, CARD_SHADOW_HOVER, tactileTransition} from "../javascripts/shared";

const FEATURES = [
    {icon: <PushPinIcon/>, color: "#1F6FEB", bg: "#DDE9FF", title: "Smart Pinning", desc: "Important tasks always float to the top, regardless of sort order or filters applied."}, 
    {icon: <FlagOutlinedIcon/>, color: "#E8710A", bg: "#FEF3E8", title: "Tags & Priorities", desc: "Custom tags and three-tier priority levels keep every task in clear, sortable context."}, 
    {icon: <EventOutlinedIcon/>, color: "#D93025", bg: "#FCE8E6", title: "Deadlines & Overdue", desc: "Visual due-date indicators with configurable overdue behavior — archive or auto-delete."}, 
    {icon: <ChecklistIcon/>, color: "#1E8E3E", bg: "#E6F4EA", title: "Weighted Subtasks", desc: "Break tasks into weighted subtasks with progress that rolls up into a live completion bar."}, 
    {icon: <EventRepeatOutlinedIcon/>, color: "#7C5CFA", bg: "#EEE8FE", title: "Recurring Schedule", desc: "Define daily, weekly, or monthly templates that auto-create tasks on the days you choose."}, 
    {icon: <CloudOffOutlinedIcon/>, color: "#5A6B82", bg: "#EEF1F6", title: "Local-First", desc: "Runs entirely in your browser — no server, no signup, instant load, fully private."}
];

const PRIORITY_COLORS = {high: {main: "#D93025", soft: "rgba(217, 48, 37, 0.10)"}, medium: {main: "#E8710A", soft: "rgba(232, 113, 10, 0.10)"}, low: {main: "#1E8E3E", soft: "rgba(30, 142, 62, 0.10)"}};

function PreviewCard({delay = 0, priority, title, tag, deadline, sub, pinned, rotate, top, left, scale = 1}) {

    const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.low;

    const isOverdue = deadline === "Overdue";

    return (
        <div className="absolute" style={{top, left, width: 268, transform: `rotate(${rotate}deg) scale(${scale})`, transformOrigin: "center"}}>
            <Box className="animate-fade-in-up" sx={{bgcolor: "rgba(255, 255, 255, 0.88)", borderRadius: "16px", border: "1px solid rgba(229, 233, 240, 0.85)", backgroundClip: "padding-box", boxShadow: CARD_SHADOW, overflow: "hidden", animationDelay: `${delay}ms`}}>
                {pinned && (
                    <div className="absolute top-2.5 right-2.5 w-[22px] h-[22px] rounded-full inline-flex items-center justify-center z-[1]" style={{background: "linear-gradient(135deg, #1F6FEB 0%, #4F8AF7 100%)", boxShadow: `${SEALER_SHADOW}, 0 2px 6px rgba(31, 111, 235, 0.28), ${SPECULAR_HIGHLIGHT}`}}>
                        <PushPinIcon sx={{fontSize: 11, color: "#fff"}}/>
                    </div>
                )}
                <CardContent sx={{p: 2, pl: 3.5, pb: "12px !important", display: "flex", flexDirection: "column", position: "relative", "&:last-child": {pb: "12px !important"}}}>
                    <Box aria-hidden sx={{position: "absolute", left: 10, top: 10, bottom: 10, width: 2.5, borderRadius: 999, bgcolor: c.main, boxShadow: `0 0 0 0.5px ${c.soft}`}}/>
                    <div className="flex items-center gap-2 mb-[9px]" style={{paddingRight: pinned ? 8 : 0}}>
                        <div className="inline-flex items-center gap-2 min-w-0 h-[18px]">
                            <div className="shrink-0 w-[7px] h-[7px] rounded-full mt-[0.5px]" style={{backgroundColor: c.main, boxShadow: `0 0 0 3px ${c.soft}`}}/>
                            <Typography sx={{...MONO_SX, fontSize: 9.5, fontWeight: 600, lineHeight: 1, letterSpacing: "0.10em", textTransform: "uppercase", color: c.main}}>{priority}</Typography>
                        </div>
                        {deadline && (
                            <div className="inline-flex items-center gap-1 shrink-0 h-5 px-[7px] rounded-full" style={{backgroundColor: isOverdue ? "#FCE8E6" : "rgba(31, 111, 235, 0.08)", color: isOverdue ? "#D93025" : "#1556C2"}}>
                                <EventOutlinedIcon sx={{fontSize: 11}}/>
                                <Typography sx={{...MONO_SX, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1, textTransform: "uppercase"}}>{deadline}</Typography>
                            </div>
                        )}
                    </div>
                    <Typography sx={{fontWeight: 600, fontSize: "0.92rem", lineHeight: 1.35, letterSpacing: "-0.012em", mb: 1.1, color: "text.primary", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word"}}>
                        {title}
                   </Typography>
                    <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center h-[22px] px-2 rounded-full border" style={{borderColor: "#E5E9F0", backgroundColor: "rgba(15, 24, 40, 0.025)"}}>
                            <Typography sx={{fontSize: 10.5, fontWeight: 500, color: "text.secondary"}}>{tag}</Typography>
                        </div>
                        {sub && (
                            <div className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full" style={{backgroundColor: "rgba(15, 24, 40, 0.05)"}}>
                                <ChecklistIcon sx={{fontSize: 12, color: "#5A6B82"}}/>
                                <Typography sx={{...MONO_SX, fontSize: 10.5, fontWeight: 700, color: "text.secondary"}}>{sub}</Typography>
                            </div>
                        )}
                    </div>
                </CardContent>
                <div className="h-8 border-t" style={{borderColor: "rgba(229, 233, 240, 0.8)", backgroundColor: "rgba(15, 24, 40, 0.012)"}}/>
            </Box>
        </div>
    );
}

function FeatureCard({f, index}) {

    return (
        <div className="animate-fade-in-up relative" style={{animationDelay: `${400 + index * 60}ms`, height: "100%"}}>
            <Box sx={{height: "100%", p: {xs: 2.75, sm: 3}, borderRadius: "16px", border: "1px solid rgba(229, 233, 240, 0.9)", bgcolor: "rgba(255, 255, 255, 0.78)", boxShadow: CARD_SHADOW, transition: tactileTransition("transform, box-shadow, border-color"), backfaceVisibility: "hidden", backgroundClip: "padding-box", position: "relative", overflow: "hidden", "&:hover": {transform: "translateY(-1px)", borderColor: `${f.color}30`, boxShadow: `${CARD_SHADOW_HOVER}, 0 0 0 1px ${f.color}12`, "& .feat-icon": {transform: "scale3d(1.05, 1.05, 1)"}}}}>
                <Box aria-hidden sx={{position: "absolute", top: 0, right: 0, width: 72, height: 72, borderRadius: "50%", background: `radial-gradient(circle, ${f.bg} 0%, transparent 70%)`, opacity: 0.5, pointerEvents: "none", transform: "translate(30%, -30%)"}}/>
                <Box className="feat-icon relative" sx={{width: 44, height: 44, borderRadius: "12px", bgcolor: f.bg, display: "flex", alignItems: "center", justifyContent: "center", mb: 2, color: f.color, transition: tactileTransition("transform"), "& .MuiSvgIcon-root": {fontSize: 22}}}>
                    {f.icon}
                </Box>
                <Typography sx={{fontWeight: 700, mb: 0.75, fontSize: "0.97rem", letterSpacing: "-0.014em"}}>{f.title}</Typography>
                <Typography sx={{color: "text.secondary", lineHeight: 1.6, fontSize: "0.85rem"}}>{f.desc}</Typography>
            </Box>
        </div>
    );
}

export default function LandingPage() {

    const navigate = useNavigate();

    return (
        <Box className="min-h-screen flex flex-col relative overflow-hidden" sx={{bgcolor: "#F6F8FB"}}>
            <Box aria-hidden className="absolute pointer-events-none" sx={{top: -180, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(31, 111, 235, 0.14) 0%, transparent 65%)"}}/>
            <Box aria-hidden className="absolute pointer-events-none" sx={{top: 320, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124, 92, 250, 0.10) 0%, transparent 65%)"}}/>
            <Box aria-hidden className="absolute inset-0 pointer-events-none" sx={{opacity: 0.45, backgroundImage: "radial-gradient(circle, rgba(15, 24, 40, 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%)"}}/>
            <Box className="relative z-[2] flex items-center justify-between w-full mx-auto" sx={{maxWidth: 1200, px: {xs: 3, sm: 4}, pt: {xs: 3, sm: 4}}}>
                <LogoMark size={32} withWordmark/>
                <Box sx={{display: {xs: "none", sm: "flex"}, alignItems: "center", gap: 0.8, color: "text.secondary"}}>
                    <Box sx={{width: 7, height: 7, borderRadius: "50%", bgcolor: "success.main", boxShadow: "0 0 0 3px rgba(30, 142, 62, 0.18)"}}/>
                    <Typography sx={{...MONO_SX, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase"}}>Local · v 1.0</Typography>
                </Box>
            </Box>
            <Box className="relative z-[1] w-full mx-auto" sx={{display: "grid", gridTemplateColumns: {xs: "1fr", md: "1.05fr 0.95fr"}, alignItems: "center", maxWidth: 1200, px: {xs: 3, sm: 4}, pt: {xs: 6, sm: 8, md: 10}, pb: {xs: 10, md: 14}, gap: {xs: 6, md: 4}}}>
                <Fade in timeout={700}>
                    <Box>
                        <Box className="flex flex-wrap gap-2" sx={{mb: 3, rowGap: 1}}>
                            {["No backend", "No signup", "Just tasks"].map((t) => (
                                <Chip key={t} label={t} size="small" variant="outlined" sx={{borderColor: "divider", color: "text.secondary", fontSize: 11.5, fontWeight: 600, bgcolor: "rgba(255, 255, 255, 0.78)"}}/>
                            ))}
                        </Box>
                        <Typography component="h1" sx={{fontSize: {xs: "2.6rem", sm: "3.2rem", md: "3.8rem"}, fontWeight: 800, letterSpacing: "-0.038em", color: "text.primary", lineHeight: 1.04, mb: 2.5}}>
                            Pin what matters.
                            <Box component="span" className="block" sx={{background: "linear-gradient(125deg, #1F6FEB 0%, #4F8AF7 45%, #7C5CFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>
                                Flow through the rest.
                            </Box>
                        </Typography>
                        <Typography sx={{fontSize: {xs: "1.02rem", sm: "1.1rem"}, color: "text.secondary", fontWeight: 400, maxWidth: 480, lineHeight: 1.65, mb: 4}}>A local-first task workspace with weighted subtasks, recurring templates, and pin-to-top focus. No accounts. No tracking. Just your work.</Typography>
                        <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} sx={{alignItems: {xs: "stretch", sm: "center"}}}>
                            <Button variant="contained" size="large" onClick={() => navigate("/dashboard")} disableElevation endIcon={<ArrowForwardIcon sx={{fontSize: 18}}/>} aria-label="Get started with TaskFlow" sx={{px: 3.5, py: 1.4, fontSize: "0.97rem", fontWeight: 600, borderRadius: 999, boxShadow: `${SEALER_SHADOW}, 0 6px 18px -4px rgba(31, 111, 235, 0.40), 0 0 20px -4px rgba(31, 111, 235, 0.12), ${SPECULAR_HIGHLIGHT}`, "&:hover": {boxShadow: `${SEALER_SHADOW}, 0 8px 24px -4px rgba(31, 111, 235, 0.50), 0 0 28px -4px rgba(31, 111, 235, 0.18), ${SPECULAR_HIGHLIGHT}`}}}>
                                Get Started
                            </Button>
                            <Box className="inline-flex items-center gap-2" sx={{color: "text.secondary", px: {xs: 0, sm: 1}}}>
                                <Box className="inline-flex items-center justify-center" sx={{width: 22, height: 22, borderRadius: "50%", bgcolor: "rgba(31, 111, 235, 0.10)", color: "primary.main"}}>
                                    <Typography sx={{...MONO_SX, fontSize: 11, fontWeight: 700}}>↵</Typography>
                                </Box>
                                <Typography sx={{fontSize: 12.5, fontWeight: 500}}>Press Enter on any input to save instantly</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Fade>
                <Box sx={{position: "relative", display: {xs: "none", md: "block"}, height: 460}}>
                    <PreviewCard delay={200} priority="high" title="Hello World?" tag="Life" deadline="Today" pinned rotate={-3} top={20} left={20}/>
                    <PreviewCard delay={340} priority="medium" title="TaskFlow" tag="Project" sub="1/2" rotate={2.5} top={175} left={100} scale={0.96}/>
                    <PreviewCard delay={480} priority="low" title="An Open Task?" tag="Default" pinned rotate={-1.5} top={325} left={40} scale={0.9}/>
                </Box>
            </Box>
            <Box className="relative z-[1] w-full mx-auto" sx={{maxWidth: 1080, px: 3}}>
                <Box sx={{height: 1, bgcolor: "divider"}}/>
            </Box>
            <Box className="relative z-[1] w-full mx-auto" sx={{maxWidth: 1100, px: 3, pt: {xs: 8, sm: 10}, pb: {xs: 8, sm: 12}}}>
                <Box className="text-center" sx={{mb: {xs: 5, sm: 7}}}>
                    <Typography sx={{...MONO_SX, color: "primary.main", fontWeight: 600, letterSpacing: "0.16em", fontSize: 11, textTransform: "uppercase", mb: 1.5}}>◆ What's inside</Typography>
                    <Typography sx={{fontSize: {xs: "1.65rem", sm: "2rem"}, fontWeight: 700, letterSpacing: "-0.026em", color: "text.primary", lineHeight: 1.2}}>
                        Everything you need.
                        <Box component="span" sx={{color: "text.secondary", fontWeight: 400}}>
                            {" "}
                            Nothing you don't.
                        </Box>
                    </Typography>
                </Box>
                <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)"}, gap: {xs: 2, sm: 2}}}>
                    {FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} f={f} index={i}/>
                    ))}
                </Box>
            </Box>
            <Box className="relative z-[1] text-center" sx={{pb: 4, color: "text.secondary"}}>
                <Typography sx={{...MONO_SX, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", opacity: 0.6}}>Built with React · Material UI · runs locally</Typography>
            </Box>
        </Box>
    );
}
