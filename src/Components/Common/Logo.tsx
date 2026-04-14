import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import './Logo.css';

const Logo: FC = () => {
	const navigate = useNavigate();
	return <Box className='o-logo-icon' onClick={() => navigate('/')}/>;
}

export default Logo;
