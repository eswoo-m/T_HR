# 1. Node.js 환경 설정
FROM node:18-alpine

# 2. 내 컴퓨터의 backend 폴더 파일을 도커 안으로 복사
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 3. Prisma 클라이언트 생성 (Prisma를 쓰시니까 필수!)
RUN npx prisma generate

# 4. 빌드 및 실행
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]