import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration202406281417021719595023227
  implements MigrationInterface
{
  name = 'AutoMigration202406281417021719595023227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "prueba"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "prueba" character varying NOT NULL DEFAULT 'funciona'`,
    );
  }
}
