import { useState } from 'react';
import { employeeApi } from './api';
import type { Employee } from './types';
import { toast } from 'sonner';

export const useEmployee = () => {
    const [isLoading, setIsLoading] = useState(false);

    const register = async (data: Employee) => {
        setIsLoading(true);
        try {
            await employeeApi.register(data);
            toast.success('사원 등록이 완료되었습니다.');
            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message); // 실제 에러 객체인지 확인 후 사용
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading };
};