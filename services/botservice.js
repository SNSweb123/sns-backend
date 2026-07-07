import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


// SEND NEW ORDER MESSAGE
export const sendTelegramMessage = async (
  message,
  orderId
) => {

  try {

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {

        chat_id: CHAT_ID,

        text: message,

        parse_mode:"HTML",

        reply_markup: {

          inline_keyboard:[
            [
              {
                text:"✅ Accept",
                callback_data:`approve_${orderId}`
              },

              {
                text:"❌ Reject",
                callback_data:`reject_${orderId}`
              }
            ]
          ]

        }

      }
    );


    console.log(
      "Telegram message sent"
    );


  } catch(error){

    console.log(
      "Telegram Error:",
      error.response?.data || error.message
    );

  }

};



// ✅ ADD THIS NEW FUNCTION BELOW
export const updateTelegramMessage = async (
  chatId,
  messageId,
  text
) => {

  try {

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
      {

        chat_id: chatId,

        message_id: messageId,

        text: text,

        parse_mode:"HTML"

      }
    );


    console.log(
      "Telegram message updated"
    );


  } catch(error){

    console.log(
      "Telegram Update Error:",
      error.response?.data || error.message
    );

  }

};