/* NeuroShift — consentimiento de cookies + Meta Pixel (solo tras aceptar).
   Configura aquí el ID del píxel. Vacío = no se carga nada. */
window.NS_PIXEL_ID = window.NS_PIXEL_ID || '';

(function(){
  var KEY = 'ns_consent_v1';
  function get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function set(v){ try{ localStorage.setItem(KEY, v); }catch(e){} }

  function loadPixel(){
    if (!window.NS_PIXEL_ID || window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', window.NS_PIXEL_ID);
    fbq('track', 'PageView');
    (window.NS_EVENTS || []).forEach(function(ev){ fbq('track', ev[0], ev[1] || {}); });
  }
  /* Las páginas encolan eventos con NS.track(nombre, datos) */
  window.NS = {
    track: function(name, data){
      if (window.fbq) { fbq('track', name, data || {}); }
      else { (window.NS_EVENTS = window.NS_EVENTS || []).push([name, data]); }
    },
    openSettings: function(){ set(''); banner(); }
  };

  function banner(){
    if (document.getElementById('cc')) return;
    var d = document.createElement('div');
    d.className = 'cc'; d.id = 'cc'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Preferencias de cookies');
    d.innerHTML = 'Usamos cookies propias necesarias y, solo si lo aceptas, cookies de medición publicitaria (Meta) para saber qué anuncios funcionan. <a href="/cookies.html">Más información</a>.' +
      '<div class="cc-actions"><button class="cc-yes" type="button">Aceptar</button><button class="cc-no" type="button">Rechazar</button></div>';
    document.body.appendChild(d);
    d.querySelector('.cc-yes').onclick = function(){ set('yes'); d.remove(); loadPixel(); };
    d.querySelector('.cc-no').onclick = function(){ set('no'); d.remove(); };
  }

  function init(){
    var c = get();
    if (c === 'yes') loadPixel();
    else if (c !== 'no') banner();
    /* Evento Lead al enviar el formulario de captación */
    document.querySelectorAll('form[data-lead]').forEach(function(f){
      f.addEventListener('submit', function(){ NS.track('Lead'); });
    });
    /* Evento InitiateCheckout al ir a Stripe */
    document.querySelectorAll('a[href^="https://buy.stripe.com"]').forEach(function(a){
      a.addEventListener('click', function(){
        NS.track('InitiateCheckout', {value: parseFloat(a.getAttribute('data-value')||'0'), currency:'EUR', content_name: a.getAttribute('data-product')||''});
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
