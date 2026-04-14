
import { useMutation } from '@tanstack/react-query';

const queryStr = 'mutation ResetPassword($token: String!, $newPassword: String!) {  resetPassword(input: {token: $token, newPassword: $newPassword})}';
const baseUrl = import.meta.env.BASE_REQUEST_URL || 'http://localhost:8000';

interface IResetPassData {
	newPassword: string,
	token: string
};

const login = async (data: IResetPassData) => {
	const body = {
		operationName: 'ResetPassword',
		query: queryStr,
		variables: data
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
	if (!res.ok) { throw new Error('При изменении пароля произошла ошибка') };
	return res.json();
};

const useSetNewPassword = () => useMutation({ mutationFn: login });

export default useSetNewPassword
