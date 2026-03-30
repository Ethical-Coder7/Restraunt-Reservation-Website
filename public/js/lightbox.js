function openLightbox(el) {
  const src = el.querySelector('img').src;
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if(lb) lb.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) closeLightbox();
    });
  }
});

document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') closeLightbox(); 
});