const RN = typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'ios-phone';
const post = (n, d = {}) => fetch(`https://${RN}/${n}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(r => r.json()).catch(() => ({}));
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Number(n || 0).toLocaleString('en-US');
const ago = ts => { const s = Math.floor(Date.now() / 1000 - ts); if (s < 60) return t('now'); if (s < 3600) return Math.floor(s / 60) + t('m'); if (s < 86400) return Math.floor(s / 3600) + t('h'); return Math.floor(s / 86400) + t('d') };

const DEF = { wallpaper: 'wallpapers/w8.svg', bluetooth: false, wifi: true, airplane: false, flashlight: false, mobiledata: true, nfc: false, location: true, autorotate: true, ringtone: 'samsung', vibration: true, theme: 'light', brightness: 100, volume: 70, soundMode: 'sound', language: 'en', ytRegion: 'US' };
const st = { me: {}, settings: { ...DEF }, walls: [], tones: ['samsung'], thread: null, msgs: [], redraw: null, io: null, ct: null, audio: null,
  mus: { list: [], idx: -1, cur: null, playing: false }, inCall: false, isBig: false, wi: null };

/* ---------- Languages (add a new one: push to LANGS + add a TR entry + allow it in server LANGS) ---------- */
const LANGS = [
  { id: 'en', n: 'English' }, { id: 'ar', n: 'العربية' }, { id: 'fr', n: 'Français' },
  { id: 'es', n: 'Español' }, { id: 'tr', n: 'Türkçe' },
];
const TR = {
  ar: {
    'Messages': 'الرسائل', 'Maps': 'الخرائط', 'Explore': 'استكشاف', 'You': 'أنت', 'Contribute': 'مساهمة', 'Business': 'نشاطي', 'Search here': 'ابحث هنا', 'Directions': 'الاتجاهات', 'GPS set': 'تم تعيين GPS', 'Your location': 'موقعك', 'Recent': 'الأخيرة', 'Saved': 'محفوظ', 'Home': 'المنزل', 'Work': 'العمل', 'Set as Home': 'تعيين كمنزل', 'Set as Work': 'تعيين كعمل', 'Clear GPS': 'مسح GPS', 'Nearby': 'قريب', 'Categories': 'الفئات', 'Gas stations': 'محطات وقود', 'Restaurants': 'مطاعم', 'Hotels': 'فنادق', 'Hospitals': 'مستشفيات', 'Police': 'شرطة', 'Airports': 'مطارات', 'See all': 'عرض الكل', 'Your recent places': 'أماكنك الأخيرة', 'No places yet.': 'لا أماكن بعد.', 'Local vibe': 'أجواء محلية', 'WhatsNow': 'واتس ناو', 'Chats': 'المحادثات', 'Updates': 'التحديثات', 'Communities': 'المجتمعات', 'Calls': 'المكالمات', 'Recent': 'الأخيرة', 'Start chat': 'بدء محادثة', 'Type a message': 'اكتب رسالة', 'Online': 'متصل', 'Ask Meta AI or Search': 'ابحث…', 'Start your community': 'ابدأ مجتمعك', 'Stay connected with a community': 'ابقَ على اتصال بالمجتمع', 'No chats yet.': 'لا محادثات بعد.', 'New chat': 'محادثة جديدة', 'Phone': 'الهاتف', 'Bank': 'البنك', 'Garage': 'المرآب', 'Trendy': 'ترندي', 'Inpic': 'إنبيك',
    'Calculator': 'الآلة الحاسبة', 'Services': 'الخدمات', 'Settings': 'الإعدادات',
    'No conversations yet.': 'لا توجد محادثات بعد.', 'New message': 'رسالة جديدة', 'Phone number': 'رقم الهاتف', 'Next': 'التالي',
    'Enter a number first': 'أدخل رقماً أولاً', 'iMessage': 'رسالة', 'Text message': 'رسالة نصية', 'To': 'إلى', 'Search': 'بحث', 'Type a message first': 'اكتب رسالة أولاً', 'Failed': 'فشل',
    'Keypad': 'لوحة الأرقام', 'Contacts': 'جهات الاتصال', 'No contacts yet.': 'لا توجد جهات اتصال بعد.', 'New contact': 'جهة اتصال جديدة',
    'Name': 'الاسم', 'Save': 'حفظ', 'Enter name and number': 'أدخل الاسم والرقم', 'Calling…': 'جارٍ الاتصال…', 'Incoming call…': 'مكالمة واردة…',
    'Call failed': 'فشلت المكالمة', 'Call ended': 'انتهت المكالمة', 'Balance': 'الرصيد', 'Amount': 'المبلغ', 'Transfer': 'تحويل', 'Recent': 'الأخيرة',
    'No transactions.': 'لا توجد معاملات.', 'Enter number and amount': 'أدخل الرقم والمبلغ', 'Transfer sent': 'تم التحويل',
    'Out': 'خارج', 'Garaged': 'في المرآب', 'Impound': 'محجوزة', 'No vehicles.': 'لا توجد مركبات.', 'Show on map': 'عرض على الخريطة',
    'Bring vehicle': 'إحضار المركبة', 'Garage marked on map': 'تم تحديد المرآب على الخريطة', 'Vehicle marked on map': 'تم تحديد المركبة على الخريطة',
    'Vehicle not found': 'المركبة غير موجودة', 'Your vehicle is on its way': 'مركبتك في الطريق',
    'This vehicle is impounded. Pick it up at the impound lot.': 'هذه المركبة محجوزة. استلمها من الحجز.',
    'This vehicle is out. Mark it on the map to find it.': 'هذه المركبة في الخارج. حدّدها على الخريطة لتجدها.',
    'Fuel': 'الوقود', 'Engine': 'المحرك', 'Body': 'الهيكل', 'Image or video URL (https://…)': 'رابط صورة أو فيديو (https://…)',
    'Caption': 'التعليق', 'Post': 'نشر', 'New post': 'منشور جديد', 'Enter a valid URL': 'أدخل رابطاً صحيحاً',
    'No videos yet. Post one with +': 'لا توجد فيديوهات بعد. انشر واحداً بزر +', 'No posts yet.': 'لا توجد منشورات بعد.',
    'Request': 'طلب', 'Request sent': 'تم إرسال الطلب', 'No services available.': 'لا توجد خدمات متاحة.', 'on duty': 'في الخدمة',
    'Wallpaper': 'الخلفية', 'Bluetooth': 'بلوتوث', 'Custom image URL (https://…)': 'رابط صورة مخصصة (https://…)', 'Apply': 'تطبيق',
    'Message from ': 'رسالة من ', 'now': 'الآن', 'm': 'د', 'h': 'س', 'd': 'ي',
    'Sound & Vibration': 'الصوت والاهتزاز', 'Display': 'العرض', 'Language': 'اللغة', 'Ringtone': 'نغمة الرنين', 'Vibration': 'الاهتزاز',
    'Theme': 'المظهر', 'Light': 'فاتح', 'Dark': 'داكن', 'Brightness': 'السطوع',
    'rt_opening': 'افتتاحية', 'rt_chimes': 'أجراس', 'rt_radar': 'رادار', 'rt_beacon': 'منارة', 'rt_bell': 'جرس', 'rt_pulse': 'نبض',
  },
  fr: {
    'Phone': 'Téléphone', 'Bank': 'Banque', 'Calculator': 'Calculatrice', 'Settings': 'Réglages',
    'No conversations yet.': 'Aucune conversation.', 'New message': 'Nouveau message', 'Phone number': 'Numéro de téléphone', 'Next': 'Suivant',
    'Enter a number first': "Saisissez d'abord un numéro", 'iMessage': 'Message', 'Text message': 'Message texte', 'To': 'À', 'Search': 'Rechercher', 'Type a message first': "Écrivez d'abord un message", 'Failed': 'Échec',
    'Keypad': 'Clavier', 'No contacts yet.': 'Aucun contact.', 'New contact': 'Nouveau contact',
    'Name': 'Nom', 'Save': 'Enregistrer', 'Enter name and number': 'Saisissez nom et numéro', 'Calling…': 'Appel en cours…', 'Incoming call…': 'Appel entrant…',
    'Call failed': "L'appel a échoué", 'Call ended': 'Appel terminé', 'Balance': 'Solde', 'Amount': 'Montant', 'Transfer': 'Virement', 'Recent': 'Récents',
    'No transactions.': 'Aucune transaction.', 'Enter number and amount': 'Saisissez numéro et montant', 'Transfer sent': 'Virement envoyé',
    'Out': 'Dehors', 'Garaged': 'Au garage', 'Impound': 'Fourrière', 'No vehicles.': 'Aucun véhicule.', 'Show on map': 'Afficher sur la carte',
    'Bring vehicle': 'Appeler le véhicule', 'Garage marked on map': 'Garage marqué sur la carte', 'Vehicle marked on map': 'Véhicule marqué sur la carte',
    'Vehicle not found': 'Véhicule introuvable', 'Your vehicle is on its way': 'Votre véhicule arrive',
    'This vehicle is impounded. Pick it up at the impound lot.': 'Ce véhicule est à la fourrière. Récupérez-le là-bas.',
    'This vehicle is out. Mark it on the map to find it.': 'Ce véhicule est dehors. Marquez-le sur la carte pour le trouver.',
    'Fuel': 'Carburant', 'Engine': 'Moteur', 'Body': 'Carrosserie', 'Image or video URL (https://…)': "URL d'image ou de vidéo (https://…)",
    'Caption': 'Légende', 'Post': 'Publier', 'New post': 'Nouvelle publication', 'Enter a valid URL': 'Saisissez une URL valide',
    'No videos yet. Post one with +': 'Aucune vidéo. Publiez-en une avec +', 'No posts yet.': 'Aucune publication.',
    'Request': 'Demander', 'Request sent': 'Demande envoyée', 'No services available.': 'Aucun service disponible.', 'on duty': 'en service',
    'Wallpaper': "Fond d'écran", 'Custom image URL (https://…)': "URL d'image personnalisée (https://…)", 'Apply': 'Appliquer',
    'Message from ': 'Message de ', 'now': 'now', 'm': 'min', 'h': 'h', 'd': 'j',
    'Sound & Vibration': 'Sons et vibrations', 'Display': 'Affichage', 'Language': 'Langue', 'Ringtone': 'Sonnerie',
    'Theme': 'Thème', 'Light': 'Clair', 'Dark': 'Sombre', 'Brightness': 'Luminosité',
    'rt_opening': 'Ouverture', 'rt_chimes': 'Carillon', 'rt_radar': 'Radar', 'rt_beacon': 'Balise', 'rt_bell': 'Cloche', 'rt_pulse': 'Pulsation',
  },
  es: {
    'Messages': 'Mensajes', 'Phone': 'Teléfono', 'Bank': 'Banco', 'Garage': 'Garaje',
    'Calculator': 'Calculadora', 'Services': 'Servicios', 'Settings': 'Ajustes',
    'No conversations yet.': 'Aún no hay conversaciones.', 'New message': 'Mensaje nuevo', 'Phone number': 'Número de teléfono', 'Next': 'Siguiente',
    'Enter a number first': 'Introduce un número primero', 'iMessage': 'Mensaje', 'Text message': 'Mensaje de texto', 'To': 'Para', 'Search': 'Buscar', 'Type a message first': 'Escribe un mensaje primero', 'Failed': 'Error',
    'Keypad': 'Teclado', 'Contacts': 'Contactos', 'No contacts yet.': 'Aún no hay contactos.', 'New contact': 'Contacto nuevo',
    'Name': 'Nombre', 'Save': 'Guardar', 'Enter name and number': 'Introduce nombre y número', 'Calling…': 'Llamando…', 'Incoming call…': 'Llamada entrante…',
    'Call failed': 'La llamada falló', 'Call ended': 'Llamada finalizada', 'Balance': 'Saldo', 'Amount': 'Importe', 'Transfer': 'Transferir', 'Recent': 'Recientes',
    'No transactions.': 'Sin transacciones.', 'Enter number and amount': 'Introduce número e importe', 'Transfer sent': 'Transferencia enviada',
    'Out': 'Fuera', 'Garaged': 'En garaje', 'Impound': 'Depósito', 'No vehicles.': 'Sin vehículos.', 'Show on map': 'Mostrar en el mapa',
    'Bring vehicle': 'Traer vehículo', 'Garage marked on map': 'Garaje marcado en el mapa', 'Vehicle marked on map': 'Vehículo marcado en el mapa',
    'Vehicle not found': 'Vehículo no encontrado', 'Your vehicle is on its way': 'Tu vehículo está en camino',
    'This vehicle is impounded. Pick it up at the impound lot.': 'Este vehículo está en el depósito. Recógelo allí.',
    'This vehicle is out. Mark it on the map to find it.': 'Este vehículo está fuera. Márcalo en el mapa para encontrarlo.',
    'Fuel': 'Combustible', 'Engine': 'Motor', 'Body': 'Carrocería', 'Image or video URL (https://…)': 'URL de imagen o vídeo (https://…)',
    'Caption': 'Pie de foto', 'Post': 'Publicar', 'New post': 'Nueva publicación', 'Enter a valid URL': 'Introduce una URL válida',
    'No videos yet. Post one with +': 'Aún no hay vídeos. Publica uno con +', 'No posts yet.': 'Aún no hay publicaciones.',
    'Request': 'Solicitar', 'Request sent': 'Solicitud enviada', 'No services available.': 'No hay servicios disponibles.', 'on duty': 'de servicio',
    'Wallpaper': 'Fondo de pantalla', 'Custom image URL (https://…)': 'URL de imagen personalizada (https://…)', 'Apply': 'Aplicar',
    'Message from ': 'Mensaje de ', 'now': 'ahora', 'm': 'min',
    'Sound & Vibration': 'Sonido y vibración', 'Display': 'Pantalla', 'Language': 'Idioma', 'Ringtone': 'Tono de llamada', 'Vibration': 'Vibración',
    'Theme': 'Tema', 'Light': 'Claro', 'Dark': 'Oscuro', 'Brightness': 'Brillo',
    'rt_opening': 'Apertura', 'rt_chimes': 'Campanillas', 'rt_radar': 'Radar', 'rt_beacon': 'Baliza', 'rt_bell': 'Campana', 'rt_pulse': 'Pulso',
  },
  tr: {
    'Messages': 'Mesajlar', 'Phone': 'Telefon', 'Bank': 'Banka', 'Garage': 'Garaj',
    'Calculator': 'Hesap Makinesi', 'Services': 'Hizmetler', 'Settings': 'Ayarlar',
    'No conversations yet.': 'Henüz sohbet yok.', 'New message': 'Yeni mesaj', 'Phone number': 'Telefon numarası', 'Next': 'İleri',
    'Enter a number first': 'Önce bir numara girin', 'iMessage': 'Mesaj', 'Text message': 'Metin mesajı', 'To': 'Kime', 'Search': 'Ara', 'Type a message first': 'Önce bir mesaj yazın', 'Failed': 'Başarısız',
    'Keypad': 'Tuş Takımı', 'Contacts': 'Kişiler', 'No contacts yet.': 'Henüz kişi yok.', 'New contact': 'Yeni kişi',
    'Name': 'Ad', 'Save': 'Kaydet', 'Enter name and number': 'Ad ve numara girin', 'Calling…': 'Aranıyor…', 'Incoming call…': 'Gelen arama…',
    'Call failed': 'Arama başarısız', 'Call ended': 'Arama bitti', 'Balance': 'Bakiye', 'Amount': 'Tutar', 'Transfer': 'Havale', 'Recent': 'Son işlemler',
    'No transactions.': 'İşlem yok.', 'Enter number and amount': 'Numara ve tutar girin', 'Transfer sent': 'Havale gönderildi',
    'Out': 'Dışarıda', 'Garaged': 'Garajda', 'Impound': 'Çekilmiş', 'No vehicles.': 'Araç yok.', 'Show on map': 'Haritada göster',
    'Bring vehicle': 'Aracı getir', 'Garage marked on map': 'Garaj haritada işaretlendi', 'Vehicle marked on map': 'Araç haritada işaretlendi',
    'Vehicle not found': 'Araç bulunamadı', 'Your vehicle is on its way': 'Aracınız yolda',
    'This vehicle is impounded. Pick it up at the impound lot.': 'Bu araç çekilmiş. Otoparktan teslim alın.',
    'This vehicle is out. Mark it on the map to find it.': 'Bu araç dışarıda. Bulmak için haritada işaretleyin.',
    'Fuel': 'Yakıt', 'Engine': 'Motor', 'Body': 'Kaporta', 'Image or video URL (https://…)': 'Resim veya video URL (https://…)',
    'Caption': 'Açıklama', 'Post': 'Paylaş', 'New post': 'Yeni gönderi', 'Enter a valid URL': 'Geçerli bir URL girin',
    'No videos yet. Post one with +': 'Henüz video yok. + ile paylaşın', 'No posts yet.': 'Henüz gönderi yok.',
    'Request': 'İste', 'Request sent': 'İstek gönderildi', 'No services available.': 'Kullanılabilir hizmet yok.', 'on duty': 'görevde',
    'Wallpaper': 'Duvar Kağıdı', 'Custom image URL (https://…)': 'Özel resim URL (https://…)', 'Apply': 'Uygula',
    'Message from ': 'Mesaj: ', 'now': 'şimdi', 'm': 'dk', 'h': 'sa', 'd': 'g',
    'Sound & Vibration': 'Ses ve Titreşim', 'Display': 'Ekran', 'Language': 'Dil', 'Ringtone': 'Zil Sesi', 'Vibration': 'Titreşim',
    'Theme': 'Tema', 'Light': 'Açık', 'Dark': 'Koyu', 'Brightness': 'Parlaklık',
    'rt_opening': 'Açılış', 'rt_chimes': 'Çanlar', 'rt_radar': 'Radar', 'rt_beacon': 'Fener', 'rt_bell': 'Zil', 'rt_pulse': 'Nabız',
  },
};
const RT_EN = { rt_samsung: 'Samsung', rt_remix: 'Remix', rt_galaxy_bells: 'Galaxy Bells', rt_horizon: 'Over the Horizon', rt_s15: 'Galaxy S15', rt_spaceline: 'Spaceline', rt_tune: 'Samsung Tune', rt_wave: 'Wave', rt_opening: 'Opening', rt_chimes: 'Chimes', rt_radar: 'Radar', rt_beacon: 'Beacon', rt_bell: 'Bell', rt_pulse: 'Pulse' };
const t = k => (TR[st.settings.language] && TR[st.settings.language][k]) || RT_EN[k] || k;

const TR_ADD = {
  ar: { 'Music': 'الموسيقى', 'YouTube': 'يوتيوب', 'Camera': 'الكاميرا', 'Photos': 'الصور', 'Weather': 'الطقس', 'Search': 'بحث', 'Now Playing': 'قيد التشغيل', 'No results': 'لا توجد نتائج', 'Loading…': 'جارٍ التحميل…', 'Search failed': 'فشل البحث', 'YouTube API key is not set': 'مفتاح YouTube API غير مضبوط', 'Take photo': 'التقاط صورة', 'Switch camera': 'تبديل الكاميرا', 'Exit': 'خروج', 'No photos yet.': 'لا توجد صور بعد.', 'Now': 'الآن', 'Wind': 'الرياح', 'Rain': 'المطر', 'Cardholder': 'صاحب البطاقة',
    wx_EXTRASUNNY: 'مشمس', wx_CLEAR: 'صافٍ', wx_CLOUDS: 'غائم جزئياً', wx_SMOG: 'ضباب دخاني', wx_FOGGY: 'ضبابي', wx_OVERCAST: 'غائم', wx_RAIN: 'ماطر', wx_THUNDER: 'عاصفة رعدية', wx_CLEARING: 'يتحسن', wx_SNOW: 'ثلوج', wx_BLIZZARD: 'عاصفة ثلجية', wx_SNOWLIGHT: 'ثلوج خفيفة' },
  fr: { 'Music': 'Musique', 'Camera': 'Appareil photo', 'Photos': 'Photos', 'Weather': 'Météo', 'Search': 'Rechercher', 'Now Playing': 'Lecture en cours', 'No results': 'Aucun résultat', 'Loading…': 'Chargement…', 'Search failed': 'Échec de la recherche', 'YouTube API key is not set': "La clé API YouTube n'est pas définie", 'Take photo': 'Prendre une photo', 'Photo saved': 'Photo enregistrée', 'Photo': 'Photo', 'Switch camera': "Changer d'appareil", 'Exit': 'Quitter', 'No photos yet.': 'Aucune photo.', 'Now': 'Maint.', 'Wind': 'Vent', 'Rain': 'Pluie', 'Cardholder': 'Titulaire',
    wx_EXTRASUNNY: 'Ensoleillé', wx_CLEAR: 'Dégagé', wx_CLOUDS: 'Nuageux', wx_SMOG: 'Smog', wx_FOGGY: 'Brouillard', wx_OVERCAST: 'Couvert', wx_RAIN: 'Pluie', wx_THUNDER: 'Orage', wx_CLEARING: 'Éclaircies', wx_SNOW: 'Neige', wx_BLIZZARD: 'Blizzard', wx_SNOWLIGHT: 'Neige légère' },
  es: { 'Music': 'Música', 'Camera': 'Cámara', 'Photos': 'Fotos', 'Weather': 'Clima', 'Search': 'Buscar', 'Now Playing': 'Reproduciendo', 'No results': 'Sin resultados', 'Loading…': 'Cargando…', 'Search failed': 'Falló la búsqueda', 'YouTube API key is not set': 'Falta la clave de la API de YouTube', 'Take photo': 'Tomar foto', 'Photo saved': 'Foto guardada', 'Photo': 'Foto', 'Switch camera': 'Cambiar cámara', 'Exit': 'Salir', 'No photos yet.': 'Aún no hay fotos.', 'Now': 'Ahora', 'Wind': 'Viento', 'Rain': 'Lluvia', 'Cardholder': 'Titular',
    wx_EXTRASUNNY: 'Soleado', wx_CLEAR: 'Despejado', wx_CLOUDS: 'Nublado', wx_SMOG: 'Smog', wx_FOGGY: 'Niebla', wx_OVERCAST: 'Cubierto', wx_RAIN: 'Lluvia', wx_THUNDER: 'Tormenta', wx_CLEARING: 'Mejorando', wx_SNOW: 'Nieve', wx_BLIZZARD: 'Ventisca', wx_SNOWLIGHT: 'Nieve ligera' },
  tr: { 'Music': 'Müzik', 'Camera': 'Kamera', 'Photos': 'Fotoğraflar', 'Weather': 'Hava Durumu', 'Search': 'Ara', 'Now Playing': 'Çalıyor', 'No results': 'Sonuç yok', 'Loading…': 'Yükleniyor…', 'Search failed': 'Arama başarısız', 'YouTube API key is not set': 'YouTube API anahtarı ayarlı değil', 'Take photo': 'Fotoğraf çek', 'Photo saved': 'Fotoğraf kaydedildi', 'Photo': 'Fotoğraf', 'Switch camera': 'Kamerayı değiştir', 'Exit': 'Çıkış', 'No photos yet.': 'Henüz fotoğraf yok.', 'Now': 'Şimdi', 'Wind': 'Rüzgar', 'Rain': 'Yağmur', 'Cardholder': 'Kart sahibi',
    wx_EXTRASUNNY: 'Güneşli', wx_CLEAR: 'Açık', wx_CLOUDS: 'Bulutlu', wx_SMOG: 'Smog', wx_FOGGY: 'Sisli', wx_OVERCAST: 'Kapalı', wx_RAIN: 'Yağmurlu', wx_THUNDER: 'Gök gürültülü', wx_CLEARING: 'Açılıyor', wx_SNOW: 'Karlı', wx_BLIZZARD: 'Kar fırtınası', wx_SNOWLIGHT: 'Hafif kar' },
};
Object.keys(TR_ADD).forEach(l => Object.assign(TR[l], TR_ADD[l]));
Object.assign(RT_EN, { wx_EXTRASUNNY: 'Sunny', wx_CLEAR: 'Clear', wx_CLOUDS: 'Cloudy', wx_SMOG: 'Smog', wx_FOGGY: 'Foggy', wx_OVERCAST: 'Overcast', wx_RAIN: 'Rain', wx_THUNDER: 'Thunderstorm', wx_CLEARING: 'Clearing', wx_SNOW: 'Snow', wx_BLIZZARD: 'Blizzard', wx_SNOWLIGHT: 'Light snow' });

Object.assign(TR.ar, { 'Deposit': 'إيداع', 'Swap': 'تبديل', 'More': 'المزيد', 'Send money, receive cash': 'أرسل أموالاً واستلم نقداً', '0 fees on your first transfer': '0 رسوم على أول تحويل', 'Credit': 'الائتمان', 'Available credit': 'الائتمان المتاح', 'Outstanding balance': 'الرصيد المستحق', 'Risk score': 'درجة المخاطر', 'Safe': 'آمن', 'Home': 'الرئيسية', 'Card': 'البطاقة', 'Send': 'إرسال', 'Assets': 'الأصول', 'Coming soon': 'قريباً', 'Search YouTube': 'ابحث في يوتيوب', 'Choose YouTube region': 'اختر بلد يوتيوب', 'Contact saved': 'تم حفظ جهة الاتصال', 'Region': 'البلد', 'contacts': 'جهة اتصال', 'My profile': 'ملفي الشخصي', 'Groups': 'المجموعات', 'Call': 'اتصال', 'Message': 'رسالة', 'Clear call log': 'مسح سجل المكالمات', 'Recents': 'الأخيرة', 'Settings': 'الإعدادات', 'Today': 'اليوم', 'Yesterday': 'أمس', 'Pictures': 'الصور', 'Albums': 'الألبومات', 'Stories': 'القصص', 'Menu': 'القائمة', 'Essential albums': 'الألبومات الأساسية', 'View all': 'عرض الكل', 'Recent': 'الأحدث', 'Favourites': 'المفضلة', 'Camera': 'الكاميرا', 'Customise the Albums tab': 'تخصيص تبويب الألبومات', 'Select a few essential albums to show, show them all, or something in between. It\'s up to you.': 'اختر بعض الألبومات الأساسية لعرضها، أو اعرضها كلها. القرار لك.', 'Not now': 'ليس الآن', 'Select essential albums': 'اختيار الألبومات الأساسية', 'No stories': 'لا توجد قصص', 'Experience your adventures again in curated collections automatically made from your pictures and videos.': 'عِش مغامراتك من جديد في مجموعات منسقة تلقائياً من صورك وفيديوهاتك.', 'Videos': 'الفيديوهات', 'Locations': 'المواقع', 'Shared albums': 'الألبومات المشتركة', 'Recycle bin': 'سلة المحذوفات', 'Select': 'تحديد', 'selected': 'محدد', 'Empty': 'إفراغ', 'Subscriptions': 'الاشتراكات', 'You': 'أنت', 'Expires': 'تنتهي', 'Frozen': 'مجمّدة', 'Freeze': 'تجميد', 'Unfreeze': 'إلغاء التجميد', 'Details': 'التفاصيل', 'Limits': 'الحدود', 'Card number': 'رقم البطاقة', 'Cancel': 'إلغاء' });

const APPS = [
  { id: 'messages', n: 'Messages', i: 'messages' }, { id: 'phone', n: 'Phone', i: 'phone' },
  { id: 'whatsnow', n: 'WhatsNow', i: 'whatsnow' },
  { id: 'bank', n: 'Bank', i: 'bank' }, { id: 'garage', n: 'Garage', i: 'garage' },
  { id: 'trendy', n: 'Trendy', i: 'trendy' }, { id: 'inpic', n: 'Inpic', i: 'inpic' },
  { id: 'calc', n: 'Calculator', i: 'calculator' }, { id: 'services', n: 'Services', i: 'services' },
  { id: 'music', n: 'Music', i: 'music' }, { id: 'youtube', n: 'YouTube', i: 'youtube' }, { id: 'gemini', n: 'Gemini', i: 'gemini' },
  { id: 'browser', n: 'Browser', i: 'browser' }, { id: 'camera', n: 'Camera', i: 'camera' }, { id: 'photos', n: 'Photos', i: 'photos' },
  { id: 'weather', n: 'Weather', i: 'weather' }, { id: 'clock', n: 'Clock', i: 'clock' }, { id: 'maps', n: 'Maps', i: 'maps' },
  { id: 'radio', n: 'Radio', i: 'radio' }, { id: 'yasir', n: 'Yasir', i: 'yasir' },
  { id: 'settings', n: 'Settings', i: 'settings' },
];
/* Samsung home page icons (row above search) + dock */
const HOME_PAGE = ['bank', 'photos', 'youtube', 'inpic'];
const DOCK = ['phone', 'whatsnow', 'maps', 'camera'];

let tt;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200) }

function appIcon(a) {
  if (!a) return '';
  return `<div class="ap" data-id="${a.id}"><img src="icons/${a.i}.svg?v=2" alt=""><span>${esc(t(a.n))}</span></div>`;
}
function bindAppClicks(root) {
  (root || document).querySelectorAll('.ap[data-id]').forEach(e => {
    e.onclick = (ev) => { ev.stopPropagation(); closeDrawer(); openApp(e.dataset.id); };
  });
}
function renderHome() {
  const hi = $('#home-icons');
  if (hi) hi.innerHTML = HOME_PAGE.map(id => appIcon(APPS.find(a => a.id === id))).join('');
  const dock = $('#dock');
  if (dock) dock.innerHTML = DOCK.map(id => appIcon(APPS.find(a => a.id === id))).join('');
  const dr = $('#dr-grid');
  if (dr) dr.innerHTML = APPS.map(appIcon).join('');
  bindAppClicks(document);
  refreshWxWidget();
}
async function refreshWxWidget() {
  try {
    const w = await post('getWeather');
    if (!w || !w.type) return;
    const h = new Date().getHours();
    const tp = temp(w.type, h);
    const hi = Math.min(tp + 3, 42), lo = Math.max(tp - 6, -5);
    const el = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
    el('wxtemp', tp + '°');
    el('wxcond', t((COND[w.type] || COND.CLEAR)[1]) || w.type);
    el('wxhl', '↑' + hi + '° / ↓' + lo + '°');
    el('wxloc', st.wxLoc || w.zone || 'Los Santos');
    const ico = document.getElementById('wxico');
    if (ico) ico.innerHTML = icon(w.type, h, 28);
    const li = document.getElementById('lkwxi'); if (li) li.innerHTML = icon(w.type, h, 18);
    el('lkwxt', tp + '°');
  } catch (_) {}
}

/* Lock / Home / Drawer */
st.locked = true;
st.recents = st.recents || [];
function showLock() {
  st.locked = true;
  closePin();
  closeDrawer();
  $('#lock')?.classList.remove('hidden');
  $('#home')?.classList.add('hidden');
  $('#app')?.classList.add('hidden');
  updateLockClock();
}
function unlockPhone(force) {
  if (!force && st.locked) {
    if (!st.ready) return false;                 // settings (PIN) not loaded yet: stay locked
    if (st.hasPin) { showPinUnlock(); return false }
  }
  if (st.locked) st.lastUnlock = Date.now();
  st.locked = false;
  $('#lock')?.classList.add('hidden');
  $('#home')?.classList.remove('hidden');
  renderHome();
  return true;
}
function openDrawer() {
  if (st.locked) return;
  const d = $('#drawer');
  if (!d) return;
  d.classList.remove('hidden');
  requestAnimationFrame(() => d.classList.add('open'));
  const q = $('#drq'); if (q) { q.value = ''; filterDrawer(''); }
}
function closeDrawer() {
  const d = $('#drawer');
  if (!d) return;
  d.classList.remove('open');
  setTimeout(() => d.classList.add('hidden'), 280);
}
function closeRecents() {
  const r = $('#recents');
  if (!r) return;
  r.classList.remove('open');
  setTimeout(() => { if (!r.classList.contains('open')) r.classList.add('hidden'); }, 250);
}
function openRecents() {
  if (st.locked) return;
  closeDrawer();
  const list = (st.recents || []).filter(x => APPS.some(a => a.id === x));
  const cards = $('#rc-cards');
  const icons = $('#rc-icons');
  if (!list.length) {
    if (cards) cards.innerHTML = `<div class="rc-empty">${t('No recent apps') || 'No recent apps'}</div>`;
    if (icons) icons.innerHTML = '';
  } else {
    // Main card = most recent
    const top = list[0];
    const app = APPS.find(a => a.id === top);
    if (cards && app) {
      cards.innerHTML = `<div class="rc-card" data-id="${app.id}">
        <div class="rc-card-top">
          <img src="icons/${app.i}.svg?v=2" alt="">
          <b>${esc(t(app.n))}</b>
          <button type="button" class="rc-x" data-close="${app.id}">✕</button>
        </div>
        <div class="rc-card-body">
          <img class="rc-preview" src="icons/${app.i}.svg?v=2" alt="">
          <span class="rc-name">${esc(t(app.n))}</span>
        </div>
      </div>`;
    }
    if (icons) {
      icons.innerHTML = list.map(id => {
        const a = APPS.find(x => x.id === id);
        if (!a) return '';
        return `<button type="button" class="rc-ico" data-id="${a.id}" title="${esc(t(a.n))}"><img src="icons/${a.i}.svg?v=2" alt=""></button>`;
      }).join('');
    }
  }
  const r = $('#recents');
  if (!r) return;
  r.classList.remove('hidden');
  requestAnimationFrame(() => r.classList.add('open'));
  // bind
  r.querySelectorAll('.rc-card[data-id]').forEach(e => e.onclick = (ev) => {
    if (ev.target.closest('.rc-x')) return;
    openApp(e.dataset.id);
  });
  r.querySelectorAll('.rc-x').forEach(btn => btn.onclick = (ev) => {
    ev.stopPropagation();
    const id = btn.dataset.close;
    st.recents = (st.recents || []).filter(x => x !== id);
    openRecents();
  });
  r.querySelectorAll('.rc-ico').forEach(btn => btn.onclick = () => openApp(btn.dataset.id));
  const ca = $('#rc-closeall');
  if (ca) ca.onclick = () => {
    st.recents = [];
    closeRecents();
    $('#app')?.classList.add('hidden');
    if (!st.locked) { $('#home')?.classList.remove('hidden'); renderHome(); }
  };
}
function filterDrawer(q) {
  q = (q || '').toLowerCase();
  document.querySelectorAll('#dr-grid .ap').forEach(e => {
    const name = (e.querySelector('span')?.textContent || '').toLowerCase();
    e.style.display = !q || name.includes(q) ? '' : 'none';
  });
}

/* ===== Samsung Quick Settings ===== */
const QS_ICO = {
  wifi: (on) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 18.5a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z" fill="currentColor"/><path d="M8.6 14.3a5 5 0 0 1 6.8 0M5.5 11.2a9 9 0 0 1 13 0M2.8 8.2a13 13 0 0 1 18.4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bt: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10-5 5V2l5 5L7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  plane: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l2 7h7l-5.5 4 2 7L12 17l-5.5 4 2-7L3 10h7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  flash: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" fill="currentColor"/></svg>`,
  data: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  nfc: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 9h6v6H9z" stroke="currentColor" stroke-width="1.5"/></svg>`,
  battery: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M18 10v4M9 10v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  pin: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/></svg>`,
  rotate: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18 2v5h-5M6 22v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sun: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#ff9f0a"/><g stroke="#ff9f0a" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></g></svg>`,
  moon: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 4a9 9 0 1 0 6 14 7 7 0 1 1-6-14z" fill="currentColor"/></svg>`,
  note: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18V6l10-2v12" stroke="currentColor" stroke-width="1.8"/><circle cx="7" cy="18" r="2.5" fill="currentColor"/><circle cx="17" cy="16" r="2.5" fill="currentColor"/></svg>`,
  speaker: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  modes: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 12V5a7 7 0 0 1 7 7H12z" fill="currentColor"/></svg>`,
  smart: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="6" cy="8" r="2" fill="currentColor"/><circle cx="18" cy="8" r="2" fill="currentColor"/><circle cx="6" cy="16" r="2" fill="currentColor"/><circle cx="18" cy="16" r="2" fill="currentColor"/><path d="M12 12L6 8M12 12l6-4M12 12l-6 4M12 12l6 4" stroke="currentColor" stroke-width="1.2"/></svg>`,
};

Object.assign(TR.ar, { 'Live notifications': 'الإشعارات المباشرة', 'Notification settings': 'إعدادات الإشعارات', 'Notifications': 'الإشعارات', 'Clear': 'مسح', 'Phone speaker': 'سماعة الهاتف', 'Media output': 'مخرج الوسائط', 'Play last song': 'تشغيل آخر أغنية' });
Object.assign(TR.fr, { 'Live notifications': 'Notifications en direct', 'Notification settings': 'Paramètres des notifications', 'Notifications': 'Notifications', 'Clear': 'Effacer', 'Phone speaker': 'Haut-parleur du téléphone', 'Media output': 'Sortie média', 'Play last song': 'Lire le dernier titre' });
/* Samsung media card (Quick Settings + notification shade) */
const mc2 = n => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(Math.floor(n % 60)).padStart(2, '0');
const MCI = {
  cast: '<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 5.4a9.4 9.4 0 0 1 0 13.2"/>',
  check: '<path d="M7 12.5l3.2 3.2L17 8.8"/>',
  rep: '<path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4"/>',
};
function mediaCard(out) {
  const c = st.mus.cur;
  if (!c) return `<div class="mcard empty"><button type="button" class="mc-last" data-a="open"><span>▶</span> ${esc(t('Play last song'))}</button>${out ? `<button type="button" class="mc-out" data-a="out">${esc(t('Media output'))}</button>` : ''}</div>`;
  const liked = st.mus.liked && st.mus.liked[c.id];
  return `<div class="mcard" data-a="open"><div class="mc-bg" style="background-image:url('${esc(c.thumb)}')"></div><div class="mc-shade"></div>
    <div class="mc-in">
      <div class="mc-src">${I(IP.note, 15)}<span>${esc(t('Phone speaker'))}</span>${out ? `<button type="button" class="mc-out" data-a="out">${esc(t('Media output'))}</button>` : ''}</div>
      <b class="mc-t" dir="auto">${esc(c.title)}</b><small class="mc-a" dir="auto">${esc(c.channel || '')}</small>
      <div class="mc-bar" data-a="seek"><i></i></div>
      <div class="mc-tm"><span class="mc-cur">00:00</span><span class="mc-dur">00:00</span></div>
      <div class="mc-ctl">
        <button type="button" data-a="cast">${I(MCI.cast, 24)}</button>
        <button type="button" data-a="like" class="mc-like ${liked ? 'on' : ''}">${I(MCI.check, 18)}</button>
        <button type="button" data-a="pp" class="ppb">${ppIcon(st.mus.playing, 28)}</button>
        <button type="button" data-a="nx">${I(IP.next, 26)}</button>
        <button type="button" data-a="rep" class="${st.mus.rep ? 'on' : ''}">${I(MCI.rep, 24)}</button>
      </div></div></div>`;
}
function qsMedia() {
  const q = $('#qs-mcard'); if (q) q.innerHTML = mediaCard(true);
  const n = $('#nt-media'); if (n) n.innerHTML = mediaCard(false);
  const sec = $('#nt-sec-live'); if (sec) sec.classList.toggle('hidden', !st.mus.cur);
  mediaTick();
}
function mediaTick() {
  if (!st.mus.cur || !yt.ready || !yt.p || !yt.p.getDuration) return;
  const d = yt.p.getDuration() || 0, c = yt.p.getCurrentTime() || 0;
  document.querySelectorAll('.mcard .mc-bar i').forEach(e => e.style.width = (d ? (c / d) * 100 : 0) + '%');
  document.querySelectorAll('.mcard .mc-cur').forEach(e => e.textContent = mc2(c));
  document.querySelectorAll('.mcard .mc-dur').forEach(e => e.textContent = mc2(d));
}
setInterval(() => { if ($('#qspanel')?.classList.contains('open') || $('#ntpanel')?.classList.contains('open')) mediaTick() }, 500);
document.addEventListener('click', e => {
  const card = e.target.closest('.mcard'); if (!card) return;
  const a = e.target.closest('[data-a]')?.dataset.a;
  e.stopPropagation();
  if (a === 'pp') { musToggle(); return; }
  if (a === 'nx') { musStep(1); return; }
  if (a === 'rep') { st.mus.rep = !st.mus.rep; qsMedia(); return; }
  if (a === 'like') { const c = st.mus.cur; if (c) { st.mus.liked = st.mus.liked || {}; st.mus.liked[c.id] = !st.mus.liked[c.id]; qsMedia() } return; }
  if (a === 'out' || a === 'cast') { toast(t('Media output')); return; }
  if (a === 'seek') {
    const r = e.target.closest('.mc-bar').getBoundingClientRect();
    if (yt.p && yt.ready && yt.p.getDuration) yt.p.seekTo(yt.p.getDuration() * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), true);
    mediaTick(); return;
  }
  closeQS(); closeShade(); openApp('music'); if (st.mus.cur) player();
}, true);

/* Samsung notification shade (swipe down once) */
st.notifs = st.notifs || [];
function closeShade() {
  const p = $('#ntpanel'); if (!p) return;
  p.classList.remove('open');
  setTimeout(() => { if (!p.classList.contains('open')) p.classList.add('hidden') }, 300);
}
function drawShade() {
  const d = new Date();
  $('#nt-time').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  $('#nt-date').textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  $('#nt-sec-live').firstChild.textContent = t('Live notifications');
  $('#nt-settings').textContent = t('Notification settings');
  $('#nt-clear').textContent = t('Clear');
  qsMedia();
  const l = st.notifs;
  $('#nt-sec-n').classList.toggle('hidden', !l.length);
  $('#nt-list').innerHTML = l.map((n, i) => `<div class="nt-card" data-i="${i}"><span class="nt-av">${esc((n.name || '#')[0])}</span><div class="nt-tx"><small>${esc(t('Messages'))} · ${ago(n.ts)}</small><b dir="auto">${esc(n.name)}</b><span dir="auto">${esc(n.text)}</span></div></div>`).join('');
  $('#nt-list').querySelectorAll('.nt-card').forEach(e => e.onclick = () => { const n = st.notifs[+e.dataset.i]; st.notifs.splice(+e.dataset.i, 1); closeShade(); if (n) openApp('messages') });
}
function openShade() {
  if (st.locked) return;
  const p = $('#ntpanel'); if (!p) return;
  closeDrawer(); closeRecents();
  if ($('#qspanel')?.classList.contains('open')) closeQS();
  drawShade();
  p.classList.remove('hidden');
  requestAnimationFrame(() => p.classList.add('open'));
  if (!p.dataset.b) {
    p.dataset.b = 1;
    $('#nt-clear').onclick = () => { st.notifs = []; drawShade() };
    $('#nt-settings').onclick = () => { closeShade(); openApp('settings') };
    let y0 = null;
    p.addEventListener('touchstart', e => { y0 = e.touches[0].clientY }, { passive: true });
    p.addEventListener('touchend', e => { if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0; y0 = null; if (dy < -50) closeShade(); else if (dy > 60) { closeShade(); openQS() } }, { passive: true });
    p.addEventListener('mousedown', e => { if (e.target === p || e.target.classList.contains('nt-fill')) y0 = e.clientY });
    p.addEventListener('mouseup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; if (dy < -50) closeShade(); else if (dy > 60) { closeShade(); openQS() } });
  }
}
/* heads-up banner (replaces the old Dynamic Island pop-up) */
let hupT;
function headsUp(html, ms = 4000) {
  let b = $('#hup');
  if (!b) { b = document.createElement('div'); b.id = 'hup'; $('#screen').appendChild(b) }
  b.innerHTML = html; b.classList.add('show');
  b.onclick = () => { b.classList.remove('show'); openApp('messages') };
  clearTimeout(hupT); hupT = setTimeout(() => b.classList.remove('show'), ms);
}

function closeQS() {
  const p = $('#qspanel');
  if (!p) return;
  p.classList.remove('open');
  setTimeout(() => { if (!p.classList.contains('open')) p.classList.add('hidden'); }, 300);
}
function openQS() {
  if (st.locked) return;
  qsMedia();
  closeDrawer(); closeRecents();
  const s = st.settings;
  // tiles
  const wifi = $('#qs-wifi'), bt = $('#qs-bt');
  if (wifi) {
    wifi.classList.toggle('on', !!s.wifi && !s.airplane);
    wifi.querySelector('.qs-ico').innerHTML = QS_ICO.wifi();
    const wn = $('#qs-wifiname'); if (wn) wn.textContent = s.wifi && !s.airplane ? 'Los Santos Net' : 'Off';
  }
  if (bt) {
    bt.classList.toggle('on', !!s.bluetooth);
    bt.querySelector('.qs-ico').innerHTML = QS_ICO.bt();
    const bn = $('#qs-btname'); if (bn) bn.textContent = s.bluetooth ? 'On' : 'Off';
  }
  // grid
  const cells = [
    { id: 'lock', ico: 'lock', on: false, label: 'Lock' },
    { id: 'airplane', ico: 'plane', on: !!s.airplane, label: 'Airplane' },
    { id: 'flashlight', ico: 'flash', on: !!s.flashlight, label: 'Flash' },
    { id: 'mobiledata', ico: 'data', on: !!s.mobiledata && !s.airplane, label: 'Data' },
    { id: 'nfc', ico: 'nfc', on: !!s.nfc, label: 'NFC' },
    { id: 'battery', ico: 'battery', on: false, label: 'Battery' },
    { id: 'location', ico: 'pin', on: !!s.location, label: 'Location' },
    { id: 'autorotate', ico: 'rotate', on: !!s.autorotate, label: 'Rotate' },
  ];
  const g = $('#qs-grid');
  if (g) g.innerHTML = cells.map(x => `<button type="button" class="qs-cell ${x.on ? 'on' : ''}" data-t="${x.id}"><span class="qs-ico">${QS_ICO[x.ico]()}</span></button>`).join('');
  // sliders
  const brt = $('#qs-brt'); if (brt) brt.value = s.brightness ?? 100;
  const vol = $('#qs-vol'); if (vol) vol.value = s.volume ?? 70;
  const bi = $('#qs-brt-ico'); if (bi) bi.innerHTML = QS_ICO.sun();
  const vi = $('#qs-vol-ico'); if (vi) vi.innerHTML = QS_ICO.note();
  const night = $('#qs-night'); if (night) { night.innerHTML = QS_ICO.moon(); night.classList.toggle('on', s.theme === 'dark'); }
  const mute = $('#qs-mute'); if (mute) { mute.innerHTML = QS_ICO.speaker(); mute.classList.toggle('on', (s.volume || 0) === 0); }
  // bottom
  const modes = $('#qs-modes'); if (modes) modes.querySelector('.qs-ico').innerHTML = QS_ICO.modes();
  const smart = $('#qs-smart'); if (smart) smart.querySelector('.qs-ico').innerHTML = QS_ICO.smart();
  const panel = $('#qspanel');
  if (!panel) return;
  panel.classList.remove('hidden');
  requestAnimationFrame(() => panel.classList.add('open'));
  // bind once-ish
  bindQS();
}
let qsBound = false;
function bindQS() {
  if (qsBound) return;
  qsBound = true;
  const panel = $('#qspanel');
  $('#qs-wifi')?.addEventListener('click', () => {
    st.settings.wifi = !st.settings.wifi;
    if (st.settings.wifi) st.settings.airplane = false;
    save(); openQS();
  });
  $('#qs-bt')?.addEventListener('click', () => {
    st.settings.bluetooth = !st.settings.bluetooth;
    applyBT(); save(); openQS();
  });
  panel?.addEventListener('click', e => {
    const cell = e.target.closest('.qs-cell');
    if (!cell) return;
    const id = cell.dataset.t;
    if (id === 'lock') { closeQS(); showLock(); return; }
    if (id === 'battery') { closeQS(); openApp('settings'); return; }
    if (id === 'airplane') {
      st.settings.airplane = !st.settings.airplane;
      if (st.settings.airplane) { st.settings.wifi = false; st.settings.mobiledata = false; }
    } else if (id === 'flashlight') {
      st.settings.flashlight = !st.settings.flashlight;
      post('setFlashlight', { on: !!st.settings.flashlight });
    }
    else if (id === 'mobiledata') { st.settings.mobiledata = !st.settings.mobiledata; if (st.settings.mobiledata) st.settings.airplane = false; }
    else if (id === 'nfc') st.settings.nfc = !st.settings.nfc;
    else if (id === 'location') st.settings.location = !st.settings.location;
    else if (id === 'autorotate') st.settings.autorotate = !st.settings.autorotate;
    save(); openQS();
  });
  $('#qs-brt')?.addEventListener('input', e => {
    st.settings.brightness = +e.target.value;
    applyBright();
  });
  $('#qs-brt')?.addEventListener('change', () => save());
  $('#qs-vol')?.addEventListener('input', e => {
    st.settings.volume = +e.target.value;
    $('#qs-mute')?.classList.toggle('on', +e.target.value === 0);
  });
  $('#qs-vol')?.addEventListener('change', () => save());
  $('#qs-night')?.addEventListener('click', () => {
    st.settings.theme = st.settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme(); save(); openQS();
  });
  $('#qs-mute')?.addEventListener('click', () => {
    st.settings.volume = st.settings.volume ? 0 : 70;
    save(); openQS();
  });
  $('#qs-set')?.addEventListener('click', () => { closeQS(); openApp('settings'); });
  $('#qs-power')?.addEventListener('click', () => { closeQS(); showLock(); });
  $('#qs-modes')?.addEventListener('click', () => toast('Modes'));
  $('#qs-smart')?.addEventListener('click', () => toast('SmartThings'));
  $('#qs-edit')?.addEventListener('click', () => toast('Edit panel'));
  // swipe up on panel to close
  let y0 = null;
  panel?.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
  panel?.addEventListener('touchend', e => {
    if (y0 == null) return;
    const dy = e.changedTouches[0].clientY - y0;
    y0 = null;
    if (dy < -50) closeQS();
  }, { passive: true });
  panel?.addEventListener('mousedown', e => { if (e.target === panel || e.target.classList.contains('qs-handle')) y0 = e.clientY; });
  panel?.addEventListener('mouseup', e => {
    if (y0 == null) return;
    if (e.clientY - y0 < -50) closeQS();
    y0 = null;
  });
}

function updateLockClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ds = days[now.getDay()] + ' ' + now.getDate() + ' ' + months[now.getMonth()];
  const lc = $('#lkclock');
  if (lc && lc.dataset.t !== hh + mm) {
    lc.dataset.t = hh + mm;
    const tx = (v, y, o) => `<text x="100" y="${y}" text-anchor="middle" font-size="118" font-weight="900" font-family="'Nunito','Varela Round','Arial Rounded MT Bold',Roboto,Arial,sans-serif" fill="currentColor" stroke="currentColor" stroke-width="5" letter-spacing="3" stroke-linejoin="round" opacity="${o}">${v}</text>`;
    lc.innerHTML = `<svg viewBox="0 0 200 222" aria-label="${hh}:${mm}">${tx(hh, 92, 1)}${tx(mm, 204, .9)}</svg>`;
  }
  const ld = $('#lkdate'); if (ld) ld.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()].slice(0, 3);
  const gt = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const nm = String((st.me && st.me.name) || '').trim().split(/\s+/)[0];
  const ht = $('#hw-title'); if (ht) ht.textContent = t(gt) + (nm ? ', ' + nm : '') + ' !';
  const hs = $('#hw-sub'); if (hs) hs.textContent = t('Send a message to someone today');
  const hst = $('#hw-start-t'); if (hst) hst.textContent = t('Start');
  const bp = parseInt(($('#battpct') || {}).textContent, 10), gb = $('#gg-b');
  if (gb && !isNaN(bp)) { gb.style.setProperty('--p', bp); gb.firstChild.textContent = bp }
  const hc = $('#hclock'); if (hc) hc.textContent = hh + ':' + mm;
  const hd = $('#hdate'); if (hd) hd.textContent = ds;
}

function home() {
  if (st.io) { st.io.disconnect(); st.io = null }
  clearInterval(st.wi); st.musRefresh = null;
  if (yt.mode !== 'audio') ytStop();
  st.thread = null;
  closeDrawer();
  closeRecents();
  closeQS();
  $('#app').className = 'hidden';
  $('#screen').classList.remove('light');
  if (st.locked) showLock();
  else {
    $('#home')?.classList.remove('hidden');
    renderHome();
  }
}

function view(title, html, o = {}) {
  if (yt.mode === 'short') ytStop(); else ytShOff();
  if (st.io) { st.io.disconnect(); st.io = null }
  clearInterval(st.wi);
  const a = $('#app');
  a.className = (o.dark ? 'dark' : '') + (o.app ? ' ' + o.app : '');
  $('#screen').classList.toggle('light', !o.dark && st.settings.theme !== 'dark');
  a.innerHTML = (o.nohdr ? '' : `<div class="hdr"><button class="bk">${o.back === false ? '' : '‹'}</button><b>${esc(title)}</b><button class="rt">${o.right || ''}</button></div>`) + `<div class="body ${o.cls || ''}">${html}</div>`;
  const bk = a.querySelector('.bk'); if (bk) bk.onclick = () => (o.back || home)();
  if (o.onRight) a.querySelector('.rt').onclick = o.onRight;
  return a.querySelector('.body');
}

/* ---------- Inline icons ---------- */
const I = (p, s = 24) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IP = {
  chev: '<path d="M5 9l7 7 7-7"/>', vol: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  eq: '<path d="M6 20V10M10 20V4M14 20V8M18 20v-6"/>', dots: '<circle cx="12" cy="5" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="19" r="1.7" fill="currentColor"/>',
  dotsH: '<circle cx="5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="19" cy="12" r="1.7" fill="currentColor"/>',
  queue: '<path d="M4 6h12M4 11h12M4 16h6"/><circle cx="16" cy="17" r="2.2"/><path d="M18.2 17V9l3 1"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  shuf: '<path d="M3 7h3c5 0 5 10 10 10h3M3 17h3c1.5 0 2.6-.8 3.6-2M13 9c.9-1.2 2-2 3-2h3"/><path d="M17 4l3 3-3 3M17 14l3 3-3 3"/>',
  prev: '<path d="M6 5h2.5v14H6zM20 5v14L9.5 12z" fill="currentColor" stroke="none"/>', next: '<path d="M15.5 5H18v14h-2.5zM4 5v14l10.5-7z" fill="currentColor" stroke="none"/>',
  play: '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>', pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" stroke="none"/>',
  rep: '<path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4"/>',
  note: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"/>', swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8"/>',
  bell: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/>', sup: '<path d="M5 14v-2a7 7 0 0 1 14 0v2M5 14h2v4H5zM17 14h2v4h-2zM17 18c0 2-2 3-5 3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.5 6.6C3.8 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/>', card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="16.5" cy="13" r="1.4"/>',
};
const ppIcon = (pl, s) => I(pl ? IP.pause : IP.play, s);

function pushRecent(id) {
  if (!id) return;
  st.recents = st.recents || [];
  st.recents = [id, ...st.recents.filter(x => x !== id)].slice(0, 8);
}
function openApp(id) {
  if (st.locked && !unlockPhone()) { st.afterUnlock = () => openApp(id); return }
  closeDrawer();
  closeRecents();
  $('#home')?.classList.add('hidden');
  pushRecent(id);
  const fn = ({ messages: msgs, phone: () => phone(), whatsnow: () => whatsnow(), bank, garage, trendy, inpic, calc, services, settings, music, youtube, gemini: gpt, browser: gsearch, camera, photos, weather, clock: () => clockApp(), maps, radio, yasir: () => yasirApp() })[id];
  if (fn) fn();
}

/* ---------- Browser (Google search via server API) ---------- */
const GSR = { q: '', start: 1, list: [], img: false, hist: [] };
function gsHist() { try { return JSON.parse(localStorage.getItem('gs_hist') || '[]') } catch (e) { return [] } }
function gsSaveHist(q) { try { const h = [q, ...gsHist().filter(x => x !== q)].slice(0, 8); localStorage.setItem('gs_hist', JSON.stringify(h)) } catch (e) { } }
function gsearch() {
  const b = view('', `<div class="gsb"><div class="gslogo"><span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span></div>
    <form id="gsform" class="gsbar">${I(IP.search, 20)}<input id="gsq" dir="auto" autocomplete="off" placeholder="${esc(t('Search Google'))}" value="${esc(GSR.q)}"><button type="button" id="gsx" class="${GSR.q ? '' : 'hidden'}">✕</button></form>
    <div class="gstabs"><button id="gsw" class="${GSR.img ? '' : 'on'}">${esc(t('All'))}</button><button id="gsi" class="${GSR.img ? 'on' : ''}">${esc(t('Images'))}</button></div>
    <div id="gsres" class="gsres"></div></div>`, { nohdr: true, dark: true, app: 'gbr', cls: 'full' });
  const inp = $('#gsq'), res = $('#gsres');
  const hist = () => {
    const h = gsHist();
    res.innerHTML = h.length ? `<div class="gsh">${h.map(x => `<button data-q="${esc(x)}">${I(IP.search, 16)}<span dir="auto">${esc(x)}</span></button>`).join('')}</div>` : '';
    res.querySelectorAll('[data-q]').forEach(e => e.onclick = () => { inp.value = e.dataset.q; run(1) });
  };
  const card = (r) => GSR.img
    ? `<a class="gsimg" data-l="${esc(r.link)}"><img src="${esc(r.thumb || r.link)}" onerror="this.parentNode.remove()"><span>${esc(r.display)}</span></a>`
    : `<div class="gsr" data-l="${esc(r.link)}"><div class="gsrt"><div><small>${esc(r.display)}</small><b dir="auto">${esc(r.title)}</b></div>${r.thumb ? `<img src="${esc(r.thumb)}" onerror="this.remove()">` : ''}</div><p dir="auto">${esc(r.snippet)}</p></div>`;
  const draw = (r, more) => {
    if (!r.ok) { res.innerHTML = `<div class="gserr">⚠ ${esc(t(r.err || 'Search failed'))}</div>`; return }
    if (!more) res.innerHTML = r.answer ? `<div class="gsans"><i>${I(IP.spark, 18)}</i><div dir="auto">${gptMd(r.answer)}</div></div>` : '';
    if (!more && !r.list.length && !r.answer) { res.innerHTML = `<div class="gserr">${esc(t('No results'))}</div>`; return }
    res.querySelector('.gsmore')?.remove();
    const wrap = GSR.img ? (res.querySelector('.gsgrid') || res.appendChild(Object.assign(document.createElement('div'), { className: 'gsgrid' }))) : res;
    wrap.insertAdjacentHTML('beforeend', r.list.map(card).join(''));
    if (r.next && GSR.start < 91) res.insertAdjacentHTML('beforeend', `<button class="gsmore">${esc(t('More results'))}</button>`);
    res.querySelector('.gsmore')?.addEventListener('click', () => run(GSR.start + 10, true));
    res.querySelectorAll('[data-l]').forEach(e => e.onclick = () => gsOpen(e.dataset.l, e.querySelector('b')?.textContent || e.dataset.l));
  };
  const run = async (start, more) => {
    const q = inp.value.trim(); if (!q) return hist();
    GSR.q = q; GSR.start = start || 1; $('#gsx').classList.remove('hidden');
    if (!more) res.innerHTML = `<div class="gsload">${esc(t('Searching...'))}</div>`;
    const r = await post('webSearch', { q, start: GSR.start, img: GSR.img });
    if (!$('#gsres')) return;
    if (r.ok && !more) gsSaveHist(q);
    draw(r, more);
  };
  $('#gsform').onsubmit = e => { e.preventDefault(); inp.blur(); run(1) };
  $('#gsx').onclick = () => { inp.value = ''; GSR.q = ''; $('#gsx').classList.add('hidden'); hist(); inp.focus() };
  $('#gsw').onclick = () => { if (GSR.img) { GSR.img = false; gsearch(); if (GSR.q) $('#gsform').requestSubmit() } };
  $('#gsi').onclick = () => { if (!GSR.img) { GSR.img = true; gsearch(); if (GSR.q) $('#gsform').requestSubmit() } };
  const back = document.createElement('button'); back.className = 'gsback'; back.textContent = '‹'; back.onclick = home; b.prepend(back);
  if (GSR.q) run(1); else hist();
}
function gsOpen(link, title) {
  const b = view('', `<div class="gsview"><div class="gsvt" dir="auto">${esc(title)}</div><div class="gsvl" dir="ltr">${esc(link)}</div>
    <button id="gscp" class="gsmore">${esc(t('Copy link'))}</button><button id="gsbk" class="gsmore">${esc(t('Back'))}</button></div>`, { nohdr: true, dark: true, app: 'gbr', cls: 'full' });
  $('#gscp').onclick = () => { try { const x = document.createElement('textarea'); x.value = link; document.body.appendChild(x); x.select(); document.execCommand('copy'); x.remove() } catch (e) { } toast(t('Copied')) };
  $('#gsbk').onclick = gsearch;
}
Object.assign(TR.ar, { 'Browser': 'المتصفح', 'Search Google': 'ابحث في Google', 'All': 'الكل', 'Images': 'صور', 'More results': 'المزيد من النتائج', 'No results': 'لا توجد نتائج', 'Searching...': 'جارٍ البحث...', 'Search failed': 'فشل البحث', 'Copy link': 'نسخ الرابط', 'Back': 'رجوع', 'Google API key is not set': 'مفتاح Google API غير مضبوط', 'Google API key is invalid': 'مفتاح Google API غير صالح', 'Google quota or rate limit reached': 'تم بلوغ حد Google' });
Object.assign(TR.fr, { 'Browser': 'Navigateur', 'Search Google': 'Rechercher sur Google', 'All': 'Tout', 'Images': 'Images', 'More results': 'Plus de résultats', 'No results': 'Aucun résultat', 'Searching...': 'Recherche...', 'Search failed': 'Échec de la recherche', 'Copy link': 'Copier le lien', 'Back': 'Retour', 'Google API key is not set': "La clé API Google n'est pas définie", 'Google API key is invalid': 'Clé API Google invalide', 'Google quota or rate limit reached': 'Limite Google atteinte' });

/* ---------- Messages (Google Messages style) ---------- */
const GM_COLORS = ['#1e8e3e','#d93025','#f9ab00','#1a73e8','#a142f4','#e52592','#007b83','#e8710a'];
function gmColor(s) {
  let h = 0; const t = String(s || '?');
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
  return GM_COLORS[h % GM_COLORS.length];
}
function gmAv(name, big) {
  const l = esc((name || '?')[0].toUpperCase());
  const c = gmColor(name);
  return `<div class="gm-av${big ? ' big' : ''}">${l}</div>`;
}

async function msgs() {
  st.thread = null;
  const r = await post('getConversations'); const l = r.list || [];
  const rows = l.length ? l.map(c => {
    const nm = c.name || c.number;
    return `<div class="gm-row${c.unread ? ' unr' : ''}" data-n="${esc(c.number)}" data-name="${esc(nm)}">
      ${gmAv(nm)}
      <div class="gm-rc"><div class="gm-top"><b>${esc(nm)}</b><span class="gm-time">${ago(c.ts)} ›</span></div>
      <div class="gm-prev"><span>${esc(c.text || '')}</span></div></div>
    </div>`;
  }).join('') : `<p class="gm-empty">${t('No conversations yet.')}</p>`;

  view(t('Messages'), `
    <div class="im-big">${t('Messages')}</div>
    <div class="gm-search"><span>⌕</span><input id="gmq" placeholder="${t('Search')}" autocomplete="off"></div>
    <div class="gm-list" id="gml">${rows}</div>
  `, { dark: true, app: 'gm iml', cls: 'gm-body', right: I('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', 22), onRight: newMsg });

  const filter = () => {
    const q = ($('#gmq').value || '').trim().toLowerCase();
    document.querySelectorAll('.gm-row').forEach(e => {
      const name = (e.dataset.name || '').toLowerCase();
      const n = (e.dataset.n || '').toLowerCase();
      e.style.display = (!q || name.includes(q) || n.includes(q)) ? '' : 'none';
    });
  };
  $('#gmq').oninput = filter;
  document.querySelectorAll('.gm-row').forEach(e => e.onclick = () => thread(e.dataset.n, e.dataset.name));
}

function newMsg() {
  view(t('New message'), `
    <div class="gm-to"><span>${t('To')}:</span><input id="nn" placeholder="${t('Phone number')}" autocomplete="off"></div>
    <button class="gm-next btn" id="go">${t('Next')}</button>
  `, { dark: true, app: 'gm', back: msgs, cls: 'gm-body' });
  $('#go').onclick = () => { const n = $('#nn').value.trim(); if (!n) return toast(t('Enter a number first')); thread(n, n) };
  $('#nn').onkeydown = e => { if (e.key === 'Enter') $('#go').click() };
}

async function thread(n, name) {
  const r = await post('getMessages', { number: n });
  st.thread = n; st.msgs = r.list || [];
  view(name, `
    <div class="gm-chat" id="chat"></div>
    <div class="gm-compose">
      <button class="gm-plus" id="gmplus">${I('<path d="M12 5v14M5 12h14"/>', 20)}</button>
      <div class="im-pill"><input id="mi" placeholder="${t('iMessage')}" autocomplete="off"><button class="gm-send" id="ms">${I('<path d="M12 19V5M5 12l7-7 7 7"/>', 18)}</button></div>
    </div>
  `, { dark: true, app: 'gm imt', back: msgs, cls: 'gm-thread' });
  const hdr = document.querySelector('#app .hdr');
  if (hdr) {
    hdr.innerHTML = `<button class="bk">${I('<path d="M15 5l-7 7 7 7"/>', 26)}</button>
      <div class="im-h">${gmAv(name, true)}<span>${esc(name)} <i>›</i></span></div>
      <button class="rt gm-call" id="gmcall">${I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z"/>', 22)}</button>`;
    hdr.querySelector('.bk').onclick = msgs;
    hdr.querySelector('#gmcall').onclick = () => dial(n, name);
  }
  st.redraw = () => {
    const c = $('#chat'); if (!c) return;
    c.innerHTML = st.msgs.map((m, i) => {
      const last = !st.msgs[i + 1] || !!st.msgs[i + 1].mine !== !!m.mine;
      return `<div class="gm-bub ${m.mine ? 'out' : 'in'}${last ? ' tail' : ''}">${esc(m.text)}</div>`;
    }).join('');
    c.scrollTop = 1e9;
  };
  st.redraw();
  const send = async () => {
    const txt = $('#mi').value.trim(); if (!txt) return toast(t('Type a message first'));
    $('#mi').value = ''; $('#ms').classList.remove('on');
    const x = await post('sendMessage', { number: n, text: txt });
    if (x.ok) { st.msgs.push({ mine: true, text: txt }); st.redraw() } else toast(x.err || t('Failed'));
  };
  $('#ms').onclick = send;
  $('#mi').oninput = () => $('#ms').classList.toggle('on', !!$('#mi').value.trim());
  $('#mi').onkeydown = e => { if (e.key === 'Enter') send() };
  $('#gmplus').onclick = () => toast(t('Coming soon'));
}

/* ---------- Phone ---------- */
/* ---------- Phone (Samsung dialer style) ---------- */
Object.assign(IP, {
  kp: '<g fill="currentColor" stroke="none"><circle cx="6" cy="4.5" r="1.7"/><circle cx="12" cy="4.5" r="1.7"/><circle cx="18" cy="4.5" r="1.7"/><circle cx="6" cy="10" r="1.7"/><circle cx="12" cy="10" r="1.7"/><circle cx="18" cy="10" r="1.7"/><circle cx="6" cy="15.5" r="1.7"/><circle cx="12" cy="15.5" r="1.7"/><circle cx="18" cy="15.5" r="1.7"/><circle cx="12" cy="21" r="1.7"/></g>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z" fill="currentColor"/>',
  phoneO: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z"/>',
  rec: '<path d="M4 7h3l1.5 4-2 1.2a8.5 8.5 0 0 0 4 4L12.3 14.5 16 16v3a1.5 1.5 0 0 1-1.5 1.5C8.5 20.5 3 15 3 8.5A1.5 1.5 0 0 1 4 7z"/><path d="M21 3l-6 6M15 5v4h4"/><path d="M15 9l6-6M17 3h4v4"/>',
  recF: '<path d="M4 7h3l1.5 4-2 1.2a8.5 8.5 0 0 0 4 4L12.3 14.5 16 16v3a1.5 1.5 0 0 1-1.5 1.5C8.5 20.5 3 15 3 8.5A1.5 1.5 0 0 1 4 7z" fill="currentColor"/><path d="M21 3l-6 6M15 5v4h4"/><path d="M15 9l6-6M17 3h4v4"/>',
  con: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-6 14.2-6 15 0"/>', conF: '<circle cx="12" cy="8" r="4.2" fill="currentColor" stroke="none"/><path d="M4 21.5c.8-7 15.2-7 16 0z" fill="currentColor" stroke="none"/>',
  cIn: '<path d="M5 8h3l1.4 3.6-1.8 1.1a8 8 0 0 0 3.8 3.8l1.1-1.8L16.1 16v3a1.5 1.5 0 0 1-1.5 1.5C9 20.5 4 15.5 4 10A1.5 1.5 0 0 1 5 8z" fill="currentColor" stroke="none"/><path d="M20 4l-5.5 5.5M14.5 5.5v4h4"/>',
  cOut: '<path d="M5 8h3l1.4 3.6-1.8 1.1a8 8 0 0 0 3.8 3.8l1.1-1.8L16.1 16v3a1.5 1.5 0 0 1-1.5 1.5C9 20.5 4 15.5 4 10A1.5 1.5 0 0 1 5 8z" fill="currentColor" stroke="none"/><path d="M14.5 9.5L20 4M16.5 4H20v3.5"/>',
  cMiss: '<path d="M5 8h3l1.4 3.6-1.8 1.1a8 8 0 0 0 3.8 3.8l1.1-1.8L16.1 16v3a1.5 1.5 0 0 1-1.5 1.5C9 20.5 4 15.5 4 10A1.5 1.5 0 0 1 5 8z" fill="currentColor" stroke="none"/><path d="M15 4l5 5M20 4l-5 5"/>',
  sort: '<path d="M3 6h14M3 12h8M3 18h6M15 14h7l-3.5 4.5z" fill="none"/>', ast: '<path d="M12 5v14M5.5 8.5l13 7M18.5 8.5l-13 7"/>',
  bks: '<path d="M9 5h11v14H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>', vm: '<circle cx="7" cy="12" r="3.3"/><circle cx="17" cy="12" r="3.3"/><path d="M7 15.3h10"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', starF: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/>',
});
const PLET = { 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ' };
const phAvc = n => ['#f08c7a', '#6fa8e8', '#7fcf93', '#e3b95a', '#a98be8', '#e87fb0'][[...String(n)].reduce((a, c) => a + c.charCodeAt(0), 0) % 6];
const favGet = () => lsGet('ios_ct_fav');
const pBody = html => view(t('Phone'), html, { dark: true, app: 'pho', nohdr: true, cls: 'full phb' });
const pNav = tab => {
  const b = (k, ic, icF, n) => `<button data-t="${k}" class="${tab === k ? 'on' : ''}">${I(tab === k ? icF : ic, 24)}<span>${n}</span></button>`;
  return `<div class="pnv">${b('keys', IP.kp, IP.kp, t('Keypad'))}${b('recents', IP.rec, IP.recF, t('Recents'))}${b('contacts', IP.con, IP.conF, t('Contacts'))}</div>`;
};
const pNavBind = () => document.querySelectorAll('.pnv button').forEach(e => e.onclick = () => { st.pq = ''; phone(e.dataset.t) });
const pHead = (sub, icons) => `<div class="pth" id="pth"><div class="ptt"><h1>${t('Phone')}</h1>${sub ? `<small>${sub}</small>` : ''}</div><div class="pti">${icons}</div></div>
  <div class="psb hidden" id="psb"><input id="psq" placeholder="${t('Search')}" value="${esc(st.pq || '')}"></div>`;
const pScroll = () => { const sc = $('#phs'), th = $('#pth'); if (sc && th) sc.onscroll = () => th.style.setProperty('--k', Math.min(1, sc.scrollTop / 70)) };
const pDots = items => `<div class="phdd hidden" id="pdd">${items}</div>`;
const pTime = ts => new Date(ts * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const pDay = ts => {
  const d = new Date(ts * 1000), n = new Date(), k = x => x.toDateString();
  if (k(d) === k(n)) return t('Today'); if (k(d) === k(new Date(n - 864e5))) return t('Yesterday');
  return d.toLocaleDateString(st.settings.language === 'ar' ? 'ar' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
};
function pSearchBind(redraw) {
  const sr = $('#phsr2'), bar = $('#psb'), inp = $('#psq');
  sr.onclick = () => { bar.classList.toggle('hidden'); if (!bar.classList.contains('hidden')) inp.focus(); else { st.pq = ''; inp.value = ''; redraw() } };
  inp.oninput = () => { st.pq = inp.value.trim().toLowerCase(); redraw() };
  if (st.pq) bar.classList.remove('hidden');
}

function phone(tab = 'keys') {
  if (tab === 'recents') return pRecents();
  if (tab === 'contacts') return contactsTab();
  const keys = [['1', 'vm'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['*', 'ast'], ['0', '+'], ['#']];
  pBody(`<div class="phh"><button id="phsr2">${I(IP.search, 22)}</button><button id="pdt">${I(IP.dots, 22)}</button></div>
    <div class="pdisp" id="pdn"></div>
    <div class="pkp">${keys.map(([k, x]) => `<button data-k="${k}"><b>${k === '*' ? I(IP.ast, 26) : k}</b><small>${x === 'vm' ? I(IP.vm, 14) : x === 'ast' ? '' : esc(x || PLET[k] || '')}</small></button>`).join('')}</div>
    <div class="pcl"><span></span><button class="pcall" id="pcb2">${I(IP.phone, 28)}</button><button class="pbs" id="pbs">${I(IP.bks, 24)}</button></div>
    ${pNav('keys')}${pDots(`<div id="ddset">${t('Settings')}</div>`)}`);
  let d = ''; const show = () => { $('#pdn').textContent = d; $('#pbs').style.visibility = d ? 'visible' : 'hidden' }; show();
  document.querySelectorAll('.pkp [data-k]').forEach(e => e.onclick = () => { if (d.length < 12) { d += e.dataset.k; show() } });
  $('#pbs').onclick = () => { d = d.slice(0, -1); show() };
  $('#pcb2').onclick = () => d ? dial(d, d) : toast(t('Enter a number first'));
  $('#phsr2').onclick = () => toast(t('Coming soon'));
  $('#pdt').onclick = () => $('#pdd').classList.toggle('hidden'); $('#ddset').onclick = () => toast(t('Coming soon'));
  pNavBind();
}

async function pRecents() {
  const r = await post('getCalls'); const all = r.list || [];
  pBody(`${pHead('', `<button id="pfl">${I(IP.sort, 22)}</button><button id="phsr2">${I(IP.search, 22)}</button><button id="pdt">${I(IP.dots, 22)}</button>`)}
    <div class="scr" id="phs"></div>${pNav('recents')}${pDots(`<div id="ddclr">${t('Clear call log')}</div>`)}`);
  const L = $('#phs');
  const draw = () => {
    const q = st.pq || '';
    const l = all.filter(c => !q || String(c.name || '').toLowerCase().includes(q) || c.number.includes(q));
    if (!l.length) return L.innerHTML = `<p class="empty">${t('No results')}</p>`;
    const groups = [];
    l.forEach(c => {
      const k = pDay(c.ts); let g = groups[groups.length - 1]; if (!g || g.k !== k) groups.push(g = { k, l: [] });
      const last = g.l[g.l.length - 1];
      if (last && last.number === c.number && last.dir === c.dir) last.n++; else g.l.push({ ...c, n: 1 });
    });
    L.innerHTML = groups.map(g => `<h4 class="pgh">${esc(g.k)}</h4><div class="pcd">${g.l.map(c => `<div class="prw" data-n="${esc(c.number)}" data-nm="${esc(c.name || c.number)}"><span class="pci ${c.dir}">${I(c.dir === 'in' ? IP.cIn : c.dir === 'out' ? IP.cOut : IP.cMiss, 22)}</span><span class="pnm ${c.dir === 'missed' ? 'ms' : ''}">${esc(c.name || c.number)}${c.n > 1 ? ' (' + c.n + ')' : ''}</span><small>${pTime(c.ts)}</small></div>`).join('')}</div>`).join('');
    L.querySelectorAll('.prw').forEach(e => e.onclick = () => dial(e.dataset.n, e.dataset.nm));
  };
  draw(); pScroll(); pSearchBind(draw); pNavBind();
  $('#pfl').onclick = () => toast(t('Coming soon'));
  $('#pdt').onclick = () => $('#pdd').classList.toggle('hidden');
  $('#ddclr').onclick = async () => { await post('clearCalls'); pRecents() };
}

async function contactsTab() {
  const r = await post('getContacts'); const all = r.list || [];
  const favs = favGet();
  pBody(`${pHead(all.length + ' ' + t('contacts'), `<button id="pad">${I(IP.plus, 24)}</button><button id="phsr2">${I(IP.search, 22)}</button><button id="pdt">${I(IP.dots, 22)}</button>`)}
    <div class="scr" id="phs"></div>${pNav('contacts')}${pDots(`<div id="ddset">${t('Settings')}</div>`)}`);
  const L = $('#phs');
  const row = c => `<div class="prw ct" data-id="${c.id}"><span class="pav" style="background:${phAvc(c.name)}">${esc((c.name || '?')[0].toUpperCase())}</span><span class="pnm">${esc(c.name)}</span></div>`;
  const draw = () => {
    const q = st.pq || '';
    const l = all.filter(c => !q || c.name.toLowerCase().includes(q) || c.number.includes(q));
    const fv = l.filter(c => favs.includes(c.id));
    const sec = {}; l.forEach(c => { const k = /\p{L}/u.test(c.name[0]) ? c.name[0].toUpperCase() : '#'; (sec[k] = sec[k] || []).push(c) });
    L.innerHTML = `${q ? '' : `<h4 class="pgh">${t('My profile')}</h4><div class="pcd"><div class="prw"><span class="pav" style="background:${phAvc(st.me.name)}">${esc((st.me.name || '?')[0])}</span><span class="pnm">${esc(st.me.name)}</span></div></div>`}
      ${fv.length ? `<h4 class="pgh star">${I(IP.starF, 18)}${t('Favourites')}</h4><div class="pcd">${fv.map(row).join('')}</div>` : ''}
      ${q ? '' : `<div class="pcd gp" id="pgp"><div class="prw"><span class="pav grey">${I(IP.shr, 22)}</span><span class="pnm">${t('Groups')}</span></div></div>`}
      ${Object.keys(sec).sort().map(k => `<h4 class="pgh">${esc(k)}</h4><div class="pcd">${sec[k].map(row).join('')}</div>`).join('') || (all.length ? '' : `<p class="empty">${t('No contacts yet.')}</p>`)}`;
    L.querySelectorAll('.ct').forEach(e => e.onclick = () => pContact(all.find(c => c.id === +e.dataset.id)));
    const g = $('#pgp'); if (g) g.onclick = () => toast(t('Coming soon'));
  };
  draw(); pScroll(); pSearchBind(draw); pNavBind();
  $('#pad').onclick = addContact;
  $('#pdt').onclick = () => $('#pdd').classList.toggle('hidden'); $('#ddset').onclick = () => toast(t('Coming soon'));
}
function pContact(c) {
  if (!c) return contactsTab();
  const fav = favGet().includes(c.id);
  pBody(`<div class="pdh"><button id="pcb">${I(IP.arrowL, 24)}</button><span></span><button id="pcd">${I(IP.bin, 22)}</button></div>
    <div class="pdc"><div class="pav lg" style="background:${phAvc(c.name)}">${esc((c.name || '?')[0].toUpperCase())}</div><h2>${esc(c.name)}</h2><small>${esc(c.number)}</small>
    <div class="pda"><div><button class="g" id="pcc">${I(IP.phone, 22)}</button><span>${t('Call')}</span></div><div><button id="pcm">${I(IP.msg, 22)}</button><span>${t('Message')}</span></div><div><button id="pcf" class="${fav ? 'on' : ''}">${I(fav ? IP.starF : IP.star, 22)}</button><span>${t('Favourites')}</span></div></div></div>`);
  $('#pcb').onclick = contactsTab;
  $('#pcc').onclick = () => dial(c.number, c.name);
  $('#pcm').onclick = () => thread(c.number, c.name);
  $('#pcf').onclick = () => { const f = favGet(); lsSet('ios_ct_fav', f.includes(c.id) ? f.filter(x => x !== c.id) : [...f, c.id]); pContact(c) };
  $('#pcd').onclick = async () => { await post('deleteContact', { id: c.id }); contactsTab() };
}
function addContact() {
  pBody(`<div class="pdh"><button id="pcb">${I(IP.arrowL, 24)}</button><b class="pdt">${t('New contact')}</b><span></span></div>
    <div class="pfm"><input id="cn" placeholder="${t('Name')}" maxlength="40"><input id="cm" placeholder="${t('Phone number')}"><button class="pbt" id="cs2">${t('Save')}</button></div>`);
  $('#pcb').onclick = contactsTab;
  $('#cs2').onclick = async () => {
    const n = $('#cn').value.trim(), m = $('#cm').value.trim();
    if (!n || !m) return toast(t('Enter name and number'));
    const x = await post('addContact', { name: n, number: m });
    x.ok ? contactsTab() : toast(x.err || t('Failed'));
  };
}

/* ---------- Calls ---------- */
async function dial(n, name) {
  const r = await post('call', { number: n });
  if (!r.ok) return toast(r.err || t('Call failed'));
  showCall(name, t('Calling…'), false);
}
function showCall(name, status, incoming) {
  st.callName = name;
  const c = $('#call'); c.classList.remove('hidden');
  c.innerHTML = `<div class="cn"><div class="av big">${esc((name || '#')[0])}</div><h2>${esc(name)}</h2><p id="cs">${status}</p></div><div class="cbtns"><button class="red" id="dec">✕</button>${incoming ? '<button class="green" id="acc">☎</button>' : ''}</div>`;
  $('#dec').onclick = () => { stopRing(); post('hangup'); endCallUI() };
  if (incoming) $('#acc').onclick = () => { stopRing(); post('answer') };
}
function endCallUI() { stopRing(); clearInterval(st.ct); st.inCall = false; st.callTxt = ''; islandIdle(); $('#call').classList.add('hidden') }

/* ---------- Bank (dark wallet style) ---------- */
async function bank() {
  const r = await post('getBank');
  const bal = Number(r.balance || 0), l = r.list || [];
  const last4 = String((st.me.account || '').replace(/\D/g, '').slice(-4) || '0000').padStart(4, '0');
  const hide = !!st.bankHide, mk = v => hide ? '••••' : v;
  const digs = String(st.me.account || '').replace(/\D/g, ''), cardNum = ('5412' + digs.padStart(12, '7')).slice(0, 16), cardExp = '12/29', cardCvv = String(digs.slice(-3) || '421').padStart(3, '0');
  view(t('Bank'), `<div class="bk2">
    <div class="bkt"><div class="bav">${esc((st.me.name || '?')[0])}</div><b>iBank</b><span class="bki"><span>${I(IP.scan, 21)}</span><span class="rd">${I(IP.bell, 21)}</span><span>${I(IP.sup, 21)}</span></span></div>
    <div class="bkl"><small>${t('Balance')}</small><button id="beye">${I(hide ? IP.eyeoff : IP.eye, 17)}</button></div>
    <div class="bkb ${bal < 0 ? 'neg' : ''}">${mk(fmt(bal))} <small>USD ▾</small></div>
    <div class="bka">
      <div><button class="w" id="bdep">${I(IP.plus, 24)}</button><span>${t('Deposit')}</span></div>
      <div><button id="bsnd">${I(IP.send, 22)}</button><span>${t('Transfer')}</span></div>
      <div><button id="bswp">${I(IP.swap, 22)}</button><span>${t('Swap')}</span></div>
      <div><button id="bmore">${I(IP.dotsH, 22)}</button><span>${t('More')}</span></div>
    </div>
    <div class="bpr"><div><small>${t('Send money, receive cash')}</small><b>${t('0 fees on your first transfer')}</b></div><span class="tkt">$20</span></div>
    <div class="bcr" id="bcr">
      <div class="bch"><b>${t('Credit')}</b><span>›</span></div>
      <small class="cc">${t('Available credit')} (USD)</small>
      <div class="cv">${mk(fmt(Math.max(bal, 0)) + '.00')}</div>
      <div class="cn2"><span>•••• ${last4}</span><span>${esc(st.me.name)}</span></div>
      <div class="cbx"><div><small>${t('Outstanding balance')} (USD)</small><b>0.00</b></div><div><small>${t('Risk score')}</small><b class="sf"><svg width="26" height="14" viewBox="0 0 26 14"><path d="M2 13a11 11 0 0 1 22 0" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round"/><path d="M19 4a11 11 0 0 1 5 9" fill="none" stroke="#ff6a3d" stroke-width="3" stroke-linecap="round"/></svg>${t('Safe')}</b></div></div>
    </div>
    <div class="bhd" id="brc">${t('Recent')}</div>
    <div class="btx">${l.map(tx => `<div class="tr"><div class="tav">${tx.out ? '↑' : '↓'}</div><div class="rc"><b>${esc(tx.name)}</b><small>${ago(tx.ts)}</small></div><b class="${tx.out ? 'neg' : 'pos'}">${tx.out ? '-' : '+'}$${fmt(tx.amount)}</b></div>`).join('') || `<p class="empty" style="margin:16px 0">${t('No transactions.')}</p>`}</div>
  </div>
  <div class="bnav"><button class="on" data-g="top">${I(IP.home, 20)}<span>${t('Home')}</span></button><button data-g="card">${I(IP.card, 20)}<span>${t('Card')}</span></button><button data-g="send">${I(IP.send, 20)}<span>${t('Send')}</span></button><button data-g="rec">${I(IP.wallet, 20)}<span>${t('Assets')}</span></button></div>
  <div class="bcd hidden" id="bcd"><div class="bcdh"><button id="bcb">${I(IP.chev, 24)}</button><b>${t('Card')}</b><span></span></div>
    <div class="vcard ${st.cardFrozen ? 'frz' : ''}" id="vcard"><div class="vc1"><b>iBank</b><span class="ctl2">${I('<path d="M8 8a6 6 0 0 1 0 8M11.5 5.5a10 10 0 0 1 0 13M15 3a14 14 0 0 1 0 18"/>', 20)}</span></div><span class="chip"></span><div class="bnum" id="cnum">${st.cardShow ? cardNum.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ' + last4}</div><div class="b2"><div><small>${t('Cardholder')}</small><b>${esc(st.me.name)}</b></div><div><small>${t('Expires')}</small><b>${cardExp}</b></div><span class="mc"><i></i><i></i></span></div>${st.cardFrozen ? `<div class="frzb">${t('Frozen')}</div>` : ''}</div>
    <div class="bka cda">
      <div><button id="cfz" class="${st.cardFrozen ? 'w' : ''}">${I('<path d="M12 2v20M4.5 7l15 10M19.5 7l-15 10"/>', 22)}</button><span>${st.cardFrozen ? t('Unfreeze') : t('Freeze')}</span></div>
      <div><button id="cdt">${I(st.cardShow ? IP.eyeoff : IP.eye, 22)}</button><span>${t('Details')}</span></div>
      <div><button id="clm">${I(IP.wallet, 22)}</button><span>${t('Limits')}</span></div>
    </div>
    <div class="cdl"><div><small>${t('Card number')}</small><b>${st.cardShow ? cardNum.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ' + last4}</b></div><div><small>${t('Expires')}</small><b>${cardExp}</b></div><div><small>CVV</small><b>${st.cardShow ? cardCvv : '•••'}</b></div><div><small>${t('Balance')}</small><b>$${fmt(bal)}</b></div></div>
  </div>
  <div class="bsh hidden" id="bsh"><div class="bsc"><b>${t('Transfer')}</b><input id="bn" placeholder="${t('Phone number')}"><input id="ba" placeholder="${t('Amount')}"><button class="btn" id="bs">${t('Transfer')}</button><button class="bcn" id="bx">${t('Cancel')}</button></div></div>`, { dark: true, app: 'bnk', nohdr: true, cls: 'bkbody' });
  const sheet = on => $('#bsh').classList.toggle('hidden', !on);
  const soon = () => toast(t('Coming soon'));
  $('#beye').onclick = () => { st.bankHide = !st.bankHide; bank() };
  $('#bdep').onclick = soon; $('#bswp').onclick = soon; $('#bmore').onclick = soon;
  $('#bsnd').onclick = () => sheet(true); $('#bx').onclick = () => sheet(false);
  const bd = $('#app .body');
  document.querySelectorAll('.bnav button').forEach(e => e.onclick = () => {
    const g = e.dataset.g;
    if (g === 'send') return sheet(true);
    if (g === 'card') { document.querySelectorAll('.bnav button').forEach(x => x.classList.toggle('on', x === e)); return $('#bcd').classList.remove('hidden') }
    $('#bcd').classList.add('hidden');
    document.querySelectorAll('.bnav button').forEach(x => x.classList.toggle('on', x === e));
    if (g === 'top') bd.scrollTo({ top: 0, behavior: 'smooth' });
    else $(g === 'card' ? '#bcr' : '#brc').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  const closeCard = () => { $('#bcd').classList.add('hidden'); document.querySelectorAll('.bnav button').forEach(x => x.classList.toggle('on', x.dataset.g === 'top')) };
  $('#bcb').onclick = closeCard;
  $('#cfz').onclick = () => { st.cardFrozen = !st.cardFrozen; bank(); setTimeout(() => $('.bnav [data-g=card]').click(), 0) };
  $('#cdt').onclick = () => { st.cardShow = !st.cardShow; bank(); setTimeout(() => $('.bnav [data-g=card]').click(), 0) };
  $('#clm').onclick = soon;
  $('#bs').onclick = async () => {
    const n = $('#bn').value.trim(), a = Math.floor(+$('#ba').value);
    if (!n || !(a > 0)) return toast(t('Enter number and amount'));
    const x = await post('transfer', { number: n, amount: a });
    toast(x.ok ? t('Transfer sent') : (x.err || t('Failed'))); if (x.ok) bank();
  };
}

/* ---------- Garage ---------- */
const bar = (l, v) => `<div class="bar"><span>${l}</span><i><u style="width:${Math.max(0, Math.min(100, v || 0))}%"></u></i></div>`;
const GS = ['Out', 'Garaged', 'Impound'];
const CAR_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M5.2 10.2l1.5-3.6A2.2 2.2 0 0 1 8.7 5.2h6.6c.8 0 1.5.4 1.9 1.1l1.6 3.9h.7A1.5 1.5 0 0 1 21 11.7v3.6c0 .5-.4.9-.9.9H3.9a.9.9 0 0 1-.9-.9v-3.6a1.5 1.5 0 0 1 1.5-1.5z"/><path fill="#ff8a1a" opacity=".5" d="M8.2 10l1-3h2.3v3zM12.8 10V7h2.4l1.7 3z"/><circle cx="7.5" cy="16.2" r="2.3" fill="currentColor" stroke="#ff9f0a" stroke-width="1"/><circle cx="16.5" cy="16.2" r="2.3" fill="currentColor" stroke="#ff9f0a" stroke-width="1"/></svg>';
async function garage() {
  const r = await post('getGarage'); const l = r.list || [];
  const b = view(t('Garage'), l.length ? `<div class="list">${l.map((v, i) => `<div class="row" data-i="${i}"><div class="ic gic">${CAR_SVG}</div><div class="rc"><b>${esc(v.label)}</b><small>${esc(v.plate)} · ${esc(v.garage || '-')}</small></div><span class="tag s${v.state}">${t(GS[v.state] || '?')}</span></div>`).join('')}</div>` : `<p class="empty">${t('No vehicles.')}</p>`);
  b.querySelectorAll('.row').forEach(e => e.onclick = () => carView(l[+e.dataset.i]));
}
function carView(v) {
  const fee = st.me.bringFee ? ` · $${fmt(st.me.bringFee)}` : '';
  const acts = v.state === 2
    ? `<p class="empty" style="margin:16px 0">${t('This vehicle is impounded. Pick it up at the impound lot.')}</p>`
    : `<div class="form"><button class="btn" id="cm">${t('Show on map')}</button>${v.state === 1 ? `<button class="btn green" id="cbv">${t('Bring vehicle')}${fee}</button>` : `<small style="text-align:center">${t('This vehicle is out. Mark it on the map to find it.')}</small>`}</div>`;
  view(v.label, `<div class="card car"><div class="top"><b>${esc(v.label)}</b><span class="tag s${v.state}">${t(GS[v.state] || '?')}</span></div><small>${esc(v.plate)} · ${esc(v.garage || '-')}</small>${bar(t('Fuel'), v.fuel)}${bar(t('Engine'), v.engine / 10)}${bar(t('Body'), v.body / 10)}</div>` + acts, { back: garage });
  const m = $('#cm');
  if (m) m.onclick = async () => { const x = await post('track', { plate: v.plate }); toast(x.ok ? (x.kind === 'garage' ? t('Garage marked on map') : t('Vehicle marked on map')) : (x.err || t('Vehicle not found'))) };
  const c = $('#cbv');
  if (c) c.onclick = async () => { const x = await post('bringVehicle', { plate: v.plate }); if (x.ok) { toast(t('Your vehicle is on its way')); post('close') } else toast(x.err || t('Failed')) };
}

/* ---------- Trendy / Inpic ---------- */
const media = u => /\.(mp4|webm)(\?|$)/i.test(u) ? `<video src="${esc(u)}" loop muted playsinline></video>` : `<img src="${esc(u)}">`;
function hookLikes(b) {
  b.querySelectorAll('.lk').forEach(e => e.onclick = async () => {
    const x = await post('like', { id: +e.dataset.id });
    if (x.ok) { e.classList.toggle('on', x.liked); e.querySelector('small').textContent = x.likes }
  });
}
/* ---------- Trendy (TikTok style) ---------- */
const TTI = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  friends: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17.5 14c2.5.3 4 2 4.5 5"/>',
  inbox: '<path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-5l-3 3-3-3H5a1 1 0 0 1-1-1z"/><path d="M9 10h6"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>',
  heart: '<path d="M12 21s-8-5.2-8-11.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.800 12 21 12 21z" fill="currentColor" stroke="none"/>',
  cmt: '<path d="M12 3C6.800 3 3 6.500 3 11c0 2.300 1 4.300 2.700 5.700L5 21l4.300-2.100c.900.200 1.800.300 2.700.300 5.200 0 9-3.500 9-8S17.200 3 12 3z" fill="currentColor" stroke="none"/><g fill="#000" opacity=".55"><circle cx="8" cy="11" r="1.200"/><circle cx="12" cy="11" r="1.200"/><circle cx="16" cy="11" r="1.200"/></g>',
  mark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.500L5 21V4a1 1 0 0 1 1-1z" fill="currentColor" stroke="none"/>',
  shr: '<path d="M14 4l7 6.500-7 6.500v-4c-6 0-9 2-11 6 .5-6 4-10 11-10z" fill="currentColor" stroke="none"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  pen: '<path d="M4 20l1-4L16.500 4.500a2.100 2.100 0 0 1 3 3L8 19z"/>',
  grid: '<path d="M5 4v16M10 4v16M15 4v16M20 4v16"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="currentColor" stroke="none"/>',
  box: '<path d="M4 13l2-8h12l2 8v6H4z" fill="currentColor" stroke="none"/><path d="M4 13h5l1 2h4l1-2h5" stroke="#fff" fill="none"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.500"/>',
};
const ttHandle = p => '@' + (p.username || String(p.author || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, ''));
function ttAv(name, url, size = 44) {
  const l = esc(String(name || '?')[0].toUpperCase());
  const img = url ? `<img src="${esc(url)}" onerror="this.remove()">` : '';
  return `<div class="ttav" style="width:${size}px;height:${size}px;font-size:${Math.round(size / 2.4)}px;background:${avc(name || '?')}"><span>${l}</span>${img}</div>`;
}
function ttNav(tab, dark) {
  const it = (id, label, ic) => `<button class="${tab === id ? 'on' : ''}" data-t="${id}">${I(ic, 24)}<span>${t(label)}</span></button>`;
  return `<div class="ttnav${dark ? ' d' : ''}">${it('home', 'Home', TTI.home)}${it('friends', 'Friends', TTI.friends)}<button class="ttplus" data-t="new"><b>+</b></button>${it('inbox', 'Inbox', TTI.inbox)}${it('profile', 'Profile', TTI.profile)}</div>`;
}
function ttGo(tab) { ({ home: trendy, friends: ttFriends, inbox: ttInbox, profile: ttProfile, new: () => newPost('trendy') })[tab]() }
function ttShell(tab, dark, inner) {
  const b = view(t('Trendy'), `<div class="ttmain">${inner}</div>${ttNav(tab, dark)}`, { nohdr: true, dark, app: 'tt tt-' + tab, cls: 'full' });
  $('#screen').classList.toggle('light', !dark);
  b.querySelectorAll('.ttnav [data-t]').forEach(e => e.onclick = () => ttGo(e.dataset.t));
  return b;
}
const ttMedia = p => p.kind === 'video'
  ? `<div class="ttvid" data-id="${p.id}"><img src="${esc(p.media)}"><span class="ttplay">▶</span></div>`
  : media(p.media);
function ttReels(list) {
  return list.map(p => `<section class="reel" data-id="${p.id}">${ttMedia(p)}
    <div class="ttshade"></div>
    <div class="ttrail">
      <div class="ttavw">${ttAv(p.author, p.avatar, 46)}<i>+</i></div>
      <button class="lk ${p.liked ? 'on' : ''}" data-id="${p.id}">${I(TTI.heart, 34)}<small>${p.likes}</small></button>
      <button class="ttb" data-a="soon">${I(TTI.cmt, 32)}<small>0</small></button>
      <button class="ttb" data-a="mark">${I(TTI.mark, 30)}<small>${t('Save')}</small></button>
      <button class="ttb" data-a="soon">${I(TTI.shr, 30)}<small>${t('Share')}</small></button>
      ${p.mine ? `<button class="ttb" data-a="del" data-id="${p.id}">${I(TTI.trash, 26)}<small>${t('Delete')}</small></button>` : ''}
    </div>
    <div class="ttinfo"><b>${esc(ttHandle(p))}</b><p>${esc(p.caption || '')}</p><div class="ttsnd">♫ ${esc(t('Original sound'))} - ${esc(p.author)}</div></div>
  </section>`).join('');
}
st.pvw = st.pvw || {};
window.ttGetPostVideo = id => new Promise(res => {
  if (st.pvc && st.pvc[id]) return res(st.pvc[id]);
  st.pvw[id] = res; post('getPostVideo', { id });
  setTimeout(() => { if (st.pvw[id]) { delete st.pvw[id]; res(null) } }, 25000);
});
async function ttLoadVideo(box) {
  if (!box || box.dataset.state) return;
  box.dataset.state = 'loading'; box.classList.add('load');
  const data = await window.ttGetPostVideo(+box.dataset.id);
  box.classList.remove('load');
  if (!data) { delete box.dataset.state; return toast(t('Failed')) }
  (st.pvc = st.pvc || {})[box.dataset.id] = data;
  box.dataset.state = 'ready';
  window.camPlayVideo(box, data, 1);
  const v = box.querySelector('video'); if (v) { v.className = 'ttvv'; v.muted = false; v.volume = .8; v.play().catch(() => { v.muted = true; v.play().catch(() => { }) }) }
}
function ttHook(b, after) {
  hookLikes(b);
  b.querySelectorAll('.ttvid').forEach(x => x.onclick = () => { const v = x.querySelector('video'); if (v) v.paused ? v.play().catch(() => { }) : v.pause(); else ttLoadVideo(x) });
  b.querySelectorAll('.ttb').forEach(e => e.onclick = async () => {
    const a = e.dataset.a;
    if (a === 'mark') e.classList.toggle('on');
    else if (a === 'del') { const x = await post('deletePost', { id: +e.dataset.id }); if (x.ok) { toast(t('Deleted')); after && after() } else toast(t('Failed')) }
    else toast(t('Coming soon'));
  });
  b.querySelectorAll('.reel video').forEach(v => v.onclick = () => { v.paused ? v.play().catch(() => { }) : v.pause() });
  st.io = new IntersectionObserver(es => es.forEach(e => { const v = e.target.querySelector('video'); if (v) e.isIntersecting ? v.play().catch(() => { }) : v.pause(); else if (e.isIntersecting) { const vb = e.target.querySelector('.ttvid'); if (vb) ttLoadVideo(vb) } }), { threshold: .6 });
  b.querySelectorAll('.reel').forEach(x => st.io.observe(x));
}
async function trendy() {
  if (yt.mode !== 'audio') ytStop();
  const r = await post('getPosts', { app: 'trendy' }); const list = r.list || [];
  st.tt = { list };
  const b = ttShell('home', true, `<div class="tttop"><span class="so" id="ttfl">${t('Following')}</span><span class="on">${t('For You')}</span><button id="ttsr">${I(IP.search, 24)}</button></div>
    <div class="reels">${ttReels(list) || `<p class="empty">${t('No videos yet. Post one with +')}</p>`}</div>`);
  $('#ttfl').onclick = () => toast(t('Coming soon'));
  $('#ttsr').onclick = ttSearch;
  ttHook(b, trendy);
}
function ttOpen(list, i, back) {
  const b = view(t('Trendy'), `<div class="ttmain"><div class="tttop"><button id="ttbk">${I(IP.arrowL, 24)}</button></div><div class="reels" id="tor">${ttReels(list)}</div></div>`, { nohdr: true, dark: true, app: 'tt tt-home tt-open', cls: 'full' });
  $('#screen').classList.remove('light');
  $('#ttbk').onclick = back;
  ttHook(b, back);
  const rl = $('#tor'); rl.scrollTop = i * rl.clientHeight;
}
function ttSearch() {
  const all = (st.tt && st.tt.list) || [];
  const b = view(t('Trendy'), `<div class="ttsrh"><button id="ttbk">${I(IP.arrowL, 22)}</button><input id="ttq" placeholder="${t('Search')}" autocomplete="off"></div><div class="ttgrid" id="ttg"></div>`, { nohdr: true, dark: false, app: 'tt tt-search', cls: 'full' });
  $('#screen').classList.add('light');
  $('#ttbk').onclick = trendy;
  const draw = () => {
    const q = $('#ttq').value.trim().toLowerCase();
    const l = all.filter(p => !q || (p.author + ' ' + (p.username || '') + ' ' + (p.caption || '')).toLowerCase().includes(q));
    $('#ttg').innerHTML = l.map(p => ttThumb(p)).join('') || `<p class="empty" style="grid-column:1/-1">${t('No results')}</p>`;
    $('#ttg').querySelectorAll('.ttth').forEach(e => e.onclick = () => ttOpen(all, all.findIndex(x => x.id === +e.dataset.id), ttSearch));
  };
  $('#ttq').oninput = draw; draw(); $('#ttq').focus();
}
const ttThumb = p => `<div class="ttth" data-id="${p.id}">${/\.(mp4|webm)(\?|$)/i.test(p.media) ? `<video src="${esc(p.media)}" muted preload="metadata"></video>` : `<img src="${esc(p.media)}">`}<span>${p.kind === 'video' ? '▶ ' : '▷ '}${p.likes}</span></div>`;
async function ttFriends() {
  const r = await post('getPosts', { app: 'trendy' }); const list = r.list || [];
  st.tt = { list };
  const by = {};
  list.forEach(p => { (by[p.author] = by[p.author] || { p, n: 0 }).n++ });
  const rows = Object.values(by).map(g => `<div class="ttrow" data-a="${esc(g.p.author)}">${ttAv(g.p.author, g.p.avatar, 52)}<div class="rc"><b>${esc(g.p.author)}</b><small>${esc(ttHandle(g.p))} · ${g.n} ${t('Videos')}</small></div></div>`).join('') || `<p class="empty">${t('No videos yet. Post one with +')}</p>`;
  const b = ttShell('friends', false, `<div class="tthd"><b>${t('Friends')}</b></div><div class="ttlist">${rows}</div>`);
  b.querySelectorAll('.ttrow').forEach(e => e.onclick = () => { const l = list.filter(p => p.author === e.dataset.a); ttOpen(l, 0, ttFriends) });
}
async function ttInbox() {
  const r = await post('getProfile');
  const posts = (r.posts || []).filter(p => p.likes > 0);
  const rows = posts.map(p => `<div class="ttrow" data-id="${p.id}">${ttAv(r.name, r.avatar, 52)}<div class="rc"><b>${t('New likes')}</b><small>${t('Your video got')} ${p.likes} ${t('Likes').toLowerCase()}</small></div><div class="ttsm">${/\.(mp4|webm)(\?|$)/i.test(p.media) ? `<video src="${esc(p.media)}" muted preload="metadata"></video>` : `<img src="${esc(p.media)}">`}</div></div>`).join('');
  const b = ttShell('inbox', false, `<div class="tthd"><b>${t('Inbox')}</b></div><div class="ttlist">
    <div class="ttrow"><div class="ttic" style="background:#fe2c55">${I(TTI.bolt, 26)}</div><div class="rc"><b>${t('Activity')}</b><small>${r.likes || 0} ${t('Likes').toLowerCase()} · ${(r.posts || []).length} ${t('Videos')}</small></div></div>
    <div class="ttrow"><div class="ttic" style="background:#0b1530">${I(TTI.box, 26)}</div><div class="rc"><b>${t('System notifications')}</b><small>${t('Welcome to Trendy')}</small></div></div>${rows}</div>`);
  b.querySelectorAll('.ttrow[data-id]').forEach(e => e.onclick = () => ttOpen((r.posts || []).map(p => ({ ...p, author: r.name, username: r.username, avatar: r.avatar, mine: true })), (r.posts || []).findIndex(p => p.id === +e.dataset.id), ttInbox));
}
async function ttProfile() {
  const r = await post('getProfile'); const posts = r.posts || [];
  const b = ttShell('profile', false, `<div class="ttpr"><div class="ttpt"><button id="ttedt">${I(TTI.pen, 24)}</button></div>
    <div class="ttph"><div class="ttpi"><h2>${esc(r.name || '')}</h2><small>@${esc(r.username || '')}</small>
      <div class="ttst"><div><b>${posts.length}</b><small>${t('Videos')}</small></div><div><b>${fmt(r.likes)}</b><small>${t('Likes')}</small></div></div></div>
      ${ttAv(r.name, r.avatar, 96)}</div>
    <p class="ttbio">${esc(r.bio || '')}</p>
    <div class="ttpills"><button id="ttedt2">${I(TTI.pen, 16)} ${t('Edit profile')}</button><button id="ttnew">${I(IP.plus, 16)} ${t('Post')}</button></div>
    <div class="tttabs"><span class="on">${I(TTI.grid, 24)}</span></div>
    <div class="ttgrid" id="ttg">${posts.map(ttThumb).join('') || `<p class="empty" style="grid-column:1/-1">${t('No videos yet. Post one with +')}</p>`}</div></div>`);
  $('#ttedt').onclick = $('#ttedt2').onclick = () => ttEdit(r);
  $('#ttnew').onclick = () => newPost('trendy');
  const full = posts.map(p => ({ ...p, author: r.name, username: r.username, avatar: r.avatar, mine: true }));
  b.querySelectorAll('.ttth').forEach(e => e.onclick = () => ttOpen(full, full.findIndex(x => x.id === +e.dataset.id), ttProfile));
}
function ttEdit(r) {
  view(t('Edit profile'), `<div class="tted"><div class="tthd2"><button id="ttbk">${I(IP.arrowL, 24)}</button><b>${t('Edit profile')}</b><span></span></div>
    <div class="ttcenter"><div class="ttavc" id="ttavb">${ttAv(r.name, r.avatar, 100)}<i>${I(TTI.cam, 26)}</i></div><a id="ttph">${t('Edit photo or Avatar')}</a></div>
    <div class="ttcard"><label><span>${t('Name')}</span><input id="en" maxlength="30" value="${esc(r.name)}"></label>
      <label><span>${t('Username')}</span><input id="eu" maxlength="24" value="${esc(r.username)}"></label>
      <label><span>${t('Photo URL')}</span><input id="ea" placeholder="https://…" value="${esc(r.avatar || '')}"></label></div>
    <h5>${t('Basic info')}</h5>
    <div class="ttcard"><label><span>${t('Bio')}</span><textarea id="eb" rows="3" maxlength="80">${esc(r.bio || '')}</textarea></label></div>
    <button class="ttsave" id="esv">${t('Save')}</button></div>`, { nohdr: true, dark: false, app: 'tt tt-edit', cls: 'full' });
  $('#screen').classList.add('light');
  $('#ttbk').onclick = ttProfile;
  $('#ttavb').onclick = $('#ttph').onclick = () => $('#ea').focus();
  $('#esv').onclick = async () => {
    const x = await post('saveProfile', { name: $('#en').value.trim(), username: $('#eu').value.trim(), avatar: $('#ea').value.trim(), bio: $('#eb').value.trim() });
    if (x.ok) { toast(t('Saved')); ttProfile() } else toast(t(x.err || 'Failed'));
  };
}
/* ---------- InPic (Instagram style) ---------- */
const IGI = {
  home: '<path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>',
  reels: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"/>',
  msg: '<path d="M22 3L9.5 12.5M22 3l-7 19-3.5-9.5L2 9z"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  heartF: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" stroke="none"/>',
  cmt: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-4.5A8 8 0 1 1 21 12z"/>',
  share: '<path d="M22 3L9.5 12.5M22 3l-7 19-3.5-9.5L2 9z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  plusSq: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  dots: '<circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
};
function igAv(name, url, size = 44, ring) {
  const l = esc(String(name || '?')[0].toUpperCase());
  const img = url ? `<img src="${esc(url)}" onerror="this.remove()">` : '';
  return `<div class="ig-av ${ring ? 'ring' : ''}" style="width:${size}px;height:${size}px;font-size:${Math.round(size / 2.4)}px">${img}<span>${l}</span></div>`;
}
function igNav(tab) {
  const it = (id, ic, fill) => `<button class="${tab === id ? 'on' : ''}" data-t="${id}">${I(fill && tab === id ? fill : ic, 26)}</button>`;
  return `<nav class="ig-nav">
    ${it('home', IGI.home)}
    ${it('reels', IGI.reels)}
    ${it('new', IGI.plusSq)}
    ${it('inbox', IGI.msg)}
    ${it('profile', IGI.profile)}
  </nav>`;
}
function igShell(tab, html) {
  const b = view('InPic', html + igNav(tab), { dark: true, app: 'ig', nohdr: true, cls: 'full ig-body' });
  b.querySelectorAll('.ig-nav [data-t]').forEach(e => e.onclick = () => {
    const t = e.dataset.t;
    if (t === 'home') inpic();
    else if (t === 'reels') igReels();
    else if (t === 'new') newPost('inpic');
    else if (t === 'inbox') igInbox();
    else if (t === 'profile') igProfile();
  });
  return b;
}
function igPostCard(p) {
  const user = p.username || String(p.author || 'user').toLowerCase().replace(/[^a-z0-9._]/g, '');
  const liked = +p.liked > 0 || p.liked === true;
  return `<article class="ig-post">
    <header class="ig-ph">
      ${igAv(p.author, p.avatar, 34, true)}
      <div class="ig-ph-t"><b>${esc(user)}</b><small>${esc(p.author || '')}</small></div>
      <button class="ig-more">${I(IGI.dots, 18)}</button>
    </header>
    <div class="ig-media">${media(p.media)}</div>
    <div class="ig-acts">
      <button class="ig-lk ${liked ? 'on' : ''}" data-id="${p.id}">${I(liked ? IGI.heartF : IGI.heart, 24)}<small>${p.likes || 0}</small></button>
      <button>${I(IGI.cmt, 24)}</button>
      <button>${I(IGI.share, 22)}</button>
      <button class="ig-bm">${I(IGI.bookmark, 22)}</button>
    </div>
    ${p.caption ? `<p class="ig-cap"><b>${esc(user)}</b> ${esc(p.caption)}</p>` : ''}
  </article>`;
}
async function inpic() {
  const [r, stStories, me] = await Promise.all([
    post('getPosts', { app: 'inpic' }),
    post('getInpicStories'),
    post('getProfile', { app: 'inpic' })
  ]);
  const list = r.list || [];
  const stories = stStories.list || [];
  const meName = me.name || st.me?.name || 'You';
  const storyRow = `<div class="ig-stories">
    <div class="ig-story mine" id="igstoryme">
      ${igAv(meName, me.avatar, 58)}
      <i class="ig-add">${I(IGI.plus, 12)}</i>
      <span>${t('Your story')}</span>
    </div>
    ${stories.map(s => `<div class="ig-story ${s.has ? 'has' : ''}">
      ${igAv(s.name, s.avatar, 58, s.has)}
      <span>${esc((s.username || s.name || '').slice(0, 10))}</span>
    </div>`).join('')}
  </div>`;
  const b = igShell('home', `
    <div class="ig-top">
      <b class="ig-logo">InPic</b>
      <div class="ig-top-r">
        <button id="igheart">${I(IGI.heart, 24)}</button>
        <button id="igmsg">${I(IGI.msg, 22)}</button>
      </div>
    </div>
    ${storyRow}
    <div class="ig-feed" id="igfeed">
      ${list.map(igPostCard).join('') || `<p class="empty ig-empty">${t('No posts yet.')}<br><small>${t('Tap + to share a photo')}</small></p>`}
    </div>`);
  $('#igmsg').onclick = igInbox;
  $('#igheart').onclick = () => toast(t('Activity'));
  $('#igstoryme').onclick = () => newPost('inpic');
  b.querySelectorAll('.ig-lk').forEach(e => e.onclick = async () => {
    const x = await post('like', { id: +e.dataset.id });
    if (x.ok) {
      e.classList.toggle('on', x.liked);
      e.innerHTML = `${I(x.liked ? IGI.heartF : IGI.heart, 24)}<small>${x.likes}</small>`;
    }
  });
}
async function igReels() {
  const r = await post('getPosts', { app: 'inpic' });
  const list = r.list || [];
  const b = igShell('reels', `
    <div class="ig-search-top">
      <div class="ig-search"><span>${I(IGI.search, 16)}</span><input id="igreelsq" placeholder="${t('Search')}" autocomplete="off"></div>
    </div>
    <div class="ig-chips">
      <button class="on">${t('For you')}</button>
      <button>Gaming</button>
      <button>Cars</button>
      <button>Music</button>
    </div>
    <div class="ig-grid" id="iggrid">
      ${list.map(p => `<div class="ig-cell" data-id="${p.id}">
        ${media(p.media)}
        <span class="ig-views">♥ ${fmt(p.likes || 0)}</span>
      </div>`).join('') || `<p class="empty ig-empty" style="grid-column:1/-1">${t('No posts yet.')}</p>`}
    </div>`);
  const all = list;
  b.querySelectorAll('.ig-cell').forEach(e => e.onclick = () => {
    const id = +e.dataset.id;
    const i = all.findIndex(x => x.id === id);
    igOpenPost(all, Math.max(0, i));
  });
  $('#igreelsq').oninput = () => {
    const q = $('#igreelsq').value.trim().toLowerCase();
    const filtered = !q ? all : all.filter(p => (p.caption || '').toLowerCase().includes(q) || (p.author || '').toLowerCase().includes(q));
    $('#iggrid').innerHTML = filtered.map(p => `<div class="ig-cell" data-id="${p.id}">${media(p.media)}<span class="ig-views">♥ ${fmt(p.likes || 0)}</span></div>`).join('') || `<p class="empty ig-empty" style="grid-column:1/-1">${t('No results')}</p>`;
    $('#iggrid').querySelectorAll('.ig-cell').forEach(e => e.onclick = () => {
      const id = +e.dataset.id;
      igOpenPost(filtered, filtered.findIndex(x => x.id === id));
    });
  };
}
function igOpenPost(list, idx) {
  const p = list[idx]; if (!p) return;
  const b = view(p.username || p.author || 'Post', `
    <div class="ig-single">${igPostCard(p)}</div>
  `, { dark: true, app: 'ig', back: igReels });
  b.querySelectorAll('.ig-lk').forEach(e => e.onclick = async () => {
    const x = await post('like', { id: +e.dataset.id });
    if (x.ok) {
      e.classList.toggle('on', x.liked);
      e.innerHTML = `${I(x.liked ? IGI.heartF : IGI.heart, 24)}<small>${x.likes}</small>`;
    }
  });
}
async function igInbox() {
  const [prof, posts, conv] = await Promise.all([
    post('getProfile', { app: 'inpic' }),
    post('getPosts', { app: 'inpic' }),
    post('getConversations')
  ]);
  const mine = (posts.list || []).filter(p => p.mine);
  const convs = (conv.list || conv.conversations || conv) || [];
  const list = Array.isArray(convs) ? convs : [];
  const rows = list.slice(0, 30).map(c => {
    const name = c.name || c.number || 'User';
    const preview = c.last || c.text || c.preview || '';
    const time = c.time || c.ago || '';
    return `<div class="ig-dm" data-n="${esc(c.number || '')}" data-name="${esc(name)}">
      ${igAv(name, c.avatar, 52)}
      <div class="ig-dm-t"><b>${esc(name)}</b><small>${esc(preview)}</small></div>
      <span class="ig-dm-time">${esc(String(time))}</span>
    </div>`;
  }).join('');
  const activity = mine.slice(0, 5).map(p => `<div class="ig-dm">
    ${igAv(prof.name, prof.avatar, 52)}
    <div class="ig-dm-t"><b>${esc(prof.username || prof.name)}</b><small>${t('Your post')} · ${p.likes || 0} ${t('Likes').toLowerCase()}</small></div>
  </div>`).join('');
  const b = igShell('inbox', `
    <div class="ig-top">
      <button id="igbkhome">${I(IGI.back, 22)}</button>
      <b class="ig-user">${esc(prof.username || prof.name || 'you')} ▾</b>
      <button id="ignewmsg">${I(IGI.plus, 22)}</button>
    </div>
    <div class="ig-search-top"><div class="ig-search"><span>${I(IGI.search, 16)}</span><input placeholder="${t('Search')}" readonly></div></div>
    <div class="ig-notes">
      <div class="ig-note">
        ${igAv(prof.name, prof.avatar, 56)}
        <span>${t('Your note')}</span>
      </div>
    </div>
    <div class="ig-tabs-pill">
      <button class="on" data-tab="primary">${t('Primary')}</button>
      <button data-tab="activity">${t('Activity')}</button>
      <button data-tab="general">${t('General')}</button>
    </div>
    <div class="ig-dm-list" id="igdms">${rows || `<p class="empty ig-empty">${t('No messages yet.')}</p>`}</div>
  `);
  $('#igbkhome').onclick = inpic;
  $('#ignewmsg').onclick = () => toast(t('Coming soon'));
  b.querySelectorAll('.ig-dm[data-n]').forEach(e => {
    e.onclick = () => {
      const n = e.dataset.n;
      if (n && typeof whatsnow === 'function') {
        // open chat if whatsnow exists - fallback toast
        toast(n);
      }
    };
  });
  b.querySelectorAll('.ig-tabs-pill button').forEach(btn => btn.onclick = () => {
    b.querySelectorAll('.ig-tabs-pill button').forEach(x => x.classList.remove('on'));
    btn.classList.add('on');
    if (btn.dataset.tab === 'activity') $('#igdms').innerHTML = activity || `<p class="empty ig-empty">${t('No activity')}</p>`;
    else $('#igdms').innerHTML = rows || `<p class="empty ig-empty">${t('No messages yet.')}</p>`;
  });
}
async function igProfile() {
  const r = await post('getProfile', { app: 'inpic' });
  const posts = r.posts || [];
  const b = igShell('profile', `
    <div class="ig-top">
      <b class="ig-user">${esc(r.username || 'user')} ▾</b>
      <div class="ig-top-r">
        <button id="igpnew">${I(IGI.plusSq, 22)}</button>
        <button id="igpset">${I(IGI.menu, 22)}</button>
      </div>
    </div>
    <div class="ig-prof">
      <div class="ig-prof-h">
        ${igAv(r.name, r.avatar, 86, true)}
        <div class="ig-stats">
          <div><b>${posts.length}</b><small>${t('Posts')}</small></div>
          <div><b>${fmt(r.followers || 0)}</b><small>${t('Followers')}</small></div>
          <div><b>${fmt(r.following || 0)}</b><small>${t('Following')}</small></div>
        </div>
      </div>
      <div class="ig-bio">
        <b>${esc(r.name || '')}</b>
        ${r.bio ? `<p>${esc(r.bio)}</p>` : `<p class="muted">${t('Gaming video creator')}</p>`}
      </div>
      <div class="ig-prof-btns">
        <button id="igedit">${t('Edit profile')}</button>
        <button id="igshare">${t('Share profile')}</button>
      </div>
      <div class="ig-ptabs">
        <button class="on">${I(IGI.grid, 22)}</button>
        <button>${I(IGI.reels, 22)}</button>
      </div>
      <div class="ig-pgrid">
        ${posts.map(p => `<div class="ig-cell" data-id="${p.id}">${media(p.media)}</div>`).join('')
          || `<div class="ig-empty-grid"><div class="ig-empty-ico">${I(IGI.cam, 36)}</div><b>${t('Create your first post')}</b></div>`}
      </div>
    </div>`);
  $('#igpnew').onclick = () => newPost('inpic');
  $('#igedit').onclick = () => igEdit(r);
  $('#igshare').onclick = () => toast('@' + (r.username || 'user'));
  $('#igpset').onclick = igSettings;
  const full = posts.map(p => ({ ...p, author: r.name, username: r.username, avatar: r.avatar, mine: true }));
  b.querySelectorAll('.ig-pgrid .ig-cell').forEach(e => e.onclick = () => {
    const i = full.findIndex(x => x.id === +e.dataset.id);
    if (i >= 0) igOpenPost(full, i);
  });
}
function igEdit(r) {
  view(t('Edit profile'), `
    <div class="ig-edit">
      <div class="ig-edit-av" id="igav">${igAv(r.name, r.avatar, 96)}</div>
      <label>${t('Name')}<input id="igname" value="${esc(r.name || '')}" maxlength="30"></label>
      <label>${t('Username')}<input id="iguser" value="${esc(r.username || '')}" maxlength="24"></label>
      <label>${t('Bio')}<input id="igbio" value="${esc(r.bio || '')}" maxlength="80"></label>
      <label>${t('Avatar URL')}<input id="igavatar" value="${esc(r.avatar || '')}" placeholder="https://…"></label>
      <button class="btn" id="igsave">${t('Save')}</button>
    </div>
  `, { dark: true, app: 'ig', back: igProfile });
  $('#igsave').onclick = async () => {
    const x = await post('saveProfile', {
      name: $('#igname').value.trim(),
      username: $('#iguser').value.trim(),
      bio: $('#igbio').value.trim(),
      avatar: $('#igavatar').value.trim()
    });
    if (x.ok) { toast(t('Saved')); igProfile(); }
    else toast(x.err || t('Failed'));
  };
}
function igSettings() {
  view(t('Settings and activity'), `
    <div class="ig-set">
      <div class="ig-set-sec">${t('Your account')}</div>
      <div class="ig-set-row"><span>${t('Meta Account')}</span><small>${t('Password, security')}</small></div>
      <div class="ig-set-sec">${t('How you use Instagram')}</div>
      <div class="ig-set-row">${t('Saved')}</div>
      <div class="ig-set-row">${t('Archive')}</div>
      <div class="ig-set-row">${t('Your activity')}</div>
      <div class="ig-set-row">${t('Notifications')}</div>
      <div class="ig-set-sec">${t('Subscriptions')}</div>
      <div class="ig-set-row"><span>Meta One</span><small>${t('Not subscribed')}</small></div>
    </div>
  `, { dark: true, app: 'ig', back: igProfile });
}
async function newPost(app, prefill) {
  const back = app === 'trendy' ? trendy : inpic;
  const isIg = app === 'inpic';
  let selectedMedia = (prefill && prefill.media) || '';
  let selectedPhotoId = (prefill && prefill.photoId) || null;
  let selectedKind = (prefill && prefill.kind) || 'photo';
  const pickList = () => (st.ph || []).filter(p => isIg ? p.kind !== 'video' : true).slice(0, 24);

  // load gallery thumbs for InPic
  let gallery = '';
  {
    try {
      const r = await post('getPhotos');
      st.ph = r.list || (r.ids || []).map(id => ({ id, ts: Date.now() / 1000 }));
      const ids = pickList();
      gallery = `<div class="ig-pick-label">${t(isIg ? 'Your photos' : 'Photos & videos')}</div>
        <div class="ig-pick-grid" id="igpick">
          <button type="button" class="ig-pick-cam" id="igopencam">
            <span>${I(IGI.cam, 28)}</span>
            <small>${t('Camera')}</small>
          </button>
          ${ids.map(ph => `<button type="button" class="ig-pick-ph ${ph.kind === 'video' ? 'vid' : ''}" data-id="${ph.id}" data-kind="${ph.kind === 'video' ? 'video' : 'photo'}" id="igph${ph.id}">${ph.kind === 'video' ? '<i>▶</i>' : ''}</button>`).join('')}
        </div>`;
    } catch (e) {
      gallery = `<div class="ig-pick-grid"><button type="button" class="ig-pick-cam" id="igopencam"><span>${I(IGI.cam, 28)}</span><small>${t('Camera')}</small></button></div>`;
    }
  }

  view(t(isIg ? 'New post' : 'New post'), `
    <div class="ig-new">
      <div class="ig-new-preview ${selectedMedia ? 'has' : ''}" id="igprev">
        ${selectedMedia ? media(selectedMedia) : `<span>${I(IGI.cam, 40)}</span><small>${t(isIg ? 'Choose a photo' : 'Choose a photo or video')}</small>`}
        ${selectedMedia && selectedKind === 'video' ? '<b class="ig-play">▶</b>' : ''}
      </div>
      ${gallery}
      ${isIg ? '' : `<input id="pu" placeholder="${t('Image or video URL (https://…)')}" autocomplete="off">`}
      <input id="pc" placeholder="${t('Caption')}" maxlength="150" autocomplete="off" value="${esc((prefill && prefill.caption) || '')}">
      <button class="btn" id="pp">${t('Share')}</button>
      ${isIg ? `<button class="btn ig-url-toggle" id="igurlbtn" style="background:#262626">${t('Use link instead')}</button>
        <input id="pu" class="hidden" placeholder="${t('Image or video URL (https://…)')}" autocomplete="off">` : ''}
    </div>
  `, { dark: true, app: isIg ? 'ig' : '', back });

  const setPreview = (src, kind) => {
    selectedMedia = src || '';
    selectedKind = kind || 'photo';
    const box = $('#igprev');
    if (src) {
      box.innerHTML = media(src) + (selectedKind === 'video' ? '<b class="ig-play">▶</b>' : '');
      box.classList.add('has');
    } else {
      box.innerHTML = `<span>${I(IGI.cam, 40)}</span><small>${t(isIg ? 'Choose a photo' : 'Choose a photo or video')}</small>`;
      box.classList.remove('has');
    }
  };

  // load gallery thumbs async
  {
    pickList().forEach(async (ph) => {
      try {
        if (!st.pc[ph.id]) {
          const x = await post('getPhoto', { id: +ph.id, thumb: true });
          if (x && x.data) st.pc[ph.id] = x.data;
        }
        const el = document.getElementById('igph' + ph.id);
        if (el && st.pc[ph.id]) {
          el.style.backgroundImage = `url(${st.pc[ph.id]})`;
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
        }
      } catch (_) {}
    });

    document.querySelectorAll('.ig-pick-ph').forEach(btn => {
      btn.onclick = async () => {
        document.querySelectorAll('.ig-pick-ph').forEach(x => x.classList.remove('on'));
        btn.classList.add('on');
        const id = +btn.dataset.id;
        selectedPhotoId = id;
        if (btn.dataset.kind === 'video') {          // video: the server copies it, the preview is its poster
          if (!st.pc[id]) { const x = await post('getPhoto', { id, thumb: true }); if (x && x.data) st.pc[id] = x.data }
          return setPreview(st.pc[id] || '', 'video');
        }
        // prefer full image for post
        const full = await post('getPhoto', { id, thumb: false });
        if (full && full.data) {
          setPreview(full.data);
          selectedMedia = full.data;
        } else if (st.pc[id]) {
          setPreview(st.pc[id]);
          selectedMedia = st.pc[id];
        }
      };
    });

    const camBtn = $('#igopencam');
    if (camBtn) camBtn.onclick = async () => {
      st.igCompose = true; st.composeApp = app;
      await post('setCamCompose', { on: true, app });
      post('startCamera');
    };

    const urlBtn = $('#igurlbtn');
    if (urlBtn) urlBtn.onclick = () => {
      const pu = $('#pu');
      pu.classList.toggle('hidden');
      if (!pu.classList.contains('hidden')) pu.focus();
    };
  }

  const pu = $('#pu');
  if (pu) pu.oninput = () => {
    const u = pu.value.trim();
    selectedPhotoId = null;
    if (/^https?:\/\//i.test(u) || u.startsWith('data:image/')) setPreview(u);
  };

  $('#pp').onclick = async () => {
    const caption = ($('#pc') && $('#pc').value.trim()) || '';
    const urlVal = ($('#pu') && $('#pu').value.trim()) || '';
    let payload = { app, caption };
    if (selectedPhotoId) {
      payload.photoId = selectedPhotoId;
    } else if (selectedMedia && selectedMedia.startsWith('data:image/')) {
      payload.media = selectedMedia;
    } else if (/^https?:\/\//i.test(urlVal)) {
      payload.media = urlVal;
    } else if (/^https?:\/\//i.test(selectedMedia)) {
      payload.media = selectedMedia;
    } else {
      return toast(t('Choose a photo') || 'Choose a photo');
    }
    const x = await post('post', payload);
    st.igCompose = false;
    if (x.ok) back();
    else toast(x.err || t('Failed'));
  };
}


/* ---------- Calculator ---------- */
function calc() {
  const keys = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '='];
  const b = view(t('Calculator'), `<div class="cd" id="cd">0</div><div class="ck">${keys.map(k => `<button data-k="${k}" class="${'÷×−+='.includes(k) ? 'op' : 'C±%'.includes(k) ? 'fn' : ''} ${k === '0' ? 'z' : ''}">${k}</button>`).join('')}</div>`, { dark: true });
  let cur = '0', acc = null, op = null, fresh = true;
  const out = () => { const t = cur.length > 10 && !isNaN(cur) ? String(+(+cur).toPrecision(8)) : cur; $('#cd').textContent = t };
  const run = () => { const a = acc, x = +cur; if (op === '+') return a + x; if (op === '−') return a - x; if (op === '×') return a * x; if (op === '÷') return x === 0 ? NaN : a / x; return x };
  const num = v => isNaN(v) ? 'Error' : String(+v.toFixed(10));
  b.querySelectorAll('[data-k]').forEach(e => e.onclick = () => {
    const k = e.dataset.k;
    if (/\d/.test(k)) { cur = fresh || cur === 'Error' ? k : cur + k; fresh = false }
    else if (k === '.') { if (fresh) { cur = '0.'; fresh = false } else if (!cur.includes('.')) cur += '.' }
    else if (k === 'C') { cur = '0'; acc = null; op = null; fresh = true }
    else if (cur === 'Error') return;
    else if (k === '±') cur = String(-cur);
    else if (k === '%') cur = String(+cur / 100);
    else if (k === '=') { if (op) { cur = num(run()); acc = null; op = null; fresh = true } }
    else { if (op && !fresh) cur = num(run()); acc = +cur; op = k; fresh = true }
    out();
  });
}

/* ---------- Services ---------- */
async function services() {
  const r = await post('getServices');
  const b = view(t('Services'), `<div class="list">${(r.list || []).map(j => `<div class="row" style="cursor:default"><div class="av">${esc((j.label || '?')[0])}</div><div class="rc"><b>${esc(j.label)}</b><small>${j.onduty} ${t('on duty')}</small></div><button class="btn sm" data-j="${esc(j.name)}">${t('Request')}</button></div>`).join('') || `<p class="empty">${t('No services available.')}</p>`}</div>`);
  b.querySelectorAll('[data-j]').forEach(e => e.onclick = async () => { const x = await post('requestService', { job: e.dataset.j }); toast(x.ok ? t('Request sent') : (x.err || t('Failed'))) });
}

/* ---------- Dynamic Island: removed (Samsung notification shade + heads-up banner instead) ---------- */
function islandIdle() { const n = $('#notch'); if (n) { n.className = ''; n.innerHTML = '' } st.isBig = false }
function island() { }

/* ---------- Shared YouTube player (hidden for Music, docked for YouTube) ---------- */
const yt = { p: null, api: false, ready: false, pending: null, mode: 'audio', drag: false };
const ytBox = (() => { const b = document.createElement('div'); b.id = 'ytbox'; b.innerHTML = '<div id="ytp"></div>'; document.body.appendChild(b); return b })();
/* Expand (big) mode for videos: our own fullscreen, ESC = back to the normal phone */
var ytBig = false, ytSaved = '';
const ytFs = (() => {
  const b = document.createElement('button'); b.id = 'ytfs'; b.type = 'button'; b.setAttribute('aria-label', 'Expand');
  document.body.appendChild(b); return b;
})();
const YT_ICO = {
  on: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  off: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
};
function ytFsShow(show) { ytFs.style.display = show ? 'flex' : 'none'; if (show) ytFs.innerHTML = ytBig ? YT_ICO.off : YT_ICO.on }
function ytFsPos(el) {
  if (ytBig || !el) return;
  const r = el.getBoundingClientRect();
  ytFs.style.left = (r.right - 36) + 'px'; ytFs.style.top = (r.top + 6) + 'px'; ytFs.style.right = 'auto';
  ytFsShow(yt.mode === 'video');
}
function ytExpand(on) {
  on = !!on; if (on === ytBig) return;
  if (document.fullscreenElement) { try { document.exitFullscreen() } catch (e) { } }
  if (on) {
    ytSaved = ytBox.style.cssText; ytBig = true;
    Object.assign(ytBox.style, { left: '0px', top: '0px', width: '100vw', height: '100vh', borderRadius: '0px', zIndex: '9990', opacity: '1', pointerEvents: 'auto' });
    ytFs.style.left = 'auto'; ytFs.style.right = '12px'; ytFs.style.top = '12px'; ytFsShow(true);
  } else {
    ytBig = false; ytBox.style.cssText = ytSaved;
    const vs = $('#vslot'); if (vs && yt.mode === 'video') ytFsPos(vs); else ytFsShow(false);
  }
}
ytFs.onclick = e => { e.stopPropagation(); ytExpand(!ytBig) };
/* the YouTube iframe steals keyboard focus; give it back so ESC always reaches the phone */
window.addEventListener('blur', () => setTimeout(() => {
  const a = document.activeElement;
  if (a && a.tagName === 'IFRAME' && a.id === 'ytf') { a.blur(); window.focus() }
}, 60));
function ytUndock() { if (ytBig) { ytBig = false; ytBox.style.cssText = '' } ytFsShow(false); Object.assign(ytBox.style, { left: '0px', top: '0px', width: '356px', height: '220px', opacity: '0', pointerEvents: 'none', zIndex: '-1', borderRadius: '10px' }) }
function ytDock(el, flat) { const r = el.getBoundingClientRect(); Object.assign(ytBox.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', opacity: '1', pointerEvents: 'auto', zIndex: '5', borderRadius: flat ? '0px' : '10px' }) }
ytUndock();
function ytLoad() {
  return new Promise((res, rej) => {
    if (yt.api) return res();
    const to = setTimeout(() => rej(new Error('YouTube script blocked')), 10000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(to); yt.api = true; res() };
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => { clearTimeout(to); rej(new Error('YouTube script blocked')) };
    document.head.appendChild(s);
  });
}
async function ytPlay(id, ctl = 1) {
  try { await ytLoad() } catch (e) { toast(t('Search failed')); console.error(e); return }
  if (yt.p && yt.ready && yt.ctl !== ctl) { try { yt.p.destroy() } catch (e) { } yt.p = null; yt.ready = false; ytBox.innerHTML = '' }
  if (yt.p && !yt.ready) { yt.pending = id; return }
  if (yt.p) return yt.p.loadVideoById(id);
  yt.ctl = ctl;
  const f = document.createElement('iframe');
  f.id = 'ytf';
  f.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?enablejsapi=1&autoplay=1&playsinline=1&rel=0&modestbranding=1&fs=0&controls=' + ctl + (ctl ? '' : '&disablekb=1&iv_load_policy=3') + (location.origin.startsWith('http') ? '&origin=' + encodeURIComponent(location.origin) : '');
  f.allow = 'autoplay; encrypted-media; picture-in-picture';
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  ytBox.innerHTML = ''; ytBox.appendChild(f);
  yt.p = new YT.Player(f, {
    events: {
      onReady: e => { yt.ready = true; if (yt.pending) { e.target.loadVideoById(yt.pending); yt.pending = null } else e.target.playVideo() },
      onError: e => { console.error('YT error', e.data); if (yt.mode === 'short') { ysLast = 0; ysStep(1) } else toast('YouTube error ' + e.data) },
      onStateChange: e => {
        if (yt.mode === 'short') { if (e.data === 0) { e.target.seekTo(0, true); e.target.playVideo() } else if (e.data === 1) ysPlaying(); return }
        if (e.data === 1) st.mus.playing = true; else if (e.data === 2) st.mus.playing = false;
        if (e.data === 0 && yt.mode === 'audio') { if (st.mus.rep) { e.target.seekTo(0, true); e.target.playVideo() } else musStep(1) }
        musSync();
      },
    },
  });
}
function ytStop() {
  ytShOff();
  if (yt.p && yt.ready) { try { yt.p.stopVideo() } catch (e) { } }
  yt.mode = 'audio'; ytUndock(); st.mus.playing = false;
}
const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
setInterval(() => {
  if (!yt.ready || !yt.p || !yt.p.getDuration || yt.mode !== 'audio') return;
  const sk = $('#mseek'); if (!sk || yt.drag) return;
  const d = yt.p.getDuration() || 0, c = yt.p.getCurrentTime() || 0;
  sk.value = d ? (c / d) * 100 : 0; sk.style.setProperty('--v', sk.value + '%'); $('#mp').textContent = mmss(c); $('#md').textContent = mmss(d);
}, 500);

/* ---------- Music ---------- */
function musSync() {
  document.querySelectorAll('.ppb').forEach(b => b.innerHTML = ppIcon(st.mus.playing, b.classList.contains('big') ? 40 : 22));
  const m = $('#mini'), c = st.mus.cur;
  if (m && c) { m.querySelector('b').textContent = c.title; m.querySelector('img').src = c.thumb }
  if (st.musRefresh) st.musRefresh();
  qsMedia();
  if (!st.isBig) islandIdle();
}
function musPlay(list, i) {
  st.mus.list = list; st.mus.idx = i; st.mus.cur = list[i]; st.mus.playing = true;
  yt.mode = 'audio'; ytUndock(); ytPlay(list[i].id);
  const c = list[i];
  musSync();
}
function musStep(d) { const L = st.mus.list; if (!L.length) return; let i = (st.mus.idx + d + L.length) % L.length; if (st.mus.shuf && L.length > 1) { do { i = Math.floor(Math.random() * L.length) } while (i === st.mus.idx) } musPlay(L, i) }
function musToggle() { if (yt.p && yt.ready) st.mus.playing ? yt.p.pauseVideo() : yt.p.playVideo() }

async function music() {
  const mini = st.mus.cur ? `<div class="mini2" id="mini"><img src="${esc(st.mus.cur.thumb)}"><div class="rc"><b>${esc(st.mus.cur.title)}</b></div><button class="ppb" id="mpp">${ppIcon(st.mus.playing, 22)}</button><button id="mnx">${I(IP.next, 20)}</button></div>` : '';
  const b = view(t('Music'), `<div class="mph"><button id="mcl">${I(IP.chev, 26)}</button><b class="mttl">${t('Music')}</b></div><div class="form" style="margin:0 0 8px"><input id="mq" placeholder="${t('Search')}" value="${esc(st.mq || '')}"></div><div class="scr" id="ml"><p class="empty">${t('Loading…')}</p></div>${mini}`, { cls: 'flex', dark: true, app: 'mus', nohdr: true });
  $('#mcl').onclick = home;
  const ml = $('#ml');
  const draw = l => {
    ml.innerHTML = l.length ? `<div class="list">${l.map((v, i) => `<div class="row" data-i="${i}"><img class="th" src="${esc(v.thumb)}"><div class="rc"><b>${esc(v.title)}</b><small>${esc(v.channel)}</small></div></div>`).join('')}</div>` : `<p class="empty">${t('No results')}</p>`;
    ml.querySelectorAll('.row').forEach(e => e.onclick = () => { musPlay(l, +e.dataset.i); player() });
  };
  const load = async q => {
    st.mq = q; ml.innerHTML = `<p class="empty">${t('Loading…')}</p>`;
    const r = await post(q ? 'ytSearch' : 'ytTrending', { q, music: true, region: st.settings.ytRegion || 'US' });
    if (!$('#ml')) return;
    if (!r.ok) ml.innerHTML = `<p class="empty">${esc(t(r.err || 'Search failed'))}</p>`; else { st.mus.results = r.list; draw(r.list) }
  };
  $('#mq').onkeydown = e => { if (e.key === 'Enter') load($('#mq').value.trim()) };
  if (st.mus.results) draw(st.mus.results); else load('');
  if (st.mus.cur) {
    $('#mpp').onclick = e => { e.stopPropagation(); musToggle() };
    $('#mnx').onclick = e => { e.stopPropagation(); musStep(1) };
    $('#mini').onclick = player;
  }
}
function player() {
  if (!st.mus.cur) return music();
  view(t('Now Playing'), `<div class="mp">
    <div class="mpt0"><button id="mbk">${I(IP.chev, 28)}</button><span class="mpi"><button>${I(IP.vol, 22)}</button><button>${I(IP.eq, 22)}</button><button class="od">${I(IP.dots, 22)}</button></span></div>
    <div class="cov"><img class="cover" id="ncv" alt=""><div class="cph" id="cph">${I(IP.note, 64)}</div></div>
    <div class="mqt" id="mqt"><span id="nt"></span></div><small class="mart" id="nc"></small>
    <div class="mpr"><button>${I(IP.queue, 24)}</button><button id="mlk">${I(IP.heart, 24)}</button><button>${I(IP.plus, 24)}</button></div>
    <div class="msk"><input type="range" class="mseek" id="mseek" min="0" max="100" step="0.1" value="0"><div class="tm"><small id="mp">0:00</small><small id="md">0:00</small></div></div>
    <div class="mpc"><button id="msh" class="${st.mus.shuf ? 'on' : ''}">${I(IP.shuf, 22)}</button><button id="mpv">${I(IP.prev, 30)}</button><button class="ppb big" id="mpp">${ppIcon(st.mus.playing, 40)}</button><button id="mnx">${I(IP.next, 30)}</button><button id="mrp" class="${st.mus.rep ? 'on' : ''}">${I(IP.rep, 22)}</button></div>
  </div>`, { dark: true, app: 'mus', nohdr: true, cls: 'full' });
  st.musRefresh = () => {
    const c = st.mus.cur; if (!c || !$('#nt')) return;
    const im = $('#ncv'); im.onload = () => { im.style.display = 'block'; $('#cph').style.display = 'none' };
    im.src = c.thumb.replace('mqdefault', 'hqdefault');
    $('#nt').textContent = c.title; $('#nc').textContent = c.channel;
    const box = $('#mqt'), sp = $('#nt'), d = sp.offsetWidth - box.offsetWidth;
    box.classList.toggle('run', d > 0); if (d > 0) box.style.setProperty('--d', d + 'px');
  };
  st.musRefresh();
  $('#mbk').onclick = music;
  $('#mpp').onclick = musToggle; $('#mnx').onclick = () => musStep(1); $('#mpv').onclick = () => musStep(-1);
  $('#mlk').onclick = e => e.currentTarget.classList.toggle('on');
  $('#msh').onclick = e => { st.mus.shuf = !st.mus.shuf; e.currentTarget.classList.toggle('on', st.mus.shuf) };
  $('#mrp').onclick = e => { st.mus.rep = !st.mus.rep; e.currentTarget.classList.toggle('on', st.mus.rep) };
  const sk = $('#mseek');
  sk.oninput = () => { yt.drag = true; sk.style.setProperty('--v', sk.value + '%') };
  sk.onchange = () => { yt.drag = false; if (yt.p && yt.ready) yt.p.seekTo(yt.p.getDuration() * sk.value / 100, true) };
}

/* ---------- YouTube (dark app style) ---------- */
Object.assign(IP, {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  hist: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>', nw: '<path d="M18 18L7 7M7 16V7h9"/>',
  like: '<path d="M7 11v9H4v-9zM7 11l4-8c1.6 0 2.5 1.2 2 3l-.7 3H19a2 2 0 0 1 2 2.4l-1.4 6.4A2 2 0 0 1 17.7 20H7"/>',
  dislike: '<path d="M7 13V4H4v9zM7 13l4 8c1.6 0 2.5-1.2 2-3l-.7-3H19a2 2 0 0 0 2-2.4l-1.4-6.4A2 2 0 0 0 17.7 4H7"/>',
  share: '<path d="M14 4l7 6-7 6v-4c-6 0-9 2-11 6 .5-6 4-10 11-10z"/>', spark: '<path d="M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7z" fill="currentColor"/>',
  yhome: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="currentColor" stroke="none"/>', yshorts: '<path d="M9 3l7 4-3 1.5 3 1.5-8 4.5-7-4 3-1.5-3-1.5z M10 14l4 2-3 1.5" /><path d="M8 20l8-4.5"/>',
  subs: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M6 5h12M9 2h6M10 12l5 3-5 3z"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>',
});
const YTLOGO = `<svg width="26" height="18" viewBox="0 0 26 18"><rect width="26" height="18" rx="5" fill="#ff0000"/><path d="M10 5l7 4-7 4z" fill="#fff"/></svg><b>YouTube</b>`;
const yhGet = () => { try { return JSON.parse(localStorage.getItem('ios_yt_h') || '[]') } catch (e) { return [] } };
const yhSet = a => { try { localStorage.setItem('ios_yt_h', JSON.stringify(a.slice(0, 20))) } catch (e) { } };
const avc = n => `hsl(${[...String(n)].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 45% 38%)`;
const ytMeta = v => esc(v.channel) + (v.pub && Date.parse(v.pub) ? ' · ' + ago(Date.parse(v.pub) / 1000) : '');
const ytCard = (v, i) => `<div class="yc" data-i="${i}"><div class="yth"><img src="${esc(v.thumb)}"></div><div class="ycm">${yavH(v.channel, v.avatar, v.cid)}<div class="yct"><b>${esc(v.title)}</b><small>${ytMeta(v)}</small></div><span class="ydt">${I(IP.dots, 18)}</span></div></div>`;
const ytBind = (root, list, from) => root.querySelectorAll('.yc').forEach(e => {
  e.onclick = () => { st.yfrom = from; watch(list[+e.dataset.i], list) };
  const av = e.querySelector('.yav'), v = list[+e.dataset.i];
  if (av && v && v.cid) av.onclick = ev => { ev.stopPropagation(); ychannel(v.cid, ybackFor(from)) };
});
const ytBody = (html) => view(t('YouTube'), html, { dark: true, app: 'yt', nohdr: true, cls: 'full ytb' });

async function youtube() {
  if (yt.mode !== 'audio') ytStop();
  const reg = (st.settings.ytRegion || 'US').toUpperCase();
  ytBody(`<div class="yh"><span class="ylg">${YTLOGO}</span><span class="yhi"><button id="yreg" class="yreg-btn" title="Region">${esc(reg)}</button><span>${I(IP.bell, 22)}</span><button id="ysb">${I(IP.search, 22)}</button></span></div>
    <div class="scr" id="yl"><p class="empty">${t('Loading…')}</p></div>
    ${ynav('h')}`);
  ynavBind();
  $('#ysb').onclick = () => ysearch('');
  $('#yreg').onclick = () => ytRegionPicker();
  const yl = $('#yl');
  const draw = l => { yl.innerHTML = l.length ? l.map(ytCard).join('') : `<p class="empty">${t('No results')}</p>`; ytBind(yl, l, 'h') };
  if (st.yhome) return draw(st.yhome);
  const r = await post('ytTrending', { q: '', music: false, region: st.settings.ytRegion || 'US' });
  if (!$('#yl')) return;
  if (!r.ok) yl.innerHTML = `<p class="empty">${esc(t(r.err || 'Search failed'))}</p>`; else { st.yhome = r.list; draw(r.list) }
}
function ytRegionPicker() {
  const opts = [
    { c: 'US', n: 'USA' }, { c: 'DZ', n: 'Algérie / DZ' }, { c: 'GB', n: 'UK' }, { c: 'FR', n: 'France' },
    { c: 'MA', n: 'Maroc' }, { c: 'DE', n: 'Deutschland' }, { c: 'ES', n: 'España' }, { c: 'CA', n: 'Canada' }
  ];
  const cur = (st.settings.ytRegion || 'US').toUpperCase();
  ytBody(`<div class="yh"><span class="ylg">${YTLOGO}</span><span class="yhi"><button id="ybk">${I(IP.arrowL, 22)}</button></span></div>
    <div class="scr" style="padding:12px">
      <p style="opacity:.7;margin:0 0 12px;font-size:13px">${t('Choose YouTube region') || 'Choose YouTube region / بلد يوتيوب'}</p>
      ${opts.map(o => `<button class="ss-row yt-reg-opt" data-c="${o.c}" style="width:100%;text-align:left;border:0;background:${o.c===cur?'rgba(47,107,255,.15)':'transparent'};padding:14px 16px;border-radius:12px;margin-bottom:6px;cursor:pointer">
        <b>${esc(o.n)}</b> <small style="opacity:.6">${o.c}</small>${o.c===cur?' ✓':''}
      </button>`).join('')}
    </div>`);
  $('#ybk').onclick = () => { st.yhome = null; youtube(); };
  document.querySelectorAll('.yt-reg-opt').forEach(btn => btn.onclick = () => {
    st.settings.ytRegion = btn.dataset.c;
    st.yhome = null;
    save();
    toast((t('Region') || 'Region') + ': ' + btn.dataset.c);
    youtube();
  });
}
async function ysearch(q0) {
  if (yt.mode !== 'audio') ytStop();
  ytBody(`<div class="ysr"><button id="ybk">${I(IP.arrowL, 22)}</button><input id="yq" placeholder="${t('Search YouTube')}" value="${esc(q0 || '')}"><button class="ymic">${I(IP.mic, 20)}</button></div><div class="scr" id="yl"></div>`);
  const yl = $('#yl'), inp = $('#yq');
  $('#ybk').onclick = youtube;
  const hist = () => {
    const h = yhGet();
    yl.innerHTML = h.map((x, i) => `<div class="yhr" data-i="${i}"><span class="yhc">${I(IP.hist, 22)}</span><span class="yhq">${esc(x.q)}</span>${x.thumb ? `<img src="${esc(x.thumb)}">` : ''}<button class="yar">${I(IP.nw, 20)}</button></div>`).join('') || `<p class="empty">${t('No results')}</p>`;
    yl.querySelectorAll('.yhr').forEach(e => {
      const x = h[+e.dataset.i];
      e.onclick = () => { inp.value = x.q; load(x.q) };
      e.querySelector('.yar').onclick = ev => { ev.stopPropagation(); inp.value = x.q; inp.focus() };
    });
  };
  const draw = l => { yl.innerHTML = l.length ? l.map(ytCard).join('') : `<p class="empty">${t('No results')}</p>`; ytBind(yl, l, 's') };
  const load = async q => {
    if (!q) return hist();
    st.yq = q; yl.innerHTML = `<p class="empty">${t('Loading…')}</p>`;
    const r = await post('ytSearch', { q, music: false, region: st.settings.ytRegion || 'US' });
    if (!$('#yl')) return;
    if (!r.ok) return yl.innerHTML = `<p class="empty">${esc(t(r.err || 'Search failed'))}</p>`;
    st.ysr = r.list; st.ysq = q; draw(r.list);
    yhSet([{ q, thumb: (r.list[0] || {}).thumb }, ...yhGet().filter(x => x.q !== q)]);
  };
  inp.onkeydown = e => { if (e.key === 'Enter') load(inp.value.trim()) };
  inp.oninput = () => { if (!inp.value.trim()) hist() };
  if (q0 && st.ysq === q0 && st.ysr) draw(st.ysr); else if (q0) load(q0); else { hist(); inp.focus() }
}
function watch(v, list) {
  st.mus.cur = null; st.mus.playing = false; islandIdle();
  const handle = yHandle(v);
  ytBody(`<div class="ywb"><button id="ywk">${I(IP.chev, 22)}</button></div><div class="vslot" id="vslot" style="background-image:url('${esc(v.thumb)}')"></div>
    <div class="scr"><div class="yti"><b>${esc(v.title)}</b><small>${esc(handle)}${v.pub && Date.parse(v.pub) ? ' · ' + ago(Date.parse(v.pub) / 1000) : ''}</small></div>
    <div class="yact">${yavH(v.channel, v.avatar, v.cid)}<button class="ybell" id="ybl">${I(IP.bell, 18)}${I(IP.chev, 12)}</button><button id="ylk">${I(IP.like, 22)}</button><button id="ydl">${I(IP.dislike, 22)}</button><button id="ysh">${I(IP.share, 22)}</button><button id="ysp">${I(IP.spark, 22)}</button><button id="ydt">${I(IP.dots, 22)}</button></div>
    <div class="yrl">${list.map((x, i) => x.id === v.id ? '' : ytCard(x, i)).join('')}</div></div>`);
  yt.mode = 'video'; ytDock($('#vslot')); ytFsPos($('#vslot')); ytPlay(v.id);
  ytBind($('.yrl'), list, st.yfrom);
  const backFn = ybackFor(st.yfrom);
  $('#ywk').onclick = () => { ytStop(); backFn() };
  const wav = $('.yact .yav'); if (wav && v.cid) wav.onclick = () => ychannel(v.cid, () => watch(v, list));
  $('#ylk').onclick = e => { e.currentTarget.classList.toggle('on'); $('#ydl').classList.remove('on') };
  $('#ydl').onclick = e => { e.currentTarget.classList.toggle('on'); $('#ylk').classList.remove('on') };
  $('#ybl').onclick = e => e.currentTarget.classList.toggle('on');
  ['ysh', 'ysp', 'ydt'].forEach(id => $('#' + id).onclick = () => toast(t('Coming soon')));
}

/* ---------- Shorts + channel profile ---------- */
Object.assign(IP, { comment: '<path d="M4 5h16v11H9l-5 4z"/>' });
Object.assign(TR.ar, { 'Subscribe': 'اشتراك', 'Subscribed': 'مشترك', 'subscribers': 'مشترك', 'videos': 'فيديو', 'Share': 'مشاركة', 'Like': 'إعجاب', 'Dislike': 'عدم إعجاب' });
Object.assign(TR.fr, { 'Subscribe': "S'abonner", 'Subscribed': 'Abonné', 'subscribers': 'abonnés', 'videos': 'vidéos', 'Videos': 'Vidéos', 'Share': 'Partager', 'Like': "J'aime", 'Dislike': "Je n'aime pas" });
Object.assign(TR.es, { 'Subscribe': 'Suscribirse', 'Subscribed': 'Suscrito', 'subscribers': 'suscriptores', 'videos': 'videos', 'Videos': 'Videos', 'Share': 'Compartir', 'Like': 'Me gusta', 'Dislike': 'No me gusta' });
Object.assign(TR.tr, { 'Subscribe': 'Abone ol', 'Subscribed': 'Abone olundu', 'subscribers': 'abone', 'videos': 'video', 'Videos': 'Videolar', 'Share': 'Paylaş', 'Like': 'Beğen', 'Dislike': 'Beğenme' });

const ynum = n => { n = Number(n); if (!isFinite(n) || n < 0) return ''; const f = (x, u) => x.toFixed(x >= 100 ? 0 : 1).replace(/\.0$/, '') + u; return n >= 1e9 ? f(n / 1e9, 'B') : n >= 1e6 ? f(n / 1e6, 'M') : n >= 1e3 ? f(n / 1e3, 'K') : String(n) };
const ySubs = () => { try { return JSON.parse(localStorage.getItem('ios_yt_subs') || '{}') } catch (e) { return {} } };
const ySubSet = o => { try { localStorage.setItem('ios_yt_subs', JSON.stringify(o)) } catch (e) { } };
const yshuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
const yHandle = v => v.handle || '@' + String(v.channel || '').replace(/\s+/g, '');
const yavH = (name, avatar, cid, cls) => `<div class="yav ${cls || ''}" data-cid="${esc(cid || '')}" style="background:${avc(name)}">${avatar ? `<img src="${esc(avatar)}">` : esc((name || '?')[0])}</div>`;
const ynav = on => `<div class="ynav">${[['h', IP.yhome, t('Home')], ['s', IP.yshorts, 'Shorts'], ['p', IP.plus, ''], ['b', IP.subs, t('Subscriptions')], ['u', IP.user, t('You')]].map(([k, ic, lb]) => `<button data-n="${k}" class="${k === on ? 'on' : 'so'}${k === 'p' ? ' yplus' : ''}">${I(ic, k === 'p' ? 24 : 22)}${lb ? `<span>${lb}</span>` : ''}</button>`).join('')}</div>`;
const YN = { h: () => youtube(), s: () => { if (st.ysh && (st.ysh.cid || st.ysh.back)) st.ysh = null; yshorts() } };
const ynavBind = (root, fn) => (root || document).querySelectorAll('.ynav [data-n]').forEach(e => e.onclick = () => (YN[e.dataset.n] || (() => (fn || toast)(t('Coming soon'))))());
const ybackFor = from => from === 's' && st.ysq ? () => ysearch(st.ysq) : from === 'c' && st.ycb ? st.ycb : () => youtube();

/* --- Shorts viewer: lives in its own layer above the shared player (#ytbox is above the phone) --- */
let ysL = null, ysLast = 0, ysKeyH = null;
function ytShOff() {
  if (ysKeyH) { document.removeEventListener('keydown', ysKeyH); ysKeyH = null }
  window.removeEventListener('resize', ysPos);
  if (ysL) { ysL.remove(); ysL = null }
}
function ysPos() {
  if (!ysL) return;
  const r = $('#app').getBoundingClientRect();
  Object.assign(ysL.style, { left: r.left + 'px', top: (r.top + 28) + 'px', width: r.width + 'px', height: (r.height - 28 - 36) + 'px' });
  const v = $('#ysv'); if (v && yt.mode === 'short') { ytDock(v, true); ytBox.style.pointerEvents = 'none' }
}
function ysT(m) { const e = $('#ystoast'); if (!e) return toast(m); e.textContent = m; e.classList.add('show'); clearTimeout(ysT.h); ysT.h = setTimeout(() => e.classList.remove('show'), 1800) }
async function yshorts() {
  ytBody(`<div class="scr"><p class="empty" id="ysld">${t('Loading…')}</p></div>${ynav('s')}`); ynavBind();
  if (!st.ysh || !st.ysh.list.length) {
    const r = await post('ytShorts', { region: st.settings.ytRegion || 'US' });
    if (!$('#ysld')) return;
    if (!r.ok || !(r.list || []).length) { $('#ysld').textContent = t(r.err || 'No results'); return }
    st.ysh = { list: yshuf(r.list), i: 0, token: r.token };
  }
  ysRender();
}
function ysRender() {
  const S = st.ysh; ytShOff();
  st.mus.cur = null; st.mus.playing = false; islandIdle();
  const L = ysL = document.createElement('div'); L.id = 'ysl';
  L.innerHTML = `<div class="ysv" id="ysv"><div class="ysth" id="ysth"></div><div class="ystap" id="ystap"></div><div id="ysinfo"></div>
    <div class="ystop"><button id="ysbk">${I(IP.arrowL, 22)}</button><b>Shorts</b><button id="yssr">${I(IP.search, 22)}</button></div>
    <div class="ysnv"><button id="ysup" class="up">${I(IP.chev, 20)}</button><button id="ysdn">${I(IP.chev, 20)}</button></div>
    <div class="ysfl" id="ysfl"></div><div class="ystoast" id="ystoast"></div><div class="ysp"><i id="ysprog"></i></div></div>${ynav('s')}`;
  document.body.appendChild(L);
  window.addEventListener('resize', ysPos);
  ynavBind(L, ysT);
  $('#ysbk').onclick = () => S.back ? S.back() : youtube();
  $('#yssr').onclick = () => ysearch('');
  $('#ysup').onclick = () => ysStep(-1); $('#ysdn').onclick = () => ysStep(1);
  const tap = $('#ystap'); let y0 = null;
  tap.onpointerdown = e => { y0 = e.clientY };
  tap.onpointercancel = () => { y0 = null };
  tap.onpointerup = e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; Math.abs(dy) > 45 ? ysStep(dy < 0 ? 1 : -1) : ysToggle() };
  $('#ysv').addEventListener('wheel', e => { e.preventDefault(); ysStep(e.deltaY > 0 ? 1 : -1) }, { passive: false });
  ysKeyH = e => { if (e.key === 'ArrowDown') ysStep(1); else if (e.key === 'ArrowUp') ysStep(-1) };
  document.addEventListener('keydown', ysKeyH);
  ysShow(S.i, 0);
}
function ysShow(i, dir) {
  const S = st.ysh, v = S && S.list[i]; if (!v || !ysL) return;
  S.i = i;
  const th = $('#ysth'); th.style.backgroundImage = `url('${esc(v.thumb)}')`; th.classList.remove('off');
  ysFill(v, dir);
  yt.mode = 'short'; ysPos();
  ytPlay(v.id, 0);
  if (S.list.length - i <= 3) ysMore();
}
function ysPlaying() { const th = $('#ysth'); if (th) th.classList.add('off') }
function ysToggle() {
  if (!yt.p || !yt.ready) return;
  const playing = yt.p.getPlayerState() === 1;
  playing ? yt.p.pauseVideo() : yt.p.playVideo();
  const fl = $('#ysfl'); if (fl) { fl.innerHTML = I(playing ? IP.pause : IP.play, 30); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go') }
}
function ysStep(d) {
  const now = Date.now(); if (now - ysLast < 450) return; ysLast = now;
  const S = st.ysh; if (!S) return;
  const n = S.i + d; if (n < 0) return;
  if (n >= S.list.length) { if (S.token) { S.want = true; ysMore() } else ysT(t('No results')); return }
  ysShow(n, d);
}
async function ysMore() {
  const S = st.ysh; if (!S || S.loading || !S.token) return;
  S.loading = true;
  const r = await post('ytShorts', { token: S.token, cid: S.cid, region: st.settings.ytRegion || 'US' });
  S.loading = false;
  if (r.ok) { const have = new Set(S.list.map(x => x.id)); S.list.push(...(r.list || []).filter(x => !have.has(x.id))); S.token = r.token || null }
  const want = S.want; S.want = false;
  if (want && st.ysh === S && ysL && S.i < S.list.length - 1) { ysLast = 0; ysStep(1) }
}
function ysFill(v, dir) {
  const S = st.ysh, subs = ySubs(); S.lk = S.lk || {};
  const el = $('#ysinfo');
  el.innerHTML = `<div class="ysr">
      <button id="yslk" class="${S.lk[v.id] === 'l' ? 'on' : ''}">${I(IP.like, 26)}<span>${v.likes != null ? ynum(v.likes) : t('Like')}</span></button>
      <button id="ysdl" class="${S.lk[v.id] === 'd' ? 'on' : ''}">${I(IP.dislike, 26)}<span>${t('Dislike')}</span></button>
      <button id="yscm">${I(IP.comment, 26)}<span>${v.comments != null ? ynum(v.comments) : ''}</span></button>
      <button id="yssh">${I(IP.share, 26)}<span>${t('Share')}</span></button>
      <button id="ysdt">${I(IP.dots, 22)}</button></div>
    <div class="ysb"><div class="ysch">${yavH(v.channel, v.avatar, v.cid)}<b id="ysnm">${esc(yHandle(v))}</b>
      <button class="ysub ${subs[v.cid] ? 'on' : ''}" id="yssb">${subs[v.cid] ? t('Subscribed') : t('Subscribe')}</button></div>
      <p class="ystt">${esc(v.title)}</p>${v.views != null ? `<small class="ysvw">${ynum(v.views)} ${t('views')}</small>` : ''}</div>`;
  el.classList.remove('in'); if (dir) { void el.offsetWidth; el.classList.add('in') }
  const goCh = () => v.cid && ychannel(v.cid, () => yshorts());
  el.querySelector('.yav').onclick = goCh; $('#ysnm').onclick = goCh;
  const lk = $('#yslk'), dl = $('#ysdl');
  lk.onclick = () => { S.lk[v.id] = S.lk[v.id] === 'l' ? '' : 'l'; lk.classList.toggle('on', S.lk[v.id] === 'l'); dl.classList.remove('on') };
  dl.onclick = () => { S.lk[v.id] = S.lk[v.id] === 'd' ? '' : 'd'; dl.classList.toggle('on', S.lk[v.id] === 'd'); lk.classList.remove('on') };
  ['yscm', 'yssh', 'ysdt'].forEach(id => $('#' + id).onclick = () => ysT(t('Coming soon')));
  $('#yssb').onclick = e => {
    const s = ySubs(); if (s[v.cid]) delete s[v.cid]; else s[v.cid] = 1; ySubSet(s);
    e.currentTarget.classList.toggle('on', !!s[v.cid]); e.currentTarget.textContent = s[v.cid] ? t('Subscribed') : t('Subscribe');
  };
}
setInterval(() => {
  if (yt.mode !== 'short' || !yt.ready || !yt.p || !yt.p.getDuration) return;
  const b = $('#ysprog'); if (!b) return;
  const d = yt.p.getDuration() || 0, c = yt.p.getCurrentTime() || 0;
  b.style.width = d ? Math.min(100, c / d * 100) + '%' : '0';
}, 250);

/* --- Channel profile (avatar, banner, subscribers, videos + shorts tabs) --- */
async function ychannel(cid, back, tab0) {
  if (yt.mode !== 'audio') ytStop();
  back = back || (() => youtube());
  ytBody(`<div class="ywb"><button id="ycb">${I(IP.arrowL, 22)}</button></div><div class="scr" id="ycs"><p class="empty">${t('Loading…')}</p></div>${ynav('')}`);
  $('#ycb').onclick = back; ynavBind();
  const r = await post('ytChannel', { cid });
  if (!$('#ycs')) return;
  if (!r.ok) return $('#ycs').innerHTML = `<p class="empty">${esc(t(r.err || 'Search failed'))}</p>`;
  const c = r.info, subs = ySubs();
  const stats = [c.subs != null ? ynum(c.subs) + ' ' + t('subscribers') : '', c.videos != null ? ynum(c.videos) + ' ' + t('videos') : ''].filter(Boolean).join(' · ');
  $('#ycs').innerHTML = `<div class="ychb"${c.banner ? ` style="background-image:url('${esc(c.banner)}')"` : ''}></div>
    <div class="ychh">${yavH(c.title, c.avatar, cid, 'ychav')}<div class="ychi"><b>${esc(c.title)}</b><small>${esc(c.handle || '')}</small><small>${esc(stats)}</small></div></div>
    ${c.desc ? `<p class="ychd">${esc(c.desc)}</p>` : ''}
    <div class="ychbt"><button class="ysub big ${subs[cid] ? 'on' : ''}" id="ysub">${subs[cid] ? t('Subscribed') : t('Subscribe')}</button></div>
    <div class="ychtabs"><button class="on" data-t="v">${t('Videos')}</button><button data-t="s">Shorts</button></div><div id="ychl"></div>`;
  $('#ysub').onclick = e => { const s = ySubs(); if (s[cid]) delete s[cid]; else s[cid] = 1; ySubSet(s); e.currentTarget.classList.toggle('on', !!s[cid]); e.currentTarget.textContent = s[cid] ? t('Subscribed') : t('Subscribe') };
  const ychl = $('#ychl'); let sh = null;
  const vids = () => {
    if (!r.list.length) return ychl.innerHTML = `<p class="empty">${t('No results')}</p>`;
    ychl.innerHTML = r.list.map(ytCard).join(''); st.ycb = () => ychannel(cid, back); ytBind(ychl, r.list, 'c');
  };
  const shorts = async () => {
    ychl.innerHTML = `<p class="empty">${t('Loading…')}</p>`;
    if (!sh) { const x = await post('ytShorts', { cid, region: st.settings.ytRegion || 'US' }); if (!$('#ychl')) return; if (!x.ok) return ychl.innerHTML = `<p class="empty">${esc(t(x.err || 'Search failed'))}</p>`; sh = x }
    if (!sh.list.length) return ychl.innerHTML = `<p class="empty">${t('No results')}</p>`;
    ychl.innerHTML = `<div class="ysg">${sh.list.map((v, i) => `<div class="ysc" data-i="${i}"><img src="${esc(v.thumb)}"><span>${v.views != null ? ynum(v.views) + ' ' + t('views') : ''}</span></div>`).join('')}</div>`;
    ychl.querySelectorAll('.ysc').forEach(e => e.onclick = () => { st.ysh = { list: sh.list, i: +e.dataset.i, token: sh.token, cid, back: () => ychannel(cid, back, 's') }; yshorts() });
  };
  document.querySelectorAll('.ychtabs button').forEach(b => b.onclick = () => { document.querySelectorAll('.ychtabs button').forEach(x => x.classList.toggle('on', x === b)); b.dataset.t === 's' ? shorts() : vids() });
  if (tab0 === 's') { document.querySelectorAll('.ychtabs button').forEach(x => x.classList.toggle('on', x.dataset.t === 's')); shorts() } else vids();
}

/* ---------- Gemini app (Google Gemini API through the server) ---------- */
Object.assign(IP, {
  gmenu: '<path d="M4 8h16M4 16h10"/>',
  gnew: '<path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M18.5 3.5a2.1 2.1 0 0 1 3 3L12 16l-4 1 1-4z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  gup: '<path d="M12 19V5M5 12l7-7 7 7"/>', wave: '<path d="M6 10v4M10 6v12M14 9v6M18 11v2"/>',
});
Object.assign(TR.ar, { 'Open music player': 'افتح الموسيقى', 'Open YouTube': 'افتح يوتيوب', 'Capital of Algeria': 'عاصمة الجزائر شنو هي؟', 'Get Plus': 'احصل على Plus', 'Ask Gemini': 'اسأل Gemini', 'Chat': 'دردشة', 'Pinned': 'المثبتة', 'Pin': 'تثبيت', 'Unpin': 'إلغاء التثبيت', 'Delete chat': 'حذف المحادثة', 'Copied': 'تم النسخ', "What's next, {n}?": 'ما التالي يا {n}؟', 'Help me write a message': 'ساعدني في كتابة رسالة', 'Explain something simply': 'اشرح لي شيئاً ببساطة', 'Give me a recipe idea': 'أعطني فكرة وصفة', 'Translate to Arabic': 'ترجم إلى العربية', 'OpenAI API key is not set': 'مفتاح OpenAI API غير مضبوط', 'OpenAI API key is invalid': 'مفتاح OpenAI API غير صالح', 'OpenAI quota or rate limit reached': 'تم بلوغ حد OpenAI', 'Gemini request failed': 'فشل طلب Gemini', 'Please wait a moment': 'انتظر قليلاً' });
Object.assign(TR.fr, { 'Open music player': 'Ouvre la musique', 'Open YouTube': 'Ouvre YouTube', 'Capital of Algeria': 'Quelle est la capitale de l\'Algérie ?', 'Get Plus': 'Passer à Plus', 'Ask Gemini': 'Demandez à Gemini', 'Chat': 'Discuter', 'Pinned': 'Épinglées', 'Recents': 'Récentes', 'Pin': 'Épingler', 'Unpin': 'Désépingler', 'Delete chat': 'Supprimer la discussion', 'Copied': 'Copié', "What's next, {n}?": 'Et ensuite, {n} ?', 'Help me write a message': 'Aide-moi à écrire un message', 'Explain something simply': 'Explique-moi simplement', 'Give me a recipe idea': 'Donne-moi une idée de recette', 'Translate to Arabic': "Traduis en arabe", 'OpenAI API key is not set': "La clé API OpenAI n'est pas définie", 'OpenAI API key is invalid': 'Clé API OpenAI invalide', 'OpenAI quota or rate limit reached': 'Limite OpenAI atteinte', 'Gemini request failed': 'Échec de la requête Gemini', 'Please wait a moment': 'Patientez un instant' });

const gKey = () => 'ios_gemini_' + ((st.me && st.me.number) || '0');
const gLoad = () => { try { const d = JSON.parse(localStorage.getItem(gKey()) || 'null'); if (d && Array.isArray(d.chats)) return d } catch (e) { } return { chats: [], cur: null } };
const gSave = () => { try { localStorage.setItem(gKey(), JSON.stringify(st.gpt.db)) } catch (e) { } };
const gCur = () => st.gpt.db.chats.find(x => x.id === st.gpt.db.cur);
const gFirst = () => String((st.me && st.me.name) || '').split(' ')[0];
const gInit = () => String((st.me && st.me.name) || '?').split(' ').map(x => x[0] || '').join('').slice(0, 2).toUpperCase();
const GCHIPS = [
  ['🎵', 'Open music player'],
  ['▶️', 'Open YouTube'],
  ['🇩🇿', 'Capital of Algeria'],
  ['✏️', 'Help me write a message'],
];
/* Detect "open app" commands in EN / FR / Darija (Latin + Arabic) */
const GPT_APPS = [
  { id: 'music', keys: ['music', 'player', 'musique', 'musiq', 'mousiq', 'mousiqa', 'موسيقى', 'ميوزك', 'بلاير', 'الموسيقى'] },
  { id: 'youtube', keys: ['youtube', 'youtub', 'yt', 'يوتيوب', 'يوتوب'] },
  { id: 'camera', keys: ['camera', 'cam', 'كاميرا', 'الكاميرا', 'صورة'] },
  { id: 'photos', keys: ['photos', 'gallery', 'صور', 'الصور', 'معرض'] },
  { id: 'browser', keys: ['browser', 'google', 'search', 'بحث', 'قوقل', 'متصفح'] },
  { id: 'maps', keys: ['maps', 'map', 'gps', 'خريطة', 'خرائط'] },
  { id: 'messages', keys: ['messages', 'message', 'sms', 'رسائل', 'رسالة'] },
  { id: 'phone', keys: ['phone', 'call', 'هاتف', 'اتصال', 'تليفون'] },
  { id: 'settings', keys: ['settings', 'setting', 'إعدادات', 'اعدادات'] },
  { id: 'bank', keys: ['bank', 'بنك', 'البنك'] },
  { id: 'garage', keys: ['garage', 'car', 'garage', 'كراج', 'سيارة'] },
  { id: 'clock', keys: ['clock', 'alarm', 'timer', 'stopwatch', 'ساعة', 'منبه', 'مؤقت', 'horloge'] },
  { id: 'weather', keys: ['weather', 'طقس', 'الجو'] },
  { id: 'whatsnow', keys: ['whatsapp', 'whatsnow', 'واتس', 'واتساب'] },
  { id: 'contacts', keys: ['contacts', 'contact', 'جهات', 'أرقام'] },
];
function gptDetectOpen(text) {
  const raw = String(text || '').toLowerCase().trim();
  // normalize common darija latin spellings
  const t = raw
    .replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[''`]/g, '');
  const openWords = /(^|\s)(open|ouvre|ouvrir|افتح|فتح|شغل|شغلي|حلي|حل|dir|دير|tfth|tfteh|eftah)(\s|$)/i;
  const wantsOpen = openWords.test(t) || /\b(open|ouvre|افتح|شغل)\b/.test(t);
  if (!wantsOpen && !/^\s*(music|youtube|yt|player|musique|browser|google|camera|maps)\s*$/i.test(t)) {
    // also allow bare app names as open
    for (const a of GPT_APPS) {
      for (const k of a.keys) {
        if (t === k || t === 'ال' + k) return a.id;
      }
    }
    return null;
  }
  for (const a of GPT_APPS) {
    for (const k of a.keys) {
      if (t.includes(k)) return a.id;
    }
  }
  return null;
}
const GPT_OPEN_REPLY = {
  music: { en: 'Opening Music player…', ar: 'راني نفتح لك الموسيقى…', fr: 'J’ouvre le lecteur musique…' },
  youtube: { en: 'Opening YouTube…', ar: 'راني نفتح لك يوتيوب…', fr: 'J’ouvre YouTube…' },
  camera: { en: 'Opening Camera…', ar: 'راني نفتح الكاميرا…', fr: 'J’ouvre l’appareil photo…' },
  photos: { en: 'Opening Photos…', ar: 'راني نفتح الصور…', fr: 'J’ouvre Photos…' },
  browser: { en: 'Opening Google Search…', ar: 'راني نفتح البحث…', fr: 'J’ouvre la recherche Google…' },
  maps: { en: 'Opening Maps…', ar: 'راني نفتح الخرائط…', fr: 'J’ouvre Maps…' },
  messages: { en: 'Opening Messages…', ar: 'راني نفتح الرسائل…', fr: 'J’ouvre Messages…' },
  phone: { en: 'Opening Phone…', ar: 'راني نفتح الهاتف…', fr: 'J’ouvre Téléphone…' },
  settings: { en: 'Opening Settings…', ar: 'راني نفتح الإعدادات…', fr: 'J’ouvre Réglages…' },
  bank: { en: 'Opening Bank…', ar: 'راني نفتح البنك…', fr: 'J’ouvre Banque…' },
  garage: { en: 'Opening Garage…', ar: 'راني نفتح الكراج…', fr: 'J’ouvre Garage…' },
  weather: { en: 'Opening Weather…', ar: 'راني نفتح الطقس…', fr: 'J’ouvre Météo…' },
  whatsnow: { en: 'Opening WhatsNow…', ar: 'راني نفتح واتس…', fr: 'J’ouvre WhatsNow…' },
};
function gptOpenReply(appId) {
  const lang = (st.settings && st.settings.language) || 'en';
  const r = GPT_OPEN_REPLY[appId] || { en: 'Opening…', ar: 'راني نفتح…', fr: 'J’ouvre…' };
  if (lang === 'ar') return r.ar;
  if (lang === 'fr') return r.fr;
  return r.en;
}


function gptMd(s) {
  return String(s).split('```').map((p, i) => {
    if (i % 2) { const nl = p.indexOf('\n'); const code = nl >= 0 && /^[\w+#-]*$/.test(p.slice(0, nl).trim()) ? p.slice(nl + 1) : p; return `<pre dir="ltr"><code>${esc(code.replace(/\n$/, ''))}</code></pre>` }
    return esc(p).replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/^#{1,3} (.+)$/gm, '<b class="gh">$1</b>').replace(/^[-*] /gm, '• ').replace(/\n/g, '<br>');
  }).join('');
}
function gptCopy(txt) {
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0;left:0;top:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(t('Copied')) } catch (e) { toast(t('Search failed')) }
}
function gpt() {
  const G = st.gpt = st.gpt || { db: gLoad(), busy: false, sq: false };
  view('Gemini', `<div class="gptw">
    <div class="gpth"><button class="gpc" id="gpm">${I(IP.gmenu, 22)}</button><span class="gptitle" id="gpp"><b>Gemini</b>${I(IP.chev, 16)}</span><span class="gpsp"></span><span class="gpr hidden" id="gpr"></span></div>
    <div class="gpmsgs" id="gpmsgs"></div>
    <div class="gpin"><button class="gpb" id="gpad">${I(IP.plus, 22)}</button><textarea id="gpi" rows="1" maxlength="1500"></textarea><button class="gpb" id="gpmic">${I(IP.mic, 20)}</button><button class="gpsend" id="gps">${I(IP.wave, 20)}</button></div>
    <div class="gpdr" id="gpdr"></div></div>`, { dark: true, app: 'gpt', nohdr: true, cls: 'full gptb' });
  const inp = $('#gpi'), snd = $('#gps');
  const sync = () => { inp.style.height = 'auto'; inp.style.height = Math.min(90, inp.scrollHeight) + 'px'; const has = !!inp.value.trim(); snd.classList.toggle('go', has); snd.innerHTML = I(has ? IP.gup : IP.wave, 20) };
  const go = () => { const v = inp.value; if (!v.trim() || G.busy) return; inp.value = ''; sync(); gptSend(v) };
  inp.oninput = sync;
  inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go() } };
  snd.onclick = () => inp.value.trim() ? go() : toast(t('Coming soon'));
  $('#gpm').onclick = () => gptDrawer(true);
  ['gpad', 'gpmic'].forEach(id => $('#' + id).onclick = () => toast(t('Coming soon')));
  gptDraw(true);
}
function gptDraw(sc) {
  const G = st.gpt, box = $('#gpmsgs'); if (!box) return;
  const c = gCur(), inp = $('#gpi');
  inp.placeholder = t('Ask Gemini');
  const gr = $('#gpr'); gr.classList.toggle('hidden', !c);
  gr.innerHTML = c ? `<button id="gpnew">${I(IP.gnew, 20)}</button><button id="gpdt">${I(IP.dots, 20)}</button>` : '';
  if (c) {
    $('#gpnew').onclick = () => { G.db.cur = null; gSave(); gptDraw() };
    $('#gpdt').onclick = e => { e.stopPropagation(); gptMenu(c) };
  }
  if (!c || !c.msgs.length) {
    box.className = 'gpmsgs empty';
    box.innerHTML = `<div class="gpgr"><i class="gpsx">${I(IP.spark, 30)}</i><div class="gpgh">${esc(t('Hello, {n}')).replace('{n}', `<span>${esc(gFirst())}</span>`)}</div><div class="gpgs">${esc(t('How can I help you today?'))}</div></div>` + GCHIPS.map((x, i) => `<button class="gpch" data-i="${i}"><span>${x[0]}</span><span>${esc(t(x[1]))}</span></button>`).join('');
    box.querySelectorAll('.gpch').forEach(b => b.onclick = () => gptSend(t(GCHIPS[+b.dataset.i][1])));
    return;
  }
  box.className = 'gpmsgs';
  const act = (i) => `<div class="gpact" data-i="${i}"><button data-a="copy">${I(IP.copy, 17)}</button><button data-a="like">${I(IP.like, 17)}</button><button data-a="dislike">${I(IP.dislike, 17)}</button><button data-a="vol">${I(IP.vol, 17)}</button><button data-a="share">${I(IP.share, 17)}</button><button data-a="dots">${I(IP.dotsH, 17)}</button></div>`;
  box.innerHTML = c.msgs.map((m, i) => m.r === 'u'
    ? `<div class="gpu" dir="auto">${esc(m.t)}</div>`
    : `<div class="gpas${m.err ? ' err' : ''}"><i class="gpsx sm">${I(IP.spark, 18)}</i><div class="gpat" dir="auto">${gptMd(m.t)}</div>${m.err ? '' : act(i)}</div>`).join('')
    + (G.busy && c.msgs[c.msgs.length - 1].r === 'u' ? '<div class="gpty"><i></i><i></i><i></i></div>' : '');
  box.querySelectorAll('.gpact button').forEach(b => b.onclick = () => {
    const m = c.msgs[+b.parentNode.dataset.i], a = b.dataset.a;
    if (a === 'copy') gptCopy(m.t);
    else if (a === 'like' || a === 'dislike') { const was = b.classList.contains('on'); b.parentNode.querySelectorAll('[data-a=like],[data-a=dislike]').forEach(x => x.classList.remove('on')); if (!was) b.classList.add('on') }
    else toast(t('Coming soon'));
  });
  if (sc) box.scrollTop = box.scrollHeight;
}
function gptMenu(c) {
  const w = $('.gptw'); if (!w) return;
  const old = $('#gpmn'); if (old) return old.remove();
  const m = document.createElement('div'); m.className = 'gpmenu'; m.id = 'gpmn';
  m.innerHTML = `<button id="gpmp">${esc(t(c.pin ? 'Unpin' : 'Pin'))}</button><button id="gpmd" class="red">${esc(t('Delete chat'))}</button>`;
  w.appendChild(m);
  const close = () => { m.remove(); document.removeEventListener('click', close) };
  setTimeout(() => document.addEventListener('click', close), 0);
  $('#gpmp').onclick = () => { c.pin = !c.pin; gSave() };
  $('#gpmd').onclick = () => { const G = st.gpt; G.db.chats = G.db.chats.filter(x => x.id !== c.id); G.db.cur = null; gSave(); gptDraw() };
}
async function gptSend(text) {
  const G = st.gpt; text = String(text || '').trim().slice(0, 1500);
  if (!text || G.busy) return;
  let c = gCur();
  if (!c) {
    c = { id: Date.now().toString(36), title: text.slice(0, 40), pin: false, ts: Date.now(), msgs: [] };
    G.db.chats.unshift(c); G.db.cur = c.id;
    if (G.db.chats.length > 30) { const drop = G.db.chats.filter(x => !x.pin && x.id !== c.id).sort((a, b) => a.ts - b.ts)[0]; if (drop) G.db.chats = G.db.chats.filter(x => x !== drop) }
  }
  c.msgs.push({ r: 'u', t: text }); c.ts = Date.now();
  if (c.msgs.length > 40) c.msgs.splice(0, c.msgs.length - 40);

  // Local app launcher: "open youtube", "افتح الموسيقى", "open player", etc.
  const openId = gptDetectOpen(text);
  if (openId) {
    const reply = gptOpenReply(openId);
    c.msgs.push({ r: 'a', t: reply });
    gSave(); gptDraw(true);
    setTimeout(() => openApp(openId), 450);
    return;
  }

  G.busy = true; gSave(); gptDraw(true);
  const payload = c.msgs.filter(m => !m.err).slice(-12).map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t }));
  const r = await post('geminiChat', { messages: payload });
  G.busy = false;
  if (r.ok && r.text) c.msgs.push({ r: 'a', t: r.text }); else c.msgs.push({ r: 'a', t: '⚠ ' + t(r.err || 'Gemini request failed'), err: true });
  gSave();
  if ($('#gpmsgs') && st.gpt === G && G.db.cur === c.id) gptDraw(true);
}
function gptDrawer(open) {
  const d = $('#gpdr'); if (!d) return;
  if (!open) return d.classList.remove('on');
  const G = st.gpt;
  d.innerHTML = `<div class="gpdim" id="gpdim"></div><div class="gpdp"><div class="gpdh"><b>Gemini</b><button class="gpc" id="gpsr">${I(IP.search, 20)}</button></div>
    <input class="gpsi ${G.sq ? '' : 'hidden'}" id="gpsi" placeholder="${esc(t('Search'))}"><div class="gpdl" id="gpdl"></div>
    <div class="gpdf"><button class="gpnc" id="gpnc">${I(IP.gnew, 20)}<span>${t('Chat')}</span></button><span class="gpav">${esc(gInit())}</span></div></div>`;
  const list = () => {
    const q = ($('#gpsi').value || '').toLowerCase();
    const all = G.db.chats.filter(c => !q || c.title.toLowerCase().includes(q)).sort((a, b) => b.ts - a.ts);
    const row = c => `<div class="gpcr ${c.id === G.db.cur ? 'on' : ''}" data-id="${c.id}" dir="auto">${esc(c.title)}</div>`;
    const pin = all.filter(c => c.pin), rec = all.filter(c => !c.pin);
    $('#gpdl').innerHTML = (pin.length ? `<h5>${t('Pinned')}</h5>${pin.map(row).join('')}` : '') + `<h5>${t('Recents')}</h5>` + (rec.map(row).join('') || `<p class="gpem">${t('No results')}</p>`);
    $('#gpdl').querySelectorAll('.gpcr').forEach(e => e.onclick = () => { G.db.cur = e.dataset.id; gSave(); gptDrawer(false); gptDraw(true) });
  };
  list();
  $('#gpdim').onclick = () => gptDrawer(false);
  $('#gpsr').onclick = () => { G.sq = !G.sq; $('#gpsi').classList.toggle('hidden', !G.sq); if (G.sq) $('#gpsi').focus(); else { $('#gpsi').value = ''; list() } };
  $('#gpsi').oninput = list;
  $('#gpnc').onclick = () => { G.db.cur = null; gSave(); gptDrawer(false); gptDraw() };
  void d.offsetWidth; d.classList.add('on');
}

/* ---------- Camera / Photos ---------- */
async function camera() {
  // The camera UI lives in camera.js (fullscreen overlay with a transparent viewfinder).
  // Lua hides the phone, activates the GTA camera and sends "camOpen".
  post('startCamera');
}
const shrink = (src, w, q) => new Promise(res => {
  const im = new Image();
  im.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = Math.round(im.height * w / im.width); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', q)) };
  im.onerror = () => res(null); im.src = src;
});
st.pc = {};
/* ---------- Photos (Gallery style) ---------- */
Object.assign(IP, {
  img: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
  imgF: '<rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" stroke="none"/><circle cx="9" cy="10" r="1.6" fill="#000" stroke="none"/><path d="M4 18l5-5 4 4 3-3 4 4" stroke="#000"/>',
  alb: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M5 8h3"/>', albF: '<rect x="5" y="3" width="14" height="18" rx="3" fill="currentColor" stroke="none"/><path d="M5 8h4" stroke="#000"/>',
  sto: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M10 3v7l2-1.5 2 1.5V3"/>', stoF: '<rect x="5" y="3" width="14" height="18" rx="3" fill="currentColor" stroke="none"/><path d="M10 3v7l2-1.5 2 1.5V3" fill="#000" stroke="#000"/>',
  menu: '<path d="M4 8h16M4 13h16M4 18h16"/>', vid: '<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  loc: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  shr: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.5-4 11.5-4 12 0M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2 3 4"/>',
  bin: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  undo: '<path d="M4 9h11a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4"/>',
  flower: '<g fill="currentColor" stroke="none"><circle cx="12" cy="5.5" r="3.4"/><circle cx="17.6" cy="8.75" r="3.4"/><circle cx="17.6" cy="15.25" r="3.4"/><circle cx="12" cy="18.5" r="3.4"/><circle cx="6.4" cy="15.25" r="3.4"/><circle cx="6.4" cy="8.75" r="3.4"/></g>',
});
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch (e) { return [] } };
const lsSet = (k, a) => { try { localStorage.setItem(k, JSON.stringify(a)) } catch (e) { } };
const phFav = () => lsGet('ios_ph_fav'), phBin = () => lsGet('ios_ph_bin');
const phDay = ts => {
  const d = new Date(ts * 1000), n = new Date(), k = x => x.toDateString();
  if (k(d) === k(n)) return t('Today');
  if (k(d) === k(new Date(n - 864e5))) return t('Yesterday');
  return d.toLocaleDateString(st.settings.language === 'ar' ? 'ar' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};
function phLoad(root) {
  if (st.io) st.io.disconnect();
  st.io = new IntersectionObserver(es => es.forEach(async e => {
    if (!e.isIntersecting) return; st.io.unobserve(e.target);
    const id = e.target.dataset.id;
    if (!st.pc[id]) { const x = await post('getPhoto', { id: +id, thumb: true }); st.pc[id] = x.data }
    if (st.pc[id]) e.target.style.backgroundImage = `url(${st.pc[id]})`;
  }), { root, threshold: 0.01 });
  root.querySelectorAll('.pt').forEach(e => st.io.observe(e));
}
const phView = html => view(t('Photos'), html, { dark: true, app: 'ph', nohdr: true, cls: 'full phb' });
const vidLen = p => { const d = Math.max(1, Math.round((p.dur || 0) / (p.speed || 1))); return Math.floor(d / 60) + ':' + String(d % 60).padStart(2, '0') };
const phTile = (p, fav, sel) => `<div class="pt ${sel && sel.has(p.id) ? 'sl' : ''}" data-id="${p.id}">${p.kind === 'video' ? `<i class="pvb">▶ ${vidLen(p)}</i>` : ''}${fav.includes(p.id) ? `<i class="pfh">${I(IP.heart, 12)}</i>` : ''}${sel ? `<i class="pck">${sel.has(p.id) ? '✓' : ''}</i>` : ''}</div>`;

async function photos(tab) {
  if (tab === undefined) { st.phSel = null; const r = await post('getPhotos'); st.ph = r.list || (r.ids || []).map(id => ({ id, ts: Date.now() / 1000 })) }
  tab = tab || st.phTab || 'pics'; st.phTab = tab;
  const bin = phBin(), fav = phFav(), sel = st.phSel;
  const vis = st.ph.filter(p => !bin.includes(p.id)), favs = vis.filter(p => fav.includes(p.id));
  let head, body;
  if (tab === 'pics') {
    head = sel ? `<button id="phx">${I(IP.x, 22)}</button><b class="phl">${sel.size ? sel.size + ' ' + t('selected') : t('Select')}</b><button id="phdel">${I(IP.bin, 22)}</button>`
      : `<button id="phcam">${I(IP.cam, 22)}</button><button id="phsr">${I(IP.search, 22)}</button><button id="phdt">${I(IP.dots, 22)}</button>`;
    const groups = []; vis.forEach(p => { const k = phDay(p.ts); let g = groups[groups.length - 1]; if (!g || g.k !== k) groups.push(g = { k, l: [] }); g.l.push(p) });
    body = vis.length ? groups.map(g => `<h3 class="phd">${esc(g.k)}</h3><div class="pg4">${g.l.map(p => phTile(p, fav, sel)).join('')}</div>`).join('') : `<p class="empty">${t('No photos yet.')}</p>`;
  } else if (tab === 'albums') {
    head = `<button id="phpl">${I(IP.plus, 24)}</button><button id="phsr">${I(IP.search, 22)}</button><button id="phdt">${I(IP.dots, 22)}</button>`;
    const albs = [['recent', t('Recent'), vis], ['fav', t('Favourites'), favs], ['cam', t('Camera'), vis]];
    body = `${st.phCust ? '' : `<div class="phc"><b>${t('Customise the Albums tab')}</b><p>${t('Select a few essential albums to show, show them all, or something in between. It\'s up to you.')}</p><div class="phca"><button id="phnn">${t('Not now')}</button><button id="phse">${t('Select essential albums')}</button></div></div>`}
      <div class="alh"><b>${t('Essential albums')}</b><span id="phva">${t('View all')}</span></div>
      <div class="alg">${albs.map(([k, n, l]) => `<div class="alb" data-k="${k}">${l[0] ? `<div class="alc pt" data-id="${l[0].id}"></div>` : `<div class="alc em">${I(IP.flower, 52)}</div>`}<span>${esc(n)}</span><small>${l.length}</small></div>`).join('')}</div>`;
  } else {
    head = `<button id="phsr">${I(IP.search, 22)}</button><button id="phdt">${I(IP.dots, 22)}</button>`;
    body = `<div class="pst"><h3>${t('No stories')}</h3><p>${t('Experience your adventures again in curated collections automatically made from your pictures and videos.')}</p></div>`;
  }
  const nb = (k, ic, icF, n) => `<button data-t="${k}" class="${tab === k ? 'on' : ''}">${I(tab === k ? icF : ic, 24)}<span>${n}</span></button>`;
  phView(`<div class="phh">${head}</div><div class="scr" id="phs">${body}</div>
    <div class="phn">${nb('pics', IP.img, IP.imgF, t('Pictures'))}${nb('albums', IP.alb, IP.albF, t('Albums'))}${nb('stories', IP.sto, IP.stoF, t('Stories'))}<button id="phmn" class="md">${I(IP.menu, 24)}<span>${t('Menu')}</span></button></div>
    <div class="phdd hidden" id="phdd">${tab === 'pics' && !sel ? `<div id="ddsel">${t('Select')}</div>` : ''}<div id="ddrb">${t('Recycle bin')}</div></div>
    <div class="phm hidden" id="phm"><div class="phs" onclick="event.stopPropagation()"><div class="phr4">
      <div class="phi" data-m="vid"><span>${I(IP.vid, 24)}</span>${t('Videos')}</div><div class="phi" data-m="fav"><span>${I(IP.heart, 24)}</span>${t('Favourites')}</div><div class="phi" data-m="recent"><span>${I(IP.hist, 24)}</span>${t('Recent')}</div><div class="phi" data-m="loc"><span>${I(IP.loc, 24)}</span>${t('Locations')}</div></div>
      <div class="phr2"><div class="php" data-m="shr">${I(IP.shr, 22)}${t('Shared albums')}</div><div class="php" data-m="bin">${I(IP.bin, 22)}${t('Recycle bin')}</div></div>
      <div class="phr2"><div class="php" data-m="soon">${I(IP.gear, 22)}${t('Settings')}<i class="od2"></i></div></div></div></div>`);
  const root = $('#phs'); phLoad(root);
  const soon = () => toast(t('Coming soon')), again = () => photos(tab);
  document.querySelectorAll('.phn button[data-t]').forEach(e => e.onclick = () => { st.phSel = null; photos(e.dataset.t) });
  $('#phmn').onclick = () => $('#phm').classList.remove('hidden');
  $('#phm').onclick = () => $('#phm').classList.add('hidden');
  document.querySelectorAll('.phi,.php').forEach(e => e.onclick = ev => {
    ev.stopPropagation(); const m = e.dataset.m; $('#phm').classList.add('hidden');
    if (m === 'soon') soon(); else if (m === 'loc') phLocations(); else if (m === 'shr') phShared(); else if (m === 'bin') phBinPage(); else phAlbum(m);
  });
  const sr = $('#phsr'); if (sr) sr.onclick = soon;
  const dt = $('#phdt'); if (dt) dt.onclick = () => $('#phdd').classList.toggle('hidden');
  const dsl = $('#ddsel'); if (dsl) dsl.onclick = () => { st.phSel = new Set(); again() };
  $('#ddrb').onclick = phBinPage;
  if (tab === 'pics') {
    const cm = $('#phcam'); if (cm) cm.onclick = camera;
    if (sel) {
      $('#phx').onclick = () => { st.phSel = null; again() };
      $('#phdel').onclick = () => { if (!sel.size) return; lsSet('ios_ph_bin', [...new Set([...bin, ...sel])]); st.phSel = null; again() };
    }
    root.querySelectorAll('.pt').forEach(e => e.onclick = () => {
      const id = +e.dataset.id;
      if (st.phSel) { st.phSel.has(id) ? st.phSel.delete(id) : st.phSel.add(id); again() } else photoView(id);
    });
  }
  if (tab === 'albums') {
    $('#phpl').onclick = soon;
    const nn = $('#phnn'); if (nn) { nn.onclick = () => { st.phCust = true; again() }; $('#phse').onclick = soon }
    $('#phva').onclick = soon;
    root.querySelectorAll('.alb').forEach(e => e.onclick = () => phAlbum(e.dataset.k));
  }
}
function phAlbum(k) {
  const bin = phBin(), fav = phFav();
  const vis = st.ph.filter(p => !bin.includes(p.id)), l = k === 'fav' ? vis.filter(p => fav.includes(p.id)) : k === 'vid' ? vis.filter(p => p.kind === 'video') : vis;
  const n = { recent: t('Recent'), fav: t('Favourites'), cam: t('Camera'), vid: t('Videos') }[k] || t('Recent');
  phView(`<div class="phh2"><button id="pab">${I(IP.arrowL, 24)}</button><b>${esc(n)}</b><small>${l.length}</small></div><div class="scr" id="phs">${l.length ? `<div class="pg4">${l.map(p => phTile(p, fav)).join('')}</div>` : `<p class="empty">${t('No photos yet.')}</p>`}</div>`);
  $('#pab').onclick = () => photos('albums');
  const root = $('#phs'); phLoad(root);
  root.querySelectorAll('.pt').forEach(e => e.onclick = () => photoView(+e.dataset.id, false, () => phAlbum(k)));
}
function phBinPage() {
  const bin = phBin(), l = st.ph.filter(p => bin.includes(p.id));
  phView(`<div class="phh2"><button id="pab">${I(IP.arrowL, 24)}</button><b>${t('Recycle bin')}</b>${l.length ? `<button id="pem" class="pem">${t('Empty')}</button>` : '<span></span>'}</div><div class="scr" id="phs">${l.length ? `<div class="pg4">${l.map(p => phTile(p, [])).join('')}</div>` : `<p class="empty">${t('No photos yet.')}</p>`}</div>`);
  $('#pab').onclick = () => photos(st.phTab);
  const root = $('#phs'); phLoad(root);
  root.querySelectorAll('.pt').forEach(e => e.onclick = () => photoView(+e.dataset.id, true, phBinPage));
  const em = $('#pem');
  if (em) em.onclick = async () => { for (const p of l) { await post('deletePhoto', { id: p.id }); delete st.pc[p.id] } st.ph = st.ph.filter(p => !bin.includes(p.id)); lsSet('ios_ph_bin', []); phBinPage() };
}
async function photoView(id, inBin, back) {
  const fav = phFav().includes(id); back = back || (() => photos(st.phTab));
  phView(`<div class="pvt"><button id="pvb">${I(IP.arrowL, 24)}</button><span></span>${inBin ? `<button id="pvr">${I(IP.undo, 22)}</button><button id="pvx">${I(IP.bin, 22)}</button>` : `${((st.ph || []).find(p => p.id === id) || {}).kind === 'video' ? '' : `<button id="pvs">${I(IP.shr, 22)}</button>`}<button id="pvh" class="${fav ? 'on' : ''}">${I(IP.heart, 22)}</button><button id="pvd">${I(IP.bin, 22)}</button>`}</div><div class="pf" id="pf"></div>`);
  $('#pvb').onclick = back;
  if (inBin) {
    $('#pvr').onclick = () => { lsSet('ios_ph_bin', phBin().filter(x => x !== id)); phBinPage() };
    $('#pvx').onclick = async () => { await post('deletePhoto', { id }); delete st.pc[id]; st.ph = st.ph.filter(p => p.id !== id); lsSet('ios_ph_bin', phBin().filter(x => x !== id)); phBinPage() };
  } else {
    $('#pvh').onclick = e => { const f = phFav(); lsSet('ios_ph_fav', f.includes(id) ? f.filter(x => x !== id) : [...f, id]); e.currentTarget.classList.toggle('on') };
    $('#pvd').onclick = () => { lsSet('ios_ph_bin', [...phBin(), id]); back() };
    const psb = $('#pvs'); if (psb) psb.onclick = () => phShareSheet(id);
  }
  const f = $('#pf'), meta = (st.ph || []).find(p => p.id === id);
  if (meta && meta.kind === 'video') {
    if (f) f.innerHTML = `<p class="empty">${t('Loading…')}</p>`;
    const data = await window.camGetVideo(id);
    const f2 = $('#pf');
    if (f2 && data) window.camPlayVideo(f2, data, meta.speed || 1);
    else if (f2) f2.innerHTML = `<p class="empty">${t('Failed')}</p>`;
    return;
  }
  const x = await post('getPhoto', { id });
  if (f && x.data) f.innerHTML = `<img src="${x.data}">`;
}


/* ---------- Photos: Locations map + Bluetooth photo sharing ---------- */
Object.assign(TR.ar, { 'Nearby devices': 'الأجهزة القريبة', 'Scan': 'بحث', 'Send photo': 'إرسال صورة', 'Received': 'المستلمة', 'No players nearby': 'لا يوجد لاعبون قريبون', 'Photo sent': 'تم إرسال الصورة', 'Photo received': 'تم استلام صورة', 'Turn on Bluetooth': 'تشغيل البلوتوث', 'Bluetooth is off': 'البلوتوث مغلق', 'Players within 12 m': 'لاعبون ضمن 12 م', 'Send': 'إرسال', 'photos': 'صور', 'without location': 'بدون موقع', 'Share via Bluetooth': 'مشاركة عبر البلوتوث', 'Scanning…': 'جارٍ البحث…' });
Object.assign(TR.fr, { 'Nearby devices': 'Appareils à proximité', 'Scan': 'Rechercher', 'Send photo': 'Envoyer la photo', 'Received': 'Reçues', 'No players nearby': 'Aucun joueur à proximité', 'Photo sent': 'Photo envoyée', 'Photo received': 'Photo reçue', 'Turn on Bluetooth': 'Activer le Bluetooth', 'Bluetooth is off': 'Bluetooth désactivé', 'Players within 12 m': 'Joueurs à moins de 12 m', 'Send': 'Envoyer', 'photos': 'photos', 'without location': 'sans position', 'Share via Bluetooth': 'Partager par Bluetooth', 'Scanning…': 'Recherche…' });

const phHead = (title, extra) => `<div class="phh2"><button id="pab">${I(IP.arrowL, 24)}</button><b>${title}</b>${extra || '<span></span>'}</div>`;

async function phNearby() {
  const near = await post('getNearbyPlayers', {});
  if (!near || !near.ok || !near.list || !near.list.length) return [];
  const info = await post('btNearbyInfo', { list: near.list });
  return (info && info.list) || [];
}
async function phSend(sid, id) {
  const r = await post('btSharePhoto', { serverId: sid, id });
  toast(r && r.ok ? t('Photo sent') : ((r && r.err) || 'Failed'));
  return !!(r && r.ok);
}
const phNearRows = (list, label) => list.map(p => `<div class="phnr"><div><b>${esc(p.name)}</b><small>${p.dist} m</small></div><button class="phsd" data-sid="${p.serverId}">${label}</button></div>`).join('');

/* Locations: every photo that has coordinates, grouped in pins on the GTA map */
function phLocations() {
  const bin = phBin();
  const vis = (st.ph || []).filter(p => !bin.includes(p.id));
  const geo = vis.filter(p => p.x != null && p.y != null);
  const cl = [];
  geo.forEach(p => { const c = cl.find(k => Math.hypot(k.x - p.x, k.y - p.y) < 60); if (c) c.l.push(p); else cl.push({ x: p.x, y: p.y, l: [p] }) });
  const pins = cl.map((k, i) => { const pos = mpGameToPct(k.x, k.y); return `<div class="ph-pin" data-i="${i}" style="left:${pos.left}%;top:${pos.top}%">${k.l.length > 1 ? `<i>${k.l.length}</i>` : ''}</div>` }).join('');
  const noLoc = vis.length - geo.length;
  phView(`${phHead(t('Locations'), `<small>${geo.length}${noLoc ? ` · ${noLoc} ${t('without location')}` : ''}</small>`)}
    <div class="phmap"><div class="mp-map-bg" id="phmapbg"><div class="mp-atlas">${pins}</div></div>
    ${geo.length ? '' : `<p class="empty phmapempty">${t('No photos yet.')}</p>`}
    <div class="phlsh hidden" id="phlsh"></div></div>`);
  $('#pab').onclick = () => photos(st.phTab);
  const el = $('#phmapbg');
  st.mpView = { scale: 2.2, tx: 0, ty: 0 };
  requestAnimationFrame(() => { const c = cl[0] || { x: 100, y: -1000 }; mpCenterOn(c.x, c.y, el); mpBindPanZoom(el) });
  // cover thumbnail on every pin
  el.querySelectorAll('.ph-pin').forEach(async pin => {
    const id = cl[+pin.dataset.i].l[0].id;
    if (!st.pc[id]) { const x = await post('getPhoto', { id, thumb: true }); st.pc[id] = x.data }
    if (st.pc[id]) pin.style.backgroundImage = `url(${st.pc[id]})`;
  });
  let dn = null;
  el.addEventListener('pointerdown', e => { dn = { x: e.clientX, y: e.clientY } });
  el.addEventListener('click', e => {
    if (dn && Math.hypot(e.clientX - dn.x, e.clientY - dn.y) > 5) return;
    const pin = e.target.closest('.ph-pin'); if (!pin) return;
    const k = cl[+pin.dataset.i], sh = $('#phlsh');
    sh.innerHTML = `<div class="phlh"><b>${k.l.length} ${t('photos')}</b><button id="phlc">${I(IP.x, 20)}</button></div><div class="phls" id="phlstrip">${k.l.map(p => phTile(p, [])).join('')}</div>`;
    sh.classList.remove('hidden');
    $('#phlc').onclick = () => sh.classList.add('hidden');
    const strip = $('#phlstrip'); phLoad(strip);
    strip.querySelectorAll('.pt').forEach(tl => tl.onclick = () => photoView(+tl.dataset.id, false, phLocations));
  });
}

/* Shared albums: nearby Bluetooth devices + photos received from other players */
async function phShared() {
  const on = !!st.settings.bluetooth, bin = phBin();
  const rec = (st.ph || []).filter(p => p.from && !bin.includes(p.id));
  phView(`${phHead(t('Shared albums'))}<div class="scr" id="phs">
    <div class="phc"><b>${t('Nearby devices')}</b><p>${on ? t('Players within 12 m') : t('Bluetooth is off')}</p>
      <div class="phca">${on ? `<button id="phscan">${t('Scan')}</button>` : `<button id="phbton">${t('Turn on Bluetooth')}</button>`}</div>
      <div id="phnear"></div></div>
    <div class="alh"><b>${t('Received')}</b><small>${rec.length}</small></div>
    ${rec.length ? `<div class="pg4">${rec.map(p => phTile(p, [])).join('')}</div>` : `<p class="empty">${t('No photos yet.')}</p>`}</div>`);
  $('#pab').onclick = () => photos(st.phTab);
  const root = $('#phs'); phLoad(root);
  root.querySelectorAll('.pg4 .pt').forEach(e => e.onclick = () => photoView(+e.dataset.id, false, phShared));
  if (!on) { $('#phbton').onclick = () => { st.settings.bluetooth = true; applyBT(); save(); setTimeout(phShared, 600) }; return; }
  const scan = async () => {
    const box = $('#phnear'); if (!box) return;
    box.innerHTML = `<p class="empty">${t('Scanning…')}</p>`;
    const list = await phNearby();
    if (!$('#phnear')) return;
    box.innerHTML = list.length ? phNearRows(list, t('Send photo')) : `<p class="empty">${t('No players nearby')}</p>`;
    box.querySelectorAll('.phsd').forEach(b => b.onclick = () => phPickSend(list.find(p => p.serverId === +b.dataset.sid)));
  };
  $('#phscan').onclick = scan; scan();
}

/* choose which photo to send to a player */
function phPickSend(pl) {
  if (!pl) return;
  const bin = phBin(), l = (st.ph || []).filter(p => !bin.includes(p.id) && p.kind !== 'video');
  phView(`${phHead(`${t('Send photo')} · ${esc(pl.name)}`)}<div class="scr" id="phs">${l.length ? `<div class="pg4">${l.map(p => phTile(p, [])).join('')}</div>` : `<p class="empty">${t('No photos yet.')}</p>`}</div>`);
  $('#pab').onclick = phShared;
  const root = $('#phs'); phLoad(root);
  root.querySelectorAll('.pt').forEach(e => e.onclick = async () => { e.style.opacity = .4; await phSend(pl.serverId, +e.dataset.id); e.style.opacity = 1 });
}

/* share button inside the photo viewer */
async function phShareSheet(id) {
  if (!st.settings.bluetooth) return toast(t('Bluetooth is off'));
  const host = $('#pf') && $('#pf').parentElement; if (!host) return;
  const old = $('#phsh'); if (old) old.remove();
  const ov = document.createElement('div'); ov.className = 'phm'; ov.id = 'phsh';
  ov.innerHTML = `<div class="phs" onclick="event.stopPropagation()"><b>${t('Share via Bluetooth')}</b><div id="phshl"><p class="empty">${t('Scanning…')}</p></div></div>`;
  ov.onclick = () => ov.remove();
  host.appendChild(ov);
  const list = await phNearby();
  const box = $('#phshl'); if (!box) return;
  box.innerHTML = list.length ? phNearRows(list, t('Send')) : `<p class="empty">${t('No players nearby')}</p>`;
  box.querySelectorAll('.phsd').forEach(b => b.onclick = async () => {
    b.disabled = true; b.textContent = '…';
    const ok = await phSend(+b.dataset.sid, id);
    b.textContent = ok ? 'OK' : t('Send'); b.disabled = ok;
  });
}


/* ---------- Radio (Samsung Radio style, plays the GTA radio stations) ---------- */
Object.assign(TR.ar, { 'Radio': 'الراديو', 'Turn on the Radio.': 'شغّل الراديو.', 'Stations': 'المحطات', 'Recordings': 'التسجيلات', 'Radio settings': 'إعدادات الراديو', 'Storage': 'التخزين', 'Internal storage': 'التخزين الداخلي', 'Radio text': 'نص الراديو', 'Show the station information.': 'عرض معلومات المحطة.', 'Sleep timer': 'مؤقت النوم', 'Off': 'إيقاف', 'min': 'د', 'Permissions': 'الأذونات', 'About Radio': 'حول الراديو', 'Contact us': 'اتصل بنا', 'No stations': 'لا توجد محطات', 'After you scan for stations, they will appear here.': 'بعد البحث عن المحطات ستظهر هنا.', 'No favourites': 'لا توجد مفضلة', 'Tap the star to add a station.': 'اضغط على النجمة لإضافة محطة.', 'No recordings': 'لا توجد تسجيلات', 'No signal': 'لا توجد إشارة', 'Scan': 'بحث' });
Object.assign(TR.fr, { 'Radio': 'Radio', 'Turn on the Radio.': 'Allumez la radio.', 'Stations': 'Stations', 'Recordings': 'Enregistrements', 'Radio settings': 'Paramètres de la radio', 'Storage': 'Stockage', 'Internal storage': 'Stockage interne', 'Radio text': 'Texte radio', 'Show the station information.': 'Afficher les infos de la station.', 'Sleep timer': 'Minuterie de veille', 'Off': 'Désactivé', 'min': 'min', 'Permissions': 'Autorisations', 'About Radio': 'À propos de Radio', 'Contact us': 'Nous contacter', 'No stations': 'Aucune station', 'After you scan for stations, they will appear here.': 'Après la recherche, les stations apparaîtront ici.', 'No favourites': 'Aucun favori', 'Tap the star to add a station.': 'Touchez l’étoile pour ajouter une station.', 'No recordings': 'Aucun enregistrement', 'No signal': 'Aucun signal', 'Scan': 'Rechercher' });

const RD_MIN = 86, RD_MAX = 110;
st.rd = { on: false, f: 87.5, id: null, tab: 'stations', scanning: false, sleepMin: 0, sleepT: null,
  stations: lsGet('ios_rd_st'), fav: lsGet('ios_rd_fav'), text: localStorage.getItem('ios_rd_text') !== '0' };
const RDI = {
  power: '<path d="M12 3v8M7 6.2a8 8 0 1 0 10 0"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
  starF: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z" fill="currentColor"/>',
  l: '<path d="M15 5l-7 7 7 7"/>', r: '<path d="M9 5l7 7-7 7"/>',
  wave: '<circle cx="12" cy="12" r="2"/><path d="M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
};
const rdAt = (f, tol = 0.05) => st.rd.stations.find(x => Math.abs(x.f - f) < tol);
const rdFmt = f => Number(f).toFixed(1);
const rdTitle = () => { const r = st.rd; if (!r.on) return t('Turn on the Radio.'); const s = rdAt(r.f); return s ? (r.text ? s.n : '') : t('No signal') };

function rdPaint() {
  const r = st.rd, s = rdAt(r.f);
  const set = (id, fn) => { const e = $(id); if (e) fn(e) };
  set('#rdf', e => e.textContent = rdFmt(r.f));
  set('#rdh', e => e.textContent = rdTitle());
  set('#rdsub', e => e.textContent = rdTitle());
  set('#rdin', e => e.style.left = `calc(16px + (100% - 32px) * ${(r.f - RD_MIN) / (RD_MAX - RD_MIN)})`);
  set('#rdpw', e => e.classList.toggle('on', r.on));
  set('#rdcard', e => e.classList.toggle('on', r.on));
  set('#rdst', e => { e.innerHTML = I(s && r.fav.includes(s.id) ? RDI.starF : RDI.star, 28); e.style.visibility = s ? 'visible' : 'hidden' });
  document.querySelectorAll('.rdit').forEach(e => e.classList.toggle('sel', !!s && e.dataset.id === s.id));
}
function rdApply() {                       // make the game match the UI
  const r = st.rd, s = rdAt(r.f);
  if (r.on && s) { if (r.id !== s.id) { r.id = s.id; post('radioPlay', { id: s.id }) } }
  else { r.id = null; post('radioStop') }
}
function rdTune(f, snap) {
  const r = st.rd;
  f = Math.max(RD_MIN, Math.min(RD_MAX, Math.round(f * 10) / 10));
  if (snap) { const n = rdAt(f, 0.35); if (n) f = n.f }
  r.f = f; rdApply(); rdPaint();
}
function rdPower() {
  const r = st.rd; r.on = !r.on;
  if (!r.on) { clearTimeout(r.sleepT); r.sleepMin = 0 }
  rdApply(); rdPaint();
}
function rdStep(dir) {
  const r = st.rd, l = [...r.stations].sort((a, b) => a.f - b.f);
  if (l.length) {
    const n = dir > 0 ? l.find(x => x.f > r.f + 0.05) || l[0] : [...l].reverse().find(x => x.f < r.f - 0.05) || l[l.length - 1];
    r.on = true; return rdTune(n.f);
  }
  rdTune(r.f + dir * 0.1);
}
function rdScan() {
  const r = st.rd; if (r.scanning) return;
  r.scanning = true; r.on = true; r.id = null; post('radioStop');
  const btn = $('#rdscan'); if (btn) btn.classList.add('busy');
  let f = RD_MIN;
  const iv = setInterval(async () => {
    f += 0.45; r.f = Math.min(f, RD_MAX); rdPaint();
    if (f < RD_MAX) return;
    clearInterval(iv);
    const res = await post('radioList');
    r.stations = (res && res.list) || []; lsSet('ios_rd_st', r.stations);
    r.scanning = false;
    if (r.stations.length) { r.f = r.stations[0].f; rdApply() } else { r.f = 87.5 }
    r.tab = 'stations'; radio(r.tab, true);
  }, 35);
}

async function radio(tab, keep) {
  const r = st.rd; if (tab && tab !== true) r.tab = tab;
  if (!keep) { const x = await post('radioState'); r.on = !!(x && x.on); if (r.on && x.id) { const s = r.stations.find(q => q.id === x.id); if (s) { r.f = s.f; r.id = s.id } } }
  const fav = r.fav, list = r.tab === 'fav' ? r.stations.filter(x => fav.includes(x.id)) : r.stations;
  const rows = list.length ? list.map(x => `<div class="rdit" data-id="${esc(x.id)}"><b>${rdFmt(x.f)}</b><span>${esc(x.n)}</span><button class="rdfv" data-id="${esc(x.id)}">${I(fav.includes(x.id) ? RDI.starF : RDI.star, 22)}</button></div>`).join('')
    : `<div class="rdemp"><h3>${r.tab === 'fav' ? t('No favourites') : t('No stations')}</h3><p>${r.tab === 'fav' ? t('Tap the star to add a station.') : t('After you scan for stations, they will appear here.')}</p></div>`;
  const ticks = [86, 89, 92, 95, 98, 101, 104, 107, 110].map(v => `<i style="left:${(v - RD_MIN) / (RD_MAX - RD_MIN) * 100}%">${v}</i>`).join('');
  view(t('Radio'), `<div class="rdw">
    <div class="rdtop"><button id="rdback">${I(RDI.l, 24)}</button><button id="rdmenu">${I(IP.dots, 22)}</button></div>
    <div class="rdmm hidden" id="rdmm"><div data-m="rec">${t('Recordings')}</div><div data-m="set">${t('Settings')}</div></div>
    <h1 class="rdh" id="rdh"></h1>
    <div class="rdcard" id="rdcard">
      <div class="rdr1"><button id="rdpw" class="rdpw">${I(RDI.power, 26)}</button><button id="rdscan" class="rdscan">${t('Scan')}</button></div>
      <div class="rdr2"><button id="rdpv" class="rdar">${I(RDI.l, 30)}</button><div class="rdfw"><span id="rdf">${rdFmt(r.f)}</span><button id="rdst" class="rdstar"></button></div><button id="rdnx" class="rdar">${I(RDI.r, 30)}</button></div>
      <div class="rdsub" id="rdsub"></div>
      <div class="rdrl" id="rdrl"><div class="rdlb">${ticks}</div><div class="rdtk"></div><div class="rdin" id="rdin"></div></div>
    </div>
    <div class="rdlist scr" id="rdlist">${rows}</div>
    <div class="rdnav"><button data-t="fav" class="${r.tab === 'fav' ? 'on' : ''}">${I(RDI.star, 26)}<span>${t('Favourites')}</span></button><button data-t="stations" class="${r.tab !== 'fav' ? 'on' : ''}">${I(RDI.wave, 26)}<span>${t('Stations')}</span></button></div>
  </div>`, { dark: true, app: 'rd', nohdr: true, cls: 'full rdb' });
  rdPaint();
  $('#rdback').onclick = home;
  $('#rdpw').onclick = rdPower;
  $('#rdscan').onclick = rdScan;
  $('#rdpv').onclick = () => rdStep(-1);
  $('#rdnx').onclick = () => rdStep(1);
  $('#rdst').onclick = () => { const s = rdAt(r.f); if (!s) return; r.fav = r.fav.includes(s.id) ? r.fav.filter(x => x !== s.id) : [...r.fav, s.id]; lsSet('ios_rd_fav', r.fav); radio(r.tab, true) };
  $('#rdmenu').onclick = e => { e.stopPropagation(); $('#rdmm').classList.toggle('hidden') };
  $('#rdmm').onclick = e => { e.stopPropagation(); $('#rdmm').classList.add('hidden'); const m = e.target.dataset.m; if (m === 'set') radioSettings(); else if (m === 'rec') radioRecordings() };
  $('#app').onclick = () => { const m = $('#rdmm'); if (m) m.classList.add('hidden') };
  document.querySelectorAll('.rdnav button').forEach(b => b.onclick = () => radio(b.dataset.t, true));
  document.querySelectorAll('.rdit').forEach(e => e.onclick = ev => {
    if (ev.target.closest('.rdfv')) return;
    const s = r.stations.find(x => x.id === e.dataset.id); if (s) { r.on = true; rdTune(s.f) }
  });
  document.querySelectorAll('.rdfv').forEach(b => b.onclick = ev => { ev.stopPropagation(); const id = b.dataset.id; r.fav = r.fav.includes(id) ? r.fav.filter(x => x !== id) : [...r.fav, id]; lsSet('ios_rd_fav', r.fav); radio(r.tab, true) });
  // drag on the tuner
  const rl = $('#rdrl');
  const fromX = x => { const b = rl.getBoundingClientRect(), pad = 16; return RD_MIN + Math.max(0, Math.min(1, (x - b.left - pad) / (b.width - pad * 2))) * (RD_MAX - RD_MIN) };
  let drag = false;
  rl.onpointerdown = e => { drag = true; rl.setPointerCapture(e.pointerId); r.f = Math.round(fromX(e.clientX) * 10) / 10; rdPaint() };
  rl.onpointermove = e => { if (!drag) return; r.f = Math.round(fromX(e.clientX) * 10) / 10; rdPaint() };
  rl.onpointerup = e => { if (!drag) return; drag = false; rdTune(fromX(e.clientX), true) };
}

function radioRecordings() {
  view(t('Recordings'), `<div class="rdw"><div class="rdtop"><button id="rdback">${I(RDI.l, 24)}</button><b class="rdtt">${t('Recordings')}</b><span></span></div>
    <div class="rdemp" style="margin-top:40%"><h3>${t('No recordings')}</h3></div></div>`, { dark: true, app: 'rd', nohdr: true, cls: 'full rdb' });
  $('#rdback').onclick = () => radio(null, true);
}
function radioSettings() {
  const r = st.rd, sl = r.sleepMin ? `${r.sleepMin} ${t('min')}` : t('Off');
  view(t('Radio settings'), `<div class="rdw"><div class="rdtop"><button id="rdback">${I(RDI.l, 24)}</button><b class="rdtt">${t('Radio settings')}</b><span></span></div>
    <div class="scr rdsc">
      <div class="rdcd">
        <div class="rdsr dim"><div><b>${t('Storage')}</b><small>${t('Internal storage')}</small></div></div>
        <div class="rdsr"><div><b>${t('Radio text')}</b><small class="g">${t('Show the station information.')}</small></div>${ssToggle('rd-text', r.text)}</div>
        <div class="rdsr" id="rd-sl"><div><b>${t('Sleep timer')}</b><small>${sl}</small></div></div>
      </div>
      <div class="rdcd"><div class="rdsr" id="rd-pm"><div><b>${t('Permissions')}</b></div></div></div>
      <div class="rdcd"><div class="rdsr" id="rd-ab"><div><b>${t('About Radio')}</b></div></div><div class="rdsr" id="rd-ct"><div><b>${t('Contact us')}</b></div></div></div>
    </div>
    <div class="phm hidden" id="rdsh"><div class="phs" onclick="event.stopPropagation()"><b>${t('Sleep timer')}</b>
      ${[0, 15, 30, 60, 90].map(m => `<div class="rdop ${r.sleepMin === m ? 'on' : ''}" data-m="${m}">${m ? m + ' ' + t('min') : t('Off')}</div>`).join('')}</div></div></div>`,
    { dark: true, app: 'rd', nohdr: true, cls: 'full rdb' });
  $('#rdback').onclick = () => radio(null, true);
  $('#rd-text').onchange = e => { r.text = e.target.checked; localStorage.setItem('ios_rd_text', r.text ? '1' : '0') };
  $('#rd-sl').onclick = () => $('#rdsh').classList.remove('hidden');
  $('#rdsh').onclick = () => $('#rdsh').classList.add('hidden');
  document.querySelectorAll('.rdop').forEach(o => o.onclick = () => {
    const m = +o.dataset.m; r.sleepMin = m; clearTimeout(r.sleepT);
    if (m) r.sleepT = setTimeout(() => { if (r.on) rdPower(); r.sleepMin = 0 }, m * 60000);
    radioSettings();
  });
  $('#rd-pm').onclick = $('#rd-ct').onclick = () => toast(t('Coming soon'));
  $('#rd-ab').onclick = () => toast('Radio 1.0');
}

/* ---------- Weather ---------- */
const COND = {
  EXTRASUNNY: ['sun', 'wx_EXTRASUNNY'], CLEAR: ['suncloud', 'wx_CLEAR'], CLOUDS: ['cloud', 'wx_CLOUDS'], SMOG: ['fog', 'wx_SMOG'], FOGGY: ['fog', 'wx_FOGGY'],
  OVERCAST: ['cloud', 'wx_OVERCAST'], RAIN: ['rain', 'wx_RAIN'], THUNDER: ['thunder', 'wx_THUNDER'], CLEARING: ['sunrain', 'wx_CLEARING'], NEUTRAL: ['suncloud', 'wx_CLEAR'],
  SNOW: ['snow', 'wx_SNOW'], BLIZZARD: ['snow', 'wx_BLIZZARD'], SNOWLIGHT: ['snow', 'wx_SNOWLIGHT'], XMAS: ['snow', 'wx_SNOW'], HALLOWEEN: ['fog', 'wx_FOGGY'],
};
const BASE = { EXTRASUNNY: 32, CLEAR: 28, CLOUDS: 24, SMOG: 26, FOGGY: 18, OVERCAST: 21, RAIN: 17, THUNDER: 16, CLEARING: 20, NEUTRAL: 24, SNOW: -1, BLIZZARD: -6, SNOWLIGHT: 2, XMAS: 0, HALLOWEEN: 14 };
const temp = (type, h) => Math.round((BASE[type] ?? 24) + 5 * Math.sin(((h % 24) - 9) / 24 * 2 * Math.PI));
const isNight = h => h < 6 || h >= 20;
/* Weather condition SVGs */
const WX_SVG = {
  sun: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="12" fill="#FFD60A"/><g stroke="#FFD60A" stroke-width="3" stroke-linecap="round"><path d="M32 8v6M32 50v6M8 32h6M50 32h6M14 14l4.2 4.2M45.8 45.8L50 50M50 14l-4.2 4.2M14 50l4.2-4.2"/></g></svg>`,
  moon: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><path d="M40 12a20 20 0 1 0 8 36 16 16 0 1 1-8-36z" fill="#E8ECF4"/></svg>`,
  cloud: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><path d="M22 44h28a12 12 0 0 0 0-24 14 14 0 0 0-26-4 12 12 0 0 0-2 28z" fill="#C5CDD8"/></svg>`,
  suncloud: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><circle cx="22" cy="22" r="9" fill="#FFD60A"/><g stroke="#FFD60A" stroke-width="2.5" stroke-linecap="round"><path d="M22 6v4M6 22h4M12 12l2.5 2.5M12 32l2.5-2.5"/></g><path d="M24 46h26a11 11 0 0 0 0-22 13 13 0 0 0-24-3 11 11 0 0 0-2 25z" fill="#E8ECF4"/></svg>`,
  rain: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><path d="M20 34h28a11 11 0 0 0 0-22 13 13 0 0 0-24-3 11 11 0 0 0-4 25z" fill="#A8B4C4"/><g stroke="#5AC8FA" stroke-width="2.5" stroke-linecap="round"><path d="M24 42v8M32 40v10M40 42v8M28 48v6M36 48v6"/></g></svg>`,
  thunder: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><path d="M18 32h28a11 11 0 0 0 0-22 13 13 0 0 0-24-3 11 11 0 0 0-4 25z" fill="#7A8799"/><path d="M34 28l-8 14h8l-4 14 14-18h-8l6-10z" fill="#FFD60A"/></svg>`,
  sunrain: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><circle cx="18" cy="18" r="8" fill="#FFD60A"/><path d="M24 40h26a10 10 0 0 0 0-20 12 12 0 0 0-22-3 10 10 0 0 0-4 23z" fill="#E8ECF4"/><g stroke="#5AC8FA" stroke-width="2.2" stroke-linecap="round"><path d="M28 46v7M36 44v9M44 46v7"/></g></svg>`,
  fog: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><g stroke="#C5CDD8" stroke-width="3" stroke-linecap="round"><path d="M12 24h40M16 34h32M14 44h36"/></g></svg>`,
  snow: (s) => `<svg class="wx-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><path d="M20 32h28a11 11 0 0 0 0-22 13 13 0 0 0-24-3 11 11 0 0 0-4 25z" fill="#C5CDD8"/><g fill="#fff" stroke="#B0B8C4" stroke-width="1"><circle cx="26" cy="44" r="2.5"/><circle cx="36" cy="48" r="2.5"/><circle cx="46" cy="44" r="2.5"/><circle cx="31" cy="52" r="2"/><circle cx="41" cy="54" r="2"/></g></svg>`,
};
const icon = (type, h, size) => {
  const s = size || 28;
  if (isNight(h) && ['EXTRASUNNY', 'CLEAR', 'NEUTRAL', 'CLEARING'].includes(type)) return WX_SVG.moon(s);
  const key = (COND[type] || COND.CLEAR)[0];
  return (WX_SVG[key] || WX_SVG.suncloud)(s);
};
const iconBig = (type, h) => icon(type, h, 72);
const iconSm = (type, h) => icon(type, h, 22);
const RAINP = { RAIN: 75, THUNDER: 85, CLEARING: 35, OVERCAST: 20, CLOUDS: 6, SMOG: 3, FOGGY: 10, SNOW: 70, BLIZZARD: 85, SNOWLIGHT: 45, XMAS: 40 };
const WX_PLACES = ['Los Santos', 'Vinewood', 'Del Perro', 'Vespucci Beach', 'Mirror Park', 'Rockford Hills', 'Davis', 'Sandy Shores', 'Grapeseed', 'Paleto Bay', 'Mount Chiliad', 'Chumash', 'Harmony', 'Grand Senora Desert', 'Fort Zancudo', 'Palomino Highlands'];
const WXI = {
  pin: '<path d="M12 21s-7-6.200-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  list: '<path d="M4 6h10M4 12h6M4 18h6"/><path d="M17 20s-4-3.400-4-6.300a4 4 0 0 1 8 0C21 16.600 17 20 17 20z"/><circle cx="17" cy="13.500" r="1.300"/>',
  drop: '<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z" fill="currentColor" stroke="none"/>',
  temp: '<path d="M10 14.500V5a2 2 0 0 1 4 0v9.500a4 4 0 1 1-4 0z"/>',
  wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7"/>',
};
const wxPick = () => st.wxLoc || null;
async function weather() {
  const b = view(t('Weather'), '<div class="wxs"></div><div class="wxbar"><button id="wxl">' + I(WXI.list, 26) + '</button><button id="wxs">' + I(IP.search, 26) + '</button></div>', { nohdr: true, dark: true, app: 'wxa', cls: 'full' });
  $('#screen').classList.remove('light');
  $('#wxl').onclick = $('#wxs').onclick = weatherSearch;
  const draw = async () => {
    const w = await post('getWeather'); const el = $('.wxs'); if (!el || !w.type) return;
    const type = w.type, nxt = w.next || type, h = w.hour ?? 12, c = COND[type] || COND.CLEAR;
    const cur = temp(type, h);
    const all = Array.from({ length: 24 }, (_, i) => temp(type, i));
    const hi = Math.max(...all), lo = Math.min(...all);
    const feels = cur + Math.round((w.rain || 0) * -2 - (w.wind || 0) * 0.6 + (type === 'EXTRASUNNY' ? 1 : 0));
    const N = 10, W = 62;
    const cols = Array.from({ length: N }, (_, i) => { const hh = (h + i) % 24; const tp = i < 4 ? type : nxt; return { hh, tp, tmp: temp(tp, hh), rain: i === 0 && (w.rain || 0) > 0 ? Math.round(w.rain * 100) : (RAINP[tp] ?? 0) } });
    const mn = Math.min(...cols.map(x => x.tmp)), mx = Math.max(...cols.map(x => x.tmp)), rg = Math.max(mx - mn, 1);
    const pts = cols.map((x, i) => [i * W + W / 2, 38 - ((x.tmp - mn) / rg) * 28]);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}` }
    const avg = Math.round(all.reduce((a, x) => a + x, 0) / 24), diff = cur - avg;
    const word = Math.abs(diff) < 1 ? t('Temperatures are about average') : (diff > 0 ? t('Temperatures a little higher than average') : t('Temperatures a little lower than average'));
    const nxtTxt = nxt !== type ? `${t('Changing to')} ${t((COND[nxt] || COND.CLEAR)[1])}` : t('No change expected');
    const sc = el.scrollTop, hs = ($('.wxh') || {}).scrollLeft || 0;
    $('#app').dataset.sky = isNight(h) ? 'night' : (['RAIN', 'THUNDER', 'OVERCAST', 'FOGGY', 'SMOG', 'SNOW', 'BLIZZARD', 'SNOWLIGHT'].includes(type) ? 'grey' : 'day');
    el.innerHTML = `<div class="wxloc">${I(WXI.pin, 22)}<b>${esc(wxPick() || w.zone || 'Los Santos')}</b></div>
      <div class="wxhero"><div class="wxbig">${cur}°</div><div class="wxico">${iconBig(type, h)}</div></div>
      <div class="wxcond">${t(c[1])}</div>
      <div class="wxhl"><span>↑${hi}° / ↓${lo}°</span><span>${t('Feels like')} ${feels}°</span></div>
      <div class="wxcard"><p class="wxsum">${t(c[1])}. ${t('Highs')} ${hi - 1} ${t('to')} ${hi + 1}°C ${t('and lows')} ${lo - 1} ${t('to')} ${lo + 1}°C.</p>
        <div class="wxh"><div class="wxhi" style="width:${N * W}px">
          <div class="wxr">${cols.map((x, i) => `<span>${i ? String(x.hh).padStart(2, '0') + ':00' : t('Now')}</span>`).join('')}</div>
          <div class="wxr wxic">${cols.map(x => `<span class="wxic-i">${iconSm(x.tp, x.hh)}</span>`).join('')}</div>
          <div class="wxr wxtp">${cols.map(x => `<span>${x.tmp}°</span>`).join('')}</div>
          <svg class="wxg" width="${N * W}" height="46" viewBox="0 0 ${N * W} 46"><path d="${d}" fill="none" stroke="#ffd84a" stroke-width="2.2" stroke-linecap="round"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff"/>`).join('')}</svg>
          <div class="wxr wxrn">${cols.map(x => `<span>${I(WXI.drop, 13)}${x.rain}%</span>`).join('')}</div>
        </div></div></div>
      <div class="wxcard wxrw"><div class="wxct">${I(WXI.temp, 18)}<span>${t("Today's Temperature")}</span></div><div class="wxrow"><p>${word}</p><b>${Math.abs(diff)}°${diff > 0 ? '↑' : diff < 0 ? '↓' : ''}</b></div></div>
      <div class="wxtwo"><div class="wxcard"><div class="wxct">${I(WXI.wind, 18)}<span>${t('Wind')}</span></div><div class="wxv">${Math.round((w.wind || 0) * 3.6)}<small> km/h</small></div></div>
      <div class="wxcard"><div class="wxct">${I(WXI.drop, 16)}<span>${t('Rain')}</span></div><div class="wxv">${Math.round((w.rain || 0) * 100)}<small> %</small></div></div></div>
      <div class="wxcard wxrw"><div class="wxct">${icon(nxt, (h + 2) % 24, 28)}<span>${t('Next')}</span></div><div class="wxrow"><p>${nxtTxt}</p></div></div>`;
    el.scrollTop = sc; const nh = $('.wxh'); if (nh) nh.scrollLeft = hs;
  };
  await draw(); clearInterval(st.wi); st.wi = setInterval(draw, 15000);
}
function weatherSearch() {
  view(t('Weather'), `<div class="wxsh"><button id="wxbk">${I(IP.arrowL, 24)}</button><input id="wxq" placeholder="${t('Search')}" autocomplete="off"><span>${I(IP.mic, 22)}</span></div><div class="wxsl" id="wxsl"></div>`, { nohdr: true, dark: true, app: 'wxa wxsr', cls: 'full' });
  $('#screen').classList.remove('light');
  $('#wxbk').onclick = weather;
  const draw = () => {
    const q = $('#wxq').value.trim().toLowerCase(); const l = q ? WX_PLACES.filter(x => x.toLowerCase().includes(q)) : [];
    $('#wxsl').innerHTML = !q ? `<p class="wxe">${t('Enter a location name.')}</p>` : l.length ? l.map(x => `<div class="wxpl" data-p="${esc(x)}">${I(WXI.pin, 20)}<span>${esc(x)}</span></div>`).join('') : `<p class="wxe">${t('No results')}</p>`;
    $('#wxsl').querySelectorAll('.wxpl').forEach(e => e.onclick = () => { st.wxLoc = e.dataset.p; weather() });
  };
  $('#wxq').oninput = draw; draw(); $('#wxq').focus();
}


/* ---------- Ringtone / vibration ---------- */
function stopAudio() { if (st.audio) { st.audio.pause(); st.audio = null } }
const toneFile = n => `sounds/${st.tones.includes(n) ? n : st.tones[0]}.mp3`;   // unknown / old tone names fall back to the first tone
function playTone(name, loop) {
  stopAudio();
  // Respect mute / silent mode
  const mode = st.settings.soundMode || 'sound';
  if (mode === 'mute' || mode === 'silent' || (st.settings.volume || 0) === 0) return;
  try {
    const a = new Audio(toneFile(name));
    a.loop = !!loop;
    a.volume = Math.max(0, Math.min(1, (st.settings.volume ?? 70) / 100));
    a.play().catch(() => { });
    st.audio = a;
  } catch (e) { }
}
function startRing() {
  st.ringing = true;
  const mode = st.settings.soundMode || 'sound';
  // Always vibrate if enabled (even in silent mode)
  if (st.settings.vibration !== false) $('#phone').classList.add('vib');
  // Play ringtone only when not muted / silent
  if (mode !== 'mute' && mode !== 'silent' && (st.settings.volume || 0) > 0) {
    playTone(st.settings.ringtone || 'samsung', true);
  }
}
function stopRing() { st.ringing = false; stopAudio(); $('#phone').classList.remove('vib') }

/* ---------- Settings ---------- */
let saveT; function save() { clearTimeout(saveT); saveT = setTimeout(() => post('saveSettings', st.settings), 300) }
function applyWall() { $('#screen').style.backgroundImage = `url("${String(st.settings.wallpaper).replace(/"/g, '')}")`; lockTone() }
function toneSync() {
  const sc = $('#screen'); if (!sc) return;
  const on = !$('#lock')?.classList.contains('hidden') || !$('#home')?.classList.contains('hidden');
  sc.classList.toggle('on-lock', !$('#lock')?.classList.contains('hidden'));
  sc.classList.toggle('on-home', on); sc.classList.toggle('wp-light', !!st.wpLight);
}
(() => { const mo = new MutationObserver(toneSync); ['#lock', '#home'].forEach(q => { const e = $(q); if (e) mo.observe(e, { attributes: true, attributeFilter: ['class'] }) }); })();
/* light wallpaper behind the clock -> dark lock-screen text (like One UI) */
function lockTone() {
  const url = String(st.settings.wallpaper || ''), im = new Image();
  im.onload = () => {
    let dark = false;
    try {
      const c = document.createElement('canvas'), W = 24, H = 48; c.width = W; c.height = H;
      const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H);
      const d = g.getImageData(0, Math.round(H * .08), W, Math.round(H * .3)).data; let sum = 0;
      for (let i = 0; i < d.length; i += 4) sum += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      dark = sum / (d.length / 4) > 0.64;
    } catch (e) { }
    if (url !== String(st.settings.wallpaper || '')) return;
    $('#lock')?.classList.toggle('lk-dark', dark);
    st.wpLight = dark; toneSync();
  };
  im.src = url;
}
function applyBT() { $('#bt').classList.toggle('hide', !st.settings.bluetooth) }
function applyTheme() { $('#phone').classList.toggle('dk', st.settings.theme === 'dark') }
function applyBright() { $('#dim').style.opacity = ((100 - st.settings.brightness) / 100) * 0.85 }
function applyLang() {
  const rtl = st.settings.language === 'ar';
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  document.documentElement.lang = st.settings.language;
}
function applyAll() { applyWall(); applyBT(); applyTheme(); applyBright(); applyLang() }

const chev = `<small class="ss-chev">›</small>`;
const SS_ICO = {
  wifi: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 18.5a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z" fill="#fff"/><path d="M8.6 14.3a5 5 0 0 1 6.8 0M5.5 11.2a9 9 0 0 1 13 0M2.8 8.2a13 13 0 0 1 18.4 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  devices: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2" stroke="#fff" stroke-width="1.8"/><path d="M10 17h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  modes: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.8"/><path d="M12 12V5a7 7 0 0 1 7 7H12z" fill="#fff"/></svg>',
  sound: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#fff"/><path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
  notif: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  display: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#fff"/><g stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></g></svg>',
  battery: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="14" height="10" rx="2" stroke="#fff" stroke-width="1.8"/><path d="M18 10v4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  wall: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" stroke-width="1.8"/><circle cx="9" cy="11" r="2" fill="#fff"/><path d="M3 16l5-4 4 3 3-2 6 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  theme: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h10v12H4zM14 9h6v9h-6z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#fff" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" stroke-width="1.8"/></svg>',
  security: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  location: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" fill="#fff"/></svg>',
  safety: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4z" fill="#fff"/></svg>',
  accounts: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M18 2v5h-5M6 22v-5h5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  google: '<svg width="18" height="18" viewBox="0 0 24 24"><text x="12" y="16" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">G</text></svg>',
  wellbeing: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" fill="#fff"/></svg>',
  care: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#fff" stroke-width="1.8"/><path d="M9 9h6M9 13h6M9 17h4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
  apps: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="6" height="6" rx="1.5" fill="#fff"/><rect x="14" y="4" width="6" height="6" rx="1.5" fill="#fff"/><rect x="4" y="14" width="6" height="6" rx="1.5" fill="#fff"/><rect x="14" y="14" width="6" height="6" rx="1.5" fill="#fff"/></svg>',
  general: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 8h16M4 16h16M8 4v4M16 16v4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  access: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2.5" fill="#fff"/><path d="M12 9v6M9 21l3-6 3 6M7 13h10" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  update: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8 10l4 4 4-4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 18h14" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  guide: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#fff" stroke-width="1.8"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
  remote: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 8-8M20 12a8 8 0 0 1-8 8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="2.5" fill="#fff"/></svg>',
  about: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.8"/><path d="M12 11v6M12 8v.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  lang: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="#fff" stroke-width="1.5"/></svg>',
};

function ssRow(id, color, ico, title, sub) {
  return `<div class="ss-row" data-ss="${id}"><span class="ss-ico" style="background:${color}">${ico}</span><div class="ss-txt"><b>${esc(title)}</b><small>${esc(sub)}</small></div></div>`;
}
function ssGroup(rows) {
  return `<div class="ss-card">${rows.join('<div class="ss-div"></div>')}</div>`;
}

function settings() {
  const name = st.me.name || 'Player';
  const initial = (name[0] || '?').toUpperCase();
  const html = `
    <div class="ss-wrap">
      <div class="ss-head">
        <h1>Settings</h1>
        <button type="button" class="ss-search" id="ss-search">${SS_ICO.search}</button>
      </div>
      <div class="ss-account">
        <div class="ss-acc-txt"><b>${esc(name)}</b><small>Samsung account</small></div>
        <div class="ss-av">${esc(initial)}</div>
      </div>
      ${ssGroup([
        ssRow('conn', '#2f6bff', SS_ICO.wifi, 'Connections', 'Wi-Fi · Bluetooth · SIM manager'),
        ssRow('devices', '#2f6bff', SS_ICO.devices, 'Connected devices', 'Quick Share · Android Auto'),
      ])}
      ${ssGroup([
        ssRow('modes', '#7c4dff', SS_ICO.modes, 'Modes and Routines', 'Modes · Routines'),
        ssRow('sound', '#7c4dff', SS_ICO.sound, 'Sounds and vibration', 'Sound mode · Ringtone'),
        ssRow('notif', '#ff6d00', SS_ICO.notif, 'Notifications', 'Status bar · Do not disturb'),
      ])}
      ${ssGroup([
        ssRow('display', '#00c853', SS_ICO.display, 'Display', 'Brightness · Eye comfort shield · Navigation bar'),
        ssRow('battery', '#00c853', SS_ICO.battery, 'Battery', 'Power saving · Charging'),
      ])}
      ${ssGroup([
        ssRow('wall', '#ec407a', SS_ICO.wall, 'Wallpaper and style', 'Wallpapers · Colour palette'),
        ssRow('themes', '#ec407a', SS_ICO.theme, 'Themes', 'Themes · Wallpapers · Icons'),
        ssRow('homes', '#2979ff', SS_ICO.home, 'Home screen', 'Layout · App icon badges'),
        ssRow('locks', '#2979ff', SS_ICO.lock, 'Lock screen', 'Screen lock and biometrics'),
      ])}
      ${ssGroup([
        ssRow('security', '#7c4dff', SS_ICO.security, 'Security and privacy', 'Auto Blocker · Permission usage'),
        ssRow('location', '#7c4dff', SS_ICO.location, 'Location', 'Location requests'),
        ssRow('safety', '#e53935', SS_ICO.safety, 'Safety and emergency', 'Medical info · Wireless emergency alerts'),
      ])}
      ${ssGroup([
        ssRow('accounts', '#2979ff', SS_ICO.accounts, 'Accounts and backup', 'Manage accounts · Smart Switch'),
        ssRow('google', '#2979ff', SS_ICO.google, 'Google', 'Google services'),
      ])}
      ${ssGroup([
        ssRow('wellbeing', '#00c853', SS_ICO.wellbeing, 'Digital Wellbeing and parental controls', 'Screen time · App timers'),
        ssRow('care', '#7c4dff', SS_ICO.care, 'Device care', 'Storage · Memory · App protection'),
        ssRow('apps', '#2979ff', SS_ICO.apps, 'Apps', 'Default apps · App settings'),
      ])}
      ${ssGroup([
        ssRow('general', '#7c4dff', SS_ICO.general, 'General management', 'Language and keyboard · Date and time'),
        ssRow('access', '#00c853', SS_ICO.access, 'Accessibility', 'Vision · Hearing · Dexterity'),
      ])}
      ${ssGroup([
        ssRow('update', '#2979ff', SS_ICO.update, 'Software update', 'Download and install'),
        ssRow('guide', '#ffb300', SS_ICO.guide, 'User guide', 'Learn more'),
        ssRow('remote', '#ffb300', SS_ICO.remote, 'Remote management', 'Remote management'),
        ssRow('about', '#7c4dff', SS_ICO.about, 'About phone', 'Status · Legal information · Phone name'),
      ])}
    </div>`;
  view(t('Settings'), html, { dark: true, nohdr: true, app: 'ssam', cls: 'full' });
  $('#screen').classList.remove('light');
  document.querySelectorAll('[data-ss]').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.ss;
      const map = {
        conn: connectionsSettings, devices: connectedDevices,
        modes: modesSettings, sound: soundSettings, notif: notifSettings,
        display: displaySettings, battery: batterySettings,
        wall: wallpapers, themes: wallpapers, homes: homeScreenSettings, locks: lockScreenSettings,
        security: securitySettings, location: locationSettings, safety: safetySettings,
        accounts: accountsSettings, google: googleSettings,
        wellbeing: wellbeingSettings, care: deviceCareSettings, apps: appsSettings,
        general: generalSettings, access: accessSettings,
        update: softwareUpdate, guide: smartTutor, remote: smartTutor, about: aboutPhone
      };
      if (map[id]) map[id]();
      else toast(el.querySelector('b')?.textContent || 'Settings');
    };
  });
  $('#ss-search')?.addEventListener('click', () => toast('Search settings'));
}


function ssPage(title, bodyHtml) {
  view(title, `<div class="ss-wrap"><div class="ss-subhead"><button type="button" class="ss-back" id="ssbk">‹</button><h2>${esc(title)}</h2><button type="button" class="ss-search" id="ss-search2">${SS_ICO.search}</button></div>${bodyHtml}</div>`, { dark: true, nohdr: true, app: 'ssam', cls: 'full' });
  $('#screen').classList.remove('light');
  $('#ssbk').onclick = settings;
  $('#ss-search2')?.addEventListener('click', () => toast('Search'));
}
function ssToggle(id, checked) {
  return `<label class="sw"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}><i></i></label>`;
}
function ssLink(title, sub) {
  return `<div class="ss-row ss-link"><div class="ss-txt"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div></div>`;
}
function ssLook(items) {
  return `<div class="ss-look"><div class="ss-look-t">Looking for something else?</div>${items.map(x => `<button type="button" class="ss-look-a">${esc(x)}</button>`).join('')}</div>`;
}

function connectionsSettings() {
  const s = st.settings;
  ssPage('Connections', `
    <div class="ss-card">
      <div class="ss-row" style="cursor:default">
        <div class="ss-txt"><b>Wi-Fi</b><small class="ss-blue">${s.wifi && !s.airplane ? 'Los Santos Net' : 'Off'}</small></div>
        ${ssToggle('ss-wifi', s.wifi && !s.airplane)}
      </div>
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default">
        <div class="ss-txt"><b>Bluetooth</b></div>
        ${ssToggle('ss-bt', !!s.bluetooth)}
      </div>
    </div>
    <div class="ss-card" id="bt-near-card" style="${s.bluetooth ? '' : 'display:none'}">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Nearby devices</b><small>Share phone number via Bluetooth</small></div>
        <button type="button" class="ss-blue-btn" id="bt-scan" style="padding:6px 12px;border:0;border-radius:16px;background:#2f6bff;color:#fff;font-size:12px">Scan</button>
      </div>
      <div id="bt-near-list"><p class="empty" style="padding:8px 16px;font-size:13px;opacity:.7">Tap Scan to find players nearby (12m)</p></div>
    </div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default">
        <div class="ss-txt"><b>Flight mode</b></div>
        ${ssToggle('ss-air', !!s.airplane)}
      </div>
    </div>
    <div class="ss-card">
      ${ssLink('SIM manager')}
      <div class="ss-div"></div>
      ${ssLink('Mobile networks')}
      <div class="ss-div"></div>
      ${ssLink('Data usage')}
      <div class="ss-div"></div>
      ${ssLink('Mobile Hotspot and Tethering')}
    </div>
    <div class="ss-card">${ssLink('More connection settings')}</div>
    ${ssLook(['Samsung Cloud', 'Android Auto', 'Quick Share'])}
  `);
  $('#ss-wifi').onchange = e => { st.settings.wifi = e.target.checked; if (e.target.checked) st.settings.airplane = false; save(); connectionsSettings(); };
  $('#ss-bt').onchange = e => { st.settings.bluetooth = e.target.checked; applyBT(); save(); connectionsSettings(); };
  $('#ss-air').onchange = e => { st.settings.airplane = e.target.checked; if (e.target.checked) { st.settings.wifi = false; st.settings.mobiledata = false; } save(); connectionsSettings(); };
  $('#bt-scan')?.addEventListener('click', async () => {
    const box = $('#bt-near-list');
    if (!box) return;
    box.innerHTML = `<p class="empty" style="padding:8px 16px;font-size:13px">Scanning…</p>`;
    const near = await post('getNearbyPlayers', {});
    if (!near.ok || !near.list || !near.list.length) {
      box.innerHTML = `<p class="empty" style="padding:8px 16px;font-size:13px;opacity:.7">No players nearby</p>`;
      return;
    }
    const info = await post('btNearbyInfo', { list: near.list });
    const list = (info && info.list) || [];
    if (!list.length) {
      box.innerHTML = `<p class="empty" style="padding:8px 16px;font-size:13px;opacity:.7">No players nearby</p>`;
      return;
    }
    box.innerHTML = list.map(p => `
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default">
        <div class="ss-txt"><b>${esc(p.name)}</b><small>${esc(p.number)} · ${p.dist}m</small></div>
        <button type="button" class="ss-blue-btn bt-share" data-sid="${p.serverId}" style="padding:6px 12px;border:0;border-radius:16px;background:#2f6bff;color:#fff;font-size:12px">Share</button>
      </div>`).join('');
    box.querySelectorAll('.bt-share').forEach(btn => btn.onclick = async () => {
      btn.disabled = true; btn.textContent = '…';
      const r = await post('btShareNumber', { serverId: +btn.dataset.sid });
      if (r && r.ok) { toast(t('Contact saved') + ': ' + (r.name || '') + ' ' + (r.number || '')); btn.textContent = 'OK'; }
      else { toast(r && r.err || 'Failed'); btn.disabled = false; btn.textContent = 'Share'; }
    });
  });
}

function connectedDevices() {
  ssPage('Connected devices', `
    <div class="ss-card">${ssLink('Quick Share')}</div>
    <div class="ss-card">
      ${ssLink('Auto switch Buds')}
      <div class="ss-div"></div>
      ${ssLink('Call & text on other devices')}
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Continue on other devices</b></div>${ssToggle('ss-cod', true)}</div>
    </div>
    <div class="ss-card">
      ${ssLink('Galaxy Wearable')}
      <div class="ss-div"></div>
      ${ssLink('SmartThings')}
      <div class="ss-div"></div>
      ${ssLink('Android Auto')}
    </div>
    ${ssLook(['Bluetooth', 'Mobile Hotspot and Tethering'])}
  `);
}

function modesSettings() {
  const modes = [
    ['Sleep', 'bed'], ['Theatre', 'Not set'], ['Driving', 'Not set'],
    ['Exercise', 'Not set'], ['Relax', 'Not set']
  ];
  ssPage('Modes and Routines', `
    <p class="ss-desc">Choose a mode based on what you're doing or where you are. Your phone's settings will change to match your activity or situation.</p>
    <div class="ss-card ss-place">
      <p>Add your home, work, and other places to start modes and routines when you arrive or leave.</p>
      <div class="ss-place-btns"><button type="button">Not now</button><button type="button" class="ss-blue-btn">Add place</button></div>
    </div>
    ${modes.map(([n, sub]) => `<div class="ss-card"><div class="ss-row"><span class="ss-mode-ico"></span><div class="ss-txt"><b>${esc(n)}</b>${sub !== 'bed' ? `<small>${esc(sub)}</small>` : ''}</div></div></div>`).join('')}
  `);
}

function soundSettings() {
  const mode = st.settings.soundMode || 'sound';
  ssPage('Sounds and vibration', `
    <div class="ss-card">
      <div class="ss-sound-modes">
        <button type="button" class="ss-sm ${mode === 'sound' ? 'on' : ''}" data-m="sound"><span>🔊</span><b>Sound</b><i></i></button>
        <button type="button" class="ss-sm ${mode === 'vibrate' ? 'on' : ''}" data-m="vibrate"><span>📳</span><b>Vibrate</b><i></i></button>
        <button type="button" class="ss-sm ${mode === 'mute' ? 'on' : ''}" data-m="mute"><span>🔇</span><b>Mute</b><i></i></button>
      </div>
      <div class="ss-div" style="margin-left:0"></div>
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Vibrate while ringing</b></div>${ssToggle('vb', !!st.settings.vibration)}</div>
    </div>
    <div class="ss-card">
      <div class="ss-row" data-r-open="1"><div class="ss-txt"><b>Ringtone</b><small class="ss-blue">${esc(t('rt_' + st.settings.ringtone) || st.settings.ringtone)}</small></div></div>
      <div class="ss-div"></div>
      <div class="ss-row" data-n-open="1"><div class="ss-txt"><b>Notification sound</b><small class="ss-blue">${esc(t('rt_' + notifTone()))}</small></div></div>
      <div class="ss-div"></div>
      ${ssLink('System sound')}
      <div class="ss-div"></div>
      ${ssLink('Volume')}
    </div>
    <div class="ss-card">
      ${ssLink('Call vibration', 'Basic call')}
      <div class="ss-div"></div>
      ${ssLink('Notification vibration', 'Ticktock')}
      <div class="ss-div"></div>
      ${ssLink('System vibration')}
      <div class="ss-div"></div>
      ${ssLink('Vibration intensity')}
    </div>
  `);
  $('#vb').onchange = e => {
    st.settings.vibration = e.target.checked; save();
    if (e.target.checked) { const p = $('#phone'); p.classList.add('vib'); setTimeout(() => p.classList.remove('vib'), 600) }
  };
  document.querySelectorAll('.ss-sm').forEach(btn => btn.onclick = () => {
    st.settings.soundMode = btn.dataset.m;
    if (btn.dataset.m === 'mute') st.settings.volume = 0;
    save(); soundSettings();
  });
  document.querySelector('[data-r-open]')?.addEventListener('click', () => ringtonePicker());
  document.querySelector('[data-n-open]')?.addEventListener('click', () => notifTonePicker());
}

/* Notification sound (new messages): any of the ringtones, saved on this device */
const notifTone = () => { const n = localStorage.getItem('ios_notif_tone'); return st.tones.includes(n) ? n : (st.tones.includes('spaceline') ? 'spaceline' : st.tones[0]) };
function playNotifTone() {
  const mode = st.settings.soundMode || 'sound';
  if (mode !== 'sound' || (st.settings.volume || 0) === 0) return;   // mute / vibrate / silent = no sound
  try { const a = new Audio(toneFile(notifTone())); a.volume = Math.max(0, Math.min(1, (st.settings.volume ?? 70) / 100)); a.play().catch(() => { }) } catch (e) { }
}
function notifTonePicker() {
  ssPage('Notification sound', `
    <div class="ss-card">
      ${st.tones.map(n => `<div class="ss-row" data-n="${esc(n)}"><div class="ss-txt"><b>${esc(t('rt_' + n))}</b></div><span class="ck-m">${n === notifTone() ? '✓' : ''}</span></div>`).join('<div class="ss-div"></div>')}
    </div>
  `);
  $('#ssbk').onclick = soundSettings;
  document.querySelectorAll('[data-n]').forEach(e => e.onclick = () => {
    localStorage.setItem('ios_notif_tone', e.dataset.n);
    playTone(e.dataset.n, false);
    notifTonePicker();
  });
}

function ringtonePicker() {
  ssPage('Ringtone', `
    <div class="ss-card">
      ${st.tones.map(n => `<div class="ss-row" data-r="${esc(n)}"><div class="ss-txt"><b>${esc(t('rt_' + n))}</b></div><span class="ck-m">${n === st.settings.ringtone ? '✓' : ''}</span></div>`).join('<div class="ss-div"></div>')}
    </div>
  `);
  $('#ssbk').onclick = soundSettings;
  document.querySelectorAll('[data-r]').forEach(e => e.onclick = () => {
    st.settings.ringtone = e.dataset.r; save();
    playTone(e.dataset.r, false);
    ringtonePicker();
  });
}

function notifSettings() {
  ssPage('Notifications', `
    <div class="ss-card">${ssLink('App notifications', 'Change notification settings for each app.')}</div>
    <div class="ss-card">
      ${ssLink('Notification pop-up style', 'Customise the appearance of notification pop-ups.')}
      <div class="ss-div"></div>
      ${ssLink('Hide content while locked', 'Choose whether to hide notification content while your phone is locked.')}
      <div class="ss-div"></div>
      ${ssLink('Sort and filter notifications')}
    </div>
    <h4 class="ss-h">Appearance</h4>
    <div class="ss-card">
      ${ssLink('Status bar')}
      <div class="ss-div"></div>
      ${ssLink('Lock screen')}
    </div>
    <div class="ss-card">
      ${ssLink('Do not disturb')}
      <div class="ss-div"></div>
      ${ssLink('Advanced settings')}
    </div>
    ${ssLook(['Notification sound', 'Flash notification'])}
  `);
}

function displaySettings() {
  const th = st.settings.theme;
  ssPage('Display', `
    <div class="ss-card">
      <div class="ss-row" style="cursor:default">
        <div class="ss-txt"><b>Dark mode</b><small>Use dark theme</small></div>
        ${ssToggle('ss-dark', th === 'dark')}
      </div>
    </div>
    <h4 class="ss-h">Brightness</h4>
    <div class="ss-card" style="padding:16px">
      <div class="card br" style="background:transparent;box-shadow:none;padding:0"><span>🔅</span><input type="range" id="brt" min="20" max="100" value="${st.settings.brightness}"><span>🔆</span></div>
    </div>
    <div class="ss-card">
      ${ssLink('Eye comfort shield')}
      <div class="ss-div"></div>
      ${ssLink('Navigation bar')}
    </div>
  `);
  $('#ss-dark').onchange = e => { st.settings.theme = e.target.checked ? 'dark' : 'light'; applyTheme(); save(); };
  $('#brt').oninput = e => { st.settings.brightness = +e.target.value; applyBright() };
  $('#brt').onchange = save;
}

function batterySettings() {
  const pct = st.battery || 86;
  ssPage('Battery', `
    <div class="ss-card" style="text-align:center;padding:28px 16px">
      <div style="font-size:52px;font-weight:300">${pct}%</div>
      <small style="opacity:.65">Estimated remaining time</small>
    </div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Power saving</b><small>Limit performance and background data</small></div>${ssToggle('ss-ps', false)}</div>
      <div class="ss-div"></div>
      ${ssLink('Charging')}
    </div>
  `);
}

function wallpapers() {
  const wall = st.settings.wallpaper || '';
  ssPage('Wallpaper and style', `
    <div class="ss-prev-row">
      <div class="ss-prev" style="background-image:url('${esc(wall)}')"><div class="ss-prev-lock"><b id="ss-clk">14:05</b><small>Lock screen</small></div></div>
      <div class="ss-prev" style="background-image:url('${esc(wall)}')"><div class="ss-prev-home"><small>Home screen</small></div></div>
    </div>
    <div class="ss-card">${ssLink('Change wallpapers')}</div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Colour palette</b><small>Choose a palette based on colours from your wallpaper.</small></div><span class="ss-palette"></span></div>
    </div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Dim wallpaper when Dark mode is on</b></div>${ssToggle('ss-dimw', true)}</div>
    </div>
  `);
  document.querySelector('.ss-link')?.parentElement?.addEventListener('click', () => changeWallpapers());
}

function changeWallpapers() {
  ssPage('Change wallpapers', `
    <div class="wg">${(st.walls || []).map(w => `<div class="wt ${w === st.settings.wallpaper ? 'on' : ''}" data-w="${esc(w)}" style="background-image:url('${esc(w)}')"></div>`).join('')}</div>
    <div class="ss-card" style="margin-top:12px;padding:12px">
      <input id="wu" placeholder="Custom image URL (https://…)" style="width:100%;margin-bottom:8px;background:#1a1a1a;border:1px solid #333;color:#fff;padding:10px;border-radius:10px">
      <button class="btn" id="wb">Apply</button>
    </div>
  `);
  $('#ssbk').onclick = wallpapers;
  const set = w => { st.settings.wallpaper = w; applyWall(); save(); changeWallpapers(); };
  document.querySelectorAll('.wt').forEach(e => e.onclick = () => set(e.dataset.w));
  $('#wb').onclick = () => { const u = $('#wu').value.trim(); if (!/^https?:\/\//i.test(u)) return toast('Enter a valid URL'); set(u); };
}

function homeScreenSettings() {
  ssPage('Home screen', `
    <div class="ss-card" style="padding:16px">
      <div class="ss-home-preview"></div>
      <div class="ss-txt" style="margin:12px 0 8px"><b>App size</b><small>Applied to Home and Apps screens.</small></div>
      <input type="range" min="0" max="100" value="40" style="width:100%">
      <div class="ss-div" style="margin:12px 0 0;margin-left:0"></div>
      <div class="ss-row" style="cursor:default;padding-left:0"><div class="ss-txt"><b>App labels</b><small>Labels on Home screen</small></div>${ssToggle('ss-al', true)}</div>
      <div class="ss-div" style="margin-left:0"></div>
      <div class="ss-row" style="cursor:default;padding-left:0"><div class="ss-txt"><b>Widget labels</b><small>Labels for featured widgets</small></div>${ssToggle('ss-wl', false)}</div>
    </div>
    <div class="ss-card">
      ${ssLink('Home screen layout', 'Home and Apps screens')}
      <div class="ss-div"></div>
      ${ssLink('Home screen grid', '4×6')}
      <div class="ss-div"></div>
      ${ssLink('Apps screen grid', '4×6')}
      <div class="ss-div"></div>
      ${ssLink('Folder grid', '3×4')}
    </div>
  `);
}


/* ---------- Screen lock: PIN pad (Samsung style) ---------- */
Object.assign(TR.ar, { 'Enter PIN': 'أدخل رمز PIN', 'Wrong PIN': 'رمز PIN خاطئ', 'Try again in': 'حاول مجدداً بعد', 'seconds': 'ثانية', 'Choose your PIN': 'اختر رمز PIN', 'Use 4 to 6 digits': 'استخدم من 4 إلى 6 أرقام', 'Confirm your PIN': 'أكد رمز PIN', 'PINs do not match': 'الرمزان غير متطابقين', 'Enter current PIN': 'أدخل رمز PIN الحالي', 'PIN set': 'تم تعيين الرمز', 'Screen lock removed': 'تمت إزالة قفل الشاشة' });
Object.assign(TR.fr, { 'Enter PIN': 'Saisissez le code PIN', 'Wrong PIN': 'Code PIN incorrect', 'Try again in': 'Réessayez dans', 'seconds': 'secondes', 'Choose your PIN': 'Choisissez votre code PIN', 'Use 4 to 6 digits': 'Utilisez 4 à 6 chiffres', 'Confirm your PIN': 'Confirmez votre code PIN', 'PINs do not match': 'Les codes ne correspondent pas', 'Enter current PIN': 'Saisissez le code actuel', 'PIN set': 'Code PIN défini', 'Screen lock removed': 'Verrouillage supprimé' });

Object.assign(TR.ar, { 'Emergency call': 'اتصال طوارئ', 'Emergency calls only': 'مكالمات الطوارئ فقط', 'Your PIN contains at least 4 digits': "يحتوي رمز PIN على 4 أرقام على الأقل" });
Object.assign(TR.fr, { 'Emergency call': "Appel d'urgence", 'Emergency calls only': "Appels d'urgence uniquement", 'Your PIN contains at least 4 digits': "Votre code PIN contient au moins 4 chiffres" });
Object.assign(TR.es, { 'Emergency call': 'Llamada de emergencia', 'Emergency calls only': 'Solo llamadas de emergencia', 'Your PIN contains at least 4 digits': "Tu PIN tiene al menos 4 dígitos" });
Object.assign(TR.tr, { 'Emergency call': 'Acil çağrı', 'Emergency calls only': 'Yalnızca acil aramalar', 'Your PIN contains at least 4 digits': "PIN en az 4 haneden oluşur" });
Object.assign(TR.ar, { 'Good morning': "صباح الخير", 'Good afternoon': "مرحباً", 'Good evening': "مساء الخير", 'Start': "ابدأ", 'Send a message to someone today': "أرسل رسالة لشخص ما اليوم" });
Object.assign(TR.fr, { 'Good morning': "Bonjour", 'Good afternoon': "Bon après-midi", 'Good evening': "Bonsoir", 'Start': "Démarrer", 'Send a message to someone today': "Envoyez un message à quelqu'un aujourd'hui" });
Object.assign(TR.es, { 'Good morning': "Buenos días", 'Good afternoon': "Buenas tardes", 'Good evening': "Buenas noches", 'Start': "Iniciar", 'Send a message to someone today': "Envía un mensaje a alguien hoy" });
Object.assign(TR.tr, { 'Good morning': "Günaydın", 'Good afternoon': "İyi günler", 'Good evening': "İyi akşamlar", 'Start': "Başlat", 'Send a message to someone today': "Bugün birine mesaj gönder" });
let pinKey = null;
function closePin() {
  const o = $('#pinov'); if (o) o.remove();
  $('#screen')?.classList.remove('pin-on');
  if (pinKey) { window.removeEventListener('keydown', pinKey, true); pinKey = null }
  if (st.pinTick) { clearInterval(st.pinTick); st.pinTick = null }
}
/* o = { title, sub, fixed (digits that auto-submit), cancel(), onDone(pin) -> {ok,msg,wait} } */
function pinScreen(o) {
  closePin();
  const ov = document.createElement('div'); ov.id = 'pinov';
  const wall = st.settings.wallpaper || '';
  ov.style.backgroundImage = `url('${wall}')`;
  const LET = { 1: '', 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ', 0: '' };
  const num = n => `<button class="pk" data-k="${n}">${n}<small>${LET[n]}</small></button>`;
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num).join('')
    + `<button class="pk pkb" data-k="bk"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12 9.5l5 5M17 9.5l-5 5"/></svg></button>`
    + num(0)
    + `<button class="pk pkok" data-k="ok">OK</button>`;
  ov.innerHTML = `<div class="pin-sh"></div><div class="pin-in">
    <svg class="pin-lk" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10.5" rx="2.4" fill="currentColor"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <div class="pin-t" id="pint">${esc(o.title)}</div><div class="pin-s" id="pins">${esc(o.sub || '')}</div>
    <div class="pin-d" id="pind"></div><div class="pin-g">${keys}</div>
    <button class="pin-em" id="pinem">${esc(t('Emergency call'))}</button></div>`;
  $('#screen').appendChild(ov); $('#screen').classList.add('pin-on');
  let v = '', busy = false, lock = 0;
  const max = 6;
  const paint = () => {
    const n = Math.max(o.fixed || 4, v.length);
    $('#pind').innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < v.length ? 'f' : ''}"></i>`).join('');
    ov.querySelector('.pkok')?.classList.toggle('on', v.length >= 4);
  };
  const msg = (m, bad) => { const e = $('#pins'); if (e) { e.textContent = m || o.sub || ''; e.classList.toggle('bad', !!bad) } };
  const startLock = secs => {
    lock = secs; clearInterval(st.pinTick);
    const tick = () => { if (lock <= 0) { clearInterval(st.pinTick); st.pinTick = null; msg(''); return } msg(`${t('Try again in')} ${lock} ${t('seconds')}`, true); lock-- };
    tick(); st.pinTick = setInterval(tick, 1000);
  };
  const submit = async () => {
    if (busy || lock > 0 || v.length < 4) return;
    busy = true;
    const r = await o.onDone(v);
    busy = false;
    if (r && r.ok) return;                           // caller closes / continues
    v = ''; paint();
    const d = $('#pind'); if (d) { d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake') }
    if (r && r.wait) startLock(r.wait); else msg((r && r.msg) || t('Wrong PIN'), true);
  };
  const press = k => {
    if (busy || lock > 0) return;
    if (k === 'bk') v = v.slice(0, -1);
    else if (k === 'ok') return submit();
    else if (v.length < (o.fixed || max)) v += k;
    msg(''); paint();
    if (o.fixed && v.length === o.fixed) submit();
  };
  ov.querySelectorAll('.pk').forEach(b => b.onclick = e => { e.stopPropagation(); press(b.dataset.k) });
  ov.querySelector('#pinem').onclick = e => { e.stopPropagation(); toast(t('Emergency calls only')) };
  ov.onclick = e => e.stopPropagation();
  pinKey = e => {
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('bk');
    else if (e.key === 'Enter') press('ok');
    else if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); closePin(); o.cancel && o.cancel() }
    else return;
    e.stopImmediatePropagation();
  };
  window.addEventListener('keydown', pinKey, true);
  paint();
}

function showPinUnlock() {
  pinScreen({
    title: t('Enter PIN'), sub: t('Your PIN contains at least 4 digits'), fixed: st.pinLen || 0,
    onDone: async pin => {
      const r = await post('checkPin', { pin });
      if (!r || !r.ok) return { ok: false, wait: r && r.wait };
      closePin(); unlockPhone(true);
      const f = st.afterUnlock; st.afterUnlock = null; if (f) f();
      return { ok: true };
    },
  });
}

/* Settings > Lock screen > Screen lock and biometrics */
function screenLockSettings() {
  ssPage('Screen lock and biometrics', `
    <div class="ss-card">
      <div class="ss-row ss-link" id="sl-type"><div class="ss-txt"><b>Screen lock type</b><small class="ss-blue">${st.hasPin ? 'PIN' : 'Swipe'}</small></div></div>
    </div>
    <h4 class="ss-h">Biometrics</h4>
    <div class="ss-card">
      <div class="ss-row ss-link" id="sl-fp"><div class="ss-txt"><b>Fingerprints</b><small>Not available on this phone</small></div></div>
      <div class="ss-div"></div>
      <div class="ss-row ss-link" id="sl-face"><div class="ss-txt"><b>Face recognition</b><small>Not available on this phone</small></div></div>
    </div>
  `);
  $('#ssbk').onclick = lockScreenSettings;
  $('#sl-type').onclick = screenLockType;
  $('#sl-fp').onclick = $('#sl-face').onclick = () => toast('Not available');
}
function screenLockType() {
  const row = (id, name, on) => `<div class="ss-row" id="${id}"><div class="ss-txt"><b>${name}</b></div><span class="ck-m">${on ? '✓' : ''}</span></div>`;
  ssPage('Screen lock type', `
    <div class="ss-card">${row('sl-swipe', 'Swipe', !st.hasPin)}<div class="ss-div"></div>${row('sl-pin', 'PIN', st.hasPin)}</div>
    ${st.hasPin ? `<div class="ss-card"><div class="ss-row ss-link" id="sl-chg"><div class="ss-txt"><b>Change PIN</b></div></div></div>` : ''}
    <div class="ss-card"><div class="ss-row" style="cursor:default"><div class="ss-txt"><small>Swipe: no code needed. PIN: 4 to 6 digits asked every time the phone is unlocked.</small></div></div></div>
  `);
  $('#ssbk').onclick = screenLockSettings;
  $('#sl-pin').onclick = () => { if (!st.hasPin) pinCreate(''); };
  const chg = $('#sl-chg'); if (chg) chg.onclick = () => pinVerify(old => pinCreate(old));
  $('#sl-swipe').onclick = () => {
    if (!st.hasPin) return;
    pinVerify(async old => {
      const r = await post('clearPin', { pin: old });
      if (r && r.ok) { st.hasPin = false; st.pinLen = 0; toast(t('Screen lock removed')) }
      screenLockType();
    });
  };
}
/* ask for the current PIN, then run next(pin) */
function pinVerify(next) {
  pinScreen({
    title: t('Enter current PIN'), fixed: st.pinLen || 0, cancel: screenLockType,
    onDone: async pin => {
      const r = await post('checkPin', { pin });
      if (!r || !r.ok) return { ok: false, wait: r && r.wait };
      closePin(); next(pin); return { ok: true };
    },
  });
}
/* choose a new PIN, confirm it, save it */
function pinCreate(old) {
  const back = () => screenLockType();
  const ask = (title, sub, cb) => pinScreen({ title, sub, cancel: back, onDone: async pin => { closePin(); cb(pin); return { ok: true } } });
  const choose = () => ask(t('Choose your PIN'), t('Use 4 to 6 digits'), first =>
    ask(t('Confirm your PIN'), '', async second => {
      if (second !== first) { toast(t('PINs do not match')); return choose() }
      const r = await post('setPin', { pin: first, old });
      if (r && r.ok) { st.hasPin = true; st.pinLen = r.len || first.length; toast(t('PIN set')) }
      else toast('Failed');
      screenLockType();
    }));
  choose();
}

function lockScreenSettings() {
  ssPage('Lock screen', `
    <div class="ss-card">
      <div class="ss-row ss-link" id="ss-slb"><div class="ss-txt"><b>Screen lock and biometrics</b><small>${st.hasPin ? 'PIN' : 'Swipe'}, Fingerprints</small></div></div>
      <div class="ss-div"></div>
      ${ssLink('Extend Unlock')}
      <div class="ss-div"></div>
      ${ssLink('Secure lock settings')}
    </div>
    <div class="ss-card">${ssLink('Now bar')}</div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Touch and hold to edit</b></div>${ssToggle('ss-the', true)}</div>
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Roaming clock</b></div>${ssToggle('ss-rc', true)}</div>
      <div class="ss-div"></div>
      ${ssLink('Contact information')}
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Show unlock transition effect</b></div>${ssToggle('ss-ute', true)}</div>
    </div>
    <div class="ss-card">${ssLink('About Lock screen')}</div>
    ${ssLook(['Edit Lock screen', 'Lock screen notifications'])}
  `);
  $('#ss-slb').onclick = screenLockSettings;
}

function securitySettings() {
  ssPage('Security and privacy', `
    <div class="ss-warn"><b>⚠ Check your Samsung account</b><small>Tap to learn more.</small></div>
    <h4 class="ss-h">Security</h4>
    <div class="ss-card">
      <div class="ss-row"><div class="ss-txt"><b>Lock screen</b><small>Screen lock is set</small></div><span class="ss-ok">●</span></div>
      <div class="ss-div"></div>
      <div class="ss-row"><div class="ss-txt"><b>Account security</b><small class="ss-orange">Check your Samsung account</small></div><span class="ss-warn-dot">●</span></div>
      <div class="ss-div"></div>
      <div class="ss-row"><div class="ss-txt"><b>Lost device protection</b><small>This phone is allowed to be found when lost</small></div><span class="ss-ok">●</span></div>
      <div class="ss-div"></div>
      <div class="ss-row"><div class="ss-txt"><b>App security</b><small>No threats found</small></div><span class="ss-ok">●</span></div>
      <div class="ss-div"></div>
      <div class="ss-row"><div class="ss-txt"><b>Updates</b><small>No recommended actions</small></div><span class="ss-ok">●</span></div>
    </div>
    <h4 class="ss-h">Additional security settings</h4>
    <div class="ss-card">
      <div class="ss-row ss-link" id="ss-slb2"><div class="ss-txt"><b>Screen lock and biometrics</b><small>${st.hasPin ? 'PIN' : 'Swipe'}, Fingerprints</small></div></div>
      <div class="ss-div"></div>
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Auto Blocker</b><small>Keep your phone safe by blocking threats and other suspicious activity.</small></div>${ssToggle('ss-ab', false)}</div>
      <div class="ss-div"></div>
      ${ssLink('More security settings')}
    </div>
  `);
  $('#ss-slb2').onclick = screenLockSettings;
}

function locationSettings() {
  ssPage('Location', `
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Location</b><small>${st.settings.location ? 'On' : 'Off'}</small></div>${ssToggle('ss-loc', !!st.settings.location)}</div>
    </div>
    <div class="ss-card">${ssLink('Location requests')}</div>
  `);
  $('#ss-loc').onchange = e => { st.settings.location = e.target.checked; save(); };
}

function safetySettings() {
  ssPage('Safety and emergency', `
    <div class="ss-card">
      ${ssLink('Medical info')}
      <div class="ss-div"></div>
      ${ssLink('Emergency contacts')}
    </div>
    <div class="ss-card">
      ${ssLink('Emergency SOS')}
      <div class="ss-div"></div>
      ${ssLink('Emergency sharing')}
      <div class="ss-div"></div>
      ${ssLink('Crisis alerts')}
    </div>
    <div class="ss-card">
      ${ssLink('Silence notifications while driving')}
      <div class="ss-div"></div>
      ${ssLink('Emergency Location Service')}
      <div class="ss-div"></div>
      ${ssLink('Wireless emergency alerts')}
      <div class="ss-div"></div>
      ${ssLink('Earthquake alerts')}
      <div class="ss-div"></div>
      ${ssLink('Unknown tracker alerts')}
    </div>
  `);
}

function accountsSettings() {
  ssPage('Accounts and backup', `
    <div class="ss-card">${ssLink('Manage accounts')}</div>
    <h4 class="ss-h">Samsung Cloud</h4>
    <div class="ss-card">
      ${ssLink('Back up data')}
      <div class="ss-div"></div>
      ${ssLink('Restore data')}
    </div>
    <h4 class="ss-h">Google Drive</h4>
    <div class="ss-card">${ssLink('Back up data')}</div>
    <h4 class="ss-h">Smart Switch</h4>
    <div class="ss-card">
      ${ssLink('Transfer data for device setup', 'Send data from this phone to a new device or bring data from an old device to this phone.')}
      <div class="ss-div"></div>
      ${ssLink('External storage transfer', 'Back up data to a USB storage device or SD card.')}
    </div>
    ${ssLook(['Reset', 'Samsung Cloud'])}
  `);
}

function googleSettings() {
  ssPage('Google', `
    <div class="ss-card">
      ${ssLink('Manage your Google Account')}
      <div class="ss-div"></div>
      ${ssLink('Google services')}
      <div class="ss-div"></div>
      ${ssLink('All services')}
    </div>
  `);
}

function wellbeingSettings() {
  ssPage('Digital Wellbeing', `
    <div class="ss-card ss-wb-hero">
      <b>Take control of your digital health</b>
      <p>You can set an app timer if you want to manage your usage.</p>
      <button type="button" class="ss-dash">Dashboard</button>
    </div>
    <div class="ss-card" style="padding:16px">
      <small style="opacity:.6">Screen time today</small>
      <div style="font-size:28px;font-weight:600;margin:4px 0 12px">2 h 15 m</div>
      <div class="ss-wb-apps">
        <div><span class="dot" style="background:#2979ff"></span> Phone <b>45 m</b></div>
        <div><span class="dot" style="background:#00bcd4"></span> WhatsNow <b>38 m</b></div>
        <div><span class="dot" style="background:#00c853"></span> InPic <b>22 m</b></div>
      </div>
    </div>
  `);
}

function deviceCareSettings() {
  const pct = st.battery || 86;
  ssPage('Device care', `
    <div class="ss-card ss-care-hero">
      <b class="ss-good">Good</b>
      <p>Optimise now to free up more memory.</p>
      <button type="button" class="ss-dash">Optimise now</button>
    </div>
    <div class="ss-card" style="padding:16px">
      <div class="ss-care-row"><span>Battery</span><b class="ss-blue">${pct}%</b></div>
      <div class="ss-bar"><i style="width:${pct}%;background:#00c853"></i></div>
      <div class="ss-div" style="margin:14px 0;margin-left:0"></div>
      <div class="ss-care-row"><span>Storage</span><b>54%</b></div>
      <div class="ss-bar"><i style="width:54%;background:#00bcd4"></i></div>
      <div class="ss-div" style="margin:14px 0;margin-left:0"></div>
      <div class="ss-care-row"><span>Memory</span><b>62%</b></div>
      <div class="ss-bar"><i style="width:62%;background:#2979ff"></i></div>
      <div class="ss-div" style="margin:14px 0;margin-left:0"></div>
      <div class="ss-care-row"><span>App protection</span><span class="ss-ok">✓ No threats</span></div>
    </div>
    <div class="ss-card">${ssLink('Auto optimisation')}</div>
  `);
  document.querySelector('.ss-dash')?.addEventListener('click', () => toast('Optimised'));
}

function appsSettings() {
  const apps = APPS.map(a => ({ n: a.n, sz: (12 + (a.n.length * 3.7) % 40).toFixed(1) + ' MB' }));
  ssPage('Apps', `
    <div class="ss-card">${ssLink('Choose default apps', 'Choose which apps to use for making calls, sending messages, going to websites, and more.')}</div>
    <div class="ss-card">${ssLink('Samsung app settings')}</div>
    <div class="ss-card">
      <div class="ss-row" style="cursor:default"><div class="ss-txt"><b>Your apps (${apps.length})</b></div></div>
      <div class="ss-div"></div>
      ${apps.map(a => `<div class="ss-row"><div class="ss-txt"><b>${esc(a.n)}</b><small>${a.sz}</small></div></div>`).join('<div class="ss-div"></div>')}
    </div>
  `);
}

function generalSettings() {
  const lang = (LANGS.find(l => l.id === st.settings.language) || {}).n || 'English';
  ssPage('General management', `
    <div class="ss-card">
      <div class="ss-row" id="ss-lang"><div class="ss-txt"><b>Language</b><small class="ss-blue">${esc(lang)}</small></div></div>
      <div class="ss-div"></div>
      ${ssLink('App languages', 'Choose the language you want to use for each app.')}
    </div>
    <div class="ss-card">${ssLink('Date and time')}</div>
    <div class="ss-card">
      ${ssLink('Samsung Keyboard settings', 'English')}
      <div class="ss-div"></div>
      ${ssLink('Keyboard', 'Samsung Keyboard')}
    </div>
    <div class="ss-card">
      ${ssLink('Physical keyboard', 'Not connected')}
      <div class="ss-div"></div>
      ${ssLink('Mouse and trackpad')}
    </div>
    <div class="ss-card">${ssLink('Reset')}</div>
    <div class="ss-card">${ssLink('Contact us')}</div>
  `);
  $('#ss-lang').onclick = languages;
}

function languages() {
  ssPage('Language', `
    <div class="ss-card">
      ${LANGS.map(l => `<div class="ss-row" data-l="${l.id}"><div class="ss-txt"><b>${esc(l.n)}</b></div><span class="ck-m">${l.id === st.settings.language ? '✓' : ''}</span></div>`).join('<div class="ss-div"></div>')}
    </div>
  `);
  $('#ssbk').onclick = generalSettings;
  document.querySelectorAll('[data-l]').forEach(e => e.onclick = () => {
    st.settings.language = e.dataset.l; applyLang(); save(); renderHome(); languages();
  });
}

function accessSettings() {
  ssPage('Accessibility', `
    <div class="ss-card">${ssLink('Recommended for you')}</div>
    <div class="ss-card">
      ${ssLink('Vision enhancements')}
      <div class="ss-div"></div>
      ${ssLink('TalkBack')}
    </div>
    <div class="ss-card">${ssLink('Hearing enhancements')}</div>
    <div class="ss-card">${ssLink('Interaction and dexterity')}</div>
    <div class="ss-card">
      ${ssLink('Advanced settings')}
      <div class="ss-div"></div>
      ${ssLink('Installed apps', 'None')}
    </div>
    <div class="ss-card">
      ${ssLink('About Accessibility')}
      <div class="ss-div"></div>
      ${ssLink('Contact us')}
    </div>
  `);
}

function softwareUpdate() {
  ssPage('Software update', `
    <div class="ss-card">
      ${ssLink('Download and install', 'Last checked on: 27 September 2026\\nUsing Wi-Fi is recommended.')}
      <div class="ss-div"></div>
      ${ssLink('Auto download', 'Using Wi-Fi only')}
    </div>
    <div class="ss-card">
      ${ssLink('Last update', 'The last update was installed on 27 September 2026 at 15:59.')}
    </div>
  `);
}

function smartTutor() {
  ssPage('Smart Tutor', `
    <div class="ss-card ss-tutor">
      <div class="ss-tutor-art">📱 ··· 💻</div>
      <p>Smart Tutor is a technical support application, providing troubleshooting and guidance to help solve technical issues with your device.</p>
      <button type="button" class="ss-dash" id="ss-ok">OK</button>
    </div>
  `);
  $('#ss-ok').onclick = settings;
}

function aboutPhone() {
  ssPage('About phone', `
    <div class="ss-about-kv">
      <div><span>Serial number</span><b>R8YX91GMJKB</b></div>
      <div><span>Phone number</span><b>${esc(st.me.number || 'Unknown')}</b></div>
      <div><span>Network</span><b>Los Santos</b></div>
      <div><span>Model</span><b>SM-A065F</b></div>
      <div><span>IMEI</span><b>351398413513261</b></div>
    </div>
    <div class="ss-card">
      ${ssLink('Status information')}
      <div class="ss-div"></div>
      ${ssLink('Legal information')}
      <div class="ss-div"></div>
      ${ssLink('Software information')}
      <div class="ss-div"></div>
      ${ssLink('Battery information')}
    </div>
    ${ssLook(['Software update', 'Reset', 'Contact us'])}
  `);
}


/* ---------- NUI events ---------- */
window.addEventListener('message', async e => {
  const d = e.data;
  if (d.action === 'open') {
    $('#phone').classList.remove('hidden');
    st.locked = true; st.ready = false;
    showLock(); islandIdle();
    try {
      const r = await Promise.race([
        post('init'),
        new Promise(res => setTimeout(() => res({}), 4000))
      ]);
      st.me = r || {}; st.settings = { ...DEF, ...((r && r.settings) || {}) }; st.walls = (r && r.wallpapers) || [];
      if (r && r.ringtones && r.ringtones.length) st.tones = r.ringtones;
      st.hasPin = !!(r && r.hasPin); st.pinLen = (r && r.pinLen) || 0; st.ready = true;
      applyAll(); renderHome();
      if (d.app) { if (!st.hasPin || Date.now() - (st.lastUnlock || 0) < 90000) unlockPhone(true); openApp(d.app); }
      else showLock();
      islandIdle();
    } catch (err) {
      console.log('[ios-phone] init failed', err);
      applyAll(); renderHome(); showLock();
    }
  }
  if (d.action === 'close') { ytExpand(false); $('#phone').classList.add('hidden'); if (!st.ringing) stopAudio(); if (yt.mode !== 'audio') ytStop() }
  if (d.action === 'photoTaken') {
    try {
      const full = await shrink(d.data, 720, .72), th = await shrink(d.data, 180, .65);
      if (full && th) {
        const r = await post('savePhoto', { image: full, thumb: th });
        if (r && r.ok) {
          toast(t('Photo saved') || 'Photo saved');
          if (r.id) {
            st.ph = st.ph || [];
            st.ph.unshift({ id: r.id, ts: Date.now() / 1000 });
            st.pc[r.id] = th;
          }
          // InPic compose: keep media ready for next newPost
          if (d.compose || st.igCompose) {
            st.igComposeMedia = full;
            st.igComposePhotoId = r.id || null;
          }
        } else {
          toast(t('Failed'));
        }
      } else {
        toast(t('Failed'));
      }
    } catch (e) {
      console.log('[ios-phone] photo save error', e);
      toast(t('Failed'));
    }
  }
  if (d.action === 'postVideoData') {
    const rid = d.data && d.data.id, r = st.pvw && st.pvw[rid];
    if (r) { delete st.pvw[rid]; r(d.data.data || null) }
  }
  if (d.action === 'openCompose') {
    st.igCompose = false;
    const capp = d.app === 'trendy' ? 'trendy' : 'inpic';
    const pre = st.igComposeMedia
      ? { media: st.igComposeMedia, photoId: st.igComposePhotoId, kind: st.igComposeKind || 'photo' }
      : null;
    st.igComposeMedia = null; st.igComposeKind = null;
    newPost(capp, pre);
  }
  if (d.action === 'btPhoto') { toast(t('Photo received') + (d.data && d.data.name ? ': ' + d.data.name : '')); }
  if (d.action === 'newMessage') {
    playNotifTone();
    if (st.settings.vibration) { const p = $('#phone'); p.classList.add('vib'); setTimeout(() => p.classList.remove('vib'), 500) }
    if (st.thread === d.data.from) { st.msgs.push({ mine: false, text: d.data.text }); st.redraw && st.redraw() }
    else { st.notifs.unshift({ name: d.data.name || d.data.from, text: d.data.text, ts: Math.floor(Date.now() / 1000) }); st.notifs = st.notifs.slice(0, 20); headsUp(`<span class="nt-av">${esc((d.data.name || '#')[0])}</span><div class="nt-tx"><small>${esc(t('Messages'))}</small><b dir="auto">${esc(d.data.name || d.data.from)}</b><span dir="auto">${esc(d.data.text)}</span></div>`, 4000); if ($('#ntpanel')?.classList.contains('open')) drawShade() }
  }
  if (d.action === 'incoming') { $('#phone').classList.remove('hidden'); showCall(d.data.name, t('Incoming call…'), true); startRing() }
  if (d.action === 'callStarted') {
    const a = $('#acc'); if (a) a.remove();
    stopRing();
    let s = 0; clearInterval(st.ct);
    st.inCall = true; st.callTxt = '0:00'; if (!st.isBig) islandIdle();
    st.ct = setInterval(() => { s++; st.callTxt = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); const c = $('#cs'); if (c) c.textContent = st.callTxt; const i = $('#isl-t'); if (i) i.textContent = st.callTxt }, 1000);
    const c = $('#cs'); if (c) c.textContent = '0:00';
  }
  if (d.action === 'callEnded') { endCallUI(); toast(t('Call ended')) }
});

/* ---------- WhatsNow (WhatsApp-style) ---------- */
const WN = {
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  status: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.5-4 11.5-4 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c.4-2.5 4-3 6-2"/>',
  phone: '<path d="M8 3h3l1 5-2 1a12 12 0 0 0 5 5l1-2 5 1v3a2 2 0 0 1-2 2A16 16 0 0 1 6 5a2 2 0 0 1 2-2z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  attach: '<path d="M15 7l-6.5 6.5a3 3 0 0 0 4.2 4.2L19 11a5 5 0 0 0-7-7L5.5 10.5a7 7 0 0 0 10 10L21 15"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>',
  dots: '<circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  check2: '<path d="M2 13l4 4L16 7M8 13l4 4L22 7"/>',
};
const wnAv = (name, big) => {
  const l = esc((name || '?')[0].toUpperCase());
  const cols = ['#00a884','#53bdeb','#25d366','#128c7e','#075e54','#34b7f1','#e91e63','#9c27b0'];
  let h = 0; for (let i = 0; i < String(name||'').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const bg = cols[h % cols.length];
  return `<div class="wn-av${big ? ' big' : ''}" style="background:${bg}">${l}</div>`;
};
const wnTime = ts => {
  if (!ts) return '';
  const d = new Date(ts * 1000), n = new Date();
  if (d.toDateString() === n.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const y = new Date(n - 864e5);
  if (d.toDateString() === y.toDateString()) return t('Yesterday') || 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const wnNav = tab => {
  const b = (k, path, label) => `<button data-t="${k}" class="${tab === k ? 'on' : ''}">${I(path, 24)}<span>${label}</span></button>`;
  return `<div class="wn-nav">${b('chats', WN.chat, t('Chats'))}${b('updates', WN.status, t('Updates'))}${b('communities', WN.users, t('Communities'))}${b('calls', WN.phone, t('Calls'))}</div>`;
};
const wnNavBind = () => document.querySelectorAll('.wn-nav button').forEach(e => e.onclick = () => whatsnow(e.dataset.t));

async function whatsnow(tab) {
  tab = tab || st.wnTab || 'chats'; st.wnTab = tab; st.thread = null;
  if (tab === 'chats') return wnChats();
  if (tab === 'calls') return wnCalls();
  if (tab === 'communities') return wnCommunities();
  return wnUpdates();
}

async function wnChats() {
  const r = await post('getConversations'); const l = r.list || [];
  const rows = l.length ? l.map(c => {
    const nm = c.name || c.number;
    return `<div class="wn-row" data-n="${esc(c.number)}" data-name="${esc(nm)}">
      ${wnAv(nm)}
      <div class="wn-rc"><div class="wn-top"><b>${esc(nm)}</b><span class="wn-time">${wnTime(c.ts)}</span></div>
      <div class="wn-prev">${esc(c.text || '')}</div></div>
    </div>`;
  }).join('') : `<p class="wn-empty">${t('No chats yet.')}</p>`;

  view('WhatsNow', `
    <div class="wn-head"><h1>WhatsNow</h1>
      <div class="wn-acts"><button id="wncam">${I(WN.cam, 22)}</button><button id="wnnew">${I(WN.plus, 22)}</button><button id="wndots">${I(WN.dots, 22)}</button></div>
    </div>
    <div class="wn-search"><span>${I(WN.search, 16)}</span><input id="wnq" placeholder="${t('Ask Meta AI or Search')}" autocomplete="off"></div>
    <div class="wn-list" id="wnl">${rows}</div>
    <button class="wn-fab" id="wnfab">${I(WN.chat, 24)}</button>
    ${wnNav('chats')}
  `, { dark: true, app: 'wn', nohdr: true, cls: 'full wn-body' });

  const filter = () => {
    const q = ($('#wnq').value || '').trim().toLowerCase();
    document.querySelectorAll('.wn-row').forEach(e => {
      const name = (e.dataset.name || '').toLowerCase(), n = (e.dataset.n || '').toLowerCase();
      e.style.display = (!q || name.includes(q) || n.includes(q)) ? '' : 'none';
    });
  };
  $('#wnq').oninput = filter;
  document.querySelectorAll('.wn-row').forEach(e => e.onclick = () => wnThread(e.dataset.n, e.dataset.name));
  $('#wnfab').onclick = $('#wnnew').onclick = wnNewChat;
  $('#wncam').onclick = () => openApp('camera');
  $('#wndots').onclick = () => toast(t('Coming soon'));
  wnNavBind();
}

function wnNewChat() {
  view(t('New chat'), `
    <div class="wn-new">
      <p class="wn-hint">${t('Phone number')}</p>
      <input id="wnn" class="wn-inp" placeholder="555-...." autocomplete="off">
      <button class="wn-btn" id="wngo">${t('Start chat')}</button>
      <p class="wn-hint" style="margin-top:18px">${t('Contacts')}</p>
      <div id="wncts" class="wn-cts"></div>
    </div>
  `, { dark: true, app: 'wn', back: () => whatsnow('chats'), cls: 'wn-body' });
  $('#wngo').onclick = () => { const n = $('#wnn').value.trim(); if (!n) return toast(t('Enter a number first')); wnThread(n, n) };
  $('#wnn').onkeydown = e => { if (e.key === 'Enter') $('#wngo').click() };
  post('getContacts').then(r => {
    const list = r.list || [];
    const el = $('#wncts');
    if (!el) return;
    if (!list.length) { el.innerHTML = `<p class="wn-empty">${t('No contacts yet.')}</p>`; return }
    el.innerHTML = list.map(c => `<div class="wn-row" data-n="${esc(c.number)}" data-name="${esc(c.name)}">${wnAv(c.name)}<div class="wn-rc"><b>${esc(c.name)}</b><div class="wn-prev">${esc(c.number)}</div></div></div>`).join('');
    el.querySelectorAll('.wn-row').forEach(e => e.onclick = () => wnThread(e.dataset.n, e.dataset.name));
  });
}

async function wnThread(n, name) {
  const r = await post('getMessages', { number: n });
  st.thread = n; st.msgs = r.list || [];
  view(name, `
    <div class="wn-chat" id="wnchat"></div>
    <div class="wn-compose">
      <button class="wn-ico" id="wnatt">${I(WN.attach, 22)}</button>
      <input id="wnmi" placeholder="${t('Type a message')}" autocomplete="off">
      <button class="wn-send" id="wnms">${I(WN.mic, 20)}</button>
    </div>
  `, { dark: true, app: 'wn wn-th', back: () => whatsnow('chats'), cls: 'wn-body',
       right: `<span class="wn-th-acts"><button id="wnvid">${I(WN.video, 20)}</button><button id="wncall">${I(WN.phone, 20)}</button></span>` });

  // custom header name with avatar
  const hdr = document.querySelector('#app .hdr b');
  if (hdr) hdr.innerHTML = `<span class="wn-th-name">${wnAv(name)}${esc(name)}</span>`;

  const draw = () => {
    const box = $('#wnchat'); if (!box) return;
    box.innerHTML = (st.msgs || []).map(m => {
      const time = m.ts ? new Date(m.ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return `<div class="wn-bub ${m.mine ? 'out' : 'in'}"><span>${esc(m.text)}</span><small>${time}${m.mine ? ' ✓✓' : ''}</small></div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  };
  draw(); st.redraw = draw;

  const send = async () => {
    const inp = $('#wnmi'); const txt = (inp.value || '').trim(); if (!txt) return;
    inp.value = '';
    const x = await post('sendMessage', { number: n, text: txt });
    if (x && x.ok === false) return toast(t('Failed'));
    st.msgs.push({ mine: true, text: txt, ts: Date.now() / 1000 });
    draw();
  };
  const mi = $('#wnmi'), ms = $('#wnms');
  const setSend = () => { ms.innerHTML = (mi.value || '').trim() ? I('<path d="M5 12h14M13 6l6 6-6 6"/>', 20) : I(WN.mic, 20) };
  mi.oninput = setSend;
  mi.onkeydown = e => { if (e.key === 'Enter') send() };
  ms.onclick = () => { if ((mi.value || '').trim()) send(); else toast(t('Coming soon')) };
  $('#wnatt').onclick = () => toast(t('Coming soon'));
  const callBtn = $('#wncall'); if (callBtn) callBtn.onclick = () => post('call', { number: n }).then(x => { if (!x || !x.ok) toast(x && x.err || t('Call failed')) });
  const vidBtn = $('#wnvid'); if (vidBtn) vidBtn.onclick = () => toast(t('Coming soon'));
}

async function wnCalls() {
  const r = await post('getCalls');
  const list = r.list || r || [];
  const rows = list.length ? list.map(c => {
    const nm = c.name || c.number;
    const dir = c.dir === 'out' ? '↗' : (c.dir === 'missed' ? '↙' : '↙');
    const col = c.dir === 'missed' ? '#f15c6d' : '#25d366';
    return `<div class="wn-row wn-call" data-n="${esc(c.number)}" data-name="${esc(nm)}">
      ${wnAv(nm)}
      <div class="wn-rc"><div class="wn-top"><b>${esc(nm)}${c.count && c.count > 1 ? ' (' + c.count + ')' : ''}</b></div>
      <div class="wn-prev" style="color:${col}">${dir} ${wnTime(c.ts)}</div></div>
      <button class="wn-call-btn" data-n="${esc(c.number)}">${I(WN.phone, 20)}</button>
    </div>`;
  }).join('') : `<p class="wn-empty">${t('No conversations yet.')}</p>`;

  view(t('Calls'), `
    <div class="wn-head"><h1>${t('Calls')}</h1>
      <div class="wn-acts"><button id="wnsr">${I(WN.search, 22)}</button><button id="wndots">${I(WN.dots, 22)}</button></div>
    </div>
    <div class="wn-call-tabs">
      <button class="on">${I(WN.phone, 20)}<span>${t('Calls') || 'Call'}</span></button>
      <button>${I('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>', 20)}<span>Schedule</span></button>
      <button id="wnkp">${I('<rect x="4" y="4" width="4" height="4" rx="1"/><rect x="10" y="4" width="4" height="4" rx="1"/><rect x="16" y="4" width="4" height="4" rx="1"/><rect x="4" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="16" y="10" width="4" height="4" rx="1"/><rect x="4" y="16" width="4" height="4" rx="1"/><rect x="10" y="16" width="4" height="4" rx="1"/><rect x="16" y="16" width="4" height="4" rx="1"/>', 20)}<span>${t('Keypad')}</span></button>
      <button>${I('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', 20)}<span>Favourites</span></button>
    </div>
    <h3 class="wn-sec">${t('Recent')}</h3>
    <div class="wn-list">${rows}</div>
    <button class="wn-fab green" id="wnfab">${I(WN.phone, 24)}</button>
    ${wnNav('calls')}
  `, { dark: true, app: 'wn', nohdr: true, cls: 'full wn-body' });

  document.querySelectorAll('.wn-call-btn').forEach(e => e.onclick = ev => {
    ev.stopPropagation();
    post('call', { number: e.dataset.n }).then(x => { if (!x || !x.ok) toast(x && x.err || t('Call failed')) });
  });
  document.querySelectorAll('.wn-row.wn-call').forEach(e => e.onclick = () => wnThread(e.dataset.n, e.dataset.name));
  $('#wnfab').onclick = wnNewChat;
  $('#wnkp').onclick = () => openApp('phone');
  wnNavBind();
}

function wnCommunities() {
  view(t('Communities'), `
    <div class="wn-head"><h1>${t('Communities')}</h1><div class="wn-acts"><button id="wndots">${I(WN.dots, 22)}</button></div></div>
    <div class="wn-comm">
      <div class="wn-comm-art">👥✏️🍎</div>
      <h2>${t('Stay connected with a community')}</h2>
      <p>Communities bring members together in topic-based groups.</p>
      <button class="wn-btn" id="wnsc">${t('Start your community')}</button>
    </div>
    ${wnNav('communities')}
  `, { dark: true, app: 'wn', nohdr: true, cls: 'full wn-body' });
  $('#wnsc').onclick = () => toast(t('Coming soon'));
  wnNavBind();
}

function wnUpdates() {
  view(t('Updates'), `
    <div class="wn-head"><h1>${t('Updates')}</h1><div class="wn-acts"><button id="wndots">${I(WN.dots, 22)}</button></div></div>
    <div class="wn-comm">
      <div class="wn-comm-art">⭕</div>
      <h2>Status</h2>
      <p>${t('Coming soon')}</p>
    </div>
    ${wnNav('updates')}
  `, { dark: true, app: 'wn', nohdr: true, cls: 'full wn-body' });
  wnNavBind();
}


/* ---------- Maps (Google Maps style + real GTA coords) ---------- */

/* GTA world -> atlas image % */
const MP_BOUNDS = { minX: -4000, maxX: 4500, minY: -4000, maxY: 8000 };
function mpGameToPct(x, y) {
  const bx = MP_BOUNDS;
  const px = ((x - bx.minX) / (bx.maxX - bx.minX)) * 100;
  const py = (1 - (y - bx.minY) / (bx.maxY - bx.minY)) * 100;
  return { left: Math.max(0, Math.min(100, px)), top: Math.max(0, Math.min(100, py)) };
}

/* Interactive pan/zoom map state */
st.mpView = st.mpView || { scale: 1.8, tx: 0, ty: 0 };
function mpApplyTransform(atlas) {
  if (!atlas) return;
  const v = st.mpView;
  atlas.style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.scale})`;
  atlas.style.setProperty('--inv', String(1 / v.scale));
}
function mpCenterOn(x, y, el) {
  const pos = mpGameToPct(x, y);
  const box = el.getBoundingClientRect();
  const v = st.mpView;
  // center that % point in the viewport
  const cx = box.width / 2, cy = box.height / 2;
  v.tx = cx - (pos.left / 100) * box.width * v.scale;
  v.ty = cy - (pos.top / 100) * box.height * v.scale;
  mpApplyTransform(el.querySelector('.mp-atlas'));
}
function mpBindPanZoom(el) {
  const atlas = el.querySelector('.mp-atlas');
  if (!atlas || el.dataset.bound) return;
  el.dataset.bound = '1';
  let dragging = false, lx = 0, ly = 0, moved = false;
  let pinch = null;

  const onDown = (x, y) => { dragging = true; moved = false; lx = x; ly = y; el.classList.add('grabbing'); };
  const onMove = (x, y) => {
    if (!dragging) return;
    const dx = x - lx, dy = y - ly;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    st.mpView.tx += dx; st.mpView.ty += dy;
    lx = x; ly = y;
    mpApplyTransform(atlas);
  };
  const onUp = () => { dragging = false; el.classList.remove('grabbing'); };

  el.addEventListener('mousedown', e => { if (e.button !== 0) return; e.preventDefault(); onDown(e.clientX, e.clientY); });
  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onUp);

  el.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      onDown(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      dragging = false;
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinch = { d, scale: st.mpView.scale };
    }
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && dragging) {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && pinch) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      st.mpView.scale = Math.max(1, Math.min(4.5, pinch.scale * (d / pinch.d)));
      mpApplyTransform(atlas);
    }
  }, { passive: true });
  el.addEventListener('touchend', () => { onUp(); pinch = null; });

  el.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const ns = Math.max(1, Math.min(4.5, st.mpView.scale * delta));
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    // zoom toward cursor
    const k = ns / st.mpView.scale;
    st.mpView.tx = mx - k * (mx - st.mpView.tx);
    st.mpView.ty = my - k * (my - st.mpView.ty);
    st.mpView.scale = ns;
    mpApplyTransform(atlas);
  }, { passive: false });

  // click place dots (ignore if was a drag)
  el.addEventListener('click', e => {
    if (moved) return;
    const dot = e.target.closest('.mp-dot');
    if (!dot) return;
    const p = { n: dot.dataset.n, x: +dot.dataset.x, y: +dot.dataset.y, z: +dot.dataset.z || 0, zone: dot.dataset.zone, cat: dot.dataset.cat };
    if (p.n) mpPlace(p);
  });
}

function mpRenderMap(el, loc, places) {
  if (!el) return;
  const me = mpGameToPct(loc.x || 0, loc.y || 0);
  const list = places && places.length ? places : GTA_PLACES;
  const dots = list.map(p => {
    const pos = mpGameToPct(p.x, p.y);
    return `<div class="mp-dot" style="left:${pos.left}%;top:${pos.top}%" title="${esc(p.n)}"
      data-n="${esc(p.n)}" data-x="${p.x}" data-y="${p.y}" data-z="${p.z || 0}" data-zone="${esc(p.zone || '')}" data-cat="${esc(p.cat || '')}"></div>`;
  }).join('');
  el.innerHTML = `
    <div class="mp-atlas" id="mpatlas">
      <div class="mp-player" style="left:${me.left}%;top:${me.top}%"></div>
      ${dots}
    </div>`;
  el.dataset.bound = '';
  // center on player first time / on relocate
  requestAnimationFrame(() => {
    mpCenterOn(loc.x || 0, loc.y || 0, el);
    mpBindPanZoom(el);
  });
}

const GTA_PLACES = [
  { n: 'Legion Square', cat: 'Landmark', x: 195.17, y: -933.78, z: 30.69, zone: 'Downtown' },
  { n: 'Maze Bank Arena', cat: 'Landmark', x: -250.66, y: -2030.22, z: 30.15, zone: 'La Puerta' },
  { n: 'Los Santos Airport (LSIA)', cat: 'Airport', x: -1037.71, y: -2737.86, z: 20.17, zone: 'LSIA' },
  { n: 'Sandy Shores Airfield', cat: 'Airport', x: 1741.68, y: 3279.36, z: 41.13, zone: 'Sandy Shores' },
  { n: 'Paleto Bay', cat: 'Town', x: -380.08, y: 6122.72, z: 31.48, zone: 'Paleto Bay' },
  { n: 'Sandy Shores', cat: 'Town', x: 1961.23, y: 3740.55, z: 32.34, zone: 'Sandy Shores' },
  { n: 'Grapeseed', cat: 'Town', x: 1683.52, y: 4779.66, z: 41.92, zone: 'Grapeseed' },
  { n: 'Vinewood Boulevard', cat: 'Landmark', x: 300.55, y: 185.04, z: 104.39, zone: 'Downtown Vinewood' },
  { n: 'Del Perro Pier', cat: 'Landmark', x: -1850.05, y: -1231.91, z: 13.02, zone: 'Del Perro' },
  { n: 'Vespucci Beach', cat: 'Landmark', x: -1392.34, y: -1323.72, z: 4.15, zone: 'Vespucci Beach' },
  { n: 'Mirror Park', cat: 'Town', x: 1070.56, y: -686.44, z: 57.63, zone: 'Mirror Park' },
  { n: 'Rockford Hills', cat: 'Town', x: -727.15, y: -79.63, z: 37.66, zone: 'Rockford Hills' },
  { n: 'Pillbox Hill Medical', cat: 'Hospital', x: 298.68, y: -584.59, z: 43.26, zone: 'Pillbox Hill' },
  { n: 'Central Los Santos Medical', cat: 'Hospital', x: 360.51, y: -585.21, z: 28.82, zone: 'Strawberry' },
  { n: 'Mission Row PD', cat: 'Police', x: 428.23, y: -984.28, z: 30.71, zone: 'Mission Row' },
  { n: 'Sandy Shores Sheriff', cat: 'Police', x: 1853.65, y: 3689.42, z: 34.27, zone: 'Sandy Shores' },
  { n: 'Paleto Bay Sheriff', cat: 'Police', x: -448.18, y: 6008.29, z: 31.72, zone: 'Paleto Bay' },
  { n: 'LTD Gasoline Grove', cat: 'Gas', x: -70.89, y: -1761.74, z: 29.53, zone: 'Davis' },
  { n: 'Ron Alternates Hwy', cat: 'Gas', x: 2581.32, y: 362.0, z: 108.47, zone: 'Tataviam Mountains' },
  { n: 'Xero Gas Route 68', cat: 'Gas', x: 49.42, y: 2778.79, z: 58.04, zone: 'Route 68' },
  { n: 'Fleeca Bank Legion', cat: 'Bank', x: 149.45, y: -1040.53, z: 29.37, zone: 'Downtown' },
  { n: 'Pacific Standard Bank', cat: 'Bank', x: 235.43, y: 216.95, z: 106.29, zone: 'Downtown Vinewood' },
  { n: 'Casino', cat: 'Landmark', x: 925.33, y: 46.15, z: 81.1, zone: 'Diamond Casino' },
  { n: 'Mount Chiliad Summit', cat: 'Landmark', x: 501.77, y: 5604.21, z: 797.91, zone: 'Mount Chiliad' },
  { n: 'Fort Zancudo', cat: 'Military', x: -2047.4, y: 3132.1, z: 32.81, zone: 'Zancudo' },
  { n: 'Chumash', cat: 'Town', x: -3192.62, y: 1100.06, z: 20.63, zone: 'Chumash' },
  { n: 'Harmony', cat: 'Town', x: 591.24, y: 2744.47, z: 42.04, zone: 'Harmony' },
  { n: 'Davis Quartz', cat: 'Landmark', x: 2945.59, y: 2746.87, z: 43.26, zone: 'Grand Senora' },
  { n: 'Yellow Jack Inn', cat: 'Restaurant', x: 1986.28, y: 3054.38, z: 47.22, zone: 'Sandy Shores' },
  { n: 'Bean Machine', cat: 'Restaurant', x: -628.45, y: 239.03, z: 81.89, zone: 'Rockford Hills' },
];

const MP = {
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/>',
  work: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  nav: '<path d="M12 2l3 8h7l-5.5 4.5L19 22l-7-4.5L5 22l2.5-7.5L2 10h7z" fill="currentColor" stroke="none"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bookmark: '<path d="M7 4h10v16l-5-3-5 3z"/>',
  bookmarkF: '<path d="M7 4h10v16l-5-3-5 3z" fill="currentColor"/>',
  contrib: '<path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="9"/>',
  shop: '<path d="M4 9h16l-1 11H5L4 9z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  car: '<path d="M5 11l2-5h10l2 5M3 16h2m14 0h2M7 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M3 11h18v5H3z"/>',
  food: '<path d="M8 3v8M6 3v4a2 2 0 0 0 4 0V3M16 3v18M14 8h4"/>',
  hospital: '<path d="M8 4h8v4h4v8h-4v4H8v-4H4V8h4z"/>',
  police: '<path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7z"/>',
  gas: '<path d="M6 4h8v14H6zM14 8h2a2 2 0 0 1 2 2v6a1 1 0 0 0 2 0V9"/><path d="M6 18h8"/>',
  plane: '<path d="M12 3l2 7h6l-4 3 2 7-6-4-6 4 2-7-4-3h6z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  dots: '<circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
};

const mpDist = (a, b) => {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
const mpFmt = m => m >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m) + ' m';
const mpRecent = () => { try { return JSON.parse(localStorage.getItem('ios_mp_recent') || '[]') } catch (e) { return [] } };
const mpSaveRecent = p => {
  let r = mpRecent().filter(x => x.n !== p.n);
  r.unshift({ n: p.n, zone: p.zone || '', x: p.x, y: p.y, z: p.z || 0, cat: p.cat || '', ts: Date.now() });
  localStorage.setItem('ios_mp_recent', JSON.stringify(r.slice(0, 20)));
};
const mpHome = () => { try { return JSON.parse(localStorage.getItem('ios_mp_home') || 'null') } catch (e) { return null } };
const mpWork = () => { try { return JSON.parse(localStorage.getItem('ios_mp_work') || 'null') } catch (e) { return null } };

const mpNav = tab => {
  const b = (k, path, label) => `<button data-t="${k}" class="${tab === k ? 'on' : ''}">${I(path, 22)}<span>${label}</span></button>`;
  return `<div class="mp-nav">${b('explore', MP.pin, t('Explore'))}${b('you', MP.bookmark, t('You'))}${b('contribute', MP.plus, t('Contribute'))}${b('business', MP.shop, t('Business'))}</div>`;
};
const mpNavBind = () => document.querySelectorAll('.mp-nav button').forEach(e => e.onclick = () => maps(e.dataset.t));

async function maps(tab) {
  tab = tab || st.mpTab || 'explore'; st.mpTab = tab;
if (tab === 'you') return mpYou();
  if (tab === 'contribute') return mpContribute();
  if (tab === 'business') return mpBusiness();
  return mpExplore();
}

async function mpExplore() {
  const loc = await post('getLocation');
  st.mpLoc = loc;
  const me = { x: loc.x || 0, y: loc.y || 0 };
  const nearby = GTA_PLACES.map(p => ({ ...p, d: mpDist(me, p) })).sort((a, b) => a.d - b.d).slice(0, 8);
  const streetLine = [loc.street, loc.cross].filter(Boolean).join(' & ') || loc.zone || '';

  view(t('Maps'), `
    <div class="mp-map">
      <div class="mp-map-bg" id="mpcanvas"></div>
      <div class="mp-search-bar">
        <button class="mp-back-ico" id="mphome2">${I(MP.back, 20)}</button>
        <input id="mpq" placeholder="${t('Search here')}" autocomplete="off">
        <button id="mpmic">${I(MP.mic, 18)}</button>
      </div>
      <div class="mp-chips">
        <button data-c="all" class="on">${t('Nearby')}</button>
        <button data-c="Gas">${t('Gas stations')}</button>
        <button data-c="Restaurant">${t('Restaurants')}</button>
        <button data-c="Hospital">${t('Hospitals')}</button>
        <button data-c="Police">${t('Police')}</button>
        <button data-c="Airport">${t('Airports')}</button>
      </div>
      <button class="mp-locate" id="mploc">${I(MP.nav, 20)}</button>
      <div class="mp-sheet">
        <div class="mp-handle"></div>
        <div class="mp-here">
          <div class="mp-here-ico">${I(MP.pin, 22)}</div>
          <div class="mp-here-txt">
            <b>${t('Your location')}</b>
            <small>${esc(streetLine)}</small>
            <small class="mp-coords">${loc.x}, ${loc.y} · ${esc(loc.zone || '')}</small>
          </div>
          <button class="mp-dir" id="mpdirhere">${t('Directions')}</button>
        </div>
        <h3 class="mp-sec">${t('Nearby')}</h3>
        <div class="mp-list" id="mpl">${nearby.map(p => mpRow(p)).join('')}</div>
      </div>
    </div>
    ${mpNav('explore')}
  `, { dark: false, app: 'mp', nohdr: true, cls: 'full mp-body' });
  mpRenderMap($('#mpcanvas'), loc, nearby);

  const renderList = (q, cat) => {
    let list = GTA_PLACES.map(p => ({ ...p, d: mpDist(me, p) }));
    if (cat && cat !== 'all') list = list.filter(p => p.cat === cat);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(p => p.n.toLowerCase().includes(qq) || (p.zone || '').toLowerCase().includes(qq) || (p.cat || '').toLowerCase().includes(qq));
    }
    list.sort((a, b) => a.d - b.d);
    $('#mpl').innerHTML = list.slice(0, 15).map(p => mpRow(p)).join('') || `<p class="mp-empty">${t('No places yet.')}</p>`;
    bindRows();
  };
  const bindRows = () => {
    document.querySelectorAll('.mp-row').forEach(e => e.onclick = () => {
      const p = { n: e.dataset.n, x: +e.dataset.x, y: +e.dataset.y, z: +e.dataset.z, zone: e.dataset.zone, cat: e.dataset.cat };
      mpPlace(p);
    });
    document.querySelectorAll('.mp-go').forEach(e => e.onclick = async ev => {
      ev.stopPropagation();
      const r = await post('setWaypoint', { x: +e.dataset.x, y: +e.dataset.y });
      toast(r && r.ok ? (t('GPS set') || 'GPS set') : t('Failed'));
    });
  };
  bindRows();
  $('#mpq').oninput = () => renderList($('#mpq').value.trim(), document.querySelector('.mp-chips button.on')?.dataset.c);
  document.querySelectorAll('.mp-chips button').forEach(b => b.onclick = () => {
    document.querySelectorAll('.mp-chips button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    renderList($('#mpq').value.trim(), b.dataset.c);
  });
  $('#mploc').onclick = async () => {
    const l = await post('getLocation'); st.mpLoc = l;
    mpRenderMap($('#mpcanvas'), l, nearby);
    const sl = [l.street, l.cross].filter(Boolean).join(' & ') || l.zone || '';
    const ht = document.querySelector('.mp-here-txt');
    if (ht) ht.innerHTML = `<b>${t('Your location')}</b><small>${esc(sl)}</small><small class="mp-coords">${l.x}, ${l.y} · ${esc(l.zone || '')}</small>`;
    toast((l.street || l.zone || '') + ' · ' + l.x + ', ' + l.y);
  };
  $('#mpdirhere').onclick = () => toast(t('Your location'));
  $('#mphome2').onclick = () => home();
  $('#mpmic').onclick = () => toast(t('Coming soon'));
  mpNavBind();
}

function mpRow(p) {
  return `<div class="mp-row" data-n="${esc(p.n)}" data-x="${p.x}" data-y="${p.y}" data-z="${p.z || 0}" data-zone="${esc(p.zone || '')}" data-cat="${esc(p.cat || '')}">
    <div class="mp-row-ico">${I(MP.clock, 18)}</div>
    <div class="mp-row-txt"><b>${esc(p.n)}</b><small>${esc(p.zone || p.cat || '')}${p.d != null ? ' · ' + mpFmt(p.d) : ''}</small></div>
    <button class="mp-go" data-x="${p.x}" data-y="${p.y}">${I(MP.nav, 16)}</button>
  </div>`;
}

async function mpPlace(p) {
  mpSaveRecent(p);
  const loc = st.mpLoc || await post('getLocation');
  const d = mpDist({ x: loc.x || 0, y: loc.y || 0 }, p);
  view(p.n, `
    <div class="mp-place">
      <div class="mp-place-hero"><div class="mp-place-pin">${I(MP.pin, 40)}</div></div>
      <div class="mp-place-body">
        <h2>${esc(p.n)}</h2>
        <p class="mp-place-sub">${esc(p.cat || '')}${p.zone ? ' · ' + esc(p.zone) : ''}</p>
        <p class="mp-coords">${p.x}, ${p.y}${d != null ? ' · ' + mpFmt(d) : ''}</p>
        <div class="mp-place-acts">
          <button class="mp-btn primary" id="mpset">${I(MP.nav, 18)} ${t('Directions')}</button>
          <button class="mp-btn" id="mphome">${I(MP.home, 18)} ${t('Set as Home')}</button>
          <button class="mp-btn" id="mpwork">${I(MP.work, 18)} ${t('Set as Work')}</button>
        </div>
      </div>
    </div>
  `, { dark: false, app: 'mp', back: () => maps('explore'), cls: 'mp-body' });
  $('#mpset').onclick = async () => {
    const r = await post('setWaypoint', { x: p.x, y: p.y });
    toast(r && r.ok ? (t('GPS set') || 'GPS set') : t('Failed'));
  };
  $('#mphome').onclick = () => { localStorage.setItem('ios_mp_home', JSON.stringify(p)); toast(t('Set as Home')) };
  $('#mpwork').onclick = () => { localStorage.setItem('ios_mp_work', JSON.stringify(p)); toast(t('Set as Work')) };
}

async function mpYou() {
  const loc = st.mpLoc || await post('getLocation');
  const homeP = mpHome(), workP = mpWork(), recent = mpRecent();
  view(t('You'), `
    <div class="mp-you">
      <div class="mp-you-head"><h1>${t('You')}</h1></div>
      <div class="mp-hw">
        <div class="mp-hw-card" id="mphc">
          <div class="mp-hw-ico home">${I(MP.home, 20)}</div>
          <div><b>${t('Home')}</b><small>${homeP ? esc(homeP.n) : (loc.zone || '—')}</small></div>
        </div>
        <div class="mp-hw-card" id="mpwc">
          <div class="mp-hw-ico work">${I(MP.work, 20)}</div>
          <div><b>${t('Work')}</b><small>${workP ? esc(workP.n) : '—'}</small></div>
        </div>
      </div>
      <h3 class="mp-sec">${t('Your recent places')}</h3>
      <div class="mp-list">${recent.length ? recent.map(p => mpRow(p)).join('') : `<p class="mp-empty">${t('No places yet.')}</p>`}</div>
    </div>
    ${mpNav('you')}
  `, { dark: false, app: 'mp', nohdr: true, cls: 'full mp-body' });
  document.querySelectorAll('.mp-row').forEach(e => e.onclick = () => mpPlace({ n: e.dataset.n, x: +e.dataset.x, y: +e.dataset.y, z: +e.dataset.z, zone: e.dataset.zone, cat: e.dataset.cat }));
  document.querySelectorAll('.mp-go').forEach(e => e.onclick = async ev => {
    ev.stopPropagation();
    const r = await post('setWaypoint', { x: +e.dataset.x, y: +e.dataset.y });
    toast(r && r.ok ? (t('GPS set') || 'GPS set') : t('Failed'));
  });
  $('#mphc').onclick = () => { if (homeP) mpPlace(homeP); else toast(t('Set as Home')) };
  $('#mpwc').onclick = () => { if (workP) mpPlace(workP); else toast(t('Set as Work')) };
  mpNavBind();
}

function mpContribute() {
  view(t('Contribute'), `
    <div class="mp-you">
      <div class="mp-you-head"><h1>${t('Contribute')}</h1></div>
      <div class="mp-badge-card">
        <b>Local Guide</b>
        <p>${t('Coming soon')}</p>
        <div class="mp-contrib-acts">
          <button>${I(MP.pin, 20)}<span>Add place</span></button>
          <button>${I(MP.star, 20)}<span>Review</span></button>
          <button>${I(MP.pin, 20)}<span>Photo</span></button>
        </div>
      </div>
    </div>
    ${mpNav('contribute')}
  `, { dark: false, app: 'mp', nohdr: true, cls: 'full mp-body' });
  document.querySelectorAll('.mp-contrib-acts button').forEach(b => b.onclick = () => toast(t('Coming soon')));
  mpNavBind();
}

function mpBusiness() {
  view(t('Business'), `
    <div class="mp-you">
      <div class="mp-you-head"><h1>${t('Business')}</h1></div>
      <div class="mp-badge-card">
        <div class="mp-biz-ico">${I(MP.shop, 28)}</div>
        <b>Your business</b>
        <p>${t('Coming soon')}</p>
      </div>
    </div>
    ${mpNav('business')}
  `, { dark: false, app: 'mp', nohdr: true, cls: 'full mp-body' });
  mpNavBind();
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (ytBig || document.fullscreenElement) { e.preventDefault(); e.stopImmediatePropagation(); ytExpand(false); return }
  post('close');
}, true);
/* Samsung nav buttons */
const navHome = () => {
  closeDrawer();
  closeRecents();
  if (st.locked) { unlockPhone(); return; }
  const app = $('#app');
  if (app && !app.classList.contains('hidden')) {
    st.locked = false;
    $('#app').className = 'hidden';
    $('#home')?.classList.remove('hidden');
    renderHome();
    return;
  }
  home();
};
const navBack = () => {
  if ($('#pinov')) { closePin(); return }
  if ($('#ntpanel') && $('#ntpanel').classList.contains('open')) {
    closeShade(); return;
  }
  if ($('#qspanel') && $('#qspanel').classList.contains('open')) {
    closeQS(); return;
  }
  if ($('#recents') && $('#recents').classList.contains('open')) {
    closeRecents(); return;
  }
  if ($('#drawer') && !$('#drawer').classList.contains('hidden') && $('#drawer').classList.contains('open')) {
    closeDrawer(); return;
  }
  const app = $('#app');
  if (app && !app.classList.contains('hidden')) {
    const bk = app.querySelector('.bk, .hdr .bk, [data-back]');
    if (bk) { bk.click(); return; }
    navHome();
  } else if (!st.locked) {
    showLock();
  }
};
const navRecents = () => { closeDrawer(); openRecents(); };
document.getElementById('nav-home')?.addEventListener('click', navHome);
document.getElementById('nav-back')?.addEventListener('click', navBack);
document.getElementById('nav-recents')?.addEventListener('click', navRecents);

$('#notch').onclick = () => { if (st.mus.cur && !$('#phone').classList.contains('hidden')) player() };
const tick = () => {
  const t = new Date();
  const el = $('#clock');
  if (el) el.textContent = String(t.getHours()).padStart(2,'0') + ':' + String(t.getMinutes()).padStart(2, '0');
  updateLockClock();
  // Samsung battery % (sim: stays high in-game)
  const pct = typeof st.battery === 'number' ? st.battery : 86;
  const bp = document.getElementById('battpct');
  const bf = document.getElementById('battfill');
  if (bp) bp.textContent = String(Math.max(0, Math.min(100, pct|0)));
  if (bf) bf.style.width = Math.max(0, Math.min(100, pct)) + '%';
};
st.battery = 86;

/* Swipe: up = unlock/drawer, down from top = Quick Settings */
(function setupSwipe() {
  const sc = document.getElementById('screen');
  if (!sc) return;
  let y0 = null, t0 = 0, startTop = false;
  const getY = e => e.touches ? e.touches[0].clientY : e.clientY;
  const topZone = () => {
    const r = sc.getBoundingClientRect();
    return r.height * 0.18; // top 18% of screen
  };
  sc.addEventListener('touchstart', e => {
    y0 = getY(e); t0 = Date.now();
    const r = sc.getBoundingClientRect();
    startTop = (y0 - r.top) < topZone();
  }, { passive: true });
  sc.addEventListener('mousedown', e => {
    y0 = e.clientY; t0 = Date.now();
    const r = sc.getBoundingClientRect();
    startTop = (y0 - r.top) < topZone();
  });
  const end = (y1) => {
    if (y0 == null) return;
    const dy = y0 - y1; // positive = swipe up
    const dt = Date.now() - t0;
    const wasTop = startTop;
    y0 = null; startTop = false;
    if (dt > 900) return;
    // swipe down from top -> Quick Settings
    if (dy < -40 && wasTop && !st.locked) {
      if ($('#qspanel')?.classList.contains('open')) return;
      if ($('#ntpanel')?.classList.contains('open')) { closeShade(); openQS(); return; }
      openShade();
      return;
    }
    // swipe up
    if (dy > 48) {
      if ($('#qspanel')?.classList.contains('open')) { closeQS(); return; }
      if ($('#ntpanel')?.classList.contains('open')) { closeShade(); return; }
      if (st.locked) unlockPhone();
      else if ($('#app')?.classList.contains('hidden')) openDrawer();
    }
    // swipe down (not from top zone) close drawer
    if (dy < -60) {
      if ($('#drawer')?.classList.contains('open')) closeDrawer();
      if ($('#qspanel')?.classList.contains('open')) closeQS();
    }
  };
  sc.addEventListener('touchend', e => { if (e.changedTouches[0]) end(e.changedTouches[0].clientY); }, { passive: true });
  sc.addEventListener('mouseup', e => end(e.clientY));
  // also click status bar area to open QS
  $('#status')?.addEventListener('click', e => {
    if ($('#ntpanel')?.classList.contains('open')) { closeShade(); openQS(); return }
    if ($('#qspanel')?.classList.contains('open')) { closeQS(); return }
    if (!st.locked) openShade();
  });
  // make status receive clicks
  const stEl = $('#status');
  if (stEl) stEl.style.pointerEvents = 'auto';

  $('#lock')?.addEventListener('click', e => {
    if (e.target.closest('.lk-q')) return;
    unlockPhone();
  });
  $('#lk-phone')?.addEventListener('click', e => { e.stopPropagation(); unlockPhone(); openApp('phone'); });
  $('#lk-cam')?.addEventListener('click', e => { e.stopPropagation(); unlockPhone(); openApp('camera'); });
  $('#wx-widget')?.addEventListener('click', () => openApp('weather'));
  $('#hw-card')?.addEventListener('click', () => openApp('messages'));
  $('#hw-photo')?.addEventListener('click', () => openApp('photos'));
  $('#hw-start')?.addEventListener('click', () => openApp('music'));
  $('#hw-care')?.addEventListener('click', () => openApp('settings'));
  $('#sam-search')?.addEventListener('click', () => openApp('browser'));
  $('#drq')?.addEventListener('input', e => filterDrawer(e.target.value));
  $('#drawer')?.addEventListener('click', e => { if (e.target.id === 'drawer') closeDrawer(); });
})();
tick(); setInterval(tick, 10000);

Object.assign(TR.ar, { 'Following': 'متابَعون', 'For You': 'لك', 'Home': 'الرئيسية', 'Friends': 'الأصدقاء', 'Inbox': 'الوارد', 'Profile': 'الملف', 'Videos': 'فيديوهات', 'Likes': 'إعجابات', 'Edit profile': 'تعديل الملف', 'Name': 'الاسم', 'Username': 'اسم المستخدم', 'Bio': 'النبذة', 'Basic info': 'معلومات أساسية', 'Save': 'حفظ', 'Saved': 'تم الحفظ', 'Share': 'مشاركة', 'Delete': 'حذف', 'Deleted': 'تم الحذف', 'Activity': 'النشاط', 'System notifications': 'إشعارات النظام', 'Welcome to Trendy': 'مرحباً بك في ترندي', 'New likes': 'إعجابات جديدة', 'Your video got': 'فيديوك حصل على', 'Original sound': 'الصوت الأصلي', 'Photo URL': 'رابط الصورة', 'Edit photo or Avatar': 'تعديل الصورة', 'Username taken': 'اسم المستخدم مستعمل', 'Invalid username': 'اسم مستخدم غير صالح' });
Object.assign(TR.fr, { 'Following': 'Abonnements', 'For You': 'Pour toi', 'Home': 'Accueil', 'Friends': 'Amis', 'Inbox': 'Boîte', 'Profile': 'Profil', 'Videos': 'Vidéos', 'Likes': 'J’aime', 'Edit profile': 'Modifier le profil', 'Name': 'Nom', 'Username': 'Nom d’utilisateur', 'Bio': 'Bio', 'Basic info': 'Infos de base', 'Save': 'Enregistrer', 'Saved': 'Enregistré', 'Share': 'Partager', 'Delete': 'Supprimer', 'Deleted': 'Supprimé', 'Activity': 'Activité', 'System notifications': 'Notifications système', 'Welcome to Trendy': 'Bienvenue sur Trendy', 'New likes': 'Nouveaux J’aime', 'Your video got': 'Ta vidéo a reçu', 'Original sound': 'Son original', 'Photo URL': 'URL de la photo', 'Edit photo or Avatar': 'Modifier la photo', 'Username taken': 'Nom déjà pris', 'Invalid username': 'Nom invalide' });

Object.assign(TR.ar, { 'Feels like': 'يبدو كأنه', 'Highs': 'العظمى', 'and lows': 'والصغرى', 'to': 'إلى', "Today's Temperature": 'درجة حرارة اليوم', 'Temperatures are about average': 'الحرارة قريبة من المعدل', 'Temperatures a little higher than average': 'الحرارة أعلى قليلاً من المعدل', 'Temperatures a little lower than average': 'الحرارة أقل قليلاً من المعدل', 'Changing to': 'يتغير إلى', 'No change expected': 'لا تغيير متوقع', 'Next': 'التالي', 'Enter a location name.': 'أدخل اسم الموقع.' });
Object.assign(TR.fr, { 'Feels like': 'Ressenti', 'Highs': 'Max', 'and lows': 'et min', 'to': 'à', "Today's Temperature": 'Température du jour', 'Temperatures are about average': 'Températures dans la moyenne', 'Temperatures a little higher than average': 'Un peu plus chaud que la moyenne', 'Temperatures a little lower than average': 'Un peu plus froid que la moyenne', 'Changing to': 'Évolue vers', 'No change expected': 'Aucun changement prévu', 'Enter a location name.': 'Saisissez un lieu.' });

Object.assign(TR.ar, { 'Photos & videos': 'الصور والفيديوهات', 'Choose a photo or video': 'اختر صورة أو فيديو' });
Object.assign(TR.fr, { 'Photos & videos': 'Photos et vidéos', 'Choose a photo or video': 'Choisis une photo ou une vidéo' });


/* Samsung: while the notification shade / Quick Settings are open, the status bar stays on top,
   the small clock is replaced by the carrier name (the big clock is inside the shade) */
window.addEventListener('load', () => {
  const left = document.querySelector('#status .st-left');
  if (!left || document.getElementById('st-carrier')) return;
  const cr = document.createElement('span'); cr.id = 'st-carrier';
  cr.textContent = (document.getElementById('qs-carrier') || {}).textContent || 'Los Santos';
  left.prepend(cr);
  const sync = () => {
    const o = ['#qspanel', '#ntpanel'].some(q => document.querySelector(q)?.classList.contains('open'));
    document.getElementById('screen').classList.toggle('pn-open', o);
  };
  ['#qspanel', '#ntpanel'].forEach(q => { const e = document.querySelector(q); if (e) new MutationObserver(sync).observe(e, { attributes: true, attributeFilter: ['class'] }) });
});

Object.assign(TR.ar, { 'Gemini API key is not set': 'مفتاح Gemini API غير مضبوط', 'Gemini API key is invalid': 'مفتاح Gemini API غير صالح', 'Gemini quota or rate limit reached': 'تم بلوغ حد Gemini' });
Object.assign(TR.fr, { 'Gemini API key is not set': "La clé API Gemini n'est pas définie", 'Gemini API key is invalid': 'Clé API Gemini invalide', 'Gemini quota or rate limit reached': 'Limite Gemini atteinte' });

Object.assign(TR.ar, { 'Hello, {n}': 'مرحبا {n} 👋', 'How can I help you today?': 'شنو نقدر نعاونك اليوم؟', 'Gemini request failed': 'فشل طلب Gemini' });
Object.assign(TR.fr, { 'Hello, {n}': 'Bonjour {n}', 'How can I help you today?': "Comment puis-je vous aider aujourd'hui ?", 'Gemini request failed': 'Échec de la requête Gemini' });

Object.assign(TR.ar, { 'Images are not available': 'الصور غير متاحة' });
Object.assign(TR.fr, { 'Images are not available': 'Images non disponibles' });


/* ---------- Contact us -> CarloDZ website ---------- */
const CONTACT_URL = 'https://carlodz.github.io/carlodz1/';
function openLink(url) {
  try {
    if (typeof window.invokeNative === 'function') { window.invokeNative('openUrl', url); return true }   // FiveM: opens the player's default browser
    window.open(url, '_blank', 'noopener'); return true;
  } catch (e) { return false }
}
function contactUs() {
  ssPage('Contact us', `
    <div class="ss-card" style="padding:18px 16px;text-align:center">
      <div style="font-size:22px;font-weight:700;margin-bottom:4px">CarloDZ</div>
      <div style="opacity:.7;font-size:13px;margin-bottom:12px">FiveM scripts &amp; more</div>
      <div dir="ltr" style="font-size:12.5px;word-break:break-all;color:#2f6bff;margin-bottom:16px">${esc(CONTACT_URL)}</div>
      <button type="button" id="cu-open" style="width:100%;border:0;border-radius:14px;padding:13px;font-size:15px;font-weight:600;color:#fff;background:#2f6bff;cursor:pointer;margin-bottom:8px">${esc(t('Open website') || 'Open website')}</button>
      <button type="button" id="cu-copy" style="width:100%;border:0;border-radius:14px;padding:13px;font-size:15px;font-weight:600;color:inherit;background:rgba(127,127,127,.18);cursor:pointer">${esc(t('Copy link') || 'Copy link')}</button>
    </div>`);
  $('#cu-open').onclick = () => { if (!openLink(CONTACT_URL)) toast(t('Failed') || 'Failed') };
  $('#cu-copy').onclick = () => {
    try { const x = document.createElement('textarea'); x.value = CONTACT_URL; document.body.appendChild(x); x.select(); document.execCommand('copy'); x.remove() } catch (e) { }
    toast(t('Copied') || 'Copied');
  };
}
Object.assign(TR.ar, { 'Open website': 'فتح الموقع' });
Object.assign(TR.fr, { 'Open website': 'Ouvrir le site' });
document.addEventListener('click', e => {
  const row = e.target.closest('.ss-link, .ss-look-a, #rd-ct');
  if (!row) return;
  const label = (row.querySelector('b') || row).textContent.trim();
  if (label === 'Contact us' || row.id === 'rd-ct') { e.preventDefault(); e.stopPropagation(); contactUs() }
}, true);
