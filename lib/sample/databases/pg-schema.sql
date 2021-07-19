-- Seeing as we will be testing out this script alot we can destroy the db before creating everything again
DROP DATABASE IF EXISTS community-feedback-db;

-- Create the db
CREATE DATABASE community-feedback-db;

-- Move into the db
\c community-feedback-db

-- Create our table if it doesn't already exist
CREATE TABLE IF NOT EXISTS Sample
(
    key character varying(100),
    lang character varying(5),
    content text
);

-- Changes the owner of the table to postgres which is the default when installing postgres
ALTER TABLE Sample
    OWNER to postgres;