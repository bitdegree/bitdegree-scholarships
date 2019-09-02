const web3 = require('web3')
const BigNumber = require('bignumber.js')
const { Buffer } = require('buffer/')
const Tx = require('ethereumjs-tx').Transaction
const alumniStoreContractJson = require('./build/contracts/AlumniStoreContract.json')

const merkleRoot = process.argv[6]
const address = process.argv[7]
const web3js = new web3(new web3.providers.HttpProvider(process.argv[2]))
const myAddress = process.argv[3]
const privateKey = Buffer.from(process.argv[4], 'hex')
const contractAddress = process.argv[5]
const contract = new web3js.eth.Contract(alumniStoreContractJson.abi, contractAddress)

web3js.eth.getTransactionCount(myAddress).then((v) => {
    // creating raw transaction
    const rawTransaction = {
        from: myAddress,
        gasPrice: web3js.utils.toHex((new BigNumber(10)).pow(9).mul(40)),
        gasLimit: web3js.utils.toHex(210000),
        to: contractAddress,
        value: '0x0',
        network_id: 3,
        data: contract.methods.addStudent(`0x${merkleRoot}`, address).encodeABI(),
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
