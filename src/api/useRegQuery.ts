import { useMutation } from '@tanstack/react-query';

const queryStr = 'mutation Register($email: String!, $password: String!) { register(input: { email: $email, password: $password }) { id email } }';
const baseUrl = import.meta.env.BASE_REQUEST_URL || 'http://localhost:8000';

interface IProfileData {
	password: string;
	email: string;
};

const register = async (userData: IProfileData) => {
	const body = {
		operationName: 'Register',
		query: queryStr,
		variables: userData
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
	if (!res.ok) { throw new Error('При добавлении пользователя произошла ошибка') };
	return res.json();
};

const useRegQuery = () => useMutation({mutationFn: register});

export default useRegQuery
