const TELEGRAM_BOT_TOKEN = "8528627672:AAH4j7NSPAsB_88ovJhmSCnDxUMsqqSj7aE";
const TELEGRAM_CHAT_ID = "1058844240";

interface OrderItem {
  name: string;
  volume: string;
  quantity: number;
  price: number;
}

interface OrderData {
  name: string;
  phone: string;
  email: string;
  inn?: string;
  city?: string;
  address?: string;
  deliveryType?: "pickup" | "delivery";
  comment?: string;
  items: OrderItem[];
  totalPrice: number;
}

export async function sendTelegramNotification(order: OrderData): Promise<boolean> {
  const deliveryText = order.deliveryType === "pickup" 
    ? "🏪 Самовывоз" 
    : order.deliveryType === "delivery" 
      ? "🚚 Доставка" 
      : "Не указан";

  const itemsList = order.items
    .map((item, index) => `   ${index + 1}. ${item.name} (${item.volume}) × ${item.quantity} шт. = ${(item.price * item.quantity).toLocaleString()} ₽`)
    .join("\n");

  const message = `
🛒 *НОВЫЙ ЗАКАЗ*

👤 *Контактные данные:*
• Имя: ${order.name}
• Телефон: ${order.phone}
• Email: ${order.email}
${order.inn ? `• ИНН: ${order.inn}` : ""}

📍 *Доставка:*
• Способ: ${deliveryText}
${order.city ? `• Город: ${order.city}` : ""}
${order.address ? `• Адрес: ${order.address}` : ""}

📦 *Товары:*
${itemsList}

💰 *Итого: ${order.totalPrice.toLocaleString()} ₽*

${order.comment ? `💬 *Комментарий:*\n${order.comment}` : ""}
`.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      console.error("Telegram API error:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}
