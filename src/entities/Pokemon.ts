import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import UserPokemon from "./UserPokemon";

@Entity("pokemons")
export default class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: number;

  @Column()
  image: string;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  baseExp: number;

  @Column()
  description: string;

  @OneToMany(() => UserPokemon, userPokemons => userPokemons.pokemon)
  userPokemons: UserPokemon[];
}
