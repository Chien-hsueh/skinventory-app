'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    handleInitClient();
  }, []);

  async function handleInitClient(){
    console.log("Checking if League Client credentials already exist");
    const clientAuthToken = localStorage.getItem('clientAuthToken')||"";
    const clientPortNumber = localStorage.getItem('clientPortNumber')||"";
    let smmnrId = null;
    if (clientAuthToken != "" && clientPortNumber != "") {smmnrId= await GetSummonerId(clientAuthToken, clientPortNumber)};
    console.log("smmnrId received: ", smmnrId);
    if (!smmnrId){
      console.log("Creds do not exist or existing ones are outdated. Fetching client credentials...")
      const data:any = await InitClient();
      console.log("Received creds: ", data);
      if (typeof localStorage !== "undefined"){
        localStorage.setItem("clientPortNumber", data.clientPortNumber);
        localStorage.setItem("clientAuthToken", data.clientAuthToken);}
      setCreds(data);
    }
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
    let champsWithNoSkinsOwned: string[] = []
    for (const id of chmpsOwned) {
      let data = await GetSkinsOwned(clientAuthToken, clientPortNumber, smmnrId, id);
      data && skinsOwned.push(data);
      data && data.length == 1 && champsWithNoSkinsOwned.push(data[0][0]);
    }
    skinsOwned.sort();
    setSkinsOwned(skinsOwned);
    champsWithNoSkinsOwned.sort();
    setChampsWithoutSkins(champsWithNoSkinsOwned);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        <button onClick={getSkinsOwnedFromChampsOwned}>
          Get Champions I Own But Don't Have Skins For And All Skins Owned
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
