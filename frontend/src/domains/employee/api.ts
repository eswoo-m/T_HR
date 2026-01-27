import http from '../../services/http';
import type { Employee } from './types.ts';

export const employeeApi = {
    // 사원 등록
    register: (data: Employee) =>
        http.post('/employee/register', data),

    // 사원 목록 조회
    getAll: () =>
        http.get<Employee[]>('/employee'),

    // 특정 사원 상세 조회
    getOne: (code: string) =>
        http.get<Employee>(`/employee/${code}`),
};