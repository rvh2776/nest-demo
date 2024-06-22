import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1717866031421 implements MigrationInterface {
    name = 'AddAdmin1717866031421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }

}
