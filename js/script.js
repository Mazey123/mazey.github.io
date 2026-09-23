/* =========================================================
   PWA.Учебник — общий скрипт для всех страниц
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* --- 0. Регистрация Service Worker (сайт сам является рабочим PWA) --- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('Service Worker не зарегистрирован:', err);
    });
  }

  /* --- 1. Бургер-меню --- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Закрывать меню при выборе пункта (удобно на мобильных) */
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- 2. Модальное окно для галереи примеров --- */
  var modal = document.getElementById('gallery-modal');
  if (modal) {
    var modalImg = modal.querySelector('[data-modal-img]');
    var modalTitle = modal.querySelector('[data-modal-title]');
    var modalDesc = modal.querySelector('[data-modal-desc]');
    var closeBtn = modal.querySelector('.modal__close');

    document.querySelectorAll('[data-gallery-item]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        modalImg.src = img.getAttribute('src');
        modalImg.alt = img.getAttribute('alt') || '';
        modalTitle.textContent = item.getAttribute('data-title') || '';
        modalDesc.textContent = item.getAttribute('data-desc') || '';
        modal.classList.add('is-open');
      });
    });

    function closeModal() { modal.classList.remove('is-open'); }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* --- 3. Фильтр по категориям (примеры PWA) --- */
  var filterButtons = document.querySelectorAll('[data-filter]');
  var filterItems = document.querySelectorAll('[data-category]');
  if (filterButtons.length && filterItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var value = btn.getAttribute('data-filter');
        filterItems.forEach(function (item) {
          var show = value === 'all' || item.getAttribute('data-category') === value;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* --- 4. Год в подвале --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- 5. Простая валидация формы обратной связи --- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      status.textContent = 'Спасибо! Сообщение отправлено (демо-режим формы).';
      status.hidden = false;
      contactForm.reset();
    });
  }
});
