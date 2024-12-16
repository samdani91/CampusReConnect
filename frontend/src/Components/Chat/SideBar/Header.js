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
                bgcolor: "primary.main",
                borderRadius: 0,
                color: "primary.contrastText",
            }}
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
                title="A. M Samdani Mozumder"
                subheader={<Typography variant="caption">UI Frontend Developer</Typography>}
            />
        </Card>
    );
};

export default Header;