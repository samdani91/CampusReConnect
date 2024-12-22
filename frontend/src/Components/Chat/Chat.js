import { dividerClasses, Paper } from "@mui/material"
import SideBar from "./SideBar/SideBar"
import ChatBox from "./ChatBox/ChatBox"
import Navbar from '../Navbar/Navbar'

export default function Chat() {
    return (
        <>
        <Navbar />
        <div className="container mt-3">
            <Paper square elevation={0}  sx={{ height: "86vh", display: "flex" }}>
                <SideBar />
                <ChatBox/>
            </Paper>
        </div>
        </>

    )
}