import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const zerr = err as ZodError;
      return res.status(400).json({ error: "ValidationError", details: zerr.flatten() });
    }
  };
}
