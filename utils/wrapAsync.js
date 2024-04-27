const wrapAsync = (func) => (req,res,next) => {
    return func(req,res,next).catch(next)
}
module.exports = wrapAsync