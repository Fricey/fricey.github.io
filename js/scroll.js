// Smooth header show/hide
(function () {
  const header = document.getElementById('profileHeader');
  if (!header) return;

  let prevScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.remove('showHeaderOnTop');

    if (y > prevScrollY) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    prevScrollY = y;
  }, { passive: true });
})();
