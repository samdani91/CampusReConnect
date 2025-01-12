import { Box, Typography } from "@mui/material";
import Header from "./Header";
import ChatArea from "./ChatArea";
import Footer from "./Footer";

const ChatBox = ({ selectedUser }) => {
    if (!selectedUser) {
        return (
            <Box sx={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" color="textSecondary">
                    Select a user to start chatting
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "75vw", display: "flex", height: "100%", flexDirection: "column" }}>
            {/* Display selected user's name */}
            <Header title={selectedUser.name} />
            <ChatArea userId={selectedUser.id} />
            <Footer userId={selectedUser.id} />
        </Box>
    );
};

export default ChatBox;
