// Enhanced Gallery Animation System
// Add this to your existing JavaScript

// Animation configuration
const animationConfig = {
    perspective: 1000,
    rotationIntensity: 0.05,
    floatRange: 15,
    scaleRange: 0.05,
    colorShiftIntensity: 10,
    blurMax: 5,
    glowIntensity: 0.3,
    staggerDelay: 50,
    transitionSpeed: 0.8,
    zoomRange: 0.1
  };
  
  // Create advanced parallax and animation effects
  function setupAdvancedAnimations() {
    // Get all gallery items that can be animated
    const items = document.querySelectorAll('.gallery-item');
    
    // Set initial 3D perspective on the gallery container
    const gallery = document.getElementById('gallery');
    gallery.style.perspective = `${animationConfig.perspective}px`;
    
    // Create a new animation timeline
    let animations = [];
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';
    let ticking = false;
    
    // Initialize animation properties for each item
    items.forEach((item, index) => {
      // Add custom animation properties to each item
      item.dataset.rotationX = Math.random() * 10 - 5;
      item.dataset.rotationY = Math.random() * 10 - 5;
      item.dataset.floatOffset = Math.random() * animationConfig.floatRange - (animationConfig.floatRange / 2);
      item.dataset.scaleOffset = 1 + (Math.random() * animationConfig.scaleRange);
      item.dataset.hueRotate = Math.random() * 360;
      
      // Add 3D transform style
      item.style.transformStyle = 'preserve-3d';
      item.style.backfaceVisibility = 'hidden';
      
      // Add staggered transition delays
      item.style.transitionDelay = `${index * animationConfig.staggerDelay}ms`;
      item.style.transition = `transform ${animationConfig.transitionSpeed}s cubic-bezier(0.23, 1, 0.32, 1), 
                              opacity ${animationConfig.transitionSpeed}s ease,
                              filter ${animationConfig.transitionSpeed}s ease`;
      
      // Create reflective surface effect
      const reflection = document.createElement('div');
      reflection.className = 'reflection';
      reflection.style.position = 'absolute';
      reflection.style.top = '0';
      reflection.style.left = '0';
      reflection.style.width = '100%';
      reflection.style.height = '100%';
      reflection.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0))';
      reflection.style.transform = 'translateZ(1px)';
      reflection.style.pointerEvents = 'none';
      reflection.style.opacity = '0';
      reflection.style.transition = 'opacity 0.5s ease';
      item.appendChild(reflection);
      
      // Add mouseover effects for each item
      item.addEventListener('mouseover', () => {
        item.style.zIndex = '10';
        reflection.style.opacity = '0.7';
      });
      
      item.addEventListener('mouseout', () => {
        item.style.zIndex = '1';
        reflection.style.opacity = '0';
      });
    });
    
    // Main scroll animation handler
    function animateOnScroll() {
      // Determine scroll direction
      scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = window.scrollY;
      
      // Calculate viewport metrics
      const viewportHeight = window.innerHeight;
      const viewportMiddle = window.scrollY + (viewportHeight / 2);
      
      // Update animations for each item
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemMiddle = rect.top + window.scrollY + (rect.height / 2);
        
        // Calculate how far the item is from the middle of the viewport (normalized from -1 to 1)
        const distanceFromMiddle = (itemMiddle - viewportMiddle) / (viewportHeight / 2);
        const absDistance = Math.abs(distanceFromMiddle);
        
        // Only animate items that are in or near the viewport
        if (absDistance < 1.5) {
          // Calculate item visibility (0 to 1)
          const visibility = 1 - (absDistance / 1.5);
          
          // Apply 3D rotation based on scroll position and direction
          const rotationXAmount = parseFloat(item.dataset.rotationX) * distanceFromMiddle * animationConfig.rotationIntensity;
          const rotationYAmount = parseFloat(item.dataset.rotationY) * distanceFromMiddle * animationConfig.rotationIntensity;
          
          // Apply floating effect
          const floatAmount = parseFloat(item.dataset.floatOffset) * Math.sin(Date.now() / 1000);
          
          // Apply scale effect based on visibility
          const scaleAmount = 1 + ((1 - absDistance) * animationConfig.zoomRange);
          
          // Apply color effects based on scroll direction and position
          const hueRotateAmount = scrollDirection === 'down' ? 
            parseFloat(item.dataset.hueRotate) * visibility : 
            -parseFloat(item.dataset.hueRotate) * visibility;
          
          // Apply blur effect for items far from center
          const blurAmount = Math.max(0, (absDistance - 0.5) * animationConfig.blurMax);
          
          // Apply transforms with timing offsets for wave effect
          const delay = parseInt(item.dataset.index) * 20;
          setTimeout(() => {
            // Apply all transform effects
            item.style.transform = `
              perspective(${animationConfig.perspective}px)
              translate3d(0, ${floatAmount}px, 0)
              rotateX(${rotationXAmount}deg)
              rotateY(${rotationYAmount}deg)
              scale(${scaleAmount})
            `;
            
            // Apply filter effects (color shifts, blur, glow)
            item.style.filter = `
              hue-rotate(${hueRotateAmount}deg)
              blur(${blurAmount}px)
              brightness(${1 + (visibility * 0.1)})
            `;
            
            // Apply box shadow glow effect based on visibility
            item.style.boxShadow = `0 ${5 + (visibility * 15)}px ${20 + (visibility * 30)}px rgba(52, 152, 219, ${visibility * animationConfig.glowIntensity})`;
            
            // Adjust image saturation based on visibility
            const image = item.querySelector('img');
            if (image) {
              image.style.filter = `saturate(${1 + (visibility * 0.5)})`;
            }
          }, delay);
        }
      });
      
      ticking = false;
    }
    
    // Optimize scroll handler with requestAnimationFrame
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          animateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial animation
    animateOnScroll();
    
    // Add scroll-triggered animation sequences
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList()
    };
    
    function buildThresholdList() {
      let thresholds = [];
      let numSteps = 20;
      for (let i = 0; i <= numSteps; i++) {
        thresholds.push(i / numSteps);
      }
      return thresholds;
    }
    
    const sequenceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Create a progressive animation effect when items come into view
        if (entry.isIntersecting) {
          const item = entry.target;
          const ratio = entry.intersectionRatio;
          
          // Apply a smooth fade-in with progressive transforms
          const progressiveScale = 0.8 + (0.2 * ratio);
          const progressiveY = 50 * (1 - ratio);
          const progressiveOpacity = ratio;
          
          item.style.transform = `translateY(${progressiveY}px) scale(${progressiveScale})`;
          item.style.opacity = progressiveOpacity;
          
          // Apply whimsical rotations for items coming into view
          if (ratio > 0.8) {
            const randomRotate = (Math.random() * 10) - 5;
            item.style.transform = `translateY(0) scale(1) rotate(${randomRotate}deg)`;
          }
        }
      });
    }, observerOptions);
    
    // Observe all gallery items for sequence animations
    items.forEach(item => {
      sequenceObserver.observe(item);
    });
    
    // Add animated grid layout changes on scroll
    let lastScrollPosition = 0;
    let gridAnimationTicking = false;
    
    function updateGridLayout() {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const currentScrollPosition = window.scrollY;
      
      // Check if we've scrolled enough to trigger layout change
      if (Math.abs(currentScrollPosition - lastScrollPosition) > 100) {
        // Change grid layout dynamically based on scroll position
        const columns = 1 + Math.floor(scrollProgress * 5); // Varies between 1-5 columns
        const baseSize = 150 + Math.floor(Math.sin(scrollProgress * Math.PI) * 50);
        
        gallery.style.gridTemplateColumns = `repeat(auto-fill, minmax(${baseSize}px, 1fr))`;
        
        // Add staggered movement for items
        items.forEach((item, index) => {
          const staggerDelay = index * 30;
          setTimeout(() => {
            item.style.transition = `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)`;
          }, staggerDelay);
        });
        
        lastScrollPosition = currentScrollPosition;
      }
      
      gridAnimationTicking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!gridAnimationTicking) {
        requestAnimationFrame(updateGridLayout);
        gridAnimationTicking = true;
      }
    });
    
    // Initialize scroll-triggered animations
    animateOnScroll();
    updateGridLayout();
  }
  
  // Initialize effects when the document is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for particle effects
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .gallery-item {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        will-change: transform, opacity, filter;
      }
      
      .gallery-item::before {
        content: '';
        position: absolute;
        top: -10%;
        left: -10%;
        width: 120%;
        height: 120%;
        background: radial-gradient(circle at center, rgba(52, 152, 219, 0.2), transparent 70%);
        opacity: 0;
        transform: translateZ(-1px);
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      
      .gallery-item:hover::before {
        opacity: 1;
      }
      
      .gallery-item .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
      }
      
      .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
      }
      
      @keyframes floatingCard {
        0% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(2deg); }
        50% { transform: translateY(0) rotate(0deg); }
        75% { transform: translateY(10px) rotate(-2deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }
      
      @keyframes glowPulse {
        0% { box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2); }
        50% { box-shadow: 0 5px 30px rgba(52, 152, 219, 0.6); }
        100% { box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2); }
      }
      
      .gallery-item.in-view {
        animation: floatingCard 6s ease-in-out infinite, glowPulse 4s ease-in-out infinite;
      }
      
      .gallery-container {
        perspective: 1000px;
      }
      
      /* Dynamic grid layout animation */
      @keyframes gridFlux {
        0% { grid-gap: 1.5rem; }
        50% { grid-gap: 2rem; }
        100% { grid-gap: 1.5rem; }
      }
      
      .gallery {
        animation: gridFlux 15s ease-in-out infinite;
        transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add particle effects to images
    function createParticles() {
      document.querySelectorAll('.gallery-item').forEach(item => {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        
        // Create random particles for each gallery item
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          // Random size
          const size = Math.random() * 4 + 1;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          // Random position
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          
          // Create unique animation
          const duration = Math.random() * 20 + 10;
          const delay = Math.random() * 5;
          
          particle.style.animation = `
            float ${duration}s ease-in-out ${delay}s infinite alternate,
            pulse ${duration/2}s ease-in-out ${delay}s infinite alternate
          `;
          
          particleContainer.appendChild(particle);
        }
        
        item.appendChild(particleContainer);
        
        // Add mousemove parallax effect
        item.addEventListener('mousemove', (e) => {
          const boundingRect = item.getBoundingClientRect();
          const x = e.clientX - boundingRect.left;
          const y = e.clientY - boundingRect.top;
          
          const xPercent = x / boundingRect.width;
          const yPercent = y / boundingRect.height;
          
          const image = item.querySelector('img');
          const caption = item.querySelector('.caption');
          
          // Move image slightly in opposite direction of mouse
          image.style.transform = `translate(${(xPercent - 0.5) * -10}px, ${(yPercent - 0.5) * -10}px) scale(1.1)`;
          
          // Move caption with mouse
          if (caption) {
            caption.style.transform = `translate(${(xPercent - 0.5) * 5}px, ${(yPercent - 0.5) * 5}px)`;
          }
          
          // Move particles for depth effect
          const particles = item.querySelectorAll('.particle');
          particles.forEach((particle, index) => {
            const depth = (index % 5) + 1;
            particle.style.transform = `translate(${(xPercent - 0.5) * depth * 20}px, ${(yPercent - 0.5) * depth * 20}px)`;
          });
        });
        
        // Reset transforms when mouse leaves
        item.addEventListener('mouseleave', () => {
          const image = item.querySelector('img');
          const caption = item.querySelector('.caption');
          const particles = item.querySelectorAll('.particle');
          
          image.style.transform = '';
          if (caption) caption.style.transform = '';
          particles.forEach(particle => {
            particle.style.transform = '';
          });
        });
      });
    }
    
    // Initialize advanced animations
    setupAdvancedAnimations();
    createParticles();
    
    // Add keyframe animations for particles
    const particleStyles = document.createElement('style');
    particleStyles.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0); }
        100% { transform: translate(20px, 20px); }
      }
      
      @keyframes pulse {
        0% { opacity: 0; }
        50% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(particleStyles);
  });