<script lang="ts">
	import { onMount } from 'svelte';

	let Plaid: any;
	let plaid_login: any;

	const getLinkToken = async () => {
		console.log('getLinkToken');
		const res = await fetch('http://localhost:3000/api/link_token');
		const data = await res.json();
		console.log(data);
		return data.link_token;
	};

	const exchangePublicToken = async (public_token: any) => {
		console.log('exchangePublicToken');
		console.log(public_token);
		await fetch('http://localhost:3000/api/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ public_token: public_token })
		});
	};

	const createLogin = async () => {
		const token = await getLinkToken();
		const onSuccess = exchangePublicToken;
		const config = { token: token, onSuccess: onSuccess };
		return Plaid!.create(config);
	};

	onMount(async () => {
		console.log('onMount');
		Plaid = window.Plaid;
		plaid_login = await createLogin();
	});
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<button on:click={plaid_login.open()}>Link Account</button>
