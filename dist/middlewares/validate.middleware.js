export function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            const zerr = err;
            return res.status(400).json({ error: "ValidationError", details: zerr.flatten() });
        }
    };
}
