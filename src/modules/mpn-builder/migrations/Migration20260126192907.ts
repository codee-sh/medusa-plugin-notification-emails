import { Migration } from '@mikro-orm/migrations';

export class Migration20260126192907 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "mpn_builder_template" drop constraint if exists "mpn_builder_template_name_unique";`);
    this.addSql(`create table if not exists "mpn_builder_template" ("id" text not null, "name" text not null, "label" text null, "description" text null, "channel" text not null, "locale" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_builder_template_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_builder_template_name_unique" ON "mpn_builder_template" (name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_builder_template_deleted_at" ON "mpn_builder_template" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "mpn_builder_template_block" ("id" text not null, "type" text not null, "parent_id" text null, "position" integer not null default 0, "metadata" jsonb null, "template_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_builder_template_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_builder_template_block_template_id" ON "mpn_builder_template_block" (template_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_builder_template_block_deleted_at" ON "mpn_builder_template_block" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "mpn_builder_template_block" add constraint "mpn_builder_template_block_template_id_foreign" foreign key ("template_id") references "mpn_builder_template" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "mpn_builder_template_block" drop constraint if exists "mpn_builder_template_block_template_id_foreign";`);

    this.addSql(`drop table if exists "mpn_builder_template" cascade;`);

    this.addSql(`drop table if exists "mpn_builder_template_block" cascade;`);
  }

}
