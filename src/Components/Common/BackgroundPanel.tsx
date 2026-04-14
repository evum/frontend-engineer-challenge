import type { ReactNode, FC } from 'react';
import { Box } from '@mui/material';
import Logo from './Logo';
import './BackgroundPanel.css';

interface IBackgroundPanel {
	children: ReactNode;
	footer: ReactNode;
}

const BackgroundPanel: FC<IBackgroundPanel> = ({children, footer}) =>
	<Box className='o-background-panel-container'>
		<Box className='o-inputs-container'>
			<Logo/>
			<Box className='o-inputs'>
				{children}
			</Box>
			{footer ? <Box className='o-footer-container'>
				{footer}
			</Box>
			: <></>}
		</Box>
		<Box className='o-background-image'/>
	</Box>;

export default BackgroundPanel;
