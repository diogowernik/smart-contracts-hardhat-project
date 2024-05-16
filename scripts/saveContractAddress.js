// saveContractAddress.js

const fs = require('fs');

function saveContractAddress(network, contractName, address) {
    const path = './deployed_addresses.json';
    const addresses = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    if (!addresses[network]) addresses[network] = {}; // Assegura que a rede exista no objeto
    addresses[network][contractName] = address; // Salva o endereço com o nome do contrato como chave
    fs.writeFileSync(path, JSON.stringify(addresses, null, 2));
    console.log(`Address saved for ${network} - ${contractName}: ${address}`);
}

module.exports = saveContractAddress;