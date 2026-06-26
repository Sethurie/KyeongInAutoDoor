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

  // 4. Portfolio Slider & Filter Logic Combined
  const portTrack = document.getElementById('portSliderTrack');
  const portPrevBtn = document.getElementById('portPrevBtn');
  const portNextBtn = document.getElementById('portNextBtn');
  const allPortfolioItems = document.querySelectorAll('.portfolio-slider-track .portfolio-item');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (portTrack && portPrevBtn && portNextBtn && allPortfolioItems.length > 0) {
    let portCurrentIndex = 0;
    let currentFilter = 'all';

    // Get current visible items
    const getVisibleItems = () => {
      return Array.from(allPortfolioItems).filter(item => {
        return currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
      });
    };

    const updatePortSlider = () => {
      const visibleItems = getVisibleItems();
      const visibleCount = visibleItems.length;

      // Handle desktop (3 items), tablet (2 items), mobile (1 item)
      let visibleCards = 3;
      if (window.innerWidth <= 768) {
        visibleCards = 1;
      } else if (window.innerWidth <= 991) {
        visibleCards = 2;
      }

      const maxIndex = Math.max(0, visibleCount - visibleCards);

      if (portCurrentIndex < 0) portCurrentIndex = 0;
      if (portCurrentIndex > maxIndex) portCurrentIndex = maxIndex;

      // Calculate width of a single card
      if (visibleCount > 0) {
        const cardWidth = visibleItems[0].getBoundingClientRect().width;
        const gap = 30; // Matches CSS gap
        const offset = portCurrentIndex * (cardWidth + gap);
        portTrack.style.transform = `translateX(-${offset}px)`;
      } else {
        portTrack.style.transform = 'translateX(0)';
      }

      // Update button disabled states
      portPrevBtn.disabled = portCurrentIndex === 0;
      portNextBtn.disabled = portCurrentIndex >= maxIndex;
      
      // Hide slide buttons if all matching items fit in view
      if (visibleCount <= visibleCards) {
        portPrevBtn.style.opacity = '0';
        portPrevBtn.style.pointerEvents = 'none';
        portNextBtn.style.opacity = '0';
        portNextBtn.style.pointerEvents = 'none';
      } else {
        portPrevBtn.style.opacity = '1';
        portPrevBtn.style.pointerEvents = 'auto';
        portNextBtn.style.opacity = '1';
        portNextBtn.style.pointerEvents = 'auto';
      }
    };

    // Filter action
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentFilter = btn.getAttribute('data-filter');
        portCurrentIndex = 0; // Reset index to beginning on filter change

        // Temporarily reset track offset so layout calculations are clean
        portTrack.style.transition = 'none';
        portTrack.style.transform = 'translateX(0)';

        // Show/hide elements to trigger layout change
        allPortfolioItems.forEach(item => {
          if (currentFilter === 'all' || item.getAttribute('data-category') === currentFilter) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
          }
        });

        // Re-enable transition and update slider positioning after elements reflow
        setTimeout(() => {
          portTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
          updatePortSlider();
        }, 50);
      });
    });

    // Prev/Next Button Events
    portPrevBtn.addEventListener('click', () => {
      if (portCurrentIndex > 0) {
        portCurrentIndex--;
        updatePortSlider();
      }
    });

    portNextBtn.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const visibleCount = visibleItems.length;
      
      let visibleCards = 3;
      if (window.innerWidth <= 768) {
        visibleCards = 1;
      } else if (window.innerWidth <= 991) {
        visibleCards = 2;
      }
      
      const maxIndex = Math.max(0, visibleCount - visibleCards);
      if (portCurrentIndex < maxIndex) {
        portCurrentIndex++;
        updatePortSlider();
      }
    });

    // Touch support (Swipe gestures for mobile)
    let startX = 0;
    let endX = 0;

    portTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    portTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (diff > 50) {
        // Swiped left -> Next
        const visibleItems = getVisibleItems();
        const visibleCount = visibleItems.length;
        let visibleCards = 3;
        if (window.innerWidth <= 768) {
          visibleCards = 1;
        } else if (window.innerWidth <= 991) {
          visibleCards = 2;
        }
        const maxIndex = Math.max(0, visibleCount - visibleCards);
        if (portCurrentIndex < maxIndex) {
          portCurrentIndex++;
          updatePortSlider();
        }
      } else if (diff < -50) {
        // Swiped right -> Prev
        if (portCurrentIndex > 0) {
          portCurrentIndex--;
          updatePortSlider();
        }
      }
    }, { passive: true });

    // Handle window resize dynamically
    window.addEventListener('resize', updatePortSlider);

    // Initial position trigger after load
    setTimeout(updatePortSlider, 200);
  }

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
  const lightboxPrevBtn = document.querySelector('.lightbox-prev');
  const lightboxNextBtn = document.querySelector('.lightbox-next');
  
  let lightboxImages = [];
  let currentImgIndex = 0;

  const openLightbox = (srcOrArray, captionText) => {
    if (Array.isArray(srcOrArray)) {
      lightboxImages = srcOrArray;
      currentImgIndex = 0;
      if (lightboxImage) {
        lightboxImage.src = lightboxImages[currentImgIndex];
        lightboxImage.style.display = 'block';
      }
      if (lightboxPrevBtn && lightboxNextBtn) {
        lightboxPrevBtn.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
        lightboxNextBtn.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
      }
    } else {
      lightboxImages = [srcOrArray];
      currentImgIndex = 0;
      if (lightboxImage) {
        lightboxImage.src = srcOrArray;
        lightboxImage.style.display = 'block';
      }
      if (lightboxPrevBtn && lightboxNextBtn) {
        lightboxPrevBtn.style.display = 'none';
        lightboxNextBtn.style.display = 'none';
      }
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

  const showNextImage = () => {
    if (lightboxImages.length <= 1) return;
    currentImgIndex = (currentImgIndex + 1) % lightboxImages.length;
    if (lightboxImage) {
      lightboxImage.src = lightboxImages[currentImgIndex];
    }
  };

  const showPrevImage = () => {
    if (lightboxImages.length <= 1) return;
    currentImgIndex = (currentImgIndex - 1 + lightboxImages.length) % lightboxImages.length;
    if (lightboxImage) {
      lightboxImage.src = lightboxImages[currentImgIndex];
    }
  };

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextImage();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevImage();
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      }
    }
  });

  document.querySelectorAll('.portfolio-overlay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.portfolio-item');
      const title = item.querySelector('.portfolio-title').textContent;
      const category = item.querySelector('.portfolio-cat').textContent;
      
      // [시공사례 이미지 연동]
      // 포트폴리오 아이템에 실제 <img> 태그가 삽입되어 있으면 팝업창에서도 그 이미지를 보여줍니다.
      const itemImgs = item.querySelectorAll('.portfolio-visual-wrapper img');
      if (itemImgs.length > 0) {
        const imgSrcs = Array.from(itemImgs).map(img => img.src);
        openLightbox(imgSrcs, `[${category}] ${title} - 시공 상세보기`);
      } else {
        if (lightboxImage) {
          lightboxImage.src = '';
          lightboxImage.style.display = 'none';
        }
        if (lightboxPlaceholder) {
          lightboxPlaceholder.style.display = 'flex';
        }
        lightboxCaption.textContent = `[${category}] ${title} - 시공 상세보기`;
        if (lightboxPrevBtn && lightboxNextBtn) {
          lightboxPrevBtn.style.display = 'none';
          lightboxNextBtn.style.display = 'none';
        }
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
      
      let visibleCards = 3;
      if (window.innerWidth <= 768) {
        visibleCards = 1;
      } else if (window.innerWidth <= 991) {
        visibleCards = 2;
      }
      
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Update button disabled states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;

      // Hide slide buttons if all items fit in view
      if (cards.length <= visibleCards) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    };

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      let visibleCards = 3;
      if (window.innerWidth <= 768) {
        visibleCards = 1;
      } else if (window.innerWidth <= 991) {
        visibleCards = 2;
      }
      const maxIndex = Math.max(0, cards.length - visibleCards);
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
        let visibleCards = 3;
        if (window.innerWidth <= 768) {
          visibleCards = 1;
        } else if (window.innerWidth <= 991) {
          visibleCards = 2;
        }
        const maxIndex = Math.max(0, cards.length - visibleCards);
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

  // 8. Terms & Privacy Modal Logic
  const policyModal = document.getElementById('policyModal');
  const policyModalClose = document.getElementById('policyModalClose');
  const policyModalTitle = document.getElementById('policyModalTitle');
  const policyModalBody = document.getElementById('policyModalBody');

  const openTermsLink = document.getElementById('openTermsLink');
  const openPrivacyLink = document.getElementById('openPrivacyLink');
  const openPrivacyFormLink = document.getElementById('openPrivacyFormLink');

  const termsHTML = `
    <div class="policy-text">
      <h4>제 1 조 (목적)</h4>
      <p>본 약관은 경인자동문(이하 "회사")이 제공하는 웹사이트 서비스(이하 "서비스")의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
      
      <h4>제 2 조 (용어의 정의)</h4>
      <p>1. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 말합니다.<br>
      2. "견적문의"란 이용자가 홈페이지를 통해 견적 상담 및 부품 문의를 남기는 행위를 말합니다.</p>
      
      <h4>제 3 조 (서비스의 제공 및 변경)</h4>
      <p>1. 회사는 이용자에게 회사 소개, 시공사례 안내, 무료 견적 상담 신청 접수 등의 서비스를 제공합니다.<br>
      2. 회사는 기술적 사양의 변경이나 운영상 필요시 서비스 내용을 변경할 수 있으며, 이로 인해 발생한 이용자의 불이익에 대해 책임을 지지 않습니다.</p>
      
      <h4>제 4 조 (이용자의 의무)</h4>
      <p>이용자는 다음 각 호의 행위를 하여서는 안 됩니다.<br>
      1. 신청 또는 변경 시 허위 내용 등록<br>
      2. 타인의 정보 도용<br>
      3. 회사가 게시한 정보의 무단 변경 또는 도용<br>
      4. 회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
      
      <h4>제 5 조 (책임 제한)</h4>
      <p>1. 회사는 천재지변, 서비스 설비 장애 또는 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.<br>
      2. 회사는 이용자가 서비스를 이용해 얻은 정보나 자료에 대하여 어떠한 보증도 하지 않으며, 이로 인해 발생한 직·간접적 손해에 대해 책임을 지지 않습니다.</p>
      
      <h4>제 6 조 (관할 법원)</h4>
      <p>서비스 이용과 관련하여 발생한 분쟁에 대해서는 회사의 본사 소재지 관할 법원을 합의 관할 법원으로 합니다.</p>
    </div>
  `;

  const privacyHTML = `
    <div class="policy-text">
      <h4>1. 개인정보의 수집 및 이용 목적</h4>
      <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 관련 법률에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br>
      - <strong>고객 상담 및 서비스 제공:</strong> 홈페이지를 통한 견적문의 접수, 시공 및 A/S 상담 신청에 대한 원활한 의사소통 및 결과 회신.</p>
      
      <h4>2. 개인정보의 수집 항목 및 방법</h4>
      <p>회사는 홈페이지 내 견적 신청 양식을 통해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.<br>
      - <strong>수집 항목:</strong> 고객명/업체명, 연락처, 문의제품구분, 문의 상세 내용<br>
      - <strong>수집 방법:</strong> 홈페이지 견적문의 신청 양식 작성을 통한 이용자의 자발적 동의 및 입력.</p>
      
      <h4>3. 개인정보의 보유 및 이용 기간</h4>
      <p>이용자의 개인정보는 수집 및 이용 목적이 달성되면 지체 없이 파기함을 원칙으로 합니다. 단, 고객 응대 이력 관리 및 분쟁 예방을 위해 다음의 기간 동안 보관할 수 있습니다.<br>
      - <strong>보존 기간:</strong> 상담 접수 및 처리 완료일로부터 1년 (이용자가 삭제 요청 시 즉시 파기)</p>
      
      <h4>4. 개인정보의 제3자 제공</h4>
      <p>회사는 이용자의 개인정보를 제3자에게 제공하지 않으며, 외부에 유출하지 않습니다. 관련 법령에 따른 요구가 있을 경우에만 예외적으로 제공합니다.</p>
      
      <h4>5. 정보주체의 권리·의무 및 행사 방법</h4>
      <p>이용자는 언제든지 회사에 대하여 개인정보의 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있으며, 이메일 또는 전화를 통해 연락 주시면 지체 없이 조치하겠습니다.</p>
      
      <h4>6. 개인정보 보호책임자 및 연락처</h4>
      <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br>
      - <strong>보호책임자 / 담당자:</strong> 이흥만<br>
      - <strong>전화번호:</strong> 010-9889-1946<br>
      - <strong>이메일:</strong> hung19466@naver.com</p>
    </div>
  `;

  const showPolicyModal = (type) => {
    if (!policyModal || !policyModalTitle || !policyModalBody) return;

    if (type === 'terms') {
      policyModalTitle.textContent = '이용약관';
      policyModalBody.innerHTML = termsHTML;
    } else if (type === 'privacy') {
      policyModalTitle.textContent = '개인정보처리방침';
      policyModalBody.innerHTML = privacyHTML;
    }

    policyModal.classList.add('active');
    document.body.classList.add('overflow-hidden');
  };

  const closePolicyModal = () => {
    if (policyModal) {
      policyModal.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (openTermsLink) {
    openTermsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPolicyModal('terms');
    });
  }

  if (openPrivacyLink) {
    openPrivacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPolicyModal('privacy');
    });
  }

  if (openPrivacyFormLink) {
    openPrivacyFormLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPolicyModal('privacy');
    });
  }

  if (policyModalClose) {
    policyModalClose.addEventListener('click', closePolicyModal);
  }

  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) {
        closePolicyModal();
      }
    });
  }
});
