
import { useMutation } from '@tanstack/react-query';

const queryStr = 'mutation RequestPasswordReset($email: String!) { requestPasswordReset(input: { email: $email }) { ok deliveryMode resetUrlPreview } }';
const baseUrl = import.meta.env.BASE_REQUEST_URL || 'http://localhost:8000';

const login = async (email: string) => {
	const body = {
		operationName: 'RequestPasswordReset',
		query: queryStr,
		variables: { email}
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
	if (!res.ok) { throw new Error('При восстановлении пользователя произошла ошибка') };
	return res.json();
};

const useRecoveryQuery = () => useMutation({ mutationFn: login });

export default useRecoveryQuery
