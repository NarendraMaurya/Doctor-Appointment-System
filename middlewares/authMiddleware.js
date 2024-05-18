const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        // console.log("middleware", req.headers['authorization']);
        const token = await req.headers['authorization'].split(' ')[1];
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({ message: 'Auth failed', success: false });
            } else {
                req.body.userId = decode.id
                next();
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Auth failed', success: false });
    }
}