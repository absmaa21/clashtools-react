# ClashTools
## Start the server
- Open a terminal
- Go into the directory
- `npm install`
- `npm run dev`

## How to use demo data (without java server)
- Open [env.ts](./src/env.ts) and change **skipNetwork** to **true** [](/src/env.ts)

## Admin Account
*Using demo data will always act as admin*
- First create an account
- Open the `ClashTools` Database
- Open the table `user-roles`
- Change the column `role` of your user to the number `2`
