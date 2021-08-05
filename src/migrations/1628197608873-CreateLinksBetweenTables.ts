import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateLinksBetweenTables1628197608873 implements MigrationInterface {
    name = 'CreateLinksBetweenTables1628197608873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD CONSTRAINT "FK_576c5d6475f397b4a24cf58e6be" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD CONSTRAINT "FK_eb025b13aee5e0ce5a745196305" FOREIGN KEY ("pokemonId") REFERENCES "pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP CONSTRAINT "FK_eb025b13aee5e0ce5a745196305"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP CONSTRAINT "FK_576c5d6475f397b4a24cf58e6be"`);
    }

}
