
const VALID_VALUES = [
  'district',
  'title',
  'first_name',
  'last_name',
];
const SECOND = 1000;
let MESSAGE_VALUE = '';
const TEXT_COMMAND = 'text';
const PEEPS_COMMAND = 'get_peeps';
let TEXT_COUNT = 0;


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
  const message_element = document.getElementById('message');

  let startPos = message_element.selectionStart;
  let endPos = message_element.selectionEnd;

  const first_half = message_element.value.substring(0, startPos);
  const second_half = message_element.value.substring(endPos, message_element.value.length);

  message_element.value = first_half + text + second_half;

  message_element.focus();

  if (startPos === endPos) {
    message_element.setSelectionRange(first_half.length + text.length, first_half.length + text.length);
  } else {
    message_element.setSelectionRange(first_half.length, first_half.length + text.length);
  }
}


function updateMessage() {
  const message_element = document.getElementById('message');

  chrome.storage.local.set({ 'text_area_value': message_element.value }, () => {
    MESSAGE_VALUE = message_element.value;
    notifySuccess('Message successfully updated!');
  });
}


/**
 * Reset Counters
 */
function resetCounters() {
  chrome.storage.local.set({ 'text_count': 0 }, () => {
    TEXT_COUNT = 0;
    document.getElementById('text_count').innerText = '0';
    notifySuccess('Text Counter Reset To 0', 5);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#updateMessage').addEventListener('click', updateMessage);

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

  chrome.storage.local.get('text_area_value', items => {
    if (items.hasOwnProperty('text_area_value')) {
      const message = document.getElementById('message');
      MESSAGE_VALUE = items.text_area_value;
      message.value = MESSAGE_VALUE;
    }
  });

  chrome.storage.local.get('text_count', items => {
    if (items.hasOwnProperty('text_count')) {
      TEXT_COUNT = items['text_count'];
      document.getElementById('text_count').innerText = TEXT_COUNT;

    } else {
      chrome.storage.local.set({ 'text_count': 0 }, () => {
        TEXT_COUNT = 0;
      });
    }
  });

  document.getElementById('reset_counters').addEventListener('click', resetCounters);
});
