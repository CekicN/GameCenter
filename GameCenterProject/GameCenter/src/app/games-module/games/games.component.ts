import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { GameModel } from '../dto/game.model';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit{

  games!:GameModel[];
  constructor(private gameService:GamesService){}

  ngOnInit(): void {
    this.gameService.games$.subscribe(games => {
      this.games = games
    });
    this.gameService.getAllGames().subscribe((games:GameModel[]) => {
      console.log(games);
    });
  }
  openModal()
  {
    this.gameService.openModal();
  }
}
