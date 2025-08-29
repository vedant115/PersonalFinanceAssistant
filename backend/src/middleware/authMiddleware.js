import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware invoked for request:", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true },
      });
      // console.log("Authenticated user:", req);
      if (!req.user) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      next();
    } catch (error) {
      res.status(401).send(error);
    }
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
};
