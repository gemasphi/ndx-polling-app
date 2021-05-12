const IPFS = require('ipfs')

const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')

let path = process.env.IPFS_PATH
console.log(path)
const ipfsOptions = {
    repo: path,
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/3000',
      Swarm: ['/ip4/0.0.0.0/tcp/3001'],
      Gateway: '/ip4/0.0.0.0/tcp/3002'
    },
}

const addr = '/orbitdb/zdpuB2fwXeyvmz7YHBq6auuox7HRD11qfcwkQRzkAiG3EUBy7/ndx-polling'

const db_ = IPFS.create(ipfsOptions)
.then(ipfs => {
  return OrbitDB.createInstance(ipfs)
}).then((orbitDB) => {
  console.log(addr)
  
  return orbitDB.docstore(addr)

    // db.open(addr)
})

