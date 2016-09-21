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
    hljs.initHighlightingOnLoad();
});