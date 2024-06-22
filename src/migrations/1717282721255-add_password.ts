import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPassword1717282721255 implements MigrationInterface {
  name = 'AddPassword1717282721255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
