import jwt from "jsonwebtoken"

export default (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json("Unauthorized")
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.userId = decoded.id
  next()
}
