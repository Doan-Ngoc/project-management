import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744080464678 implements MigrationInterface {
    name = ' $NAME1744080464678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "employee_name" character varying(255) NOT NULL, "hashed_password" character varying(255) NOT NULL, "account_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_picture" text, "role_id" uuid, "working_unit_id" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6" FOREIGN KEY ("working_unit_id") REFERENCES "working_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
