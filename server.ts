import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";

const db = new Database("precieuse_empire.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('super_admin', 'editor', 'commercial', 'collaborator')) DEFAULT 'collaborator',
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    short_desc TEXT,
    long_desc TEXT,
    price INTEGER,
    category TEXT CHECK(category IN ('Soins visage', 'Corps', 'Maquillage', 'Parfums', 'Cheveux')),
    skin_type TEXT,
    badges TEXT, 
    stock INTEGER DEFAULT 0,
    status TEXT CHECK(status IN ('visible', 'hidden')) DEFAULT 'visible',
    release_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME,
    location TEXT,
    image TEXT,
    status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    release_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS editorial_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('article', 'promo', 'routine')),
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    content TEXT, 
    image TEXT,
    author_id INTEGER,
    status TEXT CHECK(status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
    release_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    photo TEXT,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    status TEXT CHECK(status IN ('active', 'hidden')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('high', 'normal', 'low')) DEFAULT 'normal',
    deadline DATETIME,
    creator_id INTEGER,
    status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    recurrence TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creator_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS task_assignees (
    task_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY(task_id, user_id),
    FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS popup_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    is_active INTEGER DEFAULT 0,
    title TEXT,
    subtitle TEXT,
    image TEXT,
    whatsapp_link TEXT,
    delay INTEGER DEFAULT 10
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    filename TEXT,
    type TEXT,
    size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data
const checkCount = (table: string) => {
  try {
    return (db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number }).count;
  } catch (e) {
    return 0;
  }
};

if (checkCount("users") === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email, password, role, status, image) VALUES (?, ?, ?, ?, ?, ?)");
  insertUser.run("Mlle Précieuse", "admin@precieuseempire.com", "admin123", "super_admin", "active", "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400");
  insertUser.run("Sarah G.", "sarah@precieuseempire.com", "sarah123", "commercial", "active", "https://images.unsplash.com/photo-1506272517105-4f29bc952dd6?auto=format&fit=crop&q=80&w=400");
}

if (checkCount("popup_config") === 0) {
  db.prepare("INSERT INTO popup_config (id, is_active, title, subtitle, whatsapp_link, delay) VALUES (1, 1, 'Rejoignez l''Empire', 'Inscrivez-vous et recevez -10% sur votre premier rituel.', 'https://wa.me/2290150824534', 10)").run();
}

if (checkCount("site_settings") === 0) {
  const insertSetting = db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)");
  insertSetting.run("site_name", "Précieuse Empire");
  insertSetting.run("slogan", "L'élégance de la beauté naturelle");
  insertSetting.run("whatsapp_main", "+229 0150824534");
  insertSetting.run("whatsapp_urgency", "+229 0191362054");
  insertSetting.run("contact_email", "merveillesokenou12@gmail.com");
  insertSetting.run("instagram_url", "https://instagram.com/precieuseempire");
  insertSetting.run("maintenance_mode", "false");
}

if (checkCount("products") === 0) {
  const insertProduct = db.prepare("INSERT INTO products (name, short_desc, long_desc, price, category, skin_type, badges, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertProduct.run("Savon Noir Impérial", "Nettoyage royal pour un éclat instantané.", "Le secret de l'Empire pour une peau zéro défaut. Purifie en profondeur grâce aux cendres de végétaux précieux.", 5500, "Soins visage", "Tous types", JSON.stringify(["Nouveau", "Best-seller"]), 50, "visible");
  insertProduct.run("Huile d'Horus", "L'élixir doré régénérateur.", "Une huile sacrée qui nourrit intensément les peaux les plus sèches. Appliquer après le rituel du soir.", 12000, "Corps", "Sec", JSON.stringify(["Promo"]), 30, "visible");
}

if (checkCount("testimonials") === 0) {
  const insertTestimonial = db.prepare("INSERT INTO testimonials (name, rating, comment, status) VALUES (?, ?, ?, ?)");
  insertTestimonial.run("Yasmine L.", 5, "Les produits Précieuse Empire ont sauvés ma routine. Le savon noir est magique !", "active");
  insertTestimonial.run("Chantal M.", 4, "Livraison rapide et packaging luxueux. Les résultats sont là.", "active");
}

if (checkCount("events") === 0) {
  const insertEvent = db.prepare("INSERT INTO events (title, description, date, location, image, status) VALUES (?, ?, ?, ?, ?, ?)");
  insertEvent.run("Atelier Beauté : Les Secrets du Karité", "Venez apprendre à formuler votre propre baume nourrissant.", "2026-05-15T14:00:00", "Showroom Cotonou", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800", "published");
}

if (checkCount("editorial_content") === 0) {
  const insertContent = db.prepare("INSERT INTO editorial_content (type, title, excerpt, content, image, status, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertContent.run("article", "Secret d'éclat royal", "Comment garder une peau radieuse toute l'année.", "Contenu complet de l'article sur l'éclat royal...", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800", "published", "Conseils");
  insertContent.run("routine", "Rituel Matinal Impérial", "Une routine complète pour bien commencer la journée.", "Étape 1: Nettoyage, Étape 2: Hydratation...", "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800", "published", "Visage");
  insertContent.run("promo", "Offre de Bienvenue", "-20% sur votre première commande.", "Profitez de cette offre exceptionnelle...", "https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&q=80&w=800", "published", "Promo");
}

if (checkCount("tasks") === 0) {
  const insertTask = db.prepare("INSERT INTO tasks (title, description, priority, creator_id, status, deadline) VALUES (?, ?, ?, ?, ?, ?)");
  insertTask.run("Ménage Showroom", "Nettoyage complet avant l'événement de demain.", "high", 1, "todo", "2026-05-14T00:00:00");
  insertTask.run("Update Stock Karité", "Vérifier l'inventaire suite à la vente flash.", "normal", 1, "in_progress", "2026-04-30T00:00:00");
  insertTask.run("Approbation Contenus", "Relire les articles de Sarah avant publication.", "low", 1, "done", "2026-04-25T00:00:00");
  
  const lastId = (db.prepare("SELECT last_insert_rowid() as id").get() as any).id;
  db.prepare("INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)").run(1, 1);
  db.prepare("INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)").run(2, 2);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products.map((p: any) => {
      // Fetch images for each product
      const images = db.prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC").all(p.id);
      return {
        ...p,
        main_image: images[0]?.image_url || "https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&w=800",
        gallery: images.map((i: any) => i.image_url),
        badges: JSON.parse(p.badges || "[]")
      };
    }));
  });

  // --- Admin Auth ---
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      if (user.status === 'inactive') return res.status(403).json({ success: false, message: "Compte désactivé" });
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }
  });

  // --- Admin Dashboard Stats ---
  app.get("/api/admin/stats", (req, res) => {
    const products = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
    const events = (db.prepare("SELECT COUNT(*) as count FROM events WHERE status = 'published'").get() as any).count;
    const tasks = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status != 'done'").get() as any).count;
    const articles = (db.prepare("SELECT COUNT(*) as count FROM editorial_content WHERE status = 'published'").get() as any).count;
    res.json({ products, events, tasks, articles });
  });

  // --- Tasks System ---
  app.get("/api/admin/tasks", (req, res) => {
    const tasks = db.prepare(`
      SELECT t.*, u.name as creator_name 
      FROM tasks t 
      LEFT JOIN users u ON t.creator_id = u.id
      ORDER BY t.created_at DESC
    `).all();
    res.json(tasks.map((t: any) => ({
      ...t,
      assignees: db.prepare("SELECT u.id, u.name, u.image FROM users u JOIN task_assignees ta ON u.id = ta.user_id WHERE ta.task_id = ?").all(t.id)
    })));
  });

  app.patch("/api/admin/tasks/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // --- Testimonials ---
  app.get("/api/admin/testimonials", (req, res) => {
    const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY created_at DESC").all();
    res.json(testimonials.map((t: any) => ({
      ...t,
      client_name: t.name,
      photo_url: t.photo,
      is_active: t.status === 'active'
    })));
  });

  app.post("/api/admin/testimonials", (req, res) => {
    const { client_name, rating, comment, is_active, photo_url } = req.body;
    const stmt = db.prepare(`
      INSERT INTO testimonials (name, photo, rating, comment, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(client_name, photo_url, rating, comment, is_active ? 'active' : 'hidden');
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.patch("/api/admin/testimonials/:id", (req, res) => {
    const { is_active } = req.body;
    db.prepare("UPDATE testimonials SET status = ? WHERE id = ?").run(is_active ? 'active' : 'hidden', req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/testimonials/:id", (req, res) => {
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Media Gallery ---
  app.get("/api/admin/media", (req, res) => {
    const media = db.prepare("SELECT * FROM media ORDER BY created_at DESC").all();
    res.json(media);
  });

  app.post("/api/admin/media", (req, res) => {
    const { url, filename, type, size } = req.body;
    const stmt = db.prepare(`
      INSERT INTO media (url, filename, type, size)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(url, filename, type, size);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.delete("/api/admin/media/:id", (req, res) => {
    db.prepare("DELETE FROM media WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Settings & Popup ---
  app.get("/api/admin/settings", (req, res) => {
    const settingsArr = db.prepare("SELECT * FROM site_settings").all() as any[];
    const popup = db.prepare("SELECT * FROM popup_config WHERE id = 1").get() as any;
    
    const settings: any = {
      popup_active: popup?.is_active === 1,
      popup_title: popup?.title || '',
      popup_subtitle: popup?.subtitle || '',
      popup_delay: popup?.delay || 5,
      popup_image: popup?.image || '',
    };
    
    settingsArr.forEach(s => settings[s.key] = s.value);
    res.json(settings);
  });

  app.post("/api/admin/settings", (req, res) => {
    const settings = req.body;
    
    // Save site settings
    const upsertSetting = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
    const keys = [
      'site_name', 'slogan', 'whatsapp_main', 'whatsapp_urgency', 
      'contact_email', 'instagram_url', 'facebook_url', 'tiktok_url', 'maintenance_mode'
    ];
    
    keys.forEach(key => {
      if (settings[key] !== undefined) {
        upsertSetting.run(key, String(settings[key]));
      }
    });

    // Save popup config
    db.prepare(`
      UPDATE popup_config 
      SET is_active = ?, title = ?, subtitle = ?, delay = ?, image = ?
      WHERE id = 1
    `).run(
      settings.popup_active ? 1 : 0, 
      settings.popup_title, 
      settings.popup_subtitle, 
      settings.popup_delay,
      settings.popup_image
    );

    res.json({ success: true });
  });

  // --- Events ---
  app.get("/api/admin/events/:id/registrations", (req, res) => {
    const registrations = db.prepare(`
      SELECT * FROM event_registrations WHERE event_id = ?
    `).all(req.params.id);
    res.json(registrations);
  });

  app.delete("/api/admin/registrations/:id", (req, res) => {
    db.prepare("DELETE FROM event_registrations WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events").all();
    res.json(events);
  });

  app.get("/api/routines", (req, res) => {
    const routines = db.prepare("SELECT * FROM editorial_content WHERE type = 'routine'").all();
    res.json(routines);
  });

  app.get("/api/team", (req, res) => {
    const team = db.prepare("SELECT * FROM users").all();
    res.json(team);
  });

  // --- Products ---
  app.post("/api/admin/products", (req, res) => {
    const { name, short_desc, long_description, price, category, skin_type, badges, stock, status, images, planned_at } = req.body;
    
    const dbTransaction = db.transaction(() => {
      const stmt = db.prepare(`
        INSERT INTO products (name, short_desc, long_desc, price, category, skin_type, badges, stock, status, release_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, short_desc, long_description, price, category, skin_type, JSON.stringify(badges || []), stock, status, planned_at);
      const productId = result.lastInsertRowid;

      if (images && images.length > 0) {
        const insertImage = db.prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)");
        images.forEach((img: string, index: number) => {
          insertImage.run(productId, img, index);
        });
      }
      return productId;
    });

    const id = dbTransaction();
    res.json({ success: true, id });
  });

  app.patch("/api/admin/products/:id", (req, res) => {
    const { name, short_desc, long_description, price, category, skin_type, badges, stock, status, images, planned_at } = req.body;
    const productId = req.params.id;

    const dbTransaction = db.transaction(() => {
      db.prepare(`
        UPDATE products SET name = ?, short_desc = ?, long_desc = ?, price = ?, category = ?, skin_type = ?, badges = ?, stock = ?, status = ?, release_date = ?
        WHERE id = ?
      `).run(name, short_desc, long_description, price, category, skin_type, JSON.stringify(badges || []), stock, status, planned_at, productId);

      if (images) {
        db.prepare("DELETE FROM product_images WHERE product_id = ?").run(productId);
        const insertImage = db.prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)");
        images.forEach((img: string, index: number) => {
          insertImage.run(productId, img, index);
        });
      }
    });

    dbTransaction();
    res.json({ success: true });
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Events ---
  app.post("/api/admin/events", (req, res) => {
    const { title, description, date, location, image, status, planned_at } = req.body;
    const stmt = db.prepare(`
      INSERT INTO events (title, description, date, location, image, status, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, date, location, image, status, planned_at);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.patch("/api/admin/events/:id", (req, res) => {
    const { title, description, date, location, image, status, planned_at } = req.body;
    db.prepare(`
      UPDATE events SET title = ?, description = ?, date = ?, location = ?, image = ?, status = ?, release_date = ?
      WHERE id = ?
    `).run(title, description, date, location, image, status, planned_at, req.params.id);
    res.json({ success: true });
  });

  // --- Editorial Content ---
  app.post("/api/admin/content", (req, res) => {
    const { type, title, subtitle, excerpt, content, image, status, category, planned_at } = req.body;
    const stmt = db.prepare(`
      INSERT INTO editorial_content (type, title, category, excerpt, content, image, status, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(type, title, category, excerpt || subtitle, content, image, status, planned_at);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.patch("/api/admin/content/:id", (req, res) => {
    const { title, subtitle, excerpt, content, image, status, category, planned_at } = req.body;
    db.prepare(`
      UPDATE editorial_content SET title = ?, category = ?, excerpt = ?, content = ?, image = ?, status = ?, release_date = ?
      WHERE id = ?
    `).run(title, category, excerpt || subtitle, content, image, status, planned_at, req.params.id);
    res.json({ success: true });
  });

  // --- Tasks ---
  // --- Team Management ---
  app.post("/api/admin/team", (req, res) => {
    const { name, email, role, status, image } = req.body;
    const stmt = db.prepare(`
      INSERT INTO users (name, email, role, status, image, is_admin)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    const result = stmt.run(name, email, role, status || 'active', image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.patch("/api/admin/team/:id", (req, res) => {
    const { name, email, role, status } = req.body;
    db.prepare(`
      UPDATE users SET name = ?, email = ?, role = ?, status = ?
      WHERE id = ?
    `).run(name, email, role, status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/team/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Dashboard Stats ---
  app.get("/api/admin/stats", (req, res) => {
    const productsCount = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
    const tasksTodo = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status != 'done'").get() as any).count;
    const eventsCount = (db.prepare("SELECT COUNT(*) as count FROM events").get() as any).count;
    const teamCount = (db.prepare("SELECT COUNT(*) as count FROM users WHERE is_admin = 1").get() as any).count;
    
    // Simuler des revenus et croissance
    res.json({
      revenue: "3.4M",
      revenueTrend: "+12.5%",
      products: productsCount,
      tasks: tasksTodo,
      events: eventsCount,
      team: teamCount,
      recentActivity: [
        { id: 1, user: "Sarah K.", action: "a publié l'article 'Secret Royal'", time: "Il y a 12min" },
        { id: 2, user: "Moussa D.", action: "a mis à jour le stock Karité", time: "Il y a 45min" },
        { id: 3, user: "Admin", action: "a créé un nouvel événement", time: "Il y a 2h" }
      ]
    });
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
