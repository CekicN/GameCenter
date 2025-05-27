import { BadRequestException, Injectable } from '@nestjs/common';
import { gameDto } from './dtos/game.dto';
import { Game } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GamesService {
    constructor(){}


    async addGame(gameDto:gameDto)
    {
        const game = await Game.findOneBy({title: gameDto.title});
        if(game)
            throw new BadRequestException("game with this title exist");

        const user = await User.findOneBy({email: gameDto.userEmail})
        if(!user)
            throw new BadRequestException("User not found");

        const newGame = Game.create({
                    title: gameDto.title,
                    description:gameDto.description,
                    createdAt: new Date(),
                    user
                });
        return newGame.save();
    }
  
    async getAllGames()
    {
        const games = await Game.find();
        return games;
    }

    async deleteGame(id:number)
    {
        const game = await Game.findOneBy({id});
        if(!game)
            throw new BadRequestException("game not exist");

       return await Game.delete({id});
    }

    async update(id:number, gameDto:gameDto)
    {
        const game = await Game.findOneBy({id});

        if(!game)
            throw new BadRequestException("game not exist");

        return await Game.update({id}, {title:gameDto.title, description:gameDto.description});
    }
}
