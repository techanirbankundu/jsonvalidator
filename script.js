// Render JSON and handle expansion/collapse
function renderJson() {
    const jsonInput = document.getElementById('jsonInput').value;
    let jsonData;
  
    try {
      jsonData = JSON.parse(jsonInput);
    } catch (error) {
      alert('Invalid JSON!');
      return;
    }
  
    const jsonTree = document.getElementById('jsonTree');
    jsonTree.innerHTML = '';
    jsonTree.appendChild(createJsonTree(jsonData));
  }
  
  function createJsonTree(json) {
    const ul = document.createElement('ul');
  
    for (const key in json) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const value = json[key];
  
      // Tooltip logic: This will add the tooltip only on hover
      const tooltip = createTooltip("This is a " + getTypeDescription(value));
      li.appendChild(tooltip);
  
      if (typeof value === 'object' && value !== null) {
        span.textContent = key + ":";
        li.classList.add('key');
        
        const collapsibleIcon = document.createElement('span');
        collapsibleIcon.classList.add('icon', 'closed');
        
        const collapsible = document.createElement('ul');
        collapsible.classList.add('json-children');
        
        const collapsibleDiv = document.createElement('div');
        collapsibleDiv.classList.add('collapsible');
        collapsibleDiv.appendChild(collapsibleIcon);
        collapsibleDiv.appendChild(span);
  
        li.appendChild(collapsibleDiv);
        li.appendChild(collapsible);
  
        li.classList.add('collapsed'); // Initially collapsed
        collapsibleDiv.onclick = function () {
          li.classList.toggle('collapsed');
          collapsibleIcon.classList.toggle('open');
          collapsibleIcon.classList.toggle('closed');
          // Ensure the child elements are also toggled
          collapsible.classList.toggle('hidden');
        };
  
        li.appendChild(createJsonTree(value)); // Recursive call for nested objects
      } else {
        span.textContent = `${key}: `;
        const valueSpan = document.createElement('span');
        
        if (typeof value === 'string') {
          valueSpan.textContent = `${truncateString(value)}`;
          valueSpan.classList.add('string');
          tooltip.textContent = "This is a String";
          addShowMoreButton(li, value, 'string');
        } else if (typeof value === 'number') {
          valueSpan.textContent = value;
          valueSpan.classList.add('number');
          tooltip.textContent = "This is a Number";
        } else if (typeof value === 'boolean') {
          valueSpan.textContent = value;
          valueSpan.classList.add('boolean');
          tooltip.textContent = "This is a Boolean";
        } else if (value === null) {
          valueSpan.textContent = 'null';
          valueSpan.classList.add('null');
          tooltip.textContent = "This is Null";
        }
        
        li.appendChild(span);
        li.appendChild(valueSpan);
      }
      ul.appendChild(li);
    }
    return ul;
  }
  
  // Get the type of the JSON value and return a description for the tooltip
  function getTypeDescription(value) {
    if (typeof value === 'object' && value !== null) {
      return "Object";
    }
    if (Array.isArray(value)) {
      return "Array";
    }
    if (typeof value === 'string') {
      return "String";
    }
    if (typeof value === 'number') {
      return "Number";
    }
    if (typeof value === 'boolean') {
      return "Boolean";
    }
    if (value === null) {
      return "Null";
    }
    return "Unknown";
  }
  
  // Create tooltip element
  function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = text;
    tooltip.style.visibility = 'hidden'; // Initially hidden
    return tooltip;
  }
  
  // Show tooltip on hover
  document.addEventListener('mouseover', function(e) {
    const tooltip = e.target.querySelector('.tooltip');
    if (tooltip) {
      tooltip.style.visibility = 'visible';
    }
  });
  
  // Hide tooltip when mouse leaves
  document.addEventListener('mouseout', function(e) {
    const tooltip = e.target.querySelector('.tooltip');
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
    }
  });
  
  // Function to toggle the sidebar visibility
  function toggleInfo() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
  }
  
  // Truncate long strings and add "Show more" button
  function truncateString(str) {
    if (str.length > 50) {
      return str.substring(0, 50) + '...';
    }
    return str;
  }
  
  // Add "Show more" button for long strings or arrays
  function addShowMoreButton(li, value, type) {
    if (type === 'string' && value.length > 50) {
      const showMoreBtn = document.createElement('button');
      showMoreBtn.textContent = 'Show more';
      showMoreBtn.classList.add('show-more');
      li.appendChild(showMoreBtn);
      
      showMoreBtn.onclick = function () {
        const valueSpan = li.querySelector('span');
        valueSpan.textContent = value;
        showMoreBtn.textContent = 'Show less';
        showMoreBtn.onclick = function () {
          valueSpan.textContent = truncateString(value);
          showMoreBtn.textContent = 'Show more';
        };
      };
    }
  }
  