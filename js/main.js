
(function($) {
    $.fn.serializeFormJSON = function() {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

function checkNetworkStatus() {

    var networkStatus = false;

    if (navigator.onLine) {

        try {
            $.ajax({
                async: false,
                cache: false,
                context: $("#status"),
                dataType: "json",
                error: function (req, status, ex) {
                    console.log("Error: " + ex);
                    // We might not be technically "offline" if the error is not a timeout, but
                    // otherwise we're getting some sort of error when we shouldn't, so we're
                    // going to treat it as if we're offline.
                    // Note: This might not be totally correct if the error is because the
                    // manifest is ill-formed.
                    showNetworkStatus(false);
                    networkStatus = false;
                },
                success: function (data, status, req) {
                    showNetworkStatus(true);
                    networkStatus = true;
                },
                timeout: 5000,
                type: "GET",
                url: "http://drobotoff.com/karpan/js/ping.js"
            });
        } catch(e) {
            networkStatus = false;
        }

    } else {
        showNetworkStatus(false);
        networkStatus = false;
    }

    return networkStatus;
}

function showNetworkStatus(online) {

    if (online) {
        if (localStorage.length > 0) {
            $(".status-icon").removeClass("green").removeClass("red").addClass("yellow");
            $(".status-text").removeClass("green").removeClass("red").addClass("yellow");
//            $(".status-info").html("0 out of " + localStorage.length + " synced");
        } else {
            $(".status-icon").removeClass("yellow").removeClass("red").addClass("green");
            $(".status-text").removeClass("yellow").removeClass("red").addClass("green");
            $(".status-info").html("all information synced");
        }
        $(".status-text").html("Connected:");
    } else {
        $(".status-icon").removeClass("yellow").removeClass("green").addClass("red");
        $(".status-text").removeClass("yellow").removeClass("green").addClass("red");
        $(".status-text").html("Not Connected:");
        if (localStorage.length > 0) {
            $(".status-info").html(localStorage.length + " not synced ");
        } else {
            $(".status-info").html("all information synced");
        }
    }

    console.log("Online status: " + online);
}

function storeToTableSync() {
    var data = $('form').serialize();
    localStorage.setItem("sync_" + $('#MERGE0').val(), data /*JSON.stringify(data)*/);
    self.location = "signup.html?success=1";
}

function getSyncData() {

    clearTimeout(time);

    var key;
    var checkStatus = checkNetworkStatus();
    if (checkStatus) {

        var countToSync = localStorage.length;

        for (var i = 0, len = localStorage.length; i < len; i++){

            key = localStorage.key(i);

            if ((/^sync_/).test(key)) {

                console.log(localStorage.getItem(key));

                $(".status-info").html((i+1) + " out of " + countToSync + " synced");
                checkStatus = checkNetworkStatus();

                try {

                    $.ajax({
                        async: false,
                        cache: false,
                        context: $("#status"),
                        data: localStorage.getItem(key),
                        timeout: 5000,
                        type: "POST",
                        url: "http://drobotoff.com/karpan/send.php" //http://kaptest.us7.list-manage.com/subscribe/post
                    })
                    .done(function() {
                        console.log('Remove: '+ key);
                        localStorage.removeItem(key);
                    })
                    .fail(function() {
                        console.log('Error send Data.');
                    });

                } catch(e) {
                    // nothing
                }

                $(".status-info").html((i+1) + " out of " + countToSync + " synced");
                checkStatus = checkNetworkStatus();
            }
        }
    }
    time = setTimeout("getSyncData()", 5000);
}

function checkData() {

    var result = true;

    $('.error').remove();

    if ($("#MERGE0").val().length <= 0 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a value</div></div>').insertAfter("#MERGE0");
        result = false;
    }

    if ($("#MERGE1").val().length <= 0 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a value</div></div>').insertAfter("#MERGE1");
        result = false;
    }

    if ($("#MERGE2").val().length <= 0 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a value</div></div>').insertAfter("#MERGE2");
        result = false;
    }

    if ($("#MERGE3").val().length != 5 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a zip code (5 digits)</div></div>').insertAfter("#MERGE3");
        result = false;
    }

    if ($("#MERGE4").val().length != 4 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a year (4 digits)</div></div>').insertAfter("#MERGE4");
        result = false;
    }

    if ($("#MERGE5").val().length <= 0 ) {
        $('<div class="feedback error"><br><div class="errorText">Please enter a value</div></div>').insertAfter("#MERGE5");
        result = false;
    }


    if (!result) {
        $('<div class="formstatus error">There are errors below</div>').insertAfter('.indicates-required');
    }

    return result;
}

function sendData() {

    var result = false;

    if (!checkData())
        return false;

    if ( checkNetworkStatus() ) {
        console.log('store to mailchimp:');
        result = true;
    } else {
        storeToTableSync();
        console.log('store to db:');
    }
    return result;
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
