import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744078633760 implements MigrationInterface {
    name = ' $NAME1744078633760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "employee_name" character varying(255) NOT NULL, "hashed_password" character varying(255) NOT NULL, "role_id" uuid NOT NULL, "account_status" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_picture" text, "working_unit_id" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4aa2296d359a512862462cb9608" FOREIGN KEY ("working_unit_id") REFERENCES "working_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4aa2296d359a512862462cb9608"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
