'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { InitClient, GetSummonerId, GetSkinsForChampsOwned} from '@/app/actions/clientActions';
import loadingSVG from '@/public/assets/loading.svg'

//process.env.NODE_EXTRA_CA_CERTS="@/riotgames.pem";
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

export default function Home() {
  const [creds, setCreds] = useState<string>("");
  const [summonerId, setSummonerId] = useState(null);
  const [skinsOwned, setSkinsOwned] = useState<{name: string, url: string}[][]>([]);
  const [champsWithoutSkins, setChampsWithoutSkins] = useState<string[]>([]);

  useEffect(() => {
    handleInitClient();
  }, []);

  useEffect(() => {
    getSkinsOwnedFromChampsOwned();
  }, [creds]);

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
      setCreds("set");
    }
    else{
      setCreds("set");
    }
  }

  async function getSkinsOwnedFromChampsOwned(){
    if (creds == "set"){
      console.log("Getting champs and skins.");
      let smmnrId = summonerId;
      const clientAuthToken = localStorage.getItem('clientAuthToken')||"";
      const clientPortNumber = localStorage.getItem('clientPortNumber')||"";
      if (!summonerId){
        smmnrId = await GetSummonerId(clientAuthToken, clientPortNumber);
        setSummonerId(smmnrId);
      }
      const skinsResult = await GetSkinsForChampsOwned(clientAuthToken, clientPortNumber, smmnrId);
      setSkinsOwned(skinsResult.skinsOwned);
      setChampsWithoutSkins(skinsResult.champsWithNoSkinsOwned);
    }
    else {console.log("waiting for creds to be ready");}
  }

  return (
    <div className="grid items-center justify-items-center px-2 sm:px-20 text-center font-[family-name:var(--font-spiegel)]">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="px-3 py-1 text-sm/6 text-gold4 font-[family-name:var(--font-beaufort)]">
          League of Leagends Skin Inventory Tool    
        </div>
        <h1 className="text-5xl tracking-tight text-balance text-blue1 sm:text-7xl font-[family-name:var(--font-beaufort)]">SKIN<span className="text-blue3">VENTORY</span></h1>
        <p className="mt-8 text-lg font-medium text-pretty sm:text-xl/8">Welcome. 
          Make sure to have your League of Legends game client open and logged into your account. 
          Skinventory will search through your Windows processes to find info to connect to the League client's API. 
          Once that's done, it'll ask the API for a bunch of data and show you the champions you own but do not have 
          a single skin for as well as a list of all champions and skins you own.</p>
      </div>

      <main className="flex flex-col row-start-2 gap-8 items-center">
        {champsWithoutSkins.length!=0 ?(
          <div><h2 className="text-3xl sm:text-5xl py-8 text-gold1 font-[family-name:var(--font-beaufort)]">Champions you own but do not have any skins for</h2>
            <p className="text-md sm:text-xl">{champsWithoutSkins.map((champ) => <span>{champ}. </span>)}</p></div>
        ):(<span className="flex flex-col items-center"><Image alt="Loading" src={loadingSVG} width={100} height={100}></Image><p>Connecting to the League Client API...</p></span>)}

        {skinsOwned.length!=0 && (
          <div>
          <h2 className="text-3xl sm:text-5xl pt-8 text-gold1 font-[family-name:var(--font-beaufort)]">Champions and skins you own</h2>
          {skinsOwned.map( (champ) => 
            (<div>
              <h2 className="text-2xl sm:text-3xl pb-2 pt-6 text-gold1 font-[family-name:var(--font-beaufort)]">{champ[0].name}</h2>
              {/*champ.splice(0,1)*/}
              <div className="flex flex-wrap flex-row gap-x-8 row-start-2 justify-center items-center">
              {champ.length > 1 && champ.map((skin, index) => index > 0 && <span>
                <h2 className="text-xl sm:text-2xl text-gold1">{skin.name}</h2>
                <Image alt="Skin splash" src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets"+skin.url} width={308} height={560} priority={true}></Image>
              </span>)}
              </div>
            </div>))}
            </div>
        )}
      </main>

    </div>
  );
}
