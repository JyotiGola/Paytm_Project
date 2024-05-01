 const { z }= require( "zod")
const User = z.object({
    username: z.string().min(3),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(8)
})
module.exports = { User }