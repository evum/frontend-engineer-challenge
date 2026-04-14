import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import LoginPage from '../Components/Login/LoginPage';
import { mockNavigate } from './mocks/react-router';
import './mocks/react-router';
vi.mock('../api/useLoginQuery');
import useLoginQuery from '../api/useLoginQuery';

const renderWithProviders = (ui: React.ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{ui}</MemoryRouter>
		</QueryClientProvider>
	);
};
describe('LoginPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});
	console.log('должен отображать форму входа');
	it('должен отображать форму входа', () => {
		vi.mocked(useLoginQuery).mockReturnValue({
			mutate: vi.fn(),
			mutateAsync: vi.fn(),
			data: null,
			error: null,
			isIdle: true,
			isPending: false,
			isSuccess: false,
			isError: false,
			reset: vi.fn(),
		} as any);

		renderWithProviders(<LoginPage />);
		expect(screen.getByText('Войти в систему')).toBeInTheDocument();
	});

	it('должен вызывать мутацию при сабмите', async () => {
		const mockMutate = vi.fn();
		vi.mocked(useLoginQuery).mockReturnValue({
			mutate: mockMutate,
			data: null,
			error: null,
		} as any);

		const user = userEvent.setup();
		renderWithProviders(<LoginPage />);

		await user.type(screen.getByLabelText('Введите email'), 'test@test.com');
		await user.type(screen.getByLabelText('Введите пароль'), 'password123');
		await user.click(screen.getByRole('button', { name: 'Войти' }));

		expect(mockMutate).toHaveBeenCalledWith({
			email: 'test@test.com',
			password: 'password123',
		});
	});

	it('должен переходить на страницу регистрации', async () => {
		vi.mocked(useLoginQuery).mockReturnValue({ mutate: vi.fn(), data: null } as any);
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />);
		await user.click(screen.getByRole('button', { name: 'Регистрация' }));
		expect(mockNavigate).toHaveBeenCalledWith('/registration');
	});

	it('должен переходить на страницу восстановления', async () => {
		vi.mocked(useLoginQuery).mockReturnValue({ mutate: vi.fn(), data: null } as any);
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />);
		await user.click(screen.getByRole('button', { name: 'Забыли пароль?' }));
		expect(mockNavigate).toHaveBeenCalledWith('/recovery');
	});
});
