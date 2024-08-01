async function connectContract() {
    const contractAddress = document.getElementById('contractAddress').value;

    if (!contractAddress) {
        alert('Please enter a contract address');
        return;
    }

    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

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

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        try {
            // Get contract balance
            const balance = await web3.eth.getBalance(contractAddress);
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
        } catch (error) {
            console.error(error);
            alert('Error connecting to the contract. Make sure the contract address and ABI are correct.');
        }
    } else {
        alert('Please install MetaMask!');
    }
}
