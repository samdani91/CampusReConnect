import {
    Avatar,
    Card,
    CardHeader,
    IconButton,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Header = () => {
    return (
        <Card
            sx={{
                bgcolor: "green",
                borderRadius: 0,
                color: "primary.contrastText",
                height:"8.4%"
            }}
            elevation={0}
        >
            <CardHeader
                avatar={<Avatar>A</Avatar>}
                action={
                    <IconButton
                        aria-label="settings"
                        sx={{ color: "primary.contrastText" }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Message"
            />
        </Card>
    );
};

export default Header;