import joi from "joi"
import { GenderEnum } from "../../common/enum/user.enum.js";


export const signUpSchema = {
    body: joi.object({
        userName: joi.string().required(),
        userName: joi.string().not("ahmed").required(), // anyone neither ahmed
        // i need add another mails  
        email: joi.string().email({ tlds: { allow: ["org", "outlook"] }, maxDomainSegments: 2 }).required(),
        // i need all without outlook
        // email: joi.string().email({ tlds: { allow: false, deny: ["outlook"] } }).required(),
        password: joi.string().required(),
        phone: joi.string().required(),
        gender: joi.valid(GenderEnum), // valid [male , female]

        active: joi.boolean().truthy("yes", "y", 1).falsy("no", "n", 0).sensitive() // must n small
    }),
    query: joi.object({
        flag: joi.boolean().required()
    })
}

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});