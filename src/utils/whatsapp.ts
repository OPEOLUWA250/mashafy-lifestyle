import type { CartItem } from "./supabase";

const WHATSAPP_NUMBER = "2348027842294"; // Mashafy WhatsApp number

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export const generateWhatsAppMessage = (
  cartItems: CartItem[],
  finalTotal: number,
  customerDetails?: CustomerDetails,
): string => {
  let message = "🎉 *Mashafy Lifestyle Order*\n\n";

  if (customerDetails) {
    message += "👤 *Customer Details:*\n";
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Address: ${customerDetails.address}\n\n`;
  }

  message += "📦 *Order Items:*\n";

  cartItems.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity} | Price: ₦${item.price.toLocaleString()}`;
    if (item.selectedSize) message += ` | Size: ${item.selectedSize}`;
    if (item.selectedColor) message += ` | Color: ${item.selectedColor}`;
    message += "\n";
  });

  message += `\n💰 *Total: ₦${finalTotal.toLocaleString()}*\n\n`;
  message += "Thank you for your order! We'll process it shortly.";

  return encodeURIComponent(message);
};

export const openWhatsAppCheckout = (
  cartItems: CartItem[],
  finalTotal: number,
  customerDetails?: CustomerDetails,
): void => {
  const message = generateWhatsAppMessage(
    cartItems,
    finalTotal,
    customerDetails,
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number to international format
  return phone.replace(/\D/g, "").replace(/^(\d{10})$/, "234$1");
};
