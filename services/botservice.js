import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


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