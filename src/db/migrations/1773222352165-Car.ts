import { MigrationInterface, QueryRunner } from 'typeorm';

export class Car1773222352165 implements MigrationInterface {
  name = 'Car1773222352165';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."car_carmanufacturer_enum" AS ENUM('Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Tesla', 'Renault', 'Peugeot', 'Skoda', 'Volvo', 'Porsche', 'Jeep')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_carmodel_enum" AS ENUM('Camry', 'Corolla', 'Civic', 'Accord', 'Mustang', 'Golf', 'Series3', 'A4', 'Octavia', 'RAV4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "carManufacturer" "public"."car_carmanufacturer_enum" NOT NULL, "carModel" "public"."car_carmodel_enum" NOT NULL, "year" integer NOT NULL, "vin" character varying NOT NULL, "description" text, "publishDate" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "file" ADD "carId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_cce467b67e5d4a0012473f985ea" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_d405574a93f7e36f61d6c3fff39" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_d405574a93f7e36f61d6c3fff39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_cce467b67e5d4a0012473f985ea"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "carId"`);
    await queryRunner.query(`DROP TABLE "car"`);
    await queryRunner.query(`DROP TYPE "public"."car_carmodel_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_carmanufacturer_enum"`);
  }
}
