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
      let row_col = row + '_' + columns['District'];
      const district_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!district_element) {
        throw new Error('Did not find \'District\' column.');
      }
      const district = district_element.textContent;
      
      
      // Formal Name
      row_col = row + '_' + columns['Title'];
      const title_element = document.querySelector(`div[cellposition='${row_col}']`);
      if (!title_element) {
        throw new Error('Did not find \'Title\' column.');
      }
      const title = title_element.textContent;
      
      
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
      
      
      peeps.push({
        district,
        title,
        first_name,
        last_name,
        cell_phone
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
