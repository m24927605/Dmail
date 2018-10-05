exports.chartJson = (txs, addrs) => {
  return new Promise((resolve, reject) => {
    try {
      for (let [index, addr] of addrs.entries()) {
        txs[index]['addr'] = addr;
        txs[index]['count'] = txs[index]['result'].length;
      }
      resolve(txs);
    } catch (e) {
      reject(e);
    }
  })
}