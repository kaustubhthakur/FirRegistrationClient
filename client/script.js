
const contractAddress = "0x9541B9065CfAAdcB2e2e986e4aC011F1863fbDbc"; 
const contractABI =[
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
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "complaint",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			}
		],
		"name": "complaintregistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_complaint",
				"type": "string"
			}
		],
		"name": "registercomplaint",
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
		"name": "resolvecomplaint",
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
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			}
		],
		"name": "resolvedcomplaint",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "allcomplaints",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "complaint",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "resolved",
						"type": "bool"
					}
				],
				"internalType": "struct FIRRegistration.Complaint[]",
				"name": "",
				"type": "tuple[]"
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
		"name": "complaints",
		"outputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "complaint",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
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
	},
	{
		"inputs": [],
		"name": "resolvedcomplaints",
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
		"inputs": [],
		"name": "totalcomplaints",
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
		"inputs": [],
		"name": "unresolvedcomplaints",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "complaint",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "resolved",
						"type": "bool"
					}
				],
				"internalType": "struct FIRRegistration.Complaint[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
let contract;
let accounts;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.ethereum !== 'undefined') {
        document.getElementById('connectButton').disabled = false;
    } else {
        alert('MetaMask is not installed. Please install MetaMask to use this app.');
    }
});

async function connectMetaMask() {
    try {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById('connectButton').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
    } catch (error) {
        console.error('User denied account access', error);
    }
}

async function registerComplaint() {
    const location = document.getElementById('location').value;
    const complaint = document.getElementById('complaint').value;
    
    contract.methods.registercomplaint(location, complaint).send({ from: accounts[0] })
        .on('receipt', receipt => {
            alert('Complaint Registered Successfully');
            document.getElementById('location').value = '';
            document.getElementById('complaint').value = '';
        })
        .on('error', error => {
            console.error(error);
            alert('Error registering complaint');
        });
}

async function fetchAllComplaints() {
    const complaintsList = document.getElementById('complaintsList');
    complaintsList.innerHTML = '';

    contract.methods.allcomplaints().call()
        .then(complaints => {
            complaints.forEach((complaint, index) => {
                const li = document.createElement('li');
                li.textContent = `ID: ${index} - User: ${complaint.user} - Location: ${complaint.location} - Complaint: ${complaint.complaint} - Resolved: ${complaint.resolved}`;
                complaintsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching complaints');
        });
}

async function fetchUnresolvedComplaints() {
    const unresolvedComplaintsList = document.getElementById('unresolvedComplaintsList');
    unresolvedComplaintsList.innerHTML = '';

    contract.methods.unresolvedcomplaints().call()
        .then(complaints => {
            complaints.forEach((complaint, index) => {
                const li = document.createElement('li');
                li.textContent = `ID: ${index} - User: ${complaint.user} - Location: ${complaint.location} - Complaint: ${complaint.complaint} - Resolved: ${complaint.resolved}`;
                unresolvedComplaintsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching unresolved complaints');
        });
}

async function resolveComplaint() {
    const complaintId = document.getElementById('complaintId').value;

    contract.methods.resolvecomplaint(complaintId).send({ from: accounts[0] })
        .on('receipt', receipt => {
            alert('Complaint Resolved Successfully');
            document.getElementById('complaintId').value = '';
        })
        .on('error', error => {
            console.error(error);
            alert('Error resolving complaint');
        });
}