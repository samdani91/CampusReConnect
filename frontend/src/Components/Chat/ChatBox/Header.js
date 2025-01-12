import {
    Avatar,
    Button,
    Card,
    CardHeader,
    IconButton,
    Typography,
  } from "@mui/material";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";

  const Header = () => {
    return (
      <Card
        sx={{
          borderRadius: 0,
          bgcolor:"primary.main",
          color:"white",
          
        }}
        elevation={0}
      >
        <CardHeader
          avatar={
            <>
              <Avatar>R</Avatar>
            </>
          }

        title = " yasin"
          subheader={
            <Typography variant="caption">yasin@gmail.com</Typography>
          }
        />
      </Card>
    );
  };
  export default Header;