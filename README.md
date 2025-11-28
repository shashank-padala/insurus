This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### OpenAI
- `OPENAI_API_KEY` - Your OpenAI API key for AI verification

### VeChain Blockchain (Testnet)
- `VECHAIN_NETWORK=testnet` - Network to use (testnet or mainnet)
- `VECHAIN_TESTNET_URL=https://testnet.vechain.org` - VeChain testnet endpoint
- `VECHAIN_PRIVATE_KEY` - Private key of testnet wallet (generate from VeChain wallet)
- `VECHAIN_WALLET_ADDRESS` - Address of testnet wallet

**Note**: For VeChain testnet, you can get free testnet tokens from the VeChain faucet. The current implementation uses a placeholder that creates transaction hashes. To enable full VeChain integration, install the VeChain SDK packages and update the implementation in `src/lib/blockchain/vechain.ts`.

### Admin Dashboard
- `ADMIN_PASSWORD` - Password for accessing the admin dashboard at `/admin/login`. This password is used to authenticate admin users who can manage promotional banners and create admin tasks.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
