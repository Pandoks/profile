<script lang="ts">
  import { onMount } from 'svelte';

  let Plaid: any;
  let plaid_login: any;
  let transactions: any;

  const getLinkToken = async () => {
    const res = await fetch('http://localhost:3000/api/link_token');
    const data = await res.json();
    return data.link_token;
  };

  const exchangePublicToken = async (public_token: any) => {
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
    Plaid = window.Plaid;
    plaid_login = await createLogin();
  });

  const getTransactions = async () => {
    const res = await fetch('http://localhost:3000/api/transactions');
    const data = await res.json();
    transactions = data.added;
    console.log(data);
  };
</script>

<svelte:head>
  <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<button on:click={plaid_login.open()}>Link Account</button>
<button on:click={getTransactions}>Get Transactions</button>
{#if transactions}
  {#each transactions as transaction}
    <div>{transaction.amount} {transaction.name} {transaction.date}</div>
  {/each}
{/if}
