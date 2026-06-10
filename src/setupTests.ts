import '@testing-library/jest-dom';

class NotificationMock {
  static permission = 'granted';
  static async requestPermission() {
    return 'granted';
  }

  constructor(title: string, options?: NotificationOptions) {}
}

Object.defineProperty(window, 'Notification', {
  value: NotificationMock,
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
