import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import UserPokemon from "./UserPokemon";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserPokemon, userPokemons => userPokemons.user)
  userPokemons: UserPokemon[];
}