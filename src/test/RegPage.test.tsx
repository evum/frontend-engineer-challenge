import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import RegPage from '../Components/Registration/RegPage';

vi.mock('../api/useRegQuery');
import useRegQuery from '../api/useRegQuery';

describe('RegPage', () => {
	const mockMutate = vi.fn();

	beforeEach(() => {
		vi.mocked(useRegQuery).mockReturnValue({
			mutate: mockMutate,
			data: null,
			error: null,
			isPending: false,
		} as any);
	});

	const renderComponent = () => {
		const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<RegPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('валидация email', async () => {
		const user = userEvent.setup();
		renderComponent();
		await user.type(screen.getByLabelText('Введите email'), 'invalid');
		await user.tab();
		expect(await screen.findByText('Недопустимый адрес почты')).toBeInTheDocument();
	});
});
