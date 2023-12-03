<script lang="ts">
	const Plaid = (window as any).Plaid;
	const handler = Plaid.create({});
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>
