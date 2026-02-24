npm init -y
npm i express
npm install --save-dev typescript @types/node @types/express ts-node nodemon

mkdir user-service
cd user-service
npm init -y

npm install express typeorm reflect-metadata pg dotenv bcrypt jsonwebtoken zod
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken

npm install -D tsx


// redis  
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


// Email Notification Queue: 
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
