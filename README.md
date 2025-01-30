# Skinventory for League of Legends
Created by Chien-hsueh Huang.

Have you ever logged into League, sat in the "My Shop" or "Crafting" page (RIP Hextech chests) and wondered what skins you should buy/enchant, what champions you don't have skins for, or what skins you have for a specific champ?

Well, Skinventory is made for you!

 No longer do you need to go to your inventory in the client and back onto the crafting page and then back onto your inventory and then *still* having trouble figuring out which champions you don't have skins for.

Keep your client open and launch Skinventory to see 
1. champions you own but don't have skins for and 
2. all champions you own and skins you own for each champ

all displayed in a simple layout that runs on your browser. 

## How to use
Download git and Node.js (and a package manager, I recommend pnpm) on Windows.

Clone this git repo with ```git clone``` in a terminal window

Open the League game client and log in.

Run the development server in a terminal window:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see Skinventory in action! If you didn't have the League client opened and logged in, refresh the page once you do.

Wait for the tool to retrieve the League Client credentials, connect to the League client API running locally on your computer, make calls to fetch data, and organize that data.

*Voilà!* 

**_Tip:_** use Ctrl+F to quicky find a champion you're looking for.

## How it works / what it's doing
ps-node is used to search through your running Windows processes to find the League of Legends game client. In the details that process, we can to find the League Client API's auth token and port number.

The League Client API is running locally when a user logs in to the client. Using the port number and auth token retrieved by ps-node, we can connect to the API at https://127.0.0.1:[port].

We call the ```/current-summoner``` endpoint to get the user's "Summoner ID", the ```owned-champions-minimal``` endpoint to get the IDs of the champions that the user owns, and ```/champions/[champId]/skins``` to get the skins owned for each of the owned champions.

We parse that data into the shape we want and find the skin splash arts from [Community Dragon](https://communitydragon.org/) for display

## Other developer notes
Big thank you to [Community Dragon](https://communitydragon.org/) for keeping such a complete collection of League assets.

Instead of API routes, I just used server functions. This is because I wanted practice with this in Nextjs and also I think the syntax is pretty nice for fairly simple server actions like these.

This tool unfortunately only works on Windows because it uses ps-node to search through processes in order to find the auth token and port number for the Client API, which changes every time the client is launched.

NODE_TLS_REJECT_UNAUTHORIZED is turned off because I was having trouble dealing with Riot Game's CA Cert.

React's Strict Mode is turned off because the dev server kept running my useEffect hooks twice with Strict Mode on.

There is a lot of further work to be done. I can throw the skins data into a db so the tool can actually query and have filter/sort/search options. 

Also further work: the code needs a lot of clean up. I have little to no error handling, no tests, and I should create components for most of the stuff in ```page.tsx``` (only advantage is you can see all the client side things in 1 file that's not *too* large and all server side things in another.)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

