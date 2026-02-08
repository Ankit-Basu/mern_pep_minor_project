export const authMiddleware = (req, res, next) => {
  if (
    (req.method === "DELETE" || req.method === "PUT") &&
    !req.headers["x-admin"]
  ) {
  }
  next();
};
