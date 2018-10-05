const express = require('express');
const router = express.Router();
const { createAddress, doTX, getTX, getAddrsTX } = require('../services/eth_services');
const { chartJson } = require('../services/utils');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

//http://localhost:3000/createAddress?count=5
router.get('/createAddress', async (req, res, next) => {
  try {
    const count = req.query.count;
    const newAddressArray = await createAddress(count);
    res.json({ newAddressArray: newAddressArray });
  } catch (e) {
    res.json({ error: e.message });
  };
});

//{ "fromAddress":"0x3407e8c5e9e47a166631393d6711aa580cf17d3b","toAddress":"0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524","message":"https://ipfs.io/ipfs/QmQxz5RJkjsECBNzpGG8TZZc75oTPxqvJk2CerxjhneWYZ"}
router.post('/doTX', async (req, res, next) => {
  try {
    const { fromAddress, toAddress, message } = req.body;
    const isDone = await doTX(fromAddress, toAddress, message);
    res.json({ isDone: isDone });
  } catch (e) {
    res.json({ error: e.message });
  };
});

//http://localhost:3000/txs?address=0x3407e8c5e9e47a166631393d6711aa580cf17d3b
router.get('/txs', async (req, res, next) => {
  try {
    const address = req.query.address;
    const txs = await getTX(address);
    res.json({ txs: txs });
  } catch (e) {
    res.json({ error: e.message });
  };
});
//http://localhost:3000/charts?addresses=0xf618986dc13e6231fc5832eb3760414a676003d0,0x26a5fcbfd412b0b4e1e8a3b6d984d72878571b98,0x8c198bca6f8d9d42cccf268c2bfe922c39ce022f,0xd1bca54bff0f52fbdf11bf3b9a8c4eb2629d02c8,0x0e91593e33409addf81b1d4950edeb32729681ca
router.get('/charts', async (req, res, next) => {
  try {
    const addresses = req.query.addresses;
    const addressArray = addresses.split(',');
    const txData = await getAddrsTX(addressArray);
    const chartData = await chartJson(txData, addressArray);
    res.json(chartData);
  } catch (e) {
    res.json({ error: e.message });
  };
});

module.exports = router;
