import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Logo from '../Components/Common/Logo';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('Logo', () => {
	it('должен переходить на главную при клике', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<Logo />
			</MemoryRouter>
		);

		const logo = document.querySelector('.o-logo-icon') as HTMLElement;
		await user.click(logo);
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
