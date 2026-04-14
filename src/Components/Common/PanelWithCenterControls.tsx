import { type FC, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Logo from './Logo';
import './PanelWithCenterControls.css';

interface IPanelWithCenterControls {
	children: ReactNode;
	title: string | ReactNode;
	subtitle?: string;
};

const PanelWithCenterControls: FC<IPanelWithCenterControls> = ({children, title, subtitle}: IPanelWithCenterControls) =>
	<>
		<Logo/>
		<Box className='o-center-container'>
			<Box className='o-title'>{title}</Box>
			{subtitle && <Typography className='o-subtitle'>{subtitle}</Typography>}
			{children}
		</Box>
	</>;

export default PanelWithCenterControls;
