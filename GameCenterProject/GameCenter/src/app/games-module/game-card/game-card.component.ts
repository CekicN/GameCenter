import { Component, Input, OnInit } from '@angular/core';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent implements OnInit {
  @Input() imageUrl!: string;
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() id:number = -1;

  constructor(private gameService:GamesService){

  }

  ngOnInit(): void {
    
  }

  edit()
  {
    this.gameService.openModal(`edit/${this.id}/${this.title}/${this.text}`);
  }

  delete()
  {
    this.gameService.deleteGame(this.id).subscribe(data => {
      console.log(data);
    })
  }
}
