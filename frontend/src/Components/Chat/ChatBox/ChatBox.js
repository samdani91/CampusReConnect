import { Box } from "@mui/material";
import Header from "./Header";
import ChatArea from "./ChatArea";
import Footer from "./Footer";

const ChatBox = () => {
  return (
    <Box
      sx={{
        width: "75vw",
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <Header/>
      <ChatArea/>
      <Footer/>
      {/* {roomData.room ? (
        <>
          <Header roomData={roomData} />
          <ChatArea allMsg={allMsg} user={user} handleDelete={handleDelete} />
          <Footer handleSendMsg={handleSendMsg} />
        </>
      ) : (
        <>Please select a user to chat</>
      )} */}
    </Box>
  );
};
export default ChatBox;