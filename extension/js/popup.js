
const VALID_VALUES = [
  'district',
  'title',
  'first_name',
  'last_name',
];
const SECOND = 1000;
let TEXT_AREA_VALUE = '';
const TEXT_COMMAND = 'text';
const PEEPS_COMMAND = 'get_peeps';
let CURSOR_POS = -1;


function notifyNotice(body, time) {
  notify('NOTICE', 'img/notice.png', body, time);
}


function notifySuccess(body, time) {
  notify('SUCCESS', 'img/success.png', body, time);
}


function notifyError(body, time) {
  notify('ERROR', 'img/error.png', body, time);
}


function notify(title, icon, body, time) {
  const options = {
    icon: icon,
    body: body,
  };
  const n = new Notification(title, options);
  if (time) {
    setTimeout(n.close.bind(n), time);
  }
}


function insertText(text) {
  if (CURSOR_POS > -1) {
    const text_area = document.getElementById('text_area');
  
    let startPos = text_area.selectionStart;
    let endPos = text_area.selectionEnd;
  
    CURSOR_POS = endPos + text_area.value.length;
  
    text_area.value = text_area.value.substring(0, startPos)
        + text
        + text_area.value.substring(endPos, text_area.value.length);
  
    chrome.storage.local.set({'text_area_value': text_area.value}, () => {
      text_area.focus();
      text_area.setSelectionRange(CURSOR_POS, CURSOR_POS);
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('district').addEventListener('click', () => {
    insertText('${district}');
  });
  document.getElementById('title').addEventListener('click', () => {
    insertText('${title}');
  });
  document.getElementById('first').addEventListener('click', () => {
    insertText('${first_name}');
  });
  document.getElementById('last').addEventListener('click', () => {
    insertText('${last_name}');
  });
  
  const text_area = document.getElementById('text_area');
  text_area.addEventListener('focusout', () => {
    CURSOR_POS = document.getElementById('text_area').selectionEnd;
  });
  text_area.addEventListener('keypress', () => {
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
