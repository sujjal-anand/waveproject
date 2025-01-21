import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Local } from "../env/config";

export const JWT = async (req: any, res: any, next: any) => {
  try {
    // Get the token from the "Authorization" header
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    // If token is not present, respond with 403 Forbidden
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied, no token provided" });
    }

    // Verify the token
    const payload = jwt.verify(token, Local.Secret_Key) as JwtPayload;

    // Add payload data to the request object for later use
    (req as any).user = payload; // Use 'as any' if req.user is not defined in type definitions

    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Generic error handler for other cases
    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};
