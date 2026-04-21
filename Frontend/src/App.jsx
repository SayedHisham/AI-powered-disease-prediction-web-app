import React, { useState, useEffect } from "react"

export default function App() {
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("http://localhost:8000/symptoms")
      .then(res => res.json())
      .then(data => setSymptoms(data.symptoms))
  }, [])

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const predict = async () => {
    if (selectedSymptoms.length === 0) return
    setIsLoading(true)
    setResult(null)

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selectedSymptoms })
    })
    const data = await response.json()
    setResult(data)
    setIsLoading(false)
  }

  const filteredSymptoms = symptoms.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", fontFamily: "sans-serif", padding: "24px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>🏥 AI Disease Predictor</h1>
        <p style={{ color: "#94a3b8", marginTop: "8px" }}>Select your symptoms and get an instant prediction</p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Left — Symptom Selector */}
        <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}>Select Symptoms</h2>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "white", fontSize: "13px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
          />

          {/* Selected count */}
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px" }}>
            {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""} selected
          </p>

          {/* Symptom list */}
          <div style={{ maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {filteredSymptoms.map(symptom => (
              <div
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  backgroundColor: selectedSymptoms.includes(symptom) ? "#3b82f6" : "#0f172a",
                  border: `1px solid ${selectedSymptoms.includes(symptom) ? "#3b82f6" : "#334155"}`,
                  transition: "all 0.15s"
                }}
              >
                {symptom.replace(/_/g, " ")}
              </div>
            ))}
          </div>

          {/* Predict button */}
          <button
            onClick={predict}
            disabled={isLoading || selectedSymptoms.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "16px",
              backgroundColor: selectedSymptoms.length === 0 ? "#334155" : "#3b82f6",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: selectedSymptoms.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Predicting..." : "Predict Disease"}
          </button>
        </div>

        {/* Right — Results */}
        <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginTop: 0 }}>Prediction Result</h2>

          {!result && !isLoading && (
            <div style={{ textAlign: "center", color: "#475569", marginTop: "80px" }}>
              <p style={{ fontSize: "32px" }}>🩺</p>
              <p>Select symptoms and click Predict</p>
            </div>
          )}

          {isLoading && (
            <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "80px" }}>
              <p>Analyzing symptoms...</p>
            </div>
          )}

          {result && (
            <div>
              {/* Main prediction */}
              <div style={{ backgroundColor: "#0f172a", borderRadius: "8px", padding: "16px", marginBottom: "16px", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 8px" }}>PREDICTED DISEASE</p>
                <p style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 8px", color: "#3b82f6" }}>{result.disease}</p>
                <p style={{ fontSize: "13px", color: "#22c55e", margin: 0 }}>Confidence: {result.confidence}%</p>
              </div>

              {/* Top 3 */}
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Top 3 Predictions:</p>
              {result.top_3.map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#0f172a", borderRadius: "6px", marginBottom: "6px", fontSize: "13px" }}>
                  <span>{item.disease}</span>
                  <span style={{ color: "#94a3b8" }}>{item.confidence}%</span>
                </div>
              ))}

              {/* Selected symptoms */}
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "16px", marginBottom: "8px" }}>Symptoms analyzed:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selectedSymptoms.map(s => (
                  <span key={s} style={{ padding: "4px 10px", backgroundColor: "#1e3a5f", borderRadius: "20px", fontSize: "12px" }}>
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: "11px", color: "#475569", marginTop: "16px" }}>
                ⚠️ This is an AI prediction tool for educational purposes only. Always consult a qualified medical professional for diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}