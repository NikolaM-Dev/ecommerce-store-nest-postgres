import { MigrationInterface, QueryRunner } from 'typeorm';

export class indexProducts1633708806152 implements MigrationInterface {
  name = 'indexProducts1633708806152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_0decfc62b4e4834e2024a9d9c4" ON "public"."product" ("price", "stock") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0decfc62b4e4834e2024a9d9c4"`,
    );
  }
}
