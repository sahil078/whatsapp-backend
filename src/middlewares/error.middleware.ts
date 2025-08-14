import { Request, Response, NextFunction } from "express";

const SOCKET_PATH = process.env.SOCKET_IO_PATH || "/ws";

export function notFound(req: Request, res: Response, next: NextFunction) {
  // Never handle Engine.IO/Socket.IO requests here
  if (req.path?.startsWith(SOCKET_PATH)) return next();
  if (res.headersSent) return next();
  res.status(404).json({ error: "NotFound" });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // If headers already sent or a non-standard res object, delegate
  if (res.headersSent || typeof (res as any).status !== "function") {
    return next(err);
  }
  console.error("[errorHandler]", err);
  const status = err?.status ?? 500;
  res.status(status).json({
    error: err?.name || "ServerError",
    message: err?.message || "Something went wrong",
  });
}
