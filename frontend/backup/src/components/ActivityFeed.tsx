import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, AlertCircle, MessageSquare, FileText, UserPlus } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'complete',
    user: '김민수',
    action: '작업을 완료했습니다',
    target: '웹사이트 리뉴얼 - UI 디자인',
    time: '2시간 전',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'comment',
    user: '이지은',
    action: '댓글을 남겼습니다',
    target: '모바일 앱 개발',
    time: '3시간 전',
    icon: MessageSquare,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'deadline',
    user: '시스템',
    action: '마감일이 임박합니다',
    target: '데이터베이스 마이그레이션',
    time: '5시간 전',
    icon: AlertCircle,
    color: 'text-orange-600',
  },
  {
    id: 4,
    type: 'document',
    user: '박준호',
    action: '문서를 업로드했습니다',
    target: 'UI/UX 디자인 시스템 가이드',
    time: '1일 전',
    icon: FileText,
    color: 'text-purple-600',
  },
  {
    id: 5,
    type: 'member',
    user: '최서연',
    action: '새 멤버를 초대했습니다',
    target: 'API 통합 프로젝트',
    time: '1일 전',
    icon: UserPlus,
    color: 'text-indigo-600',
  },
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>프로젝트 관련 최근 업데이트</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className={`flex-shrink-0 ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action}</span>
                </p>
                <p className="text-sm text-muted-foreground truncate">{activity.target}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
