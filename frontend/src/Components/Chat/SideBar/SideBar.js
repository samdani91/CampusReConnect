import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const SideBar = ({ onSelectUser }) => {
    const [value, setValue] = useState(0);
    const [chatList, setChatList] = useState([]);
    const [userList, setUserList] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchChatList = async () => {
        try {
            const response = await axios.get("http://localhost:3001/chat-list", {
                withCredentials: true,
            });
            setChatList(response.data);
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    };

    const fetchUserList = async () => {
        try {
            const response = await axios.get("http://localhost:3001/user-list", {
                withCredentials: true,
            });
            const sortedUsers = response.data.sort((a, b) =>
                a.name.localeCompare(b.name) // Sort alphabetically by name
            );
            setUserList(sortedUsers); // Set the sorted user list
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    };

    useEffect(() => {
        fetchChatList();
        fetchUserList();
    }, []);

    return (
        <Box sx={{ width: "25vw", display: "flex", flexDirection: "column", height: "100%" }}>
            <Header />

            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="fullWidth"
            >
                <Tab
                    icon={<ChatBubbleOutlineIcon fontSize="small" />}
                    iconPosition="start"
                    label="Chat List"
                    sx={{ minHeight: "inherit" }}
                />
                <Tab
                    icon={<PersonIcon fontSize="medium" />}
                    iconPosition="start"
                    label="User List"
                    sx={{ minHeight: "inherit" }}
                />
            </Tabs>

            {/* Chat List */}
            {value === 0 && (
                <List sx={{ p: 0, overflowY: "auto", flex: "1 0 0" }}>
                    {chatList.map((chat, index) => (
                        <div key={chat.id}>
                            <ListItem onClick={() => onSelectUser(chat)}>
                                <ListItemAvatar>
                                    <Avatar alt={chat.name} src={chat.avatar || "/default-avatar.jpg"} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={chat.name}
                                    secondary={<Typography variant="caption">{chat.status}</Typography>}
                                />
                            </ListItem>
                            {index !== chatList.length - 1 && <Divider component="li" />}
                        </div>
                    ))}
                </List>
            )}

            {/* User List */}
            {value === 1 && (
                <List sx={{ p: 0, overflowY: "auto", flex: "1 0 0" }}>
                    {userList.map((user, index) => (
                        <div key={user.id}>
                            <ListItem button onClick={() => onSelectUser(user)}> {/* Make clickable */}
                                <ListItemAvatar>
                                    <Avatar alt={user.name} src={user.avatar || "/default-avatar.jpg"} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={<Typography variant="caption">{user.department}</Typography>}
                                />
                            </ListItem>
                            {index !== userList.length - 1 && <Divider component="li" />}
                        </div>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default SideBar;
