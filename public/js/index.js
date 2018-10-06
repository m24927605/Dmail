var table;
// alternative to load event
document.onreadystatechange = function () {
  if (document.readyState == "complete") {

    // init default Setup
    initFunction();
    // bind upload
    bindUpload();
    // bind Submit
    bindSubmit();
  }
}

const initFunction = async () => {
  table = document.querySelector("#table");
  let form_sender = document.querySelector("#form_sender");
  let form_receiver = document.querySelector('#form_receiver');

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // 获取已激活的标签页的名称
    let activeTab = $(e.target).text();
    changeTab(activeTab);
  });

  // window.localStorage.removeItem("sendAddress");
  // window.localStorage.removeItem("receiveAddress");

  let sendStorage = sessionStorage.getItem('sendAddress');
  let receiveStorage = sessionStorage.getItem('receiveAddress');

  console.log(`sendStorage = ${sendStorage}`);
  console.log(`receiveStorage = ${receiveStorage}`);

  let sendAddress = [];
  let receiveAddress = [];

  if (!sendStorage || !receiveStorage) {
    console.log('sendStorage is null || receiveStorage is null');
    try {
      let result = await getAddresss(20);
      let address = result.newAddressArray;
      let placeNames = ['警察局', '衛生局', '交通局', '環保局', '消防局'];
      console.log(`address.length = ${address.length}`);
      for (let i = 10; i < address.length; i++) {
        if (i < 15) {
          let name = `本站${i - 10 + 1}`;
          let obj = {};
          obj[name] = address[i];
          sendAddress.push(obj);
        } else {
          let name = `${placeNames[i - 15]}`;
          let obj = {};
          obj[name] = address[i];
          receiveAddress.push(obj);
        }
      }
      sessionStorage.setItem('sendAddress', JSON.stringify(sendAddress));
      sessionStorage.setItem('receiveAddress', JSON.stringify(receiveAddress));

    } catch (error) {
      showError(error);
      return;
    }

  } else {
    console.log('sendStorage is not null && receiveStorage is not null');

    sendAddress = JSON.parse(sendStorage);
    receiveAddress = JSON.parse(receiveStorage);
  }

  console.log(`sendAddress = ${JSON.stringify(sendAddress)}`);
  console.log(`receiveAddress = ${JSON.stringify(receiveAddress)}`);


  var sendOptions = [], _sendOptions;


  for (let i = 0; i < sendAddress.length; i++) {
    let key = Object.keys(sendAddress[i]);
    let option = '<option value="' + i + '">' + key + "(" + sendAddress[i][key] + ")" + '</option>';
    sendOptions.push(option);
  }
  _sendOptions = sendOptions.join('');
  form_sender.innerHTML = _sendOptions;

  var receiveOptions = [], _receiveOptions;
  for (let i = 0; i < receiveAddress.length; i++) {
    let key = Object.keys(receiveAddress[i]);
    let option = '<option value="' + i + '">' + key + "(" + receiveAddress[i][key] + ")" + '</option>';
    receiveOptions.push(option);
  }
  _receiveOptions = receiveOptions.join('');
  form_receiver.innerHTML = _receiveOptions;

  $(".selectpicker").selectpicker('refresh');//important

};

const changeTab = (tab) => {
  if (tab === "Send Mail") {
    console.log(`activeTab1 = ${tab}`);
  } else {
    console.log(`activeTab2 = ${tab}`);
    initReceiveFunction();
  }
}


/**
 * bindSubmit
 * @description setup submit callback
 */
const bindSubmit = () => {
  let contactForm = document.querySelector('#contact-form');
  contactForm.onsubmit = (event) => {
    //replace orginal form.submit
    event.preventDefault();

    console.log('submit');
    let targetForm = event.target;
    let result = formSerialize(targetForm);
    console.log(result);
    upload();
  };
};



const bindUpload = () => {
  let form_file = document.querySelector('#form_file');
  let files_list = document.querySelector('.files_list');
  form_file.addEventListener('change', (e) => {
    console.log('changes');
    // console.log(other);
    form_file.classList.remove('zIndex_Minus');
    if (!e.target.files || !window.FileReader) {
      return;
    }
    // console.log('tempfiles',e.key);
    files_list.innerHTML = "";
    let files = e.target.files;
    let filesArr = Array.prototype.slice.call(files);
    if (filesArr.length == 0) {
      files_list.innerHTML = "please attach files";
    }

    filesArr.forEach((f, index) => {
      let file = files[index];
      let reader = new FileReader();
      reader.onload = function (re) {
        let size = Number(file.size / (1024 * 1024)).toFixed(5);
        let html = `<div id="file${index}">${file.name} - ${size} kB</div>`;
        files_list.innerHTML += html;
      };
      reader.readAsDataURL(f);
    });
  });
};
// const removeFile = (index) => {
//   console.log(index);
//   let form_file = document.querySelector('#form_file');
//   let files_list = document.querySelector('.files_list');
//   let files = form_file.files;
//   console.log('removefile' ,files);
//   let tempfiles = Array.prototype.slice.call(files);
//   console.log(tempfiles);
//   console.log(tempfiles.splice(index,0));
//   // form_file.value = tempfiles;
//   // console.log(form_file.value);
//   let event = new CustomEvent("change", {'key':tempfiles});
//   // console.log($('#form_file').value);
//   form_file.dispatchEvent(event);
//   // form_file.onchange({target: form_file});
//   form_file = document.querySelector('#form_file');
//   console.log(form_file.files);
//   // files_list.removeChild(document.querySelector(`#file${index}`));
// };
/**
 * formSerialize 
 * @description turn form data to jsons
 * 
 * @param {object} form 
 */
const formSerialize = (form) => {
  if (!form || !form.elements) {
    return null;
  }
  let elements = form.elements;
  let jsonObj = {};
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].type !== "submit") {
      console.log(elements[i].name);
      console.log(elements[i].value);
      jsonObj[elements[i].name] = elements[i].value;
    }
  }
  return jsonObj;
};


async function upload() {
  console.log("upload");
  let uploadFileInput = document.querySelector('#form_file');
  let curFiles = uploadFileInput.files;
  const repoPath = 'ipfs-' + Math.random();
  const ipfs = new Ipfs({ repo: repoPath });


  var doc = new jsPDF('p', 'pt', 'a4');

  $('#contact-form').css("padding", "30px");

  // doc.addHTML($('#contact-form'), function () {
  //   pdf.save("test.pdf");
  // });
  doc.addHTML($('#contact-form'), function () {

  });

  $('#contact-form').css("padding", "0px");


  swal({
    title: '發送中',
    showCloseButton: true,
    onOpen: function () {
      swal.showLoading();
    },
    onClose: function () {
      console.log('close');
      //clearTimeout(timer);
    }
  });

  //ipfs準備好了
  console.time('ipfs ready');
  ipfs.on('ready', async () => {
    console.timeEnd('ipfs ready');
    const directory = 'directory';
    const files = await readFiles(ipfs, directory, curFiles, doc);
    console.log(`即將上傳${files.length}個檔到ipfs上面`);

    streamFiles(ipfs, directory, files, (err, directoryHash) => {
      if (err) {
        swal({
          html: '發送失敗' + '<br/>' + err,
          type: 'error',
          showCloseButton: true,
          confirmButtonText: '確定'
        });
      } else {
        console.log("https://ipfs.io/ipfs/" + directoryHash);

        let directoryHTML = "https://ipfs.io/ipfs/" + directoryHash;

        swal({
          html: '發送完成' + '<br/><a target="_blank" href=' + directoryHTML + '>請點我</a>',
          type: 'success',
          showCloseButton: true,
          confirmButtonText: '確定',
          onOpen: function () {
            console.log(`onOpen = ${directoryHash}`)
          }
        });
      }
    })
  })
}

/**
* 產生要上傳到ipfs的json陣列
* @param {*} ipfs ipfs物件
* @param {*} directory 上傳檔案的資料夾名稱
* @param {*} curFiles 上傳的檔案
* @param {*} doc 畫面所轉成pdf
*/
const readFiles = async (ipfs, directory, curFiles, doc) => {

  let promiseArray = [];
  console.time('read file');
  for (let i = 0; i < curFiles.length; i++) {

    let readFilePromise = awaitReadFile(ipfs, directory, curFiles[i]);

    promiseArray.push(readFilePromise);
    // 
  }
  let files = await Promise.all(promiseArray);

  files.push({
    path: `${directory}/html.pdf`,
    content: ipfs.types.Buffer.from(btoa(doc.output()), "base64")
  })

  console.timeEnd('read file');
  return files;

}
/**
* 將檔案讀進來並產生ipfs上傳的格式
* {path : 資料夾名稱/檔名 , content : 檔案內容}
* 
* @param {*} ipfs  ipfs物件
* @param {*} directory  上傳檔案的資料夾名稱
* @param {*} file 要上傳到ipfs的檔案
*/
async function awaitReadFile(ipfs, directory, file) {
  let fr = new FileReader();
  return new Promise((resolve, reject) => {
    fr.onload = function (fileLoadedEvent) {
      console.log("onload");
      let fileType = file.name.split('.').pop();
      if (fileType === "txt") {
        let textFromFileLoaded = fileLoadedEvent.target.result;
        //若是文字檔，則直接用utf8即可
        resolve({
          path: `${directory}/${file.name}`,
          content: ipfs.types.Buffer.from(textFromFileLoaded, "utf8")
        });
      } else {
        resolve({
          path: `${directory}/${file.name}`,
          content: ipfs.types.Buffer.from(btoa(fr.result), "base64")
        });
      }
    }
    fr.readAsBinaryString(file);
  });
}
/**
* 將檔案上傳到ipfs上
* @param {*} ipfs ipfs物件
* @param {*} directory 上傳檔案的資料夾名稱
* @param {*} files 要上傳的檔案
* @param {*} cb 最後完成後要執行的callback
*/
const streamFiles = (ipfs, directory, files, cb) => {
  // Create a stream to write files to
  console.log(files);
  const stream = ipfs.files.addReadableStream();
  console.time('stream file');
  stream.on('data', async function (data) {
    console.log(`Added ${data.path} hash: ${data.hash}`)
    // The last data event will contain the directory hash
    if (data.path === directory) {

      // let fromAddress = document.querySelector("#form_sender").value;
      // let toAddress = document.querySelector('#form_receiver').value;
      let selectedFromAddressIndex = $("#form_sender").selectpicker('val');
      let selectedReceiveAddressIndex = $("#form_receiver").selectpicker('val');

      console.log(`selectedFromAddressIndex = ${selectedFromAddressIndex}`);
      console.log(`selectedReceiveAddressIndex = ${selectedReceiveAddressIndex}`);


      let sendStorage = sessionStorage.getItem('sendAddress');
      let receiveStorage = sessionStorage.getItem('receiveAddress');

      let sendAddress = JSON.parse(sendStorage);

      console.log(`sendAddress = ${JSON.stringify(sendAddress)}`);
      let sendAddressKey = Object.keys(sendAddress[selectedFromAddressIndex]);
      console.log(`sendAddressKey = ${sendAddressKey}`);
      let receiveAddress = JSON.parse(receiveStorage);
      let receiveAddressKey = Object.keys(receiveAddress[selectedReceiveAddressIndex]);
      console.log(`receiveAddressKey = ${receiveAddressKey}`);

      console.log(`fromAddress = ${sendAddress[selectedFromAddressIndex][sendAddressKey]}`);

      // let data123 = {
      //   "fromAddress": sendAddress[selectedFromAddressIndex][sendAddressKey],
      //   "toAddress": receiveAddress[selectedReceiveAddressIndex][receiveAddressKey],
      //   "message": "https://ipfs.io/ipfs/"
      // };

      // console.log(`data123 = ${JSON.stringify(data123)}`);
      //{"error":"This address is not in your wallet.Please import your mnenomic word to create address."}

      try {
        let result = await doTx({
          "fromAddress": sendAddress[selectedFromAddressIndex][sendAddressKey],
          "toAddress": receiveAddress[selectedReceiveAddressIndex][receiveAddressKey],
          "message": "https://ipfs.io/ipfs/" + data.hash
        });
        cb(null, data.hash);
      } catch (error) {
        cb(error, null);
      }



    }
  })
  // Add the files one by one
  files.forEach(file => stream.write(file));
  // When we have no more files to add, close the stream
  stream.end();
  console.timeEnd('stream file');
}

const initReceiveFunction = async () => {
  let result = sessionStorage.getItem('receiveAddress');
  let receiveAddress = JSON.parse(result);

  var options = [], _options;
  var selected_address;
  var address_array = [];

  for (var i = 0; i < receiveAddress.length; i++) {
    let key = Object.keys(receiveAddress[i]);
    let option = '<option value="' + i + '">' + key + "(" + receiveAddress[i][key] + ")" + '</option>';
    address_array.push(receiveAddress[i][key]);
    options.push(option);
  }

  try {
    let chartsResult = await getCharts(address_array);

    drawChart(receiveAddress , chartsResult);
    console.log(chartsResult);

    _options = options.join('');

    let dropdown = $('#number-multiple')[0];
    dropdown.innerHTML = _options;
    $(".selectpicker").selectpicker('refresh');//important

    console.log(`dropdown = ${dropdown.innerHTML}`);

    $("#number-multiple").on("changed.bs.select",
      async function () {
        selected_address = address_array[$('#number-multiple').selectpicker('val')];
        console.log(`selected_address = ${selected_address}`);
        // let result = await getTx(selected_address);
        console.log(`result = ${JSON.stringify(chartsResult[selected_address])}`);


      });



  } catch (error) {
    showError(error);
  }

}

const getAddresss = async (count) => {
  let response = await fetch(`http://localhost:3000/createAddress?count=${count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    }
  });
  let result = await response.json();
  if (result.hasOwnProperty('error')) {
    throw result.error;
  } else {
    return result;
  }
}

const getTx = async (address) => {

  swal({
    title: '下載中',
    onOpen: function () {
      swal.showLoading();
    }
  });

  console.log(`getTx = ${address}`);
  console.log("getTx url " + "http://localhost:3000/txs?address=" + address);
  let response = await fetch("http://localhost:3000/txs?address=" + address, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    }
  });
  swal.close();
  let result = await response.json();
  if (result.hasOwnProperty('error')) {
    throw result.error;
  } else {
    return result;
  }
}

//{ "fromAddress":"0x3407e8c5e9e47a166631393d6711aa580cf17d3b","toAddress":"0x6dee7ac37ba930f97fa66e57e4b4788bd2f52524","message":"https://ipfs.io/ipfs/QmQxz5RJkjsECBNzpGG8TZZc75oTPxqvJk2CerxjhneWYZ"}
const doTx = async (data) => {
  let { fromAddress, toAddress, message } = data;
  console.log(`doTx data = ${JSON.stringify(data)}`);
  console.log(`fromAddress = ${fromAddress}`);
  console.log(`toAddress = ${toAddress}`);
  console.log(`message = ${message}`);
  let response = await fetch("http://localhost:3000/doTX", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });
  let result = await response.json();
  if (result.hasOwnProperty('error')) {
    throw result.error;
  } else {
    return result;
  }
}

const getCharts = async (address) => {

  swal({
    title: '下載中',
    onOpen: function () {
      swal.showLoading();
    }
  });

  let addressParameter = '';
  for (let i = 0; i < address.length; i++) {
    if (i == 0) {
      addressParameter = address[i];
    } else {
      addressParameter = addressParameter + ',' + address[i];
    }
  }

  console.log(`addressParameter = ${addressParameter}`);
  console.log("getCharts url " + "http://localhost:3000/charts?addresses=" + addressParameter);
  let response = await fetch("http://localhost:3000/charts?addresses=" + addressParameter, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    }
  });
  swal.close();
  let result = await response.json();
  if (result.hasOwnProperty('error')) {
    throw result.error;
  } else {
    return result;
  }
}

const showError = (error) => {
  swal({
    html: '錯誤' + '<br/> = ' + error,
    type: 'error',
    showCloseButton: true,
    confirmButtonText: '確定'
  });
}

const drawChart = (receiveAddress , chartsResult) => {

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
}