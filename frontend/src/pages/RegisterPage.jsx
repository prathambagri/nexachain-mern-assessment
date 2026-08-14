import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { registerUser } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "border border-line rounded-md px-3 py-2.5 text-sm bg-bg text-text focus:border-accent focus:outline-none focus:bg-surface";

const emptyForm = { fullName: "", email: "", mobileNumber: "", password: "", referredByCode: "" };

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ ...emptyForm, referredByCode: searchParams.get("ref") || "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.referredByCode) delete payload.referredByCode;
      const res = await registerUser(payload);
      const { token, user } = res.data.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-6" style={{ backgroundImage: "radial-gradient(circle at 15% 15%, rgba(61,107,255,0.10), transparent 40%)" }}>
      <div className="w-full max-w-[400px] bg-surface rounded-md px-8 py-9 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2.5 font-display font-semibold text-[13px] tracking-wide text-navy mb-7">
          <span className="w-[18px] h-[18px] rounded-[4px] bg-gradient-to-br from-accent to-navy inline-block" aria-hidden="true" />
          <span>NEXACHAIN AI</span>
        </div>
        <h1 className="font-display text-[26px] text-navy m-0">Create account</h1>
        <p className="text-text-muted text-sm mt-1.5 mb-6">Set up your investor profile.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-navy">
            Full name
            <input required value={form.fullName} onChange={handleChange("fullName")} placeholder="Jane Doe" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-navy">
            Email
            <input type="email" required value={form.email} onChange={handleChange("email")} placeholder="you@example.com" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-navy">
            Mobile number
            <input required value={form.mobileNumber} onChange={handleChange("mobileNumber")} placeholder="9876543210" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-navy">
            Password
            <input type="password" required minLength={6} value={form.password} onChange={handleChange("password")} placeholder="••••••••" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-navy">
            Referral code <span className="font-normal text-text-muted">(optional)</span>
            <input value={form.referredByCode} onChange={handleChange("referredByCode")} placeholder="e.g. A1B2C3D4" className={inputClass} />
          </label>

          {error && <p className="text-loss text-[13px] m-0" role="alert">{error}</p>}

          <button
            type="submit"
            className="mt-1 bg-navy text-text-inverse border-none rounded-md py-[11px] font-semibold text-sm hover:bg-navy-soft transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-[22px] text-center text-[13px] text-text-muted">
          Already registered? <Link to="/login" className="text-accent font-semibold no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
