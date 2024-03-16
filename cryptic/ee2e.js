import forge from "node-forge";
import * as SecureStore from "expo-secure-store";

const generateKeys = async () => {
  try {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 512 });
    const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    return { privateKey, publicKey };
  } catch (error) {
    console.error("Error generating keys:", error);
    return null;
  }
};

const encrypt = (publicKeyA, publicKeyB, data) => {
  if (!publicKeyA || !publicKeyB) {
    console.log("Keys not generated yet.");
    return;
  }
  try {
    // Generate a random AES key for symmetric encryption
    const aesKey = forge.random.getBytesSync(16); // 16 bytes = 128-bit key

    // Encrypt the data with the AES key using CBC mode
    const iv = forge.random.getBytesSync(16); // 16 bytes IV
    const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encryptedData = cipher.output.getBytes();

    // Encrypt the AES key with the public RSA key
    const encryptedKeyA = forge.pki
      .publicKeyFromPem(publicKeyA)
      .encrypt(aesKey, "RSA-OAEP");

    const encryptedKeyB = forge.pki
      .publicKeyFromPem(publicKeyB)
      .encrypt(aesKey, "RSA-OAEP");

    // Create an object to hold the encrypted payload
    const encryptedPayload = {
      iv: forge.util.bytesToHex(iv),
      encryptedData: forge.util.bytesToHex(encryptedData),
    };
    
    return {
      encryptedKeyA: forge.util.bytesToHex(encryptedKeyA),
      encryptedKeyB: forge.util.bytesToHex(encryptedKeyB),
      encryptedPayload,
    };
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
};

const decrypt = (encryptedKey, encryptedPayload,privateKey) => {
  if (!encryptedKey) {
    console.error("Keys not generated yet.");
    return null;
  }

  if (!encryptedPayload || !encryptedPayload.iv || !encryptedPayload.encryptedData) {
    console.error("No encrypted data to decrypt.");
    return null;
  }

  try {
    // Extract the encrypted key, IV, and encrypted data from the payload
    const { iv, encryptedData } = encryptedPayload;
    // Convert hex strings to byte arrays
    const encryptedKeyBytes = forge.util.hexToBytes(encryptedKey);
    const ivBytes = forge.util.hexToBytes(iv);
    const encryptedDataBytes = forge.util.hexToBytes(encryptedData);
    
    // Decrypt the AES key with the private RSA key
    const decryptedKey = forge.pki
      .privateKeyFromPem(privateKey)
      .decrypt(encryptedKeyBytes, "RSA-OAEP");

      
    // Decrypt the data with the decrypted AES key
    const decipher = forge.cipher.createDecipher("AES-CBC", decryptedKey);
    
    decipher.start({ iv: ivBytes });
    decipher.update(forge.util.createBuffer(encryptedDataBytes));
    decipher.finish();
    const decryptedData = decipher.output.toString();
    return decryptedData;
  } catch (error) {
    return null;
  }
};

async function saveCred(username, privateKey) {
  await SecureStore.setItemAsync(username, privateKey);
}

async function getCred(username) {
  let result = await SecureStore.getItemAsync(username);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export { generateKeys, encrypt, decrypt, saveCred, getCred };
