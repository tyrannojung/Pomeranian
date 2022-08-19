// 첫글자 대문자 변환 함수
function letterCapitalize(str) {
    let result = str.split(" ");
    if (str === "") {//빈 문자열을 받으면 빈 문자열을 반환
      return "";
    }
    for (let i = 0; i < result.length; i++) {
      if (result[i].length > 0) {
          //split()으로 만든 배열에서 첫 번째 배열의 첫 번째 글자를 대문자로 만든 뒤
          //나머지 글자를 slice()로 갖다붙임.
        result[i] = result[i][0].toUpperCase() + result[i].slice(1);
      }
    }
    str = result.join(" ");
    return str;

}

// 지갑 세부 닫기는 함수
function close_account() {
  setTimeout(function(){
      $('.account_atc').removeClass('account_atc_open');
      $('.act_pan').css('height', 0);
  }, 500);
}

//로딩
function loading(timer) {
  $('.loading').addClass('loading_view');
  setTimeout(function(){
      $('.loading').removeClass('loading_view');
  }, timer);
}

// 코인 메인이미지 가져오기
function getMainCoinImgSvg(param) {
    var i_name = "";
    switch (param){
      case "ethereum": 
      i_name = "../img/eth.svg";
        break; 
      case "klaytn":
        i_name = "../img/klaytn.png";
        break;
      case "solana":
        i_name = "../img/solana.png"; 
        break;
      case "polygon":
        i_name = "../img/polygon.png"; 
        break; 
    }
    return i_name
}

// 코인 출처 이미지 가져오기
function getCoinImgType(param) {
    var type = "";
    switch (param){
      case "metamask": 
      type = "../img/metamask_icon.png";
        break; 
      case "connect":
        type = "../img/connect_icon.png";
        break;
      case "kaikas":
        type = "../img/kaikas.png"; 
        break;
      case "klip":
        type = "../img/klip_icon.png"; 
        break; 
      case "phantom":
        type = "../img/phantom.png"; 
        break; 
    }
    return type
  }


// 심볼가져오기
function getCoinSymbol(param) {

    var symbol = "";
    switch (param){
      case "ethereum": 
      symbol = "ETH";
        break; 
      case "klaytn":
        symbol = "KLAY";
        break;
      case "solana":
        symbol = "SOL"; 
        break;
      case "polygon":
        symbol = "MATIC"; 
        break; 
    }
    return symbol
  }



// 정규표현식

// 숫자 정규표현식
function CheckNum(n) {
  var regExp = /[0-9]/;
  return regExp.test(n);
}