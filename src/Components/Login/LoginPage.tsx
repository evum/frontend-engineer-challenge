import { useEffect, useState, type FC} from 'react';
import { useNavigate } from 'react-router';
import { Button, TextField, Typography } from '@mui/material';
import useLoginQuery from '../../api/useLoginQuery';
import BackgroundPanel from '../Common/BackgroundPanel';
import PasswordInput from '../Common/PasswordInput';
import './LoginPage.css';

interface ILoginPage {
	onLoginUpdated?: () => void;
};

const LoginPage: FC<ILoginPage> = ({onLoginUpdated}: ILoginPage) => {
	const navigate = useNavigate();
	const {mutate: loginMutate, data: loginData, error: loginError} = useLoginQuery();
	const [email, setEmail] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const [isFldsMutated, setFldsMutated] = useState<boolean>(false);

	useEffect(() => {
		if (loginData?.data?.authenticate?.accessToken) { navigate('/'); }
		if (loginData?.data?.authenticate?.accessToken && onLoginUpdated) { onLoginUpdated(); }
	}, [loginData, onLoginUpdated, navigate]);

	const onLoginClicked = () => {
		loginMutate({email, password: pass});
		setFldsMutated(false);
	};

	const onEmailChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		setEmail(evt.target.value);
		setFldsMutated(true);
	};

	const onPassChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		setPass(evt.target.value);
		setFldsMutated(true);
	};

	const onForgotBtnClick = () => navigate('/recovery');

	return <BackgroundPanel
		footer={
			<Typography className='o-lp-registration'>
				Ещё не зарегистрированы?
				<Button onClick={() => navigate('/registration')}>
					Регистрация
				</Button>
			</Typography>
		}
	>
		<Typography className='o-lp-login-header'>
			Войти в систему
		</Typography>
		<TextField
			className='o-lp-input'
			variant='standard'
			label='Введите email'
			value={email}
			onChange={onEmailChange}
			error={(loginData?.errors?.length && !isFldsMutated) || loginError}
			helperText={loginData?.errors?.length && !isFldsMutated ? 'Введены неверные данные' : loginError?.message || ''}
		/>
		<PasswordInput
			className='o-lp-input'
			variant='standard'
			label='Введите пароль'
			value={pass}
			onChange={onPassChange}
			error={loginData?.errors?.length && !isFldsMutated}
			helperText={loginData?.errors?.length && !isFldsMutated ? 'Введены неверные данные' : ''}
		/>
		<Button
			className='o-lp-login-btn'
			variant='contained'
			onClick={onLoginClicked}
		>
			Войти
		</Button>
		<Button
			className='o-lp-pass-forgot-btn'
			onClick={onForgotBtnClick}
		>
			Забыли пароль?
		</Button>
	</BackgroundPanel>;
};

export default LoginPage;
