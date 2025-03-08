const createPost = require("./createPost");
const editPost = require("./editPost");
const deletePost = require("./deletePost");
const makeComment = require("./Comment/makeComment");
const getComment = require("./Comment/getComment");
const updatePostVote = require("./updatePostVote");
const updateCommentVote = require("./Comment/updateCommentVote");

module.exports = {createPost,editPost,deletePost,makeComment,getComment, updatePostVote,updateCommentVote};