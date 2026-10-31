-- Access to the book: a buyer types their name and the access code from their Sellhiz purchase, once per device.
-- Codes are stored as SHA-256 of the normalised code, never as the code itself: a copy of this database gives no access.

CREATE TABLE IF NOT EXISTS kod_akses (
  kod_hash TEXT PRIMARY KEY,
  -- 1 = one named code every buyer of a package types (shown on the Sellhiz purchase page); 0 = one buyer's own code.
  kongsi   INTEGER NOT NULL DEFAULT 0,
  -- Devices a buyer's own code may be signed in on at once; the oldest is signed out past this. Ignored for kongsi.
  had      INTEGER NOT NULL DEFAULT 3,
  -- Which batch or sales channel, so one can be switched off alone.
  label    TEXT NOT NULL,
  aktif    INTEGER NOT NULL DEFAULT 1,
  dicipta  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sesi (
  token_hash TEXT PRIMARY KEY,
  kod_hash   TEXT NOT NULL REFERENCES kod_akses (kod_hash),
  nama       TEXT NOT NULL,
  dicipta    INTEGER NOT NULL,
  dilihat    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sesi_kod ON sesi (kod_hash, dicipta);

-- Every failed sign-in, so guessing is slowed per address. Successful sign-ins are not counted: a class on one
-- Wi-Fi signs in together.
CREATE TABLE IF NOT EXISTS cubaan (
  alamat TEXT NOT NULL,
  masa   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cubaan ON cubaan (alamat, masa);
