import { useEffect, useState } from "react";
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

/* ===================== PROFESSIONAL AMAZON-STYLE THEME ===================== */
const theme = {
  colors: {
    primary: "#e53935", // Red
    primaryDark: "#c62828",
    primaryLight: "#ef5350",
    grey50: "#fafafa",
    grey100: "#f5f5f5",
    grey200: "#eeeeee",
    grey300: "#e0e0e0",
    grey400: "#bdbdbd",
    grey500: "#9e9e9e",
    grey600: "#757575",
    grey700: "#616161",
    grey800: "#424242",
    grey900: "#212121",
    white: "#ffffff",
    black: "#000000",
    success: "#4caf50",
    warning: "#ff9800",
    text: "#212121",
    textSecondary: "#616161",
  },
};

const modernStyles = {
  dashboardContainer: {
    minHeight: "100vh",
    background: theme.colors.grey100,
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: theme.colors.text,
  },
  header: {
    background: theme.colors.white,
    borderBottom: `1px solid ${theme.colors.grey300}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "16px" },
  logo: { height: "45px", width: "auto", objectFit: "contain" },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: theme.colors.text,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "13px",
    color: theme.colors.textSecondary,
    margin: "4px 0 0 0",
    fontWeight: "400",
  },
  headerButton: {
    padding: "10px 20px",
    background: theme.colors.white,
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    color: theme.colors.text,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    background: theme.colors.grey100,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.grey300}`,
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: theme.colors.white,
  },
  userName: { fontSize: "14px", fontWeight: "500", color: theme.colors.text },
  logoutButton: {
    padding: "10px 20px",
    background: theme.colors.primary,
    border: "none",
    borderRadius: "4px",
    color: theme.colors.white,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  mainContent: { maxWidth: "1400px", margin: "0 auto", padding: "24px 32px" },
  controlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "16px 20px",
    background: theme.colors.white,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.grey300}`,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  viewToggle: {
    display: "flex",
    gap: "0",
    background: theme.colors.grey100,
    borderRadius: "4px",
    padding: "4px",
  },
  toggleButton: {
    padding: "10px 24px",
    background: "transparent",
    border: "none",
    borderRadius: "4px",
    color: theme.colors.textSecondary,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  toggleButtonActive: {
    background: theme.colors.primary,
    color: theme.colors.white,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statsCard: {
    padding: "24px",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: theme.colors.white,
    border: `1px solid ${theme.colors.grey300}`,
    transition: "all 0.2s",
  },
  statsIcon: { fontSize: "36px" },
  statsLabel: {
    fontSize: "12px",
    color: theme.colors.textSecondary,
    margin: "0 0 8px 0",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statsValue: {
    fontSize: "28px",
    fontWeight: "600",
    color: theme.colors.text,
    margin: 0,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    background: theme.colors.white,
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: `1px solid ${theme.colors.grey300}`,
    padding: "24px",
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: theme.colors.text,
    margin: "0 0 16px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartSubtitle: {
    fontSize: "12px",
    color: theme.colors.textSecondary,
    fontWeight: "400",
  },
};

const styles = {
  loginContainer: {
    minHeight: "100vh",
    background: theme.colors.grey100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  loginCard: {
    background: theme.colors.white,
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    border: `1px solid ${theme.colors.grey300}`,
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
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: "8px",
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: "14px",
    color: theme.colors.textSecondary,
    marginBottom: "32px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    padding: "12px 24px",
    background: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  dashboardContainer: {
    minHeight: "100vh",
    background: theme.colors.grey100,
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    background: theme.colors.white,
    borderBottom: `1px solid ${theme.colors.grey300}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: theme.colors.text,
    margin: 0,
  },
  headerButton: {
    padding: "10px 20px",
    background: theme.colors.white,
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    color: theme.colors.text,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  logoutButton: {
    padding: "10px 20px",
    background: theme.colors.primary,
    border: "none",
    borderRadius: "4px",
    color: theme.colors.white,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px 32px",
  },
  card: {
    background: theme.colors.white,
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: `1px solid ${theme.colors.grey300}`,
    padding: "24px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: `2px solid ${theme.colors.grey300}`,
    fontSize: "12px",
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: theme.colors.grey50,
  },
  td: {
    padding: "12px",
    borderBottom: `1px solid ${theme.colors.grey200}`,
    fontSize: "14px",
    color: theme.colors.text,
  },
  actionButton: {
    padding: "8px 16px",
    background: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  dateInput: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.grey300}`,
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    background: theme.colors.white,
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
        font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      }
      button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      button:active {
        transform: translateY(0);
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      input:focus, textarea:focus, select:focus {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
      }
      table tr:hover {
        background: ${theme.colors.grey50};
      }
      .card:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
      background: theme.colors.grey100,
    }}
  >
    <div
      style={{
        fontSize: "16px",
        color: theme.colors.textSecondary,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: `3px solid ${theme.colors.grey300}`,
          borderTop: `3px solid ${theme.colors.primary}`,
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
        background: theme.colors.success,
        color: theme.colors.white,
        padding: "16px 24px",
        borderRadius: "4px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "slideIn 0.3s ease",
      }}
    >
      <span style={{ fontSize: "20px" }}>✓</span>
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

  const handleDeleteSalesman = async (salesmanId, salesmanName) => {
    if (
      !confirm(
        `Are you sure you want to delete ${salesmanName}?\n\nThis will also delete all their sales and leave records. This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await api.deleteUser(salesmanId);
      alert(`${salesmanName} has been deleted successfully!`);
      loadSalesmen();
    } catch (err) {
      alert("Error deleting salesman: " + err.message);
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
          <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                ...styles.button,
                width: "auto",
              }}
            >
              {showForm ? "Cancel" : "Add New Salesman"}
            </button>
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              style={{
                ...styles.button,
                width: "auto",
                background: theme.colors.grey600,
              }}
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
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Salesman ID</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesmen.map((sm) => (
                    <tr key={sm.id || sm._id}>
                      <td style={styles.td}>{sm.name}</td>
                      <td style={styles.td}>{sm.username}</td>
                      <td style={styles.td}>{sm.salesmanId}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() =>
                            handleDeleteSalesman(sm.salesmanId, sm.name)
                          }
                          style={{
                            ...styles.actionButton,
                            background: theme.colors.grey700,
                          }}
                        >
                          Delete
                        </button>
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

/* ===================== DOWNLOAD PRODUCTS ===================== */
const DownloadProducts = ({ navigate, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) =>
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.itemCode.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const downloadCSV = () => {
    let csv = "Brand,Item Code,Price\n";
    filteredProducts.forEach((p) => {
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
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={downloadCSV}
              style={{
                ...styles.button,
                width: "auto",
              }}
            >
              Download CSV
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand or item code..."
              style={{
                ...styles.input,
                flex: 1,
                maxWidth: "400px",
              }}
            />
          </div>

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>
              {searchTerm
                ? `Search Results (${filteredProducts.length} of ${products.length} items)`
                : `All Products (${products.length} items)`}
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
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{p.brand}</td>
                        <td style={styles.td}>{p.itemCode}</td>
                        <td style={styles.td}>{money(p.price)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          ...styles.td,
                          textAlign: "center",
                          color: theme.colors.textSecondary,
                          padding: "40px",
                        }}
                      >
                        No products found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
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

  useEffect(() => {
    refreshLeaves();
  }, [view, selectedDate]);

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

  const refreshLeaves = async () => {
    try {
      const leavesData = await api.getLeaves({ salesmanId: user.salesmanId });
      setLeaves(leavesData);
    } catch (err) {
      console.error("Error refreshing leaves:", err);
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
                  <div
                    style={{
                      fontSize: "11px",
                      color: theme.colors.textSecondary,
                    }}
                  >
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

        <div style={modernStyles.mainContent}>
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
              style={{
                ...modernStyles.dateInput,
                padding: "10px 16px",
                fontSize: "14px",
                border: `1px solid ${theme.colors.grey300}`,
                borderRadius: "4px",
              }}
            />
          </div>

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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.grey300}
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => money(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                    name="Sales (AED)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
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
                background: theme.colors.warning,
              }}
            >
              Apply for Leave
            </button>
          </div>

          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>
              Sales (
              {view === "daily" ? formatDate(selectedDate) : selectedDate})
            </h3>
            {currentSales.length === 0 ? (
              <p
                style={{
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                No sales recorded for this {view === "daily" ? "day" : "month"}
              </p>
            ) : (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "auto",
                }}
              >
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
                            fontWeight: "600",
                            color: theme.colors.primary,
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

/* ===================== DROPDOWN ITEM COMPONENT ===================== */
const DropdownItem = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "12px",
        cursor: "pointer",
        borderBottom: `1px solid ${theme.colors.grey200}`,
        background: isHovered ? theme.colors.grey50 : theme.colors.white,
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          fontWeight: "600",
          fontSize: "14px",
          color: theme.colors.text,
        }}
      >
        {product.itemCode}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: theme.colors.textSecondary,
          marginTop: "4px",
        }}
      >
        {product.brand} • {money(product.price)}
      </div>
    </div>
  );
};

/* ===================== ADD SALE ===================== */
const AddSale = ({ user, navigate, onLogout }) => {
  const [date, setDate] = useState(getToday());
  const [brand, setBrand] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemCodeSearch, setItemCodeSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        // Filter out any invalid products
        const validProducts = (data || []).filter(
          (p) =>
            p &&
            typeof p === "object" &&
            p.itemCode &&
            p.brand &&
            p.price !== undefined,
        );
        console.log(
          `Loaded ${validProducts.length} valid products out of ${(data || []).length} total`,
        );
        setProducts(validProducts);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
        alert("Could not load products. Please refresh the page.");
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (brand) {
      const filtered = products.filter(
        (p) => p?.brand?.toLowerCase() === brand?.toLowerCase(),
      );
      setFilteredProducts(filtered || []);
    } else {
      setFilteredProducts([]);
    }
  }, [brand, products]);

  useEffect(() => {
    if (itemCodeSearch && itemCodeSearch.length > 0) {
      const searchResults = products.filter((p) => {
        if (!p || !p.itemCode) return false;
        try {
          return p.itemCode
            .toLowerCase()
            .includes(itemCodeSearch.toLowerCase());
        } catch (err) {
          console.error("Error filtering product:", p, err);
          return false;
        }
      });
      setFilteredProducts(searchResults || []);
      setShowDropdown(true);
    } else if (!itemCodeSearch) {
      setShowDropdown(false);
      if (brand) {
        const filtered = products.filter((p) => {
          if (!p || !p.brand) return false;
          try {
            return p.brand.toLowerCase() === brand.toLowerCase();
          } catch (err) {
            console.error("Error filtering by brand:", p, err);
            return false;
          }
        });
        setFilteredProducts(filtered || []);
      }
    }
  }, [itemCodeSearch, products, brand]);

  const handleItemCodeSelect = (p) => {
    if (!p) {
      console.error("Invalid product selected");
      return;
    }
    setItemCode(p.itemCode || "");
    setItemCodeSearch(p.itemCode || "");
    setBrand(p.brand || "");
    setPrice(Number(p.price) || 0);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    console.log("🟢 ADD SALE - handleSubmit called");
    console.log("🟢 Current values:", {
      date,
      brand,
      itemCode,
      quantity,
      price,
    });

    if (!date || !brand || !itemCode || !quantity || !price) {
      console.log("🔴 Validation failed - missing fields");
      alert("Please fill all fields");
      return;
    }

    console.log("✅ Validation passed");
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

      console.log("🟢 About to call api.addSale with:", sale);
      const result = await api.addSale(sale);
      console.log("✅ api.addSale returned:", result);

      setBrand("");
      setItemCode("");
      setItemCodeSearch("");
      setQuantity("");
      setPrice("");
      setShowToast(true);

      setTimeout(() => navigate("salesman-dashboard"), 1500);
    } catch (err) {
      console.error("🔴 Error in handleSubmit:", err);
      alert("Error adding sale: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueBrands = [
    ...new Set(products.filter((p) => p && p.brand).map((p) => p.brand)),
  ].sort();

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
                  setItemCodeSearch("");
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
              <label style={styles.label}>Item Code (Type to search)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={itemCodeSearch}
                  onChange={(e) => {
                    setItemCodeSearch(e.target.value);
                    if (e.target.value && e.target.value.length > 0) {
                      setShowDropdown(true);
                    } else {
                      setShowDropdown(false);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding dropdown to allow click to register
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  disabled={submitting}
                  style={styles.input}
                  placeholder="Type to search item code..."
                />
                {showDropdown && filteredProducts.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      background: theme.colors.white,
                      border: `1px solid ${theme.colors.grey300}`,
                      borderRadius: "4px",
                      marginTop: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 1000,
                    }}
                  >
                    {filteredProducts.slice(0, 10).map((p, idx) => (
                      <DropdownItem
                        key={`${p.itemCode}-${idx}`}
                        product={p}
                        onClick={() => handleItemCodeSelect(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
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
                style={{
                  ...styles.input,
                  background: theme.colors.grey100,
                  cursor: "not-allowed",
                }}
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
                style={{
                  ...styles.input,
                  background: theme.colors.grey100,
                  cursor: "not-allowed",
                  fontWeight: "600",
                  color: theme.colors.primary,
                }}
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
    console.log("🟢 APPLY LEAVE - handleSubmit called");
    console.log("🟢 Current values:", { date, reason });

    if (!date || !reason) {
      console.log("🔴 Validation failed - missing fields");
      alert("Please fill all fields");
      return;
    }

    console.log("✅ Validation passed");
    setSubmitting(true);

    try {
      const leave = {
        salesmanId: user.salesmanId,
        salesmanName: user.name,
        date: date,
        reason: reason,
        timestamp: new Date().toISOString(),
      };

      console.log("🟢 About to call api.addLeave with:", leave);
      const result = await api.addLeave(leave);
      console.log("✅ api.addLeave returned:", result);

      setDate(getToday());
      setReason("");
      setShowToast(true);

      setTimeout(() => navigate("salesman-dashboard"), 1500);
    } catch (err) {
      console.error("🔴 Error in handleSubmit:", err);
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

/* ===================== ADMIN DASHBOARD ===================== */
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

  const salesBySalesman = salesmen.map((sm) => {
    const smSales = getSalesmanSales(sm.salesmanId, currentSales);
    return {
      name: sm.name,
      sales: calculateTotal(smSales),
      transactions: smSales.length,
    };
  });

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
      .slice(0, 5);
  };

  const topBrands = getBrandPerformance();

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
    theme.colors.primary,
    theme.colors.primaryLight,
    theme.colors.grey600,
    theme.colors.grey500,
    theme.colors.grey400,
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
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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
              style={{
                ...modernStyles.dateInput,
                padding: "10px 16px",
                fontSize: "14px",
                border: `1px solid ${theme.colors.grey300}`,
                borderRadius: "4px",
              }}
            />
          </div>

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

          {performerOfMonth && (
            <div
              style={{
                ...modernStyles.statsCard,
                marginBottom: "24px",
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                color: theme.colors.white,
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
                    color: theme.colors.white,
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

          {view === "monthly" && (
            <div style={modernStyles.chartsGrid}>
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

              <div style={modernStyles.chartCard}>
                <h3 style={modernStyles.chartTitle}>
                  Employee Performance
                  <span style={modernStyles.chartSubtitle}>
                    Sales Comparison
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesBySalesman}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.colors.grey300}
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => money(value)} />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      fill={theme.colors.primary}
                      name="Total Sales"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {topBrands.length > 0 && (
            <div className="card" style={styles.card}>
              <h3 style={styles.cardTitle}>Top Performing Brands</h3>
              <div style={{ overflowX: "auto" }}>
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
                              fontWeight: "600",
                              fontSize: "16px",
                              color:
                                idx === 0
                                  ? theme.colors.primary
                                  : theme.colors.textSecondary,
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
                            fontWeight: "600",
                            color: theme.colors.primary,
                          }}
                        >
                          {money(brand.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            <div style={{ overflowX: "auto" }}>
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
                            fontWeight: "600",
                            color: theme.colors.primary,
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
