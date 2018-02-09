
const VALID_VALUES = [
  'formal_name',
  'first_name',
  'last_name',
  'licensed_call',
  'family_1',
  'family_2',
  'family_3',
];

let TEXT_AREA_VALUE = '';
const TEXT_COMMAND = 'text';
const PEEPS_COMMAND = 'get_peeps';

function insertText(text) {
  const textarea = document.getElementById('text_area');
  
  let startPos = textarea.selectionStart;
  let endPos = textarea.selectionEnd;
  
  textarea.value = textarea.value.substring(0, startPos)
    + text
    + textarea.value.substring(endPos, textarea.value.length);
}


function notifyNotice(body) {
  notify('NOTICE', 'img/notice.png', body);
}


function notifySuccess(body) {
  notify('SUCCESS', 'img/success.png', body);
}


function notifyError(body) {
  notify('ERROR', 'img/error.png', body);
}


function notify(title, icon, body) {
  const options = {
    icon: icon,
    body: body,
  };
  const n = new Notification(title, options);
  setTimeout(n.close.bind(n), 5000);
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formal').addEventListener('mousedown', () => {
    insertText('${formal_name}');
  });
  document.getElementById('first').addEventListener('mousedown', () => {
    insertText('${first_name}');
  });
  document.getElementById('last').addEventListener('mousedown', () => {
    insertText('${last_name}');
  });
  document.getElementById('licensed_call').addEventListener('mousedown', () => {
    insertText('${licensed_call}');
  });
  document.getElementById('family_1').addEventListener('mousedown', () => {
    insertText('${family_1}');
  });
  document.getElementById('family_2').addEventListener('mousedown', () => {
    insertText('${family_2}');
  });
  document.getElementById('family_3').addEventListener('mousedown', () => {
    insertText('${family_3}');
  });
  
  const text_area = document.getElementById('text_area');
  text_area.addEventListener('focusin', () => {
    document.getElementById('buttons').classList.remove('hidden');
  });
  text_area.addEventListener('focusout', () => {
    document.getElementById('buttons').classList.add('hidden');
  });
  text_area.addEventListener('keypress', () => {
    const text_area = document.getElementById('text_area');
    chrome.storage.local.set({ 'text_area_value': text_area.value }, () => {
      TEXT_AREA_VALUE = text_area.value;
    });
  });
  
  addEventListener('unload', () => {
    const text_area = document.getElementById('text_area');
    chrome.storage.local.set({ 'text_area_value': text_area.value }, () => {
      TEXT_AREA_VALUE = text_area.value;
    });
  });
  
  window.addEventListener('unload', () => {
    const text_area = document.getElementById('text_area');
    chrome.storage.local.set({ 'text_area_value': text_area.value }, () => {
      TEXT_AREA_VALUE = text_area.value;
    });
  });
  
  chrome.storage.local.get('text_area_value', items => {
    if (items.hasOwnProperty('text_area_value')) {
      const text_area = document.getElementById('text_area');
      TEXT_AREA_VALUE = items.text_area_value;
      text_area.value = TEXT_AREA_VALUE;
    }
  });
});
