import { useMutation } from '@tanstack/react-query';
const baseUrl = process.env.HOST_URL || 'http://localhost:8000';

const queryStr = 'query Me { me { id email isActive createdAt } }';

const checkAuth = async (token: string) => {
	const body = {
		operationName: 'Me',
		query: queryStr,
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
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
		body: bodyStr
	});
	if (!res.ok) { throw new Error('При проверке пользователя произошла ошибка') };
	return res.json();
};

const useCheckAuthorization = () => useMutation({mutationFn: checkAuth});

export default useCheckAuthorization
