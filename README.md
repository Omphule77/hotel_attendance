# हॉटेल कर्मचारी व वेटर हजेरी आणि पगार व्यवस्थापन प्रणाली
### (Hotel Employee Attendance & Salary Management System in Marathi)

ही प्रणाली खास करून **हॉटेल, रेस्टॉरंट, ढाबा आणि कॅफे** यांच्यासाठी तयार करण्यात आलेली **मराठी भाषेतील आधुनिक वेब प्रणाली** आहे. यात वेटर, आचारी (कुक), मदतनीस आणि क्लिनर यांची दैनिक हजेरी एका क्लिकवर नोंदवून महिन्याचा अंतिम पगार आपोआप काढता येतो.

---

## 🍃 MongoDB Atlas डेटाबेस आणि डेटा स्थलांतर (MongoDB Atlas Migration)

प्रणाली आता **MongoDB Atlas** (Cloud NoSQL Database) शी जोडण्यासाठी पूर्णपणे तयार आहे!

### १. MongoDB Atlas क्लस्टर सेटअप (Atlas Setup Steps):
1. **[MongoDB Cloud (Atlas)](https://www.mongodb.com/cloud/atlas)** वर लॉगिन करा.
2. एक मोफत क्लस्टर (Free M0 Cluster) तयार करा.
3. **Database Access** मध्ये जाऊन एक नवीन Database User (उदा. युझरनेम: `omphule`, पासवर्ड: `तुमचा_पासवर्ड`) तयार करा आणि त्याला `Read and write to any database` अधिकार द्या.
4. **Network Access** मध्ये जाऊन `IP Address`: `0.0.0.0/0` (Allow Access from Anywhere) ॲड करा.
5. **Database** > **Connect** > **Drivers (Java)** वर क्लिक करा आणि तुमची **Connection String URI** कॉपी करा.
   उदा:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotel_attendance?retryWrites=true&w=majority
   ```

### २. बॅकएंडमध्ये Atlas URI सेट करा:
`backend/src/main/resources/application.properties` फाईल उघडा आणि कॉपी केलेली connection string टाका:
```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotel_attendance?retryWrites=true&w=majority
spring.data.mongodb.database=hotel_attendance
```

### ३. MySQL मधील आधीचा डेटा Atlas मध्ये हलवा (Data Migration):
सर्व MySQL डेटा `migration/mysql_exported_data.json` मध्ये सुरक्षितपणे जतन करण्यात आला आहे.
हा डेटा Atlas मध्ये भरण्यासाठी खालीलपैकी कोणताही एक मार्ग वापरा:

**पर्याय अ (स्वयंचलित - Automatic):**
फक्त बॅकएंड सुरू करा (`mvn spring-boot:run`). `MongoDataMigrator` आपोआप सर्व व्यवस्थापक (Admins), कर्मचारी (विकास दुबे, महेश कुमार), हजेरी आणि उचल Atlas मध्ये भरून घेईल!

**पर्याय ब (मॅन्युअल Python स्क्रिप्ट):**
टर्मिनलमध्ये खालील कमांड चालवा:
```powershell
python migration/migrate_to_mongodb.py "mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotel_attendance?retryWrites=true&w=majority"
```

---

## 🚀 मुख्य वैशिष्ट्ये (Key Features)

1. **लॉगिन आणि नोंदणी (Login & Register)**:
   - व्यवस्थापक / अॅडमिन स्वतःचे खाते किंवा हॉटेलच्या नावाने नवीन नोंदणी करू शकतात.
2. **कर्मचारी व्यवस्थापन (Staff Management)**:
   - कर्मचाऱ्याचे नाव, मोबाईल नंबर, पद (वेटर, मुख्य आचारी, हेल्पर, इ.)
   - **पगार प्रकार**: दररोजचा पगार (Per Day Salary) किंवा मासिक पगार (Monthly Salary)
   - प्रति तास दर (Per Hour Rate) आणि कामावर रुजू होण्याची तारीख
   - कर्मचाऱ्यांची माहिती संपादन व हटवण्याची सोय
3. **दैनिक हजेरी पत्रक (Daily Attendance Sheet)**:
   - सर्व कर्मचारी एका खाली एक **उभ्या यादीत (Vertical List)** दर्शवले जातात.
   - प्रत्येक कर्मचाऱ्यासाठी एका क्लिकवर:
     - 🟢 **हजर (Present)** (८ तास)
     - 🟠 **अर्धा दिवस (Half Day)** (४ तास)
     - 🔴 **गैरहजर (Absent)** (० तास)
   - कामाचे तास आणि शेरा/टिप बदलण्याची सोय
   - "सर्व हजर करा" आणि "सर्व गैरहजर करा" हे झटपट बटन्स
   - मागील किंवा पुढील तारखेची हजेरी पाहण्यासाठी सोयीस्कर कॅलेंडर
4. **मासिक हजेरी व अंतिम पगार अहवाल (Monthly Attendance & Salary Report)**:
   - कोणत्याही महिना व वर्षाचा संपूर्ण हजेरी अहवाल
   - महिना एकूण दिवस, हजर दिवस, अर्धा दिवस, गैरहजर दिवस आणि एकूण तास
   - **अंतिम पगार गणना सूत्र (Salary Formula)**:
     - **दररोजचा पगार**: `(हजर दिवस × दररोजचा दर) + (अर्धा दिवस × दररोजचा दर × ०.५)`
     - **मासिक पगार**: `(मासिक पगार ÷ महिना दिवस) × (हजर दिवस + अर्धा दिवस × ०.५)`
   - **उचल / अ‍ॅडव्हान्स वजावट**: कर्मचाऱ्याने घेतलेली उचल नोंदवा आणि ती अंतिम पगारातून आपोआप वजा होते!
   - **पगार पावती / स्लिप (Printable Salary Slip)**: प्रत्येक कर्मचाऱ्याची अधिकृत मराठी पगार पावती प्रिंट करण्याची सोय.

---

## 🛠️ प्रोजेक्ट कसा सुरू करावा (How to Run)

### १. बॅकएंड (Java Spring Boot + MongoDB):
1. `backend/src/main/resources/application.properties` मध्ये तुमची MongoDB Atlas connection string तपासा:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotel_attendance?retryWrites=true&w=majority
   ```
2. टर्मिनलमध्ये बॅकएंड सुरू करा:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   बॅकएंड `http://localhost:8080` वर सुरू होईल.

### २. फ्रंटएंड (React.js + Vite):
1. टर्मिनलमध्ये फ्रंटएंड सुरू करा:
   ```bash
   cd frontend
   npm run dev
   ```
2. ब्राउझरमध्ये `http://localhost:5173` उघडा.

---

## 🐳 डॉकरद्वारे चालवा (Run with Docker & Docker Compose)

एकाच कमांडमध्ये बॅकएंड आणि फ्रंटएंड सुरू करण्यासाठी:
```bash
docker compose up -d --build
```
- 🌐 ॲप ब्राउझरमध्ये उघडा: `http://localhost`
- 🛑 थांबवण्यासाठी: `docker compose down`

---

## ☁️ AWS EC2 डिप्लॉयमेंट (AWS EC2 Deployment)

संपूर्ण स्टेप-बाय-स्टेप मार्गदर्शिकेसाठी **[AWS_EC2_DEPLOYMENT_GUIDE.md](file:///c:/Users/omphu/Desktop/Hotel%20Attendance/AWS_EC2_DEPLOYMENT_GUIDE.md)** फाईल पहा.
यात EC2 इंस्टन्स तयार करण्यापासून, डॉकर इन्स्टॉलेशन, स्वॅप मेमरी सेटअप, पोर्ट 80 रिव्हर्स प्रॉक्सी, आणि ऑटो-डिप्लॉयमेंटची सर्व माहिती दिलेली आहे.

