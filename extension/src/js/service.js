function getBalance() {
    loading(1000);
    chrome.storage.local.get(['ethereum'], function (result) {
        var ethereum = result.ethereum;
        console.log(ethereum[0]);
        $('#kt_detail_stitle').text(ethereum[0].name);
        $('#kt_detail_maddress').text(ethereum[0].address);
        $('#pome_backup_seed_txt').text(ethereum[0].mnemonic)

        getApiBalance("ethereum", ethereum[0].address).then(
            result => {
                console.log(result);
                $('#kt_detail_mbalance').text(result.balance);
                getAllTokenBalance(result.balance);

            }
        );

    });
}

async function getApiBalance(type, address) {
    var value = { result: "FAIL" };
    var address = address;
    var hostUrl = "http://localhost:8085/pome-rpc/" + type;
    var params = { address: address }

    await $.ajax({
        type: "POST",            // HTTP method type(GET, POST) 형식이다.
        contentType: 'application/json',
        async: true,
        url: hostUrl,      // 컨트롤러에서 대기중인 URL 주소이다.
        data: JSON.stringify(params),            // Json 형식의 데이터이다.
        success: function (res) { // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
            value = res;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            console.log("통신 실패.")
        }
    });
    return value

}

async function getAllTokenBalance(main_balance) {
    // 토큰 리스트 초기화
    $('#kt_detail_tlist').empty();
    //console.log(mainnet, index);
    const mywallet_detail = await chrome.storage.local.get('ethereum');
    const mywallet_select_detail = mywallet_detail['ethereum'][0];
    const token_list = mywallet_select_detail.tokenlist;

    // 중복검사를 위한 Array;
    const kt_token_my_array = new Array();

    // 리스트를 잡아준다.
    for (const [index, item] of token_list.entries()) {
        var detail_id = "tdetail" + index;
        $('#kt_detail_tlist').append(
            '<li class="tdetail" id="' + detail_id + '" data-tdetail="' + escape(JSON.stringify(item)) + '">'
            + '</li>'
        );
        // contract의 배열을 담아준다.
        kt_token_my_array.push(item.token_contract);
    }
    $('#kt_tcontract_marray').val(kt_token_my_array);

    // async로 가져온다.
    for (const [index, item2] of token_list.entries()) {
        getApiTokenBalance("ethereum", item2.token_contract, mywallet_select_detail.address, item2.token_decimal).then(
            result => {
                var detail_id = "tdetail" + index;
                $('#' + detail_id).attr('data-tbalance', result.balance);
                $('#' + detail_id).append(
                    '<div>'
                    + '<div class="account_icon">'
                    + '<img src="' + item2.token_img + '" alt="" />'
                    + '</div>'
                    + result.balance + " " + item2.token_symbol
                    + '</div>'
                    + '<div class="right_icon"></div>'
                );
            }
        )
    }

    // 메인토큰
    $('#kt_detail_tlist').prepend(
        '<li>'
        + '<div>'
        + '<div class="account_icon">'
        + '<img src="img/eth.svg" alt="" />'
        + '</div>'
        + main_balance + " ETH"
        + '</div>'
        + '</li>'
    );

}

async function getApiTokenBalance(type, contract_address, address, decimal) {
    //console.log(type + "," + contract_address + "," + address + "," + decimal);
    var value = { result: "FAIL" };
    var hostUrl = "http://localhost:8085/pome-rpc/token-balance/" + type;
    var contract_address = contract_address;
    var address = address;
    var decimal = decimal;
    var params = {
        address: address
        , contract_address: contract_address
        , decimal: decimal
    }

    await $.ajax({
        type: "POST",            // HTTP method type(GET, POST) 형식이다.
        contentType: 'application/json',
        async: true,
        url: hostUrl,      // 컨트롤러에서 대기중인 URL 주소이다.
        data: JSON.stringify(params),            // Json 형식의 데이터이다.
        success: function (res) { // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
            value = res;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
            console.log("통신 실패.")
        }
    });
    return value
}


chrome.notifications.onClicked.addListener(function(notifId){
    

    if (notifId == "notic") {
        chrome.storage.sync.get(['notic'], function (result2) {
            chrome.tabs.create({url: "https://rinkeby.etherscan.io/tx/" + result2.notic});
    
        });
    }
  
  });