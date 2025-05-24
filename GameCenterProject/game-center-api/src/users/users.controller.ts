import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
    
    constructor(private userService: UsersService){}

    @Post('create')
    createUser(@Body() userDto:UserDto)
    {
        return this.userService.createUser(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req)
    {
        return this.userService.findByEmail(req.user.email);
    }


    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    deleteUser(@Body('email') email:string)
    {
        return this.userService.deleteUser(email);
    }
}
