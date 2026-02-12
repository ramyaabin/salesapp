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
  logoContainer: {
    textAlign: "center",
    marginBottom: "24px",
  },
  logo: {
    height: "70px",
    width: "auto",
    objectFit: "contain",
  },
  loginTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#232f3e",
    marginBottom: "8px",
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: "14px",
    color: "#565959",
    marginBottom: "32px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f1111",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  dashboardContainer: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
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
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#232f3e",
    margin: 0,
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
  mainContent: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "24px 40px",
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
    color: "#232f3e",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    fontSize: "13px",
    fontWeight: "600",
    color: "#565959",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
    color: "#232f3e",
  },
  actionButton: {
    padding: "6px 12px",
    background: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  dateInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d5d9d9",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    background: "white",
    boxSizing: "border-box",
  },
};

/* ===================== GLOBAL STYLES ===================== */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Amazon Ember', 'Helvetica Neue', Arial, sans-serif;
      }
      button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      button:active {
        transform: translateY(0);
      }
      input:focus, textarea:focus, select:focus {
        border-color: #d32f2f;
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
      }
      table tr:hover {
        background: #f8f9fa;
      }
      .card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ===================== LOADING SPINNER ===================== */
const LoadingSpinner = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f9fa",
    }}
  >
    <div
      style={{
        fontSize: "18px",
        color: "#565959",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #f0f0f0",
          borderTop: "3px solid #d32f2f",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      Loading...
    </div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
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
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "slideIn 0.3s ease",
      }}
    >
      <span style={{ fontSize: "24px" }}>✓</span>
      <span style={{ fontSize: "14px", fontWeight: "500" }}>{message}</span>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

/* ===================== LOGIN PAGE ===================== */
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(username, password);
      if (result.success) {
        onLogin(result.user);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.logoContainer}>
            <img src={hamaLogo} alt="HAMA" style={styles.logo} />
          </div>
          <h2 style={styles.loginTitle}>HAMA Sales Tracker</h2>
          <p style={styles.loginSubtitle}>Sign in to your account</p>
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                style={styles.input}
                placeholder="Enter your username"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

/* ===================== MANAGE SALESMEN ===================== */
const ManageSalesmen = ({ navigate, onLogout }) => {
  const [salesmen, setSalesmen] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    salesmanId: "",
  });
  const [resetData, setResetData] = useState({ salesmanId: "", password: "" });
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleAddSalesman = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const userData = {
        ...formData,
        role: "salesman",
        salesmanId:
          formData.salesmanId ||
          `SM${String(salesmen.length + 1).padStart(3, "0")}`,
      };

      await api.addUser(userData);
      alert("Salesman added successfully!");
      setFormData({ name: "", username: "", password: "", salesmanId: "" });
      setShowForm(false);
      loadSalesmen();
    } catch (err) {
      alert("Error adding salesman: " + err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetData.salesmanId || !resetData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.resetPassword(resetData);
      alert("Password reset successfully!");
      setResetData({ salesmanId: "", password: "" });
      setShowResetForm(false);
    } catch (err) {
      alert("Error resetting password: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Manage Salesmen</h1>
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
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                ...styles.button,
                width: "auto",
                marginRight: "10px",
              }}
            >
              {showForm ? "Cancel" : "Add New Salesman"}
            </button>
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              style={{ ...styles.button, width: "auto" }}
            >
              {showResetForm ? "Cancel" : "Reset Password"}
            </button>
          </div>

          {showForm && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Add New Salesman</h3>
              <form onSubmit={handleAddSalesman}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Full Name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Login username"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Login password"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Salesman ID (optional, auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.salesmanId}
                    onChange={(e) =>
                      setFormData({ ...formData, salesmanId: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., SM001"
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Add Salesman
                </button>
              </form>
            </div>
          )}

          {showResetForm && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Reset Password</h3>
              <form onSubmit={handleResetPassword}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Salesman ID</label>
                  <select
                    value={resetData.salesmanId}
                    onChange={(e) =>
                      setResetData({ ...resetData, salesmanId: e.target.value })
                    }
                    style={styles.select}
                  >
                    <option value="">Select Salesman</option>
                    {salesmen.map((sm) => (
                      <option key={sm.id || sm._id} value={sm.salesmanId}>
                        {sm.name} ({sm.salesmanId})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    value={resetData.password}
                    onChange={(e) =>
                      setResetData({ ...resetData, password: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Enter new password"
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Reset Password
                </button>
              </form>
            </div>
          )}

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>Current Salesmen</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Salesman ID</th>
                </tr>
              </thead>
              <tbody>
                {salesmen.map((sm) => (
                  <tr key={sm.id || sm._id}>
                    <td style={styles.td}>{sm.name}</td>
                    <td style={styles.td}>{sm.username}</td>
                    <td style={styles.td}>{sm.salesmanId}</td>
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

/* ===================== DOWNLOAD PRODUCTS ===================== */
const DownloadProducts = ({ navigate, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

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

  const downloadCSV = () => {
    let csv = "Brand,Item Code,Price\n";
    products.forEach((p) => {
      csv += `${p.brand},${p.itemCode},${p.price}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Product List</h1>
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
          <div style={{ marginBottom: "20px" }}>
            <button onClick={downloadCSV} style={styles.button}>
              Download CSV
            </button>
          </div>

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>
              All Products ({products.length} items)
            </h3>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Brand</th>
                    <th style={styles.th}>Item Code</th>
                    <th style={styles.th}>Price (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{p.brand}</td>
                      <td style={styles.td}>{p.itemCode}</td>
                      <td style={styles.td}>{money(p.price)}</td>
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

/* ===================== SALESMAN DASHBOARD ===================== */
const SalesmanDashboard = ({ user, navigate, onLogout }) => {
  const [sales, setSales] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, leavesData] = await Promise.all([
        api.getSales({ salesmanId: user.salesmanId }),
        api.getLeaves({ salesmanId: user.salesmanId }),
      ]);
      setSales(salesData);
      setLeaves(leavesData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDailySales = (date) => sales.filter((s) => s.date === date);
  const getMonthlySales = (monthYear) =>
    sales.filter((s) => s.date.startsWith(monthYear));
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

  // Prepare chart data for daily trend
  const getDailyTrendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const daySales = sales.filter((s) => s.date === dateStr);
      const total = calculateTotal(daySales);
      last7Days.push({
        date: date.toLocaleDateString("en-AE", {
          month: "short",
          day: "numeric",
        }),
        sales: total,
      });
    }
    return last7Days;
  };

  const dailyTrendData = getDailyTrendData();

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <GlobalStyles />
      <div style={modernStyles.dashboardContainer}>
        {/* Header */}
        <div style={modernStyles.header}>
          <div style={modernStyles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <div>
                <h1 style={modernStyles.headerTitle}>HAMA Sales Tracker</h1>
                <p style={modernStyles.headerSubtitle}>Salesman Dashboard</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={modernStyles.userBadge}>
                <div style={modernStyles.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={modernStyles.userName}>{user.name}</div>
                  <div style={{ fontSize: "11px", color: "#565959" }}>
                    {user.salesmanId}
                  </div>
                </div>
              </div>
              <button onClick={onLogout} style={modernStyles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={modernStyles.mainContent}>
          {/* Control Bar */}
          <div style={modernStyles.controlBar}>
            <div style={modernStyles.viewToggle}>
              <button
                onClick={() => {
                  setView("daily");
                  setSelectedDate(getToday());
                }}
                style={{
                  ...modernStyles.toggleButton,
                  ...(view === "daily" ? modernStyles.toggleButtonActive : {}),
                }}
              >
                Daily View
              </button>
              <button
                onClick={() => {
                  setView("monthly");
                  setSelectedDate(getMonthYear());
                }}
                style={{
                  ...modernStyles.toggleButton,
                  ...(view === "monthly"
                    ? modernStyles.toggleButtonActive
                    : {}),
                }}
              >
                Monthly View
              </button>
            </div>
            <input
              type={view === "daily" ? "date" : "month"}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={modernStyles.dateInput}
            />
          </div>

          {/* Stats Cards */}
          <div style={modernStyles.statsGrid}>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>📊</div>
              <div>
                <p style={modernStyles.statsLabel}>Total Sales</p>
                <h2 style={modernStyles.statsValue}>
                  {money(calculateTotal(currentSales))}
                </h2>
              </div>
            </div>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>🛍️</div>
              <div>
                <p style={modernStyles.statsLabel}>Transactions</p>
                <h2 style={modernStyles.statsValue}>{currentSales.length}</h2>
              </div>
            </div>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>📅</div>
              <div>
                <p style={modernStyles.statsLabel}>Leave Days</p>
                <h2 style={modernStyles.statsValue}>
                  {view === "daily" ? dailyLeaves.length : monthlyLeaves.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          {view === "daily" && (
            <div style={modernStyles.chartCard}>
              <h3 style={modernStyles.chartTitle}>
                Last 7 Days Sales Trend
                <span style={modernStyles.chartSubtitle}>
                  Daily performance overview
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => money(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#d32f2f"
                    strokeWidth={2}
                    name="Sales (AED)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => navigate("add-sale")}
              style={{ ...styles.button, width: "auto" }}
            >
              Add New Sale
            </button>
            <button
              onClick={() => navigate("apply-leave")}
              style={{
                ...styles.button,
                width: "auto",
                background: "#ff9800",
              }}
            >
              Apply for Leave
            </button>
          </div>

          {/* Sales Table */}
          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>
              Sales (
              {view === "daily" ? formatDate(selectedDate) : selectedDate})
            </h3>
            {currentSales.length === 0 ? (
              <p style={{ color: "#565959", textAlign: "center" }}>
                No sales recorded for this {view === "daily" ? "day" : "month"}
              </p>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
                    {currentSales.map((sale, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{formatDate(sale.date)}</td>
                        <td style={styles.td}>{sale.brand}</td>
                        <td style={styles.td}>{sale.itemCode}</td>
                        <td style={styles.td}>{sale.quantity}</td>
                        <td style={styles.td}>{money(sale.price)}</td>
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: "700",
                            color: "#d32f2f",
                          }}
                        >
                          {money(
                            sale.totalAmount || sale.quantity * sale.price,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Leave Records */}
          {view === "daily" && dailyLeaves.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Leave Today</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyLeaves.map((leave, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{formatDate(leave.date)}</td>
                      <td style={styles.td}>{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === "monthly" && monthlyLeaves.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>
                Monthly Leave Report ({monthlyLeaves.length} days)
              </h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyLeaves.map((leave, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{formatDate(leave.date)}</td>
                        <td style={styles.td}>{leave.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ===================== ADD SALE ===================== */
const AddSale = ({ user, navigate, onLogout }) => {
  const [date, setDate] = useState(getToday());
  const [brand, setBrand] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    if (brand) {
      const filtered = products.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase(),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [brand, products]);

  const handleItemCodeSelect = (e) => {
    const selectedCode = e.target.value;
    setItemCode(selectedCode);
    const product = products.find((p) => p.itemCode === selectedCode);
    if (product) {
      setPrice(product.price);
    }
  };

  const handleSubmit = async () => {
    if (!date || !brand || !itemCode || !quantity || !price) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const sale = {
        salesmanId: user.salesmanId,
        salesmanName: user.name,
        date: date,
        brand: brand,
        itemCode: itemCode,
        quantity: Number(quantity),
        price: Number(price),
        totalAmount: Number(quantity) * Number(price),
        timestamp: new Date().toISOString(),
      };

      await api.addSale(sale);

      setBrand("");
      setItemCode("");
      setQuantity("");
      setPrice("");
      setShowToast(true);

      setTimeout(() => {
        navigate("salesman-dashboard");
      }, 1500);
    } catch (err) {
      alert("Error adding sale: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort();

  return (
    <>
      <GlobalStyles />
      {showToast && (
        <SuccessToast
          message="Sale added successfully!"
          onClose={() => setShowToast(false)}
        />
      )}

      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={modernStyles.logoContainer}>
              <img src={hamaLogo} alt="HAMA" style={modernStyles.logo} />
              <h1 style={styles.headerTitle}>Add New Sale</h1>
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
            <h3 style={styles.cardTitle}>Sale Details</h3>
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
              <label style={styles.label}>Brand</label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setItemCode("");
                  setPrice("");
                }}
                disabled={submitting}
                style={styles.select}
              >
                <option value="">Select Brand</option>
                {uniqueBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Item Code</label>
              <select
                value={itemCode}
                onChange={handleItemCodeSelect}
                disabled={submitting || !brand}
                style={styles.select}
              >
                <option value="">Select Item Code</option>
                {filteredProducts.map((p) => (
                  <option key={p.itemCode} value={p.itemCode}>
                    {p.itemCode}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={submitting}
                style={styles.input}
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (AED)</label>
              <input
                type="number"
                value={price}
                disabled
                style={styles.input}
                placeholder="Auto-filled from product"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Amount</label>
              <input
                type="text"
                value={
                  quantity && price
                    ? money(Number(quantity) * Number(price))
                    : ""
                }
                disabled
                style={styles.input}
                placeholder="Calculated automatically"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={styles.button}
            >
              {submitting ? "Submitting..." : "Add Sale"}
            </button>
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

  // Refresh leave data when view or selectedDate changes
  useEffect(() => {
    refreshLeaves();
  }, [view, selectedDate]);

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

  const refreshLeaves = async () => {
    try {
      const leavesData = await api.getLeaves();
      setLeaves(leavesData);
    } catch (err) {
      console.error("Error refreshing leaves:", err);
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
              <div style={modernStyles.userBadge}>
                <div style={modernStyles.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={modernStyles.userName}>{user.name}</div>
              </div>
              <button onClick={onLogout} style={modernStyles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={modernStyles.mainContent}>
          {/* Control Bar */}
          <div style={modernStyles.controlBar}>
            <div style={modernStyles.viewToggle}>
              <button
                onClick={() => {
                  setView("daily");
                  setSelectedDate(getToday());
                }}
                style={{
                  ...modernStyles.toggleButton,
                  ...(view === "daily" ? modernStyles.toggleButtonActive : {}),
                }}
              >
                Daily View
              </button>
              <button
                onClick={() => {
                  setView("monthly");
                  setSelectedDate(getMonthYear());
                }}
                style={{
                  ...modernStyles.toggleButton,
                  ...(view === "monthly"
                    ? modernStyles.toggleButtonActive
                    : {}),
                }}
              >
                Monthly View
              </button>
            </div>
            <input
              type={view === "daily" ? "date" : "month"}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={modernStyles.dateInput}
            />
          </div>

          {/* Stats Cards */}
          <div style={modernStyles.statsGrid}>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>💰</div>
              <div>
                <p style={modernStyles.statsLabel}>Total Sales</p>
                <h2 style={modernStyles.statsValue}>
                  {money(calculateTotal(currentSales))}
                </h2>
              </div>
            </div>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>🛍️</div>
              <div>
                <p style={modernStyles.statsLabel}>Transactions</p>
                <h2 style={modernStyles.statsValue}>{currentSales.length}</h2>
              </div>
            </div>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>👥</div>
              <div>
                <p style={modernStyles.statsLabel}>Active Salesmen</p>
                <h2 style={modernStyles.statsValue}>{salesmen.length}</h2>
              </div>
            </div>
            <div style={modernStyles.statsCard}>
              <div style={modernStyles.statsIcon}>📅</div>
              <div>
                <p style={modernStyles.statsLabel}>Leaves</p>
                <h2 style={modernStyles.statsValue}>
                  {view === "daily" ? dailyLeaves.length : monthlyLeaves.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Performer of the Month - Only for Monthly View */}
          {performerOfMonth && (
            <div
              style={{
                ...modernStyles.statsCard,
                marginBottom: "24px",
                background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
                color: "white",
                padding: "32px",
              }}
            >
              <div style={{ fontSize: "48px" }}>🏆</div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    ...modernStyles.statsLabel,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Performer of the Month
                </p>
                <h2
                  style={{
                    ...modernStyles.statsValue,
                    color: "white",
                    marginBottom: "8px",
                  }}
                >
                  {performerOfMonth.salesman.name}
                </h2>
                <p style={{ fontSize: "16px", margin: 0, opacity: 0.95 }}>
                  {money(performerOfMonth.sales)} •{" "}
                  {performerOfMonth.transactions} transactions
                </p>
              </div>
            </div>
          )}

          {/* Charts - Only show in Monthly View */}
          {view === "monthly" && (
            <div style={modernStyles.chartsGrid}>
              {/* Top Brands - Pie Chart */}
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
