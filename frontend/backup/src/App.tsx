import { ProjectOrgInfo } from './components/ProjectOrgInfo';
import { ProjectRegistrationBasic } from './components/ProjectRegistrationBasic';
import { ProjectRegistrationGoals } from './components/ProjectRegistrationGoals';
import { MyInfo } from './components/MyInfo';
import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Button } from './components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';
import { Input } from './components/ui/input';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem, 
  SidebarProvider, 
  SidebarTrigger 
} from './components/ui/sidebar';
import { 
  Users, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown, 
  PieChart, 
  UsersRound, 
  CircleDollarSign, 
  Package, 
  UserCog, 
  FileText, 
  Shield, 
  UserCircle, 
  BarChart3, 
  FileSearch, 
  UserPlus, 
  User, 
  Award, 
  Briefcase, 
  FileOutput, 
  Building2, 
  Info, 
  ClipboardList, 
  UserCog2, 
  Code, 
  UsersIcon, 
  LayoutDashboard, 
  FolderKanban, 
  Network, 
  History, 
  GitBranch, 
  RefreshCw 
} from 'lucide-react';

// Dashboard Components
import { ProjectSummary } from './components/ProjectSummary';
import { ResourceAllocation } from './components/ResourceAllocation';
import { ResourceAvailability } from './components/ResourceAvailability';
import { ResourceComposition } from './components/ResourceComposition';
import { AssetDashboard } from './components/AssetDashboard';
import { ManpowerManagement } from './components/ManpowerManagement';

// HR Management Components
import { HRAnalysis } from './components/HRAnalysis';
import { HRBasicInfo } from './components/HRBasicInfo';
import { HRBasicInfoEdit } from './components/HRBasicInfoEdit';
import { HRCompetencyInfo } from './components/HRCompetencyInfo';
import { HRPastCareerInfo } from './components/HRPastCareerInfo';
import { HRProjectCareerInfo } from './components/HRProjectCareerInfo';
import { HRTechResume } from './components/HRTechResume';
import { HRRegistrationBasic } from './components/HRRegistrationBasic';
import { HRRegistrationOrgChange } from './components/HRRegistrationOrgChange';
import { HRRegistrationAsset } from './components/HRRegistrationAsset';

// Organization Components
import { OrganizationChart } from './components/OrganizationChart';
import { OrganizationHistory } from './components/OrganizationHistory';
import { OrganizationStructure } from './components/OrganizationStructure';

// Project Management Components
import { ProjectManagementAnalysis } from './components/ProjectManagementAnalysis';
import { ProjectInfoInquiry } from './components/ProjectInfoInquiry';
import { ProjectDetailView } from './components/ProjectDetailView';

// Asset Management Components
import { AssetAnalysis } from './components/AssetAnalysis';
import { AssetInquiry } from './components/AssetInquiry';
import { AssetDetailView } from './components/AssetDetailView';
import { AssetRegistration } from './components/AssetRegistration';

// System Management Components
import { CodeManagement } from './components/CodeManagement';
import { UserManagement } from './components/UserManagement';

const dashboardSubMenus = [
  { icon: PieChart, label: '프로젝트', id: 'project-summary' },
  { icon: UsersRound, label: '투입인력', id: 'allocated-resources' },
  { icon: Users, label: '인력가용', id: 'resource-availability' },
  { icon: BarChart3, label: '인력구성', id: 'resource-composition' },
  { icon: Package, label: '자산', id: 'assets' },
];

const menuItems = [
  { icon: FileText, label: '서식관리', id: 'form-management' },
  { icon: UserCircle, label: '내정보관리', id: 'my-info' },
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('project-summary');
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState<string | null>(null);
  const [selectedProjectCode, setSelectedProjectCode] = useState<string | null>(null);
  const [selectedAssetCode, setSelectedAssetCode] = useState<string | null>(null);
  const [selectedResumeEmployeeCode, setSelectedResumeEmployeeCode] = useState<string | null>(null); // 경력기술서용 직원 코드
  const [selectedTab, setSelectedTab] = useState<string>('basic'); // 초기 탭 상태 추가
  const [previousMenu, setPreviousMenu] = useState<string>('hr-basic-info'); // 이전 메뉴 추적
  const [previousProjectMenu, setPreviousProjectMenu] = useState<string>('project-basic-info'); // 프로젝트 이전 메뉴
  const [previousAssetMenu, setPreviousAssetMenu] = useState<string>('asset-detail-inquiry'); // 자산 이전 메뉴
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null); // 선택된 조직 정보
  
  // 하나의 상태로 열린 메뉴 관리
  const [openMenu, setOpenMenu] = useState<string>('dashboard');
  const [isHrInquiryOpen, setIsHrInquiryOpen] = useState(false);
  const [isHrRegistrationOpen, setIsHrRegistrationOpen] = useState(false);
  const [isProjectInquiryOpen, setIsProjectInquiryOpen] = useState(false);
  const [isAssetInquiryOpen, setIsAssetInquiryOpen] = useState(false);
  
  const handleEmployeeClick = (code: string, tab: string = 'basic') => {
    setSelectedEmployeeCode(code);
    setSelectedTab(tab);
    setPreviousMenu(activeMenu); // 현재 메뉴를 이전 메뉴로 저장
    setActiveMenu('hr-basic-info-edit');
  };

  const handleBackToList = () => {
    setSelectedEmployeeCode(null);
    setSelectedTab('basic');
    setActiveMenu(previousMenu); // 이전 메뉴로 돌아가기
  };

  const handlePrintResume = (code: string) => {
    setSelectedResumeEmployeeCode(code);
    setPreviousMenu(activeMenu); // 현재 메뉴를 이전 메뉴로 저장
    setActiveMenu('hr-resume-print');
  };

  const handleProjectClick = (code: string) => {
    setSelectedProjectCode(code);
    setPreviousProjectMenu(activeMenu); // 현재 메뉴를 이전 메뉴로 저장
    setActiveMenu('project-detail-view');
  };

  const handleBackToProjectList = () => {
    setSelectedProjectCode(null);
    setActiveMenu(previousProjectMenu); // 이전 메뉴로 돌아가기
  };

  const handleAssetClick = (code: string) => {
    setSelectedAssetCode(code);
    setPreviousAssetMenu(activeMenu); // 현재 메뉴를 이전 메뉴로 저장
    setActiveMenu('asset-detail-view');
  };

  const handleBackToAssetList = () => {
    setSelectedAssetCode(null);
    setActiveMenu(previousAssetMenu); // 이전 메뉴로 돌아가기
  };

  // 조직 선택 핸들러
  const handleOrganizationSelect = (orgData: any) => {
    setSelectedOrganization(orgData);
    setActiveMenu('org-structure');
  };

  // 대메뉴 열기/닫기 핸들러
  const handleMenuToggle = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? '' : menuName);
  };

  return (
    <SidebarProvider>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <div className="px-6 py-4">
              <h2 className="text-primary">T-HR</h2>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Dashboard with submenu */}
                  <Collapsible open={openMenu === 'dashboard'} onOpenChange={() => handleMenuToggle('dashboard')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <LayoutDashboard className="h-4 w-4" />
                          <span>대시보드</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'dashboard' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {dashboardSubMenus.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton
                                isActive={activeMenu === subItem.id}
                                onClick={() => setActiveMenu(subItem.id)}
                              >
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Organization Management with submenu */}
                  <Collapsible open={openMenu === 'org-mgmt'} onOpenChange={() => handleMenuToggle('org-mgmt')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Network className="h-4 w-4" />
                          <span>조직관리</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'org-mgmt' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* 조직도 조회 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'org-chart'}
                              onClick={() => setActiveMenu('org-chart')}
                            >
                              <GitBranch className="h-4 w-4" />
                              <span>조직도 조회</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 조직도 관리 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'org-structure'}
                              onClick={() => setActiveMenu('org-structure')}
                            >
                              <Building2 className="h-4 w-4" />
                              <span>조직도 관리</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 조직도 이력 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'org-history'}
                              onClick={() => setActiveMenu('org-history')}
                            >
                              <History className="h-4 w-4" />
                              <span>조직도 이력</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* HR Management with nested submenu */}
                  <Collapsible open={openMenu === 'hr'} onOpenChange={() => handleMenuToggle('hr')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <UserCog className="h-4 w-4" />
                          <span>인사관리</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'hr' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* 현황분석 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'hr-analysis'}
                              onClick={() => setActiveMenu('hr-analysis')}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span>인사현황</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 공수현황 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'hr-manpower-management'}
                              onClick={() => setActiveMenu('hr-manpower-management')}
                            >
                              <ClipboardList className="h-4 w-4" />
                              <span>공수현황</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 정보조회 - 통합 메뉴 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'hr-basic-info'}
                              onClick={() => setActiveMenu('hr-basic-info')}
                            >
                              <FileSearch className="h-4 w-4" />
                              <span>정보조회</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 정보등록 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'hr-registration-basic'}
                              onClick={() => setActiveMenu('hr-registration-basic')}
                            >
                              <UserPlus className="h-4 w-4" />
                              <span>신규등록</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 경력기술서 출력 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'hr-resume-print'}
                              onClick={() => setActiveMenu('hr-resume-print')}
                            >
                              <FileOutput className="h-4 w-4" />
                              <span>경력기술서 출력</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Project Management with nested submenu */}
                  <Collapsible open={openMenu === 'project-mgmt'} onOpenChange={() => handleMenuToggle('project-mgmt')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <FolderKanban className="h-4 w-4" />
                          <span>프로젝트관리</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'project-mgmt' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* 현황분석 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'project-analysis'}
                              onClick={() => setActiveMenu('project-analysis')}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span>현황분석</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 정보조회 - 단일 메뉴로 변경 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'project-inquiry'}
                              onClick={() => setActiveMenu('project-inquiry')}
                            >
                              <FileSearch className="h-4 w-4" />
                              <span>정보조회</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 정보등록 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'project-registration-basic'}
                              onClick={() => setActiveMenu('project-registration-basic')}
                            >
                              <UserPlus className="h-4 w-4" />
                              <span>정보등록</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Asset Management with nested submenu */}
                  <Collapsible open={openMenu === 'asset-mgmt'} onOpenChange={() => handleMenuToggle('asset-mgmt')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Package className="h-4 w-4" />
                          <span>자산관리</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'asset-mgmt' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* 현황분석 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'asset-analysis'}
                              onClick={() => setActiveMenu('asset-analysis')}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span>현황분석</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 조회/관리 - 단일 메뉴로 변경 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'asset-detail-inquiry'}
                              onClick={() => setActiveMenu('asset-detail-inquiry')}
                            >
                              <FileSearch className="h-4 w-4" />
                              <span>조회/관리</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 등록 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'asset-registration'}
                              onClick={() => setActiveMenu('asset-registration')}
                            >
                              <UserPlus className="h-4 w-4" />
                              <span>등록</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* System Management with submenu */}
                  <Collapsible open={openMenu === 'system-mgmt'} onOpenChange={() => handleMenuToggle('system-mgmt')}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Shield className="h-4 w-4" />
                          <span>시스템관리</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openMenu === 'system-mgmt' ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* 코드관리 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'system-code-management'}
                              onClick={() => setActiveMenu('system-code-management')}
                            >
                              <Code className="h-4 w-4" />
                              <span>코드관리</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* 계정관리 */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={activeMenu === 'system-user-management'}
                              onClick={() => setActiveMenu('system-user-management')}
                            >
                              <UsersIcon className="h-4 w-4" />
                              <span>계정관리</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Other menu items */}
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        isActive={activeMenu === item.id}
                        onClick={() => setActiveMenu(item.id)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm">홍길동</div>
                    <div className="text-xs text-muted-foreground">최고관리자</div>
                  </div>
                  <Avatar>
                    <AvatarFallback>홍길</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            {activeMenu === 'project-summary' && <ProjectSummary />}
            {activeMenu === 'allocated-resources' && <ResourceAllocation />}
            {activeMenu === 'resource-availability' && <ResourceAvailability />}
            {activeMenu === 'resource-composition' && <ResourceComposition />}
            {activeMenu === 'assets' && <AssetDashboard />}
            {activeMenu === 'asset-analysis' && <AssetAnalysis />}
            {activeMenu === 'asset-detail-inquiry' && <AssetInquiry onAssetClick={handleAssetClick} />}
            {activeMenu === 'asset-detail-view' && selectedAssetCode && <AssetDetailView assetCode={selectedAssetCode} onBack={handleBackToAssetList} />}
            {activeMenu === 'asset-registration' && <AssetRegistration />}
            {activeMenu === 'org-chart' && <OrganizationChart />}
            {activeMenu === 'org-history' && <OrganizationHistory onOrganizationSelect={handleOrganizationSelect} />}
            {activeMenu === 'org-structure' && <OrganizationStructure selectedOrganization={selectedOrganization} onClearSelection={() => setSelectedOrganization(null)} />}
            {activeMenu === 'hr-analysis' && <HRAnalysis />}
            {activeMenu === 'hr-basic-info' && <HRBasicInfo onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-basic-info-edit' && selectedEmployeeCode && <HRBasicInfoEdit employeeCode={selectedEmployeeCode} onBack={handleBackToList} initialTab={selectedTab} onPrintResume={handlePrintResume} />}
            {activeMenu === 'hr-competency' && <HRCompetencyInfo onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-past-career' && <HRPastCareerInfo onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-project-career' && <HRProjectCareerInfo onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-resume-print' && <HRTechResume onEmployeeClick={handleEmployeeClick} selectedEmployeeCode={selectedResumeEmployeeCode} />}
            {activeMenu === 'hr-registration-basic' && <HRRegistrationBasic onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-registration-org-change' && <HRRegistrationOrgChange onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-registration-asset' && <HRRegistrationAsset onEmployeeClick={handleEmployeeClick} />}
            {activeMenu === 'hr-manpower-management' && <ManpowerManagement />}
            {activeMenu === 'project-analysis' && <ProjectManagementAnalysis />}
            {activeMenu === 'project-inquiry' && <ProjectInfoInquiry onProjectClick={handleProjectClick} />}
            {activeMenu === 'project-detail-view' && selectedProjectCode && <ProjectDetailView projectCode={selectedProjectCode} onBack={handleBackToProjectList} />}
            {activeMenu === 'project-organization' && <ProjectOrgInfo />}
            {activeMenu === 'project-registration-basic' && <ProjectRegistrationBasic />}
            {activeMenu === 'project-registration-goals' && <ProjectRegistrationGoals />}
            {activeMenu === 'system-code-management' && <CodeManagement />}
            {activeMenu === 'system-user-management' && <UserManagement />}
            {activeMenu === 'my-info' && <MyInfo />}
            {!['project-summary', 'allocated-resources', 'resource-availability', 'resource-composition', 'assets', 'asset-analysis', 'asset-detail-inquiry', 'asset-detail-view', 'asset-registration', 'org-chart', 'org-history', 'org-structure', 'hr-analysis', 'hr-basic-info', 'hr-basic-info-edit', 'hr-competency', 'hr-past-career', 'hr-project-career', 'hr-resume-print', 'hr-registration-basic', 'hr-registration-org-change', 'hr-registration-asset', 'hr-manpower-management', 'project-analysis', 'project-inquiry', 'project-detail-view', 'project-organization', 'project-registration-basic', 'project-registration-goals', 'system-code-management', 'system-user-management', 'my-info'].includes(activeMenu) && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">준비 중입니다...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}