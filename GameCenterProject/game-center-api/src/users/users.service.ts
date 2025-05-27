import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

require('dotenv').config()

@Injectable()
export class UsersService {
    constructor(){}


    async updateHashedRefreshToken(email:string, hashedRefreshToken:string)
    {
        return await User.update({email}, {hashedRefreshToken})
    }
    async findByEmail(email:string)
    {
        const user = await User.findOneBy({email});

        return user;
    }

    async deleteUser(email:string)
    {
        return await User.delete({email});
    }
}
