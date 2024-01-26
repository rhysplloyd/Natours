/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { renderTourMap } from './leaflet';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM elements
const loginForm = document.querySelector('.form--login');
const map = document.querySelector('#map');
const logOutBtn = document.querySelector(
  '.nav__el--logout',
);
const userDataForm = document.querySelector(
  '.form-user-data',
);
const userPasswordForm = document.querySelector(
  '.form-user-password',
);
const bookBtn = document.getElementById('book-tour');

// Values

// Delegation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('this is executing...');
    const email = document.getElementById('email').value;
    const password =
      document.getElementById('password').value;
    login(email, password);
  });
}

if (map) {
  const locations = JSON.parse(map.dataset.locations);
  renderTourMap(locations);
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append(
      'name',
      document.getElementById('name').value,
    );
    form.append(
      'email',
      document.getElementById('email').value,
    );
    form.append(
      'photo',
      document.getElementById('photo').files[0],
    );
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector(
      '.btn--save-password',
    ).textContent = 'Updating...';

    const passwordCurrent = document.getElementById(
      'password-current',
    ).value;

    const password =
      document.getElementById('password').value;

    const passwordConfirm = document.getElementById(
      'password-confirm',
    ).value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector(
      '.btn--save-password',
    ).textContent = 'Save Password';
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
