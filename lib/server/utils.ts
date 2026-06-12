import 'server-only';
import { BankConfig } from '@/lib/types';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import crypto from 'crypto';
import { AWS_REGION, ENVIRONMENT } from '../aws';

const cacheKeys = new Map();

const client = new SSMClient({
  region: AWS_REGION,
});

const generateKey = (secret: string) => {
  // Java: SHA-256 → first 16 bytes
  const hash = crypto.createHash('sha256').update(secret, 'utf8').digest();
  return hash.subarray(0, 16); // 128-bit key
};

const decryptAES = async (encryptedBase64: string) => {
  try {
    const secret = await getSecretKey();
    const key = generateKey(secret ?? '');
    const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
    decipher.setAutoPadding(true);

    // ✅ STEP 1: decode URL
    const decoded = decodeURIComponent(encryptedBase64);

    // ✅ STEP 2: fix '+' issue (VERY common in query params)
    const fixed = decoded.replace(/ /g, '+');

    const decrypted = decipher.update(fixed, 'base64', 'utf8') + decipher.final('utf8');

    return decrypted;
  } catch {
    return '{}';
  }
};

export const decodeParamJSON = async (param: string): Promise<BankConfig> => {
  try {
    if (!param) throw new Error('Missing param');

    // ✅ Step 1: URL decode
    const urlDecoded = decodeURIComponent(param);

    // ✅ Step 2: AES decrypt
    const decrypted = await decryptAES(urlDecoded);

    // ✅ Step 3: JSON parse
    return JSON.parse(decrypted);
  } catch {
    // console.error('Decode failed:', err);
    return {
      bankName: '',
      deepLinkUrl: '',
      deepLinkUrlIos: '',
      autoRedirectTimerSeconds: 0,
      transactionId: '',
      redirectUrl: '',
    };
  }

  return {
    bankName: 'Habib Bank Limited',
    deepLinkUrl: 'resal://home',
    deepLinkUrlIos: 'resal://',
    autoRedirectTimerSeconds: 10,
    transactionId: 'transaction.id',
    redirectUrl: 'data.redirectUrl',
  };
};

export const getSecretKey = async () => {
  try {
    if (cacheKeys.has('secretKey')) {
      return cacheKeys.get('secretKey');
    }
    const command = new GetParameterCommand({
      Name: `/${ENVIRONMENT}/collection/wallet/simpaisa.pay.now.encryption.key`,
      WithDecryption: true,
    });

    const response = await client.send(command);
    cacheKeys.set('secretKey', response.Parameter?.Value || '');
    return response.Parameter?.Value || '';
  } catch (error) {
    console.log({ error });
  }
};

export const getMongoBaseURL = async () => {
  try {
    if (cacheKeys.has('mongoBaseURL')) {
      return cacheKeys.get('mongoBaseURL');
    }
    const command = new GetParameterCommand({
      Name: `/${ENVIRONMENT}/collection/wallet/raast.redirection.mongo.url`,
      WithDecryption: true,
    });

    const response = await client.send(command);
    cacheKeys.set('mongoBaseURL', response.Parameter?.Value || '');
    return response.Parameter?.Value || '';
  } catch (error) {
    console.log({ error });
  }
};

// export const STEPS_DATA: SlideType[] = [
//   {
//     stepImage: '/easypaisa-1.webp',
//     description: 'Open Easypaisa and tap your Profile',
//     step: 1,
//     bankName: 'EasyPaisa (Telenor MFB)',
//   },
//   {
//     stepImage: '/easypaisa-2.webp',
//     description: 'Tap My Approvals',
//     step: 2,
//     bankName: 'EasyPaisa (Telenor MFB)',
//   },
//   {
//     stepImage: '/easypaisa-3.webp',
//     description: 'Tap Accept',
//     step: 3,
//     bankName: 'EasyPaisa (Telenor MFB)',
//   },

//   {
//     stepImage: '/jazzcash-1.webp',
//     description: 'Open JazzCash and tap Profile',
//     step: 1,
//     bankName: 'JazzCash (MFB)',
//   },
//   {
//     stepImage: '/jazzcash-2.webp',
//     description: 'Tap Payment Requests',
//     step: 2,
//     bankName: 'JazzCash (MFB)',
//   },
//   {
//     stepImage: '/jazzcash-3.webp',
//     description: 'Tap View details',
//     step: 3,
//     bankName: 'JazzCash (MFB)',
//   },
//   {
//     stepImage: '/jazzcash-4.webp',
//     description: 'Tap Approve Request',
//     step: 4,
//   },
// ];
