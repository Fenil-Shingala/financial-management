import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private readonly key = environment.encryptionKey;

  encrypt(plainText: string): string {
    try {
      return CryptoJS.AES.encrypt(plainText, this.key).toString();
    } catch {
      return plainText;
    }
  }

  decrypt(cipherText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.key);
      const text = bytes.toString(CryptoJS.enc.Utf8);
      return text || cipherText;
    } catch {
      return cipherText;
    }
  }
}
