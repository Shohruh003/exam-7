import JWT from "jsonwebtoken";

export default {
    sing: (payload) => JWT.sign(payload, process.env.SECRET_KEY),
    verify: (token) => JWT.verify(token, process.env.SECRET_KEY)
}