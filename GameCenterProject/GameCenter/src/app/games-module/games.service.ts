import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth/auth.service';
import { GameModel } from './dto/game.model';
@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(
      private http: HttpClient,
      private authService:AuthService
    ) {}
  
    private jwtHelper = new JwtHelperService();
    private addedGame!:GameModel;
    Api = "http://localhost:3000/games/"
    private isOpenedModal:BehaviorSubject<string> = new BehaviorSubject<string>("false");
    public isOpenedModal$:Observable<string> = this.isOpenedModal.asObservable();

    private games:BehaviorSubject<GameModel[]> = new BehaviorSubject<GameModel[]>([]);
    public games$:Observable<GameModel[]> = this.games.asObservable();

    openModal(open:string = "add")
    {
      this.isOpenedModal.next(open);
    }

    
    closeModal()
    {
      this.isOpenedModal.next("false");
    }

    setGame(game:GameModel)
    {
      this.addedGame = game;
    }
    getGameId(){return this.addedGame.id}
  uploadGameImages(files:File[]): Observable<any>
  {
    if(!files.length)
      return of({});
    const token = localStorage.getItem("ACCESS_TOKEN");
    let httpOptions = new HttpHeaders()
                      .set('Authorization', 'Bearer '+token)

     const formData = new FormData();
      for (let file of files) {
        formData.append('file', file);
      }
    return this.http.post(`${this.Api}upload/${this.addedGame.id}`, formData, {headers:httpOptions}).pipe( 
      tap(() => {
        this.getGameImages(this.addedGame.id).subscribe(image => {
                image.data.forEach((photo:any) => {
                                                const values = photo.data.map((value:any) => parseInt(value, 10));
                                                const imageData = new Uint8Array(values);
                                                const blob = new Blob([imageData], { type: 'image/png' });
                                                this.addedGame.imageUrl = URL.createObjectURL(blob);
                                            });
                  this.updateGameState()
                })
      }),
      catchError(err => {
                  this.authService.setMessage(err.error.message)
                  return throwError(() => err)
                })
    );
  }
  getGameImages(id:number):Observable<any>
  {
    const token = localStorage.getItem("ACCESS_TOKEN");
  let httpOptions = new HttpHeaders()
                      .set('Authorization', 'Bearer '+token)
      return this.http.get(`${this.Api}getImage/${id}`, {headers:httpOptions}).pipe(
      catchError(err => {
                  this.authService.setMessage(err.error.message)
                  return throwError(() => err)
                })
      )
  }
  
  updateGameState()
  {
        const current = this.games.getValue();
        this.games.next([...current, this.addedGame]);
  }

  editGameState(id:number, gameDto:GameModel)
  {
    const current = this.games.getValue();
    const game = current.find(value => value.id == id);
    console.log(current, id)
    if(game)
    {
      const index = current.indexOf(game);
      game.title = gameDto.title;
      game.description = gameDto.description;

      current[index] = game;
      console.log(current)
      this.games.next([...current]);
    }
  }
  addGame(gameDto:{title:string, description:string}): Observable<GameModel>
  {
    const token = localStorage.getItem("ACCESS_TOKEN");
    var decodedToken!:any;
    if(token)
    {
      decodedToken = this.jwtHelper.decodeToken(token);
    }
  let httpOptions = new HttpHeaders()
                      .set('Authorization', 'Bearer '+token)
                      .set('Content-Type', 'application/json');
    return this.http.post<GameModel>(`${this.Api}addGame`, {title:gameDto.title,description: gameDto.description, email: decodedToken.email}, {headers:httpOptions}).pipe(
      catchError(err => {
                  this.authService.setMessage(err.error.message)
                  return throwError(() => err)
                })
    )
  }

  getAllGames():Observable<GameModel[]>
  {
    const token = localStorage.getItem("ACCESS_TOKEN");
    let httpOptions = new HttpHeaders()
                      .set('Authorization', 'Bearer '+token)
    return this.http.get<GameModel[]>(`${this.Api}getAllGames`,{headers:httpOptions}).pipe(
      tap((games) => {
        games.forEach((game, i) => {
        this.getGameImages(game.id).subscribe(image => {
        image.data.forEach((photo:any) => {
                                        const values = photo.data.map((value:any) => parseInt(value, 10));
                                        const imageData = new Uint8Array(values);
                                        const blob = new Blob([imageData], { type: 'image/png' });
                                        games[i].imageUrl = URL.createObjectURL(blob);
                                    })
        })
      })
      this.games.next(games);
      }),
      catchError(err => {
                  this.authService.setMessage(err.error.message)
                  return throwError(() => err)
                })
    );
  }

  deleteGame(id:number){
    const token = localStorage.getItem("ACCESS_TOKEN");
    let httpOptions = new HttpHeaders()
                      .set('Authorization', 'Bearer '+token)
    return this.http.delete(`${this.Api}deleteGame/${id}`, {headers:httpOptions}).pipe(
      tap(() => {
        const current = this.games.getValue();
        this.games.next(current.filter(g => g.id !== id));
      }),
      catchError(err => {
                  this.authService.setMessage(err.error.message)
                  return throwError(() => err)
                })
    )
  }

  updateGame(id:number, gameDto:GameModel)
  {
    const token = localStorage.getItem("ACCESS_TOKEN");
        let httpOptions = new HttpHeaders()
                          .set('Authorization', 'Bearer '+token)
        return this.http.put(`${this.Api}updateGame/${id}`, {title:gameDto.title, description:gameDto.description},{headers:httpOptions}).pipe(
          tap(() => {
              this.editGameState(id, gameDto);
          }),
          catchError(err => {
                      this.authService.setMessage(err.error.message)
                      return throwError(() => err)
                    })
        )
  }
}
