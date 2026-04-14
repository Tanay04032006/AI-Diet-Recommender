"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    gender: 1,
    goal: "muscle_gain",
    diet_type: "non_veg",
    preferred_foods: "",
    avoid_foods: ""
  });

  const [result, setResult] = useState(null);
  const [fallback, setFallback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setFallback(null);
    setError("");

    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          weight: Number(form.weight),
          height: Number(form.height),
          gender: Number(form.gender),
          duration: 30,
          heart_rate: 80,
          body_temp: 36.5
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      if (data.result?.error) {
        setFallback(data.structuredData);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  const diet = result;
  const fallbackData = fallback;

  const computeRealisticMacros = (meals, weight) => {
    let protein = 0, carbs = 0, fats = 0;
    Object.values(meals || {}).forEach(arr => {
      arr.forEach(item => {
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fats += item.fat || 0;
      });
    });
    const maxProtein = weight * 2.2;
    protein = Math.min(protein, maxProtein);
    return {
      protein: protein.toFixed(1),
      carbs: carbs.toFixed(1),
      fats: fats.toFixed(1)
    };
  };

  const fallbackMacros = fallbackData
    ? computeRealisticMacros(fallbackData.meals, Number(form.weight))
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f2", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .input-field {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e0d8;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          background: #fff;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #1D9E75;
          box-shadow: 0 0 0 3px rgba(29,158,117,0.1);
        }
        .input-field::placeholder { color: #b0ae a6; }

        .toggle-pill {
          flex: 1;
          padding: 9px 10px;
          border: 1px solid #e2e0d8;
          border-radius: 8px;
          background: #fff;
          color: #888;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
        }
        .toggle-pill:hover { border-color: #1D9E75; color: #1a1a1a; }
        .toggle-pill.active {
          background: #085041;
          border-color: #085041;
          color: #E1F5EE;
          font-weight: 500;
        }

        .generate-btn {
          width: 100%;
          padding: 15px;
          background: #085041;
          color: #E1F5EE;
          border: none;
          border-radius: 12px;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .generate-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .generate-btn:active:not(:disabled) { transform: scale(0.99); }
        .generate-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .meal-card {
          background: #fff;
          border: 1px solid #e8e6de;
          border-radius: 16px;
          padding: 20px;
          transition: box-shadow 0.2s;
        }
        .meal-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }

        .stat-chip {
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .section-eyebrow {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9a9890;
          margin-bottom: 10px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-delay-1 { animation: fadeUp 0.4s 0.1s ease both; }
        .fade-up-delay-2 { animation: fadeUp 0.4s 0.2s ease both; }
        .fade-up-delay-3 { animation: fadeUp 0.4s 0.3s ease both; }
      `}</style>

      {/* Top progress bar */}
      {progress > 0 && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "3px", background: "#e2e0d8", zIndex: 50 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #1D9E75, #085041)", width: `${progress}%`, transition: "width 0.3s ease", borderRadius: "0 2px 2px 0" }} />
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #e8e6de", background: "#fff", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#085041", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🥗</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>DietAI</span>
        </div>
        <span style={{ fontSize: 12, color: "#9a9890", background: "#f0ede6", padding: "4px 12px", borderRadius: 100, fontWeight: 500 }}>Beta</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 10 }}>
            Your personal<br />diet architect
          </h1>
          <p style={{ fontSize: 15, color: "#7a786e", fontWeight: 300, margin: 0 }}>
            Fill in your details and get a nutrition plan built around you
          </p>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", border: "1px solid #e8e6de", borderRadius: 20, padding: "32px", marginBottom: 24 }}>

          {/* Basic info */}
          <div className="section-eyebrow">Your profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { name: "age", placeholder: "Age", label: "Age" },
              { name: "weight", placeholder: "Weight (kg)", label: "Weight" },
              { name: "height", placeholder: "Height (cm)", label: "Height" }
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{f.label}</label>
                <input
                  name={f.name}
                  type="number"
                  placeholder={f.placeholder}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #f0ede6", paddingTop: 24, marginBottom: 24 }}>
            <div className="section-eyebrow">Gender</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ label: "Male", val: 1 }, { label: "Female", val: 0 }].map(opt => (
                <button
                  key={opt.val}
                  className={`toggle-pill ${Number(form.gender) === opt.val ? "active" : ""}`}
                  onClick={() => setForm({ ...form, gender: opt.val })}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Goal</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ label: "Muscle Gain", val: "muscle_gain" }, { label: "Weight Loss", val: "weight_loss" }].map(opt => (
                <button
                  key={opt.val}
                  className={`toggle-pill ${form.goal === opt.val ? "active" : ""}`}
                  onClick={() => setForm({ ...form, goal: opt.val })}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Diet type</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ label: "Non-Veg", val: "non_veg" }, { label: "Vegetarian", val: "veg" }].map(opt => (
                <button
                  key={opt.val}
                  className={`toggle-pill ${form.diet_type === opt.val ? "active" : ""}`}
                  onClick={() => setForm({ ...form, diet_type: opt.val })}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0ede6", paddingTop: 24, marginBottom: 28 }}>
            <div className="section-eyebrow">Food preferences</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Foods I enjoy</label>
                <input name="preferred_foods" placeholder="e.g. paneer, eggs, oats" onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#9a9890", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Foods to avoid</label>
                <input name="avoid_foods" placeholder="e.g. dairy, gluten" onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="generate-btn">
            {loading ? "Crafting your plan…" : "Generate my diet plan →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#FAECE7", border: "1px solid #F0997B", borderRadius: 12, padding: "12px 16px", color: "#4A1B0C", fontSize: 14, marginBottom: 24 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {(diet || fallbackData) && (
          <div>
            {/* Section title */}
            <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Your plan</h2>
              <span style={{ background: "#E1F5EE", color: "#085041", fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 100 }}>
                {form.goal === "muscle_gain" ? "Muscle Gain" : "Weight Loss"}
              </span>
            </div>

            {/* Macro row */}
            <div className="fade-up-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Calories", value: diet?.daily_target?.calories || fallbackData?.targetCalories, bg: "#FAEEDA", color: "#633806" },
                { label: "Protein", value: diet?.daily_target?.protein || fallbackMacros?.protein, bg: "#E1F5EE", color: "#085041" },
                { label: "Carbs", value: diet?.daily_target?.carbs || fallbackMacros?.carbs, bg: "#E6F1FB", color: "#0C447C" },
                { label: "Fats", value: diet?.daily_target?.fats || fallbackMacros?.fats, bg: "#FAECE7", color: "#4A1B0C" },
              ].map(s => (
                <div key={s.label} className="stat-chip" style={{ background: s.bg }}>
                  <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.value ?? "—"}</div>
                  <div style={{ fontSize: 12, color: s.color, opacity: 0.7, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="fade-up-delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>

              {/* AI meals */}
              {diet?.meals && Object.entries(diet.meals).map(([meal, data]) => (
                <div key={meal} className="meal-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a786e" }}>{meal}</span>
                    <span style={{ background: "#E1F5EE", color: "#085041", fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 100 }}>
                      {data.calories} kcal
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {data.items.map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: i < data.items.length - 1 ? "1px solid #f0ede6" : "none", fontSize: 13, color: "#1a1a1a" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", marginTop: 5, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Fallback meals */}
              {!diet?.meals && fallbackData && Object.entries(fallbackData.meals).map(([meal, items]) => {
                const totalCalories = items.reduce((s, i) => s + i.calories, 0);
                return (
                  <div key={meal} className="meal-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a786e" }}>{meal}</span>
                      <span style={{ background: "#E1F5EE", color: "#085041", fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 100 }}>
                        {totalCalories} kcal
                      </span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {items.map((i, idx) => (
                        <li key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: idx < items.length - 1 ? "1px solid #f0ede6" : "none", fontSize: 13, color: "#1a1a1a" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", marginTop: 5, flexShrink: 0 }} />
                          {i.food} ({i.calories} kcal)
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Why this works */}
            <div className="fade-up-delay-3" style={{ background: "#fff", border: "1px solid #e8e6de", borderLeft: "3px solid #1D9E75", borderRadius: "0 16px 16px 0", padding: "20px 24px" }}>
              <div className="section-eyebrow" style={{ marginBottom: 12 }}>Why this works</div>
              {diet?.why ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {diet.why.map((p, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, padding: "5px 0", fontSize: 14, color: "#1a1a1a" }}>
                      <span style={{ color: "#1D9E75", fontWeight: 500, flexShrink: 0 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Balanced Indian diet aligned with your fitness goal.",
                    "Protein optimized (~1.6–2.2 g/kg) for realistic muscle/weight goals.",
                    "Respects your food preferences and avoids restricted items."
                  ].map((p, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, padding: "5px 0", fontSize: 14, color: "#1a1a1a" }}>
                      <span style={{ color: "#1D9E75", fontWeight: 500, flexShrink: 0 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
