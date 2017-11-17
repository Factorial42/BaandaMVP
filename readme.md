
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

finally just run nodemon
or nodemon app.js
or node app.js

//run parity console
parity --warp --chain ropsten --author "0x0048e718BF01b96C02157FB3de89C93634897Fe0" --unlock "0x0048e718BF01b96C02157FB3de89C93634897Fe0" --password "/Users/Reddy/pwd.txt" --geth --force-ui

//run geth console
geth --testnet --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024  --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303" --unlock "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3" --password "mpreddy77"

//in the DAPP folder
npm run dev

For a quick test:
1: goto http://localhost:8080
  >you should see the file upload form-data
  >select a small file and submit
2: you should see json response similar to this which is a represenation of a single doc:
  >{"s3path":"https://baanda.s3-us-west-2.amazonaws.com/8115099b-41e6-4dc1-91bf-06863e472701","SHA256":"18a3670155ccce513b4bf0ae72e4ad458354d9fa73eced27b5e3b42abb6ad66a","body":"(1) 0x38173212f3e9ffbf6b027ed91f0a411573012318\n(2) 0x646571c7ab2bc1ddc5fe673f367db6ca4d4f2dfd\n(3) 0x7f3acb261f0a3ab0898b44d64de5d1d8393143bf\n(4) 0x542fc1ce1ee4f6817440bedae10bfeae4a91ec3e\n(5) 0x3078edc88c25a537ef74d642125ccc72edc725d1\n(6) 0x6e6f6cc81ebfd93801cc263d280230ac35cb6622\n(7) 0x42451f065c8c94cf718752bd8f8a620f972a6773\n(8) 0x03d1663566d83bb711603ed8d1e8e7607e0bf3e5\n(9) 0x07bfc2e06df655fae6845460fec1568f382b5379","name":"blockchain","_id":"59f3f6e412b48e6676e49bdc","created_date":"2017-10-28T03:17:56.708Z"}


  ************************ RUNNING combo of TRUFFLE, DAPP and lightweight web service ************************
npm install truffle
npm init webpack

+ Deploy the contract using truffle migrate --reset(reset needed if contract gets stale)
finally npm run dev
1: goto http://localhost:8080


Happy dapping!!!
