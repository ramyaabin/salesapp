const API_URL = import.meta.env.VITE_API_URL;

const api = {
  /* -------------------- USERS -------------------- */
  async getUsers() {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const users = await res.json();
      localStorage.setItem("salesTracker_users", JSON.stringify(users));
      return users;
    } catch (_error) {
      // Using _error to indicate intentionally unused
      console.error("API Error:", _error);
      const stored = localStorage.getItem("salesTracker_users");
      return stored ? JSON.parse(stored) : [];
    }
  },

  async addUser(userData) {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to add user");
        } else {
          console.warn("Backend returned HTML error page");
          return { success: true, offline: true };
        }
      }

      return await res.json();
    } catch (_error) {
      console.error("API Error:", _error);
      return { success: true, offline: true };
    }
  },

  async login(username, password) {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      return await res.json();
    } catch (err) {
      console.error("API Error:", err);
      // fallback to localStorage users
      const users = await this.getUsers();
      const found = users.find(
        (u) => u.username === username && u.password === password,
      );
      if (!found) throw new Error("Invalid username or password");
      return { success: true, user: found };
    }
  },

  /* -------------------- PRODUCTS -------------------- */
  async getProducts() {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const products = await res.json();
      localStorage.setItem("salesTracker_products", JSON.stringify(products));
      return products;
    } catch (_error) {
      console.error("API Error:", _error);
      const stored = localStorage.getItem("salesTracker_products");
      return stored ? JSON.parse(stored) : [];
    }
  },

  /* -------------------- SALES -------------------- */
  async getSales(query = {}) {
    try {
      const params = new URLSearchParams(query);
      const res = await fetch(`${API_URL}/api/sales?${params}`);
      if (!res.ok) throw new Error("Failed to fetch sales");
      const sales = await res.json();

      const stored = localStorage.getItem("salesTracker_sales");
      const localSales = stored ? JSON.parse(stored) : [];
      const merged = [...localSales];

      sales.forEach((s) => {
        if (!merged.find((m) => m.timestamp === s.timestamp)) merged.push(s);
      });

      localStorage.setItem("salesTracker_sales", JSON.stringify(merged));
      return sales;
    } catch (_error) {
      console.error("API Error:", _error);
      let sales = localStorage.getItem("salesTracker_sales")
        ? JSON.parse(localStorage.getItem("salesTracker_sales"))
        : [];

      if (query.salesmanId)
        sales = sales.filter((s) => s.salesmanId === query.salesmanId);
      if (query.date) sales = sales.filter((s) => s.date === query.date);
      if (query.month)
        sales = sales.filter((s) => s.date.startsWith(query.month));

      return sales;
    }
  },

  async addSale(saleData) {
    // Save locally first
    const stored = localStorage.getItem("salesTracker_sales");
    const sales = stored ? JSON.parse(stored) : [];
    sales.push(saleData);
    localStorage.setItem("salesTracker_sales", JSON.stringify(sales));

    try {
      const res = await fetch(`${API_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) throw new Error("Server error");
      return { success: true, synced: true };
    } catch (_error) {
      console.error("API Error:", _error);
      return { success: true, offline: true };
    }
  },

  /* -------------------- LEAVES -------------------- */
  async getLeaves(query = {}) {
    try {
      const params = new URLSearchParams(query);
      const res = await fetch(`${API_URL}/api/leaves?${params}`);
      if (!res.ok) throw new Error("Failed to fetch leaves");
      const leaves = await res.json();
      localStorage.setItem("salesTracker_leaves", JSON.stringify(leaves));
      return leaves;
    } catch (_error) {
      console.error("API Error:", _error);
      let leaves = localStorage.getItem("salesTracker_leaves")
        ? JSON.parse(localStorage.getItem("salesTracker_leaves"))
        : [];

      if (query.salesmanId)
        leaves = leaves.filter((l) => l.salesmanId === query.salesmanId);
      if (query.date) leaves = leaves.filter((l) => l.date === query.date);

      return leaves;
    }
  },

  async addLeave(leaveData) {
    const stored = localStorage.getItem("salesTracker_leaves");
    const leaves = stored ? JSON.parse(stored) : [];
    leaves.push(leaveData);
    localStorage.setItem("salesTracker_leaves", JSON.stringify(leaves));

    try {
      const res = await fetch(`${API_URL}/api/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData),
      });

      if (!res.ok) throw new Error("Server error");
      return { success: true, synced: true };
    } catch (_error) {
      console.error("API Error:", _error);
      return { success: true, offline: true };
    }
  },
};

export default api;
