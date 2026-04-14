import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import BackgroundPanel from '../Common/BackgroundPanel';
import useRegQuery from '../../api/useRegQuery';
import PasswordInput from '../Common/PasswordInput';
import './RegPage.css';

const RegPage: FC = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const [duplicatedPass, setDuplicatedPass] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');
	const [passError, setPassError] = useState<string>('');

	const {mutate, data: regResult, error: isRegError} = useRegQuery();

	const onRegBtnClick = () => mutate({email, password: pass});

	const onEmailChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		const value = evt.target.value;
		const isCorrect = value.match(/([A-Z]|[a-z]|[0-9])+@[a-z]+\.[a-z]{2,3}/);
		setEmail(value);
		setEmailError(isCorrect ? '' : 'Недопустимый адрес почты');
	};

	const onPassChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		const value = evt.target.value;
		const isUpperInclude = value.match(/[A-Z]/);
		const isSmallInclude = value.match(/[a-z]/);
		const isNumberInclude = value.match(/[0-9]/);
		const isCorrect = isUpperInclude && isSmallInclude && isNumberInclude && value.length >= 12;
		setPass(value);
		setPassError(isCorrect ? '' : 'Пароль должен состоять из заглавных и печатных символов, цифр и иметь длину не менее 12');
	};
	
	const onDlgClose = () => navigate('/login');

	const regError = regResult?.errors?.[0]?.message || isRegError?.message;
	return <>
		<BackgroundPanel
			footer={
				<Typography className='o-rp-login'>
					Уже есть аккаунт?
					<Button onClick={() => navigate('/login')}>
						Войти
					</Button>
				</Typography>
			}
		>
			<Typography className='o-rp-reg-header'>
				Регистрация в системе
			</Typography>
			<TextField
				className='o-rp-input'
				variant='standard'
				label='Введите email'
				value={email}
				error={!!emailError || regError}
				helperText={emailError || (regError == 'User with this email already exists' ? 'Данный адрес уже занят' : regError || '')}
				onChange={onEmailChange}
			/>
			<PasswordInput
				className='o-rp-input'
				variant='standard'
				label='Введите пароль'
				value={pass}
				error={pass != duplicatedPass || !!passError}
				helperText={passError}
				onChange={onPassChange}
			/>
			<PasswordInput
				className='o-rp-input'
				variant='standard'
				label='Повторите пароль'
				value={duplicatedPass}
				error={pass != duplicatedPass || !!passError}
				helperText={pass != duplicatedPass ? 'Пароли не совпадают' : passError || ''}
				onChange={(evt) => setDuplicatedPass(evt.target.value)}
			/>
			<Button
				className='o-rp-reg-btn'
				variant='contained'
				onClick={onRegBtnClick}
			>
				Зарегистрироваться
			</Button>
			<Typography className='o-rp-conditions'>
				Зарегистрировавшись пользователь принимает условия <a href='/'>договора оферты</a> и <a href='/'>политики конфиденциальности</a>
			</Typography>
		</BackgroundPanel>
		{regResult?.data?.register && <Dialog
			open={regResult?.data?.register}
			onClose={onDlgClose}
		>
			<DialogTitle>Вы успешно зарегистрированы</DialogTitle>
			<DialogContent>
				<DialogContentText>Вы успешно зарегистрировались и теперь можете войти в свой аккаунт</DialogContentText>
			</DialogContent>
			<DialogActions>
          		<Button onClick={onDlgClose}>Перейти на страницу логина</Button>
			</DialogActions>
		</Dialog>}
	</>
};

export default RegPage;
