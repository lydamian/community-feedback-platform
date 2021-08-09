#!/bin/bash
 
###################################################
# Bash script to create database and seed 
###################################################

# Variable Definitions
# Path to directory bash script is living
HOST="localhost";
PORT="5433";

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Database Variable Definitions
DATABASE="community_feedback_db"
USER="postgres"

### Import Our Database ###
# Dont specify a database since CREATE DATABASE is in schema.sql
SCHEMA="$DIR/lib/databases/pg-schema.sql"

echo $DIR
psql -U $USER -h $HOST -p $PORT < $SCHEMA

