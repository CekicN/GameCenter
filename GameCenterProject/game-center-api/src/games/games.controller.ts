import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { GamesService } from './games.service';
import { gameDto } from './dtos/game.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { gameStorage } from 'src/app.middleware';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { Game } from './entities/game.entity';
@Controller('games')
export class GamesController {
    constructor(private gameService:GamesService){
    }

   @UseGuards(JwtAuthGuard)
    @Post('addGame')
    addGame(@Body() gameDto:gameDto)
    {
        return this.gameService.addGame(gameDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteGame/:id')
    deleteGame( @Param('id', ParseIntPipe) id:number)
    {
        return this.gameService.deleteGame(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAllGames')
    getAllGames()
    {
        return this.gameService.getAllGames();
    }

     @UseGuards(JwtAuthGuard)
    @Put('updateGame/:id')
    updateGame(@Param('id', ParseIntPipe) id:number, @Body() gameDto:gameDto)
    {
        return this.gameService.update(id, gameDto);
    }


    @Post('upload/:id')
    @UseInterceptors(FilesInterceptor('file',20, gameStorage))
    async uploadImage(@UploadedFiles() files:Array<Express.Multer.File>, @Param('id', ParseIntPipe) id:number): Promise<any>
    {
        const response = [];
        files.forEach( file => {
            const fileResponse = {
                originalName:file.originalname,
                filename:file.filename
            }
            response.push(fileResponse);
        })

        return response;
    }
    @Get('getImage/:id')
    async getProfileImage(@Param('id', ParseIntPipe) id:number, @Res() res)
    {
        const readDir = util.promisify(fs.readdir);
        const readFile = util.promisify(fs.readFile);

        const game = Game.findOneBy({id});
        if(!game) throw new BadRequestException("game doesnot exist");
        const directory = `${process.cwd()}/public/games/${id}`;
        const response = {data:[]}

        try{
            let files:Promise<Buffer>[];
            if(fs.existsSync(directory))
            {
                
                const fileNames = await readDir(directory);
                files = fileNames.map( async (filename) => {
                const filepath = directory + "/" + filename;
                return readFile(filepath);
                })
            }
            else
            {
                files.push(readFile(`${process.cwd()}/public/no_image.jpg`));
                
            }
            Promise.all(files)
            .then((fileContents) => {
              response.data = fileContents;
              res.json(response);
            })
            .catch((error) => {
              res.status(400).json(response);
            });
            
        } catch (error) {
          res.status(400).json(response);
        }
    }



}
