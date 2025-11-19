import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

let validTokens = [];

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    statusCode: 429,
    message: { error: "Too many login attempts" }
});

router.post("/", loginLimiter, (req, res) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ error: "Unsupported Media Type" });
    }

    const { username, password } = req.body;

    if (username === "test" && password === "1234") {
        const token = Math.random().toString(36).substring(2);
        validTokens.push(token);

        return res.status(201).json({ message: "Login success", token });
    }

    return res.status(401).json({ error: "Unauthorized" });
});

export function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token || !validTokens.includes(token)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

export default router;
