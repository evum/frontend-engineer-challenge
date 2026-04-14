import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import App from '../App';

vi.mock('../api/useCheckAuthorization', () => ({
	default: vi.fn(() => ({
		mutate: vi.fn(),
		data: null,
		isPending: false,
	})),
}));

vi.mock('../Components/Login/LoginPage', () => ({
	default: () => <div>Login Page</div>,
}));
vi.mock('../Components/Dashboard/DashboardPage', () => ({
	default: () => <div>Dashboard Page</div>,
}));
vi.mock('../Components/Registration/RegPage', () => ({
	default: () => <div>Registration Page</div>,
}));
vi.mock('../Components/Recovery/RecoveryPage', () => ({
	default: () => <div>Recovery Page</div>,
}));
vi.mock('../Components/Recovery/ResetPassPage', () => ({
	default: () => <div>Reset Password Page</div>,
}));

import useCheckAuthorization from '../api/useCheckAuthorization';

describe('App routing', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	const renderApp = (initialRoute = '/') => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={[initialRoute]}>
					<App />
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('должен проверять токен из localStorage при монтировании', () => {
		const mockMutate = vi.fn();
	
		vi.mocked(useCheckAuthorization).mockReturnValue({
			mutate: mockMutate,
			data: null,
		} as any);

		localStorage.setItem('token', 'existing-token');
		renderApp();
		expect(mockMutate).toHaveBeenCalledWith('existing-token');
	});

	it('должен показывать страницу входа для неавторизованного пользователя', async () => {
		vi.mocked(useCheckAuthorization).mockReturnValue({
			mutate: vi.fn(),
			data: null,
		} as any);

		renderApp();
		await waitFor(() => {
			expect(screen.getByText('Login Page')).toBeInTheDocument();
		});
	});

	it('должен показывать Dashboard для авторизованного активного пользователя', async () => {
		vi.mocked(useCheckAuthorization).mockReturnValue({
			mutate: vi.fn(),
			data: { data: { me: { isActive: true } } },
		} as any);

		renderApp();
		await waitFor(() => {
			expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
		});
	});
});
