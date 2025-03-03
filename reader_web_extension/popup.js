document.addEventListener('DOMContentLoaded', () => {
    const readButton = document.getElementById('readButton');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
  
    // Load saved speed from storage
    chrome.storage.sync.get('speechSpeed', (data) => {
      if (data.speechSpeed) {
        speedSlider.value = data.speechSpeed;
        speedValue.textContent = data.speechSpeed + "x";
      }
    });
  
    speedSlider.addEventListener('input', () => {
      const speed = parseFloat(speedSlider.value);
      speedValue.textContent = speed + "x";
      chrome.storage.sync.set({ speechSpeed: speed });
    });
  
    readButton.addEventListener('click', () => {
      chrome.scripting.executeScript({
        target: { tabId: chrome.tabs.getCurrent().id },
        function: () => {
          return window.getSelection().toString();
        }
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError);
          return;
        }
  
        if (injectionResults && injectionResults[0] && injectionResults[0].result) {
          const selectedText = injectionResults[0].result;
          const speed = parseFloat(speedSlider.value);
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { text: selectedText, speed: speed });
          });
        }
      });
    });
  });