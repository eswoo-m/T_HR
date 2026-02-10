import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid 필요 (없으면 랜덤 문자열로 대체 가능)

/**
 * Base64 이미지를 파일로 저장하고 경로를 반환하는 함수
 * @param base64Data 프론트에서 받은 Base64 문자열 (data:image/png;base64,...)
 * @param identifier 파일명에 붙일 식별자 (예: 사번)
 * @returns 저장된 파일의 상대 경로 (예: /uploads/profiles/12345_abcde.png) 또는 null
 */
export function saveProfileImage(base64Data: string, identifier: string): string | null {
  try {
    if (!base64Data) return null;

    // 1. Base64 헤더 파싱 (예: "data:image/png;base64," 부분 분리)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    // 헤더가 없거나 형식이 맞지 않으면 null 반환 (또는 원본 문자열이 이미 경로인 경우 그대로 반환 등 처리 가능)
    if (!matches || matches.length !== 3) {
      // 만약 base64가 아니라 이미 http 경로라면 저장 안 하고 리턴할 수도 있음
      if (base64Data.startsWith('http') || base64Data.startsWith('/')) {
          return base64Data; 
      }
      return null;
    }

    const type = matches[1]; // 예: image/png
    const data = matches[2]; // 실제 데이터
    const buffer = Buffer.from(data, 'base64');

    // 2. 확장자 추출
    const extension = type.split('/')[1];

    // 3. 저장 경로 설정 (프로젝트루트/uploads/profiles)
    // 주의: 실제 배포 시에는 정적 파일 제공 설정(StaticAssets)이 된 폴더여야 합니다.
    const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
    
    // 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. 고유한 파일명 생성 (사번_UUID.png)
    // uuid가 없다면 Date.now() 등을 사용해도 됩니다.
    const uniqueSuffix = uuidv4 ? uuidv4() : Date.now().toString();
    const fileName = `${identifier}_${uniqueSuffix}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // 5. 파일 저장
    fs.writeFileSync(filePath, buffer);

    // 6. DB에 저장할 웹 접근 경로 반환
    return `/uploads/profiles/${fileName}`;

  } catch (error) {
    console.error('❌ Profile Image Upload Failed:', error);
    return null;
  }
}