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
   let accounts = await web3.eth.getAccounts()
   console.log(accounts)

   const urlParams = new URLSearchParams(window.location.search)
   const nftId = urlParams.get("nftId")
   document.getElementById('token_id_input').value = nftId
   document.getElementById('address_input').value = accounts[0] 
}

async function mint() {
    let tokenId = parseInt(document.getElementById('token_id_input').value)
    let address = document.getElementById('address_input').value
    let amount = parseInt(document.getElementById("amount_input").value)

    const accounts = await web3.eth.getAccounts()
    const contract = new web3.eth.Contract(contractAbi, contractAddr) //contractAbi from abi.js
    contract.methods.mint(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt) {
        alert('Mint done')
    })
}

document.getElementById('submit_mint').onclick = mint
init()
