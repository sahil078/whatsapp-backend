const SOCKET_PATH = process.env.SOCKET_IO_PATH || "/ws";
export function notFound(req, res, next) {
    // Never handle Engine.IO/Socket.IO requests here
    if (req.path?.startsWith(SOCKET_PATH))
        return next();
    if (res.headersSent)
        return next();
    res.status(404).json({ error: "NotFound" });
}
export function errorHandler(err, req, res, next) {
    // If headers already sent or a non-standard res object, delegate
    if (res.headersSent || typeof res.status !== "function") {
        return next(err);
    }
    console.error("[errorHandler]", err);
    const status = err?.status ?? 500;
    res.status(status).json({
        error: err?.name || "ServerError",
        message: err?.message || "Something went wrong",
    });
}
