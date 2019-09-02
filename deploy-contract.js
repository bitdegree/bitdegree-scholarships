const web3 = require('web3')
const BigNumber = require('bignumber.js')
const { Buffer } = require('buffer/')
const Tx = require('ethereumjs-tx').Transaction
const scholarshipContractJson = require('./build/contracts/ScholarshipContract.json')

const web3js = new web3(new web3.providers.HttpProvider(process.argv[2]))
const myAddress = process.argv[3]
const privateKey = Buffer.from(process.argv[4], 'hex')
const tokenContract = new web3js.eth.Contract(scholarshipContractJson.abi)
const contractData = tokenContract.deploy({
    data: web3js.utils.toHex(scholarshipContractJson.bytecode),
    arguments: [web3js.utils.toHex(process.argv[5]), web3js.utils.toHex(process.argv[6]), web3js.utils.toHex(process.argv[7])], // _openCertsStoreAddress, _alumniStoreAddress, _tokenContractAddress
}).encodeABI()

web3js.eth.getTransactionCount(myAddress).then((count) => {
    const rawTransaction = {
        nonce: web3js.utils.toHex(count),
        value: '0x0',
        gasPrice: web3js.utils.toHex((new BigNumber(8)).pow(9).mul(40)),
        gasLimit: web3js.utils.toHex(2100000),
        data: contractData,
        from: myAddress,
    }

    // creating transaction via ethereumjs-tx
    const transaction = new Tx(rawTransaction)
    // signing transaction with private key
    transaction.sign(privateKey)

    // sending transaction via web3js module
    try {
        web3js.eth.sendSignedTransaction(`0x${transaction.serialize().toString('hex')}`).then((res, err) => {
            process.stdout.write(JSON.stringify({
                address: res.contractAddress,
                status: res.status,
            }, null, 4))
        })
    } catch (e) {
        process.stdout.write(e)
    }
})
