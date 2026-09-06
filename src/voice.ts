export type VoiceEvents = {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (text: string) => void;
  onError?: (message: string) => void;
};

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
};

export function createVoiceController(events: VoiceEvents) {
  const RecognitionCtor = (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition
    ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;

  if (!RecognitionCtor) {
    return {
      supported: false,
      start: () => events.onError?.('Trình duyệt/phiên bản Chromium này chưa hỗ trợ Speech Recognition.'),
      stop: () => undefined,
    };
  }

  const recognition = new RecognitionCtor();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onstart = () => events.onStart?.();
  recognition.onend = () => events.onEnd?.();
  recognition.onerror = (event) => events.onError?.(`Voice error: ${event.error}`);
  recognition.onresult = (event) => {
    const first = event.results[0]?.[0]?.transcript?.trim();
    if (first) events.onResult?.(first);
  };

  return {
    supported: true,
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
}

export function speak(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.98;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
