function LogOut(req,res){
    res.clearCookie('authToken', { httpOnly: true, secure: false });
    return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = LogOut;