$(document).ready(function () {
    var elementPosition = $('aside').offset();
    $(window).scroll(function () {
        var mq = window.matchMedia("(max-width: 1080px)");
        if (!mq.matches && $(window).scrollTop() >= elementPosition.top - 16) {
            $('aside').css('position', 'fixed').css('top', '1rem');
        } else {
            $('aside').css('position', 'relative').css('top', '0');
        }
    });
    $('.scroll-pane').jScrollPane({
        autoReinitialise: true,
        verticalGutter: 0,
        hideFocus: true
    });
    $('.open-sidebar').click(function (e) {
        $('.aside-wrapper').addClass('active-sidebar');
        $('body').addClass('sidebar-active');
        e.preventDefault();
    });
    $('.close-sidebar').click(function (e) {
        $('.aside-wrapper').removeClass('active-sidebar');
        $('body').removeClass('sidebar-active');
        e.preventDefault();
    });
    $('.nav-collapsible').css('display', 'none');
    $('.toggle-collapsible').click(function (e) {
        var collapsible = $(this).siblings('.nav-collapsible');
        var icon = $(this).children('.collapsible-icon');
        if (collapsible.css('display') == 'none') {
            collapsible.css('display', 'block');
            icon.addClass('fa-minus');
            icon.removeClass('fa-plus')
        } else {
            collapsible.css('display', 'none');
            icon.addClass('fa-plus');
            icon.removeClass('fa-minus')
        }
        e.preventDefault();
    });
    hljs.initHighlightingOnLoad();
});