
import {useNavigate} from "react-router-dom";
import {Box, Button, Typography, Stack, Paper} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const FEATURES = [
    {
        icon: <CheckCircleOutlineIcon/>,
        color: "#1A73E8",
        bg: "#E8F0FE",
        title: "Smart Pinning",
        desc: "Pinned tasks always stay at the top, regardless of sort order."
    }, {
        icon: <AutoAwesomeIcon/>,
        color: "#E8710A",
        bg: "#FEF3E8",
        title: "Tags & Priorities",
        desc: "Custom tags and priority badges keep every task in context."
    }, {
        icon: <RocketLaunchIcon/>,
        color: "#1E8E3E",
        bg: "#E6F4EA",
        title: "Zero Backend",
        desc: "Runs entirely in your browser — fast, private, always available."
    }
];

export default function LandingPage({onLogin, isLoggedIn}) {

    const navigate = useNavigate();

    const handleLogin = () => {

        onLogin();

        navigate("/dashboard");

    };

    return (
        <Box sx={{minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 3, bgcolor: "#FFFFFF"}}>
            <Box sx={{width: 72, height: 72, borderRadius: "22px", bgcolor: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center", mb: 3}}>
                <CheckCircleOutlineIcon sx={{fontSize: 36, color: "primary.main"}}/>
            </Box>
            <Typography variant="h3" sx={{color: "text.primary", textAlign: "center", mb: 1.5}}>
                TaskFlow
            </Typography>
            <Typography variant="h6" sx={{color: "text.secondary", textAlign: "center", fontWeight: 400, mb: 1}}>
                A clean, focused to-do list
            </Typography>
            <Typography variant="body1" sx={{color: "text.secondary", textAlign: "center", maxWidth: 420, mb: 4, lineHeight: 1.7}}>
                Pin critical tasks, tag everything, track your history — all locally in your browser
                with zero setup.
            </Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" onClick={handleLogin} disableElevation>
                    {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                </Button>
                {!isLoggedIn && (
                    <Button variant="outlined" size="large" onClick={handleLogin} sx={{ borderColor: "#DADCE0", color: "text.primary", "&:hover": {bgcolor: "#F1F3F4", borderColor: "#DADCE0"}}}>
                        Mock Login
                    </Button>
                )}
            </Stack>
            <Stack direction={{xs: "column", sm: "row"}} spacing={3} sx={{mt: 8, mb: 6, maxWidth: 880, width: "100%"}}>
                {FEATURES.map((f) => (
                    <Paper key={f.title} elevation={0} sx={{flex: 1, p: 3.5, borderRadius: 3, border: "1px solid", borderColor: "divider", transition: "border-color 0.2s, box-shadow 0.2s", "&:hover": {borderColor: f.color, boxShadow: `0 1px 3px 1px rgba(60,64,67,0.15)`}}}>
                        <Box sx={{width: 44, height: 44, borderRadius: "12px", bgcolor: f.bg, display: "flex", alignItems: "center", justifyContent: "center", mb: 2, color: f.color, "& .MuiSvgIcon-root": {fontSize: 24}}}>
                            {f.icon}
                        </Box>
                        <Typography variant="subtitle1" sx={{mb: 0.5}}>
                            {f.title}
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.secondary", lineHeight: 1.6}}>
                            {f.desc}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}
