new Vue({
  el: "#app",
  data() {
    return {
      isOpenedTop: false,
      // Data for the preview feature
      lightboxVisible: false,
      lightboxSrc: "",
      // CORRECTED: The items array with your professional portfolio content
      items: [
        // Page 1: FOUNDATIONS
        {
          img1: "assets/certificates/01-google-cybersecurity.png",
          img2: "assets/certificates/01-owasp-api-security-top-10-badge.png",
          img3: "assets/certificates/02-teachnook-cybersecurity.png",
          title: "FOUNDATIONS",
          isOpen: false,
        },
        // Page 2: THE PROCESS
        {
          img1: "assets/certificates/02-leetcode-100days-badge.png",
          img2: "assets/album_images/notebook_MITRE ATT&CK.png",
          img3: "assets/album_images/github_workflow.png",
          title: "THE PROCESS",
          isOpen: false,
        },
        // Page 3: TOOLKIT & CODE
        {
          img1: "assets/album_images/pwndbg_contribution_pr.png",
          img2: "assets/album_images/crawler_help.png",
          img3: "assets/album_images/crawler_output.png",
          title: "TOOLKIT",
          isOpen: false,
        },
        // Page 4: VIRTUAL EXPERIENCE
        {
          img1: "assets/certificates/03-deloitte-jobsim.png",
          img2: "assets/certificates/04-mastercard-jobsim.png",
          img3: "assets/certificates/02-datacom-jobsim.png",
          title: "EXPERIENCE",
          isOpen: false,
        },
        // Page 5: THE LAB
        {
          img1: "assets/album_images/ad_lab_diagram.png",
          img2: "assets/album_images/htb_logo.png",
          img3: "assets/img/thankyou.webp",
          title: "THE LAB",
          isOpen: false,
        },
        // page 6:PROJECTS
        {
          img1: "assets/album_images/crawler_code.png",
          img2: "assets/album_images/ad_lab_readme.png",
          img3: "assets/album_images/stegno_hide_msg.webp",
          title: "PROJECTS",
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    // Original methods
    topOpen() {
      this.isOpenedTop = !this.isOpenedTop;
    },
    open(idx, isOpen) {
      if (this.isOpenedTop) {
        this.items[idx].isOpen = !isOpen;
      }
    },
    reset() {
      this.items.forEach((item) => (item.isOpen = false));
      this.isOpenedTop = false;
    },

    // New methods for the preview feature
    showLightbox(src) {
      this.lightboxSrc = src;
      this.lightboxVisible = true;
    },
    hideLightbox() {
      this.lightboxVisible = false;
      this.lightboxSrc = "";
    },
  },
  mounted() {
    // Add keyboard listener for closing the lightbox with the Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightboxVisible) {
        this.hideLightbox();
      }
    });
  }
});