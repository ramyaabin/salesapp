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
    } catch (error) {
      console.error("API Error:", error);
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
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
          const err = await res.json();
          throw new Error(err.error || "Failed to add user");
        }
        return { success: true, offline: true };
      }

      return await res.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: true, offline: true };
    }
  },

  /* -------------------- AUTH -------------------- */
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

      const users = await this.getUsers();
      const found = users.find(
        (u) => u.username === username && u.password === password,
      );

      if (!found) throw new Error("Invalid username or password");
      return { success: true, user: found };
    }
  },

  /* -------------------- ADMIN -------------------- */
  async resetPassword(data) {
    const res = await fetch(
      `${API_URL}/api/users/${data.salesmanId}/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Password reset failed");
    }

    return res.json();
  },

  /* -------------------- PRODUCTS (FIXED) -------------------- */
  async getProducts() {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");

      let products = await res.json();

      products = products.map((p) => {
        // normalize keys (trim spaces)
        const n = {};
        Object.keys(p).forEach((k) => {
          n[k.trim()] = p[k];
        });

        return {
          _id: n._id,
          brand: n.Brand || n.brand || "",
          itemCode: n["Item Code"] || "",
          description: n["Item Description"] || "",
          price:
            Number(n["RSP+Vat"] ?? n["RSP"] ?? n["Cost"] ?? n["Cost "] ?? 0) ||
            0,
        };
      });

      localStorage.setItem("salesTracker_products", JSON.stringify(products));
      return products;
    } catch (error) {
      console.error("API Error:", error);
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
      localStorage.setItem("salesTracker_sales", JSON.stringify(sales));
      return sales;
    } catch (error) {
      console.error("API Error:", error);

      let sales = JSON.parse(
        localStorage.getItem("salesTracker_sales") || "[]",
      );

      if (query.salesmanId)
        sales = sales.filter((s) => s.salesmanId === query.salesmanId);
      if (query.date) sales = sales.filter((s) => s.date === query.date);
      if (query.month)
        sales = sales.filter((s) => s.date?.startsWith(query.month));

      return sales;
    }
  },

  async addSale(saleData) {
    try {
      const res = await fetch(`${API_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      const sales = JSON.parse(
        localStorage.getItem("salesTracker_sales") || "[]",
      );
      sales.push(result.sale || saleData);
      localStorage.setItem("salesTracker_sales", JSON.stringify(sales));

      return { success: true, synced: true };
    } catch (error) {
      console.error("API Error:", error);

      const sales = JSON.parse(
        localStorage.getItem("salesTracker_sales") || "[]",
      );
      sales.push(saleData);
      localStorage.setItem("salesTracker_sales", JSON.stringify(sales));

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
    } catch (error) {
      console.error("API Error:", error);

      let leaves = JSON.parse(
        localStorage.getItem("salesTracker_leaves") || "[]",
      );

      if (query.salesmanId)
        leaves = leaves.filter((l) => l.salesmanId === query.salesmanId);
      if (query.date) leaves = leaves.filter((l) => l.date === query.date);

      return leaves;
    }
  },

  async addLeave(leaveData) {
    try {
      const res = await fetch(`${API_URL}/api/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData),
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      const leaves = JSON.parse(
        localStorage.getItem("salesTracker_leaves") || "[]",
      );
      leaves.push(result.leave || leaveData);
      localStorage.setItem("salesTracker_leaves", JSON.stringify(leaves));

      return { success: true, synced: true };
    } catch (error) {
      console.error("API Error:", error);

      const leaves = JSON.parse(
        localStorage.getItem("salesTracker_leaves") || "[]",
      );
      leaves.push(leaveData);
      localStorage.setItem("salesTracker_leaves", JSON.stringify(leaves));

      return { success: true, offline: true };
    }
  },
};

export default api;
