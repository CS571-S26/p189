
import "../styles/Home.css";

import {Link} from "react-router-dom";

import {Box, Typography, Button} from "@mui/material";

import reactLogo from "../assets/react.svg";
import heroImg from "../assets/hero.png";
import viteLogo from "../assets/vite.svg";

function Home() {

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: "75vh", textAlign: "center"}}>
            <div className="hero">
                <img src={reactLogo} className="react" alt="React logo"/>
                <img src={heroImg} className="base" alt="Base"/>
                <img src={viteLogo} className="vite" alt="Vite logo"/>
            </div>
            <Typography variant="h3" sx={{mt: 5, mb: 0.5, fontWeight: "bold"}}>
                Simple To-Do List
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{mt: 0.5, mb: 3}}>
                Built with React & MUI
            </Typography>
            <Button variant="outlined" size="large" component={Link} to="/placeholder" sx={{borderRadius: 3}}>
                Get Started!
            </Button>
        </Box>
    );
}

export default Home;
