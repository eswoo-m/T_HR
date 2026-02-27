# 1. Node.js 환경 설정
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# (이 부분에 있던 RUN apk add... 줄을 삭제하세요!)

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 전체 파일 복사
COPY . .

# 5. Prisma 클라이언트 생성
RUN npx prisma generate

# 6. 빌드
RUN npm run build

# 7. 실행 설정
EXPOSE 3000
CMD ["npm", "run", "start:prod"]