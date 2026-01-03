import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    console.log("Admin Auth - Token received:", token ? "Yes" : "No");
    console.log(
      "Admin Auth - JWT_SECRET exists:",
      process.env.JWT_SECRET ? "Yes" : "No"
    );
    console.log("Admin Auth - ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again - No Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Admin Auth - Decoded email:", decoded.email);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      console.log(
        "Admin Auth - Email mismatch. Expected:",
        process.env.ADMIN_EMAIL,
        "Got:",
        decoded.email
      );
      return res.json({
        success: false,
        message: "Not Authorized, Login Again - Email Mismatch",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Auth - Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
