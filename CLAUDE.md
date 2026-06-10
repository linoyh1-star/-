# חוגגות (Chogegot) — סיכום שיחה ומצב נוכחי

> פלטפורמת משחקים לאירועים חברתיים בעברית RTL (רווקות, יומולדת, גיבוש, דייט).
> Single-file React app ב-`index.html` (Babel-standalone). מתארח ב-GitHub Pages: `https://linoyh1-star.github.io/-/`

## ⚠️ כללים קבועים לעבודה
1. **כל שינוי עיצובי במסך אמיתי באפליקציה → לעדכן את ה-Mockup התואם בסלייד שואו**, ללא צורך בהוראה מפורשת. Mockups: `MockupHome`, `MockupChecklist`, `MockupBudget`, `MockupPlaylist`, `MockupGames`, `MockupJoin` ב-index.html.

## 🎮 Multiplayer game sessions — Firestore (חי ועובד)
- **Collections**: `/game_sessions/{code}` + subcollection `/participants/{name}`
- **Helpers** ב-index.html: `generateSessionCode`, `fbCreateSession`, `fbSubscribeSession`, `fbSubscribeParticipants`, `fbUpdateSession`, `fbJoinSession`, `fbSubmitParticipantAnswer`, `fbSubmitParticipantVotes`
- **Firestore Rules**: כבר עודכנו ב-Firebase ע"י Cowork — `game_sessions` ו-`participants` פתוחים לקריאה/כתיבה
- **משחקים מחוברים**:
  - **bridequiz** (חידון על הכלה): QuizGame → לוביי + שאלות → משתתפת כותבת תשובה → המארחת רואה בזמן אמת
  - **fmk** (Fuck Marry Kill): CardGame → לוביי + כרטיסים → משתתפת מצביעה F/M/K → צבירה חיה של "איך הבנות הצביעו"
- **URL Routing**: `?join=CODE` → `ScreenParticipant` (אוטומטי)
- **QR Code**: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=...` (חינמי, ללא הקמה)
- **TTL ל-cleanup**: לא מוגדר (Spark plan לא תומך). sessions קטנים, מצטברים. אם נחוץ — Blaze.

## 📦 Firestore — מה משתמשים בו (לזיכרון)
- `/users/{uid}` — Firebase Auth users (לא בשימוש פעיל)
- `/pending_users/{token}` — לקוחות חדשים שמ-Make.com יוצר (לא בשימוש פעיל)
- `/app_user_states/{username}` — סנכרון בין דפדפנים של state האפליקציה (אקטיבי!) — כתיבה ב-debounce של 1.5s לכל שינוי. כולל name, event, eventName, gameId, screen, checklistItems, budgetExpenses, budgetParticipants, groomAnswers.
- `/game_sessions/{code}` + `/participants/{name}` — multiplayer sessions

## 🔥 דברים שעדיין פתוחים (לא קריטיים)
- **MAKE_LOGIN_URL** ב-index.html: כבר אמיתי ועובד (`https://hook.eu1.make.com/coi9bjj6dxny0g7j6edppcm7i2bpedjy`)
- **CHOGEGOT_PLAYLIST_URL**: placeholder (Today's Top Hits) — לעדכן כשתיצור פלייליסט אמיתי
- **שם משתמש = רק מספרים בבדיקת אדווה**: נוסחה ב-Make.com Tools — Cowork עזרה לתקן את ה-`to` field ב-Gmail, אבל הנוסחה של username אולי עדיין `first(split(...))` שלא מפצל. אם זה חוזר — נחליף ל-`{{substring(1.data.fullName; 0; indexOf(1.data.fullName; " "))}}{{floor(random * 9000 + 1000)}}`

## בעלת המוצר
- לינוי ניסים
- ווטסאפ תמיכה: `0509419988` / `+972509419988`
- מייל: `linoynissim@gmail.com`
- אינסטגרם: `@linoynissim`

---

## 🎯 מצב נוכחי של המוצר

### ✅ צד האפליקציה (index.html) — מוכן ומפורסם

**זרימת onboarding חדשה:**
1. ברירת מחדל: מסך **Login** (שם משתמש + סיסמה)
2. אחרי לוגין מוצלח → username → event → nameEvent → slideshow → bachHome
3. דמו זמין דרך `?demo=1` (מסך welcome עם קוד 123456)

**מסכי האפליקציה (כולם עם באר עליון צבעוני מקוצר ב-36px):**
- `login` — שם משתמש + סיסמה. באר כתום עליון, deviceId נשמר ב-localStorage. קורא ל-`MAKE_LOGIN_URL` (כרגע placeholder).
- `welcome` (דמו) — מסך הקוד הישן
- `smsVerify` — Firebase Phone Auth (לא בשימוש, נשמר אם נחזור)
- `bachHome` — באר כתום עם avatar + שם + כפתורי home/help, רצועת טיפ שחורה למטה
- `helpCenter` — באר ורוד-כתום, כרטיסי ווטסאפ ו-AI agent
- `games` (hub) — באר כתום מקוצר, רשימת משחקים נקייה
- `checklist` — באר כתום עם פס התקדמות, כותרות קטגוריה בולטות עם רצועת צבע
- `budget` — באר כתום עם סך הוצאות וחסר לאסוף
- `playlist` — כפתור פתיחה אחד, פלייליסט קבוע (`CHOGEGOT_PLAYLIST_URL` placeholder)

**6 משחקים:**
1. `lipread` (מפה לאוזן) — timer, סבבים פתוחים
2. `charades` (בלי לומר מילה) — timer, טקסט בלבד
3. `groomq` (שאלון עם החתן) — card, אפשר לשלוח לחתן בווטסאפ
4. `bridequiz` (חידון על הכלה) — quiz, **20 שניות לשאלה**, simulated participants, joinable
5. `nhie` (Never Have I Ever) — card, drinking
6. `fmk` (Fuck Marry Kill) — card, joinable, **תצוגת תוצאות צבעוניות של "איך הבנות הצביעו"**

**עיצוב:**
- כתום `#E8512A` / ורוד `#EAA0BA` / שחור `#1A1A1A` כדי לשבור את הלבן
- כל המסכים עם הבארים בעלי `padding: "36px 22px 14px"` ו-`borderRadius: "0 0 22px 22px"`
- בארים יש גרדיינט + עיגול דקורטיבי שקוף + ניתן להוסיף שבבי סטטוס בפנים
- `StatusBar` ו-`HomeBar` הוסרו ויזואלית (החזירו null)
- כפתור "אפס" הוסר

**Auth helpers (פונקציות עזר ל-Login):**
```js
const MAKE_LOGIN_URL = "https://hook.eu1.make.com/PLACEHOLDER_LOGIN_URL"; // ⚠️ צריך לעדכן
const DEVICE_ID_KEY = "chogegot_device_id";
const AUTH_SESSION_KEY = "chogegot_auth_session";
// getOrCreateDeviceId, loadAuthSession, saveAuthSession, clearAuthSession
// makeLoginRequest(username, password) → {ok, fullName, phone, email, token, deviceId}
```

תגובה צפויה מ-Make.com login webhook:
- הצלחה: `{ok: true, fullName, phone, email, token}`
- פרטים שגויים: `{ok: false, error: "bad_credentials"}`
- מכשיר נעול: `{ok: false, error: "device_locked"}`

---

## 🔧 צד Make.com — מצב נוכחי

### ✅ תרחיש 1: Grow → Email (גמור ועובד)

**זרימה:** `Webhook → Tools → Data Store → Gmail`

1. **Webhook (Custom webhook)** — `https://hook.eu1.make.com/ygqrqnpccaydh3inkkkctv92ps8p61zq`
   - Grow שולח עם מבנה `data.X` (לא ישירות `X`)
   - השדות הרלוונטיים: `1.data.fullName`, `1.data.payerEmail`, `1.data.payerPhone`

2. **Tools (Set multiple variables) — module 13**
   - `username`: `{{get(split(1.data.fullName; " "); 1)}}{{floor(random * 9000 + 1000)}}` (לדוגמה: "לינוי5732")
   - `password`: `{{substring(replace(uuid; "-"; ""); 0; 6)}}` (לדוגמה: "a3k9p2")

3. **Data Store (Add a record)** — מאגר `chogegot_users`
   - Data Structure: `chogegot_user_record`
   - שדות: `username` (Text), `password` (Text), `fullName` (Text), `payerEmail` (Text), `payerPhone` (Text), `deviceId` (Text), `sessionToken` (Text), `createdAt` (Number)
   - Key: `{{13.username}}`
   - Overwrite: No
   - מיפוי: username/password מ-Tools, fullName/payerEmail/payerPhone מ-`1.data.X`, deviceId+sessionToken ריקים, createdAt = `{{timestamp}}`

4. **Gmail (Send email)**
   - To: `{{1.data.payerEmail}}`
   - Subject: `{{1.data.fullName}}, ברוכה הבאה לחוגגות 🎉`
   - Body type: Raw HTML
   - Content: כולל שם משתמש, סיסמה, כפתור פתיחה, ווטסאפ תמיכה, אינסטגרם

**נבדק עם נתוני אדווה (ADVA TAL SONDHIEMER) שעשתה תשלום אמיתי של 1₪.**

### ❌ תרחיש 2: Login Validation (טרם נבנה — השלב הבא)

צריך לבנות תרחיש חדש שיעשה:
1. **Webhook** מקבל POST עם `{username, password, deviceId}` מהאפליקציה
2. **Data Store (Search records)** — חיפוש לפי `username`
3. **Filter / Router:**
   - אם לא נמצא או password לא תואם → return `{ok: false, error: "bad_credentials"}`
   - אם נמצא וpassword תואם:
     - אם `deviceId` במאגר ריק → עדכן את המאגר עם ה-deviceId החדש + token, החזר `{ok: true, ...}`
     - אם `deviceId` במאגר תואם לחדש → החזר `{ok: true, ...}` (אותו מכשיר חוזר)
     - אם `deviceId` במאגר שונה → החזר `{ok: false, error: "device_locked"}`
4. **Webhook Response** — JSON חזרה לאפליקציה

אחרי שזה ייבנה, להעתיק את ה-Webhook URL ולעדכן ב-`index.html` במשתנה `MAKE_LOGIN_URL`.

### 📊 Make.com — שימוש בקרדיטים
- תוכנית: Free (1000 ops/חודש)
- כל לקוחה: ~7 ops (4 לתשלום + 3 ללוגין)
- כיסוי: ~140 לקוחות בחודש

---

## 📦 צד Firebase (לא בשימוש פעיל, נשמר)
- Project: `game-app-c8da5`
- Auth Phone הוגדר אבל לא משתמשים בו (דורש Blaze plan ~₪0.20/SMS)
- Firestore עם `/users/{uid}` קיים (נשמרת בו state אם המשתמש מחובר ל-Firebase Auth)
- אם נחזור ל-SMS, הכל מוכן ב-`fbSendSMS`, `fbOnAuthChange`, `fbSignOut`, `fbLoadUserData`, `fbSaveUserData`

---

## 🚧 דברים שנחתכו / נדחו

### החלטות עיצוב שהושלמו
- כותרות קטגוריה בצ'קליסט: היו "נעלמות" → תוקנו לכרטיסים צבעוניים
- שבבי סטטיסטיקה בבית (6/4/VIP) הוסרו לפי בקשה
- בארים קוצרו ל-36px עליון לפי בקשה ("רבע מסך - יותר מדי")

### באגים שתוקנו
- localStorage שמירת `smsVerify` → גרם לאיבוד נעילת טלפון ברענון. תוקן בפילטר
- Firebase Auth קיים שדילג על SMS verify → תוקן בניקוי session על קליק לינק חדש
- Make.com Gmail נכשל עם "Missing 'to'" → היה `1.X` במקום `1.data.X`. תוקן

### אופציות שנדונו ונדחו
- WhatsApp Cloud API → מורכב מדי להקמה
- Email-only verification עם קוד → קוד אפשר להעביר בקלות
- Firebase Blaze → יקר וקטן עמלת Grow

---

## 🎯 צעדים הבאים (כשלינוי תחזור)

1. **לבנות תרחיש 2 ב-Make.com** (Login Validation):
   - Webhook חדש
   - Data Store search
   - Router לבדיקות (bad_credentials / device_locked / ok)
   - Webhook Response
2. **לעדכן את `MAKE_LOGIN_URL` ב-index.html**
3. **לבדוק מקצה לקצה**: תשלום → מייל → קליק → לוגין → נכנסת לאפליקציה
4. **לבדוק את הגנת המכשיר**: ניסיון לוגין מדפדפן אחר → ייחסם
5. **לחבר את הלינק ב-Grow** לפרודקשן (כרגע ה-Webhook קיים אבל לא מחובר לתשלום אמיתי כלי דבר?)
6. **לבחור פלייליסט אמיתי** ולעדכן `CHOGEGOT_PLAYLIST_URL` ב-index.html

---

## 📁 קבצים רלוונטיים

- `C:\projects\chogegot\index.html` — האפליקציה כולה
- `C:\Users\97250\test_webhook.py` — בדיקת webhook במבנה שטוח (לא לשימוש יותר)
- `C:\Users\97250\test_webhook2.py` — דומה לעיל
- `C:\Users\97250\test_webhook_grow.py` — בדיקת webhook במבנה אמיתי של Grow (עם `data` עוטף)

## 🏷️ Git tags
- `v-pale-backup` — גרסה לפני הוספת הצבעים (אם נרצה לחזור)
- `v-colorful-v1` — הצבעוני הראשון

## 🎨 פלטה
```js
PB.orange = { main: "#E8512A", deep: "#C73E1C", soft: "#FBE4DB", on: "#FFFFFF" }
PB.pink   = { main: "#EAA0BA", deep: "#C75E82", soft: "#F9E8EE", on: "#1A1A1A" }
PB.ink    = { main: "#1A1A1A", deep: "#000000", soft: "#ECEAE8", on: "#FFFFFF" }
```
