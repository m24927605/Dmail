

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

const initFunction = () => {
  let form_sender = document.querySelector("#form_sender");
  let form_receiver = document.querySelector('#form_receiver');

  form_sender.placeholder = "Please enter Sender Email*";
  form_receiver.placeholder = "Please enter Receiver Email*";

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // 获取已激活的标签页的名称
    var activeTab = $(e.target).text();
    changeTab(activeTab);
  });

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
    console.log('submit');
    let targetForm = event.target;
    let result = formSerialize(targetForm);
    console.log(result);
    upload();
  };
};

const changeLabelsByFormat = (emailFormat) => {
  let labels = document.getElementsByTagName('label');
  for (let i = 0; i < labels.length; i++) {
    if (emailFormat == "normal") {
      labels[i].classList.remove('color_white');
    }
    else {
      labels[i].classList.add('color_white');
    }
  }
};

const setupInputByFormat = (emailFormat) => {
  let form_sender = document.querySelector("#form_sender");
  let form_receiver = document.querySelector('#form_receiver');
  let feeAmount = document.querySelector("[name='feeAmount']");
  let feeAmountField = document.querySelector("[name='feeAmountField']");

  form_sender.placeholder = emailFormat == "normal" ? "Please enter Sender Email*" : "Please enter Sender Address";
  form_receiver.placeholder = emailFormat == "normal" ? "Please enter Receiver Email*" : "Please enter Receiver Address";
  feeAmount.disabled = (emailFormat == "normal");
  feeAmountField.style = (emailFormat == "normal") ? "display:none;" : "";
};

const setupBgByFormat = (emailFormat) => {
  let head_titleInner = document.querySelector('[name=head_title]');
  let bodyInner = document.body;
  if (emailFormat == "normal") {
    bodyInner.classList.remove('background_black');
    head_titleInner.classList.remove('color_white');
  } else {
    bodyInner.classList.add('background_black');
    head_titleInner.classList.add('color_white');
  }
  head_titleInner.innerHTML = emailFormat == "normal" ? "Normal Email" : "Zen Email";
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
    // let reader = new FileReader();
    // reader.onload = function(re) {
    //   let html = `<span>${re.target.result} - ${re}</span>`
    // };
    // console.log(filesArr);
    // if (filesArr.length > 0) {
    //   form_file.classList.add('zIndex_Minus');
    // }
    // else {
    //   form_file.classList.remove('zIndex_Minus');
    // }
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


function upload() {
  console.log("upload");
  let uploadFileInput = document.querySelector('#form_file');
  let curFiles = uploadFileInput.files;
  const repoPath = 'ipfs-' + Math.random();
  const ipfs = new Ipfs({ repo: repoPath });

  //ipfs準備好了
  console.time('ipfs ready');
  ipfs.on('ready', async () => {
    console.timeEnd('ipfs ready');
    const directory = 'directory';
    const files = await readFiles(ipfs, directory, curFiles);
    console.log(`即將上傳${files.length}個檔到ipfs上面`);

    streamFiles(ipfs, directory, files, (err, directoryHash) => {
      if (err) {
        console.log(`There was an error adding the files ${err}`);
        swal({
          html: '發送失敗' + '<br/>err = ' + err,
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
*/
const readFiles = async (ipfs, directory, curFiles) => {

  let promiseArray = [];
  console.time('read file');
  for (let i = 0; i < curFiles.length; i++) {

    let readFilePromise = awaitReadFile(ipfs, directory, curFiles[i]);

    promiseArray.push(readFilePromise);
    // 
  }
  let files = await Promise.all(promiseArray);
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
  stream.on('data', function (data) {
    console.log(`Added ${data.path} hash: ${data.hash}`)
    // The last data event will contain the directory hash
    if (data.path === directory) {
      cb(null, data.hash)
    }
  })
  // Add the files one by one
  files.forEach(file => stream.write(file));
  // When we have no more files to add, close the stream
  stream.end();
  console.timeEnd('stream file');
}

const initReceiveFunction = async () => {
  let result = await getAddresss();
  console.log(`request data = ${JSON.stringify(result)}`);

  // let receive = document.getElementById('receive');
  // let controls_div = document.createElement('div');
  // controls_div.className = 'controls';


  // let row_div = document.createElement('div');
  // row_div.className = 'row';


  // let col_md_6_div = document.createElement('div');
  // col_md_6_div.className = 'col-md-6s';


  // var select = document.createElement("select");
  // select.id = "number-multiple";
  // select.setAttribute("class", "selectpicker form-control");
  // select.setAttribute("data-live-search", "true");
  // select.setAttribute("data-container", "body");
  // select.setAttribute("multiple", "true");
  // select.setAttribute("data-hide-disabled", "true");
  // select.setAttribute("data-actions-box", "true");
  // select.setAttribute("data-virtual-scroll", "true");

  // col_md_6_div.appendChild(select);
  // row_div.appendChild(col_md_6_div);
  // controls_div.appendChild(row_div);
  // receive.appendChild(controls_div);
  //   <div class="controls">
  //   <div class="row">
  //       <!-- sender field -->
  //       <div class="col-md-6">
  //           <select multiple class="selectpicker form-control" id="number-multiple" data-container="body" data-live-search="true" title="Select address"
  //               data-hide-disabled="true" data-actions-box="true" data-virtual-scroll="true"></select>
  //       </div>

  //   </div>
  // </div>



  var address_array = result.newAddressArray;
  var options = [], _options;
  var selected_address = [];


  for (var i = 0; i < address_array.length; i++) {
    var option = '<option value="' + i + '">' + address_array[i] + '</option>';
    options.push(option);
  
  }

  _options = options.join('');

  let dropdown = $('#number-multiple')[0];
  console.log(`options = ${options}`);
  dropdown.innerHTML = _options;
  $(".selectpicker").selectpicker('refresh');//important

  console.log(`dropdown = ${dropdown.innerHTML}`);

  $("#number-multiple").on("changed.bs.select",
    async function () {
      selected_address = $('#number-multiple').selectpicker('val');
      let result = await getTx(address_array[selected_address[0]]);

    });
}

const getAddresss = async () => {
  let response = await fetch("http://localhost:3000/createAddress?count=5", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    }
  });
  let fallingResult = null, finalResult = null;
  if (response.status == 200 || response.status == 201) {
    finalResult = response;
  } else {
    fallingResult = response;
  }
  if (finalResult !== null) {
    let data = await finalResult.json();


    return data;
  } else {
    let err = await fallingResult.json();
    throw err;
  }

}

const getTx = async (address) => {
  console.log(`getTx = ${address}`);
  console.log("getTx url "+"http://localhost:3000/txs?address="+address);
  let response = await fetch("http://localhost:3000/txs?address="+address, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded', // ',
      'Accept': 'application/json'
    }
  });
  let fallingResult = null, finalResult = null;
  if (response.status == 200 || response.status == 201) {
    finalResult = response;
  } else {
    fallingResult = response;
  }
  if (finalResult !== null) {
    let data = await finalResult.json();
    console.log(`getTx data  = ${JSON.stringify(data)}`);

    return data;
  } else {
    let err = await fallingResult.json();
    throw err;
  }

}



