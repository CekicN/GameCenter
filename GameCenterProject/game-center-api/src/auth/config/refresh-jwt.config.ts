import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";
import {registerAs} from '@nestjs/config'
require('dotenv').config

export default registerAs("refresh-jwt", (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET, 
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN
}));