1: Geth Basic setup
********************** RUN GETH OR PARITY TO SYNC WITH ROPSTEN NETWORK *****************
//RUN PARITY RPC
parity --mode active --tracing off --pruning fast --db-compaction ssd --cache-size 1024  --chain ropsten --author "0x00a0091db3062da65950e8cde7e5a694c8d2410e" --unlock "0x00a0091db3062da65950e8cde7e5a694c8d2410e" --password "/Users/Reddy/pwd.txt" --geth --force-ui --no-persistent-txqueue

parity --mode active --tracing off --pruning fast --db-compaction ssd --cache-size 1024 

//RUN GETH RPC
//run geth console
geth --testnet --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024  --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303" --unlock "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3" --password "/Users/Reddy/pwd.txt"

2: SERVER COMPONENT
************************ RUNNING NODE.JS AS THE MICROSERVICE API ************************
npm install --save --only=dev nodemon //in case local setup has issues run global setup of nodemon
npm install -g nodemon
npm install express --save
npm install body-parser --save
npm remove mongoose //Client connection release issue
npm install mongoose@4.10.8 --save
npm install --save express-fileupload // file upload
npm install --save aws-sdk
npm install crypto-js
npm install serve-index
npm install opn //to open http target in browser

finally just run nodemon
or nodemon app.js
or node app.js


3: CLIENT COMPONENT
//in the DAPP folder
npm run dev


Happy dapping!!!
