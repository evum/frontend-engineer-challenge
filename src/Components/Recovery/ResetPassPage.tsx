import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PanelWithCenterControls from '../Common/PanelWithCenterControls';
import useSetNewPassword from '../../api/useSetNewPassword';
import PasswordInput from '../Common/PasswordInput';
import './ResetPassPage.css';

const ResetPassPage: FC = () => {
	const navigate = useNavigate();

	const [pass, setPass] = useState<string>('');
	const [duplicatedPass, setDuplicatedPass] = useState<string>('');
	const [openErrDlg, setOpenErrDlg] = useState<boolean>(false);
	const [passError, setPassError] = useState<string>('');

	const {mutate: setPassMutate, data: setNewPassResult, reset: resetSetPassData, error: newPassErr} = useSetNewPassword();
	
	const onPassChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		const value = evt.target.value;
		const isUpperInclude = value.match(/[A-Z]/);
		const isSmallInclude = value.match(/[a-z]/);
		const isNumberInclude = value.match(/[0-9]/);
		const isCorrect = isUpperInclude && isSmallInclude && isNumberInclude && value.length >= 12;
		setPass(value);
		setPassError(isCorrect ? '' : 'Пароль должен состоять из заглавных и печатных символов, цифр и иметь длину не менее 12');
	};

	const onSetPassBtnClicked = () => {
		if (passError || !pass || pass != duplicatedPass) { return; }
		const urlParams = new URLSearchParams(document.location.search);
		const token = urlParams.get('token');
		if (!token) {
			setOpenErrDlg(true);
			return;
		}
		setPassMutate({newPassword: pass, token})
	};

	const onToLoginClick = () => navigate('/login');
	const onRetryClick = () => resetSetPassData();

	return <>
		<PanelWithCenterControls
			title={setNewPassResult?.data?.resetPassword
				? 'Пароль был восстановлен'
				: setNewPassResult?.errors || newPassErr
					? 'Пароль не был восстановлен'
					: 'Задайте пароль'
			}
			subtitle={setNewPassResult?.data?.resetPassword
				? 'Перейдите на страницу авторизации, чтобы войти в систему с новым паролем'
				: setNewPassResult?.errors || newPassErr
					? 'По каким-то причинам мы не смогли изменить ваш пароль. Попробуйте ещё раз через некоторое время.'
					: 'Напишите новый пароль, который будете использовать для входа'
			}
		>
			{setNewPassResult
				? <Button onClick={onToLoginClick} className='o-rpp-secondary-btn'>Назад в авторизацию</Button>
				: <>
					<PasswordInput
						className='o-rpp-pass-input'
						variant='standard'
						label='Введите пароль'
						value={pass}
						error={pass != duplicatedPass || !!passError}
						helperText={passError}
						onChange={onPassChange}
					/>
					<PasswordInput
						className='o-rpp-pass-input'
						variant='standard'
						label='Повторите пароль'
						value={duplicatedPass}
						error={pass != duplicatedPass || !!passError}
						helperText={pass != duplicatedPass ? 'Пароли не совпадают' : passError || ''}
						onChange={(evt) => setDuplicatedPass(evt.target.value)}
					/>
					<Button
						className='o-rpp-set-pass-btn'
						variant='contained'
						onClick={onSetPassBtnClicked}
					>
						Изменить пароль
					</Button>
				</>
			}
			{(setNewPassResult?.errors || newPassErr) && <Button
				onClick={onRetryClick}
				className='o-rpp-retry-btn'
			>
				Попробовать заново
			</Button>}
		</PanelWithCenterControls>
		{openErrDlg && <Dialog
			open={openErrDlg}
			onClose={() => setOpenErrDlg(false)}
		>
			<DialogTitle>Ошибка!</DialogTitle>
			<DialogContent>
				<DialogContentText>Проверьте корректность ссылки восстановления пароля и повторите попытку</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpenErrDlg(false)}>Закрыть</Button>
			</DialogActions>
		</Dialog>}
	</>
};

export default ResetPassPage;
