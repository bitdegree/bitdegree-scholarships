const web3 = require('web3')
const BigNumber = require('bignumber.js')
const { Buffer } = require('buffer/')
const Tx = require('ethereumjs-tx').Transaction

const web3js = new web3(new web3.providers.HttpProvider(process.argv[2]))
const myAddress = process.argv[3]
const privateKey = Buffer.from(process.argv[4], 'hex')
let value = process.argv[5]
const contractAddress = process.argv[6]
const minABI = [{
 constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
}, {
 constant: false, inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
 constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
constant: false, inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: true, inputs: [], name: 'DECIMALS', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function',
}, {
constant: true, inputs: [], name: 'INITIAL_SUPPLY', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
 constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function',
}, {
constant: false, inputs: [{ name: 'spender', type: 'address' }, { name: 'addedValue', type: 'uint256' }], name: 'increaseAllowance', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: false, inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'mint', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: false, inputs: [{ name: 'value', type: 'uint256' }], name: 'burn', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
 constant: true, inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
 constant: false, inputs: [{ name: 'from', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'burnFrom', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
constant: false, inputs: [{ name: 'account', type: 'address' }], name: 'addMinter', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: false, inputs: [], name: 'renounceMinter', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
constant: false, inputs: [{ name: 'spender', type: 'address' }, { name: 'subtractedValue', type: 'uint256' }], name: 'decreaseAllowance', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
constant: false, inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function',
 }, {
 constant: true, inputs: [{ name: 'account', type: 'address' }], name: 'isMinter', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
constant: true, inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
 }, {
 inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor',
 }, { payable: false, stateMutability: 'nonpayable', type: 'fallback' }, {
anonymous: false, inputs: [{ indexed: true, name: 'account', type: 'address' }], name: 'MinterAdded', type: 'event',
}, {
anonymous: false, inputs: [{ indexed: true, name: 'account', type: 'address' }], name: 'MinterRemoved', type: 'event',
 }, {
anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event',
 }, {
anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event',
 }]
const tokenAddress = process.argv[7]

// Get ERC20 Token contract instance
const tokenContract = new web3js.eth.Contract(minABI, tokenAddress)

const decimals = new BigNumber(18)

const amount = new BigNumber(value)

// calculate ERC20 token amount
value = web3js.utils.toHex(amount.times(new BigNumber(10).pow(decimals)))

web3js.eth.getTransactionCount(myAddress).then((v) => {
    // creating raw transaction
    const rawTransaction = {
        from: myAddress,
        gasPrice: web3js.utils.toHex((new BigNumber(10)).pow(9).mul(40)),
        gasLimit: web3js.utils.toHex(210000),
        to: tokenAddress,
        value: '0x0',
        data: tokenContract.methods.transfer(contractAddress, value).encodeABI(),
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
