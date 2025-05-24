import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: 'profiles'})
export class Profile extends BaseEntity
{
    
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column()
    username: string;

    @Column({nullable: true})
    profileImagePath:string;

    @OneToOne(type => User, user => user.profile, {cascade:true})
    user: User;
}