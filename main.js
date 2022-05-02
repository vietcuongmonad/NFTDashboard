/* Moralis init code */
const serverUrl = "https://v3pxjutix52s.usemoralis.com:2053/server";
const appId = "72YgawYM7bHyKv76iGCNyjW4O6zL2P2r7eB6eKdm";
const contractAddr = '0x49D51C34105533BA7BFF845242EAE413F956529d'
let currentUser

Moralis.start({ serverUrl, appId });

function fetchNFTMetadata(NFTs) {
    let promises = []

    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i]
        let nftId = nft.token_id
        
        /* 
            Call Cloud function via REST API
            Ref: https://docs.moralis.io/moralis-dapp/cloud-code/cloud-functions#call-via-rest-api
        */
        let link = serverUrl + "/functions/getNFT?=_ApplicationId=" + appId + "&nftId=" + nftId
        promises.push( 
            fetch(link)
            .then(response => response.json())
            .then(response_json => JSON.parse(response_json.result))
            .then(result => {nft.metadata = result})
            .then(() => nft)
            // If you want below code to work, upgrade plan on Moralis.com
            /*.then(result => { 
                const options = {
                    address: contractAddr,
                    token_id: nftId,
                    chain: "rinkeby"
                };
                return Moralis.Web3API.token.getTokenIdOwners(options)
            })
            .then(res => {
                nft.owners = []
                res.result.forEach(element => {
                    nft.owners.push(element.owner_of)
                })
                return nft
            })*/
            
        )
    }

    return Promise.all(promises)
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app")
    console.log(ownerData)
    console.log(NFTs)

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i]
        console.log(nft)
        let htmlString = `
            <div class="card">
                <img class="card-img-top" src=${nft.metadata.image} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">${nft.metadata.description}</p>
                    <p class="card-text">Amount: ${nft.amount}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                    <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
                </div>
            </div>
        `
        //<p class="card-text">Number of owners: ${nft.owners.length}</p>
        let col = document.createElement("div")
        col.className = "col col-md-4"
        col.innerHTML = htmlString
        parent.appendChild(col)
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts")
    const options = {
        chain: "rinkeby",
        address: accounts[0],
        token_address: contractAddr,
    };
    return Moralis.Web3API.account.getNFTsForContract(options)
        .then(data => {
            let result = data.result.reduce( (object, currentElement) => {
                object[currentElement.token_id] = currentElement.amount
                return object
            }, {})
            console.log(result)
            return result
        })
}

async function initializeApp() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html"
    }
    
    const options = {
        address: contractAddr,
        chain: "rinkeby",
    };
    
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTwithMetadata = await fetchNFTMetadata(NFTs.result)
    let ownerData = await getOwnerData()
    renderInventory(NFTwithMetadata, ownerData)
}

initializeApp()