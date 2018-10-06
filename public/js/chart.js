let receiveAddress = JSON.parse(sessionStorage.getItem('receiveAddress'));
let chartsResult = [
  [
    {
      "txid": "0x03ec52931554df05c69e636dca7eb7b37b6c84e03ab70d1421e4e767138840c2",
      "confirmations": 33535,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "QmQxz5RJkjsECBNzpGG8TZZc75oTPxqvJk2CerxjhneWYZ",
      "date": "2018-09-30",
      "dateTime": "2018-09-30 23:50:52"
    },
    {
      "txid": "0x556ee506a8c36504e3638e1eabe48565fc1ab9f21e310eec95156add997a063c",
      "confirmations": 33470,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "QmQxz5RJkjsECBNzpGG8TZZc75oTPxqvJk2CerxjhneWYZ",
      "date": "2018-10-01",
      "dateTime": "2018-10-01 00:04:40"
    },
    {
      "txid": "0x8930a781b1103a7f68142a7a1d64654933da64c65c3c6b7343a12d7c2e9b61aa",
      "confirmations": 33468,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "https://ipfs.io/ipfs/QmQxz5RJkjsECBNzpGG8TZZc75oTPxqvJk2CerxjhneWYZ",
      "date": "2018-10-01",
      "dateTime": "2018-10-01 00:05:29"
    },
    {
      "txid": "0x7c9b397475f55a8aaa61bb590cc0f4996a7f8c986f3b36d5c87e11fb0ac5150a",
      "confirmations": 15522,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "https://ipfs.io/ipfs/QmPnsAvvS7U7Z2DTcKQfJdLSPPZeDbq67NhL9KdixmmyUK",
      "date": "2018-10-03",
      "dateTime": "2018-10-03 22:26:19"
    },
    {
      "txid": "0xf7cea258caf0f5087516b258c6502cee666fec417fef9f524c47d6f0a8c13be3",
      "confirmations": 15520,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "https://ipfs.io/ipfs/QmPnsAvvS7U7Z2DTcKQfJdLSPPZeDbq67NhL9KdixmmyUK",
      "date": "2018-10-03",
      "dateTime": "2018-10-03 22:27:01"
    },
    {
      "txid": "0x92e17ad45419f659cbf78ee1c5fd8823485a5d7f49bebfdabf1925a0f87a65f4",
      "confirmations": 15510,
      "fromAddress": "0x3407e8c5e9e47a166631393d6711aa580cf17d3b",
      "toAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "message": "https://ipfs.io/ipfs/QmdnQmLcFGw3RGxZAhhabFiC2xJTfr9cCgMWsBucY64bGT",
      "date": "2018-10-03",
      "dateTime": "2018-10-03 22:29:16"
    },
    {
      "txid": "0x29009bbf6d37451aa9ac00e54319e01a879355f5497e20b0cbd55f1033307d3c",
      "confirmations": 3531,
      "fromAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "toAddress": "0x26a5fcbfd412b0b4e1e8a3b6d984d72878571b98",
      "message": "https://ipfs.io/ipfs/QmbR6EN4XYGRFWUqZMUBE1TSUSdgrsKWnKFW3DAX3TvXsF",
      "date": "2018-10-05",
      "dateTime": "2018-10-05 21:18:42"
    }
  ],
  [
    {
      "txid": "0x29009bbf6d37451aa9ac00e54319e01a879355f5497e20b0cbd55f1033307d3c",
      "confirmations": 3531,
      "fromAddress": "0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524",
      "toAddress": "0x26a5fcbfd412b0b4e1e8a3b6d984d72878571b98",
      "message": "https://ipfs.io/ipfs/QmbR6EN4XYGRFWUqZMUBE1TSUSdgrsKWnKFW3DAX3TvXsF",
      "date": "2018-10-05",
      "dateTime": "2018-10-05 21:18:42"
    }
  ],
  [],
  [],
  []
];

//以下都要
let addrKeyArray = [];
let countArray = [];
for (let [index, addr] of receiveAddress.entries()) {
  let key = Object.keys(addr);
  addrKeyArray.push(key[0]);
  countArray.push(chartsResult[index].length);
}
new Chart(document.getElementById("bar-chart"), {
  type: 'bar',
  data: {
    labels: addrKeyArray,
    datasets: [
      {
        label: "單位（筆）",
        backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
        data: countArray
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: '統計圖'
    }
  }
});