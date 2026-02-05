import { Migration } from '@mikro-orm/migrations';

export class Migration20260129194255 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "mpn_builder_template_block" drop constraint if exists "mpn_builder_template_block_id_unique";`);
    this.addSql(`alter table if exists "mpn_builder_template" drop constraint if exists "mpn_builder_template_id_unique";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_builder_template_id_unique" ON "mpn_builder_template" (id) WHERE deleted_at IS NULL;`);

    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_builder_template_block_id_unique" ON "mpn_builder_template_block" (id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_builder_template_block_parent_id" ON "mpn_builder_template_block" (parent_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_mpn_builder_template_id_unique";`);

    this.addSql(`drop index if exists "IDX_mpn_builder_template_block_id_unique";`);
    this.addSql(`drop index if exists "IDX_mpn_builder_template_block_parent_id";`);
  }

}
