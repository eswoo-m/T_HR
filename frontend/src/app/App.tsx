import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from '../domains/employee/RegisterPage.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 주소창에 /register를 치면 우리가 만든 페이지가 나옵니다 */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 기본 홈 화면 */}
                <Route path="/" element={<h1>HR 시스템 홈</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;