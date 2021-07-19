#!/bin/bash


# SEED MONGO

echo "*** waiting until mongo starts up"
host=`echo $DOCKER_HOST | sed -E 's/tcp:\/\/([a-z0-9\.]+):([0-9]+)/\1/' | sed 's/^$/127.0.0.1/'`

if [[ $host = *"docker.sock"* ]]; then
  echo "found local docker socket, going to use 127.0.0.1 to connect"
  host="127.0.0.1"
fi

while ! curl http://$(echo $host):27017
do
  echo "*** $(date) - still trying, if it NEVER starts try running clean.sh"
  sleep 1
done
echo "*** $(date) - connected successfully"

echo "*** I will now seed mongo..."

usercount=`docker run --rm --net raya_raya --link raya_mongo_1:mongo mongo:3.6.16 bash -c 'mongo --host mongo instagram-api-mock --eval "print(db.users.count())"' | tail -n 1`
if [ $usercount -gt 0 ]
then
  echo "*** already seeded instagram-api-mock... dropping db"
  docker run --rm --net raya_raya --link raya_mongo_1:mongo mongo:3.6.16 bash -c 'mongo --host mongo instagram-api-mock --eval "db.dropDatabase()"'
else
    echo "*** didnt find instagram-api-mock... nothing to drop"
fi

docker stop mongo1
docker create --name mongo1 --rm --net raya_raya --link raya_mongo_1:mongo mongo:3.6.16
docker start $(docker exec -d mongo1 ls 3>&1 1>&2 2>&3 3>&- | sed 's/.*Container //g' | sed 's/ is not running//g')
docker cp $(pwd)/instagram-api-mock/dump/instagram-api-mock mongo1:/backup
docker exec -i mongo1 bash -c "mongorestore --host mongo --port 27017 --db instagram-api-mock --dir /backup; exit"
docker stop mongo1

echo "*** seeding mongo complete"

# SEED POSTGRES

echo "*** waiting until postgres starts up"

until docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c '\l'" > /dev/null; do
    >&2 echo "$(date) - still trying, if it NEVER starts try running clean.sh"
    sleep 1
done

echo "*** $(date) - connected successfully"

echo "*** I will now seed postgres..."

docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c 'drop schema if exists public cascade; create schema public;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/instagram' -c 'drop schema if exists public cascade; create schema public;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_log' -c 'drop schema if exists public cascade; create schema public;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_analytics' -c 'drop schema if exists public cascade; create schema public;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_relationships' -c 'drop schema if exists public cascade; create schema public;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c 'CREATE DATABASE instagram;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c 'CREATE DATABASE raya_log;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c 'CREATE DATABASE raya_relationships;'"
docker run --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5 bash -c "psql 'postgres://raya:password@postgres/raya_main' -c 'CREATE DATABASE raya_analytics;'"

docker stop pg1
docker create -e POSTGRES_PASSWORD='password' -e POSTGRES_USERNAME='username' \
       --name pg1 --rm --net raya_raya --link raya_postgres_1:postgres postgis/postgis:12-2.5
docker start $(docker exec -d pg1 ls 3>&1 1>&2 2>&3 3>&- | sed 's/.*Container //g' | sed 's/ is not running//g')

docker cp $(pwd)/raya-backend/lib/database-connections/main-pg-schema.sql pg1:/main-pg-schema.sql
docker exec -i pg1 bash -c "psql 'postgres://raya:password@postgres/raya_main' -a -f '/main-pg-schema.sql' > dev/null; exit"

docker cp $(pwd)/raya-backend/lib/database-connections/log-pg-schema.sql pg1:/log-pg-schema.sql
docker exec -i pg1 bash -c "psql 'postgres://raya:password@postgres/raya_log' -a -f '/log-pg-schema.sql' > dev/null; exit"

docker cp $(pwd)/raya-backend/lib/database-connections/relationships-pg-schema.sql pg1:/relationships-pg-schema.sql
docker exec -i pg1 bash -c "psql 'postgres://raya:password@postgres/raya_relationships' -a -f '/relationships-pg-schema.sql' > dev/null; exit"

docker cp $(pwd)/raya-backend/lib/instagram/feed/cache/schema.sql pg1:/schema.sql
docker exec -i pg1 bash -c "psql 'postgres://raya:password@postgres/instagram' -a -f '/schema.sql' > dev/null; exit"

docker cp $(pwd)/Analytics-Dash/migration/analytics_schema.sql pg1:/analytics_schema.sql
docker exec -i pg1 bash -c "psql 'postgres://raya:password@postgres/raya_analytics' -a -f '/analytics_schema.sql' > dev/null; exit"

docker stop pg1

echo "*** seeding postgres complete"