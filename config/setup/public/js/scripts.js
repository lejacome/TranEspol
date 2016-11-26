$(document).ready(function () {
    $('#fullpage').fullpage({
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage'],
        sectionsColor: ['#FFFFFF', '#E6E6E6', '#CFCFCF', '#BABABA', '#A7A7A7'],
        //scrollOverflow: true,
        autoScrolling: false,
        navigation: true,
        navigationPosition: 'right',
        fitToSection: false
    });
});