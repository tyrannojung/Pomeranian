$(function () {
    // 저장값 확인
    chrome.storage.local.get(['theme'], function (result) {
        if (result.theme) {
            // 설정값이 있을때.
            if (result.theme == 'dark') {
                document.documentElement.setAttribute('color-theme', 'dark');
                let dark_innput = document.querySelector('.onoff_icon_ip');
                dark_innput.setAttribute('checked', true);

            }
        } else {
            // 설정값이 없을때.
            const isBrowserDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
            let initTheme = isBrowserDarkMode ? 'dark' : 'light'
            let dark_innput = document.querySelector('.onoff_icon_ip');
            // 시스템모드 다크일 경우
            if (initTheme == 'dark') {
                document.documentElement.setAttribute('color-theme', 'dark');
                dark_innput.setAttribute('checked', true);

            }
        }
    });

    // 다크모드 버튼 이용
    const $checkbox = document.querySelector('.onoff_icon_ip');

    $checkbox.addEventListener('click', e => {
        if (e.target.checked) {
            document.documentElement.setAttribute('color-theme', 'dark');
            chrome.storage.local.set({ theme: 'dark' });
        }
        else {
            document.documentElement.setAttribute('color-theme', 'light');
            chrome.storage.local.set({ theme: 'light' });
        }
    });

    // 페이지 이동
    $('.mov_bt').on('click', function () {
        let nowname = $(this).attr("value");
        $(this).parents('.ktl').removeClass('now');
        $('.' + nowname).addClass('now');

        // 이동 후 돌아왔을 때 스크롤 맨 위
        setTimeout(function () {
            $('div').scrollTop(0);
            $('ul').scrollTop(0);
        }, 300);
    });

    // 패스워드 보이기
    $('.eye_icon').on('click', function () {
        $(this).toggleClass('eye_on');
        if ($('.eye_icon').hasClass('eye_on') == true) {
            $(this).prev('input').attr('type', 'text');
        }
        else {
            $(this).prev('input').attr('type', 'password');
        }
    });
    $('.pass_input input').on('focus', function () {
        $(this).parent().css({
            border: '1px solid #00a1ff'
        });
        $('.ktl_main_pass>div').css({
            color: '#00a1ff'
        });
    });
    $('.pass_input input').on('blur', function () {
        $(this).parent().css({
            border: 'var(--inputBd)'
        });
        $('.ktl_main_pass>div').css({
            color: 'gray'
        });
    });

    // 토큰 가져오기 탭 두 개
    $('.add_menu > div').on('click', function () {
        $('.add_menu > div').removeClass('add_menu_ck');
        $(this).addClass('add_menu_ck');
        let tokenadd_tap = $('.add_menu > div').index(this); // 선택된 것 몇번째인지
        if (tokenadd_tap == 1) {
            $('.bot_line').addClass('bot_line_mov');
        } else {
            $('.bot_line').removeClass('bot_line_mov');
        }
        function tokenadd_cont(num) {
            $('.add_menu_cont > div').removeClass('add_cont_active');
            $('.add_menu_cont > div').eq(num).addClass('add_cont_active');
        }
        tokenadd_cont(tokenadd_tap);
    });



    // 계정 펼치기
    $('.account_atc > div').on('click', function () {
        $(this).parent('li').toggleClass('account_atc_open');

        // 클릭 안 겹치게
        $(this).css('pointer-events', 'none');
        setTimeout(function () {
            $('.account_atc > div').css('pointer-events', 'auto');
        }, 300);

        // 안에 내용 만큼 height 구해서 animate 주기
        var open = $(this).next('ul').height();
        var el = $(this).next('ul'),
            curHeight = el.height(),
            autoHeight = el.css('height', 'auto').height();

        if (open === 0) {
            el.height(curHeight).animate({ height: autoHeight }, 300);
        }
        else {
            el.animate({ height: 0 }, 300);
        }
    });

    //  레이어 부분
    // 지갑 레이어 열기
    $('.wallet_sel').on('click', function () {
        $('.wallet_sel_layer').addClass('layer_view');
        $('.wallet_sel_layer .inner').addClass('inner_active');
    });
    // 대표 계정 설정 설명
    $(document).on("click", ".star_first_info", function () {
        $('.starinfo_layer').addClass('layer_view');
        $('.starinfo_layer .inner').addClass('inner_active');
    });
    // 확인후 레이어 삭제
    $('.starinfo_remove').on('click', function () {
        $('.act_pan .star_icon').removeClass('star_first_info');
        $('.starinfo_layer').remove();
    });
    // 계정 지우기 & 토큰 지우기
    $('.remove_icon').on('click', function () {
        $(this).parents('.main').next('.remove_layer').addClass('layer_view');
        $(this).parents('.main').next('.remove_layer').children('.inner').addClass('inner_active');
    });
    // 계정 이름 변경
    $('.account_name .edit_icon').on('click', function () {
        $('.nameedit_layer').addClass('layer_view');
        $('.nameedit_layer .inner').addClass('inner_active');
    });

    // 레이어 닫기 ** 공통
    $('.layer_close').on('click', function () {
        $('.layer').removeClass('layer_view');
        $('.layer .inner').removeClass('inner_active');
    });

    //붙여넣기 감지
    $(".inputTextArea").bind('paste', function (e) {
        var el = $(this);
        setTimeout(function () {
            var text = $(el).val();
            const words = text.split(' ');
            if (words.length == 12) {
                var testimonials = $('.inputTextArea');
                for (var i = 0; i < testimonials.length; i++) {
                    // Using $() to re-wrap the element.
                    $(testimonials[i]).val(words[i]);
                }
            }

        }, 100);


    });

    // 계정 이름 바꾸기
    $('.nameedit_layer button').on('click', function () {
        let account_name = $('.nameedit_layer').find('input').val();
        $('.name_txt').html(account_name);
    });

    // 지갑 주소 복사 txt
    $('.address').on('click', function () {
        let adress = document.getElementById("kt_detail_maddress");
        window.navigator.clipboard.writeText(adress.textContent).then(() => {
            $('.copy_txt').children('.txt').html('복사했습니다!');
        });
        setTimeout(function () {
            $('.copy_txt').children('.txt').html('클립보드에 복사');
        }, 5000);
    });

    // 즐겨찾기
    $(".eth_wallet").change(function () {
        $(".eth_wallet").not(this).prop('checked', false);
    });
    $(".klay_wallet").change(function () {
        $(".klay_wallet").not(this).prop('checked', false);
    });
    $(".matic_wallet").change(function () {
        $(".matic_wallet").not(this).prop('checked', false);
    });
    $(".sol_wallet").change(function () {
        $(".sol_wallet").not(this).prop('checked', false);
    });

    // function만 있어서 알아서 갖다 쓰는 것들 ~

    // 계정 리스트 다 닫기 => 알아서 쓰세여
    function close_account() {
        setTimeout(function () {
            $('.account_atc').removeClass('account_atc_open');
            $('.act_pan').css('height', 0);
        }, 500);
    }

    // 로딩
    function loading(timer) {
        $('.loading').addClass('loading_view');
        setTimeout(function () {
            $('.loading').removeClass('loading_view');
        }, timer);
    }
    // loading(1000);

    // 업데이트 레이어
    // 열기
    function update_layer() {
        $('.update_layer').addClass('layer_view');
        $('.update_layer .inner').addClass('inner_active');
    }
    // 닫기
    function update_layer_close() {
        $('.update_layer').removeClass('layer_view');
        $('.update_layer .inner').removeClass('inner_active');
    }

    // 에러
    function page_err() {
        $('.page_err').addClass('page_err_view');
    }
    function page_err_404() {
        $('.page_err_404').addClass('page_err_view');
    }

    //alert 레이어 내용
    function layer_alert_cont() {
        // 네트워크 연결
        let network_alert = '';
        network_alert += '<div class="txt">'
        network_alert += '    네트워크에 연결할 수 없습니다. <br />'
        network_alert += '    나중에 다시 시도해 주십시오. (err:i1)    '
        network_alert += '</div>'
        network_alert += '<button class="gray_bt layer_close">죵료</button>'
        // 토큰 추가
        let token_alert = '';
        token_alert += '<div class="icon"><span></span></div>'
        token_alert += '<div class="txt">'
        token_alert += '        이미 등록된 토큰입니다. <br /> '
        token_alert += '        다른 토큰주소를 입력해주세요.</div>'
        token_alert += '<button class="gray_bt layer_close">확인</button>'
        // 계정 추가
        let account_alert = '';
        account_alert += '<div class="icon"><span></span></div>'
        account_alert += '<div class="txt">'
        account_alert += '        이미 크툴루 지갑에 등록된 계정입니다. <br /> '
        account_alert += '        다른 주소를 입력해주세요. </div>'
        account_alert += '<button class="gray_bt layer_close">확인</button>'

        //html 안에 넣을 내용 선택
        $('.layer_alert .inner').html(network_alert);
        $('.layer_alert').addClass('layer_view');
        $('.layer_alert .inner').addClass('inner_active');

    }


    //## Token Add
    $('.act_plus_icon').on('click', function () {
        // 지갑선택 타이틀 기본
        $('.wallet_sel_title').html('사용 중인 지갑 선택');

        //지갑 목록 (value 추가해서 쓰세여)
        let metamask = '';
        metamask += '<label><input type="radio" name="wallet_select" value="">'
        metamask += '<div class="wallet_title">'
        metamask += '    <div class="wallet_icon">'
        metamask += '        <img src="img/metamask_icon.png" alt="">'
        metamask += '    </div>'
        metamask += '    <div>Metamask</div>'
        metamask += '</div><label>'
        let connect = '';
        connect += '<label><input type="radio" name="wallet_select" value="">'
        connect += '<div class="wallet_title">'
        connect += '    <div class="wallet_icon wallet_icon_connect">'
        connect += '        <img src="img/connect_icon.png" alt="">'
        connect += '    </div>'
        connect += '    <div>connect</div>'
        connect += '</div><label>'
        let kaikas = '';
        kaikas += '<label><input type="radio" name="wallet_select">'
        kaikas += '<div class="wallet_title">'
        kaikas += '    <div class="wallet_icon">'
        kaikas += '        <img src="img/kaikas.png" alt="">'
        kaikas += '    </div>'
        kaikas += '    <div>kaikas</div>'
        kaikas += '</div><label>'
        let klip = '';
        klip += '<label><input type="radio" name="wallet_select">'
        klip += '<div class="wallet_title">'
        klip += '    <div class="wallet_icon wallet_icon_connect">'
        klip += '        <img src="img/klip_icon.png" alt="">'
        klip += '    </div>'
        klip += '    <div>Klip</div>'
        klip += '</div><label>'
        let phantom = '';
        phantom += '<label><input type="radio" name="wallet_select">'
        phantom += '<div class="wallet_title">'
        phantom += '    <div class="wallet_icon">'
        phantom += '        <img src="img/phantom.png" alt="">'
        phantom += '    </div>'
        phantom += '    <div>Phantom</div>'
        phantom += '</div><label>'

        // 지갑선택 리스트
        let eth_wallet = '';
        eth_wallet += metamask
        eth_wallet += connect

        let klay_wallet = '';
        klay_wallet += kaikas
        klay_wallet += klip

        let sol_wallet = '';
        sol_wallet += phantom

        let matic_wallet = '';
        matic_wallet += metamask

        let title = $('.ktl_account_add .main_top_in .title');
        let act_img = $('.ktl_account_add .account_icon');
        let act_name = $('.ktl_account_add .account_name > div');
        let wallet_inner = $('.wallet_sel_layer .wallet_list');


        if ($(this).hasClass("eth_add") === true) {
            title.html('Ethereum 계정 추가');
            act_img.html('<img src="img/eth.svg" alt="">');
            act_name.html('Ethereum');
            wallet_inner.html(eth_wallet);
        }
        if ($(this).hasClass("klay_add") === true) {
            title.html('Klaytn 계정 추가');
            act_img.html('<img src="img/klaytn.png" alt="">');
            act_name.html('Klaytn');
            wallet_inner.html(klay_wallet);
        }
        if ($(this).hasClass("sol_add") === true) {
            title.html('Solana 계정 추가');
            act_img.html('<img src="img/solana.png" alt="">');
            act_name.html('Solana');
            wallet_inner.html(sol_wallet);
        }
        if ($(this).hasClass("matic_add") === true) {
            title.html('Polygon 계정 추가');
            act_img.html('<img src="img/polygon.png" alt="">');
            act_name.html('Polygon');
            wallet_inner.html(matic_wallet);
        }

    });

    // 지갑 선택
    $('.wallet_sel_bt').on('click', function () {
        let wallet_sel = $("input[name=wallet_select]:checked").next('div').html();
        $('.wallet_sel_title').html(wallet_sel);
        $('.wallet_sel_title').css('font-weight', '500');
    });
});