chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.text) {
        const utterance = new SpeechSynthesisUtterance(request.text);
        utterance.rate = request.speed;
        window.speechSynthesis.speak(utterance);
      }
    }
  );