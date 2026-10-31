-- Two packages (Ubai, 30 Okt 2026): Basic gets the short skill iklan-video in the book; Pro also gets Ubai's skill
-- ubai-videoads as a download. Every code made before this one is a Basic code. Adds only; nothing is removed.

ALTER TABLE kod_akses ADD COLUMN pakej TEXT NOT NULL DEFAULT 'basic' CHECK (pakej IN ('basic', 'pro'));

-- Each Pro download, so a shared file can be traced back to the code and name that took it.
CREATE TABLE IF NOT EXISTS muat_turun (
  kod_hash TEXT NOT NULL,
  nama     TEXT NOT NULL,
  fail     TEXT NOT NULL,
  masa     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_muat_turun_kod ON muat_turun (kod_hash, masa);
