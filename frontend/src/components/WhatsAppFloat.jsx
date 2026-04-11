const WhatsAppFloat = ({
  phoneNumber = '9336124550',
  shopName = '',
  visible = true,
}) => {
  if (!visible) return null;

  const number = String(phoneNumber).replace(/\D/g, '').slice(-10);
  const intro = shopName
    ? `Hi! I found you on Pro Fix (${shopName}) and would like to book / ask about a service.`
    : 'Hi! I found your business on Pro Fix and would like to get help with a service.';
  const message = encodeURIComponent(`${intro}\n\nPlease let me know your availability. Thanks!`);

  return (
    <a
      href={`https://wa.me/91${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="32" height="32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.824-6.8-8.062-7.114-.228-.314-1.924-2.562-1.924-4.886s1.218-3.468 1.65-3.942c.432-.474.946-.592 1.26-.592.314 0 .628.002.902.016.29.014.678-.11.96.732.29.866 1.46 3.556 1.586 3.812.128.258.214.556.044.89-.17.342-.256.554-.512.854-.256.3-.538.67-.768.898-.256.258-.522.538-.224 1.056.298 1.048 1.722 2.254 2.79 1.546 1.372 2.848 1.798 3.252 1.994.404.196.638.166.872-.1.234-.266 1-.168 1.272-1.488.272-.32.542-.264.912-.158.372.106 2.35 1.108 2.754 1.31.404.2.672.3.77.466.1.166.1.964-.288 2.062z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
