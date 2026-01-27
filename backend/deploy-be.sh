#!/bin/bash

# 1. 깃허브에 최신 코드 올리기 (로컬에서 실행)
echo "📤 깃허브에 최신 코드를 푸시합니다..."
git add .
git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
git push origin master

# 2. 서버에 접속해서 배포 작업 수행
echo "🔄 서버에서 백엔드 업데이트를 시작합니다..."
ssh [계정]@[서버IP] << 'EOF'
  cd ~/t_hr/backend  # 백엔드 소스가 있는 경로

  # 최신 코드 땡겨오기
  git pull origin master

  # 도커 이미지 빌드
  echo "🐳 도커 이미지 빌드 중..."
  docker build -t t-hr-backend .

  # 기존 컨테이너 교체 (3000번 포트 사용 가정)
  echo "🚀 컨테이너 재실행..."
  docker rm -f t-hr-api 2>/dev/null
  docker run -d \
    --name t-hr-api \
    -p 3000:3000 \
    --restart always \
    t-hr-backend

  echo "✅ 백엔드 배포 완료!"
EOF