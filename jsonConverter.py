import pyodbc
import json
import os

# -------- CONFIG --------
ACCESS_DB_PATH = r"C:\Users\USER\OneDrive\CVTS\My Property Website\myproperties.accdb"
TABLE_NAME = "myProperties"
OUTPUT_JSON = "myProperties.json"
# ------------------------

# Connect to Access database
conn_str = (
    r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
    rf"DBQ={ACCESS_DB_PATH};"
)

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# Fetch data
cursor.execute(f"SELECT * FROM {TABLE_NAME}")

columns = [column[0] for column in cursor.description]
rows = cursor.fetchall()

# Convert rows to list of dicts
data = []
for row in rows:
    record = {}
    for col, val in zip(columns, row):
        # Convert non-JSON-friendly types
        if hasattr(val, "isoformat"):
            val = val.isoformat()
        record[col] = val
    data.append(record)

# Write to JSON file
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

# Cleanup
cursor.close()
conn.close()

print(f"✅ Export complete: {os.path.abspath(OUTPUT_JSON)}")
