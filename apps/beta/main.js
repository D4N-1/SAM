import { makeWASocket, delay, DisconnectReason, useMultiFileAuthState, prepareWAMessageMedia, tokenizeCode } from '@itsliaaa/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import fs from 'node:fs'

// --- Connect with pairing code
const myPhoneNumber = '573134359055'

const logger = pino({ level: 'silent' })

const connectToWhatsApp = async () => {
   const { state, saveCreds } = await useMultiFileAuthState('session')
    
   const sock = makeWASocket({
        logger,
        auth: state
   })

   sock.ev.on('creds.update', saveCreds)

   sock.ev.on('connection.update', async(update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'connecting' && !sock.authState.creds.registered) {
         await delay(1500)
         const code = await sock.requestPairingCode(myPhoneNumber)
         console.log('🔗 Pairing code', ':', code)
      }
      else if (connection === 'close') {
         const shouldReconnect = new Boom(connection?.lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
         console.log('⚠️ Connection closed because', lastDisconnect.error, ', reconnecting ', shouldReconnect)
         if (shouldReconnect) {
            connectToWhatsApp()
         }
      }
      else if (connection === 'open') {
         console.log('✅ Successfully connected to WhatsApp')
      }
   })

   sock.ev.on('messages.upsert', async ({ messages }) => {

      for (const message of messages) {
        if (!message.message) continue

        console.log(message)
        const text = message?.message?.conversation;
        const jid = message?.key?.remoteJid;
        console.log('🔔 Got new message', ':', text)

        
        if (text === 'pre') {
            const urlA = 'https://www.npmjs.com/package/@itsliaaa/baileys'

            sock.sendMessage(jid, {
               text: urlA + '1',
               linkPreview: {
                  'matched-text': urlA,
                  title: '🌱 @itsliaaa/baileys',
                  description: 'Underrated Baileys Fork',
                  previewType: 0, // --- Use 1 for video playback in the link preview
                  jpegThumbnail: fs.readFileSync('./si.jpg')
               }
            })
        }


const urlB = 'https://www.npmjs.com/package/@itsliaaa/baileys#readme'

        if (text === 'si') {

        const { imageMessage: image } = await prepareWAMessageMedia({
           image: {
              url: './si.jpg'
           }
        }, {
           upload: sock.waUploadToServer,
           mediaTypeOverride: 'thumbnail-link'
        })

        image.height = 480
        image.width = 480

        sock.sendMessage(jid, {
           text: urlB + ' 👆🏻 Check it out!',
           linkPreview: {
              'matched-text': urlB,
              title: '🌱 @itsliaaa/baileys',
              description: 'Underrated Baileys Fork',
              previewType: 0,
              jpegThumbnail: fs.readFileSync('./si.jpg'),
              highQualityThumbnail: image,
              linkPreviewMetadata: {
                 linkMediaDuration: 0, // --- Duration in seconds (for video/audio content)
                 socialMediaPostType: 1, // --- Enum: 0 = NONE, 1 = REEL, 2 = LIVE_VIDEO, 3 = LONG_VIDEO, 4 = SINGLE_IMAGE, 5 = CAROUSEL
              } // --- Additional metadata for large link preview
           },
           favicon: {
              url: './Game.ico'
           }
        })

      }


      if (text === 'Js') {
const language = 'javascript'
const code = 'console.log("Hello, World!")'

sock.sendMessage(jid, {
   disclaimerText: 'Example of tokenizing Code Block',
   richResponse: [{
      text: 'Example Usage',
   }, {
      language,
      code: tokenizeCode(code, language)
   }, {
      text: 'Pretty simple, right?'
   }]
})
      }

      if (text === 'Table') {
        sock.sendMessage(jid, {
   disclaimerText: 'Table',
   headerText: '## Comparison between Node.js, Bun, and Deno',
   contentText: '---',
   title: 'Runtime Comparison',
   table: [
      ['', 'Node.js', 'Bun', 'Deno'],
      ['Engine', 'V8 (C++)', 'JavaScriptCore (C++)', 'V8 (C++)'],
      ['Performance', '4/5', '5/5', '4/5']
   ],
   noHeading: false, // --- Optional
   footerText: 'Does this help clarify the differences?'
})
      }

    }
   })

}

connectToWhatsApp()