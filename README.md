<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" width="300">
  <img src="https://www.passportjs.org/images/logo.svg" alt="PassportJS" width="240">
</p>

# 🎮 Kreiranje sistema za prijavu, registraciju i CRUD operacije pomoću NestJS‐a

## 📝 Opis problema

Ovaj projekat demonstrira web aplikacije za listanje igara, omogucava prijavu i registraciju korisnika koristeći NestJS framework. Kroz implementaciju lokalne autentifikacije i preko Googla pomoću PassportJS i upravljanje korisničkim podacima sa TypeORM, prikazane su ključne mogućnosti NestJS-a, uključujući modularnu arhitekturu, rad sa bazama podataka i sigurnosne prakse.
Projekat omogućava korisnicima da kreiraju, ažuriraju i brišu igre uz autentifikaciju i autorizaciju putem JWT-a.

---

## 📚 Sadržaj

1. [Tehnologije](#tehnologije)
2. [Šta je NestJs?](#šta-je-nestjs)
3. [Kreiranje i Struktura NestJS Projekta](#kreiranje-i-struktura-nestjs-projekta)
4. [Kreiranje Aplikacije](#kreiranje-aplikacije)
5. [Type ORM i povezivanje sa bazom](#type-orm-i-povezivanje-sa-bazom)
6. [Autentifikacija i Autorizacija pomocu PassportJS](autentifikacija-i-autorizacija-pomocu-passportjs)
7. [CRUD operacije u NestJS](crud-operacije-u-nestjs)
8. [Korišćenje i pokretanje projekta](#korišćenje-i-pokretanje-projekta)

---

## Tehnologije

- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)
- [Angular](https://angular.dev/)
- [PassportJs](https://www.passportjs.org/)
- [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/)

---

## Šta je NestJS?

NestJS je progresivni Node.js framework za izgradnju efikasnih i skalabilnih server-side aplikacija. Baziran je na TypeScript-u i koristi se za razvoj aplikacija koje zahtevaju visoku modularnost i lakoću održavanja. NestJS koristi moderne JavaScript funkcionalnosti i inspirisan je Angular-ovom arhitekturom, što omogućava jednostavnu integraciju sa različitim bibliotekama i alatima.

### Ključne karakteristike NestJS-a:

- <b>Modularna arhitektura:</b> Omogućava organizaciju aplikacije u samostalne module, što olakšava održavanje i skaliranje velikih aplikacija.
- <b>Podrška za TypeScript:</b> NestJS je izgrađen na TypeScript-u, pružajući statičku tipizaciju, bolju IntelliSense podršku i ranije otkrivanje grešaka tokom razvoja.
- <b>Ugrađena podrška za mikroservise: </b> NestJS omogućava jednostavno kreiranje mikroservisne arhitekture koristeći različite transportne protokole poput TCP, Redis, NATS i drugih.
- <b>Dekoratori:</b> Koristi dekoratore kao što su @Module(), @Controller(), @Injectable(), @Get(), @Post() i drugi za deklarativno definisanje komponenti aplikacije, čime se poboljšava čitljivost i održavanje koda.
- <b>Middleware i Guard-ovi: </b> Pruža mehanizme za implementaciju middleware-a i guard-ova koji omogućavaju obradu zahteva pre nego što stignu do kontrolera, što je korisno za autentifikaciju, autorizaciju i druge pre-procesorske zadatke.

---

## Kreiranje i struktura NestJS projekta

- Pre kreiranja NestJS projekta neophodno je posedovati insatiran NodeJs, koji se može instalirati sa oficijalnog sajta [NodeJs](https://nodejs.org/en) kako bi koristili npm.

### Instalacija NestJS CLI:

```bash
npm install -g @nestjs/cli
```

### Kreiranje novog projekta:

```bash
nest new naziv-projekta
```

Ova komanda će kreirati novu NestJS aplikaciju sa osnovnom strukturom direktorijuma i fajlova.

### Struktura projekta:

```bash
naziv-projekta/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

- naziv-projekta/ - Sadrži glavne konfiguracione fajlove projekta
- src/ – vrši se bundlovanje ovog foldera i sve što je u njemu ce da se builduje
- app.module.ts - Glavni modul aplikacije koji importuje druge module i definise konekciju prema bazi.
- app.controller.ts - Definiše rute i odgovore na HTTP zahteve.
- app.service.ts - Sadrži poslovnu logiku aplikacije.
- main.ts - Ulazna tačka aplikacije koja pokreće NestJS aplikaciju.
- package.json - U ovom fajlu se nalaze instalirane biblioteke kao i npm scripte

---

## Kreiranje aplikacije

NestJS aplikacija se sastoji iz modula koji su zasebno jedna celina(game, user, auth).

- Kreiranje modula postiže se komandom:

```bash
 nest g module auth
```

- Uz modul idu i service i controller koji se kreiraju sledecim komandama:

```bash
 nest g service auth
 nest g controller auth
```

- Struktura aplikacije:

```bash
GameCenter/
├── src/
│   ├── auth/              # Modul za autentifikaciju
│   ├── games/             # Modul za upravljanje igrama
│   ├── users/             # Modul za upravljanje korisnicima
│   ├── app.module.ts      # Glavni modul aplikacije
│   └── main.ts            # Ulazna tačka aplikacije
├── test/                  # Test fajlovi
├── .env                   # Konfiguracija okruženja
├── package.json           # Informacije o projektu i zavisnostima
└── tsconfig.json          # TypeScript konfiguracij
```

---

## Type ORM i povezivanje sa bazom

Type ORM omogućava rad sa bazom podataka, kako je napisam u tzpescriptu veoma dobro funkcionise u NestJS-u

#### Povezivanje sa MySQL bazom podataka

- Prvo treba instalirati TypeORM i sql2 komandom:

```bash
npm install --save typeorm mysql2
```
- Konfiguracija u app.module.ts fajlu

```bash
TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      connectTimeout: 60 * 60 * 1000,
      database: 'gamecenterdb',
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    })
```

- U entities se navodi putanja gde ce se nalaziti modeli koji ce se naci u bazi, primer modela:
```bash
@Entity({name: 'users'})
export class User extends BaseEntity
{
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({unique: true})
    email:string;

    @Column()
    password: string;

    @Column({
        type:"enum",
        enum:Role,
        default:Role.USER
    })
    role:Role

    @Column({nullable: true})
    hashedRefreshToken:string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    authStrategy: string;

    @OneToOne(type => Profile, profile => profile.user)
    @JoinColumn()
    profile:Profile;

     @OneToMany(type => Game, game => game.user)
     games:Game[];
}
```

---

## Autentifikacija i Autorizacija pomocu PassportJS

PassportJS je popularna biblioteka za autentifikaciju u Node.js aplikacijama, nudi mnoštvo strategija prema kojima se moze vrsiti autentifikacija(local, JWT, Google, Facebook...).

- Instalacija

```bash
npm install --save @nestjs/passport passport passport-local @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-local @types/passport-jwt
npm install passport-google-oauth20 @types/passport-google-oauth20
```
#### Local Strategy

```bash
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(private authService:AuthService){
        super({
            usernameField: 'email'
        })
    }

    validate(email:string, password:string)
    {
        if(password === "") throw new UnauthorizedException("Please Provide The Password")
        return this.authService.validateUser(email, password);
    }
}
```

#### JWT Strategy
```bash
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(jwtConfig.KEY) private jwtConfiguration:ConfigType<typeof jwtConfig>,
    private authService:AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret,
            ignoreExpiration:false
        })
    }

    validate(payload:AuthJwtPayload)
    {
        return this.authService.validateJwtUser(payload.email);
    }
}
```

### Google Strategy
```bash
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(googleOauthConfig.KEY) private googleConfiguration:ConfigType<typeof googleOauthConfig>,
        private authService:AuthService
    )
    {
        super({
            clientID: googleConfiguration.clientID,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackUrl,
            scope: ['email', 'profile']
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifiedCallback)
    {
        const user = await this.authService.validateGoogleUser({
            email:profile.emails[0].value, 
            password:"",
            confirmPassword:""
        })
        done(null, user);
    }
}
```
- Za svaki strategy se kreira i poseban Guard
```bash
@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google'){}
```

- Koriscenje Guarda
```bash
   @HttpCode(HttpStatus.OK)
   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(@Body() loginDto: {email:string, password:string})
   {
       return await this.authService.login(loginDto.email, loginDto.password);
   }
```

## CRUD operacije u NestJS

Da bi se napisao api poziv pise se controller:
```bash
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
}
```
- Ovo je primer controller-a za rad sa igrama, svaki koristi ```@UseGuards(JwtAuthGuard)``` decorator koji moze da se stavi i nad celom klasom
- Iznad metode se pise i decorator http metode koji se izvrsava npr. ```@delete("deleteGame/:id")``` id se prosledjuje iz query-ja pa se u metodi za argumente stavlja ```@Param('id', ParseIntPipe) id:number```
- Ako se parametri salju iz Body onda se za argument stavlja ```@Body() gameDto:gameDto```

---

## Korišćenje i pokretanje projekta

- Kloniranje repozitorijuma komdandama:

```bash
git clone https://github.com/CekicN/GameCenter.git
cd GameCenterProject/game-center-api
```

- Instalacija i pokretanje NestJS-a, pokrece se defaultno na port-u 3000:

```bash
npm install
npm run start:dev
```

- Pokretanje Angular frontenda, pokrece se defaultno na port-u 4200:

```bash
cd GameCenter
npm install
npm run start
```

#### Korišćenje

1. Prijava korisnika (Login, registracija):
   Iz angulara se salje Post request na ```/auth/login``` ili ```auth/register``` kako bi dobio access i refresh token.
2. Pregled igara:
   GET zahtev na ```/games/getAllGames``` prikazuje sve igre koje su dodate.
3. Kreiranje igre:
   POST zahtev na ```/games/addGame/```.
