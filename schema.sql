
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role;

CREATE Type user_role AS ENUM ('admin','user','owner'); 

CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    full_name    VARCHAR(60)  NOT NULL CHECK (char_length(full_name)>=20),
    email        VARCHAR(255)  NOT NULL UNIQUE,
    password     TEXT NOT NULL,
      address      VARCHAR(400),

    role         user_role NOT NULL DEFAULT 'user',
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now() 
);

CREATE TABLE stores (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(60) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    address     VARCHAR(400),
    owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ratings (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id    INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, store_id)
);


CREATE INDEX idx_users_name    ON users(name);
CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_role    ON users(role);

CREATE INDEX idx_stores_name    ON stores(name);
CREATE INDEX idx_stores_address ON stores(address);

CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id  ON ratings(user_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
 
CREATE TRIGGER trg_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
 
CREATE TRIGGER trg_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
