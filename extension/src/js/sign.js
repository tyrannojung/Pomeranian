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

            // public key로 복원
            if ($('#kt_restore_key_public').val() == 'success') {
                console.log('이더리움으로의 복원');

                $('.ktl_password').removeClass('now');
                $('.ktl_main').addClass('now');
                return false;
            }

            if ($('#kt_restore_key').val()) {
                console.log('복원된 키로 회원가입');
                mnemonic = $('#kt_restore_key').val();
                var mn_result = ethers.Wallet.fromMnemonic(mnemonic);
                privateKey = mn_result.privateKey;
                address = mn_result.address;

                $('.ktl_password').removeClass('now');
                $('.ktl_main').addClass('now');

            } else {
                console.log('기본 회원가입');
                var randomSeed = ethers.Wallet.createRandom();
                privateKey = randomSeed.privateKey;
                address = randomSeed.address;
                mnemonic = randomSeed.mnemonic.phrase;
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

    $('#kt_public_backup_detail').on('click', function () {
        loading(2000);
        $('.ktl_safe_list').removeClass('now');
        $('.ktl_backup_public').addClass('now');
        chrome.storage.local.get(['ethereum'], async function (result) {
            var provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
            var contractAddress = "0x51a652a26B2BA5276321565B2ca4860184634940";
            var ethereum = result.ethereum;
            console.log(ethereum[0]);
            var adkey = ethereum[0].address
            var pkey = ethereum[0].private;
            var bdata = "SAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLE";
            let pwallet = new ethers.Wallet(pkey, provider);
            const backupContract2 = new ethers.Contract(contractAddress, backupABI, pwallet);
            const estimatedGasLimit = await backupContract2.estimateGas.setBackupData(adkey, bdata);
            const gasPrice = await provider.getGasPrice();
            const finalGasPrice = gasPrice * estimatedGasLimit;
            $('#kt_backup_public_estimated').text(ethers.utils.formatUnits(finalGasPrice));

        });

    });

    //백업
    //계정 public 백업
    $('#kt_backup_public').on('click', function () {
        console.log('backup 실행');
        $('.loading').addClass('loading_view');
        //transaction
        try {
            chrome.storage.local.get(['ethereum'], async function (result) {
                var backupData = new Object();
                var formData = new FormData();
                var varbackup = result.ethereum[0];
                let aesKey = varbackup.private;
                var encrypt = CryptoJS.AES.encrypt(JSON.stringify(varbackup), aesKey).toString();
                backupData.backup = encrypt;
                backupData = JSON.stringify(backupData);
                var blob = new Blob([backupData], { type: 'application/json; charset=utf-8' });
                formData.append("backup_file", blob);
                $.ajax({
                    type: "POST",
                    enctype: "multipart/form-data",
                    url: "http://localhost:8085/pome-rpc/data-backup",
                    data: formData,
                    crossDomain: true,
                    processData: false,
                    contentType: false,
                    success: async function (data) {
                        var joFunc = JSON.parse(data);
                        if (joFunc['result'] == "OK") {
                            var bdata = joFunc['value'];
                            var provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
                            var contractAddress = "0x51a652a26B2BA5276321565B2ca4860184634940";
                            var adkey = varbackup.address
                            let pwallet = new ethers.Wallet(aesKey, provider);
                            const backupContract2 = new ethers.Contract(contractAddress, backupABI, pwallet);
                            const result = await backupContract2.setBackupData(adkey, bdata).catch(() => {
                                console.log('실패');
                                $('.loading').removeClass('loading_view');
                                $('.tfail_layer').addClass('layer_view');
                                $('.tfail_layer .inner').addClass('inner_active');
                                return false;

                            });
                            console.log(result);
                            //여기서 OK면 노티피케이션
                            if (result && result.to == "0x51a652a26B2BA5276321565B2ca4860184634940") {
                                chrome.storage.sync.set({ notic: result.hash }, function () {
                                    console.log('enroll');

                                });

                                // 초기화 해줘야 앞전게 남아있지 않다.
                                chrome.notifications.clear(
                                    notificationId = "notic",
                                    callback = () => { }
                                );

                                chrome.notifications.create("notic", {
                                    type: 'basic',
                                    title: 'Confirmed transaction',
                                    iconUrl: "assets/logo.png",
                                    message: "Transaction Success! View on Etherscan",
                                    priority: 2,
                                    eventTime: Date.now()
                                });
                                $('.loading').removeClass('loading_view');
                                getBalance();
                                $('.ktl_backup_public').removeClass('now');
                                $('.ktl_account_detail').addClass('now');

                            } else {
                                console.log('실패');
                                $('.loading').removeClass('loading_view');
                                $('.tfail_layer').addClass('layer_view');
                                $('.tfail_layer .inner').addClass('inner_active');
                                return false;

                            }
                        }

                    }
                });
            });
        } catch (error) {
            $('.loading').removeClass('loading_view');
            console.log(error);

        }
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

    //계정 이더리움 복원
    $('#kt_restore_chk_public').on('click', async function () {
        console.log('복원');
        $('.loading').addClass('loading_view');

        $('.err_txt').css('display', 'none');
        var testimonials = $('.inputTextPublic');
        var mnemonic = new Array();
        for (var i = 0; i < testimonials.length; i++) {
            if (!$(testimonials[i]).val() || $(testimonials[i]).val().length > 11) {
                $('#err_txt_seed_public').css('display', 'block');
                return false;
            }
            else
                mnemonic.push($(testimonials[i]).val());
        }
        var result = mnemonic.join(' ');
        try {
            let publicwallet = ethers.Wallet.fromMnemonic(result);
            console.log(publicwallet.address + "," + publicwallet.mnemonic.phrase + "," + publicwallet.privateKey);
            let provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
            var contractAddress = "0x51a652a26B2BA5276321565B2ca4860184634940";
            const backupContract = new ethers.Contract(contractAddress, backupABI, provider);
            let currentValue = await backupContract.getBackupData(publicwallet.address).catch(() => {
                console.log('실패');
                $('#err_txt_seed_public').css('display', 'block');
                return false;

            });
            console.log(currentValue);
            if (currentValue) {
                $.ajax({
                    url: 'http://localhost:8085/ipfs/' + currentValue,
                    type: 'get',
                }).done(function (res) {
                    console.log(res.backup);
                    var decrypted = CryptoJS.AES.decrypt(res.backup, publicwallet.privateKey);
                    var text = decrypted.toString(CryptoJS.enc.Utf8);
                    console.log(JSON.parse(text));
                    var ethereum_list = new Array();
                    ethereum_list.push(JSON.parse(text));
                    chrome.storage.local.set({ ethereum: ethereum_list });
                    $('#kt_restore_key_public').val('success');

                });

            } else {
                console.log('복원실패');
                $('.loading').removeClass('loading_view');
                $('#err_txt_seed_public').css('display', 'block');
                return false;
            }
            $('.loading').removeClass('loading_view');
            console.log('복원성공');
            $('.ktl_restore_public').removeClass('now');
            $('.ktl_password').addClass('now');

        } catch (error) {
            console.log('복원실패');
            $('#err_txt_seed_public').css('display', 'block');

        }


    });

});