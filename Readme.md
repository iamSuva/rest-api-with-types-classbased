npm init -y
npm i express
npm install --save-dev typescript @types/node @types/express ts-node nodemon

mkdir user-service
cd user-service
npm init -y

npm install express typeorm reflect-metadata pg dotenv bcrypt jsonwebtoken zod
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken

npm install -D tsx


## redis  
npm install redis

docker-compose.yml: 
version: "3.8"

services:
  redis:
    image: redis:7
    container_name: myapp-redis
    ports:
      - "6379:6379"


suvadip@LAPTOP-KNPL3TE9 MINGW64 /d/learning projects/learn nodejs/rest_api_types (feat-add-redis-cache)
$ docker compose up -d 

suvadip@LAPTOP-KNPL3TE9 MINGW64 /d/learning projects/learn nodejs/rest_api_types (feat-add-redis-cache)
$ docker exec -it rest-api-redis-redis redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> exit


Q: What Happens When You Restart Only Node Server
👉 YES — data will still be fetched from Redis after you restart your Node server,
👉 IF Redis container/server was not stopped.
Node process ❌ (cleared)
Redis server ✅ (still running)
Redis runs as a separate service (Docker container or system service).


## Email Notification Queue: 
User registers
   ↓
User saved in DB
   ↓
Add job to Redis queue
   ↓
API responds immediately
   ↓
Worker sends welcome email in background

npm install bullmq nodemailer

npm i -D @types/nodemailer

User → API → Queue.add()
                ↓
              Redis
                ↓
            Worker (listening)
                ↓
         processJob()
                ↓
         EmailService.send()


## Create your first migration
Option A – Empty migration (you write changes):
$ npm run migration:create src/migrations/CreateUserTable
Then open the new file and implement up and down (e.g. create/drop table to match User entity).
Option B – Generate from entity (DB must exist and be empty or already in sync):
Ensure DB is running and synchronize is false.
Run:
$ npm run migration:generate -- src/migrations/CreateUserTable
TypeORM will compare your entities to the DB and generate a migration file. If the DB is already in sync with the entity, it might generate an empty or no migration.


Run migrations
$ npm run migration:run
This runs all pending migrations. To undo the last one:
$ npm run migration:revert