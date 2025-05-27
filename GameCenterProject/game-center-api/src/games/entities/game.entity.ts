import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'game'})
export class Game extends BaseEntity
{
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({unique:true})
    title:string;

    @Column()
    description:string;

    @Column({nullable: true})
    imageUrl:string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => User, user => user.games)
    user:User;
}