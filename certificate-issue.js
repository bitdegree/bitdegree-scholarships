const web3 = require('web3')
const BigNumber = require('bignumber.js')
const { Buffer } = require('buffer/')
const Tx = require('ethereumjs-tx').Transaction

const merkleRoot = process.argv[6]
const web3js = new web3(new web3.providers.HttpProvider(process.argv[2]))
const myAddress = process.argv[3]

const privateKey = Buffer.from(process.argv[4], 'hex')
const contractABI = [{
constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
}, {
 constant: false, inputs: [{ name: 'document', type: 'bytes32' }], name: 'issue', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
 constant: true, inputs: [{ name: 'document', type: 'bytes32' }], name: 'isIssued', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
}, {
constant: true, inputs: [{ name: 'document', type: 'bytes32' }, { name: 'blockNumber', type: 'uint256' }], name: 'isRevokedBefore', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
}, {
 constant: true, inputs: [{ name: 'document', type: 'bytes32' }], name: 'isRevoked', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
constant: true, inputs: [], name: 'version', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
 constant: true, inputs: [{ name: 'document', type: 'bytes32' }, { name: 'blockNumber', type: 'uint256' }], name: 'isIssuedBefore', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
 constant: false, inputs: [], name: 'renounceOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
 constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
 constant: false, inputs: [{ name: 'document', type: 'bytes32' }], name: 'revoke', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
 constant: true, inputs: [{ name: 'document', type: 'bytes32' }], name: 'getIssuedBlock', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
 inputs: [{ name: '_name', type: 'string' }], payable: false, stateMutability: 'nonpayable', type: 'constructor',
 }, {
anonymous: false, inputs: [{ indexed: true, name: 'document', type: 'bytes32' }], name: 'DocumentIssued', type: 'event',
 }, {
 anonymous: false, inputs: [{ indexed: true, name: 'document', type: 'bytes32' }], name: 'DocumentRevoked', type: 'event',
}, {
anonymous: false, inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }], name: 'OwnershipRenounced', type: 'event',
 }, {
anonymous: false, inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }, { indexed: true, name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event',
}]
const contractAddress = process.argv[5]
const contract = new web3js.eth.Contract(contractABI, contractAddress)

web3js.eth.getTransactionCount(myAddress).then((v) => {
    // creating raw transaction
    const rawTransaction = {
        from: myAddress,
        gasPrice: web3js.utils.toHex((new BigNumber(10)).pow(9).mul(40)),
        gasLimit: web3js.utils.toHex(210000),
        to: contractAddress,
        value: '0x0',
        data: contract.methods.issue(`0x${merkleRoot}`).encodeABI(),
        nonce: web3js.utils.toHex(v),
    }

    // creating transaction via ethereumjs-tx
    const transaction = new Tx(rawTransaction)

    // signing transaction with private key
    transaction.sign(privateKey)

    // sending transaction via web3js module
    try {
        web3js.eth.sendSignedTransaction(`0x${transaction.serialize().toString('hex')}`).then((res, err) => {
            process.stdout.write(JSON.stringify({
                status: res.status,
            }, null, 4))
        })
    } catch (e) {
        process.stdout.write(e)
    }
})
