import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { Profile } from './entities/profile.entity';

require('dotenv').config()

@Injectable()
export class UsersService {
    constructor(){}

    async createUser(userDto:UserDto)
    {
        const user = await User.findOneBy({email:userDto.email});
        if(user)
            throw new BadRequestException("User with that email exist");

        if(userDto.password !== userDto.confirmPassword)
            throw new BadRequestException("Passwords are not equal");
        
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(userDto.password, salt);

        const username = userDto.email.split('@')[0];
        
        const profile = Profile.create({ username })
        await profile.save();
        
        const newUser = User.create({
            email:userDto.email,
            password,
            createdAt: new Date(),
            profile
        })
        
        return newUser.save();
    }

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
