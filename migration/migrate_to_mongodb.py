import json
import sys
import os
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

def migrate(mongo_uri=None):
    if not mongo_uri:
        if len(sys.argv) > 1:
            mongo_uri = sys.argv[1].strip()
        else:
            # Check application.properties
            prop_file = os.path.join(os.path.dirname(__file__), '..', 'backend', 'src', 'main', 'resources', 'application.properties')
            if os.path.exists(prop_file):
                with open(prop_file, 'r', encoding='utf-8') as pf:
                    for line in pf:
                        line = line.strip()
                        if line.startswith('spring.data.mongodb.uri='):
                            val = line.split('spring.data.mongodb.uri=', 1)[1].strip()
                            if '<username>' not in val and '<password>' not in val:
                                mongo_uri = val
                                break

    if not mongo_uri:
        print("वापर: python migration/migrate_to_mongodb.py \"<MongoDB_Atlas_URI>\"")
        print("उदा: python migration/migrate_to_mongodb.py \"mongodb+srv://user:pass@cluster0.abcde.mongodb.net/hotel_attendance?retryWrites=true&w=majority\"")
        return False

    backup_file = os.path.join(os.path.dirname(__file__), 'mysql_exported_data.json')
    if not os.path.exists(backup_file):
        print("त्रुटी: migration/mysql_exported_data.json फाईल सापडली नाही!")
        return False

    with open(backup_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"MongoDB Atlas शी जोडत आहे... ({mongo_uri.split('@')[-1] if '@' in mongo_uri else 'local'})")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
    
    try:
        client.admin.command('ping')
        print("✅ MongoDB Atlas यशस्वीरित्या जोडले गेले (Connected Successfully)!")
    except Exception as e:
        print(f"❌ कनेक्शन अयशस्वी: {e}")
        return False

    # Extract db name or default to hotel_attendance
    db = client.get_database("hotel_attendance")

    # 1. Migrate Admins
    admins = data.get('admins', [])
    if admins:
        admin_col = db['admins']
        for adm in admins:
            existing = admin_col.find_one({"username": adm["username"]})
            doc = {
                "username": adm["username"],
                "password": adm["password"],
                "fullName": adm["full_name"],
                "hotelName": adm["hotel_name"],
                "mobile": adm.get("mobile", ""),
                "createdAt": adm.get("created_at")
            }
            if existing:
                admin_col.update_one({"_id": existing["_id"]}, {"$set": doc})
            else:
                admin_col.insert_one(doc)
        print(f"✅ {len(admins)} व्यवस्थापक (Admins) MongoDB मध्ये जतन केले.")

    # 2. Migrate Employees and keep map from old MySQL ID -> Mongo ObjectId String
    emp_map = {}
    employees = data.get('employees', [])
    if employees:
        emp_col = db['employees']
        for emp in employees:
            old_id = str(emp["id"])
            existing = emp_col.find_one({"mobile": emp["mobile"], "name": emp["name"]})
            doc = {
                "name": emp["name"],
                "mobile": emp["mobile"],
                "role": emp.get("role", "वेटर"),
                "salaryType": emp.get("salary_type", "DAILY"),
                "salaryAmount": emp.get("salary_amount", 0.0),
                "perHourRate": emp.get("per_hour_rate", 0.0),
                "joiningDate": emp.get("joining_date"),
                "status": emp.get("status", "ACTIVE"),
                "address": emp.get("address", ""),
                "createdAt": emp.get("created_at"),
                "updatedAt": emp.get("updated_at")
            }
            if existing:
                emp_col.update_one({"_id": existing["_id"]}, {"$set": doc})
                emp_map[old_id] = str(existing["_id"])
            else:
                ins = emp_col.insert_one(doc)
                emp_map[old_id] = str(ins.inserted_id)
        print(f"✅ {len(employees)} कर्मचारी (Employees) MongoDB मध्ये जतन केले.")

    # 3. Migrate Attendance records
    attendances = data.get('attendance', [])
    if attendances:
        att_col = db['attendance']
        inserted_att = 0
        for att in attendances:
            old_emp_id = str(att.get("employee_id"))
            mongo_emp_id = emp_map.get(old_emp_id, old_emp_id)
            att_date = att.get("attendance_date")
            
            existing = att_col.find_one({"employeeId": mongo_emp_id, "attendanceDate": att_date})
            doc = {
                "employeeId": mongo_emp_id,
                "attendanceDate": att_date,
                "status": att.get("status", "PRESENT"),
                "hoursWorked": att.get("hours_worked", 8.0),
                "notes": att.get("notes", ""),
                "createdAt": att.get("created_at"),
                "updatedAt": att.get("updated_at")
            }
            if existing:
                att_col.update_one({"_id": existing["_id"]}, {"$set": doc})
            else:
                att_col.insert_one(doc)
            inserted_att += 1
        print(f"✅ {inserted_att} हजेरी रेकॉर्ड्स (Attendance) MongoDB मध्ये जतन केले.")

    # 4. Migrate Advances
    advances = data.get('salary_advances', [])
    if advances:
        adv_col = db['salary_advances']
        inserted_adv = 0
        for adv in advances:
            old_emp_id = str(adv.get("employee_id"))
            mongo_emp_id = emp_map.get(old_emp_id, old_emp_id)
            doc = {
                "employeeId": mongo_emp_id,
                "advanceDate": adv.get("advance_date"),
                "amount": adv.get("amount", 0.0),
                "reason": adv.get("reason", "उचल"),
                "createdAt": adv.get("created_at")
            }
            adv_col.insert_one(doc)
            inserted_adv += 1
        print(f"✅ {inserted_adv} उचल रेकॉर्ड्स (Advances) MongoDB मध्ये जतन केले.")

    print("\n🎉 संपूर्ण MySQL डेटा MongoDB Atlas मध्ये यशस्वीरित्या हलवला गेला आहे!")
    return True

if __name__ == '__main__':
    migrate()
