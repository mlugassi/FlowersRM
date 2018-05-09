module.exports = (req, res, next) => {
    console.log("checksession");
    if (req.session === undefined || req.session.userId === undefined)
        res.redirect('/');
    else
        next();
}