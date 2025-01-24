'use client';

import { useState } from 'react';
import Image from "next/image";
import { InitClient, GetSummonerId, GetChampsOwned, GetSkinsOwned} from '@/app/actions/clientActions';

//process.env.NODE_EXTRA_CA_CERTS="@/riotgames.pem";
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";
// console.log("NODE ENV");
// console.log(process.env.NODE_ENV);
// console.log(process.env.NODE_EXTRA_CA_CERTS);
// console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);

export default function Home() {
  const [creds, setCreds] = useState(null);
  const [summonerId, setSummonerId] = useState(null);
  const [champsOwned, setChampsOwned] = useState<number[]>([]);
  const [skinsOwned, setSkinsOwned] = useState<string[][][]>([]);
  const [champsWithoutSkins, setChampsWithoutSkins] = useState<string[]>([]);

  async function handleInitClient(){
    console.log("Handling init client");
    const data:any = await InitClient();
    console.log("data returned from InitClient: ", data);
    if (typeof localStorage !== "undefined"){
      console.log("saving clientPortNumber");
      localStorage.setItem("clientPortNumber", data.clientPortNumber);
      console.log("saving clientAuthToken");
      localStorage.setItem("clientAuthToken", data.clientAuthToken);}
    setCreds(data);
  }

  async function getSkinsOwnedFromChampsOwned(){
    let smmnrId = summonerId;
    let chmpsOwned = champsOwned;
    const clientAuthToken = localStorage.getItem('clientAuthToken')||"";
    const clientPortNumber = localStorage.getItem('clientPortNumber')||"";
    if (!(summonerId && champsOwned)){
      smmnrId = await GetSummonerId(clientAuthToken, clientPortNumber);
      setSummonerId(smmnrId);
      chmpsOwned = await GetChampsOwned(clientAuthToken, clientPortNumber)
      setChampsOwned(chmpsOwned);
    }
    
    let skinsOwned: string[][][] = []
    for (const id of chmpsOwned) {
      let data = await GetSkinsOwned(clientAuthToken, clientPortNumber, smmnrId, id);
      data && skinsOwned.push(data);
    }
    skinsOwned.sort();
    
    setSkinsOwned(skinsOwned);
  }

  async function getChampsWithNoSkinsOwned(){
    let smmnrId = summonerId;
    let chmpsOwned = champsOwned;
    const clientAuthToken = localStorage.getItem('clientAuthToken')||"";
    const clientPortNumber = localStorage.getItem('clientPortNumber')||"";
    if (!(summonerId && champsOwned)){
      smmnrId = await GetSummonerId(clientAuthToken, clientPortNumber);
      setSummonerId(smmnrId);
      chmpsOwned = await GetChampsOwned(clientAuthToken, clientPortNumber)
      setChampsOwned(chmpsOwned);
    }
    
    let champsWithNoSkinsOwned: string[] = []
    for (const id of chmpsOwned) {
      let data = await GetSkinsOwned(clientAuthToken, clientPortNumber, smmnrId, id);
      data && data.length == 1 && champsWithNoSkinsOwned.push(data[0][0])
    }
    champsWithNoSkinsOwned.sort();
    
    setChampsWithoutSkins(champsWithNoSkinsOwned);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <button onClick={handleInitClient}>
          Retrieve League Client Info
        </button>
        <button onClick={getChampsWithNoSkinsOwned}>
          Get Champions I Own But Don't Have Skins For
        </button>
        <button onClick={getSkinsOwnedFromChampsOwned}>
          Get All Skins Owned
        </button>
        {champsWithoutSkins.length!=0 ?(
          <div>
          {champsWithoutSkins.map((champ) => <span>{champ}. </span>)}
          </div>
        ):<p>p</p>}
        {skinsOwned.length!=0 ? (
          skinsOwned.map( (champ) => 
            (<div>
            <h1>{champ[0][0]}</h1>
            {/*champ.splice(0,1)*/}
            {champ.length > 1 && champ.map((skin, index) => index > 0 && <span>{skin[0]}<img alt="Skin splash" src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets"+skin[1]} ></img></span>)}
            </div>)
        )
        ):(<p>p</p>)}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
