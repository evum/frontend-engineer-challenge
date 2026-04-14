import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import LoginPage from './Components/Login/LoginPage';
import RegPage from './Components/Registration/RegPage';
import DashboardPage from './Components/Dashboard/DashboardPage';
import RecoveryPage from './Components/Recovery/RecoveryPage';
import ResetPassPage from './Components/Recovery/ResetPassPage';
import useCheckAuthorization from './api/useCheckAuthorization';
import './App.css';



function App() {
  const {mutate: checkAuthMutate, data: authResult} = useCheckAuthorization();
	const onLoginUpdated = () => {
    const token = localStorage.getItem('token');
    if (token) { checkAuthMutate(token); }
  };

  useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) { checkAuthMutate(token); }
	}, [checkAuthMutate]);

  return (
    <Routes>
      {authResult?.data?.me?.isActive
        ? <Route path='*' element={<DashboardPage/>}/>
        : <>
          <Route path='/registration' element={<RegPage/>}/>
          <Route path='/recovery' element={<RecoveryPage/>}/>
          <Route path='/reset-password' element={<ResetPassPage/>}/>
          <Route path='*' element={<LoginPage onLoginUpdated={onLoginUpdated}/>}/>
        </>}
    </Routes>
  )
}

export default App
