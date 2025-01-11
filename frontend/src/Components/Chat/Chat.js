import { dividerClasses, Paper } from "@mui/material"
import SideBar from "./SideBar/SideBar"
import ChatBox from "./ChatBox/ChatBox"

export default function Chat() {
    return (
        <>
        <div className="container mt-3">
            <Paper square elevation={0}  sx={{ height: "86vh", display: "flex" }}>
                <SideBar />
                <ChatBox/>
            </Paper>
        </div>
        </>

    )
}