const express = require("express")
const zod = require("zod")
const { users, Accounts } = require("../db")
const { User } = require("./types");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { authMiddleware } = require("./middleware");
const router = express.Router();


router.use(express.json())

router.post("/Signup", async function (req, res) {
    if (!req.headers['content-length']) {
        req.headers['content-length'] = Buffer.byteLength(req.body, 'utf-8');
    }
    const body = req.body
    console.log(body);
    ParsedUserData = User.safeParse(body)
    console.log(ParsedUserData)
    if (!ParsedUserData.success) {
        console.log("validation errors:", ParsedUserData.error.errors)
         return res.status(411).json({
             msg: "You sent the wrong inputs",
             errors: ParsedUserData.error.errors
          
        })
        console.log(" parsed data is not sucessful")
       
    }
    const alreadyExist = await users.findOne({ username: body.username })
    if (alreadyExist) {
        return res.status(411).json({
            msg:"Username already exists"
        })
        
    }
    console.log("before user creation")
    const dbUser = await users.create({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password
    })
    const userId = dbUser._id
    await Accounts.create({
        userId, balance:Math.random() * 10000 + 1
    })
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        msg: "user created successfully!",
        token: token
    })
    
})



// other auth routes

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    if (!req.headers['content-length']) {
        req.headers['content-length'] = Buffer.byteLength(req.body, 'utf-8');
    }
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }
try{await users.updateOne({ _id: req.userId } , req.body);
	
/* res.json({
    message: "Updated successfully"
}) */
    console.log("updated successfully")
}
catch (error) {
    console.log("error updating user:",error)
    }
    
})

router.get("/bulk", async function (req, res) {
    if (!req.headers['content-length']) {
        req.headers['content-length'] = Buffer.byteLength(JSON.stringify(req.body), 'utf-8');
    }
    const requiredUserKeyword = req.query.filter.trim() ||""
    const regex = new RegExp(requiredUserKeyword,'i');
   
    const foundUser = await users.find({
        $or: [{ firstName: regex },
            { lastName: regex }]
        
    })
    console.log("searched keywords",regex)
    res.status(200).json({
        userr: foundUser.map(foundUser => ({
            Id:foundUser._id,
            username: foundUser.username,
            firstname: foundUser.firstName,
            lastname: foundUser.lastName
        })
        )
    })

})

module.exports=router

