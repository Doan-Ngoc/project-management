import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744032251149 implements MigrationInterface {
    name = ' $NAME1744032251149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "working_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_6bfa0ba6ebf84988566575a3aba" UNIQUE ("name"), CONSTRAINT "PK_cf8efeb0f9b926b178f107986c5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "working_units"`);
    }

}
