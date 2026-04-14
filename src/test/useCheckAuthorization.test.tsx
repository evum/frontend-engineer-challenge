import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCheckAuthorization from '../api/useCheckAuthorization';

global.fetch = vi.fn();

const createWrapper = () => {
	const queryClient = new QueryClient();
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useCheckAuthorization', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('должен отправлять запрос с токеном в заголовке', async () => {
		const token = 'valid-token';
		const mockUser = { id: '1', email: 'user@test.com', isActive: true };
		(fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ data: { me: mockUser } }),
		});

		const { result } = renderHook(() => useCheckAuthorization(), {
			wrapper: createWrapper(),
		});

		result.current.mutate(token);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:8000/graphql/',
			expect.objectContaining({
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
		);
		expect(result.current.data).toEqual({ data: { me: mockUser } });
	});
});
