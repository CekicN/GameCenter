import { JwtModuleOptions } from "@nestjs/jwt";
import {registerAs} from '@nestjs/config'
require('dotenv').config

export default registerAs("jwt", (): JwtModuleOptions => ({
    global:true,
    secret: process.env.JWT_SECRET, 
    signOptions: {
        expiresIn: process.env.JWT_EXPIRE_IN
    }
}));