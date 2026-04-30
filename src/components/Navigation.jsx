
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

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
        <AppBar ref={barRef} position="sticky" elevation={0} sx={{bgcolor: scrolled ? "rgba(246,248,251,0.92)" : "background.default", color: "text.primary", borderBottom: "1px solid", borderColor: scrolled ? "divider" : "transparent", backgroundImage: "none", transition: "background-color 0.22s, border-color 0.22s", zIndex: 10, flexShrink: 0}}>
            <Toolbar sx={{display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", minHeight: {xs: 60, sm: 68}, px: {xs: 1.5, sm: 3}, gap: 1}}>
                <Box />
                <Typography component="h1" sx={{fontSize: {xs: "1rem", sm: "1.1rem"}, fontWeight: 600, letterSpacing: "-0.018em", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {title}
                </Typography>
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button startIcon={<HomeOutlinedIcon sx={{fontSize: 18}} />} onClick={goHome} sx={{display: {xs: "none", sm: "inline-flex"}, color: "text.secondary", fontWeight: 500, "&:hover": {bgcolor: "rgba(31,111,235,0.06)", color: "primary.main"}}}>
                        Home
                    </Button>
                    <Tooltip title="Go to landing">
                        <IconButton onClick={goHome} aria-label="Go to landing page" sx={{display: {xs: "inline-flex", sm: "none"}, color: "text.secondary", "&:hover": {bgcolor: "rgba(31,111,235,0.06)", color: "primary.main"}}}>
                            <HomeOutlinedIcon sx={{fontSize: 20}} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
