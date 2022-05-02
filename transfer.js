const serverUrl = "https://v3pxjutix52s.usemoralis.com:2053/server";
const appId = "72YgawYM7bHyKv76iGCNyjW4O6zL2P2r7eB6eKdm";
const contractAddr = '0x49D51C34105533BA7BFF845242EAE413F956529d'
let web3;

Moralis.start({ serverUrl, appId });

async function init() {
   let currentUser = Moralis.User.current() 
   if (!currentUser) {
       window.location.pathname = "/index.html"
   }

   await Moralis.enableWeb3()
   web3 = new Web3(Moralis.provider)

   const urlParams = new URLSearchParams(window.location.search)
   console.log(urlParams)
   const nftId = urlParams.get("nftId")
   document.getElementById('token_id_input').value = nftId
}

async function transfer() {
    let tokenId = parseInt(document.getElementById('token_id_input').value)
    let address = document.getElementById('address_input').value
    let amount = parseInt(document.getElementById("amount_input").value)

    const options = {
        type: "erc1155",
        receiver: address,
        contractAddress: contractAddr,
        tokenId: tokenId,
        amount: amount,
    };
    let transaction = await Moralis.transfer(options);
    console.log(transaction)
}

document.getElementById('submit_transfer').onclick = transfer
init()
