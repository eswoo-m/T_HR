import React from 'react';
import { useEmployee } from './hooks.ts';
import type { Employee } from './types';
import { RegistrationBasic } from './components/RegistrationBasic';

/**
 * 사원 등록 페이지
 * - 도메인 훅(useEmployee)을 사용하여 비즈니스 로직을 연결합니다.
 * - 피그마에서 가져온 디자인 컴포넌트(HRRegistrationBasic)를 조립합니다.
 */
const RegisterPage: React.FC = () => {
    const { register, isLoading } = useEmployee();

    // 자식 컴포넌트(디자인)에서 '저장' 버튼을 눌렀을 때 실행될 함수
    const handleRegisterSubmit = async (formData: Employee) => {
        const success = await register(formData);
        if (success) {
            alert('등록 성공!');
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">인사 관리</h1>
                <p className="text-muted-foreground">신규 사원 정보를 등록하고 관리합니다.</p>
            </div>

            {/* 피그마에서 가져온 UI 컴포넌트
         - onSubmit: 우리가 만든 등록 함수 전달
         - isLoading: 버튼 로딩 상태 표시용
      */}
            <RegistrationBasic onSubmit={handleRegisterSubmit} isLoading={isLoading} />
        </div>
    );
};

export default RegisterPage;