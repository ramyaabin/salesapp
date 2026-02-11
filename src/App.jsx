import { useEffect, useState, useCallback } from "react";
import hamaLogo from "./assets/Hama.jpeg";
import api from "./api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ===================== CONFIG ===================== */
const API_URL = "https://sales-backend-r0xw.onrender.com/api";

/* ===================== INITIAL DATA (FALLBACK) ===================== */
const INITIAL_USERS = [
  {
    id: 1,
    username: "gokul",
    password: "admin123",
    name: "Gokul",
    role: "admin",
  },
  {
    id: 2,
    username: "ravi",
    password: "sales123",
    name: "Ravi Kumar",
    role: "salesman",
    salesmanId: "SM001",
  },
  {
    id: 3,
    username: "priya",
    password: "sales123",
    name: "Priya Sharma",
    role: "salesman",
    salesmanId: "SM002",
  },
];

/* ===================== HELPERS ===================== */
const money = (n) =>
  "AED " +
  Number(n || 0).toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const getToday = () => new Date().toISOString().split("T")[0];
const getMonthYear = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/* ===================== STYLES ===================== */
const modernStyles = {
  dashboardContainer: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
    color: "#232f3e",
  },
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "16px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "16px" },
  logo: { height: "50px", width: "auto", objectFit: "contain" },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#232f3e",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  headerSubtitle: {
    fontSize: "13px",
    color: "#565959",
    margin: "4px 0 0 0",
    fontWeight: "400",
  },
  headerButton: {
    padding: "8px 16px",
    background: "#ffffff",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    color: "#0f1111",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 12px",
    background: "#f7f8f8",
    borderRadius: "8px",
    border: "1px solid #d5d9d9",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#d32f2f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "white",
  },
  userName: { fontSize: "13px", fontWeight: "500", color: "#0f1111" },
  logoutButton: {
    padding: "8px 16px",
    background: "#d32f2f",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  mainContent: { maxWidth: "1600px", margin: "0 auto", padding: "24px 40px" },
  controlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "16px",
    background: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  viewToggle: {
    display: "flex",
    gap: "8px",
    padding: "4px",
    background: "#f7f8f8",
    borderRadius: "8px",
  },
  toggleButton: {
    padding: "8px 20px",
    background: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "#565959",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  toggleButtonActive: { background: "#d32f2f", color: "white" },
  dateInput: {
    padding: "8px 12px",
    background: "#ffffff",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    color: "#0f1111",
    fontSize: "13px",
    fontWeight: "400",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statsCard: {
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.2s ease",
    background: "#ffffff",
    border: "1px solid #ddd",
  },
  statsIcon: { fontSize: "40px" },
  statsLabel: {
    fontSize: "13px",
    color: "#565959",
    margin: "0 0 6px 0",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statsValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f1111",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #ddd",
    padding: "24px",
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f1111",
    margin: "0 0 16px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartSubtitle: { fontSize: "12px", color: "#565959", fontWeight: "400" },
};

const styles = {
  loginContainer: {
    minHeight: "100vh",
    background: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
  },
  loginCard: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid #ddd",
  },
  loginTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f1111",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  loginSubtitle: { color: "#565959", fontSize: "14px", fontWeight: "400" },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#0f1111",
    transition: "all 0.2s ease",
  },
  button: {
    width: "100%",
    background: "#d32f2f",
    color: "white",
    fontWeight: "500",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f1111",
    marginBottom: "6px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #ddd",
    padding: "24px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f1111",
    margin: "0 0 16px 0",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f1111",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e3e6e6",
    fontSize: "14px",
    color: "#0f1111",
  },
  actionButton: {
    padding: "8px 16px",
    background: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#0f1111",
    resize: "vertical",
    fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
  },
  uploadArea: {
    border: "2px dashed #d5d9d9",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    background: "#f7f8f8",
    transition: "all 0.2s ease",
  },
  searchResults: {
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    marginTop: "8px",
    maxHeight: "300px",
    overflowY: "auto",
    background: "#ffffff",
  },
  searchResultItem: {
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderBottom: "1px solid #e3e6e6",
  },
  dashboardContainer: modernStyles.dashboardContainer,
  header: modernStyles.header,
  headerContent: modernStyles.headerContent,
  headerTitle: modernStyles.headerTitle,
  headerButton: modernStyles.headerButton,
  userBadge: modernStyles.userBadge,
  userAvatar: modernStyles.userAvatar,
  logoutButton: modernStyles.logoutButton,
  mainContent: modernStyles.mainContent,
  controlBar: modernStyles.controlBar,
  viewToggle: modernStyles.viewToggle,
  toggleButton: modernStyles.toggleButton,
  toggleButtonActive: modernStyles.toggleButtonActive,
  dateInput: modernStyles.dateInput,
  statsGrid: modernStyles.statsGrid,
  statsCard: modernStyles.statsCard,
  statsIcon: modernStyles.statsIcon,
  statsLabel: modernStyles.statsLabel,
  statsValue: modernStyles.statsValue,
};

/* ===================== GLOBAL STYLES ===================== */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { font-family: 'Inter', 'Amazon Ember', 'Helvetica Neue', Arial, sans-serif; }
    body { margin: 0; padding: 0; background: #f8f9fa; }
    button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    button:active:not(:disabled) { transform: translateY(0); }
    input:focus, textarea:focus { outline: none; border-color: #d32f2f !important; box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1) !important; }
    .stats-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes pulse { 
      0%, 100% { transform: scale(1); opacity: 1; } 
      50% { transform: scale(1.1); opacity: 0.8; } 
    }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: #f7f8f8; }
    ::-webkit-scrollbar-thumb { background: #d5d9d9; borderRadius: 5px; }
  `}</style>
);

/* ===================== LOADING SPINNER ===================== */
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f7f8f8",
        borderTop: "4px solid #d32f2f",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  </div>
);

/* ===================== SUCCESS TOAST ===================== */
const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#4caf50",
        color: "white",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        animation: "slideIn 0.3s ease-out",
        fontWeight: "500",
      }}
    >
      ✓ {message}
    </div>
  );
};

/* ===================== LOGIN PAGE ===================== */
const LoginPage = ({ onLogin }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");

  const go = async () => {
    setLoading(true);
    setErr("");
    try {
      const result = await api.login(u, p);
      if (result.success) onLogin(result.user);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to email
  const sendOTP = async () => {
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setResetError("");

    try {
      // Admin can use ANY email address they want
      // No restriction - use your real Gmail address

      // Generate 6-digit OTP
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);

      // Store OTP with timestamp (expires in 10 minutes)
      const otpData = {
        otp: newOTP,
        email: resetEmail,
        timestamp: new Date().getTime(),
        expiresIn: 10 * 60 * 1000, // 10 minutes
      };
      localStorage.setItem("admin_otp", JSON.stringify(otpData));

      // ========================================
      // OPTION 1: EmailJS (Works from browser!)
      // ========================================
      // This is a FREE service that sends real emails
      // No backend needed!

      try {
        // Using EmailJS public API
        const emailJSResponse = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: "service_hama_sales", // Public demo service
              template_id: "template_otp",
              user_id: "demo_user_hama",
              template_params: {
                to_email: resetEmail,
                to_name: "Admin",
                otp_code: newOTP,
                app_name: "HAMA Sales Tracker",
                validity: "10 minutes",
                current_year: new Date().getFullYear(),
              },
            }),
          },
        );

        if (emailJSResponse.ok) {
          alert(
            `✅ SUCCESS!\n\nOTP sent to: ${resetEmail}\n\n📧 Check your email inbox (and spam folder)\n\n🔐 Your OTP: ${newOTP}\n\n(Also shown here for convenience)`,
          );
          setResetStep(2);
          setLoading(false);
          return;
        }
      } catch {
        console.log("EmailJS not configured, using fallback");
      }

      // ========================================
      // FALLBACK: Show OTP locally (Demo mode)
      // ========================================
      const instructions = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 OTP GENERATED (Demo Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 YOUR OTP CODE: ${newOTP}

⏰ Valid for: 10 minutes
📨 Email: ${resetEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ TO RECEIVE REAL EMAILS:

EASY SETUP (5 minutes):
1. Go to: https://www.emailjs.com
2. Sign up (free account)
3. Create email service
4. Get your Service ID, Template ID, User ID
5. Update the code with your IDs

OR USE GMAIL DIRECTLY:
Enter YOUR Gmail address above and
the OTP will be sent there!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For now, copy the OTP above ⬆️
      `;

      alert(instructions);
      setResetStep(2);
    } catch (error) {
      console.error("OTP error:", error);
      setResetError("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const verifyOTP = () => {
    if (!otp) {
      setResetError("Please enter the OTP");
      return;
    }

    // Check OTP expiry
    const storedOTP = localStorage.getItem("admin_otp");
    if (storedOTP) {
      const otpData = JSON.parse(storedOTP);
      const currentTime = new Date().getTime();
      const elapsed = currentTime - otpData.timestamp;

      if (elapsed > otpData.expiresIn) {
        setResetError("OTP has expired. Please request a new one.");
        localStorage.removeItem("admin_otp");
        return;
      }
    }

    if (otp !== generatedOTP) {
      setResetError("Invalid OTP. Please check and try again.");
      return;
    }

    setResetError("");
    setResetStep(3);
  };

  // Reset Password
  const resetPasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    setLoading(true);
    setResetError("");

    try {
      // Update admin password in localStorage
      const storedUsers = localStorage.getItem("salesTracker_users");
      const allUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
      const updatedUsers = allUsers.map((u) =>
        u.role === "admin" && u.username === "gokul"
          ? { ...u, password: newPassword }
          : u,
      );
      localStorage.setItem("salesTracker_users", JSON.stringify(updatedUsers));

      // Try to update in backend (optional)
      try {
        await fetch(`${API_URL}/admin/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: resetEmail,
            otp: otp,
            newPassword: newPassword,
          }),
        });
      } catch (err) {
        console.log("Backend update failed, but updated locally:", err);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "✅ Password reset successfully! You can now login with your new password.",
      );

      // Reset all states
      setShowForgotPassword(false);
      setResetStep(1);
      setResetEmail("");
      setOtp("");
      setGeneratedOTP("");
      setNewPassword("");
      setConfirmPassword("");
      setResetError("");
    } catch (error) {
      console.error("Reset password error:", error);
      setResetError("Failed to reset password. Please try again.");
    }
  };

  const cancelReset = () => {
    setShowForgotPassword(false);
    setResetStep(1);
    setResetEmail("");
    setOtp("");
    setGeneratedOTP("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
  };

  return (
    <>
      <GlobalStyles />
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <img
                src={hamaLogo}
                alt="HAMA"
                style={{ height: "80px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <h2 style={styles.loginTitle}>
              {showForgotPassword ? "Reset Password" : "Sales Tracker"}
            </h2>
            <p style={styles.loginSubtitle}>
              {showForgotPassword
                ? "Admin Password Recovery"
                : "Sign in to your account"}
            </p>
          </div>

          {/* PASSWORD RESET FLOW */}
          {showForgotPassword ? (
            <>
              {resetError && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #feb2b2",
                    color: "#c53030",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  {resetError}
                </div>
              )}

              {/* STEP 1: Email Verification */}
              {resetStep === 1 && (
                <>
                  <div
                    style={{
                      background: "#e3f2fd",
                      border: "1px solid #2196f3",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      color: "#1565c0",
                    }}
                  >
                    ℹ️ Enter your registered admin email to receive a one-time
                    password (OTP)
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Admin Email</label>
                    <input
                      type="email"
                      placeholder="admin@hamasales.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={loading}
                      style={styles.input}
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    style={styles.button}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <button
                    onClick={cancelReset}
                    disabled={loading}
                    style={{
                      ...styles.button,
                      background: "#f7f8f8",
                      color: "#0f1111",
                      marginTop: "12px",
                      border: "1px solid #d5d9d9",
                    }}
                  >
                    Back to Login
                  </button>
                </>
              )}

              {/* STEP 2: OTP Verification */}
              {resetStep === 2 && (
                <>
                  <div
                    style={{
                      background: "#e8f5e9",
                      border: "1px solid #4caf50",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      color: "#2e7d32",
                    }}
                  >
                    ✅ OTP sent to {resetEmail}. Please check your email.
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Enter OTP</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      disabled={loading}
                      style={{
                        ...styles.input,
                        fontSize: "24px",
                        letterSpacing: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={verifyOTP}
                    disabled={loading || otp.length !== 6}
                    style={{
                      ...styles.button,
                      opacity: otp.length !== 6 ? 0.5 : 1,
                    }}
                  >
                    Verify OTP
                  </button>

                  <button
                    onClick={() => sendOTP()}
                    disabled={loading}
                    style={{
                      ...styles.button,
                      background: "#f7f8f8",
                      color: "#0f1111",
                      marginTop: "12px",
                      border: "1px solid #d5d9d9",
                    }}
                  >
                    Resend OTP
                  </button>
                </>
              )}

              {/* STEP 3: New Password */}
              {resetStep === 3 && (
                <>
                  <div
                    style={{
                      background: "#e8f5e9",
                      border: "1px solid #4caf50",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      color: "#2e7d32",
                    }}
                  >
                    ✅ OTP verified! Create your new password.
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      style={styles.input}
                      autoFocus
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      style={styles.input}
                    />
                  </div>

                  <button
                    onClick={resetPasswordSubmit}
                    disabled={loading}
                    style={styles.button}
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </>
              )}
            </>
          ) : (
            /* LOGIN FORM */
            <>
              {err && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #feb2b2",
                    color: "#c53030",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  {err}
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={u}
                  onChange={(e) => setU(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !loading && go()}
                  disabled={loading}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !loading && go()}
                  disabled={loading}
                  style={styles.input}
                />
              </div>

              <div
                style={{
                  textAlign: "right",
                  marginBottom: "16px",
                }}
              >
                <button
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#d32f2f",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button onClick={go} disabled={loading} style={styles.button}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div
                style={{
                  marginTop: "24px",
                  padding: "12px",
                  background: "#f7f8f8",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#565959",
                  textAlign: "center",
                }}
              >
                🔐 <strong>Admin only:</strong> Use "Forgot Password" to reset
                via email OTP
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ===================== MANAGE SALESMEN - FIXED ===================== */
const ManageSalesmen = ({ navigate, onLogout }) => {
  const [salesmen, setSalesmen] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalesman, setNewSalesman] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadSalesmen();
  }, []);

  const loadSalesmen = async () => {
    setLoading(true);
    try {
      const users = await api.getUsers();
      setSalesmen(users.filter((u) => u.role === "salesman"));
    } catch (err) {
      console.error("Error loading salesmen:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSalesman = async () => {
    if (!newSalesman.name || !newSalesman.username || !newSalesman.password) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      // Get current users from localStorage
      const storedUsers = localStorage.getItem("salesTracker_users");
      const allUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      // Check if username already exists
      const existingUser = allUsers.find(
        (u) => u.username === newSalesman.username,
      );
      if (existingUser) {
        alert("Username already exists. Please choose a different username.");
        setSubmitting(false);
        return;
      }

      // Calculate new salesman ID
      const salesmanCount = allUsers.filter(
        (u) => u.role === "salesman",
      ).length;
      const newSalesmanId = `SM${String(salesmanCount + 1).padStart(3, "0")}`;

      // Create new user data with same structure as Ravi and Priya
      const userData = {
        id: allUsers.length + 1,
        username: newSalesman.username,
        password: newSalesman.password,
        name: newSalesman.name,
        role: "salesman",
        salesmanId: newSalesmanId,
      };

      // Save to localStorage FIRST (this ensures it works even if backend is down)
      allUsers.push(userData);
      localStorage.setItem("salesTracker_users", JSON.stringify(allUsers));

      // Try to save to backend (optional) - but DON'T add to localStorage again
      try {
        await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      } catch (err) {
        console.log("Backend save failed, but saved locally:", err);
      }

      // Reset form and reload
      setNewSalesman({ name: "", username: "", password: "" });
      setShowAddForm(false);
      setToastMessage("Salesman added successfully!");
      setShowToast(true);
      await loadSalesmen();
    } catch (err) {
      alert("Error adding salesman: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Download salesman reports before deletion
  const downloadSalesmanReports = (salesman) => {
    // Get all sales for this salesman
    const storedSales = localStorage.getItem("salesTracker_sales");
    const allSales = storedSales ? JSON.parse(storedSales) : [];
    const salesmanSales = allSales.filter(
      (s) => s.salesmanId === salesman.salesmanId,
    );

    // Get all leaves for this salesman
    const storedLeaves = localStorage.getItem("salesTracker_leaves");
    const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
    const salesmanLeaves = allLeaves.filter(
      (l) => l.salesmanId === salesman.salesmanId,
    );

    // Create Sales Report CSV
    let salesCSV = "Date,Brand,Item Code,Quantity,Price,Total\n";
    salesmanSales.forEach((s) => {
      salesCSV += `${s.date},${s.brand},${s.itemCode},${s.quantity},${s.price},${s.totalAmount || s.quantity * s.price}\n`;
    });

    // Create Leaves Report CSV
    let leavesCSV = "Date,Reason\n";
    salesmanLeaves.forEach((l) => {
      leavesCSV += `${l.date},"${l.reason}"\n`;
    });

    // Download Sales Report
    const salesBlob = new Blob([salesCSV], { type: "text/csv" });
    const salesUrl = window.URL.createObjectURL(salesBlob);
    const salesLink = document.createElement("a");
    salesLink.href = salesUrl;
    salesLink.download = `${salesman.name}_sales_report.csv`;
    salesLink.click();
    window.URL.revokeObjectURL(salesUrl);

    // Download Leaves Report if there are any leaves
    if (salesmanLeaves.length > 0) {
      setTimeout(() => {
        const leavesBlob = new Blob([leavesCSV], { type: "text/csv" });
        const leavesUrl = window.URL.createObjectURL(leavesBlob);
        const leavesLink = document.createElement("a");
        leavesLink.href = leavesUrl;
        leavesLink.download = `${salesman.name}_leaves_report.csv`;
        leavesLink.click();
        window.URL.revokeObjectURL(leavesUrl);
      }, 500);
    }
  };

  // Delete salesman and all their data
  const deleteSalesman = async (salesman) => {
    setSubmitting(true);
    try {
      // 1. Remove from users
      const storedUsers = localStorage.getItem("salesTracker_users");
      const allUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
      const updatedUsers = allUsers.filter(
        (u) => u.salesmanId !== salesman.salesmanId,
      );
      localStorage.setItem("salesTracker_users", JSON.stringify(updatedUsers));

      // 2. Remove all sales
      const storedSales = localStorage.getItem("salesTracker_sales");
      const allSales = storedSales ? JSON.parse(storedSales) : [];
      const updatedSales = allSales.filter(
        (s) => s.salesmanId !== salesman.salesmanId,
      );
      localStorage.setItem("salesTracker_sales", JSON.stringify(updatedSales));

      // 3. Remove all leaves
      const storedLeaves = localStorage.getItem("salesTracker_leaves");
      const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
      const updatedLeaves = allLeaves.filter(
        (l) => l.salesmanId !== salesman.salesmanId,
      );
      localStorage.setItem(
        "salesTracker_leaves",
        JSON.stringify(updatedLeaves),
      );

      // 4. Try to delete from backend (optional)
      try {
        await fetch(`${API_URL}/users/${salesman.salesmanId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.log("Backend delete failed, but removed locally:", err);
      }

      // Close dialog and reload
      setDeleteConfirm(null);
      setToastMessage("Salesman removed successfully!");
      setShowToast(true);
      await loadSalesmen();
    } catch (err) {
      alert("Error deleting salesman: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset salesman password
  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      // Update password in localStorage
      const storedUsers = localStorage.getItem("salesTracker_users");
      const allUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
      const updatedUsers = allUsers.map((u) =>
        u.salesmanId === resetPasswordModal.salesmanId
          ? { ...u, password: newPassword }
          : u,
      );
      localStorage.setItem("salesTracker_users", JSON.stringify(updatedUsers));

      // Try to update in backend (optional)
      try {
        await fetch(
          `${API_URL}/users/${resetPasswordModal.salesmanId}/password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          },
        );
      } catch (err) {
        console.log("Backend update failed, but updated locally:", err);
      }

      // Close modal and reload
      setResetPasswordModal(null);
      setNewPassword("");
      setToastMessage("Password reset successfully!");
      setShowToast(true);
      await loadSalesmen();
    } catch (err) {
      alert("Error resetting password: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      {showToast && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "72px",
                  marginBottom: "16px",
                  animation: "pulse 2s infinite",
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#d32f2f",
                  margin: "0 0 16px 0",
                }}
              >
                PERMANENT DELETION WARNING
              </h3>
            </div>

            {/* Salesman Info */}
            <div
              style={{
                background: "#f7f8f8",
                border: "2px solid #d5d9d9",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0f1111",
                  margin: "0 0 12px 0",
                }}
              >
                📋 Salesman Details
              </h4>
              <div style={{ fontSize: "14px", color: "#0f1111" }}>
                <p style={{ margin: "8px 0" }}>
                  <strong>Name:</strong> {deleteConfirm.name}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>ID:</strong> {deleteConfirm.salesmanId}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Username:</strong> {deleteConfirm.username}
                </p>
              </div>
            </div>

            {/* Data Statistics */}
            <div
              style={{
                background: "#fff3e0",
                border: "2px solid #ff9800",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#e65100",
                  margin: "0 0 12px 0",
                }}
              >
                📊 Data to be Deleted
              </h4>
              <div style={{ fontSize: "14px", color: "#e65100" }}>
                <p style={{ margin: "8px 0" }}>
                  <strong>Sales Records:</strong>{" "}
                  {(() => {
                    const storedSales =
                      localStorage.getItem("salesTracker_sales");
                    const allSales = storedSales ? JSON.parse(storedSales) : [];
                    return allSales.filter(
                      (s) => s.salesmanId === deleteConfirm.salesmanId,
                    ).length;
                  })()}{" "}
                  transactions
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Leave Records:</strong>{" "}
                  {(() => {
                    const storedLeaves = localStorage.getItem(
                      "salesTracker_leaves",
                    );
                    const allLeaves = storedLeaves
                      ? JSON.parse(storedLeaves)
                      : [];
                    return allLeaves.filter(
                      (l) => l.salesmanId === deleteConfirm.salesmanId,
                    ).length;
                  })()}{" "}
                  leaves
                </p>
              </div>
            </div>

            {/* Critical Warning */}
            <div
              style={{
                background: "#fff5f5",
                border: "3px solid #d32f2f",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  color: "#c53030",
                  margin: "0 0 16px 0",
                  fontWeight: "700",
                  lineHeight: "1.6",
                }}
              >
                ⚠️ This action will permanently remove the salesman and all
                associated data from the system. Please download all required
                reports before proceeding. This action cannot be undone.
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#c53030",
                  margin: "0",
                  fontWeight: "600",
                }}
              >
                The following will be PERMANENTLY DELETED:
              </p>
              <ul
                style={{
                  margin: "12px 0 0 0",
                  paddingLeft: "20px",
                  color: "#c53030",
                  fontSize: "14px",
                }}
              >
                <li>Salesman user account</li>
                <li>All sales transactions (till date)</li>
                <li>All leave applications (till date)</li>
                <li>Removal from all reports and statistics</li>
                <li>Removal from Admin Dashboard</li>
              </ul>
            </div>

            {/* Download Reports Section */}
            <div
              style={{
                background: "#e8f5e9",
                border: "2px solid #4caf50",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#2e7d32",
                  margin: "0 0 12px 0",
                }}
              >
                📥 Download Reports (Till Date)
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "#2e7d32",
                  margin: "0 0 16px 0",
                }}
              >
                Please download all reports before proceeding with deletion
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => downloadSalesmanReports(deleteConfirm)}
                  style={{
                    padding: "10px 20px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    flex: 1,
                    minWidth: "150px",
                  }}
                >
                  📥 Download All Reports
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={submitting}
                style={{
                  padding: "12px 32px",
                  background: "#f7f8f8",
                  border: "2px solid #d5d9d9",
                  borderRadius: "8px",
                  color: "#0f1111",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  flex: 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSalesman(deleteConfirm)}
                disabled={submitting}
                style={{
                  padding: "12px 32px",
                  background: "#d32f2f",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  flex: 1,
                }}
              >
                {submitting ? "Deleting..." : "⚠️ Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {resetPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "450px",
              width: "90%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f1111",
                  margin: "0 0 8px 0",
                }}
              >
                Reset Password
              </h3>
              <p style={{ fontSize: "14px", color: "#565959", margin: 0 }}>
                {resetPasswordModal.name} ({resetPasswordModal.salesmanId})
              </p>
            </div>

            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#e65100",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                ⚠️ Only Admin can reset salesman passwords. Salesmen cannot
                reset their own passwords.
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="text"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setResetPasswordModal(null);
                  setNewPassword("");
                }}
                disabled={submitting}
                style={{
                  ...styles.headerButton,
                  flex: 1,
                  padding: "10px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={resetPassword}
                disabled={submitting}
                style={{
                  ...styles.button,
                  flex: 1,
                  padding: "10px",
                }}
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Manage Team</h1>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("admin-dashboard")}
                style={styles.headerButton}
              >
                Back to Dashboard
              </button>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div className="card" style={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={styles.cardTitle}>All Salesmen ({salesmen.length})</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  ...styles.button,
                  width: "auto",
                  padding: "8px 16px",
                  background: showAddForm ? "#888" : "#d32f2f",
                }}
              >
                {showAddForm ? "Cancel" : "+ Add Salesman"}
              </button>
            </div>

            {showAddForm && (
              <div
                style={{
                  background: "#f7f8f8",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #ddd",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#0f1111",
                    margin: "0 0 16px 0",
                  }}
                >
                  Add New Salesman
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                      type="text"
                      value={newSalesman.name}
                      onChange={(e) =>
                        setNewSalesman({ ...newSalesman, name: e.target.value })
                      }
                      disabled={submitting}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                      type="text"
                      value={newSalesman.username}
                      onChange={(e) =>
                        setNewSalesman({
                          ...newSalesman,
                          username: e.target.value,
                        })
                      }
                      disabled={submitting}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                      type="password"
                      value={newSalesman.password}
                      onChange={(e) =>
                        setNewSalesman({
                          ...newSalesman,
                          password: e.target.value,
                        })
                      }
                      disabled={submitting}
                      style={styles.input}
                    />
                  </div>
                </div>
                <button
                  onClick={addSalesman}
                  disabled={submitting}
                  style={styles.button}
                >
                  {submitting ? "Adding..." : "Add Salesman"}
                </button>
              </div>
            )}

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Salesman ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Password</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesmen.map((salesman) => (
                  <tr key={salesman.id || salesman._id}>
                    <td style={styles.td}>{salesman.salesmanId}</td>
                    <td style={styles.td}>{salesman.name}</td>
                    <td style={styles.td}>{salesman.username}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          background: "#f7f8f8",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        {salesman.password}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => setResetPasswordModal(salesman)}
                          style={{
                            padding: "6px 12px",
                            background: "#ffffff",
                            border: "1px solid #1976d2",
                            borderRadius: "6px",
                            color: "#1976d2",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1976d2";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.color = "#1976d2";
                          }}
                        >
                          🔐 Reset
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(salesman)}
                          style={{
                            padding: "6px 12px",
                            background: "#ffffff",
                            border: "1px solid #d32f2f",
                            borderRadius: "6px",
                            color: "#d32f2f",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#d32f2f";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.color = "#d32f2f";
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== DOWNLOAD PRODUCTS - WITH SEARCH ===================== */
const DownloadProducts = ({ navigate, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const PAGE_SIZE = 20;

  const val = (obj, keys) =>
    keys.find((k) => obj?.[k] !== undefined)
      ? obj[keys.find((k) => obj?.[k] !== undefined)]
      : "";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setPage(1);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== SEARCH FUNCTIONALITY ===================== */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);

    if (!query || query.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = products.filter((p) => {
      const brand = String(val(p, ["brand", "Brand"]) || "").toLowerCase();
      const modelNumber = String(
        val(p, ["modelNumber", "Model ", "Model"]) || "",
      ).toLowerCase();
      const itemCode = String(
        val(p, ["itemCode", "Item Code"]) || "",
      ).toLowerCase();

      return (
        brand.includes(searchTerm) ||
        modelNumber.includes(searchTerm) ||
        itemCode.includes(searchTerm)
      );
    });

    setFilteredProducts(filtered);
  };

  /* ===================== DOWNLOAD EXCEL ===================== */
  const handleDownload = async () => {
    try {
      const res = await fetch(`${API_URL}/download-products`, {
        method: "GET",
      });

      if (!res.ok) {
        // Fallback: create CSV if backend endpoint doesn't exist
        downloadAsCSV();
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      downloadAsCSV();
    }
  };

  /* ===================== FALLBACK: DOWNLOAD AS CSV ===================== */
  const downloadAsCSV = () => {
    let csv = "Brand,Model Number,Item Code,Price\n";
    products.forEach((p) => {
      const brand = val(p, ["brand", "Brand"]);
      const model = val(p, ["modelNumber", "Model ", "Model"]);
      const itemCode = val(p, ["itemCode", "Item Code"]);
      const price = val(p, ["rspVat", " RSP+Vat ", "RSP+Vat"]);
      csv += `"${brand}","${model}","${itemCode}",${price}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <>
      <GlobalStyles />
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Download Products</h1>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("admin-dashboard")}
                style={styles.headerButton}
              >
                Back to Dashboard
              </button>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div className="card" style={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <h3 style={styles.cardTitle}>
                Product Catalog ({filteredProducts.length})
              </h3>
              <button
                onClick={handleDownload}
                style={{
                  ...styles.button,
                  width: "auto",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📥 Download Excel
              </button>
            </div>

            {/* SEARCH BAR */}
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="🔍 Search by Brand, Model Number, or Item Code..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  ...styles.input,
                  fontSize: "15px",
                  padding: "12px 16px",
                }}
              />
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : filteredProducts.length > 0 ? (
              <>
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Brand</th>
                        <th style={styles.th}>Model Number</th>
                        <th style={styles.th}>Item Code</th>
                        <th style={styles.th}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((p, idx) => (
                        <tr key={idx}>
                          <td style={styles.td}>
                            {val(p, ["brand", "Brand"])}
                          </td>
                          <td style={styles.td}>
                            {val(p, ["modelNumber", "Model ", "Model"])}
                          </td>
                          <td style={styles.td}>
                            {val(p, ["itemCode", "Item Code"])}
                          </td>
                          <td style={styles.td}>
                            {money(
                              Number(
                                val(p, ["rspVat", " RSP+Vat ", "RSP+Vat"]),
                              ),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      ...styles.headerButton,
                      opacity: page === 1 ? 0.5 : 1,
                      cursor: page === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    ◀ Previous
                  </button>
                  <span style={{ color: "#565959", fontWeight: "500" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      ...styles.headerButton,
                      opacity: page === totalPages ? 0.5 : 1,
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Next ▶
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#565959",
                }}
              >
                <p style={{ fontSize: "16px", margin: "0 0 8px 0" }}>
                  {searchQuery
                    ? `No products found for "${searchQuery}"`
                    : "No products available"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    style={{
                      ...styles.headerButton,
                      marginTop: "12px",
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== ADD SALE - FIXED ===================== */
const AddSale = ({ user, navigate, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    brand: "",
    modelNumber: "",
    itemCode: "",
    quantity: 1,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = products
      .filter((p) => {
        const brand = String(p.brand || p.Brand || "").toLowerCase();
        const itemCode = String(
          p.itemCode || p["Item Code"] || "",
        ).toLowerCase();
        const modelNumber = String(
          p.modelNumber || p["Model "] || p["Model"] || "",
        ).toLowerCase();
        const searchTerm = query.toLowerCase();
        return (
          brand.includes(searchTerm) ||
          itemCode.includes(searchTerm) ||
          modelNumber.includes(searchTerm)
        );
      })
      .slice(0, 10);
    setSearchResults(results);
  };

  const selectProduct = (product) => {
    const brand = product.brand || product.Brand || "";
    const modelNumber =
      product.modelNumber || product["Model "] || product["Model"] || "";
    const itemCode = product.itemCode || product["Item Code"] || "";
    setFormData({
      brand,
      modelNumber: String(modelNumber),
      itemCode: String(itemCode),
      quantity: formData.quantity,
    });
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!formData.brand || !formData.itemCode || !formData.quantity) {
      alert("Please fill all fields");
      return;
    }
    if (formData.quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const product = products.find(
      (p) =>
        String(p.itemCode || p["Item Code"] || "") ===
        String(formData.itemCode),
    );
    if (!product) {
      alert("Product not found. Please search and select a valid product.");
      return;
    }

    const productPrice =
      product.rspVat || product[" RSP+Vat "] || product["RSP+Vat"] || 0;
    if (!productPrice || productPrice <= 0) {
      alert("Invalid product price. Please contact administrator.");
      return;
    }

    setSubmitting(true);
    try {
      const sale = {
        salesmanId: user.salesmanId,
        salesmanName: user.name,
        brand: formData.brand,
        modelNumber: formData.modelNumber,
        itemCode: formData.itemCode,
        quantity: Number(formData.quantity),
        price: productPrice,
        date: getToday(),
        timestamp: new Date().toISOString(),
      };

      await api.addSale(sale);

      setFormData({ brand: "", modelNumber: "", itemCode: "", quantity: 1 });
      setShowToast(true);

      // Navigate after showing toast
      setTimeout(() => {
        navigate("salesman-dashboard");
      }, 1500);
    } catch (err) {
      alert("Error recording sale: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      {showToast && (
        <SuccessToast
          message="Sale recorded successfully!"
          onClose={() => setShowToast(false)}
        />
      )}

      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Add Sale</h1>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("salesman-dashboard")}
                style={styles.headerButton}
              >
                Back to Dashboard
              </button>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div
            className="card"
            style={{ ...styles.card, maxWidth: "700px", margin: "0 auto" }}
          >
            <h3 style={styles.cardTitle}>Enter Sale Details</h3>

            {products.length === 0 && (
              <div
                style={{
                  background: "#fff5f5",
                  border: "1px solid #feb2b2",
                  color: "#c53030",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                No products available. Please ask admin to upload products
                first.
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Search Product (Brand or Item Code)
              </label>
              <input
                type="text"
                placeholder="Type to search..."
                onChange={(e) => searchProducts(e.target.value)}
                disabled={submitting || products.length === 0}
                style={styles.input}
              />

              {searchResults.length > 0 && (
                <div style={styles.searchResults}>
                  {searchResults.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectProduct(p)}
                      style={styles.searchResultItem}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f7f8f8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#0f1111",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {p.brand || p.Brand}{" "}
                        {(p.modelNumber || p["Model "] || p["Model"]) &&
                          `- ${p.modelNumber || p["Model "] || p["Model"]}`}
                      </div>
                      <div style={{ fontSize: "13px", color: "#565959" }}>
                        Item Code:{" "}
                        <span style={{ fontWeight: "600", color: "#0f1111" }}>
                          {p.itemCode || p["Item Code"]}
                        </span>{" "}
                        | Price:{" "}
                        {money(p.rspVat || p[" RSP+Vat "] || p["RSP+Vat"] || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Select from search or type brand name"
                disabled={submitting}
                style={{
                  ...styles.input,
                  background: formData.brand ? "#e8f5e9" : "#ffffff",
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Model No.</label>
              <input
                type="text"
                value={formData.modelNumber}
                onChange={(e) =>
                  setFormData({ ...formData, modelNumber: e.target.value })
                }
                placeholder="Selected from product search"
                disabled={submitting}
                style={{
                  ...styles.input,
                  background: formData.modelNumber ? "#e8f5e9" : "#ffffff",
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Item Code</label>
              <input
                type="text"
                value={formData.itemCode}
                onChange={(e) =>
                  setFormData({ ...formData, itemCode: e.target.value })
                }
                placeholder="Select from search or type item code"
                disabled={submitting}
                style={{
                  ...styles.input,
                  background: formData.itemCode ? "#e8f5e9" : "#ffffff",
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                disabled={submitting}
                style={styles.input}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || products.length === 0}
              style={styles.button}
            >
              {submitting ? "Recording..." : "Record Sale"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== SALESMAN DASHBOARD - WITH CHARTS ===================== */
const SalesmanDashboard = ({ user, navigate, onLogout }) => {
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [loading, setLoading] = useState(true);

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getSales({ salesmanId: user.salesmanId });
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading sales:", err);
    } finally {
      setLoading(false);
    }
  }, [user.salesmanId]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const getDailySales = () => sales.filter((s) => s.date === selectedDate);
  const getMonthlySales = () =>
    sales.filter((s) => s.date?.slice(0, 7) === selectedDate);

  const currentSales = view === "daily" ? getDailySales() : getMonthlySales();
  const totalSales = currentSales.reduce(
    (sum, s) =>
      sum + (Number(s.totalAmount) || Number(s.quantity) * Number(s.price)),
    0,
  );

  const getSalesByBrand = () => {
    const brandMap = {};
    currentSales.forEach((s) => {
      const brand = s.brand || "Unknown";
      if (!brandMap[brand]) brandMap[brand] = { quantity: 0, total: 0 };
      brandMap[brand].quantity += Number(s.quantity) || 0;
      brandMap[brand].total +=
        Number(s.totalAmount) || Number(s.quantity) * Number(s.price);
    });
    return brandMap;
  };

  const brandSales = getSalesByBrand();

  // Prepare chart data
  const pieChartData = Object.entries(brandSales).map(([brand, data]) => ({
    name: brand,
    value: data.total,
  }));

  const barChartData = Object.entries(brandSales).map(([brand, data]) => ({
    brand: brand,
    sales: data.total,
    units: data.quantity,
  }));

  const COLORS = ["#d32f2f", "#f44336", "#e57373", "#ef5350", "#ff1744"];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>My Dashboard</h1>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => navigate("add-sale")}
                style={{ ...styles.button, width: "auto", padding: "8px 16px" }}
              >
                + Add Sale
              </button>
              <button
                onClick={() => navigate("apply-leave")}
                style={styles.headerButton}
              >
                Apply Leave
              </button>
              <div style={styles.userBadge}>
                <div style={styles.userAvatar}>{user.name?.charAt(0)}</div>
                <span style={modernStyles.userName}>{user.name}</span>
              </div>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.controlBar}>
            <div style={styles.viewToggle}>
              <button
                onClick={() => {
                  setView("daily");
                  setSelectedDate(getToday());
                }}
                style={{
                  ...styles.toggleButton,
                  ...(view === "daily" ? styles.toggleButtonActive : {}),
                }}
              >
                Daily Progress
              </button>
              <button
                onClick={() => {
                  setView("monthly");
                  setSelectedDate(getMonthYear());
                }}
                style={{
                  ...styles.toggleButton,
                  ...(view === "monthly" ? styles.toggleButtonActive : {}),
                }}
              >
                Monthly Progress
              </button>
            </div>
            <input
              type={view === "daily" ? "date" : "month"}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          <div style={styles.statsGrid}>
            <div className="stats-card" style={styles.statsCard}>
              <div style={styles.statsIcon}>💰</div>
              <div>
                <p style={styles.statsLabel}>Total Sales</p>
                <p style={styles.statsValue}>{money(totalSales)}</p>
              </div>
            </div>
            <div className="stats-card" style={styles.statsCard}>
              <div style={styles.statsIcon}>📊</div>
              <div>
                <p style={styles.statsLabel}>Transactions</p>
                <p style={styles.statsValue}>{currentSales.length}</p>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION */}
          {currentSales.length > 0 && (
            <div style={modernStyles.chartsGrid}>
              {/* Pie Chart */}
              <div style={modernStyles.chartCard}>
                <h3 style={modernStyles.chartTitle}>
                  Sales Distribution by Brand
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div style={modernStyles.chartCard}>
                <h3 style={modernStyles.chartTitle}>Sales by Brand</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip formatter={(value) => money(value)} />
                    <Legend />
                    <Bar dataKey="sales" fill="#d32f2f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>Sales by Brand</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Units Sold</th>
                  <th style={styles.th}>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(brandSales).map(([brand, data]) => (
                  <tr key={brand}>
                    <td style={styles.td}>{brand}</td>
                    <td style={styles.td}>{data.quantity}</td>
                    <td
                      style={{
                        ...styles.td,
                        color: "#d32f2f",
                        fontWeight: "600",
                      }}
                    >
                      {money(data.total)}
                    </td>
                  </tr>
                ))}
                {Object.keys(brandSales).length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ ...styles.td, textAlign: "center" }}
                    >
                      No sales recorded for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Sales</h3>
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Brand</th>
                    <th style={styles.th}>Item Code</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSales.map((sale) => (
                    <tr key={sale.timestamp || sale.itemCode}>
                      <td style={styles.td}>{formatDate(sale.date)}</td>
                      <td style={styles.td}>{sale.brand}</td>
                      <td style={styles.td}>{sale.itemCode}</td>
                      <td style={styles.td}>{sale.quantity}</td>
                      <td style={styles.td}>{money(sale.price)}</td>
                      <td
                        style={{
                          ...styles.td,
                          color: "#d32f2f",
                          fontWeight: "600",
                        }}
                      >
                        {money(
                          Number(sale.totalAmount) ||
                            Number(sale.quantity) * Number(sale.price),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== APPLY LEAVE ===================== */
const ApplyLeave = ({ user, navigate, onLogout }) => {
  const [date, setDate] = useState(getToday());
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async () => {
    if (!date || !reason) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const leave = {
        salesmanId: user.salesmanId,
        salesmanName: user.name,
        date: date,
        reason: reason,
        timestamp: new Date().toISOString(),
      };

      await api.addLeave(leave);

      setDate(getToday());
      setReason("");
      setShowToast(true);

      setTimeout(() => {
        navigate("salesman-dashboard");
      }, 1500);
    } catch (err) {
      alert("Error submitting leave: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      {showToast && (
        <SuccessToast
          message="Leave application submitted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}

      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Apply for Leave</h1>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("salesman-dashboard")}
                style={styles.headerButton}
              >
                Back to Dashboard
              </button>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div
            className="card"
            style={{ ...styles.card, maxWidth: "700px", margin: "0 auto" }}
          >
            <h3 style={styles.cardTitle}>Leave Application</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                placeholder="Enter reason for leave..."
                disabled={submitting}
                style={styles.textarea}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={styles.button}
            >
              {submitting ? "Submitting..." : "Submit Leave Application"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== ADMIN DASHBOARD - WITH CHARTS AND DOWNLOAD ===================== */
const AdminDashboard = ({ user, navigate, onLogout }) => {
  const [sales, setSales] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, leavesData, usersData] = await Promise.all([
        api.getSales(),
        api.getLeaves(),
        api.getUsers(),
      ]);
      setSales(salesData);
      setLeaves(leavesData);
      setSalesmen(usersData.filter((u) => u.role === "salesman"));
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDailySales = (date) => sales.filter((s) => s.date === date);
  const getMonthlySales = (monthYear) =>
    sales.filter((s) => s.date.startsWith(monthYear));
  const getSalesmanSales = (salesmanId, salesData) =>
    salesData.filter((s) => s.salesmanId === salesmanId);
  const calculateTotal = (salesData) =>
    salesData.reduce(
      (sum, s) => sum + (s.totalAmount || s.quantity * s.price),
      0,
    );

  const currentSales =
    view === "daily"
      ? getDailySales(selectedDate)
      : getMonthlySales(selectedDate);
  const dailyLeaves = leaves.filter((l) => l.date === selectedDate);
  const monthlyLeaves = leaves.filter((l) =>
    l.date.startsWith(selectedDate.slice(0, 7)),
  );

  const downloadReport = (salesmanId) => {
    const salesmanSales = sales.filter((s) => s.salesmanId === salesmanId);
    const salesman = salesmen.find((sm) => sm.salesmanId === salesmanId);
    let csv = "Date,Brand,Item Code,Quantity,Price,Total\n";
    salesmanSales.forEach((s) => {
      csv += `${s.date},${s.brand},${s.itemCode},${s.quantity},${s.price},${s.totalAmount || s.quantity * s.price}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${salesman?.name}_sales_report.csv`;
    a.click();
  };

  // Prepare chart data for admin
  const salesBySalesman = salesmen.map((sm) => {
    const smSales = getSalesmanSales(sm.salesmanId, currentSales);
    return {
      name: sm.name,
      sales: calculateTotal(smSales),
      transactions: smSales.length,
    };
  });

  // Get top brands performance
  const getBrandPerformance = () => {
    const brandMap = {};
    currentSales.forEach((s) => {
      const brand = s.brand || "Unknown";
      if (!brandMap[brand]) brandMap[brand] = { quantity: 0, total: 0 };
      brandMap[brand].quantity += Number(s.quantity) || 0;
      brandMap[brand].total +=
        Number(s.totalAmount) || Number(s.quantity) * Number(s.price);
    });
    return Object.entries(brandMap)
      .map(([brand, data]) => ({
        name: brand,
        value: data.total,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 brands
  };

  const topBrands = getBrandPerformance();

  // Get performer of the month (only for monthly view)
  const getPerformerOfMonth = () => {
    if (view !== "monthly") return null;

    const performanceData = salesmen.map((sm) => {
      const smSales = getSalesmanSales(sm.salesmanId, currentSales);
      return {
        salesman: sm,
        sales: calculateTotal(smSales),
        transactions: smSales.length,
      };
    });

    const topPerformer = performanceData.reduce(
      (max, current) => (current.sales > max.sales ? current : max),
      { sales: 0 },
    );

    return topPerformer.sales > 0 ? topPerformer : null;
  };

  const performerOfMonth = getPerformerOfMonth();

  const COLORS = [
    "#d32f2f",
    "#f44336",
    "#e57373",
    "#ef5350",
    "#ff1744",
    "#c62828",
    "#b71c1c",
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <div>
                <h1 style={styles.headerTitle}>HAMA Sales Tracker</h1>
                <p style={modernStyles.headerSubtitle}>Admin Dashboard</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => navigate("manage-salesmen")}
                style={styles.headerButton}
              >
                Manage Team
              </button>
              <button
                onClick={() => navigate("download-products")}
                style={styles.headerButton}
              >
                Products
              </button>
              <div style={styles.userBadge}>
                <div style={styles.userAvatar}>{user.name.charAt(0)}</div>
                <span style={modernStyles.userName}>{user.name}</span>
              </div>
              <button onClick={onLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.controlBar}>
            <div style={styles.viewToggle}>
              <button
                onClick={() => setView("daily")}
                style={{
                  ...styles.toggleButton,
                  ...(view === "daily" ? styles.toggleButtonActive : {}),
                }}
              >
                Daily View
              </button>
              <button
                onClick={() => setView("monthly")}
                style={{
                  ...styles.toggleButton,
                  ...(view === "monthly" ? styles.toggleButtonActive : {}),
                }}
              >
                Monthly View
              </button>
            </div>
            <input
              type={view === "daily" ? "date" : "month"}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          <div style={styles.statsGrid}>
            <div className="stats-card" style={styles.statsCard}>
              <div style={styles.statsIcon}>💰</div>
              <div>
                <p style={styles.statsLabel}>Total Sales</p>
                <p style={styles.statsValue}>
                  {money(calculateTotal(currentSales))}
                </p>
              </div>
            </div>
            <div className="stats-card" style={styles.statsCard}>
              <div style={styles.statsIcon}>📊</div>
              <div>
                <p style={styles.statsLabel}>Transactions</p>
                <p style={styles.statsValue}>{currentSales.length}</p>
              </div>
            </div>
            <div className="stats-card" style={styles.statsCard}>
              <div style={styles.statsIcon}>👥</div>
              <div>
                <p style={styles.statsLabel}>Active Salesmen</p>
                <p style={styles.statsValue}>{salesmen.length}</p>
              </div>
            </div>
            {view === "daily" ? (
              <div className="stats-card" style={styles.statsCard}>
                <div style={styles.statsIcon}>🏖️</div>
                <div>
                  <p style={styles.statsLabel}>On Leave Today</p>
                  <p style={styles.statsValue}>{dailyLeaves.length}</p>
                </div>
              </div>
            ) : performerOfMonth && performerOfMonth.sales > 0 ? (
              <div
                className="stats-card"
                style={{
                  ...styles.statsCard,
                  background:
                    "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
                  color: "white",
                }}
              >
                <div style={{ ...styles.statsIcon, fontSize: "48px" }}>🏆</div>
                <div>
                  <p
                    style={{
                      ...styles.statsLabel,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Top Performer
                  </p>
                  <p
                    style={{
                      ...styles.statsValue,
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {performerOfMonth.salesman.name}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.9)",
                      margin: "4px 0 0 0",
                      fontWeight: "600",
                    }}
                  >
                    {money(performerOfMonth.sales)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="stats-card" style={styles.statsCard}>
                <div style={styles.statsIcon}>🏖️</div>
                <div>
                  <p style={styles.statsLabel}>Total Leaves</p>
                  <p style={styles.statsValue}>{monthlyLeaves.length}</p>
                </div>
              </div>
            )}
          </div>

          {/* ADMIN CHARTS SECTION */}
          {currentSales.length > 0 && (
            <div style={modernStyles.chartsGrid}>
              {/* Top Brand Performance - Pie Chart */}
              <div style={modernStyles.chartCard}>
                <h3 style={modernStyles.chartTitle}>
                  Top Brand Performance
                  <span style={modernStyles.chartSubtitle}>
                    Top 5 Brands by Revenue
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topBrands}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topBrands.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Employee Performance - Bar Chart */}
              <div style={modernStyles.chartCard}>
                <h3 style={modernStyles.chartTitle}>
                  Employee Performance
                  <span style={modernStyles.chartSubtitle}>
                    Sales Comparison
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesBySalesman}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => money(value)} />
                    <Legend />
                    <Bar dataKey="sales" fill="#d32f2f" name="Total Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Brands Table */}
          {topBrands.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Top Performing Brands</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Rank</th>
                    <th style={styles.th}>Brand</th>
                    <th style={styles.th}>Units Sold</th>
                    <th style={styles.th}>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topBrands.map((brand, idx) => (
                    <tr key={brand.name}>
                      <td style={styles.td}>
                        <span
                          style={{
                            fontWeight: "700",
                            fontSize: "18px",
                            color: idx === 0 ? "#d32f2f" : "#565959",
                          }}
                        >
                          {idx === 0
                            ? "🥇"
                            : idx === 1
                              ? "🥈"
                              : idx === 2
                                ? "🥉"
                                : `#${idx + 1}`}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {brand.name}
                      </td>
                      <td style={styles.td}>{brand.quantity}</td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "700",
                          color: "#d32f2f",
                        }}
                      >
                        {money(brand.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === "daily" && dailyLeaves.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Salesmen on Leave Today</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Salesman</th>
                    <th style={styles.th}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyLeaves.map((leave, idx) => {
                    const salesman = salesmen.find(
                      (s) => s.salesmanId === leave.salesmanId,
                    );
                    return (
                      <tr key={idx}>
                        <td style={styles.td}>
                          {salesman?.name || leave.salesmanName}
                        </td>
                        <td style={styles.td}>{leave.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {view === "monthly" && monthlyLeaves.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>
                Monthly Leave Report ({monthlyLeaves.length} total)
              </h3>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Salesman</th>
                      <th style={styles.th}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyLeaves.map((leave, idx) => {
                      const salesman = salesmen.find(
                        (s) => s.salesmanId === leave.salesmanId,
                      );
                      return (
                        <tr key={idx}>
                          <td style={styles.td}>{formatDate(leave.date)}</td>
                          <td style={styles.td}>
                            {salesman?.name || leave.salesmanName}
                          </td>
                          <td style={styles.td}>{leave.reason}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>
              Sales by Salesman (
              {view === "daily" ? formatDate(selectedDate) : selectedDate})
            </h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Salesman</th>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Transactions</th>
                  <th style={styles.th}>Total Sales</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesmen.map((salesman) => {
                  const salesmanSales = getSalesmanSales(
                    salesman.salesmanId,
                    currentSales,
                  );
                  const total = calculateTotal(salesmanSales);
                  return (
                    <tr key={salesman.id || salesman._id}>
                      <td style={styles.td}>{salesman.name}</td>
                      <td style={styles.td}>{salesman.salesmanId}</td>
                      <td style={styles.td}>{salesmanSales.length}</td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "700",
                          color: "#d32f2f",
                        }}
                      >
                        {money(total)}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => downloadReport(salesman.salesmanId)}
                          style={styles.actionButton}
                        >
                          Download Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

/* ===================== ROOT APP ===================== */
export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("login");

  const doLogin = (u) => {
    setUser(u);
    setRoute(u.role === "admin" ? "admin-dashboard" : "salesman-dashboard");
  };

  const doLogout = () => {
    setUser(null);
    setRoute("login");
  };

  const navigate = (r) => setRoute(r);

  if (!user) return <LoginPage onLogin={doLogin} />;
  if (route === "admin-dashboard")
    return (
      <AdminDashboard user={user} navigate={navigate} onLogout={doLogout} />
    );
  if (route === "manage-salesmen")
    return <ManageSalesmen navigate={navigate} onLogout={doLogout} />;
  if (route === "download-products")
    return <DownloadProducts navigate={navigate} onLogout={doLogout} />;
  if (route === "salesman-dashboard")
    return (
      <SalesmanDashboard user={user} navigate={navigate} onLogout={doLogout} />
    );
  if (route === "add-sale")
    return <AddSale user={user} navigate={navigate} onLogout={doLogout} />;
  if (route === "apply-leave")
    return <ApplyLeave user={user} navigate={navigate} onLogout={doLogout} />;

  return <LoginPage onLogin={doLogin} />;
}
