# OnlineMall Smart Escrow Agent

An **Enterprise Escrow AI Agent** built for the **Hedera** network (Hedera Bounty Week 2).

This project is intended to hold funds securely in escrow until delivery is verified via a **custom plugin**. Once delivery is confirmed, the agent can proceed to release funds according to the escrow rules.

## What’s in this repo

- Next.js (App Router) + TypeScript + TailwindCSS minimal skeleton
- API route: `app/api/chat/route.ts` (chat handler entrypoint)
- Plugin stub: `plugins/escrow-plugin.ts` (WIP delivery verification)

## Environment variables

Create a `.env.local` with:

- `NEXT_PUBLIC_HEDERA_NETWORK`
- `HEDERA_TESTNET_OPERATOR_ID`
- `HEDERA_TESTNET_OPERATOR_KEY`
- `GOOGLE_API_KEY`

## Development

```bash
npm install
npm run dev
```

