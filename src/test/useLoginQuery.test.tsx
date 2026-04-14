import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useLoginQuery from '../api/useLoginQuery';

const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	clear: vi.fn(),
	removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.fetch = vi.fn();

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useLoginQuery', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('должен вызывать fetch с правильными параметрами и сохранять токен', async () => {
		const mockToken = 'test-token';
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ data: { authenticate: { accessToken: mockToken } } }),
		} as Response);

		const { result } = renderHook(() => useLoginQuery(), {
			wrapper: createWrapper(),
		});

		result.current.mutate({ email: 'test@test.com', password: 'password123' });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:8000/graphql/',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: expect.stringContaining('Authenticate'),
			})
		);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
	});

	it('должен обрабатывать ошибку', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: false,
			status: 401,
		} as Response);

		const { result } = renderHook(() => useLoginQuery(), {
			wrapper: createWrapper(),
		});

		result.current.mutate({ email: 'bad@test.com', password: 'wrong' });

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.error).toBeDefined();
	});
});
