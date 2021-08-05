import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1628195467077 implements MigrationInterface {
    name = 'CreateDatabase1628195467077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pokemons" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "number" integer NOT NULL, "image" character varying NOT NULL, "weight" integer NOT NULL, "height" integer NOT NULL, "baseExp" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_a3172290413af616d9cfa1fdc9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_pokemons" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "pokemonId" integer NOT NULL, CONSTRAINT "PK_6d55d403210e0f141a18d79d387" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users_pokemons"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "pokemons"`);
    }

}
