(function () {

  function getPeeps() {
    const columns = {};
    const column_positions = document.querySelectorAll('div.streak__spreadsheet_headCell');
    
    for (let i = 0; i < column_positions.length; i++) {
      const column_info = column_positions.item(i);
      const column_name = column_info.textContent;
      const cellposition = column_info.getAttribute('cellposition');
      if (cellposition !== '0_0' && cellposition !== '0_1') {
        columns[column_name] = cellposition.split('_')[1];
      }
    }
    
    const peeps = [];
    const row_positions = document.getElementsByClassName('streak__checkbox_checked');
    
    if (row_positions.length < 1) {
      throw new Error('No rows checked.');
    }
    
    for (let i = 0; i < row_positions.length; i++) {
      const row_info = row_positions.item(i);
      const row_info_parent = row_info.parentElement.parentElement;
      
      if (row_info_parent.classList.contains('streak__spreadsheet_groupCell') || row_info_parent.classList.contains('streak__spreadsheet_groupValue')) {
        continue;
      }
      
      const cellposition = row_info_parent.getAttribute('cellposition');
      const row = cellposition.split('_')[0];
      
      if (row === '0') {
        continue;
      }
      
      
      // Formal Name
      let row_col = row + '_' + columns['Formal Name'];
      const formal_name_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!formal_name_element) {
        throw new Error('Did not find \'Formal Name\' column.');
      }
      const formal_name = formal_name_element.textContent;
      
      
      // First Name
      row_col = row + '_' + columns['First Name'];
      const first_name_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!first_name_element) {
        throw new Error('Did not find \'First Name\' column.');
      }
      const first_name = first_name_element.textContent;
      
      
      // Last Name
      row_col = row + '_' + columns['Last Name'];
      const last_name_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!last_name_element) {
        throw new Error('Did not find \'Last Name\' column.');
      }
      const last_name = last_name_element.textContent;
    
      
      // Cell Phone
      row_col = row + '_' + columns['Cell Phone'];
      const cell_phone_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!cell_phone_element) {
        throw new Error('Did not find \'Cell Phone\' column.');
      }
      const cell_phone = cell_phone_element.textContent;
  
  
      // Licensed Call
      row_col = row + '_' + columns['Licensed Call'];
      const licensed_call_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!licensed_call_element) {
        throw new Error('Did not find \'Licensed Call\' column.');
      }
      const licensed_call = licensed_call_element.textContent;
  
  
      // Family 1
      row_col = row + '_' + columns['Family 1'];
      const family_1_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!family_1_element) {
        throw new Error('Did not find \'Family 1\' column.');
      }
      const family_1 = family_1_element.textContent;
  
      
      // Family 2
      row_col = row + '_' + columns['Family 1'];
      const family_2_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!family_2_element) {
        throw new Error('Did not find \'Family 2\' column.');
      }
      const family_2 = family_1_element.textContent;
  
  
      // Family 3
      row_col = row + '_' + columns['Family 1'];
      const family_3_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!family_3_element) {
        throw new Error('Did not find \'Family 3\' column.');
      }
      const family_3 = family_1_element.textContent;
      
      
      peeps.push({
        formal_name: formal_name,
        first_name: first_name,
        last_name: last_name,
        cell_phone: cell_phone,
        licensed_call: licensed_call,
        family_1: family_1,
        family_2: family_2,
        family_3: family_3,
      });
    }
    

    return peeps;
  }


  //noinspection JSCheckFunctionSignatures
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (!request) {
        console.log(':(');
      
      } else if (request.command === 'get_peeps') {
    
        let peeps = [];
        
        try {
          peeps = getPeeps();
        } catch (error) {
          sendResponse({ result: 'failure', message: error.message });
        }
    
        if (peeps.length > 0) {
          sendResponse({ result: 'success', peeps: peeps });
        } else {
          sendResponse({ result: 'failure', message: 'Rows checked, but no people returned.' });
        }
    
      } else {
        sendResponse({ result: 'failure', message: 'Invalid command: ' + request.command });
      }
    }
  );

}());
