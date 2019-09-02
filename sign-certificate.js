const openCert = require('@govtechsg/open-certificate')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.argv[2],
  user: process.argv[3],
  password: process.argv[4],
  database: process.argv[5],
})
let unsignedCertificate = ''
connection.connect()

connection.query('SELECT certificate from certificates where id = ?', [process.argv[6]], (err, res) => {
    unsignedCertificate = JSON.parse(res[0].certificate)
    const signedCertificate = openCert.issueCertificate(unsignedCertificate)
    connection.query('UPDATE certificates SET signed_certificate = ?, merkle_root = ? WHERE id = ?', [
        JSON.stringify(signedCertificate),
        signedCertificate.signature.merkleRoot,
        process.argv[6],
    ], () => {
      process.stdout.write(JSON.stringify({
        merkleRoot: signedCertificate.signature.merkleRoot,
      }, null, 4))
      connection.end()
    })
})
