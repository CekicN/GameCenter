import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Role } from "src/auth/enums/role.enum";
import { Game } from "src/games/entities/game.entity";

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