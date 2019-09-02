# BitDegree Blockchain Scholarships

![BitDegree](https://i.imgur.com/egmx9fg.png)


BitDegree Scholarships is the solution that enables tracking how contributions made by sponsors are used in real-time. Moreover, it enables programmatic giving – sponsors can define rules for their contributions (i.e. geography, demographic data, learning subjects, incentives) and control the implementation as it happens. Sponsors’ user experience is similar to that of advertisers running Google ad campaigns. [Read more...](https://www.bitdegree.org/press-releases/bringing-transparency-to-education-donations-with-blockchain/?utm_source=github&utm_medium=banner&utm_campaign=github-readme-link)

If you have any questions ar would like to partner with us, drop us a message at hello [at] bitdegree.org

# For developers

## Before you start
  - You must have:
    - Ethereum wallet. You can get one [here](https://www.myetherwallet.com/create-wallet)
    - OpenCerts.io certificate [store](https://admin.opencerts.io)
      - Login to your wallet using [MetaMask](https://metamask.io/) extension
      - Deploy a new instance
      - This is your certificate store address
    - Unsigned OpenCerts certificate in form of this [schema](https://github.com/OpenCerts/open-certificate/blob/master/schema/2.0/example.json)
    - MySql table `certificates` with following columns:
      - text `certificate` which stores unsigned OpenCerts certificates
      - text `signed_certificate` to store signed OpenCerts certificate
      - string `merkle_root` to store blockchain certificate hash
    - `ERC20 TYPE TOKEN` smart contract address (we are using BDG TOKEN smart contract `0x1961b3331969ed52770751fc718ef530838b6dee`)
    - register to [ETHEREUM PROVIDER](https://infura.io/)
      - create new project
      - endpoint in `keys` section will be your provider. Select one from `MAINNET` or `ROPSTEN` providers
    - [truffle](https://github.com/trufflesuite/truffle) for building contracts 
      
## Configuration
 - Clone this repository
 - Run `npm install` command
 - Run `truffle compile` to compile contracts
 - Manualy deploy `AlumniStoreContract`using [MyEtherWallet](https://www.myetherwallet.com/interface/deploy-contract)
 - Follow these steps:
  - Press Contract section in MyEtherWallet interface
    - Deploy contract
      - Copy "bytecode" field value from `./contract-storage/build/contracts/AlumniStoreContract.json`
      - Copy "abi" field value from `./contract-storage/build/contracts/AlumniStoreContract.json`
      - Sign transaction
      
## Usage
#### Sign certificate
  - in order to sign unsigned OpenCerts certificate you have to run `node sign-certificate.js [host] [user] [password] [database] [unsigned certificate ID] `

##### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network
 
#### Issue certificate
  - before issuing a blockchain certificate it has to be signed. Run `node certificate-issue.js [provider] [your_wallet_address] [your_wallet_address_private_key] [certificate_store_address] [merkle_root from your signed certificate]` 

##### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network
  
#### Add student
  - You have already deployed your `AlumniStoreContract` in previous step which stores each added student's wallet address and `blockchainCertificateHash` (merkle_root field from your signed certificate)
  - In order to add a new student to your AlumniStoreContract you have to run `node add-student.js [provider] [your_wallet_address] [your_wallet_address_private_key] [alumni_store_contract_address] [signed_certificate_merkle_root] [student_wallet_address]`

#### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network
 
#### Deploy scholarship contract
  - scholarship smart contract is a contract which stores a scholarship tokens. 
  - to deploy this smart contract run `node deploy-contract.js [provider] [your_wallet_address] [your_wallet_address_private_key] [openCertsStoreAddress] [alumniStoreAddress] [tokenContractAddress]`

##### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network

#### Fund scholarship contract
  - before you start this step you must have some `ERC20 TYPE TOKENS`
  - each scholarship contract is developed to store `ERC20 TYPE TOKENS`
  - to fund scholarship run `node send-funds.js [provider] [your_wallet_address] [your_wallet_address_private_key] [token_amount_to_send] [scholarship_contract_address] [token_contract_address]`

##### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network

#### Unlock scholarship
  - in order to transfer tokens from scholarship contract to students wallet you have to run `node unlock-scholarship.js [provider] [your_wallet_address] [your_wallet_address_private_key] [scholarship_contract_address] [signed_certificate_merkle_root]`
  - if defined merkle_root is from issued certificate funds from a contract will be transferred to student

##### Working on ROPSTEN (TEST) NEWORK
  - if you are working on ROPSTEN network only you must define a parameter in `var transaction = new Tx(rawTransaction, {'chain':'ropsten'});`
  - there is no need to do that on `MAIN` ethereum network
