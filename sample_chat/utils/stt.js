// STT Utility — Simplified Native Web Speech implementation.
// Purely browser-based transcription with real-time support.

export function startNativeRecognition(onResult, onEnd) {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Native Speech Recognition not supported in this browser."));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    // Continuous = true keeps the mic open
    // InterimResults = true allows us to see text as it's being processed
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // To prevent duplication, we only send the FINAL text as a permanent addition.
      // We send the interim text separately so the UI can show "live" changes
      // without committing them to the permanent state yet.
      onResult({
        final: finalTranscript,
        interim: interimTranscript
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'no-speech') return;
      reject(new Error(`Native STT Error: ${event.error}`));
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();
    resolve(recognition);
  });
}

export function isSTTSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
