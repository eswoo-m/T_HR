import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// 학력 정보 인터페이스
interface AcademicEducation {
  id: string;
  level: string;
  school: string;
  major: string;
  admissionDate: string;
  graduationDate: string;
  status: string;
}

// 학교 데이터베이스
const schoolDatabase: Record<string, string[]> = {
  '서울대학교': ['컴퓨터공학', '전기전자공학', '기계공학', '경영학', '경제학', '법학', '의학'],
  '연세대학교': ['컴퓨터과학', '전기전자공학', '신소재공학', '경영학', '경제학', '심리학'],
  '고려대학교': ['컴퓨터학과', '전기전자공학부', '기계공학부', '경영학과', '경제학과', '법학과'],
  'KAIST': ['전산학부', '전기및전자공학부', '기계공학과', '산업및시스템공학과', '물리학과'],
  'POSTECH': ['컴퓨터공학과', '전자전기공학과', '기계공학과', '산업경영공학과', '화학공학과'],
  '성균관대학교': ['소프트웨어학과', '전자전기공학부', '기계공학부', '경영학과', '경제학과'],
  '한양대학교': ['컴퓨터소프트웨어학부', '전자공학부', '기계공학부', '경영학부', '건축학부'],
  '중앙대학교': ['소프트웨어학부', '전자전기공학부', '기계공학부', '경영학부', '미디어커뮤니케이션학부'],
  '경희대학교': ['컴퓨터공학과', '전자공학과', '기계공학과', '경영학과', '호텔경영학과'],
  '서강대학교': ['컴퓨터공학과', '전자공학과', '기계공학과', '경영학과', '경제학과'],
};

interface AcademicEducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education: AcademicEducation | null;
  onSave: (education: AcademicEducation) => void;
}

export function AcademicEducationDialog({
  open,
  onOpenChange,
  education,
  onSave
}: AcademicEducationDialogProps) {
  const [formData, setFormData] = useState<AcademicEducation>({
    id: '',
    level: '',
    school: '',
    major: '',
    admissionDate: '',
    graduationDate: '',
    status: '',
  });

  const [isSchoolSearched, setIsSchoolSearched] = useState(false);
  const [availableMajors, setAvailableMajors] = useState<string[]>([]);
  const [isDirectInput, setIsDirectInput] = useState(false);

  // education이 변경될 때 formData 업데이트
  useState(() => {
    if (open) {
      if (education) {
        setFormData(education);
        setIsSchoolSearched(true);
        if (schoolDatabase[education.school]) {
          setAvailableMajors(schoolDatabase[education.school]);
          const isInList = schoolDatabase[education.school].includes(education.major);
          setIsDirectInput(!isInList);
        } else {
          setAvailableMajors([]);
          setIsDirectInput(true);
        }
      } else {
        setFormData({
          id: Date.now().toString(),
          level: '',
          school: '',
          major: '',
          admissionDate: '',
          graduationDate: '',
          status: '',
        });
        setIsSchoolSearched(false);
        setAvailableMajors([]);
        setIsDirectInput(false);
      }
    }
  });

  const handleSearchSchool = () => {
    if (!formData.level) {
      toast.error('학력을 먼저 선택해주세요.');
      return;
    }

    if (!formData.school || formData.school.trim() === '') {
      toast.error('학교명을 입력해주세요.');
      return;
    }

    const majors = schoolDatabase[formData.school];

    if (!majors || majors.length === 0) {
      toast.info(`'${formData.school}'의 전공 목록이 없습니다. 전공을 직접 입력해주세요.`);
      setIsSchoolSearched(true);
      setAvailableMajors([]);
      setIsDirectInput(true);
      setFormData({ ...formData, major: '' });
      return;
    }

    setIsSchoolSearched(true);
    setAvailableMajors(majors);
    setIsDirectInput(false);
    setFormData({ ...formData, major: '' });
    toast.success(`${formData.school}의 전공 목록을 불러왔습니다.`);
  };

  const handleSave = () => {
    if (!formData.level) {
      toast.error('학력을 선택해주세요.');
      return;
    }

    if (!formData.school) {
      toast.error('학교명을 입력해주세요.');
      return;
    }

    if (!isSchoolSearched) {
      toast.error('학교를 조회해주세요.');
      return;
    }

    if (!formData.major) {
      toast.error('전공을 선택해주세요.');
      return;
    }

    if (!formData.status) {
      toast.error('학력 상태를 선택해주세요.');
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{education ? '학력 수정' : '학력 추가'}</DialogTitle>
          <DialogDescription>
            학력과 학교명을 입력한 후 조회 버튼을 클릭하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">
                  학력 <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => {
                    setFormData({ ...formData, level: value });
                    setIsSchoolSearched(false);
                    setAvailableMajors([]);
                  }}
                  disabled={!!education}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="박사">박사</SelectItem>
                    <SelectItem value="석사">석사</SelectItem>
                    <SelectItem value="학사">학사</SelectItem>
                    <SelectItem value="전문학사">전문학사</SelectItem>
                    <SelectItem value="고졸">고졸</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">
                  학교명 <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.school}
                    onChange={(e) => {
                      setFormData({ ...formData, school: e.target.value });
                      setIsSchoolSearched(false);
                      setAvailableMajors([]);
                    }}
                    placeholder="예: 서울대학교"
                    disabled={!!education}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSearchSchool}
                    disabled={!!education}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    조회
                  </Button>
                </div>
              </div>
            </div>

            {isSchoolSearched && (
              <div className={`mt-3 p-3 border rounded-md ${
                availableMajors.length > 0
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
              }`}>
                <p className={`text-sm flex items-center gap-2 ${
                  availableMajors.length > 0
                    ? 'text-green-800 dark:text-green-400'
                    : 'text-blue-800 dark:text-blue-400'
                }`}>
                  <Search className="h-4 w-4" />
                  {availableMajors.length > 0
                    ? `${formData.school} 조회 완료 - ${availableMajors.length}개의 전공이 있습니다`
                    : `${formData.school} 조회 완료 - 전공을 직접 입력해주세요`
                  }
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                전공 <span className="text-destructive">*</span>
              </label>
              {isDirectInput ? (
                <div className="flex gap-2">
                  <Input
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="전공을 직접 입력하세요"
                  />
                  {!education && availableMajors.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDirectInput(false);
                        setFormData({ ...formData, major: '' });
                      }}
                      className="shrink-0"
                    >
                      목록선택
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.major}
                    onValueChange={(value) => setFormData({ ...formData, major: value })}
                    disabled={!isSchoolSearched || availableMajors.length === 0}
                  >
                    <SelectTrigger className={!isSchoolSearched ? 'bg-muted' : ''}>
                      <SelectValue placeholder={!isSchoolSearched ? '학교를 먼저 조회하세요' : '전공을 선택하세요'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!education && isSchoolSearched && availableMajors.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDirectInput(true);
                        setFormData({ ...formData, major: '' });
                      }}
                      className="shrink-0"
                    >
                      직접입력
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                상태 <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="졸업">졸업</SelectItem>
                  <SelectItem value="수료">수료</SelectItem>
                  <SelectItem value="재학">재학</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">입학일</label>
              <Input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">졸업일</label>
              <Input
                type="date"
                value={formData.graduationDate}
                onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button onClick={handleSave}>
            {education ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
