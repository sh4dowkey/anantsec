
new Vue({
  el: "#app",
  data() {
    return {
      isOpenedTop: false,
      lightboxVisible: false,
      lightboxSrc: "",
      items: [
        {
          img1: "assets/certificates/CCT-cert.png",
          img2: "assets/certificates/google-cert.png",
          img3: "assets/certificates/teachnook-cert.png",
          title: "FOUNDATIONS",
          isOpen: false,
        },
        {
          img1: "assets/certificates/CCT-badge.png",
          img2: "assets/certificates/leetcode-badge.png",
          img3: "assets/album_images/github_workflow.png",
          title: "THE PROCESS",
          isOpen: false,
        },
        {
          img1: "assets/album_images/pwndbg_contribution_pr.png",
          img2: "assets/album_images/crawler_help.png",
          img3: "assets/album_images/crawler_output.png",
          title: "TOOLKIT",
          isOpen: false,
        },
        {
          img1: "assets/certificates/deloitte-jobsim.png",
          img2: "assets/certificates/mastercard-jobsim.png",
          img3: "assets/certificates/datacom-jobsim.png",
          title: "EXPERIENCE",
          isOpen: false,
        },
        {
          img1: "assets/album_images/ad_lab_diagram.png",
          img2: "assets/album_images/htb_logo.png",
          img3: "assets/img/thankyou.webp",
          title: "THE LAB",
          isOpen: false,
        },
        {
          img1: "assets/album_images/crawler_code.png",
          img2: "assets/album_images/ad_lab_readme.png",
          img3: "assets/album_images/stegno_hide_msg.webp",
          title: "PROJECTS",
          isOpen: false,
        },
      ],
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
    };
  },
  methods: {
    topOpen() {
      this.isOpenedTop = !this.isOpenedTop;
      this.announceToScreenReader(this.isOpenedTop ? 'Album opened' : 'Album closed');
    },
    open(idx, isOpen) {
      if (this.isOpenedTop) {
        this.items[idx].isOpen = !isOpen;
        this.announceToScreenReader(`Page ${idx + 1}: ${this.items[idx].title} ${!isOpen ? 'opened' : 'closed'}`);
      }
    },
    reset() {
      this.items.forEach((item) => (item.isOpen = false));
      this.isOpenedTop = false;
      this.announceToScreenReader('Album reset');
    },
    showLightbox(src) {
      this.lightboxSrc = src;
      this.lightboxVisible = true;
      document.body.style.overflow = 'hidden';
      this.announceToScreenReader('Image opened in lightbox. Press Escape to close.');
    },
    hideLightbox() {
      this.lightboxVisible = false;
      this.lightboxSrc = "";
      document.body.style.overflow = '';
      this.announceToScreenReader('Lightbox closed');
    },
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    },
    handleSwipe() {
      const horizontalDiff = this.touchEndX - this.touchStartX;
      const verticalDiff = Math.abs(this.touchEndY - this.touchStartY);
      
      // Only handle horizontal swipes (not vertical scrolls)
      if (Math.abs(horizontalDiff) > 50 && verticalDiff < 50) {
        const currentOpenIndex = this.items.findIndex(item => item.isOpen);
        
        if (horizontalDiff < 0) {
          // Swipe left - next page
          if (currentOpenIndex !== -1 && currentOpenIndex < this.items.length - 1) {
            this.open(currentOpenIndex + 1, false);
          }
        } else {
          // Swipe right - previous page
          if (currentOpenIndex > 0) {
            this.open(currentOpenIndex - 1, false);
          }
        }
      }
    },
    announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  },
  mounted() {
    // Keyboard listener for Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.lightboxVisible) {
          this.hideLightbox();
        } else if (this.isOpenedTop) {
          this.reset();
        }
      }
    });
    
    // Touch event listeners for swipe
    const album = document.querySelector('.album');
    if (album) {
      album.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      album.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }
    
    // Announce initial state
    this.announceToScreenReader('Gallery album ready. Click to explore pages.');
  }
});