// SERVICE WORKER
if (navigator.serviceWorker.controller) {
    console.log('Service Worker Activo Encontrado');
} else {
    navigator.serviceWorker
        .register('sw.js', { scope: './' })
        .then(function(reg) {
            console.log('Service Worker Registrado');
        });
}

//SCROLL Suavizado
$(document).ready(function() {
    $("#menu a").click(function(e) {
        e.preventDefault();

        $("html, body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
});