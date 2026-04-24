
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navigation({onLogout, title}) {

    const navigate = useNavigate();

    const handleLogout = () => {

        onLogout();

        navigate("/");

    };

    return (
        <AppBar position="sticky" elevation={0} sx={{bgcolor: "background.default", color: "text.primary", borderBottom: "none", backgroundImage: "none"}}>
            <Toolbar sx={{display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", minHeight: {xs: 64, sm: 72}, px: {xs: 1.5, sm: 3}, gap: 1}}>
                <Box/>
                <Typography variant="h6" sx={{fontSize: {xs: "1.05rem", sm: "1.15rem"}, fontWeight: 500, letterSpacing: "-0.01em", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {title}
                </Typography>
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button startIcon={<LogoutIcon sx={{fontSize: 18}}/>} onClick={handleLogout} sx={{display: {xs: "none", sm: "inline-flex"}, color: "text.secondary", "&:hover": {bgcolor: "#F1F3F4", color: "error.main"}}}>
                        Logout
                    </Button>
                    <Tooltip title="Logout" arrow>
                        <IconButton onClick={handleLogout} aria-label="Logout" sx={{display: {xs: "inline-flex", sm: "none"}, color: "text.secondary", "&:hover": {bgcolor: "#F1F3F4", color: "error.main"}}}>
                            <LogoutIcon sx={{fontSize: 20}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
