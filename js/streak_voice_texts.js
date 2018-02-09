(function() {
  
  let vanilla_text;
  
  
  function sendTexts(peeps, tab_id) {
    
    const peep = peeps.shift();
    
    switch (peep.cell_phone) {
      case '':
      case null:
      case undefined:
        sendTexts(peeps, tab_id);
        return;
    }
    
    let text = vanilla_text;
    text = text.replace(/\${formal_name}/g,     peep.formal_name);
    text = text.replace(/\${first_name}/g,      peep.first_name);
    text = text.replace(/\${last_name}/g,       peep.last_name);
    text = text.replace(/\${licensed_call}/g,   peep.licensed_call);
    text = text.replace(/\${family_1}/g,        peep.family_1);
    text = text.replace(/\${family_2}/g,        peep.family_2);
    text = text.replace(/\${family_3}/g,        peep.family_3);
    
    const phone = peep.cell_phone.replace(/[^0-9]/g, '');
    
    
    // Send message to google voice tab to send a text message
    chrome.tabs.sendMessage(tab_id, {command: TEXT_COMMAND, peeps: peeps, phone: phone, text: text}, response => {
      
      if (!response) {
        notifyError('Reload Google Voice page and try again');
        
      } else if (response.result === 'success') {
        
        if (response.peeps.length > 0) {
          return sendTexts(response.peeps, tab_id);
        } else {
          notifySuccess('All Done!');
        }
        
      } else if (response.result === 'failure') {
        notifyError('Send text failed');
        
      } else {
        notifyError('Unexpected result');
      }
    });
  }
  
  
  function getPeeps() {
    // Send message to Streak to get peeps
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs[0];
      
      chrome.tabs.sendMessage(tab.id, {command: PEEPS_COMMAND}, response => {
        
        if (!response) {
          notifyError('Reload page and try again');
          
        } else if (response.result === 'success') {
          
          chrome.tabs.query({currentWindow: true}, tabs => {
            for (let i = 0; i < tabs.length; i++) {
              if (tabs[i].url.startsWith('https://www.google.com/voice')) {
                sendTexts(response.peeps, tabs[i].id);
              }
            }
          });
          
        } else if (response.result === 'failure') {
          notifyError(response.message);
          
        } else {
          notifyError('Call Travis! Code 69! ' + response.result);
        }
        
      });
    });
  }
  
  
  function streakVoiceTexts() {
    vanilla_text = document.getElementById('text_area').value;
    
    if (vanilla_text.length === 0) {
      notifyNotice('There is no text in text area. Aborting operation');
      return;
    }
    
    for (let i = 0; i < vanilla_text.length; i++) {
      if (vanilla_text[i] === '$' && vanilla_text[i + 1] === '{') {
        const index = vanilla_text.indexOf('}', i);
        
        if (index === -1) {
          notifyNotice('Malformed string. Aborting operation');
          return;
        }
        
        const value = vanilla_text.substring(i + 2, index);
        
        if (!VALID_VALUES.includes(value)) {
          notifyNotice(`\$\{${value}\} is not a valid value. Aborting operation`);
          return;
        }
        
        i = index + 1;
      }
    }
    
    
    getPeeps();
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    // noinspection JSUnresolvedFunction
    document.querySelector('#streak_voice_texts').addEventListener('click', streakVoiceTexts);
  });
  
}());
