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
                // subheader={<Typography variant="caption">UI Frontend Developer</Typography>}
            />
        </Card>
    );
};

export default Header;