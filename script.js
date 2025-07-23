/**
 * Simple Task Manager Application
 * Demonstrates core web development principles with clean, maintainable code
 */

class TaskManager {
  constructor() {
    // Application state
    this.tasks = this.loadTasks()
    this.currentFilter = "all"
    this.nextId = this.getNextId()

    // DOM elements
    this.elements = {
      taskForm: document.getElementById("taskForm"),
      taskInput: document.getElementById("taskInput"),
      taskList: document.getElementById("taskList"),
      emptyState: document.getElementById("emptyState"),
      filterButtons: document.querySelectorAll(".filter-btn"),
      totalTasks: document.getElementById("totalTasks"),
      activeTasks: document.getElementById("activeTasks"),
      completedTasks: document.getElementById("completedTasks"),
      clearCompleted: document.getElementById("clearCompleted"),
    }

    this.init()
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents()
    this.render()
    this.updateStats()

    // Focus the input field on load
    this.elements.taskInput.focus()
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    this.elements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.addTask()
    })

    // Filter buttons
    this.elements.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.filter)
      })
    })

    // Clear completed button
    this.elements.clearCompleted.addEventListener("click", () => {
      this.clearCompleted()
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e)
    })
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Escape key clears input
    if (e.key === "Escape" && document.activeElement === this.elements.taskInput) {
      this.elements.taskInput.value = ""
    }

    // Ctrl/Cmd + A for "All" filter
    if ((e.ctrlKey || e.metaKey) && e.key === "a" && e.target !== this.elements.taskInput) {
      e.preventDefault()
      this.setFilter("all")
    }
  }

  /**
   * Add a new task
   */
  addTask() {
    const text = this.elements.taskInput.value.trim()

    if (!text) {
      this.showInputError("Please enter a task description")
      return
    }

    if (text.length > 200) {
      this.showInputError("Task description is too long (max 200 characters)")
      return
    }

    const task = {
      id: this.nextId++,
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    this.tasks.unshift(task) // Add to beginning of array
    this.elements.taskInput.value = ""

    this.saveTasks()
    this.render()
    this.updateStats()

    // Announce to screen readers
    this.announceToScreenReader(`Task "${text}" added`)
  }

  /**
   * Toggle task completion status
   */
  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
      this.render()
      this.updateStats()

      const status = task.completed ? "completed" : "marked as active"
      this.announceToScreenReader(`Task "${task.text}" ${status}`)
    }
  }

  /**
   * Delete a task
   */
  deleteTask(id) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id)
    if (taskIndex > -1) {
      const task = this.tasks[taskIndex]
      const taskElement = document.querySelector(`[data-task-id="${id}"]`)

      // Add removing animation
      if (taskElement) {
        taskElement.classList.add("removing")
        setTimeout(() => {
          this.tasks.splice(taskIndex, 1)
          this.saveTasks()
          this.render()
          this.updateStats()

          this.announceToScreenReader(`Task "${task.text}" deleted`)
        }, 300)
      }
    }
  }

  /**
   * Edit a task
   */
  editTask(id) {
    const task = this.tasks.find((t) => t.id === id)
    if (!task) return

    const newText = prompt("Edit task:", task.text)
    if (newText !== null && newText.trim() !== "") {
      if (newText.trim().length > 200) {
        alert("Task description is too long (max 200 characters)")
        return
      }

      task.text = newText.trim()
      this.saveTasks()
      this.render()

      this.announceToScreenReader(`Task updated to "${task.text}"`)
    }
  }

  /**
   * Set the current filter
   */
  setFilter(filter) {
    this.currentFilter = filter

    // Update filter button states
    this.elements.filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter
      button.classList.toggle("active", isActive)
      button.setAttribute("aria-selected", isActive)
    })

    this.render()

    // Announce filter change to screen readers
    const filterNames = {
      all: "All tasks",
      active: "Active tasks",
      completed: "Completed tasks",
    }
    this.announceToScreenReader(`Showing ${filterNames[filter]}`)
  }

  /**
   * Clear all completed tasks
   */
  clearCompleted() {
    const completedCount = this.tasks.filter((t) => t.completed).length

    if (completedCount === 0) return

    if (confirm(`Are you sure you want to delete ${completedCount} completed task${completedCount > 1 ? "s" : ""}?`)) {
      this.tasks = this.tasks.filter((t) => !t.completed)
      this.saveTasks()
      this.render()
      this.updateStats()

      this.announceToScreenReader(`${completedCount} completed task${completedCount > 1 ? "s" : ""} deleted`)
    }
  }

  /**
   * Get filtered tasks based on current filter
   */
  getFilteredTasks() {
    switch (this.currentFilter) {
      case "active":
        return this.tasks.filter((t) => !t.completed)
      case "completed":
        return this.tasks.filter((t) => t.completed)
      default:
        return this.tasks
    }
  }

  /**
   * Render the task list
   */
  render() {
    const filteredTasks = this.getFilteredTasks()

    // Clear the task list
    this.elements.taskList.innerHTML = ""

    // Show/hide empty state
    const isEmpty = filteredTasks.length === 0
    this.elements.emptyState.classList.toggle("hidden", !isEmpty)

    if (isEmpty) {
      this.updateEmptyStateMessage()
      return
    }

    // Render tasks
    filteredTasks.forEach((task) => {
      const taskElement = this.createTaskElement(task)
      this.elements.taskList.appendChild(taskElement)
    })
  }

  /**
   * Update empty state message based on current filter
   */
  updateEmptyStateMessage() {
    const emptyMessages = {
      all: {
        icon: "📝",
        title: "No tasks yet",
        message: "Add a task above to get started!",
      },
      active: {
        icon: "✅",
        title: "No active tasks",
        message: "All tasks are completed!",
      },
      completed: {
        icon: "📋",
        title: "No completed tasks",
        message: "Complete some tasks to see them here.",
      },
    }

    const config = emptyMessages[this.currentFilter]
    const iconElement = this.elements.emptyState.querySelector(".empty-icon")
    const titleElement = this.elements.emptyState.querySelector("h2")
    const messageElement = this.elements.emptyState.querySelector("p")

    if (iconElement) iconElement.textContent = config.icon
    if (titleElement) titleElement.textContent = config.title
    if (messageElement) messageElement.textContent = config.message
  }

  /**
   * Create a task element
   */
  createTaskElement(task) {
    const li = document.createElement("li")
    li.className = `task-item ${task.completed ? "completed" : ""}`
    li.setAttribute("data-task-id", task.id)

    li.innerHTML = `
            <div class="task-checkbox ${task.completed ? "checked" : ""}" 
                 role="checkbox" 
                 aria-checked="${task.completed}"
                 tabindex="0"
                 aria-label="Mark task as ${task.completed ? "incomplete" : "complete"}">
            </div>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task">Edit</button>
                <button class="delete-btn" aria-label="Delete task">Delete</button>
            </div>
        `

    // Bind events
    const checkbox = li.querySelector(".task-checkbox")
    const editBtn = li.querySelector(".edit-btn")
    const deleteBtn = li.querySelector(".delete-btn")

    // Checkbox events
    checkbox.addEventListener("click", () => this.toggleTask(task.id))
    checkbox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.toggleTask(task.id)
      }
    })

    // Button events
    editBtn.addEventListener("click", () => this.editTask(task.id))
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id))

    return li
  }

  /**
   * Update statistics
   */
  updateStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((t) => t.completed).length
    const active = total - completed

    this.elements.totalTasks.textContent = total
    this.elements.activeTasks.textContent = active
    this.elements.completedTasks.textContent = completed

    // Show/hide clear completed button
    this.elements.clearCompleted.style.display = completed > 0 ? "block" : "none"
  }

  /**
   * Show input error message
   */
  showInputError(message) {
    const input = this.elements.taskInput
    const originalPlaceholder = input.placeholder

    input.classList.add("error")
    input.placeholder = message
    input.focus()

    setTimeout(() => {
      input.classList.remove("error")
      input.placeholder = originalPlaceholder
    }, 3000)
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "visually-hidden"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Save tasks to localStorage
   */
  saveTasks() {
    try {
      localStorage.setItem("taskManager_tasks", JSON.stringify(this.tasks))
      localStorage.setItem("taskManager_nextId", this.nextId.toString())
    } catch (error) {
      console.warn("Could not save tasks to localStorage:", error)
    }
  }

  /**
   * Load tasks from localStorage
   */
  loadTasks() {
    try {
      const saved = localStorage.getItem("taskManager_tasks")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn("Could not load tasks from localStorage:", error)
      return []
    }
  }

  /**
   * Get next available ID
   */
  getNextId() {
    try {
      const saved = localStorage.getItem("taskManager_nextId")
      return saved ? Number.parseInt(saved, 10) : 1
    } catch (error) {
      return Math.max(...this.tasks.map((t) => t.id), 0) + 1
    }
  }
}

// Update the products data with high-quality stock images

// Replace the products object with updated image paths:
const products = {
  clothing: [
    {
      id: 1,
      name: "Premium Silk Dress",
      price: 899,
      originalPrice: 1199,
      image: "/images/silk-dress-elegant.png",
      thumbnails: [
        "/images/silk-dress-elegant.png",
        "/placeholder.svg?height=100&width=100&text=Silk+Dress+Back",
        "/placeholder.svg?height=100&width=100&text=Silk+Dress+Detail",
        "/placeholder.svg?height=100&width=100&text=Silk+Dress+Model",
      ],
      category: "dresses",
      description:
        "Elegant silk dress crafted from the finest Italian silk with hand-finished seams and luxurious draping",
      badge: "New",
      sizes: ["XS", "S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 2,
      name: "Luxury Cashmere Coat",
      price: 1599,
      originalPrice: 1999,
      image: "/images/cashmere-coat-premium.png",
      thumbnails: [
        "/images/cashmere-coat-premium.png",
        "/placeholder.svg?height=100&width=100&text=Cashmere+Coat+Side",
        "/placeholder.svg?height=100&width=100&text=Cashmere+Coat+Detail",
        "/placeholder.svg?height=100&width=100&text=Cashmere+Coat+Texture",
      ],
      category: "jackets",
      description: "Premium cashmere coat with timeless design, featuring mother-of-pearl buttons and silk lining",
      badge: "Sale",
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 3,
      name: "Designer Suit",
      price: 2299,
      originalPrice: null,
      image: "/images/designer-suit-charcoal.png",
      thumbnails: [
        "/images/designer-suit-charcoal.png",
        "/placeholder.svg?height=100&width=100&text=Designer+Suit+Jacket",
        "/placeholder.svg?height=100&width=100&text=Designer+Suit+Pants",
        "/placeholder.svg?height=100&width=100&text=Designer+Suit+Details",
      ],
      category: "suits",
      description: "Handcrafted designer suit with perfect tailoring, made from premium wool with peak lapels",
      badge: null,
      sizes: ["S", "M", "L", "XL", "XXL"],
      inStock: true,
    },
    {
      id: 4,
      name: "Premium Cotton Shirt",
      price: 299,
      originalPrice: 399,
      image: "/images/cotton-shirt-white.png",
      thumbnails: [
        "/images/cotton-shirt-white.png",
        "/placeholder.svg?height=100&width=100&text=Cotton+Shirt+Cuff",
        "/placeholder.svg?height=100&width=100&text=Cotton+Shirt+Collar",
        "/placeholder.svg?height=100&width=100&text=Cotton+Shirt+Buttons",
      ],
      category: "shirts",
      description: "Luxury cotton shirt with mother-of-pearl buttons, French seams, and monogramming option",
      badge: null,
      sizes: ["XS", "S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 5,
      name: "Leather Handbag",
      price: 799,
      originalPrice: null,
      image: "/images/leather-handbag-black.png",
      thumbnails: [
        "/images/leather-handbag-black.png",
        "/placeholder.svg?height=100&width=100&text=Leather+Handbag+Side",
        "/placeholder.svg?height=100&width=100&text=Leather+Handbag+Interior",
        "/placeholder.svg?height=100&width=100&text=Leather+Handbag+Hardware",
      ],
      category: "accessories",
      description: "Handcrafted Italian leather handbag with gold-plated hardware and silk-lined interior",
      badge: "Limited",
      sizes: ["One Size"],
      inStock: true,
    },
    {
      id: 6,
      name: "Evening Gown",
      price: 1899,
      originalPrice: 2299,
      image: "/images/evening-gown-beaded.png",
      thumbnails: [
        "/images/evening-gown-beaded.png",
        "/placeholder.svg?height=100&width=100&text=Evening+Gown+Beadwork",
        "/placeholder.svg?height=100&width=100&text=Evening+Gown+Train",
        "/placeholder.svg?height=100&width=100&text=Evening+Gown+Model",
      ],
      category: "dresses",
      description: "Stunning evening gown with intricate hand-sewn beadwork and flowing train",
      badge: "Exclusive",
      sizes: ["XS", "S", "M", "L"],
      inStock: true,
    },
  ],
  watches: [
    {
      id: 7,
      name: "Classic Gold Watch",
      price: 15999,
      originalPrice: null,
      image: "/images/gold-watch-classic.png",
      thumbnails: [
        "/images/gold-watch-classic.png",
        "/placeholder.svg?height=100&width=100&text=Gold+Watch+Side",
        "/placeholder.svg?height=100&width=100&text=Gold+Watch+Crown",
        "/placeholder.svg?height=100&width=100&text=Gold+Watch+Movement",
      ],
      category: "luxury",
      description: "18k gold automatic watch with Swiss movement, sapphire crystal, and alligator leather strap",
      badge: "Bestseller",
      brand: "rolex",
      movement: "automatic",
      material: "gold",
      inStock: true,
    },
    {
      id: 8,
      name: "Platinum Timepiece",
      price: 45999,
      originalPrice: null,
      image: "/images/platinum-watch-diamonds.png",
      thumbnails: [
        "/images/platinum-watch-diamonds.png",
        "/placeholder.svg?height=100&width=100&text=Platinum+Watch+Diamonds",
        "/placeholder.svg?height=100&width=100&text=Platinum+Watch+Case",
        "/placeholder.svg?height=100&width=100&text=Platinum+Watch+Bracelet",
      ],
      category: "luxury",
      description: "Exclusive platinum watch with diamond markers, perpetual calendar, and moon phase display",
      badge: "Limited",
      brand: "patek",
      movement: "manual",
      material: "platinum",
      inStock: true,
    },
    {
      id: 9,
      name: "Steel Sports Watch",
      price: 8999,
      originalPrice: 9999,
      image: "/images/steel-diving-watch.png",
      thumbnails: [
        "/images/steel-diving-watch.png",
        "/placeholder.svg?height=100&width=100&text=Steel+Watch+Bezel",
        "/placeholder.svg?height=100&width=100&text=Steel+Watch+Bracelet",
        "/placeholder.svg?height=100&width=100&text=Steel+Watch+Clasp",
      ],
      category: "sports",
      description: "Professional diving watch with steel case, unidirectional bezel, and 300m water resistance",
      badge: null,
      brand: "omega",
      movement: "automatic",
      material: "steel",
      inStock: true,
    },
    {
      id: 10,
      name: "Rose Gold Elegance",
      price: 22999,
      originalPrice: null,
      image: "/images/rose-gold-dress-watch.png",
      thumbnails: [
        "/images/rose-gold-dress-watch.png",
        "/placeholder.svg?height=100&width=100&text=Rose+Gold+Watch+Case",
        "/placeholder.svg?height=100&width=100&text=Rose+Gold+Watch+Strap",
        "/placeholder.svg?height=100&width=100&text=Rose+Gold+Watch+Buckle",
      ],
      category: "luxury",
      description: "Sophisticated rose gold watch with leather strap, Roman numerals, and ultra-thin profile",
      badge: "New",
      brand: "cartier",
      movement: "quartz",
      material: "gold",
      inStock: true,
    },
    {
      id: 11,
      name: "Titanium Aviator",
      price: 12999,
      originalPrice: 14999,
      image: "/images/titanium-aviator-watch.png",
      thumbnails: [
        "/images/titanium-aviator-watch.png",
        "/placeholder.svg?height=100&width=100&text=Titanium+Watch+Pushers",
        "/placeholder.svg?height=100&width=100&text=Titanium+Watch+Case",
        "/placeholder.svg?height=100&width=100&text=Titanium+Watch+Band",
      ],
      category: "aviation",
      description: "Lightweight titanium aviator watch with chronograph function and anti-magnetic properties",
      badge: "Sale",
      brand: "breitling",
      movement: "automatic",
      material: "titanium",
      inStock: true,
    },
    {
      id: 12,
      name: "Diamond Luxury",
      price: 89999,
      originalPrice: null,
      image: "/images/diamond-luxury-watch.png",
      thumbnails: [
        "/images/diamond-luxury-watch.png",
        "/placeholder.svg?height=100&width=100&text=Diamond+Watch+Bezel",
        "/placeholder.svg?height=100&width=100&text=Diamond+Watch+Bracelet",
        "/placeholder.svg?height=100&width=100&text=Diamond+Watch+Clasp",
      ],
      category: "luxury",
      description: "Exquisite watch with diamond-encrusted bezel, mother-of-pearl dial, and 18k gold case",
      badge: "Exclusive",
      brand: "rolex",
      movement: "automatic",
      material: "gold",
      inStock: true,
    },
  ],
}

// Shopping Cart
let cart = JSON.parse(localStorage.getItem("kurajFashionCart")) || []

// DOM Elements
const cartBtn = document.querySelector(".cart-btn")
const cartModal = document.getElementById("cartModal")
const closeCartBtn = document.querySelector(".close-cart")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const cartCount = document.querySelector(".cart-count")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
  loadPageContent()
  initializeEventListeners()
  new TaskManager()
})

// Load page-specific content
function loadPageContent() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "index.html":
    case "":
      loadFeaturedProducts()
      break
    case "clothing.html":
      loadClothingProducts()
      break
    case "watches.html":
      loadWatchProducts()
      break
    case "product-detail.html":
      loadProductDetail()
      break
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Cart modal
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.add("active")
    })
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.classList.remove("active")
    })
  }

  // Close modal when clicking outside
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove("active")
      }
    })
  }

  // Newsletter form
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Mobile menu
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Product tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabId = e.target.dataset.tab
      switchTab(tabId)
    })
  })

  // Product detail interactions
  initializeProductDetail()
}

// Load featured products for homepage
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featuredProducts")
  if (!featuredContainer) return

  const featuredProducts = [...products.clothing.slice(0, 3), ...products.watches.slice(0, 3)]

  featuredContainer.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")
}

// Load clothing products
function loadClothingProducts() {
  const clothingContainer = document.getElementById("clothingProducts")
  if (!clothingContainer) return

  clothingContainer.innerHTML = products.clothing.map((product) => createProductCard(product)).join("")

  updateProductsCount(products.clothing.length)
}

// Load watch products
function loadWatchProducts() {
  const watchContainer = document.getElementById("watchProducts")
  if (!watchContainer) return

  watchContainer.innerHTML = products.watches.map((product) => createProductCard(product)).join("")

  updateProductsCount(products.watches.length)
}

// Create product card HTML
function createProductCard(product) {
  const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : ""
  const originalPriceHtml = product.originalPrice
    ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>`
    : ""

  return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
                ${badgeHtml}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="current-price">$${product.price.toLocaleString()}</span>
                    ${originalPriceHtml}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `
}

// View product detail
function viewProduct(productId) {
  // Store product ID in sessionStorage for product detail page
  sessionStorage.setItem("selectedProductId", productId)
  window.location.href = "product-detail.html"
}

// Update the loadProductDetail function to use thumbnail images

// In the loadProductDetail function, add thumbnail image loading:
function loadProductDetail() {
  const productId = Number.parseInt(sessionStorage.getItem("selectedProductId"))
  if (!productId) return

  const allProducts = [...products.clothing, ...products.watches]
  const product = allProducts.find((p) => p.id === productId)

  if (!product) return

  // Update product information
  document.getElementById("productTitle").textContent = product.name
  document.getElementById("productPrice").textContent = `$${product.price.toLocaleString()}`
  document.getElementById("productDescription").textContent = product.description
  document.getElementById("mainProductImage").src = product.image
  document.getElementById("mainProductImage").alt = product.name

  // Update thumbnail images if they exist
  if (product.thumbnails) {
    const thumbnailContainer = document.querySelector(".thumbnail-images")
    if (thumbnailContainer) {
      thumbnailContainer.innerHTML = product.thumbnails
        .map(
          (thumb, index) =>
            `<img src="${thumb}" alt="Product thumbnail ${index + 1}" class="thumbnail ${index === 0 ? "active" : ""}" />`,
        )
        .join("")
    }
  }

  if (product.originalPrice) {
    document.getElementById("originalPrice").textContent = `$${product.originalPrice.toLocaleString()}`
    document.getElementById("originalPrice").style.display = "inline"
  } else {
    document.getElementById("originalPrice").style.display = "none"
  }

  // Show size options for clothing
  if (product.sizes) {
    const sizeOptions = document.getElementById("sizeOptions")
    if (sizeOptions) {
      sizeOptions.style.display = "block"
    }
  }

  // Update breadcrumb
  const categoryLink = document.getElementById("categoryLink")
  const productName = document.getElementById("productName")

  if (products.clothing.includes(product)) {
    categoryLink.href = "clothing.html"
    categoryLink.textContent = "Clothing"
  } else {
    categoryLink.href = "watches.html"
    categoryLink.textContent = "Watches"
  }

  productName.textContent = product.name

  // Load related products
  loadRelatedProducts(product)
}

// Initialize product detail interactions
function initializeProductDetail() {
  // Thumbnail images
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImage = document.getElementById("mainProductImage")

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach((t) => t.classList.remove("active"))
      thumb.classList.add("active")
      if (mainImage) {
        mainImage.src = thumb.src.replace("100x100", "600x600")
      }
    })
  })

  // Size selection
  const sizeBtns = document.querySelectorAll(".size-btn")
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
    })
  })

  // Quantity selector
  const quantityInput = document.getElementById("quantity")
  const minusBtn = document.querySelector(".qty-btn.minus")
  const plusBtn = document.querySelector(".qty-btn.plus")

  if (minusBtn && quantityInput) {
    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })
  }

  if (plusBtn && quantityInput) {
    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1
      }
    })
  }

  // Add to cart button
  const addToCartBtn = document.getElementById("addToCartBtn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const productId = Number.parseInt(sessionStorage.getItem("selectedProductId"))
      const quantity = Number.parseInt(quantityInput?.value || 1)
      const selectedSize = document.querySelector(".size-btn.active")?.textContent || null

      addToCart(productId, quantity, selectedSize)
    })
  }
}

// Load related products
function loadRelatedProducts(currentProduct) {
  const relatedContainer = document.getElementById("relatedProducts")
  if (!relatedContainer) return

  const allProducts = [...products.clothing, ...products.watches]
  const relatedProducts = allProducts
    .filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4)

  relatedContainer.innerHTML = relatedProducts.map((product) => createProductCard(product)).join("")
}

// Switch product detail tabs
function switchTab(tabId) {
  // Remove active class from all tabs and panels
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"))

  // Add active class to selected tab and panel
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active")
  document.getElementById(tabId).classList.add("active")
}

// Add product to cart
function addToCart(productId, quantity = 1, size = null) {
  const allProducts = [...products.clothing, ...products.watches]
  const product = allProducts.find((p) => p.id === productId)

  if (!product) return

  const existingItem = cart.find((item) => item.id === productId && item.size === size)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: size,
    })
  }

  saveCart()
  updateCartUI()
  showCartNotification()
}

// Remove item from cart
function removeFromCart(productId, size = null) {
  cart = cart.filter((item) => !(item.id === productId && item.size === size))
  saveCart()
  updateCartUI()
}

// Update cart quantity
function updateCartQuantity(productId, size, newQuantity) {
  const item = cart.find((item) => item.id === productId && item.size === size)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
    } else {
      item.quantity = newQuantity
      saveCart()
      updateCartUI()
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("kurajFashionCart", JSON.stringify(cart))
}

// Update cart UI
function updateCartUI() {
  updateCartCount()
  updateCartItems()
  updateCartTotal()
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (cartCount) {
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "flex" : "none"
  }
}

// Update cart items display
function updateCartItems() {
  if (!cartItems) return

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>'
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ""}
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateCartQuantity(${item.id}, '${item.size}', parseInt(this.value))">
                    <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')">&times;</button>
        </div>
    `,
    )
    .join("")
}

// Update cart total
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (cartTotal) {
    cartTotal.textContent = total.toLocaleString()
  }
}

// Show cart notification
function showCartNotification() {
  // Create and show a temporary notification
  const notification = document.createElement("div")
  notification.className = "cart-notification"
  notification.textContent = "Item added to cart!"
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-gold);
        color: var(--primary-black);
        padding: 1rem 2rem;
        border-radius: 5px;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Update products count
function updateProductsCount(count) {
  const productsCount = document.getElementById("productsCount")
  if (productsCount) {
    productsCount.textContent = `${count} Products`
  }
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value

  // Simulate API call
  const submitBtn = e.target.querySelector("button")
  const originalText = submitBtn.textContent

  submitBtn.textContent = "Subscribing..."
  submitBtn.disabled = true

  setTimeout(() => {
    alert(`Thank you for subscribing with ${email}!`)
    e.target.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 1500)
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add CSS animation for cart notification
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-notification {
        animation: slideIn 0.3s ease;
    }
`
document.head.appendChild(style)

// Search functionality (basic implementation)
const searchBtn = document.querySelector(".search-btn")
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const searchTerm = prompt("Search for products:")
    if (searchTerm) {
      // Simple search implementation
      const allProducts = [...products.clothing, ...products.watches]
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (results.length > 0) {
        alert(`Found ${results.length} products matching "${searchTerm}"`)
      } else {
        alert(`No products found matching "${searchTerm}"`)
      }
    }
  })
}

// Lazy loading for images
const observerOptions = {
  threshold: 0.1,
  rootMargin: "50px",
}

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src || img.src
      img.classList.remove("lazy")
      imageObserver.unobserve(img)
    }
  })
}, observerOptions)

// Observe all images for lazy loading
document.querySelectorAll("img").forEach((img) => {
  imageObserver.observe(img)
})
