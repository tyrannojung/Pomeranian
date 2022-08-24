$(function () {

    // 변경감지 전역변수
    var kt_smartvalicheck = false;
    var oldVal = "";

    // Detail
    $('.token_list').on('click', '.tdetail', function () {
        var select_detail = JSON.parse(unescape(this.dataset.tdetail));
        var select_balance = this.dataset.tbalance;
        //console.log(select_detail + "," + select_balance);

        $("#kt_select_token_detail_img").attr("src", select_detail.token_img);
        $("#kt_select_token_detail_balance").text(select_balance);
        $("#kt_select_token_detail_symbol").text(" " + select_detail.token_symbol);
        $('#kt_select_token_index').val($(this).attr('id')[$(this).attr('id').length - 1]);

        $('.ktl_account_detail').removeClass('now');
        $('.ktl_token_detail').addClass('now');

    });

    // 스마트컨트렉트주소로 토큰 검색
    $('#kt_token_address_vali').on('click', function () {

        var address = $('#kt_token_detail_search').val();

        //공백 체크
        if (!address) {
            $('#err_txt_token_address').css('display', 'block');
            return false;
        }

        // 중복검사
        var valiContract = $('#kt_tcontract_marray').val().split(',');
        if (valiContract.includes(address)) {
            $('#err_txt_token_address_vali').css('display', 'block');
            return false;

        }
        console.log('중복x');

        $('.err_txt').css('display', 'none');
        // 초기화
        $('#kt_token_detail_symbol').val('');
        $('#kt_token_detail_decimal').val('');
        $('#kt_token_detail_symbol').prop('readonly', false);
        $('#kt_token_detail_decimal').prop('readonly', false);

        var type = "ethereum";
        var hostUrl = "http://localhost:8085/kthulu-rpc/validate/" + type;
        var params = { contract_address: address }
        $('.loading').addClass('loading_view');

        $.ajax({
            type: "POST",            // HTTP method type(GET, POST) 형식이다.
            contentType: 'application/json',
            async: true,
            url: hostUrl,      // 컨트롤러에서 대기중인 URL 주소이다.
            data: JSON.stringify(params),            // Json 형식의 데이터이다.
            success: function (res) { // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
                if (res.result == "OK") {
                    kt_smartvalicheck = true;
                    oldVal = $('#kt_token_detail_search').val();

                    if (res.token_detail) {
                        $('#kt_token_detail_img').val(res.token_detail.token_img);
                        var token_decimals = res.token_detail.token_decimals;
                        var token_symbol = res.token_detail.token_symbol;
                        console.log(token_decimals);
                        console.log(token_symbol);
                        if (token_symbol) {
                            if (1 <= token_symbol.length && token_symbol.length <= 11) {
                                $('#kt_token_detail_symbol').val(token_symbol);
                                $('#kt_token_detail_symbol').prop('readonly', true);

                            } else {
                                //errormessage
                                $('#err_txt_token_symbol').css('display', 'block');

                            }
                        }
                        if (token_decimals || token_decimals == 0) {
                            if (CheckNum(token_decimals) && token_decimals <= 36 && token_decimals >= 0) {
                                $('#kt_token_detail_decimal').val(token_decimals);
                                $('#kt_token_detail_decimal').prop('readonly', true);

                            } else {
                                //errormessage
                                $('#err_txt_token_decimal').css('display', 'block');

                            }

                        }
                    } else {
                        $('#kt_token_detail_img').val("img/token.png");
                    }
                } else {
                    $('#err_txt_token_address').css('display', 'block');
                }
                $('.loading').removeClass('loading_view');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                console.log("통신 실패.")
            }
        });

    });

    //Insert
    // select token Insert
    $('#kt_addToken').on('click', function () {
        $('.err_txt').css('display', 'none');
        var kt_token_contract = $('#kt_token_detail_search').val();
        var kt_token_symbol = $('#kt_token_detail_symbol').val();
        var kt_token_decimal = parseInt($('#kt_token_detail_decimal').val());
        var kt_token_valicount = 0;
        var kt_token_img = $('#kt_token_detail_img').val();
        var token_update_key = "ethereum"
        var token_update_index = 0;


        if (!kt_smartvalicheck || !kt_token_contract)
            $('#err_txt_token_address').css('display', 'block');
        else
            kt_token_valicount++

        if (!kt_token_symbol || 1 > kt_token_symbol.length || kt_token_symbol.length > 11)
            $('#err_txt_token_symbol').css('display', 'block');
        else
            kt_token_valicount++

        if (!CheckNum(kt_token_decimal) || kt_token_decimal > 36 || kt_token_decimal < 0)
            $('#err_txt_token_decimal').css('display', 'block');
        else
            kt_token_valicount++

        // 유효성검사가 통과가 되면(3), 등록한다.
        console.log(kt_token_valicount);
        if (kt_token_valicount == 3) {
            console.log('토큰등록');
            chrome.storage.local.get([token_update_key], function (result) {
                var mycoin_detail = result[token_update_key];
                console.log(mycoin_detail[token_update_index]);
                var token_list = mycoin_detail[token_update_index].tokenlist;
                console.log(token_list);
                var new_token = {
                    "token_contract": kt_token_contract,
                    "token_img": kt_token_img,
                    "token_symbol": kt_token_symbol,
                    "token_decimal": kt_token_decimal
                }
                token_list.push(new_token);
                mycoin_detail[token_update_index].tokenlist = token_list;
                console.log(mycoin_detail);
                // 토큰추가
                chrome.storage.local.set({ [token_update_key]: mycoin_detail }, function () {
                    console.log('변경완료');

                });
                getAllTokenBalance($('#kt_detail_mbalance').text());
                $('.ktl_token_add').removeClass('now');
                $('.ktl_account_detail').addClass('now');

                // ## 초기화
                $('#kt_token_search').val('');
                $('#kt_token_detail_img').val('');
                $('#kt_token_detail_search').val('');
                $('#kt_token_detail_symbol').val('');
                $('#kt_token_detail_decimal').val('');
                $('#kt_token_detail_symbol').prop('readonly', false);
                $('#kt_token_detail_decimal').prop('readonly', false);
            });

        } else {
            console.log('토큰등록 실패');
            return;

        }

    });


    // Delete
    $('#kt_del_token_check').on('click', function () {
        console.log('token 삭제');
        // 필요한것. 메인코인이름, 메인코인 인덱스, 토큰 리스트, 토큰 인덱스
        var del_key = "ethereum";
        var del_index = 0;
        var del_token_index = $('#kt_select_token_index').val();
        chrome.storage.local.get([del_key], function (result) {
            var mycoin_detail = result[del_key]
            var token_list = mycoin_detail[del_index].tokenlist;
            token_list.splice(del_token_index, 1);
            mycoin_detail[del_index].tokenlist = token_list;

            chrome.storage.local.set({ [del_key]: mycoin_detail }, function () {
                console.log('삭제완료');
                // 잔고초기화후 등록한다.
                getAllTokenBalance(del_key, del_index, $('#kt_detail_mbalance').text());
                $('.ktl_token_detail').removeClass('now');
                $('.ktl_account_detail').addClass('now');


            });



        });


    });


    $("#kt_token_detail_search").on("propertychange change keyup paste input", function () {
        var currentVal = $(this).val();
        if (currentVal == oldVal) {
            return;

        }

        oldVal = currentVal;
        kt_smartvalicheck = false;
        $('.err_txt').css('display', 'none');
        $('#kt_token_detail_symbol').val('');
        $('#kt_token_detail_decimal').val('');
        $('#kt_token_detail_symbol').prop('readonly', false);
        $('#kt_token_detail_decimal').prop('readonly', false);

    });
});