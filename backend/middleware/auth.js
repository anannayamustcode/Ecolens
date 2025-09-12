import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded user info in req.user
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

export default authUser;

//authUser never sees the token → never calls next() → your route never runs → 404.
// import jwt from 'jsonwebtoken'

// const authUser = async (req,res,next)=>{
    
//     const {token} = req.headers;

//     if (!token) {
//         return res.json({success:false, message: 'Not Authorized Login again'})
//     }
//     try {
        
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.body.userId = token_decode.id
//         next()


//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})        
//     }

// }
// export default authUser;