'use strict';
// Centralize o telefone aqui para futuras alterações da equipe.
const WHATSAPP = '5588996185716';
const form = document.querySelector('#booking-form');
const arrival = document.querySelector('#checkin');
const departure = document.querySelector('#checkout');
const guests = document.querySelector('#guests');
const roomType = document.querySelector('#room-type');
const airConditioning = document.querySelector('#air-conditioning');
const help = document.querySelector('#booking-help');
const dateString = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const tomorrow = value => { const [y,m,d] = value.split('-').map(Number); return dateString(new Date(y,m-1,d+1,12)); };
const today = dateString(new Date());
arrival.min = today;
departure.min = tomorrow(today);
arrival.addEventListener('change', () => {
  departure.min = tomorrow(arrival.value || today);
  if (departure.value && departure.value <= arrival.value) departure.value = '';
  departure.setCustomValidity('');
});
departure.addEventListener('change', () => departure.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (arrival.value < today || departure.value <= arrival.value) {
    departure.setCustomValidity('A saída precisa ser depois da chegada. Escolha datas a partir de hoje.');
    departure.reportValidity();
    return;
  }
  const format = value => value.split('-').reverse().join('/');
  const message = `Olá! Vim pelo site da Pousada Brisa do Rio e gostaria de consultar uma hospedagem.\n\nChegada: ${format(arrival.value)}\nSaída: ${format(departure.value)}\nHóspedes: ${guests.value}\nTipo de quarto: ${roomType.value}\nAr-condicionado: ${airConditioning.checked ? 'Tenho preferência' : 'Sem preferência'}\n\nQuais acomodações estão disponíveis e quais são os valores?`;
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  help.replaceChildren(document.createTextNode('Sua consulta está pronta. Se o WhatsApp não abriu, '));
  const retry = document.createElement('a');
  retry.href = url; retry.target = '_blank'; retry.rel = 'noopener noreferrer';
  retry.textContent = 'toque aqui para continuar.'; retry.style.textDecoration = 'underline';
  help.append(retry);
});
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-nav');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open ? 'Fechar menu' : 'Abrir menu');
  menu.hidden = !open;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const photos = [
  {src:'foto-01.webp', caption:'Quarto de casal'},
  {src:'foto-02.webp', caption:'Detalhes do quarto'},
  {src:'foto-03.webp', caption:'Banheiro da pousada'},
  {src:'foto-04.webp', caption:'Corredor dos quartos'},
  {src:'foto-05.webp', caption:'Bar da pousada'},
  {src:'ambiente-original-hd.webp', caption:'Área de convivência'},
  {src:'foto-07.webp', caption:'Mesas de sinuca'},
  {src:'foto-08.webp', caption:'Área de convivência'},
  {src:'foto-09.webp', caption:'Decoração da pousada'},
  {src:'foto-10.webp', caption:'Detalhes da pousada'},
  {src:'rio-caiaque.webp', caption:'Rio Jaguaribe', restored:true},
  {src:'cafe-da-manha.webp', caption:'Café da manhã', restored:true},
  {src:'gato.webp', caption:'Gato na pousada', restored:true}
];
const dialog = document.querySelector('#gallery-dialog');
const fullImage = document.querySelector('#gallery-full');
const caption = document.querySelector('#gallery-caption');
const photoStage = document.querySelector('.lightbox-main');
const photoFrame = document.querySelector('.lightbox-frame');
const photoStatus = document.querySelector('#gallery-status');
const photoCounter = document.querySelector('#gallery-counter');
let photoIndex = 0;
let galleryTrigger;
let galleryScrollY = 0;
let photoRequest = 0;
let photoSize;
function fitPhoto() {
  if (!photoSize) return;
  const scale = Math.min(photoStage.clientWidth / photoSize.width, photoStage.clientHeight / photoSize.height);
  photoFrame.style.width = `${photoSize.width * scale}px`;
  photoFrame.style.height = `${photoSize.height * scale}px`;
}
new ResizeObserver(fitPhoto).observe(photoStage);
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  const request = ++photoRequest;
  fullImage.hidden = true;
  photoStage.setAttribute('aria-busy', 'true');
  photoStatus.textContent = 'Carregando foto…';
  photoStatus.hidden = false;
  caption.replaceChildren(document.createTextNode(photo.caption));
  if (photo.restored) {
    const credit = document.createElement('small');
    credit.textContent = 'Restauração com IA';
    caption.append(credit);
  }
  photoCounter.textContent = `${photoIndex+1} / ${photos.length}`;
  photoCounter.setAttribute('aria-label', `Foto ${photoIndex+1} de ${photos.length}`);
  // A separate loader prevents a late image from replacing the next selection.
  const loader = new Image();
  loader.onload = () => {
    if (request !== photoRequest) return;
    fullImage.src = loader.src;
    fullImage.alt = photo.caption;
    photoSize = {width: loader.naturalWidth, height: loader.naturalHeight};
    fitPhoto();
    fullImage.hidden = false;
    photoStatus.hidden = true;
    photoStage.setAttribute('aria-busy', 'false');
  };
  loader.onerror = () => {
    if (request !== photoRequest) return;
    photoStage.setAttribute('aria-busy', 'false');
    photoStatus.textContent = 'Não foi possível carregar esta foto. Tente a próxima.';
  };
  loader.src = `assets/${photo.src}`;
}
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  galleryTrigger = button;
  galleryScrollY = window.scrollY;
  document.body.style.setProperty('--gallery-scroll-y', `-${galleryScrollY}px`);
  document.body.classList.add('modal-open');
  showPhoto(Number(button.dataset.photo));
  dialog.showModal();
}));
document.querySelector('#close-gallery').addEventListener('click', () => dialog.close());
document.querySelector('#prev-photo').addEventListener('click', () => showPhoto(photoIndex-1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(photoIndex+1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex+1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex-1); }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('--gallery-scroll-y');
  window.scrollTo({top: galleryScrollY, behavior: 'instant'});
  galleryTrigger?.focus({preventScroll:true});
  swipeStart = null;
});
let swipeStart = null;
photoStage.addEventListener('touchstart', event => {
  swipeStart = event.touches.length === 1
    ? {x: event.touches[0].clientX, y: event.touches[0].clientY}
    : null;
}, {passive:true});
photoStage.addEventListener('touchend', event => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  }
  swipeStart = null;
}, {passive:true});
photoStage.addEventListener('touchcancel', () => { swipeStart = null; }, {passive:true});
document.querySelector('#year').textContent = new Date().getFullYear();

// A single, brief opening animation; the CTA remains usable without JavaScript.
const finalCta = document.querySelector('.final-cta');
if ('IntersectionObserver' in window) {
  finalCta.classList.add('motion-ready');
  const ctaObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      finalCta.classList.add('is-visible');
      ctaObserver.disconnect();
    }
  }, {threshold: 0.25});
  ctaObserver.observe(finalCta);
}
