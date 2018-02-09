(function() {

  //noinspection JSCheckFunctionSignatures
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    
      if (!request) {
        sendResponse({ result: 'failure', message: 'Reload Google Voice page and try again.' });
        
      } else if (request.command === 'text') {
    
        const text = document.querySelector('#gc-sidebar-jfk-container > div > div.actionButtonSection > div:nth-child(2)');
        text.dispatchEvent(new MouseEvent('mousedown'));
        text.dispatchEvent(new MouseEvent('mouseup'));
    
        const to = document.querySelector('#gc-quicksms-number');
        to.value = request.phone;
        
        const message = document.querySelector('#gc-quicksms-text2');
        message.value = request.text;
    
        const send = document.querySelector('#gc-quicksms-send2');
        send.dispatchEvent(new MouseEvent('mousedown'));
        send.dispatchEvent(new MouseEvent('mouseup'));
        
        
        setTimeout(function() {
          sendResponse({result: 'success', peeps: request.peeps});
        }, 3000);
        
        return true;
      }
    }
  );

}());
