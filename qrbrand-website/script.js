'use strict';

const APP_CONFIG = {
  DEBUG: false,
  MAX_FPS: 60,
  PHYSICS_ENABLED: true,
  HAPTICS_ENABLED: true
};

const fallbackGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
];

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 0;
  }

  update(currentTime) {
    this.frameCount++;
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      if (APP_CONFIG.DEBUG) {
        console.log(`FPS: ${this.fps}`);
      }
    }
  }

  getFPS() {
    return this.fps;
  }
}

class BackgroundManager {
  constructor() {
    this.backgroundElement = document.getElementById('backgroundImage');
    this.init();
  }

  init() {
    this.setFallbackBackground();
  }

  setFallbackBackground() {
    const randomGradient = fallbackGradients[Math.floor(Math.random() * fallbackGradients.length)];
    this.backgroundElement.style.background = randomGradient;
    this.backgroundElement.classList.add('loaded');
  }

  destroy() {
    // Cleanup if needed
  }
}

class NavigationManager {
  constructor() {
    this.isMobile = this.detectMobile();
    this.contentData = {
      about: {
        title: "About QRBrand Ltd",
        content: `
          <p>QRBrand Ltd is a leading software development company specializing in custom business solutions. We deliver innovative technology solutions that transform businesses across diverse industries.</p>
          
          <p>With offices spanning Qatar, Lebanon, France, and Iraq, we bring together diverse expertise to solve complex digital challenges with precision and creativity.</p>
        `
      },
      why: {
        title: "Why Choose QRBrand Ltd",
        content: `
          <p>We distinguish ourselves through technical excellence and innovative problem-solving methodologies.</p>
          
          <ul>
            <li>Cutting-edge technology stack with AI/ML integration</li>
            <li>Agile development with rapid delivery cycles</li>
            <li>Scalable cloud-native architecture design</li>
            <li>Enterprise-grade security implementation</li>
            <li>24/7 technical support and monitoring</li>
          </ul>
        `
      },
      services: {
        title: "Our Professional Services",
        content: `
          <p>Comprehensive software development services for modern businesses:</p>
          
          <ul>
            <li>Custom Software Development</li>
            <li>Mobile App Development (iOS/Android)</li>
            <li>Web Application Development</li>
            <li>Cloud Migration & DevOps</li>
            <li>API Development & Integration</li>
            <li>Database Architecture & Optimization</li>
          </ul>
        `
      },
      tech: {
        title: "Advanced Technologies",
        content: `
          <p>We leverage the latest technology stacks:</p>
          
          <ul>
            <li>Frontend: React.js, Vue.js, Angular, TypeScript</li>
            <li>Backend: Node.js, Python, Java Spring, .NET</li>
            <li>Mobile: React Native, Flutter, Swift, Kotlin</li>
            <li>Cloud: AWS, Azure, Google Cloud, Docker</li>
            <li>AI/ML: TensorFlow, PyTorch, Computer Vision</li>
            <li>Blockchain: Ethereum, Smart Contracts, Web3</li>
          </ul>
        `
      },
      address: {
        title: "Our Address",
        content: `
          <p><strong>United Kingdom Headquarters:</strong><br>
          71-75 Shelton Street, Covent Garden<br>
          London, United Kingdom, WC2H 9JQ</p>
        `
      }
    };
    
    this.currentModal = null;
    this.touchHandlers = new Map();
    this.isPageVisible = true;
    this.init();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768) ||
           ('ontouchstart' in window);
  }

  init() {
    this.setupNavigationTabs();
    this.setupContactItems();
    this.setupModalInteractions();
    this.setupPageVisibilityHandling();
  }

  setupPageVisibilityHandling() {
    const handleVisibilityChange = () => {
      this.isPageVisible = !document.hidden;
      
      if (this.isPageVisible) {
        setTimeout(() => {
          this.reinitializeEventListeners();
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
      setTimeout(() => {
        this.reinitializeEventListeners();
      }, 300);
    }, { passive: true });
    
    window.addEventListener('blur', () => {
      this.isPageVisible = false;
    }, { passive: true });

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.isPageVisible = true;
        setTimeout(() => {
          this.reinitializeEventListeners();
        }, 100);
      }
    }, { passive: true });
  }

  reinitializeEventListeners() {
    if (!this.isPageVisible) return;
    
    this.touchHandlers.forEach((handler, element) => {
      element.removeEventListener('touchend', handler);
      element.removeEventListener('click', handler);
    });
    this.touchHandlers.clear();
    
    this.setupNavigationTabs();
    this.setupContactItems();
    
    if (APP_CONFIG.DEBUG) {
      console.log('Event listeners reinitialized');
    }
  }

  setupNavigationTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.isPageVisible) return;
        
        const contentType = tab.getAttribute('data-content');
        this.showContent(contentType);
        
        if (APP_CONFIG.HAPTICS_ENABLED && navigator.vibrate) {
          navigator.vibrate(10);
        }
      };

      this.touchHandlers.set(tab, handler);
      tab.addEventListener('touchend', handler, { passive: false });
      tab.addEventListener('click', handler, { passive: false });
    });
  }

  setupContactItems() {
    const contactItems = document.querySelectorAll('.mobile-contact-item');
    contactItems.forEach(item => {
      const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.isPageVisible) return;
        
        const phone = item.getAttribute('data-phone');
        const email = item.getAttribute('data-email');
        
        setTimeout(() => {
          if (phone) {
            window.location.href = `tel:${phone}`;
          } else if (email) {
            window.location.href = `mailto:${email}`;
          }
        }, 100);
        
        if (APP_CONFIG.HAPTICS_ENABLED && navigator.vibrate) {
          navigator.vibrate(15);
        }
      };

      this.touchHandlers.set(item, handler);
      item.addEventListener('touchend', handler, { passive: false });
      item.addEventListener('click', handler, { passive: false });
    });
  }

  setupModalInteractions() {
    const modal = document.getElementById('contentModal');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const touchStart = (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const touchMove = (e) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      if (deltaY < 0) {
        const translateY = Math.min(0, deltaY);
        modal.style.transform = `translateY(${translateY}px)`;
      }
    };

    const touchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const deltaY = startY - currentY;
      
      if (Math.abs(deltaY) > 50) {
        this.hideContent();
      } else {
        modal.style.transform = 'translateY(0)';
      }
    };

    modal.addEventListener('touchstart', touchStart, { passive: true });
    modal.addEventListener('touchmove', touchMove, { passive: true });
    modal.addEventListener('touchend', touchEnd, { passive: true });
  }

  showContent(contentType) {
    if (!this.isPageVisible) return;
    
    const modal = document.getElementById('contentModal');
    const modalContent = document.getElementById('modalContent');
    
    if (this.contentData[contentType]) {
      const data = this.contentData[contentType];
      modalContent.innerHTML = `
        <h2>${data.title}</h2>
        ${data.content}
      `;
      
      modal.classList.add('visible');
      this.currentModal = contentType;
      
      setTimeout(() => {
        if (this.currentModal === contentType) {
          this.hideContent();
        }
      }, 10000);
    }
  }

  hideContent() {
    const modal = document.getElementById('contentModal');
    modal.classList.remove('visible');
    modal.style.transform = 'translateY(-100%)';
    this.currentModal = null;
    
    setTimeout(() => {
      modal.style.transform = '';
    }, 600);
  }

  destroy() {
    this.touchHandlers.forEach((handler, element) => {
      element.removeEventListener('touchend', handler);
      element.removeEventListener('click', handler);
    });
    this.touchHandlers.clear();
  }
}

class MobileTouchManager {
  constructor() {
    this.isMobile = this.detectMobile();
    this.touchTimers = new Map();
    this.isPageVisible = true;
    this.init();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768) ||
           ('ontouchstart' in window);
  }

  init() {
    this.setupMobileTouchInteractions();
    this.setupBannerMotion();
    this.setupPageVisibilityHandling();
    this.showInitialElements();
  }

  setupPageVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    }, { passive: true });
    
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
    }, { passive: true });
    
    window.addEventListener('blur', () => {
      this.isPageVisible = false;
    }, { passive: true });
  }

  setupMobileTouchInteractions() {
    const touchStart = (e) => {
      if (!this.isPageVisible) return;
      
      if (e.target.closest('.nav-tab') || 
          e.target.closest('.mobile-contact-item') || 
          e.target.closest('.content-modal') ||
          e.target.closest('.physics-moon')) {
        return;
      }
      
      this.clearTimers();
      this.showElements();
    };

    const touchEnd = () => {
      if (!this.isPageVisible) return;
      
      this.touchTimers.set('elements', setTimeout(() => {
        this.hideElements();
      }, 5000));
    };

    document.addEventListener('touchstart', touchStart, { passive: true });
    document.addEventListener('touchend', touchEnd, { passive: true });

    window.addEventListener('resize', () => {
      this.isMobile = this.detectMobile();
    });
  }

  setupBannerMotion() {
    if (window.DeviceOrientationEvent && this.isMobile) {
      window.addEventListener('deviceorientation', (e) => {
        if (!this.isPageVisible) return;
        
        const gamma = e.gamma || 0;
        const beta = e.beta || 0;
        
        const maxMove = 25;
        const moveX = (gamma / 90) * maxMove;
        const moveY = (beta / 180) * (maxMove * 0.3);
        
        const topBanner = document.getElementById('topBannerText');
        if (topBanner) {
          topBanner.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }, { passive: true });
    }
  }

  clearTimers() {
    this.touchTimers.forEach(timer => clearTimeout(timer));
    this.touchTimers.clear();
  }

  showInitialElements() {
    if (this.isMobile) {
      setTimeout(() => {
        if (this.isPageVisible) {
          this.showElements();
          
          setTimeout(() => {
            this.hideElements();
          }, 5000);
        }
      }, 1000);
    }
  }

  showElements() {
    if (!this.isPageVisible) return;
    
    const navContainer = document.getElementById('mobileNavContainer');
    const contactContainer = document.getElementById('mobileContactContainer');
    
    if (navContainer) navContainer.classList.add('visible');
    if (contactContainer) contactContainer.classList.add('visible');
  }

  hideElements() {
    const navContainer = document.getElementById('mobileNavContainer');
    const contactContainer = document.getElementById('mobileContactContainer');
    
    if (navContainer) navContainer.classList.remove('visible');
    if (contactContainer) contactContainer.classList.remove('visible');
  }

  destroy() {
    this.clearTimers();
  }
}

class TitleShakeManager {
  constructor() {
    this.mainTitle = document.getElementById('mainTitle');
    this.init();
  }

  init() {
    if (this.mainTitle) {
      this.splitTextIntoLetters();
    }
  }

  splitTextIntoLetters() {
    const text = this.mainTitle.textContent;
    this.mainTitle.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      this.mainTitle.appendChild(span);
    }
  }

  shakeTitle() {
    const letters = this.mainTitle.querySelectorAll('.letter');
    
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('shake');
        setTimeout(() => {
          letter.classList.remove('shake');
        }, 600);
      }, index * 50);
    });
  }

  destroy() {
    // Cleanup if needed
  }
}

class PhysicsMoon {
  constructor() {
    this.moon = document.getElementById('physicsMoon');
    this.isMobile = this.detectMobile();
    this.performanceMonitor = new PerformanceMonitor();
    this.titleShakeManager = new TitleShakeManager();
    this.isPageVisible = true;
    
    this.resetPhysics();
    
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / APP_CONFIG.MAX_FPS;
    
    if (APP_CONFIG.PHYSICS_ENABLED) {
      this.init();
    }
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768) ||
           ('ontouchstart' in window);
  }

  resetPhysics() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 4;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.3;
    this.bounce = 0.75;
    this.friction = 0.99;
    this.airResistance = 0.998;
    this.size = 32;
    this.maxSpeed = 15;
    this.isAnimating = false;
    this.animationId = null;
    this.obstacles = [];
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
  }

  async init() {
    this.setupPageVisibilityHandling();
    
    if (this.isMobile) {
      await this.requestMotionPermissions();
      this.setupDeviceMotion();
    } else {
      this.setupMouseInteractions();
    }
    this.startAnimation();
    this.positionMoon();
    this.updateObstacles();
  }

  setupPageVisibilityHandling() {
    const handleVisibilityChange = () => {
      this.isPageVisible = !document.hidden;
      
      if (this.isPageVisible && !this.isAnimating) {
        setTimeout(() => {
          this.startAnimation();
        }, 300);
      } else if (!this.isPageVisible && this.isAnimating) {
        this.isAnimating = false;
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
      if (!this.isAnimating) {
        setTimeout(() => {
          this.startAnimation();
        }, 200);
      }
    }, { passive: true });
    
    window.addEventListener('blur', () => {
      this.isPageVisible = false;
    }, { passive: true });

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.isPageVisible = true;
        setTimeout(() => {
          this.startAnimation();
        }, 100);
      }
    }, { passive: true });
  }

  async requestMotionPermissions() {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          console.log('Motion permission denied');
        }
      } catch (error) {
        console.log('Motion permission error:', error);
      }
    }

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          console.log('Orientation permission denied');
        }
      } catch (error) {
        console.log('Orientation permission error:', error);
      }
    }
  }

  setupDeviceMotion() {
    if (!window.DeviceMotionEvent) return;

    window.addEventListener('devicemotion', (e) => {
      if (!this.isPageVisible || !this.isAnimating) return;
      
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null) {
        const sensitivity = 0.2;
        const forceX = -acc.x * sensitivity;
        const forceY = acc.y * sensitivity;
        
        this.vx += forceX;
        this.vy += forceY;
        
        this.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vx));
        this.vy = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vy));
      }
    }, { passive: true });
  }

  setupMouseInteractions() {
    const mouseDown = (e) => {
      if (!this.isPageVisible) return;
      
      e.preventDefault();
      this.isDragging = true;
      const rect = this.moon.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left - this.size / 2;
      this.dragOffset.y = e.clientY - rect.top - this.size / 2;
      this.moon.style.cursor = 'grabbing';
    };

    const mouseMove = (e) => {
      if (!this.isPageVisible) return;
      
      if (this.isDragging) {
        this.x = e.clientX - this.dragOffset.x - this.size / 2;
        this.y = e.clientY - this.dragOffset.y - this.size / 2;
        this.vx = 0;
        this.vy = 0;
      }
    };

    const mouseUp = (e) => {
      if (!this.isPageVisible) return;
      
      if (this.isDragging) {
        this.isDragging = false;
        this.moon.style.cursor = 'grab';
        
        const rect = this.moon.getBoundingClientRect();
        const deltaX = e.clientX - rect.left - this.size / 2;
        const deltaY = e.clientY - rect.top - this.size / 2;
        
        this.vx = deltaX * 0.1;
        this.vy = deltaY * 0.1;
      }
    };

    const click = (e) => {
      if (!this.isPageVisible || this.isDragging) return;
      
      const rect = this.moon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      this.vx += deltaX * 0.02;
      this.vy += deltaY * 0.02;
    };

    this.moon.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    this.moon.addEventListener('click', click);
  }

  updateObstacles() {
    this.obstacles = [];
    
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
      const rect = mainTitle.getBoundingClientRect();
      this.obstacles.push({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        element: mainTitle,
        type: 'title'
      });
    }

    const topBanner = document.querySelector('.top-banner');
    if (topBanner) {
      const rect = topBanner.getBoundingClientRect();
      this.obstacles.push({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        element: topBanner,
        type: 'banner'
      });
    }

    const ctaBanner = document.querySelector('.cta-banner');
    if (ctaBanner && !this.isMobile) {
      const rect = ctaBanner.getBoundingClientRect();
      this.obstacles.push({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        element: ctaBanner,
        type: 'banner'
      });
    }

    const navTabs = document.querySelectorAll('.nav-tab');
    const contactItems = document.querySelectorAll('.mobile-contact-item');
    
    [...navTabs, ...contactItems].forEach(element => {
      if (element.closest('.visible')) {
        const rect = element.getBoundingClientRect();
        this.obstacles.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          element: element,
          type: 'ui'
        });
      }
    });
  }

  startAnimation() {
    if (this.isAnimating || !this.isPageVisible) return;
    this.isAnimating = true;
    this.animate();
  }

  animate(currentTime = 0) {
    if (!this.isAnimating || !APP_CONFIG.PHYSICS_ENABLED || !this.isPageVisible) {
      return;
    }

    this.performanceMonitor.update(currentTime);

    if (currentTime - this.lastFrameTime < this.frameInterval) {
      this.animationId = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    this.lastFrameTime = currentTime;

    if (!this.isDragging) {
      const bounds = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      this.vy += this.gravity;
      this.vx *= this.friction;
      this.vy *= this.airResistance;

      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > this.maxSpeed) {
        const ratio = this.maxSpeed / currentSpeed;
        this.vx *= ratio;
        this.vy *= ratio;
      }

      this.x += this.vx;
      this.y += this.vy;

      this.checkBoundaryCollisions(bounds);
      this.checkObstacleCollisions();
      this.checkBlackHoleCollision();
    }

    this.positionMoon();
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  checkObstacleCollisions() {
    this.updateObstacles();
    
    const ballRect = {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };

    this.obstacles.forEach(obstacle => {
      if (this.isColliding(ballRect, obstacle)) {
        this.handleObstacleCollision(obstacle);
      }
    });
  }

  isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  handleObstacleCollision(obstacle) {
    const ballCenterX = this.x + this.size / 2;
    const ballCenterY = this.y + this.size / 2;
    const obstacleCenterX = obstacle.x + obstacle.width / 2;
    const obstacleCenterY = obstacle.y + obstacle.height / 2;

    const deltaX = ballCenterX - obstacleCenterX;
    const deltaY = ballCenterY - obstacleCenterY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.vx *= -this.bounce;
      this.x = deltaX > 0 ? obstacle.x + obstacle.width : obstacle.x - this.size;
    } else {
      this.vy *= -this.bounce;
      this.y = deltaY > 0 ? obstacle.y + obstacle.height : obstacle.y - this.size;
    }

    if (obstacle.type === 'title') {
      if (APP_CONFIG.HAPTICS_ENABLED && navigator.vibrate) {
        navigator.vibrate(25);
      }
      this.titleShakeManager.shakeTitle();
    }
  }

  checkBoundaryCollisions(bounds) {
    if (this.x <= 0 || this.x >= bounds.width - this.size) {
      this.vx *= -this.bounce;
      this.x = this.x <= 0 ? 0 : bounds.width - this.size;
    }

    if (this.y <= 0 || this.y >= bounds.height - this.size) {
      this.vy *= -this.bounce;
      this.y = this.y <= 0 ? 0 : bounds.height - this.size;
      
      if (this.y >= bounds.height - this.size) {
        this.vy *= 0.8;
        this.vx *= 0.95;
      }
    }
  }

  checkBlackHoleCollision() {
    const blackHole = document.getElementById('blackHole');
    if (!blackHole || blackHole.classList.contains('hidden')) return;

    const blackHoleRect = blackHole.getBoundingClientRect();
    const ballCenterX = this.x + this.size / 2;
    const ballCenterY = this.y + this.size / 2;
    const holeCenterX = blackHoleRect.left + blackHoleRect.width / 2;
    const holeCenterY = blackHoleRect.top + blackHoleRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(ballCenterX - holeCenterX, 2) + 
      Math.pow(ballCenterY - holeCenterY, 2)
    );

    if (distance < 80) {
      const attraction = (80 - distance) / 80;
      const forceX = (holeCenterX - ballCenterX) * attraction * 0.03;
      const forceY = (holeCenterY - ballCenterY) * attraction * 0.03;
      
      this.vx += forceX;
      this.vy += forceY;
    }

    if (distance < 20) {
      this.fallIntoHole(holeCenterX, holeCenterY);
    }
  }

  fallIntoHole(holeX, holeY) {
    this.vx = 0;
    this.vy = 0;
    this.isAnimating = false;

    const ballElement = this.moon;
    ballElement.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    ballElement.style.transform = `translate3d(${holeX - 16}px, ${holeY - 16}px, 0) scale(0.1)`;
    ballElement.style.opacity = '0';

    if (APP_CONFIG.HAPTICS_ENABLED && navigator.vibrate) {
      navigator.vibrate([80, 40, 80, 40, 150]);
    }

    this.createScreenFlash();

    setTimeout(() => {
      if (this.isPageVisible) {
        this.showNavigationElements();
      }
    }, 500);

    setTimeout(() => {
      if (this.isPageVisible) {
        this.resetBall();
      }
    }, 5500);
  }

  showNavigationElements() {
    if (!this.isPageVisible) return;
    
    const navContainer = document.getElementById('mobileNavContainer');
    const contactContainer = document.getElementById('mobileContactContainer');
    
    if (navContainer && this.isMobile) {
      navContainer.style.transform = 'translateX(-100px)';
      navContainer.style.opacity = '0';
      navContainer.classList.add('visible');
      
      requestAnimationFrame(() => {
        navContainer.style.transform = 'translateX(0)';
        navContainer.style.opacity = '1';
      });
    }
    
    if (contactContainer && this.isMobile) {
      contactContainer.style.transform = 'translateX(100px)';
      contactContainer.style.opacity = '0';
      contactContainer.classList.add('visible');
      
      setTimeout(() => {
        contactContainer.style.transform = 'translateX(0)';
        contactContainer.style.opacity = '1';
      }, 100);
    }

    setTimeout(() => {
      if (navContainer) {
        navContainer.style.transform = 'translateX(-100px)';
        navContainer.style.opacity = '0';
        setTimeout(() => navContainer.classList.remove('visible'), 400);
      }
      
      if (contactContainer) {
        contactContainer.style.transform = 'translateX(100px)';
        contactContainer.style.opacity = '0';
        setTimeout(() => contactContainer.classList.remove('visible'), 400);
      }
    }, 5000);
  }

  createScreenFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
      flash.style.opacity = '1';
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(flash)) {
            document.body.removeChild(flash);
          }
        }, 200);
      }, 100);
    });
  }

  resetBall() {
    if (!this.isPageVisible) return;
    
    this.x = Math.random() * (window.innerWidth - this.size);
    this.y = 50 + Math.random() * 100;
    this.vx = 0;
    this.vy = 0;

    const ballElement = this.moon;
    ballElement.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    ballElement.style.opacity = '0';
    ballElement.style.transform = `translate3d(${this.x}px, ${this.y - 50}px, 0) scale(0.8)`;

    setTimeout(() => {
      if (this.isPageVisible) {
        ballElement.style.opacity = '1';
        ballElement.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(1)`;
        
        setTimeout(() => {
          if (this.isPageVisible) {
            ballElement.style.transition = 'all 0.04s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.isAnimating = true;
            this.animate();
          }
        }, 500);
      }
    }, 100);
  }

  positionMoon() {
    this.moon.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
  }

  destroy() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

class StatisticsManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateVisitorCount();
    this.updateUserVisits();
    this.updateCurrentDate();
  }

  updateVisitorCount() {
    let globalVisitors = this.getStoredValue('global_visitors_base');
    if (!globalVisitors) {
      globalVisitors = 50000 + Math.floor(Math.random() * 5000);
    }
    globalVisitors = Number(globalVisitors) + 1;
    
    this.setStoredValue('global_visitors_base', globalVisitors);
    this.animateNumber('visitorsCount', globalVisitors);
  }

  updateUserVisits() {
    let userVisits = Number(this.getStoredValue('user_visits') || 0) + 1;
    this.setStoredValue('user_visits', userVisits);
    this.animateNumber('userVisits', userVisits);
  }

  updateCurrentDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      dateElement.textContent = formattedDate;
    }
  }

  animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
      
      element.textContent = this.formatNumber(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  formatNumber(num) {
    return num.toLocaleString();
  }

  getStoredValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  setStoredValue(key, value) {
    try {
      localStorage.setItem(key, value.toString());
    } catch (e) {
      // Storage not available
    }
  }

  destroy() {
    // Cleanup if needed
  }
}

class MotivationalQuotes {
  constructor() {
    this.quotes = [
      "Success starts with one step in the right direction",
      "Every day is a new opportunity to achieve dreams",
      "Believing in yourself is the first step to success",
      "Optimism is the key to solving all problems",
      "Never give up, success is closer than you think",
      "Ambition is the beginning of success and will is its path",
      "Be stronger than your excuses and bigger than your fears",
      "Self-confidence creates miracles in life",
      "Your dream is possible, just start now",
      "Challenges create the strong and the great",
      "Failure is a lesson, not the end of the story",
      "Remember, you are stronger than you think",
      "Patience and persistence are the path to every success",
      "Change your thinking, change your life for the better",
      "A new beginning needs only one moment of courage"
    ];
    
    this.currentIndex = 0;
    this.quoteElement = document.getElementById('motivationalQuote');
    this.isMobile = this.detectMobile();
    this.init();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  }

  init() {
    if (this.quoteElement && !this.isMobile) {
      this.setupClickHandler();
      this.showRandomQuote();
    }
  }

  setupClickHandler() {
    if (this.isMobile) {
      this.quoteElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.changeQuote();
      }, { passive: false });
    } else {
      this.quoteElement.addEventListener('click', () => {
        this.changeQuote();
      });
    }
  }

  showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentIndex = randomIndex;
    this.quoteElement.textContent = this.quotes[randomIndex];
  }

  changeQuote() {
    this.quoteElement.classList.add('changing');

    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * this.quotes.length);
      while (nextIndex === this.currentIndex && this.quotes.length > 1) {
        nextIndex = Math.floor(Math.random() * this.quotes.length);
      }
      
      this.currentIndex = nextIndex;
      this.quoteElement.textContent = this.quotes[nextIndex];
      this.quoteElement.classList.remove('changing');
    }, 250);
  }

  destroy() {
    // Cleanup if needed
  }
}

class App {
  constructor() {
    this.components = new Map();
    this.isInitialized = false;
    this.isPageVisible = true;
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    try {
      this.setupPageVisibilityHandling();
      
      this.components.set('background', new BackgroundManager());
      this.components.set('statistics', new StatisticsManager());
      this.components.set('quotes', new MotivationalQuotes());
      this.components.set('navigation', new NavigationManager());
      this.components.set('touch', new MobileTouchManager());
      this.components.set('physics', new PhysicsMoon());

      this.hideLoadingOverlay();
      
      this.isInitialized = true;
      
      if (APP_CONFIG.DEBUG) {
        console.log('QRBrand application initialized successfully');
      }
      
    } catch (error) {
      console.error('Application initialization failed:', error);
      this.handleInitError();
    }
  }

  setupPageVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      
      if (this.isPageVisible) {
        setTimeout(() => {
          this.reinitializeComponents();
        }, 300);
      }
    }, { passive: true });
    
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
      setTimeout(() => {
        this.reinitializeComponents();
      }, 200);
    }, { passive: true });
    
    window.addEventListener('blur', () => {
      this.isPageVisible = false;
    }, { passive: true });
  }

  reinitializeComponents() {
    if (!this.isPageVisible || !this.isInitialized) return;
    
    const navigation = this.components.get('navigation');
    if (navigation && typeof navigation.reinitializeEventListeners === 'function') {
      navigation.reinitializeEventListeners();
    }
    
    const physics = this.components.get('physics');
    if (physics && !physics.isAnimating) {
      physics.startAnimation();
    }
    
    if (APP_CONFIG.DEBUG) {
      console.log('Components reinitialized');
    }
  }

  hideLoadingOverlay() {
    setTimeout(() => {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
          if (document.body.contains(loadingOverlay)) {
            loadingOverlay.remove();
          }
        }, 300);
      }
    }, 600);
  }

  handleInitError() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.innerHTML = `
        <div style="text-align: center; color: white;">
          <p>Loading failed. Please refresh the page.</p>
          <button onclick="location.reload()" style="
            margin-top: 10px;
            padding: 10px 20px;
            background: #4a9eff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
          ">Refresh</button>
        </div>
      `;
    }
  }

  destroy() {
    this.components.forEach((component) => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
    this.isInitialized = false;
  }
}

// معالج الأخطاء العامة
window.addEventListener('error', (e) => {
  console.error('Runtime error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// دورة حياة الصفحة
window.addEventListener('beforeunload', () => {
  if (window.app && window.app.destroy) {
    window.app.destroy();
  }
});

// تهيئة التطبيق
window.app = new App();