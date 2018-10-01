const express = require('express');
const router = express.Router();
const { createAddress, doTX, getTXs } = require('../services/eth_services');
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
    const txs = await getTXs(address);
    res.json({ txs: txs });
  } catch (e) {
    res.json({ error: e.message });
  };
});

module.exports = router;
