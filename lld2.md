# 🚀 Energy Consumption Analytics Dashboard — LLD

---

## 🎯 Project Overview

The system analyzes household energy consumption data to identify usage patterns, detect anomalies, and provide actionable insights for energy conservation and transparency.

It follows a **Data Science-first approach**:

* Process raw data
* Extract meaningful patterns
* Present insights via a dashboard

---

## 🧠 System Summary

* Python backend handles data processing, anomaly detection, and insight generation
* FastAPI exposes APIs for data access
* React frontend visualizes trends, anomalies, and recommendations

---

## 🏗️ Architecture

```
Raw CSV → Data Processing (Python) → FastAPI → React Dashboard
```

* No database
* No microservices
* Single backend service

---

## 📁 Project Structure

```
energy-dashboard/
│
├── data/
│   ├── raw/
│   │   └── energy.csv
│   └── processed/
│       └── processed_energy.csv
│
├── notebooks/
│   └── eda.ipynb
│
├── backend/
│   ├── main.py
│   ├── services/
│   │   ├── data_loader.py
│   │   ├── preprocessing.py
│   │   ├── anomaly.py
│   │   └── insights.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── AnomalyList.jsx
│   │   │   └── InsightsPanel.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🧩 Data Pipeline

### 1. Data Loading

* Load CSV using `pandas.read_csv()`

### 2. Data Cleaning

* Replace `"?"` with null values
* Drop missing values
* Remove duplicate records

### 3. Data Transformation

* Combine `Date + Time → timestamp`
* Rename `Global_active_power → units`
* Convert kW → kWh (`units / 60`)
* Extract `hour` from timestamp

### 4. Save Processed Data

Output:

```
data/processed/processed_energy.csv
```

Final columns:

```
timestamp | units | hour
```

---

## ⚙️ Backend Design (FastAPI)

### 📄 data_loader.py

* Load processed CSV
* Convert timestamp to datetime

---

### 📄 preprocessing.py

* Ensure correct data types
* Return clean dataframe

---

### 📄 anomaly.py

**Method: IQR (Interquartile Range)**

* Compute Q1, Q3
* IQR = Q3 - Q1
* Detect outliers:

  * `< Q1 - 1.5 * IQR`
  * `> Q3 + 1.5 * IQR`

Output:

```
is_anomaly = True / False
```

---

### 📄 insights.py

Compute:

* Average consumption
* Peak hour
* Total anomaly count
* Recommendations

---

### 📄 main.py (API Layer)

#### GET `/api/data`

Returns:

```
timestamp, units, is_anomaly
```

---

#### GET `/api/anomalies`

Returns:

```
Only anomaly records
```

---

#### GET `/api/insights`

Returns:

```
{
  peak_hour,
  avg_consumption,
  anomaly_count,
  recommendations
}
```

---

## 🎨 Frontend Design (React)

### State

```
const [data, setData] = useState([])
const [insights, setInsights] = useState({})
```

---

### API Calls

* `/api/data`
* `/api/insights`

---

### Components

#### 📊 TrendChart.jsx

* Line chart
* X-axis: timestamp
* Y-axis: units

---

#### 🚨 AnomalyList.jsx

* Filter anomaly data:

```
data.filter(d => d.is_anomaly)
```

* Display time and usage

---

#### 💡 InsightsPanel.jsx

Displays:

* Peak hour
* Average consumption
* Recommendations

---

#### 🧩 Dashboard.jsx

* Combines all components

---

## 🔄 Data Flow

```
Raw CSV
   ↓
Data Cleaning
   ↓
Transformation
   ↓
Processed CSV
   ↓
FastAPI Backend
   ↓
Anomaly Detection + Insights
   ↓
API Responses
   ↓
React Dashboard
```

---

## 🎯 System Output

The system provides:

* 📊 Energy usage trends
* 🚨 Detected anomalies
* 💡 Actionable insights

---

## 📚 Module Alignment

This project covers:

* Data loading and inspection
* Data cleaning and preprocessing
* Feature engineering
* Visualization (line plot, histogram, boxplot)
* Outlier detection (IQR method)
* Insight generation

---

## ⚡ Final Checklist

* [ ] Raw data cleaned and processed
* [ ] Processed CSV generated
* [ ] Backend APIs working
* [ ] Anomaly detection implemented
* [ ] Insights generated
* [ ] Frontend dashboard displaying results
* [ ] README includes findings and limitations

---

## 🚀 Conclusion

This project demonstrates a complete data science workflow:

* From raw data → structured insights
* With a clean backend → frontend visualization

It focuses on **clarity, correctness, and real-world applicability** rather than overengineering.
