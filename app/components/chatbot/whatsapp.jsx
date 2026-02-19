import ChatBotWrapper from "./ChatBotWrapper";

export default function WhatsAppBot({ sitedata, services, isDark = false }) {
  return (
    <ChatBotWrapper sitedata={sitedata} services={services} isDark={isDark} />
  );
}
