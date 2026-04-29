export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "visage" | "corps" | "maquillage" | "accessoires";
  main_image: string;
  images: string[];
  features: string[];
  is_bestseller: boolean;
}

export interface Routine {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  status: "upcoming" | "ongoing" | "finished";
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "serum-precis-1",
    name: "Sérum Précieux Éclat Rare",
    price: 35000,
    description: "Un élixir divin formulé avec de l'huile de Baobab ancestrale et de la vitamine C pure pour une illumination instantanée de la peau.",
    category: "visage",
    main_image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    images: [],
    features: ["Boost l'éclat", "Anti-tâches", "Hydratation 24h"],
    is_bestseller: true
  },
  {
    id: "creme-impereale-2",
    name: "Crème Impériale de Karité",
    price: 25000,
    description: "Le secret des reines. Un beurre de Karité fouetté à la main, infusé aux fleurs d'hibiscus pour une nutrition profonde.",
    category: "corps",
    main_image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
    images: [],
    features: ["Nutrition intense", "Texture non grasse", "Parfum envoûtant"],
    is_bestseller: true
  },
  {
    id: "rituel-or-3",
    name: "Masque Or de l'Empire",
    price: 45000,
    description: "Un masque luxueux aux particules d'or et poudres minérales africaines pour un effet tenseur et un grain de peau affiné.",
    category: "visage",
    main_image: "https://images.unsplash.com/photo-1590156221122-c748e7898b0a?auto=format&fit=crop&q=80&w=800",
    images: [],
    features: ["Raffermissant", "Détoxifiant", "Lifting naturel"],
    is_bestseller: true
  },
  {
    id: "huile-sacree-4",
    name: "Huile Sacrée de Marula",
    price: 28000,
    description: "Issue d'une pression à froid, cette huile légère pénètre instantanément pour sceller l'hydratation et protéger des agressions.",
    category: "visage",
    main_image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
    images: [],
    features: ["Antioxydant", "Réparation cutanée", "Éclat sain"],
    is_bestseller: true
  }
];

const INITIAL_ROUTINES: Routine[] = [
  {
    id: "rituel-matin-soleil",
    title: "Le Réveil de la Reine : Rituel du Matin",
    excerpt: "Comment préparer votre peau à rayonner sous le soleil africain avec nos produits phares.",
    content: "Commencez par nettoyer avec notre gel doux...",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
    category: "Soin"
  },
  {
    id: "secret-glow-nuit",
    title: "Secrets de Nuit : Régénération Profonde",
    excerpt: "Optimisez le renouvellement cellulaire nocturne pour un réveil éclatant.",
    content: "La nuit est le moment où la peau se répare...",
    image: "https://images.unsplash.com/photo-1512496011212-721d80ad6668?auto=format&fit=crop&q=80&w=800",
    category: "Beauté"
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: "masterclass-abidjan-2026",
    title: "Gala Éclat Impérial - Abidjan",
    description: "Une soirée exclusive dédiée à la beauté africaine et au lancement de notre nouvelle gamme de prestige.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-15",
    status: "upcoming"
  }
];

class DataService {
  private products: Product[] = [];
  private routines: Routine[] = [];
  private events: Event[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const savedProducts = localStorage.getItem("pe_products");
    const savedRoutines = localStorage.getItem("pe_routines");
    const savedEvents = localStorage.getItem("pe_events");

    this.products = savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;
    this.routines = savedRoutines ? JSON.parse(savedRoutines) : INITIAL_ROUTINES;
    this.events = savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
  }

  private saveData() {
    localStorage.setItem("pe_products", JSON.stringify(this.products));
    localStorage.setItem("pe_routines", JSON.stringify(this.routines));
    localStorage.setItem("pe_events", JSON.stringify(this.events));
  }

  // Generic methods
  async getProducts() { return this.products; }
  async getProductById(id: string) { return this.products.find(p => p.id === id); }
  
  async getRoutines() { return this.routines; }
  async getRoutineById(id: string) { return this.routines.find(r => r.id === id); }
  
  async getEvents() { return this.events; }
  async getEventById(id: string) { return this.events.find(e => e.id === id); }

  // Product methods
  async addProduct(product: Product) {
    this.products.push(product);
    this.saveData();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    this.products = this.products.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveData();
    return this.products.find(p => p.id === id);
  }

  async deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveData();
  }

  // Routine methods
  async addRoutine(routine: Routine) {
    this.routines.push(routine);
    this.saveData();
    return routine;
  }

  async updateRoutine(id: string, updates: Partial<Routine>) {
    this.routines = this.routines.map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveData();
    return this.routines.find(r => r.id === id);
  }

  async deleteRoutine(id: string) {
    this.routines = this.routines.filter(r => r.id !== id);
    this.saveData();
  }

  // Event methods
  async addEvent(event: Event) {
    this.events.push(event);
    this.saveData();
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>) {
    this.events = this.events.map(e => e.id === id ? { ...e, ...updates } : e);
    this.saveData();
    return this.events.find(e => e.id === id);
  }

  async deleteEvent(id: string) {
    this.events = this.events.filter(e => e.id !== id);
    this.saveData();
  }

  async getStats() {
    const products = await this.getProducts();
    const events = await this.getEvents();
    const routines = await this.getRoutines();
    
    return {
      products: products.length,
      events: events.length,
      routines: routines.length,
      revenue: "350 000", // Simulated
      tasks: 4,
      team: 12,
      recentActivity: [
        { id: 1, user: "Mlle Précieuse", action: "a ajouté un nouveau produit", time: "2h ago" },
        { id: 2, user: "Directeur", action: "a mis à jour l'événement spécial", time: "5h ago" }
      ]
    };
  }
}

export const dataService = new DataService();
