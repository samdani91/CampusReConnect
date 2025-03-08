const createCommunity = require("./Moderator/createCommunity");
const deleteCommunity = require("./Moderator/deleteCommunity");
const joinCommunity = require("./joinCommunity");
const leaveCommunity = require("./leaveCommunity");
const approveMember = require("./Moderator/approveMember");

module.exports = {createCommunity, deleteCommunity , joinCommunity, leaveCommunity, approveMember};