import { useState, type FC } from 'react';
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordInput: FC<TextFieldProps> = ({...props}: TextFieldProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const preventDefaultClick = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

	return <TextField
		type={showPassword ? 'text' : 'password'}
		slotProps={{
			input: {
				endAdornment: <InputAdornment position='end'>
					<IconButton
						aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						onClick={handleClickShowPassword}
						onMouseDown={preventDefaultClick}
						onMouseUp={preventDefaultClick}
						edge='end'
					>
						{showPassword ? <VisibilityOff /> : <Visibility />}
					</IconButton>
				</InputAdornment>
			}
		}}
		{...props}
	/>;
};

export default PasswordInput;
