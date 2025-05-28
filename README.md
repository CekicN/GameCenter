![alt text](https://nestjs.com/img/logo-small.svg)

# 🎮 Kreiranje sistema za prijavu, registraciju i CRUD operacije pomoću NestJS‐a

## 📝 Opis problema

Ovaj projekat demonstrira web aplikacije za listanje igara, omogucava prijavu i registraciju korisnika koristeći NestJS framework. Kroz implementaciju lokalne autentifikacije i preko Googla pomoću PassportJS i upravljanje korisničkim podacima sa TypeORM, prikazane su ključne mogućnosti NestJS-a, uključujući modularnu arhitekturu, rad sa bazama podataka i sigurnosne prakse.
Projekat omogućava korisnicima da kreiraju, ažuriraju i brišu igre uz autentifikaciju i autorizaciju putem JWT-a.

---

## 📚 Sadržaj

1. [Tehnologije](#tehnologije)
2. [Šta je NestJs?](#šta-je-nestjs)
3. [Kreiranje i Struktura NestJS Projekta](#kreiranje-i-struktura-nestjs-projekta)
4. [Integracija PassportJS](integracija-passportjs)
5. [Kreiranje Aplikacije](#kreiranje-aplikacije)

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
- app.module.ts - Glavni modul aplikacije koji importuje druge module.
- app.controller.ts - Definiše rute i odgovore na HTTP zahteve.
- app.service.ts - Sadrži poslovnu logiku aplikacije.
- main.ts - Ulazna tačka aplikacije koja pokreće NestJS aplikaciju.
- package.json - U ovom fajlu se nalaze instalirane biblioteke kao i npm scripte

---

## Integracija PassportJS

PassportJS je popularna biblioteka za autentifikaciju u Node.js aplikacijama.

- Instalacija

```bash
npm install --save @nestjs/passport passport passport-local @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-local @types/passport-jwt
```

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
