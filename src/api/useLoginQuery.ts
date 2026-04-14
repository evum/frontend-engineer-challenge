import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryStr = 'mutation Authenticate($email: String!, $password: String!) { authenticate(input: { email: $email, password: $password }) { accessToken } }';
const baseUrl = import.meta.env.BASE_REQUEST_URL || 'http://localhost:8000';

interface ILoginData {
	password: string;
	email: string;
};

const login = async (loginData: ILoginData) => {
	const body = {
		operationName: 'Authenticate',
		query: queryStr,
		variables: loginData
	};
	let bodyStr;
	try {
		bodyStr = JSON.stringify(body);
	} catch (e) {
		console.error(e);
		throw new Error('Проверьте корректность введённых данных');
	}
	const res = await fetch(`${baseUrl}/graphql/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: bodyStr
	});
	if (!res.ok) { throw new Error('При логине произошла ошибка') };
	return res.json();
};

const useLoginQuery = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			queryClient.invalidateQueries({queryKey: ['me']});
			localStorage.setItem('token', data?.data?.authenticate?.accessToken || '');
		}
	});
}

export default useLoginQuery
