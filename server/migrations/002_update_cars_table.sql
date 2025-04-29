-- 002_update_cars_table.sql

-- Adaugă coloane noi
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "model" VARCHAR(100);
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "fuel" VARCHAR(50);
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "transmission" VARCHAR(50);
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "power" INTEGER;
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "engine_size" NUMERIC;
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "color" VARCHAR(50);
ALTER TABLE "Cars" ADD COLUMN IF NOT EXISTS "features" JSONB DEFAULT '[]';

-- Modifică tipul coloanei images la JSONB dacă este arraytext
ALTER TABLE "Cars" 
  ALTER COLUMN "images" TYPE JSONB USING 
    CASE 
      WHEN "images" IS NULL THEN '{}'::JSONB
      ELSE json_build_object('legacy', "images")::JSONB
    END;

-- Setează valoarea implicită
ALTER TABLE "Cars" ALTER COLUMN "images" SET DEFAULT '{}'::JSONB;