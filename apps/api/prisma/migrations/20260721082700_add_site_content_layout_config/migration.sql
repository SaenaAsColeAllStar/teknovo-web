-- AlterTable fasilitas
ALTER TABLE "fasilitas" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable ekstrakurikuler
ALTER TABLE "ekstrakurikuler" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable prestasi
ALTER TABLE "prestasi" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable kurikulum
ALTER TABLE "kurikulum" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable program_sekolah
ALTER TABLE "program_sekolah" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable program_jurusan
ALTER TABLE "program_jurusan" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable tenaga_pengajar
ALTER TABLE "tenaga_pengajar" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';

-- AlterTable kontak
ALTER TABLE "kontak" ADD COLUMN "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}';
