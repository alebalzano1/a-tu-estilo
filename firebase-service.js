// Firebase & Cloudinary Service for Hamburguesas A Tu Estilo
// Sincronización híbrida de base de datos en la nube y Sandbox local (LocalStorage)

let db = null;
let isFirebaseActive = false;

// Inicializar Firebase si las credenciales en firebase-config.js son reales y válidas
try {
    const config = window.firebaseConfig;
    if (config && config.apiKey && config.apiKey !== "TU_API_KEY_AQUÍ" && config.apiKey !== "") {
        firebase.initializeApp(config);
        db = firebase.firestore();
        isFirebaseActive = true;
        console.log("🔥 [Firebase] Conexión establecida con éxito en la nube de Hamburguesas A Tu Estilo.");
    } else {
        console.warn("⚠️ [Firebase] Corriendo en modo Local / Sandbox (LocalStorage). Modificá firebase-config.js con credenciales reales para conectar a Firestore.");
    }
} catch (error) {
    console.error("❌ [Firebase] Error crítico al inicializar Firebase:", error);
}

const FirebaseService = {
    // --- Diagnóstico ---
    isCloudActive() {
        return isFirebaseActive;
    },

    // --- AUTENTICACIÓN ---
    async login(email, password) {
        if (!isFirebaseActive) {
            console.log("🔑 [Firebase Sandbox] Autenticando localmente...");
            // Credenciales Sandbox por defecto para fácil testeo
            if ((email === "admin" || email === "admin@atuestilo.com") && password === "admin123") {
                localStorage.setItem("ate_sandbox_logged", "true");
                return true;
            }
            throw new Error("Credenciales locales incorrectas (admin / admin123)");
        }
        try {
            console.log("[Firebase] Iniciando sesión...");
            const auth = firebase.auth();
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            return await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error("[Firebase] Error en login:", error);
            throw error;
        }
    },

    async logout() {
        if (!isFirebaseActive) {
            localStorage.removeItem("ate_sandbox_logged");
            return;
        }
        try {
            console.log("[Firebase] Cerrando sesión...");
            await firebase.auth().signOut();
        } catch (error) {
            console.error("[Firebase] Error al cerrar sesión:", error);
        }
    },

    onAuth(callback) {
        if (!isFirebaseActive) {
            const isLocalLogged = localStorage.getItem("ate_sandbox_logged") === "true";
            callback(isLocalLogged ? { email: "admin@atuestilo.com", uid: "sandbox" } : null);
            return;
        }
        firebase.auth().onAuthStateChanged((user) => {
            callback(user);
        });
    },

    // --- Autosiembra (Seeding) ---
    async autoSeedDatabase(initialProducts, initialHorarios, initialPromos, initialConfig) {
        if (!isFirebaseActive) return;
        try {
            const productSnapshot = await db.collection("ate_products").limit(1).get();
            if (productSnapshot.empty) {
                console.log("🌱 [Firebase] Firestore vacío. Sembrando catálogo inicial para A Tu Estilo...");
                
                // Sembrar Productos
                for (const p of initialProducts) {
                    await db.collection("ate_products").doc(String(p.id)).set(p);
                }
                // Sembrar Horarios
                for (const h of initialHorarios) {
                    await db.collection("ate_horarios").doc(String(h.day)).set(h);
                }
                // Sembrar Promociones
                initialPromos.forEach(async (pr, index) => {
                    await db.collection("ate_promos").doc(String(index)).set(pr);
                });
                // Sembrar Configuración
                await db.collection("ate_settings").doc("main").set(initialConfig);
                
                console.log("🌱 [Firebase] Autosiembra de datos completada exitosamente.");
            }
        } catch (error) {
            console.error("❌ [Firebase] Error durante la siembra de base de datos:", error);
        }
    },

    // --- PRODUCTOS ---
    async getProducts() {
        if (!isFirebaseActive) {
            const local = localStorage.getItem("ate_products");
            return local ? JSON.parse(local) : null;
        }
        try {
            const snapshot = await db.collection("ate_products").get();
            return snapshot.docs.map(doc => ({ 
                id: Number(doc.id) || doc.id, 
                ...doc.data() 
            }));
        } catch (error) {
            console.error("[Firebase] Error al obtener productos:", error);
            throw error;
        }
    },

    async saveProduct(product) {
        if (!isFirebaseActive) {
            let localProducts = await this.getProducts() || [];
            const index = localProducts.findIndex(p => p.id === product.id);
            if (index > -1) {
                localProducts[index] = product;
            } else {
                localProducts.push(product);
            }
            localStorage.setItem("ate_products", JSON.stringify(localProducts));
            // Trigger storage event for same-tab/other-tabs listening
            localStorage.setItem("ate_stock_sync_trigger", Date.now());
            return;
        }
        try {
            const id = String(product.id);
            await db.collection("ate_products").doc(id).set(product);
        } catch (error) {
            console.error("[Firebase] Error al guardar producto:", error);
            throw error;
        }
    },

    async deleteProduct(id) {
        if (!isFirebaseActive) {
            let localProducts = await this.getProducts() || [];
            localProducts = localProducts.filter(p => p.id !== id);
            localStorage.setItem("ate_products", JSON.stringify(localProducts));
            localStorage.setItem("ate_stock_sync_trigger", Date.now());
            return;
        }
        try {
            await db.collection("ate_products").doc(String(id)).delete();
        } catch (error) {
            console.error("[Firebase] Error al eliminar producto:", error);
            throw error;
        }
    },

    // --- HORARIOS ---
    async getHorarios() {
        if (!isFirebaseActive) {
            const local = localStorage.getItem("ate_horarios");
            return local ? JSON.parse(local) : null;
        }
        try {
            const snapshot = await db.collection("ate_horarios").get();
            const list = snapshot.docs.map(doc => ({ 
                day: Number(doc.id), 
                ...doc.data() 
            }));
            return list.sort((a, b) => a.day - b.day);
        } catch (error) {
            console.error("[Firebase] Error al obtener horarios:", error);
            throw error;
        }
    },

    async saveHorarios(horariosList) {
        if (!isFirebaseActive) {
            localStorage.setItem("ate_horarios", JSON.stringify(horariosList));
            return;
        }
        try {
            for (const h of horariosList) {
                await db.collection("ate_horarios").doc(String(h.day)).set(h);
            }
        } catch (error) {
            console.error("[Firebase] Error al guardar horarios:", error);
            throw error;
        }
    },

    // --- PROMOCIONES ---
    async getPromos() {
        if (!isFirebaseActive) {
            const local = localStorage.getItem("ate_promos");
            return local ? JSON.parse(local) : null;
        }
        try {
            const snapshot = await db.collection("ate_promos").get();
            const list = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            return list.sort((a, b) => Number(a.id) - Number(b.id));
        } catch (error) {
            console.error("[Firebase] Error al obtener promociones:", error);
            throw error;
        }
    },

    async savePromos(promosList) {
        if (!isFirebaseActive) {
            localStorage.setItem("ate_promos", JSON.stringify(promosList));
            return;
        }
        try {
            // Eliminar anteriores para evitar residuos
            const snapshot = await db.collection("ate_promos").get();
            for (const doc of snapshot.docs) {
                await db.collection("ate_promos").doc(doc.id).delete();
            }
            // Guardar nueva lista
            for (let i = 0; i < promosList.length; i++) {
                await db.collection("ate_promos").doc(String(i)).set(promosList[i]);
            }
        } catch (error) {
            console.error("[Firebase] Error al guardar promociones:", error);
            throw error;
        }
    },

    // --- CONFIGURACIÓN GENERAL ---
    async getConfig() {
        if (!isFirebaseActive) {
            const local = localStorage.getItem("ate_config");
            return local ? JSON.parse(local) : null;
        }
        try {
            const doc = await db.collection("ate_settings").doc("main").get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error("[Firebase] Error al obtener configuración:", error);
            throw error;
        }
    },

    async saveConfig(configData) {
        if (!isFirebaseActive) {
            localStorage.setItem("ate_config", JSON.stringify(configData));
            // Trigger status change in clients
            localStorage.setItem("ate_config_sync_trigger", Date.now());
            return;
        }
        try {
            await db.collection("ate_settings").doc("main").set(configData);
        } catch (error) {
            console.error("[Firebase] Error al guardar configuración:", error);
            throw error;
        }
    },

    // --- PEDIDOS (ORDERS) ---
    async getOrders() {
        if (!isFirebaseActive) {
            const local = localStorage.getItem("ate_orders");
            return local ? JSON.parse(local) : [];
        }
        try {
            const snapshot = await db.collection("ate_orders").orderBy("timestamp", "desc").get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("[Firebase] Error al obtener comandas:", error);
            throw error;
        }
    },

    async saveOrder(order) {
        const orderData = {
            ...order,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (!isFirebaseActive) {
            let localOrders = await this.getOrders();
            // Agregar al principio
            localOrders.unshift({ ...order, id: order.ticket, timestamp: Date.now() });
            localStorage.setItem("ate_orders", JSON.stringify(localOrders));
            localStorage.setItem("ate_new_order_trigger", Date.now());
            return;
        }
        try {
            console.log("[Firebase] Registrando orden en Firestore:", order.ticket);
            await db.collection("ate_orders").doc(order.ticket).set(orderData);
        } catch (error) {
            console.error("[Firebase] Error al guardar comanda en nube:", error);
            // Intentar guardarla en local si falla la red
            let localOrders = JSON.parse(localStorage.getItem("ate_orders") || "[]");
            localOrders.unshift({ ...order, id: order.ticket, timestamp: Date.now() });
            localStorage.setItem("ate_orders", JSON.stringify(localOrders));
            localStorage.setItem("ate_new_order_trigger", Date.now());
        }
    },

    async updateOrderStatus(ticket, newStatus) {
        if (!isFirebaseActive) {
            let localOrders = await this.getOrders();
            const index = localOrders.findIndex(o => o.ticket === ticket || o.id === ticket);
            if (index > -1) {
                localOrders[index].status = newStatus;
                localStorage.setItem("ate_orders", JSON.stringify(localOrders));
                localStorage.setItem("ate_status_sync_trigger", Date.now());
            }
            return;
        }
        try {
            await db.collection("ate_orders").doc(ticket).update({ status: newStatus });
        } catch (error) {
            console.error("[Firebase] Error al actualizar estado de comanda:", error);
            throw error;
        }
    },

    async deleteOrder(ticket) {
        if (!isFirebaseActive) {
            let localOrders = await this.getOrders();
            localOrders = localOrders.filter(o => o.ticket !== ticket && o.id !== ticket);
            localStorage.setItem("ate_orders", JSON.stringify(localOrders));
            return;
        }
        try {
            await db.collection("ate_orders").doc(ticket).delete();
        } catch (error) {
            console.error("[Firebase] Error al borrar comanda de Firestore:", error);
            throw error;
        }
    },

    // --- CARGA DE IMÁGENES A CLOUDINARY ---
    async uploadImage(file) {
        console.log("[Cloudinary] Iniciando carga de imagen...");
        const cloudName = "dgb5o9y0v";
        const uploadPreset = "ugda3w5p";
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Error al subir la imagen a Cloudinary");
            }

            const data = await response.json();
            console.log("[Cloudinary] Imagen subida con éxito:", data.secure_url);
            return data.secure_url;
        } catch (error) {
            console.error("[Cloudinary] Error crítico en la carga de imagen:", error);
            throw error;
        }
    }
};

window.FirebaseService = FirebaseService;

// Auto-seeding
document.addEventListener("DOMContentLoaded", () => {
    // Si ya cargaron las variables globales de seed-data.js
    if (window.initialProducts && isFirebaseActive) {
        FirebaseService.autoSeedDatabase(
            window.initialProducts,
            window.initialHorarios,
            window.initialPromos,
            window.initialConfig
        );
    }
});
