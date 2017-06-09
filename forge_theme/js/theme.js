$(document).ready(function () {
    // Sidebars always are in asides
    var elementPosition = $('aside').offset();
    $(window).scroll(function () {
        var mq = window.matchMedia("(max-width: 1080px)");
        if (!mq.matches && $(window).scrollTop() >= elementPosition.top - 16) {
            $('.sidebar-sticky aside').css('position', 'fixed').css('top', '1rem');
        } else {
            $('.sidebar-sticky aside').css('position', 'relative').css('top', '0');
        }
    });
    $('.scroll-pane').jScrollPane({
        autoReinitialise: true,
        verticalGutter: 0,
        hideFocus: true
    });
    $('.open-sidebar').click(function (e) {
        $('.sidebar-sticky').addClass('active-sidebar');
        $('body').addClass('sidebar-active');
        e.preventDefault();
    });
    $('.close-sidebar').click(function (e) {
        $('.sidebar-sticky').removeClass('active-sidebar');
        $('body').removeClass('sidebar-active');
        e.preventDefault();
    });
    // Collapsible elements implementation
    $('.nav-collapsible:not(.nav-collapsible-open)').css('display', 'none');
    var icons = $('.nav-collapsible-open').siblings('.toggle-collapsible').children('.collapsible-icon');
    var texts = $('.nav-collapsible-open').siblings('.toggle-collapsible').children('.collapsible-text');
    icons.removeClass('fa-plus');
    icons.addClass('fa-minus');
    texts.html('Show');
    $('.toggle-collapsible').click(function (e) {
        var collapsible = $(this).siblings('.nav-collapsible');
        var icon = $(this).children('.collapsible-icon');
        var text= $(this).children('.collapsible-text');
        if (collapsible.css('display') == 'none') {
            collapsible.css('display', 'block');
            icon.addClass('fa-minus');
            icon.removeClass('fa-plus');
            text.html('Hide');
        } else {
            collapsible.css('display', 'none');
            icon.addClass('fa-plus');
            icon.removeClass('fa-minus');
            text.html('Show');
        }
        e.preventDefault();
    });
    $("pre.highlight code[class*='language-']").each(function() {
        var className = this.className.match(/language-([A-Za-z0-9+-]+)/);
        if (className) {
            $(this).removeClass(className[0]);
            $(this).addClass(className[1].toLowerCase());
        }
    });
    hljs.initHighlighting();
});