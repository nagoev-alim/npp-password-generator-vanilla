// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import axios from 'axios';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='password-generator'>
    <h2>Password Generator</h2>

    <div class='result'>
      <input type='text' data-password='' disabled>
      <button class='clipboard' data-clipboard=''>${feather.icons.clipboard.toSvg()}</button>
    </div>

    <div class='indicator' data-indicator=''></div>

    <div class='length'>
      <span class='label'>Password Length</span>
      <span data-length-value=''>15</span>
      <input class='length__range' type='range' value='15' min='1' max='30' step='1' data-range=''>
    </div>

    <ul class='options'>
      <li>
        <label>
          <input class='visually-hidden' type='checkbox' data-option='lowercase' checked>
          <span class='checkbox'></span>
          <span class='label'>Lowercase (a-z)</span>
        </label>
      </li>
      <li>
        <label>
          <input class='visually-hidden' type='checkbox' data-option='uppercase'>
          <span class='checkbox'></span>
          <span class='label'>Uppercase (A-Z)</span>
        </label>
      </li>
      <li>
        <label>
          <input class='visually-hidden' type='checkbox' data-option='numbers'>
          <span class='checkbox'></span>
          <span class='label'>Numbers (0-9)</span>
        </label>
      </li>
      <li>
        <label>
          <input class='visually-hidden' type='checkbox' data-option='symbols'>
          <span class='checkbox'></span>
          <span class='label'>Symbols (!-$^+)</span>
        </label>
      </li>
    </ul>
    <button class='button' data-generate=''>Generate Password</button>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      passwordInput: document.querySelector('[data-password]'),
      passwordIndicator: document.querySelector('[data-indicator]'),
      btnClipboard: document.querySelector('[data-clipboard]'),
      btnGenerate: document.querySelector('[data-generate]'),
      passwordOptions: {
        option: document.querySelectorAll('[data-option]'),
        range: document.querySelector('[data-range]'),
        length: document.querySelector('[data-length-value]'),
      },
    };

    this.characters = {
      lowercase: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
      uppercase: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
      numbers: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48),
      symbols: () => '!@#$%^&*(){}[]=<>,.'[Math.floor(Math.random() * '!@#$%^&*(){}[]=<>,.'.length)],
    };

    this.DOM.passwordOptions.range.addEventListener('input', this.onRange);
    this.DOM.btnGenerate.addEventListener('click', this.onClick);
    this.DOM.btnClipboard.addEventListener('click', this.clipboardPassword);
  }

  /**
   * @function onRange - Range slider change handler
   * @param target
   */
  onRange = ({ target }) => this.DOM.passwordOptions.length.textContent = target.value;

  /**
   * @function onClick - Generate password
   */
  onClick = () => {
    const length = Number(this.DOM.passwordOptions.range.value);
    let params = null;
    this.DOM.passwordOptions.option.forEach(option => params = { ...params, [option.dataset.option]: option.checked });
    this.DOM.passwordInput.value = this.generatePassword({ ...params, length });
    this.updateIndicator();
  };

  /**
   * @function generatePassword - Generate password
   */
  generatePassword = ({ lowercase, uppercase, numbers, symbols, length }) => {
    let result = '';
    const typesCount = lowercase + uppercase + numbers + symbols;
    const typesArray = [{ lowercase }, { uppercase }, { numbers }, { symbols }].filter(i => Object.values(i)[0]);

    if (typesCount === 0) return '';

    for (let i = 0; i < length; i += typesCount) {
      typesArray.forEach(t => result += this.characters[Object.keys(t)[0]]());
    }

    return result.slice(0, length);
  };

  /**
   * @function updateIndicator - Update password range
   */
  updateIndicator = () => {
    this.DOM.passwordIndicator.setAttribute(
      'data-level',
      this.DOM.passwordOptions.range.value <= 8
        ? 'weak' : this.DOM.passwordOptions.range.value <= 16
          ? 'medium' : 'strong');
  };

  /**
   * @function clipboardPassword - Copy password to clipboard
   */
  clipboardPassword = () => {
    const textarea = document.createElement('textarea');
    const password = this.DOM.passwordInput.value;
    if (!password) return;
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    // navigator.clipboard.writeText(this.DOM.passwordInput.value); // alternative
    showNotification('success', 'Password copied to clipboard');
  };
}

// ⚡️Class instance
new App();
