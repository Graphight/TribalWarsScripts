
javascript:

    // Graphight's Signature Editor December 8th 2017

    // 1. Create the buttons
    var insertSig = document.createElement("button");
insertSig.innerHTML = "Insert Signature";
var editSig = document.createElement("button");
editSig.innerHTML = "Edit Signature";

// 2. Append somewhere, the top should be fine
var place = $("#header_info")[0];
place.appendChild(insertSig);
place.appendChild(editSig);

// 3. Add event handlers
insertSig.addEventListener ("click", function() {
    insertSignature();
});
editSig.addEventListener ("click", function() {
    editSignature();
});

void (0);

// Cookies make the world go round
function setCookie(cname, cvalue, exdays) {

    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}

function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function insertSignature() {

    // You are located on the correct tab view, initiate main function
    if ((document.URL.match(/screen=mail/)) || (document.URL.match(/screen=forum&screenmode=view_thread/))) {

        // Repeated code... too tired to fix right now. Will do it another day
        let signature = getCookie("TWSignature");
        let msg = "";

        signature = signature.split("*");

        for (let i = 0; i < signature.length - 1; i++) {
            msg += signature[i];
            msg += "\n";
        }

        document.getElementById('message').value += "\n" + msg;
    }

    // Not on correct page
    else {
        alert("You are not located in a place where I can attach a signature. Please only run from a mail or forum response");
    }
}

function editSignature() {
    // This section contains all the setup for the pop-up
    let TWDisplay;
    (function() {
        'use strict';
        TWDisplay = {
            MAX_WIDTH: 1000,
            closeCallback: null,
            show: function(id, content, closeCallback, options) {
                options = $.extend({
                    class_name: '',
                    close_from_fader: true
                }, options);
                this.closeCallback = closeCallback;

                // How the pop-up enters
                let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement,
                    container = fullscreenElement || 'body',
                    $container = $('.popup_box_container'),
                    $box, $fader, $content, show_anim = true;
                if (!$container.length) {
                    show_anim = true;
                    $container = $('<div class="popup_box_container" />');
                    $box = $('<div class="popup_box" />').attr('id', 'popup_box_' + id).addClass(options.class_name).data('name', id).appendTo($container);
                    $fader = $('<div class="fader" />').appendTo($container);
                    $content = $('<div class="popup_box_content" />').appendTo($box);
                    $container.appendTo($(container))
                } else {
                    $box = $container.find('.popup_box');
                    if ($box.data('name') !== id) {
                        TWDisplay.close();
                        TWDisplay.show(id, content, closeCallback, options);
                        return
                    }
                    $content = $container.find('.popup_box_content');
                    $box.css('width', 'auto')
                }

                // Content container for the pop-up
                $content.html(content);
                let height_buffer = 125;
                if ($(window).width() < 500 || $(window).height() < $content.height() + height_buffer) {
                    $box.addClass('mobile');
                    $('.popup_box_content').css({
                        'max-height': $(window).height() - (height_buffer / 2) + 'px'
                    })
                }

                // Borders and window section
                let border_width;
                if (typeof window.getComputedStyle === 'function') {
                    border_width = parseInt(getComputedStyle($box[0], null).borderLeftWidth)
                } else border_width = parseInt($box.css('border-left-width'));
                let min_width = 800,
                    width = Math.min(this.MAX_WIDTH, $content.width(), $(window).width() - border_width);
                if (width < min_width) width = min_width;
                if (!Modernizr.borderimage) width += 20;
                $box.css('width', width + 'px');

                // The close button
                let close_elements = options.close_from_fader ? '.fader, .popup_box_close, .popup_closer' : '.popup_box_close, .popup_closer';
                $container.on('click', close_elements, function() {
                    TWDisplay.close(true);
                    return false
                });
                if (show_anim) setTimeout(function() {
                    $box.addClass('show')
                }, 50);
                UI.init();
                setTimeout(QuestArrows.init, 500)
            },
            close: function(by_user) {
                $('.popup_box_container').remove();
                if (TWDisplay.closeCallback) TWDisplay.closeCallback(by_user);
                inlinePopupClose();
                $('.popup_style').hide();
                QuestArrows.init();
                return false
            },
            fetch: function(name, screen, get_params, callback, TWDisplay_options, closeCallback) {
                TribalWars.get(screen, get_params, function(data) {
                    TWDisplay.show(name, data.TWDisplay, closeCallback, TWDisplay_options);
                    if (callback) callback()
                })
            }
        }
    })();

    // Construct the pop-up
    let content = '<div style=max-width:800px;>' +
        '<h2 class="popup_box_header"><center><u><font color="green"> Graphight - Signature Maker </font></u></center></h2>' +
        '<p><textarea class="signature-msg" id="signature" name="text" tabindex="3" cols="80" rows="16"></textarea></p>' +
        '<p><button type="button" onclick="getSignature()">Get Signature</button></p>' +
        '<p><button type="button" onclick="saveSignature()">Save Signature</button></p>' +
        '</div>';

    // Calling the pop-up
    TWDisplay.show('Stack_Evaluation', content);
    $("#go_man").click(function() {
        window.location.assign(game_data.link_base_pure + "place");
    });
    $("#close_this").click(function() {let close_this = document.getElementsByClassName('popup_box_close'); close_this[0].click();});
}

function saveSignature() {

    // Retrieve the current signature
    let signature = document.getElementById('signature').value;

    // Split across newline characters
    signature = signature.split("\n");
    let msg = "";

    for (let i = 0; i < signature.length; i++) {
        msg += signature[i];
        msg += "*";         // replace the newline with an asterisk
    }

    setCookie("TWSignature", msg, 100);

}

function getSignature() {

    // Put the current signature in
    let signature = getCookie("TWSignature");
    let msg = "";

    signature = signature.split("*");

    for (let i = 0; i < signature.length - 1; i++) {
        msg += signature[i];
        msg += "\n";
    }

    document.getElementById('signature').value += "\n" + msg;

}
