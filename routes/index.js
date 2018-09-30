const express = require('express');
const router = express.Router();
const { createAddress, doTX } = require('../services/eth_services');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/createAddress', async (req, res, next) => {
  try {
    const count = req.query.count;
    const newAddressArray = await createAddress(count);
    res.json({ newAddressArray: newAddressArray });
  } catch (e) {
    res.json({ error: e.message });
  };
});

router.post('/doTX', async (req, res, next) => {
  try {
    const { fromAddress, toAddress, message } = req.body;
    console.log(fromAddress)
    const isDone = await doTX(fromAddress, toAddress, message);
    res.json({ isDone: isDone });
  } catch (e) {
    res.json({ error: e.message });
  };
});

module.exports = router;
