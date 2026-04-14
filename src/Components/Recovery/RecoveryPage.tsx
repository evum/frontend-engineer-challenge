import { useState, type ChangeEvent, type FC } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, TextField, Typography } from '@mui/material';
import useRecoveryQuery from '../../api/useRecoveryQuery';
import PanelWithCenterControls from '../Common/PanelWithCenterControls';
import './RecoveryPage.css';

const RecoveryPage: FC = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');

	const {mutate: recoveryMutate, data: recoveryData, error: recoveryError} = useRecoveryQuery();

	const onEmailChanged = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		const value = evt.target.value;
		const isCorrect = value.match(/([A-Z]|[a-z]|[0-9])+@[a-z]+\.[a-z]{2,3}/);
		setEmail(value);
		setEmailError(isCorrect ? '' : 'Недопустимый адрес почты');
	};

	const onRecoveryBtnClick = () => {
		if (!email) {
			setEmailError('Поле не может быть пустым');
		} else {
			recoveryMutate(email);
		}
	};

	const onResetToLoginClick = () => navigate('/login');
	const resetData = recoveryData?.data?.requestPasswordReset;
	const resetLink = resetData?.resetUrlPreview;
	const isResetOk = resetData?.ok && resetLink;

	return <PanelWithCenterControls
		title={isResetOk
			? 'Проверьте свою почту'
			: <Box className='o-rp-recovery-title' onClick={() => window.history.back()}>
				<Box className='o-rp-back-icon'/>
				Восстановление пароля
			</Box>}
		subtitle={isResetOk
			? 'Мы отправили на почту письмо с ссылкой для восстановления пароля'
			: 'Укажите адрес почты на который был зарегистрирован аккаунт'}
	>
		{isResetOk
			? <Box>
				<Typography>В режиме разработки ссылка отображается ниже:</Typography>
				<a href={resetData.resetUrlPreview}>{resetData.resetUrlPreview}</a>
			</Box>
			: <TextField
				className='o-rp-email-input'
				label='Введите e-mail'
				variant='standard'
				onChange={onEmailChanged}
				value={email}
				error={emailError || (resetData && !resetData.resetUrlPreview) || recoveryError}
				helperText={emailError || (resetData && !resetData.resetUrlPreview ? 'Нет аккаунтов с таким e-mail' : recoveryError?.message || '')}
			/>
		}
		<Button
			className='o-rp-recovery-pass-btn'
			variant='contained'
			onClick={isResetOk ? onResetToLoginClick : onRecoveryBtnClick}
		>
			{isResetOk ? 'Назад в авторизацию' : 'Восстановить пароль'}
		</Button>
	</PanelWithCenterControls>;
};

export default RecoveryPage;
