
import "../styles/Home.css";

import {Box, Typography} from "@mui/material";

import reactLogo from "../assets/react.svg";
import heroImg from "../assets/hero.png";
import viteLogo from "../assets/vite.svg";

function Placeholder() {

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: "50vh", textAlign: "center"}}>
            <div className="hero">
                <img src={reactLogo} className="react" alt="React logo"/>
                <img src={heroImg} className="base" alt="Base"/>
                <img src={viteLogo} className="vite" alt="Vite logo"/>
            </div>
            <Typography variant="h3" sx={{mt: 5, fontWeight: "bold"}}>
                PlaceHolder
            </Typography>
        </Box>
    );
}

export default Placeholder;
