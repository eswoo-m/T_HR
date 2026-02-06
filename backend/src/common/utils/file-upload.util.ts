import * as fs from 'fs';
import * as path from 'path';

export const saveProfileImage = (base64String: string, employeeNo: string): string | null => {
  if (!base64String) return null;

  try {
    // 1. 저장할 폴더 설정 (프로젝트루트/public/uploads/profiles)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');

    // 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. Base64 헤더 파싱
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return null;
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    
    // 3. 파일 확장자 추출 (png, jpeg, jpg 등)
    // mime type에서 확장자를 가져옵니다. (image/jpeg -> jpeg)
    let extension = matches[1].split('/')[1];
    if (extension === 'jpeg') extension = 'jpg'; // jpeg는 jpg로 통일

    // ✅ [수정] 파일명을 '사번.확장자'로 설정 (예: 260101.jpg)
    // 사번이 같으면 기존 파일을 덮어쓰게 됩니다.
    const fileName = `${employeeNo}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // 4. 파일 쓰기 (기존 파일이 있으면 덮어씌움)
    fs.writeFileSync(filePath, imageBuffer);

    // 5. DB 저장용 경로 반환
    return `/uploads/profiles/${fileName}`;

  } catch (error) {
    console.error('프로필 이미지 저장 실패:', error);
    return null;
  }
};