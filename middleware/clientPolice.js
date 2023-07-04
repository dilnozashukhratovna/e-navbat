const myJwt = require("../services/JwtService");

module.exports = async function (req, res, next) {
    if (req.method == "OPTIONS") {
        next();
    }
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res
                .status(403)
                .json({ message: "Client ro'yxatdan o'tmagan." });
        }

        console.log(authorization);
        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];

        if (bearer != "Bearer" || !token) {
            return res.status(403).json({
                message: "Client ro'yxatdan o'tmagan (token berilmagan)",
            });
        }

        const [error, decodedToken] = await to(myJwt.verifyAccess(token));
        if (error) {
            return res.status(403).json({ message: error.message });
        }

        req.client = decodedToken;
        console.log(decodedToken);

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Client ro'yxatdan o'tmagan (token notog'ri)",
        });
    }
};

async function to(promise) {
    return promise
        .then((response) => [null, response])
        .catch((error) => [error]);
}
