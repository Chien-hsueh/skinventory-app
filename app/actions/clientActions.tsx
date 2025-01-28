'use server';

import ps from "ps-node";

export async function InitClient() {
  /*ps.lookup({ pid: 12416 }, function(err, resultList ) {
    if (err) {
        throw new Error( "Error: no process with given pid found!", err );
    }
 
    var process = resultList[ 0 ];
 
    if( process ){
        console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
    }
    else {
        console.log( 'No such process found!' );
    }
  });*/


  /*
  The important arguments:
  - remoting-auth-token,
  - app-port,
  */
  
  console.log("getting client info");
  try{
    return new Promise((resolve) => {ps.lookup({
      command: 'LeagueClientUx.exe',
      //arguments: '--debug',
      }, function(err, resultList ) {
      if (err || resultList.length === 0 ) {
          throw new Error( "Error: no such process found!", err );
      }
      else{
        const credentials = {clientPortNumber: "", clientAuthToken: ""};
        resultList.forEach(function( process ){
            if( process ){
              //console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
              process.arguments.forEach(function ( argument ){
                if ( argument.startsWith("--app-port=")){
                  const clientPortNumber = argument.slice(11);
                  console.log( 'Port: %s', clientPortNumber);
                  credentials.clientPortNumber = clientPortNumber;
                }
                if ( argument.startsWith("--remoting-auth-token=")){
                  const clientAuthToken = argument.slice(22);
                  console.log( 'Auth token: %s', clientAuthToken);
                  credentials.clientAuthToken = clientAuthToken;
                }
              })
            }
        });
        resolve(credentials);
      }
    });})
  } catch (e) { 
    console.error((e as Error).message);
  }
  return null;
}

export async function GetSummonerId(password: string | undefined, port: string | undefined) {
  // let password = 'ThT9Oai10ZzD0Sn-OwWV-Q';
  // let port = '57267';

  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa('riot:' + password));
  let summonerResponse;
  try {
    const response = await fetch('https://127.0.0.1:' + port + '/lol-summoner/v1/current-summoner', {
      method: "GET",
      headers: headers,
    });
    summonerResponse = await response.json();
    
  } catch (e) {
    console.error((e as Error).message);
  }
  
  let summonerId = summonerResponse?.summonerId;
  console.log("summonerId: ", summonerId);
  return summonerId;
}

export async function GetSkinsForChampsOwned(password: string | undefined, port: string | undefined, summonerId: string | null) {
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa('riot:' + password));
  let ownedChampsResponse;
  try {
    const response = await fetch('https://127.0.0.1:' + port + '/lol-champions/v1/owned-champions-minimal', {
      method: "GET",
      headers: headers,
    });
    ownedChampsResponse = await response.json();
  } catch (e) {
    console.error((e as Error).message);
  }

  const ownedChamps: number[] = [];
  ownedChampsResponse?.map((champ:any)=> {
    ownedChamps.push(champ.id);
  })
  console.log("Owned Champions IDs: ", ownedChamps);

  let result: {skinsOwned: {name: string, url: string}[][], champsWithNoSkinsOwned: string[]} = {skinsOwned: [], champsWithNoSkinsOwned: []};
  
  for (const id of ownedChamps) {
    let data = await GetSkinsOwned(password, port, summonerId, id);
    data && result.skinsOwned.push(data);
    data && data.length == 1 && result.champsWithNoSkinsOwned.push(data[0].name);
  }
  result.skinsOwned.sort(function(a,b) {
    var x = a[0].name;
    var y = b[0].name;
    return x < y ? -1 : x > y ? 1 : 0;
  });
  result.champsWithNoSkinsOwned.sort();

  return result;
}

export async function GetSkinsOwned(password: string | undefined, port: string | undefined, summonerId: string | null, champId: number) {
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa('riot:' + password));
  
  let skinsResponse;
  try {
    const response = await fetch('https://127.0.0.1:' + port + '/lol-champions/v1/inventories/' + summonerId + '/champions/'+ champId +'/skins', {
      method: "GET",
      headers: headers,
    });
    skinsResponse = await response.json();
    //console.log("Reponse: %s", data);
  } catch (e) {
    console.error(champId, (e as Error).message, summonerId);
    return;
  }
  const skinsOwned:{name: string, url: string}[] = [];
  skinsResponse.map((skin: any) =>{
    if (skin.ownership.owned && skin.name){
      let skinURL = "";
      const skinName = skin.name;
      if (skin.loadScreenPath) {skinURL = skin.loadScreenPath.slice(28).toLowerCase();}
      skinsOwned.push({name: skinName, url: skinURL});
    }
  })
  //console.log("skinsOwned: ", skinsOwned);
  return skinsOwned;
}
// export async function SkinsOwned(password: string | undefined, port: string | undefined, summonerId: string, ownedChamps: number[]) {
//   const headers = new Headers();
//   headers.append('Authorization', 'Basic ' + btoa('riot:' + password));
  
//   let skinsResponse;
//   try {
//     const response = await fetch('https://127.0.0.1:' + port + '/lol-champions/v1/inventories/' + summonerId + '/skins-minimal/', {
//       method: "GET",
//       headers: headers,
//     });
//     skinsResponse = await response.json();
//     //console.log("Reponse: %s", data);
//   } catch (e) {
//     console.error((e as Error).message);
//     return;
//   }
//   const skinsOwned:string[] = [];
//   skinsResponse.map((skin: any) =>{
//     skin.ownership.owned && skin.name && skinsOwned.push(skin.name);
//   })
//   //console.log("skinsOwned: ", skinsOwned);
//   return skinsOwned;
// }



