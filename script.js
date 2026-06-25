document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // 3. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  // 4. Portfolio Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          // Smooth fade-in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. Contact Form Simulation (Custom Toast Notification)
  const contactForm = document.getElementById('inquiryForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const agreement = document.getElementById('agree').checked;

      if (!name || !phone) {
        showToast('이름과 연락처를 입력해주세요.', 'error');
        return;
      }

      if (!agreement) {
        showToast('개인정보 수집 및 이용에 동의하셔야 합니다.', 'error');
        return;
      }

      // Simulate sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';

      setTimeout(() => {
        showToast(`${name} 고객님, 견적 및 상담 문의가 성공적으로 접수되었습니다.`, 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1500);
    });
  }

  // Toast Creator Helper
  function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    // Style Toast dynamically in JS to keep CSS clean
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = '#ffffff';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    toast.style.zIndex = '3000';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';

    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Fade out and remove
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 6. Lightbox modal for Portfolio Placeholders and Product Images
  const lightbox = document.getElementById('portfolioLightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
  
  const openLightbox = (src, captionText) => {
    if (lightboxImage) {
      lightboxImage.src = src;
      lightboxImage.style.display = 'block';
    }
    if (lightboxPlaceholder) {
      lightboxPlaceholder.style.display = 'none';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText;
    }
    if (lightbox) {
      lightbox.classList.add('active');
    }
    document.body.classList.add('overflow-hidden');
  };

  document.querySelectorAll('.portfolio-overlay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.portfolio-item');
      const title = item.querySelector('.portfolio-title').textContent;
      const category = item.querySelector('.portfolio-cat').textContent;
      
      // [시공사례 이미지 연동]
      // 포트폴리오 아이템에 실제 <img> 태그가 삽입되어 있으면 팝업창에서도 그 이미지를 보여줍니다.
      const itemImg = item.querySelector('.portfolio-visual-wrapper img');
      if (itemImg) {
        openLightbox(itemImg.src, `[${category}] ${title} - 시공 상세보기`);
      } else {
        if (lightboxImage) {
          lightboxImage.src = '';
          lightboxImage.style.display = 'none';
        }
        if (lightboxPlaceholder) {
          lightboxPlaceholder.style.display = 'flex';
        }
        lightboxCaption.textContent = `[${category}] ${title} - 시공 상세보기`;
        lightbox.classList.add('active');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  // Product Images click to open in lightbox
  document.querySelectorAll('.product-image').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('img');
      if (img) {
        const card = wrapper.closest('.product-card');
        const name = card ? card.querySelector('.product-name').textContent : '제품';
        openLightbox(img.src, `${name} - 상세 제품 이미지`);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  // 7. Products Slider Logic
  const track = document.getElementById('prodSliderTrack');
  const prevBtn = document.getElementById('prodPrevBtn');
  const nextBtn = document.getElementById('prodNextBtn');
  const cards = document.querySelectorAll('.products-slider-track .product-card');

  if (track && prevBtn && nextBtn && cards.length > 0) {
    let currentIndex = 0;

    const updateSlider = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 30; // Matches CSS gap
      const visibleCards = window.innerWidth > 991 ? 2 : 1;
      const maxIndex = cards.length - visibleCards;

      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Update button disabled states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
    };

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      const visibleCards = window.innerWidth > 991 ? 2 : 1;
      const maxIndex = cards.length - visibleCards;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    // Touch support (Swipe gestures for mobile)
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (diff > 50) {
        // Swiped left -> Next
        const visibleCards = window.innerWidth > 991 ? 2 : 1;
        const maxIndex = cards.length - visibleCards;
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateSlider();
        }
      } else if (diff < -50) {
        // Swiped right -> Prev
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      }
    }, { passive: true });

    // Handle window resize dynamically
    window.addEventListener('resize', updateSlider);

    // Initial position trigger after load
    setTimeout(updateSlider, 200);
  }
});
