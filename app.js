async function connectContract() {
    const address = document.getElementById('contractAddress').value;

    if (!address) {
        alert('Please enter an address');
        return;
    }

    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        try {
            // Check if the address is a contract
            const code = await web3.eth.getCode(address);
            if (code === '0x') {
                // Address is a wallet
                const balance = await web3.eth.getBalance(address);
                document.getElementById('contractBalance').innerText = web3.utils.fromWei(balance, 'ether') + ' ETH';
                document.getElementById('contractOwner').innerText = 'N/A (Wallet Address)';
                document.getElementById('contractFunctions').innerHTML = 'N/A';
            } else {
                // Address is a contract
                // ABI of the contract (simplified example)
                const contractABI = [
                    // Add your contract's ABI here
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "owner",
                        "outputs": [
                            {
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "balance",
                        "outputs": [
                            {
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    }
                ];

                const contract = new web3.eth.Contract(contractABI, address);

                // Get contract balance
                const balance = await web3.eth.getBalance(address);
                document.getElementById('contractBalance').innerText = web3.utils.fromWei(balance, 'ether') + ' ETH';

                // Get contract owner
                const owner = await contract.methods.owner().call();
                document.getElementById('contractOwner').innerText = owner;

                // Display contract functions
                const contractFunctions = contract.options.jsonInterface.filter(method => method.type === 'function');
                const functionsList = document.getElementById('contractFunctions');
                functionsList.innerHTML = '';

                contractFunctions.forEach(func => {
                    const listItem = document.createElement('li');
                    listItem.innerText = func.name;
                    functionsList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to the address. Make sure the address is correct.');
        }
    } else {
        alert('Please install MetaMask!');
    }
}
