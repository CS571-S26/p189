
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, Avatar} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Navigation({onLogout}) {

    const navigate = useNavigate();

    const handleLogout = () => {

        onLogout();

        navigate("/");

    };

    return (
        <AppBar position="sticky" elevation={0} sx={{bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", color: "text.primary"}}>
            <Toolbar sx={{justifyContent: "space-between", minHeight: {xs: 56}}}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1.2}}>
                    <Avatar sx={{width: 32, height: 32, bgcolor: "#E8F0FE", color: "primary.main"}}>
                        <CheckCircleOutlineIcon sx={{fontSize: 18}} />
                    </Avatar>
                    <Typography variant="h6" sx={{fontSize: "1.1rem"}}>
                        TaskFlow
                    </Typography>
                </Box>
                <Button startIcon={<LogoutIcon sx={{fontSize: 18}} />} onClick={handleLogout} sx={{color: "text.secondary", "&:hover": {bgcolor: "#F1F3F4", color: "error.main"}}}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}
