const { EthHdWallet } = require('eth-hd-wallet');
const { ETH_config } = require('../configs/eth_config');
const mnemonic = ETH_config.mnemonic;
const wallet = EthHdWallet.fromMnemonic(mnemonic);
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/2c27dbaf422a4e25ad7dd35e4a197440');
const web3 = new Web3(provider);
const rp = require('request-promise');
const underscore = require('underscore');

exports.createAddress = (addressCount) => {
  return new Promise((resolve, reject) => {
    try {
      const wantCount = Number(addressCount);
      const baseAddressCount = ETH_config.base_address_count;
      let totalAddressArray = wallet.getAddresses();
      if (totalAddressArray.length < 1) {
        const totalAddressCount = baseAddressCount + wantCount;
        wallet.generateAddresses(totalAddressCount);
        totalAddressArray = wallet.getAddresses();
        const startIndex = baseAddressCount;
        const endIndex = totalAddressArray.length;
        const newAddressArray = totalAddressArray.slice(startIndex, endIndex);
        resolve(newAddressArray);
      } else {
        wallet.generateAddresses(wantCount);
        totalAddressArray = wallet.getAddresses();
        const startIndex = baseAddressCount;
        const endIndex = totalAddressArray.length;
        const newAddressArray = totalAddressArray.slice(startIndex, endIndex);
        resolve(newAddressArray);
      }
    } catch (e) {
      console.error('[createAddress Service Error]', e);
      reject(e);
    };
  });
};

exports.doTX = (fromAddress, toAddress, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!wallet.hasAddress(fromAddress)) {
        reject(new Error('This address is not in your wallet.Please import your mnenomic word to create address.'));
      }
      const gasLimit = ETH_config.gas_limit;
      const gasPrice = ETH_config.gas_price * 1e9;
      const sendValue = ETH_config.send_value;
      const txcount = await web3.eth.getTransactionCount(fromAddress);
      const rawTX = wallet.signTransaction({
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(sendValue),
        nonce: web3.utils.toHex(txcount),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: web3.utils.toHex(message),
        chainId: 1 /* see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md */
      });
      const result = await web3.eth.sendSignedTransaction(rawTX);
      const isDone = result.status;
      resolve(isDone);
    } catch (e) {
      console.error('[doTX Service Error]', e);
      reject(e);
    }
  });
};

exports.getTXs = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        uri: `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=QASQCBV73CN8ZCVKPHBYS3AQIPZCMFDZE9`,
        json: true // Automatically parses the JSON string in the response
      };
      const res = await rp.get(options);
      const result = res.result.map((obj) => {
        obj.input = web3.utils.toAscii(obj.input);
        return { txid: obj.hash, confirmations: parseInt(obj.confirmations), fromAddress: obj.from, toAddress: obj.to, message: obj.input };
      })
      resolve(underscore.sortBy(result, 'confirmations'));
    } catch (e) {
      console.error('[getTXs Service Error]', e);
      reject(e);
    }
  });
};
