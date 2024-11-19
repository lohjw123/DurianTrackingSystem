const web3 = new Web3(Web3.givenProvider || "http://localhost:5502");
let durianContract;

// function myFunction() {
//         const farmerName = document.getElementById("farmerName").value;
//         window.alert(farmerName);
// }

let account;

const accessToMetamask = async () => {
  if (window.ethereum !== "undefined") {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];

    if (window.location.href === "YOUR_PAGE_URL_HERE") {
      const allowedAccount = "YOUR_ALLOWED_ACCOUNT_ADDRESS_HERE";
      if (account !== allowedAccount) {
        alert("Sorry, you are not authorized to access this page.");
        window.location.href = "YOUR_DEFAULT_URL_HERE";
      }
    }
  }
};

//2- connect to smart contract
const accessToContract = async () => {
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_variety",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_weight",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_harvestTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_ripenTime",
          "type": "uint256"
        }
      ],
      "name": "addDurian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_retailer",
          "type": "address"
        }
      ],
      "name": "authorizeRetailer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "cancelTimeLock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "variety",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "harvestTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ripenTime",
          "type": "uint256"
        }
      ],
      "name": "DurianAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "DurianPurchased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newRipenTime",
          "type": "uint256"
        }
      ],
      "name": "modifyTimeLock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "purchaseDurian",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "releaseDurian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_retailer",
          "type": "address"
        }
      ],
      "name": "revokeRetailer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "TimeLockCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newRipenTime",
          "type": "uint256"
        }
      ],
      "name": "TimeLockModified",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorizedRetailers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_retailer",
          "type": "address"
        }
      ],
      "name": "checkAuthorization",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "durianIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "durianRetailers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "durians",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "variety",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "harvestTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ripenTime",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "status",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getDurian",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "variety",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "weight",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "harvestTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ripenTime",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "status",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct DurianTracking.Durian",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDurianIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const Address = "0x8903B13a7b6DF069821D3c6702d53FA904052A8c";
  window.web3 = await new Web3(window.ethereum); //how to access to smart contract
  window.contract = await new window.web3.eth.Contract(ABI, Address); //how you create an instance of that contract by using the abi and address
};

//3-read data from smart contract
const readfromContract = async () => {
  const data = await window.contract.methods.getFarm().call();
  console.log(data);
  document.getElementById(
    "ownerProduct"
  ).innerHTML = `Owner Product information:<br> Product Name: ${data[0]},<br> Price(wei): ${data[1]} <br>Owner Address: ${data[2]}`;
  document.getElementById("dataArea0").innerHTML = data;
  // document.getElementById("dataArea1").innerHTML = data[1];
  // document.getElementById("dataArea2").innerHTML = data[2];
};

const authorizeRetailer = async (retailerAddress) => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const ownerAddress = accounts[0]; // This should be the admin's account

  console.log("Admin is logged in as:", ownerAddress);

  try {
    // Get the contract's owner address (from the smart contract)
    const contractOwnerAddress = await window.contract.methods
      .getOwner()
      .call();
    console.log("Contract owner address:", contractOwnerAddress);

    // Check if the current account is the owner
    if (ownerAddress.toLowerCase() === contractOwnerAddress.toLowerCase()) {
      // The current account is the owner, proceed to authorize the retailer
      await window.contract.methods
        .authorizeRetailer(retailerAddress)
        .send({ from: ownerAddress });

      console.log(`Retailer ${retailerAddress} has been authorized.`);
      alert(`Retailer ${retailerAddress} has been authorized.`);
    } else {
      // The current account is not the owner
      console.error("Only the contract owner can authorize retailers.");
      alert("You must be the contract owner to authorize retailers.");
    }
  } catch (error) {
    console.error("Error authorizing retailer:", error);
    alert(
      "Failed to authorize retailer. Please check the transaction and try again."
    );
  }
};

async function isAuthorizedRetailer() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const retailerAddress = accounts[0];

  try {
    const isAuthorized = await window.contract.methods
      .authorizedRetailers(retailerAddress)
      .call();
    return isAuthorized;
  } catch (error) {
    console.error("Error checking retailer authorization:", error);
    return false; // Assume not authorized on error
  }
}

async function checkRetailerAuthorization() {
  const isAuthorized = await isAuthorizedRetailer();

  if (!isAuthorized) {
    alert("You are not authorized to access this page.");
    window.location.href = "index.html";
  }
}

async function checkRetailerAuthorizationInner() {
  const isAuthorized = await isAuthorizedRetailer();

  if (!isAuthorized) {
    alert("You are not authorized to access this page.");
    window.location.href = "../index.html";
  }
}

//4- buyer buy the product, transfer wei, update the ownership
const BuyerBuyProduct = async (productId) => {
  try {
    const data = await window.contract.methods.getDurian(productId).call();
    const price = data[2];
    const status = data[6];

    // Check if the durian is available
    if (status !== "available") {
      throw new Error("Durian is not available for purchase");
    }

    // Execute the purchase
    await window.contract.methods
      .purchaseDurian(productId)
      .send({ from: account, value: price });

    return true;
  } catch (error) {
    console.error("Error purchasing product:", error);
    throw error;
  }
};

//5- set new product- product name and price, owner address
const setNewProduct = async () => {
  const ProductName = document.getElementById("Pname").value;
  const ProductPrice = document.getElementById("Pprice").value;
  await window.contract.methods
    .setProduct(ProductName, ProductPrice)
    .send({ from: account });
  document.getElementById("Pname").value = "";
  document.getElementById("Pprice").value = "";
};

const addNewRetailer = async () => {
  const name = document.getElementById("retailerName").value;
  const address = document.getElementById("retailerAddress").value;
  const location = document.getElementById("retailerLocation").value;
  await durianContract.methods
    .addRetailer(address, name, location)
    .send({ from: account });
  window.alert(
    "Retailer : " +
      name +
      "\nAddress  : " +
      address +
      "\nLocation : " +
      location +
      "\n\nAdded Successfully!"
  );
  document.getElementById("retailerName").value = "";
  document.getElementById("retailerAddress").value = "";
  document.getElementById("retailerLocation").value = "";
};

const recordHarvestDurian = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const retailerAddress = accounts[0];

  const durianHarvestDate = document.getElementById("durianHarvestDate").value;
  const durianRipenDate = document.getElementById("durianRipenDate").value;

  const harvestDate = new Date(durianHarvestDate);
  const ripenDate = new Date(durianRipenDate);

  const today = new Date();

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  if (harvestDate < threeDaysAgo) {
    alert("Harvest date cannot be more than 3 days in the past.");
    return;
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (harvestDate < oneYearAgo) {
    alert("Harvest date cannot be more than one year in the past.");
    return;
  }

  if (ripenDate <= harvestDate) {
    alert("Ripen date must be after the harvest date.");
    return;
  }

  const duration = (ripenDate - harvestDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

  if (duration > 7) {
    alert(`Ripen date must be within 7 days after the harvest date.`);
    return;
  }

  // Define stages
  const unripeStageEnd = new Date(harvestDate);
  unripeStageEnd.setDate(harvestDate.getDate() + 3); // Day 1-3

  const ripenStageEnd = new Date(harvestDate);
  ripenStageEnd.setDate(harvestDate.getDate() + 5); // Day 4-5

  const overripeStageEnd = new Date(harvestDate);
  overripeStageEnd.setDate(harvestDate.getDate() + 7); // Day 6-7

  if (ripenDate > overripeStageEnd) {
    alert("Ripen date must not exceed 7 days after the harvest date.");
    return;
  }

  if (ripenDate > ripenStageEnd) {
    alert("Ripen date should be within the ripen stages (days 4 and 5).");
    return;
  }

  const timestampHarvestDate = Math.floor(harvestDate.getTime() / 1000);
  const timestampRipenDate = Math.floor(ripenDate.getTime() / 1000);

  const durianType = document.getElementById("durianType").value;
  const durianWeight = document.getElementById("durianWeight").value;
  const durianPrice = document.getElementById("durianPrice").value;
  const durianId = document.getElementById("durianID").value;

  if (isNaN(durianPrice) || durianPrice <= 0) {
    alert("Invalid durian price.");
    return;
  }

  const priceInWei = web3.utils.toWei(durianPrice, "ether");

  try {
    await window.contract.methods
      .addDurian(
        durianId,
        durianType,
        priceInWei,
        durianWeight,
        timestampHarvestDate,
        timestampRipenDate
      )
      .send({ from: retailerAddress });

    console.log("Retailer set successfully for durian ID:", durianId);

    window.alert(
      `\nDurian ID   : ${durianId}` +
        `\nDurian Harvest Date : ${durianHarvestDate}` +
        `\nDurian Ripen Date   : ${durianRipenDate}` +
        `\nDurian Type         : ${durianType}` +
        `\nDurian Weight       : ${durianWeight}` +
        `\nDurian Price        : ${durianPrice} ETH\n\nAdded Successfully!`
    );

    window.location.href = "recordDurianFromID.html";
  } catch (error) {
    console.error("Error adding durian:", error.message);
    alert("Failed to add Durian. Please check the transaction and try again.");
  }
};

const getDurianDetails = async () => {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    const durianIdInput = document.getElementById("durianID").value;
    const durianId = parseInt(durianIdInput, 10);

    if (isNaN(durianId) || durianId <= 0) {
      alert("Please enter a valid Durian ID.");
      return;
    }

    const durianIds = await contract.methods
      .getDurianIds()
      .call({ from: account });
    if (!durianIds.includes(durianId.toString())) {
      alert("Invalid Durian ID. Please check the ID and try again.");
      return;
    }

    const durianDetails = await contract.methods
      .getDurian(durianId)
      .call({ from: account });

    if (durianDetails.id != 0) {
      const durianType = durianDetails.variety;
      const durianPriceWei = durianDetails.price;
      const durianWeight = durianDetails.weight;
      const harvestTimestamp = durianDetails.harvestTime;
      const ripenTimestamp = durianDetails.ripenTime;

      const durianPrice = web3.utils.fromWei(
        durianPriceWei.toString(),
        "ether"
      );

      const harvestDate = new Date(
        harvestTimestamp * 1000
      ).toLocaleDateString();
      const ripenDate = new Date(ripenTimestamp * 1000).toLocaleDateString();

      document.getElementById("durianId").textContent = durianId;
      document.getElementById("durianVariety").textContent = durianType;
      document.getElementById("durianPrice").textContent = durianPrice + " ETH";
      document.getElementById("durianWeight").textContent =
        durianWeight + " kg";
      document.getElementById("durianHarvestTime").textContent = harvestDate;
      document.getElementById("durianRipenTime").textContent = ripenDate;
    } else {
      alert("Durian not found!");
    }
  } catch (error) {
    console.error("Error fetching durian:", error);
    alert(
      "Failed to fetch Durian details. Please check the Durian ID and try again."
    );
  }
};
const fetchAllDurians = async () => {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    // Get all Durian IDs
    const durianIds = await contract.methods
      .getDurianIds()
      .call({ from: account });
    const durianProducts = [];

    for (const durianId of durianIds) {
      const durianDetails = await contract.methods
        .getDurian(durianId)
        .call({ from: account });

      if (durianDetails.id != 0) {
        const durianType = durianDetails.variety;
        const durianPriceWei = durianDetails.price;
        const durianWeight = durianDetails.weight;
        const durianStatus = durianDetails.status;

        // Convert price from Wei to Ether
        const durianPrice = web3.utils.fromWei(
          durianPriceWei.toString(),
          "ether"
        );

        // Add to products array
        durianProducts.push({
          id: durianDetails.id,
          variety: durianType,
          price: durianPrice,
          weight: durianWeight,
          status: durianStatus,
        });
      }
    }

    // Now you can use durianProducts to display on the page
    durianProducts.forEach((product) => {
      displayDurianProducts(product);
    });
  } catch (error) {
    console.error("Error fetching durian details:", error);
    alert("Failed to fetch Durian details. Please try again.");
  }
};
const getAllDurianIds = async () => {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    if (!window.contract) {
      console.error("Contract is not initialized.");
      return;
    }

    const durianIds = await window.contract.methods
      .getDurianIds()
      .call({ from: account });
    console.log("Durian IDs: ", durianIds);

    const durianDetailsContainer = document.getElementById("durianDetails");
    durianDetailsContainer.innerHTML = "";

    for (const durianId of durianIds) {
      const durianDetails = await window.contract.methods
        .getDurian(durianId)
        .call({ from: account });

      // Build HTML for each durian's details
      durianDetailsContainer.innerHTML += `
        <p><strong>ID:</strong> ${durianDetails.id}</p>
        <p><strong>Variety:</strong> ${durianDetails.variety}</p>
        <p><strong>Price:</strong> ${web3.utils.fromWei(
          durianDetails.price,
          "ether"
        )} ETH</p>
        <p><strong>Weight:</strong> ${durianDetails.weight} kg</p>
        <p><strong>Harvest Time:</strong> ${new Date(
          durianDetails.harvestTime * 1000
        ).toLocaleDateString()}</p>
        <p><strong>Ripen Time:</strong> ${new Date(
          durianDetails.ripenTime * 1000
        ).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${durianDetails.status}</p>
        ${
          durianDetails.status === "sold"
            ? `<p><strong>Owner:</strong> ${durianDetails.owner}</p>`
            : ""
        }
        ${
          durianDetails.status === "locked" &&
          new Date().getTime() / 1000 >= durianDetails.ripenTime
            ? `
          <button onclick="releaseDurian(${durianId})">Release Durian</button>
        `
            : ""
        }
        <hr/>
      `;
    }
  } catch (error) {
    console.error("Error fetching Durian details:", error);
  }
};
const releaseDurian = async (durianId) => {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    if (!window.contract) {
      console.error("Contract is not initialized.");
      return;
    }

    await window.contract.methods
      .releaseDurian(durianId)
      .send({ from: account });

    alert(`Durian with ID ${durianId} has been released!`);
    getAllDurianIds(); // Refresh the durian list
  } catch (error) {
    console.error("Error releasing durian:", error);
  }
};
const modifyTimeLock = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];

  const durianHarvestDate = document.getElementById("durianHarvestTime").innerHTML;
  const newDurianRipenDate = document.getElementById("newDurianRipenTime").value;
  const oldDurianRipenDate = document.getElementById("durianRipenTime").innerHTML;
  const oldTimestampRipenDate = Date.parse(oldDurianRipenDate) / 1000;
  const timestampHarvestDate = Date.parse(durianHarvestDate) / 1000;
  const timestampRipenDate = Date.parse(newDurianRipenDate) / 1000;
  const durianId = document.getElementById("durianId").innerHTML;

  if (durianId == "") {
    alert("Please enter a durian ID.");
    return;
  }

  if (timestampHarvestDate >= timestampRipenDate) {
    alert("Harvest time must be before ripen time.");
    return;
  }

  if (oldTimestampRipenDate >= timestampRipenDate) {
    alert("New Harvest time must be after " + oldDurianRipenDate + ".");
    return;
  }

  try {
    await window.contract.methods
      .modifyTimeLock(durianId, timestampRipenDate)
      .send({ from: account });
      location.reload();
    console.log("TimeLock modified successfully!");
    window.alert("TimeLock modified successfully!");
  } catch (error) {
    console.error("Error modifying TimeLock:", error);
  }
};

const cancelTimeLock = async () => {
  const durianId = document.getElementById("durianId").innerHTML;

  try {
    await window.contract.methods
      .cancelTimeLock(durianId)
      .send({ from: account });
    window.alert("TimeLock cancel successfully!");
  } catch (error) {
    window.alert("TimeLock cancel failed !");
    console.error("TimeLock cancel failed :", error);
  }
};

//TODO: View Record

var recordToRetailer = true;
var recordDurian = true;

const validateFields4 = async () => {
  var retailerAddress = document.getElementById("retailerAddress").value;

  if (retailerAddress === "" || !recordToRetailer) {
    document.getElementById("cbutton").disabled = true;
  } else {
    document.getElementById("cbutton").disabled = false;
  }
};

const validateFields5 = async () => {
  var durianHarvestDate = document.getElementById("durianHarvestDate").value;
  var durianType = document.getElementById("durianType").value;
  var durianWeight = document.getElementById("durianWeight").value;

  if (
    durianHarvestDate === "" ||
    durianType === "" ||
    durianWeight === "" ||
    !recordDurian
  ) {
    document.getElementById("cbutton").disabled = true;
  } else {
    document.getElementById("cbutton").disabled = false;
  }
};

//Consumer
const showDurianTable = async () => {
  var table = document.getElementById("durianTable");
  var idField = document.getElementById("consumerRateDurianID").value;
  console.log(idField);

  if (idField === "") {
    table.style.display = "none";
  }
};

const registerAccount = async () => {
  const consumerAddress = document.getElementById("consumerAddress").value;
  const consumerName = document.getElementById("consumerName").value;
  console.log(consumerAddress, consumerName);
  await durianContract.methods
    .registerConsumer(consumerAddress, consumerName)
    .send({ from: account });
  window.alert(
    "Address : " +
      consumerAddress +
      "\nName    : " +
      consumerName +
      "\n\nAdded Successfully!"
  );
  document.getElementById("consumerAddress").value = "";
  document.getElementById("consumerName").value = "";
};

const retailerRecord = async () => {
  const result = await recordContract.methods.viewRetailerAcc().call();
  let length = result.length;
  let value = [];

  for (let i = 0; i < length; i++) {
    value[i] = result[i];
  }

  const tableContainer = document.getElementById("tableRecord");

  if (length == 0) {
    const error = document.createElement("p");
    error.innerHTML = "No records found.";
    document.getElementById("tableRecord").style.fontFamily = "abel";
    document.getElementById("tableRecord").style.border = "none";
    document.getElementById("tableRecord").style.transform = "translate(50px)";
    document.getElementById("tableRecord").style.fontSize = "30px";
    tableContainer.appendChild(error);
  } else {
    document.getElementById("tableRecord").style.transform = "none";
    // create a new table element
    var table = document.createElement("table");
    table.setAttribute("id", "tableData");
    table.setAttribute("class", "farmerData");
    table.setAttribute("cellpadding", "10 2");

    // create a header row
    var headerRow = document.createElement("tr");

    // create header cells
    var headerCell1 = document.createElement("th");
    headerCell1.setAttribute("id", "tableHeaderData");
    headerCell1.textContent = "Address";

    var headerCell2 = document.createElement("th");
    headerCell2.setAttribute("id", "tableHeaderData");
    headerCell2.textContent = "Name";

    var headerCell3 = document.createElement("th");
    headerCell3.setAttribute("id", "tableHeaderData");
    headerCell3.textContent = "Location";

    var headerCell4 = document.createElement("th");
    headerCell4.setAttribute("id", "tableHeaderData");
    headerCell4.textContent = "User State";

    // append header cells to header row
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);

    // append header row to table
    table.appendChild(headerRow);

    for (let i = 0; i < length; i++) {
      value[i] = result[i];
      console.log("i:" + i);
      console.log(value[i]);
      console.log(value[i][0]);
      // create a data row
      var dataRow = document.createElement("tr");

      // create data cells
      var dataCell1 = document.createElement("td");
      dataCell1.textContent = value[i][0];

      var dataCell2 = document.createElement("td");
      dataCell2.textContent = value[i][1];

      var dataCell3 = document.createElement("td");
      dataCell3.textContent = value[i][2];

      var dataCell4 = document.createElement("td");
      let valueDisplay;
      if (value[i][3] === "0") {
        valueDisplay = "Logged In";
      } else if (value[i][3] === "1") {
        valueDisplay = "Logged Out";
      } else if (value[i][3] === "2") {
        valueDisplay = "Deactivated";
      }
      dataCell4.textContent = valueDisplay;

      // append data cells to data row
      dataRow.appendChild(dataCell1);
      dataRow.appendChild(dataCell2);
      dataRow.appendChild(dataCell3);
      dataRow.appendChild(dataCell4);

      // append data row to table
      table.appendChild(dataRow);
    }

    tableContainer.appendChild(table);
  }
};

const consumerRecord = async () => {
  const result = await recordContract.methods.viewConsumerAcc().call();
  let length = result.length;
  let value = [];

  for (let i = 0; i < length; i++) {
    value[i] = result[i];
  }

  const tableContainer = document.getElementById("tableRecord");

  if (length == 0) {
    const error = document.createElement("p");
    error.innerHTML = "No records found.";
    document.getElementById("tableRecord").style.fontFamily = "abel";
    document.getElementById("tableRecord").style.border = "none";
    document.getElementById("tableRecord").style.transform = "translate(50px)";
    document.getElementById("tableRecord").style.fontSize = "30px";
    tableContainer.appendChild(error);
  } else {
    document.getElementById("tableRecord").style.transform = "none";
    // create a new table element
    var table = document.createElement("table");
    table.setAttribute("id", "tableData");
    table.setAttribute("class", "farmerData");
    table.setAttribute("cellpadding", "10 2");

    // create a header row
    var headerRow = document.createElement("tr");

    // create header cells
    var headerCell1 = document.createElement("th");
    headerCell1.setAttribute("id", "tableHeaderData");
    headerCell1.textContent = "Address";

    var headerCell2 = document.createElement("th");
    headerCell2.setAttribute("id", "tableHeaderData");
    headerCell2.textContent = "Name";

    var headerCell3 = document.createElement("th");
    headerCell3.setAttribute("id", "tableHeaderData");
    headerCell3.textContent = "User State";

    // append header cells to header row
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);

    // append header row to table
    table.appendChild(headerRow);

    for (let i = 0; i < length; i++) {
      value[i] = result[i];
      console.log("i:" + i);
      console.log(value[i]);
      console.log(value[i][0]);
      // create a data row
      var dataRow = document.createElement("tr");

      // create data cells
      var dataCell1 = document.createElement("td");
      dataCell1.textContent = value[i][0];

      var dataCell2 = document.createElement("td");
      dataCell2.textContent = value[i][1];

      var dataCell3 = document.createElement("td");
      let valueDisplay;
      if (value[i][2] === "0") {
        valueDisplay = "Logged In";
      } else if (value[i][2] === "1") {
        valueDisplay = "Logged Out";
      } else if (value[i][2] === "2") {
        valueDisplay = "Deactivated";
      }
      dataCell3.textContent = valueDisplay;

      // append data cells to data row
      dataRow.appendChild(dataCell1);
      dataRow.appendChild(dataCell2);
      dataRow.appendChild(dataCell3);

      // append data row to table
      table.appendChild(dataRow);
    }

    tableContainer.appendChild(table);
  }
};

const durianRecord = async () => {
  const result = await recordContract.methods.viewDurianDetails().call();
  var value1 = result[0];
  var value2 = result[1];

  // window.alert(length);
  // window.alert(value[0].length);

  const tableContainer = document.getElementById("tableRecord");

  if (value1.length == 0) {
    const error = document.createElement("p");
    error.innerHTML = "No records found.";
    document.getElementById("tableRecord").style.fontFamily = "abel";
    document.getElementById("tableRecord").style.border = "none";
    document.getElementById("tableRecord").style.transform = "translate(50px)";
    document.getElementById("tableRecord").style.fontSize = "30px";
    tableContainer.appendChild(error);
  } else {
    document.getElementById("tableRecord").style.transform = "none";
    // create a new table element
    var table = document.createElement("table");
    table.setAttribute("id", "tableData");
    table.setAttribute("class", "farmerData");
    table.setAttribute("cellpadding", "10 2");

    // create a header row
    var headerRow = document.createElement("tr");

    // create header cells
    var headerCell1 = document.createElement("th");
    headerCell1.setAttribute("id", "tableHeaderData");
    headerCell1.textContent = "Batch ID";

    var headerCell2 = document.createElement("th");
    headerCell2.setAttribute("id", "tableHeaderData");
    headerCell2.textContent = "Harvest Date";

    var headerCell3 = document.createElement("th");
    headerCell3.setAttribute("id", "tableHeaderData");
    headerCell3.textContent = "Type";

    var headerCell4 = document.createElement("th");
    headerCell4.setAttribute("id", "tableHeaderData");
    headerCell4.textContent = "Weight (Kg)";

    var headerCell5 = document.createElement("th");
    headerCell5.setAttribute("id", "tableHeaderData");
    headerCell5.textContent = "Farm ID";

    var headerCell6 = document.createElement("th");
    headerCell6.setAttribute("id", "tableHeaderData");
    headerCell6.textContent = "Status";

    var headerCell7 = document.createElement("th");
    headerCell7.setAttribute("id", "tableHeaderData");
    headerCell7.textContent = "Arrival Time at Distributor";

    var headerCell8 = document.createElement("th");
    headerCell8.setAttribute("id", "tableHeaderData");
    headerCell8.textContent = "Distributor Name";

    var headerCell9 = document.createElement("th");
    headerCell9.setAttribute("id", "tableHeaderData");
    headerCell9.textContent = "Rating";

    // append header cells to header row
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    headerRow.appendChild(headerCell5);
    headerRow.appendChild(headerCell6);
    headerRow.appendChild(headerCell7);
    headerRow.appendChild(headerCell8);
    headerRow.appendChild(headerCell9);

    // append header row to table
    table.appendChild(headerRow);

    console.log("hi");
    console.log(result[0][1]);

    for (let i = 0; i < value1.length; i++) {
      // value[i] = result[i];
      // console.log("i:" + i);
      // // console.log(value[i]);
      // console.log(value[0][i]);

      // create a data row
      var dataRow = document.createElement("tr");

      // create data cells
      var dataCell1 = document.createElement("td");
      headerCell1.setAttribute("id", "tableHeaderData");
      dataCell1.textContent = value1[i][0];

      var dataCell2 = document.createElement("td");
      headerCell2.setAttribute("id", "tableHeaderData");
      let date = new Date(value1[i][1] * 1000);
      let formattedDate = date.toLocaleDateString("en-GB");
      dataCell2.textContent = formattedDate;

      var dataCell3 = document.createElement("td");
      headerCell3.setAttribute("id", "tableHeaderData");
      dataCell3.textContent = value1[i][2];

      var dataCell4 = document.createElement("td");
      headerCell4.setAttribute("id", "tableHeaderData");
      dataCell4.textContent = value1[i][3];

      var dataCell5 = document.createElement("td");
      headerCell5.setAttribute("id", "tableHeaderData");
      dataCell5.textContent = value1[i][4];

      var statusMessage;
      if (value1[i][5] == "0") {
        statusMessage = "Harvested";
      } else if (value1[i][5] == "1") {
        statusMessage = "Arrived at distributor";
      } else if (value1[i][5] == "2") {
        statusMessage = "Sent to retailer";
      } else {
        statusMessage = "Arrived at retailer";
      }
      var dataCell6 = document.createElement("td");
      headerCell6.setAttribute("id", "tableHeaderData");
      dataCell6.textContent = statusMessage;

      if (value1[i][6] !== "0") {
        var dataCell7 = document.createElement("td");
        date = new Date(value1[i][6] * 1000);
        formattedDate = date.toLocaleDateString("en-GB");
        dataCell7.textContent = formattedDate;

        var distributorList = await durianContract.methods
          .distributors(value1[i][7])
          .call();
        var disName = distributorList[1];

        var dataCell8 = document.createElement("td");
        headerCell8.setAttribute("id", "tableHeaderData");
        dataCell8.textContent = disName;
      } else {
        var dataCell7 = document.createElement("td");
        headerCell5.setAttribute("id", "tableHeaderData");
        dataCell7.textContent = "-";

        var dataCell8 = document.createElement("td");
        headerCell8.setAttribute("id", "tableHeaderData");
        dataCell8.textContent = "-";
      }

      var dataCell9 = document.createElement("td");
      headerCell9.setAttribute("id", "tableHeaderData");

      var rating =
        "Taste rate     : " +
        value1[i][8][0] +
        "/5 <br>" +
        "Fragnance rate : " +
        value1[i][8][1] +
        "/5 <br>" +
        "Creaminess rate: " +
        value1[i][8][2] +
        "/5 ";

      dataCell9.innerHTML = rating;

      // append data cells to data row
      dataRow.appendChild(dataCell1);
      dataRow.appendChild(dataCell2);
      dataRow.appendChild(dataCell3);
      dataRow.appendChild(dataCell4);
      dataRow.appendChild(dataCell5);
      dataRow.appendChild(dataCell6);
      dataRow.appendChild(dataCell7);
      dataRow.appendChild(dataCell8);
      dataRow.appendChild(dataCell9);

      // append data row to table
      table.appendChild(dataRow);
    }

    tableContainer.appendChild(table);
  }
};

async function getDurian(durianId) {
  try {
    // Ensure the contract is accessible
    if (!window.contract) {
      throw new Error(
        "Contract is not initialized. Please connect to MetaMask and access the contract."
      );
    }

    // Call the getDurian function from the smart contract
    const durian = await window.contract.getDurian(durianId);

    // Display durian details
    console.log("Durian Details:", {
      id: durian.id.toString(),
      variety: durian.variety,
      price: durian.price.toString(),
      weight: durian.weight.toString(),
      harvestTime: new Date(durian.harvestTime * 1000).toLocaleString(),
      ripenTime: new Date(durian.ripenTime * 1000).toLocaleString(),
    });

    // Optionally, update the UI with the retrieved details
    document.getElementById("durianId").textContent = durian.id.toString();
    document.getElementById("durianVariety").textContent = durian.variety;
    document.getElementById("durianPrice").textContent =
      durian.price.toString();
    document.getElementById("durianWeight").textContent =
      durian.weight.toString();
    document.getElementById("durianHarvestTime").textContent = new Date(
      durian.harvestTime * 1000
    ).toLocaleString();
    document.getElementById("durianRipenTime").textContent = new Date(
      durian.ripenTime * 1000
    ).toLocaleString();
  } catch (error) {
    console.error("Error fetching durian:", error);
    window.alert(
      "Failed to fetch durian details: " + (error.message || "Unknown error")
    );
  }
}

const durianRecordRetail = async () => {
  const result = await recordContract.methods.viewDurianDetails().call();
  var value1 = result[0];
  var value2 = result[1];

  const tableContainer = document.getElementById("tableRecord");

  if (value2.length == 0) {
    const error = document.createElement("p");
    error.innerHTML = "No records found.";
    document.getElementById("tableRecord").style.fontFamily = "abel";
    document.getElementById("tableRecord").style.border = "none";
    document.getElementById("tableRecord").style.transform = "translate(50px)";
    document.getElementById("tableRecord").style.fontSize = "30px";
    tableContainer.appendChild(error);
  } else {
    document.getElementById("tableRecord").style.transform = "none";
    // create a new table element
    var table = document.createElement("table");
    table.setAttribute("id", "tableData");
    table.setAttribute("class", "farmerData");
    table.setAttribute("cellpadding", "10 2");

    // create a header row
    var headerRow = document.createElement("tr");

    // create header cells
    var headerCell1 = document.createElement("th");
    headerCell1.setAttribute("id", "tableHeaderData");
    headerCell1.textContent = "Batch ID";

    var headerCell2 = document.createElement("th");
    headerCell2.setAttribute("id", "tableHeaderData");
    headerCell2.textContent = "Retailer Name";

    var headerCell3 = document.createElement("th");
    headerCell3.setAttribute("id", "tableHeaderData");
    headerCell3.textContent = "Retailer Address";

    var headerCell4 = document.createElement("th");
    headerCell4.setAttribute("id", "tableHeaderData");
    headerCell4.textContent = "Arrival Time at Retailer";

    var headerCell5 = document.createElement("th");
    headerCell5.setAttribute("id", "tableHeaderData");
    headerCell5.textContent = "Distributed Weight (Kg)";

    // append header cells to header row
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    headerRow.appendChild(headerCell5);

    // append header row to table
    table.appendChild(headerRow);

    console.log("hi");
    console.log(result[0][1]);

    for (let i = 0; i < value1.length; i++) {
      // value[i] = result[i];
      // console.log("i:" + i);
      // // console.log(value[i]);
      // console.log(value[0][i]);
      if (value2[i][0] == "") {
        break;
      }
      var retailerList = await durianContract.methods
        .retailers(value2[i][1])
        .call();
      var retailerName = retailerList[1];

      // create a data row
      var dataRow = document.createElement("tr");

      // create data cells
      var dataCell1 = document.createElement("td");
      headerCell1.setAttribute("id", "tableHeaderData");
      dataCell1.textContent = value2[i][0];

      var dataCell2 = document.createElement("td");
      headerCell2.setAttribute("id", "tableHeaderData");
      dataCell2.textContent = retailerName;

      var dataCell3 = document.createElement("td");
      headerCell3.setAttribute("id", "tableHeaderData");
      dataCell3.textContent = value2[i][1];

      let date = new Date(value2[2][2] * 1000);
      let formattedDate = date.toLocaleDateString("en-GB");
      var dataCell4 = document.createElement("td");
      headerCell4.setAttribute("id", "tableHeaderData");
      dataCell4.textContent = formattedDate;

      var dataCell5 = document.createElement("td");
      headerCell5.setAttribute("id", "tableHeaderData");
      dataCell5.textContent = value2[i][3];

      // append data cells to data row
      dataRow.appendChild(dataCell1);
      dataRow.appendChild(dataCell2);
      dataRow.appendChild(dataCell3);
      dataRow.appendChild(dataCell4);
      dataRow.appendChild(dataCell5);

      // append data row to table
      table.appendChild(dataRow);
    }

    tableContainer.appendChild(table);
  }
};

const login = async (user) => {
  let returnValue;

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];

  console.log("user:" + user);
  const tx = await durianContract.methods
    .login(account, user)
    .send({ from: account });

  // Wait for the transaction to be mined
  const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
  console.log(receipt);

  console.log(web3.eth);
  if (receipt.logs.length > 0) {
    // Fetch the event logs for the transaction
    const logs = web3.eth.abi.decodeLog(
      [{ type: "uint8", name: "status" }],
      receipt.logs[0].data,
      receipt.logs[0].topics.slice(1)
    );

    console.log(logs); // { success: true, message: "Successful login. Access granted." }

    // Get the return value from the event log
    returnValue = {
      status: logs.status,
    };
  } else {
    console.log("No logs found for transaction");
    returnValue = {
      status: 1,
    };
  }

  let deactivateMsg =
    "Your account has been deactivated. Please contact the owner for more information.";
  let loginMsg = "Successful login. Access granted.";
  let accessDeniedMsg =
    "Access denied: You do not have the necessary permissions to perform this action.";

  if (returnValue.status == 0) {
    alert(loginMsg);
    switch (user) {
      case "Owner":
        window.location.href = "owner.html";
        break;
      case "Farmer":
        window.location.href = "farmer.html";
        break;
      case "Distributor":
        window.location.href = "distributor.html";
        break;
      case "Retailer":
        window.location.href = "retailer.html";
        break;
      case "Consumer":
        window.location.href = "consumer/consumerLogin.html";
        break;
    }
  } else if (returnValue.status == 1) {
    alert(accessDeniedMsg);
  } else {
    alert(deactivateMsg);
  }
};

const logout = async () => {
  let logoutMsg = "Logout successful. Thanks for using our service!";

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];

  await durianContract.methods.logout(account).send({ from: account });
  console.log(durianContract);

  alert(logoutMsg);
  window.location.href = "index.html";
};

const logoutConsumer = async () => {
  let logoutMsg = "Logout successful. Thanks for using our service!";

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];

  await durianContract.methods.logout(account).send({ from: account });
  console.log(durianContract);

  alert(logoutMsg);
  window.location.href = "../index.html";
};

const back = async () => {
  window.location.href = "index.html";
};
