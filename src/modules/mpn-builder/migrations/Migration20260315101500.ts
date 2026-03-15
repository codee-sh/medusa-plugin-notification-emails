import { Migration } from "@mikro-orm/migrations"

export class Migration20260315101500 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_builder_template" add column if not exists "context_type" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_builder_template" drop column if exists "context_type";`
    )
  }
}
