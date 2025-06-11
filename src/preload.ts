import * as crypto from 'crypto';

if (!(global as any).crypto) {
  (global as any).crypto = crypto;
}

if (!(crypto as any).randomUUID) {
  (crypto as any).randomUUID = () => {
    return [...Array(36)]
      .map((_, i) =>
        (i === 14 ? '4' : i === 19 ? '89ab' : '0123456789abcdef')[Math.floor(Math.random() * 16)]
      )
      .join('');
  };
}
