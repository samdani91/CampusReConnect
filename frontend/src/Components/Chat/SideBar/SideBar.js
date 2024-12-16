import {
    Avatar,
    Box,
    Divider,
    dividerClasses,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import Header from "./Header";
import { Fragment, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import axios from "axios"; // Commented out since we won't be using it

const SideBar = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleChatRoom = () => {

    };

    return (
        <div>
            <Box sx={{
                width: "25vw",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
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

                {value === 0 && (
                    <List sx={{ p: 0, overflowY: "auto", flex: "1 0 0" }}>
                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />


                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem
                            alignItems="flex-start"
                            onClick={() => handleChatRoom()}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                // primary={item.name}
                                primary="Mohammed Yasin"
                                secondary={
                                    <Typography variant="caption">SPL2 Teammate</Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />
                    </List>
                )}
                {value === 1 && <div>1</div>}
            </Box>
        </div>

    )

};

export default SideBar;
