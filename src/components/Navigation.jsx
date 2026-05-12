
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, IconButton, Tooltip} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import {PRIMARY_HOVER, SEALER_SHADOW, SURFACE_SPECULAR, tactileTransition} from "../javascripts/shared";

export default function Navigation({title}) {

    const navigate = useNavigate();

    const barRef = useRef(null);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const container = barRef.current?.closest("[data-scroll-root]");

        if (!container) return;

        const onScroll = () => setScrolled(container.scrollTop > 4);

        container.addEventListener("scroll", onScroll, {passive: true});

        return () => container.removeEventListener("scroll", onScroll);

    }, []);

    const goHome = () => navigate("/");

    return (
        <AppBar ref={barRef} position="sticky" elevation={0} sx={{bgcolor: scrolled ? "rgba(246, 248, 251, 0.90)" : "background.default", backdropFilter: scrolled ? "blur(8px) saturate(1.4)" : "none", WebkitBackdropFilter: scrolled ? "blur(8px) saturate(1.4)" : "none", color: "text.primary", borderBottom: "1px solid", borderColor: scrolled ? "divider" : "transparent", boxShadow: scrolled ? `${SEALER_SHADOW}, 0 1px 2px rgba(15, 24, 40, 0.03), ${SURFACE_SPECULAR}` : "none", backgroundImage: "none", transition: tactileTransition("background-color, border-color, box-shadow"), zIndex: 10, flexShrink: 0}}>
            <Toolbar sx={{display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", minHeight: {xs: 52, sm: 60}, px: {xs: 1.5, sm: 3}, gap: 1}}>
                <span/>
                <Typography component="h1" className="truncate text-center" sx={{fontSize: {xs: "0.95rem", sm: "1.05rem"}, fontWeight: 600, letterSpacing: "-0.018em"}}>
                    {title}
                </Typography>
                <span className="flex justify-end">
                    <Button startIcon={<HomeOutlinedIcon sx={{fontSize: 18}}/>} onClick={goHome} sx={{display: {xs: "none", sm: "inline-flex"}, color: "text.secondary", fontWeight: 500, "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}}}>Home</Button>
                    <Tooltip title="Go to landing">
                        <IconButton onClick={goHome} aria-label="Go to landing page" sx={{display: {xs: "inline-flex", sm: "none"}, color: "text.secondary", "&:hover": {bgcolor: PRIMARY_HOVER, color: "primary.main"}}}>
                            <HomeOutlinedIcon sx={{fontSize: 20}}/>
                        </IconButton>
                    </Tooltip>
                </span>
            </Toolbar>
        </AppBar>
    );
}
