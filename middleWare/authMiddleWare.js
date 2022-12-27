const jwt = require('jsonwebtoken');
const User = require('../modles/userModle')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler( async (req,res,next) => {
    try {
        
  
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
            try {
                // getting Token from headers
                token = req.headers.authorization.split(' ')[1]
                //  console.log(token);
                // Verify Token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                //  console.log(decoded);  // output will be { id: '63fd97******577d014***d', iat: 1669894105, exp: 1672486105 }
                //  console.log(req.user);
                req.user = await User.findById(decoded.id).select('-password')
                // console.log(req.user);
             
                next()
            
            } catch (error) {
                console.log(error);
                res.status(401)
                throw new Error('Not Authorized')
            }
        }
    
        if (!token) {
            res.status(401)
            throw new Error('Not Authorized, No Token')
        }
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}) 


module.exports = protect