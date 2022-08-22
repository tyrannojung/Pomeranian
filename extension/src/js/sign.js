$(function () {
    // 최초 실행 로그인 체크
    chrome.storage.local.get(['login'], function (result) {
        console.log('여기타뉘?');
        console.log(result.login)
        if (result.login != 'check') {
            $('.ktl_main').removeClass('now');
            $('.ktl_signup').addClass('now');
            return false;

        } else {
            chrome.storage.sync.get(['loginSession'], function (result2) {
                if (result2.loginSession == 'check') {
                    $('.ktl_main').removeClass('now');
                    $('.ktl_account_detail').addClass('now');

                    loading(1000);
                    getBalance();

                    return false;

                }
            });
        }
    });

    // 회원가입
    $('#kt_signup').on('click', function () {
        var pass = $('#pass').val();
        var repass = $('#repass').val();
        if (pass == repass && pass && repass) {
            // 회원가입 여부 체크
            chrome.storage.local.set({ login: 'check' }, function () {
                console.log('signup');
            });

            // 비밀번호 저장
            chrome.storage.local.set({ password: pass }, function () {
                console.log(pass);
            });

            var ethereum_list = new Array();
            var privateKey = "";
            var address = "";
            var mnemonic = "";

            if ($('#kt_restore_key').val()) {
                console.log('복원된 키로 회원가입');
                mnemonic = $('#kt_restore_key').val();
                var mn_result = ethers.Wallet.fromMnemonic(mnemonic);
                privateKey = mn_result.address;
                address = mn_result.address;

                $('.ktl_password').removeClass('now');
                $('.ktl_main').addClass('now');

            } else {
                console.log('기본 회원가입');
                var randomSeed = ethers.Wallet.createRandom();
                privateKey = randomSeed.privateKey;
                address = randomSeed.address;
                mnemonic = randomSeed.mnemonic;
                $('#pome_seed_txt').text(mnemonic);

                $('.ktl_password').removeClass('now');
                $('.ktl_signup_seed').addClass('now');

            }

            var new_token = {
                "name": "Account1",
                "type": "pomeranian",
                "address": address,
                "select": "main",
                "tokenlist": [],
                "private": privateKey,
                "mnemonic": mnemonic
            }
            ethereum_list.push(new_token);
            chrome.storage.local.set({ ethereum: ethereum_list });

        }
        else {
            $('#err_txt_pass').css('display', 'block');
        }
    });

    // 로그인
    $('#kt_signin').on('click', function () {
        $('.err_txt').css('display', 'none');
        var inputpass = $('#inputpass').val();

        chrome.storage.local.get(['password'], function (result) {
            if (result.password == inputpass) {
                //로그인 세션 저장
                chrome.storage.sync.set({ loginSession: 'check' }, function () {
                    console.log('loginSession');

                });

                $('#inputpass').val('');
                $('.ktl_main').removeClass('now');
                $('.ktl_account_detail').addClass('now');

                loading(1000);
                getBalance();

            } else {
                console.log("fail");
                $('#err_txt_pass_login').css('display', 'block');

            }
        });
    });

    //로그아웃
    $('#kt_signout').on('click', function () {

        chrome.storage.sync.remove("loginSession");
        $('.ktl_my').removeClass('now');
        $('.ktl_main').addClass('now');

    });

    //비밀번호 변경
    $('#kt_repass').on('click', function () {
        $('.err_txt').css('display', 'none');
        var kt_hpass = $('#kt_hpass').val();
        chrome.storage.local.get(['password'], function (result) {
            if (result.password == kt_hpass) {
                var pass = $('#kt_chpass').val();
                var repass = $('#kt_chrepass').val();
                if (pass == repass && pass && repass) {
                    // 비밀번호 저장
                    chrome.storage.local.set({ password: pass }, function () {
                        console.log(pass);
                    });
                    chrome.storage.sync.remove("loginSession");
                    $('.kt_crepass').val('');
                    $('.ktl_my_pass').removeClass('now');
                    $('.ktl_main').addClass('now');

                }
                else {
                    console.log("fail");
                    $('#err_repass_check').css('display', 'block');
                    return false;

                }

            } else {
                console.log("fail");
                $('#err_hpass_check').css('display', 'block');
                return false;

            }
        });


    });

    //계정 복원
    $('#kt_restore_chk').on('click', function () {
        console.log('복원');
        $('.err_txt').css('display', 'none');
        var testimonials = $('.inputTextArea');
        var mnemonic = new Array();
        for (var i = 0; i < testimonials.length; i++) {
            if (!$(testimonials[i]).val() || $(testimonials[i]).val().length > 11) {
                $('#err_txt_seed').css('display', 'block');
                return false;
            }
            else
                mnemonic.push($(testimonials[i]).val());
        }
        var result = mnemonic.join(' ');
        try {
            let testtest = ethers.Wallet.fromMnemonic(result);
            if (testtest)
                $('#kt_restore_key').val(result);
            console.log('복원성공');
            $('.ktl_restore_seed').removeClass('now');
            $('.ktl_password').addClass('now');

        } catch (error) {
            console.log('복원실패');
            $('#err_txt_seed').css('display', 'block');

        }


    });

});