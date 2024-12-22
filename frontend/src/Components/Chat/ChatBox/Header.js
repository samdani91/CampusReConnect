import {
    Avatar,
    Button,
    Card,
    CardHeader,
    IconButton,
    Typography,
  } from "@mui/material";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import VideoCallIcon from "@mui/icons-material/VideoCall";
  import CallIcon from "@mui/icons-material/Call";
  const Header = () => {
    return (
      <Card
        sx={{
          borderRadius: 0,
          bgcolor:"primary.main",
          color:"white"
        }}
        elevation={0}
      >
        <CardHeader
          avatar={
            <>
              <Avatar>R</Avatar>
            </>
          }
        //   title={roomData.receiver.name}
        title = " yasin"
          subheader={
            <Typography variant="caption">yasin@gmail.com</Typography>
          }
        />
      </Card>
    );
  };
  export default Header;