// Footer injector - adds footer CSS styles and HTML
window.addEventListener("DOMContentLoaded", () => {
  // Inject footer styles if not already present
  if (!document.getElementById('footer-injected-styles')) {
    const style = document.createElement('style');
    style.id = 'footer-injected-styles';
    style.textContent = `
      .footer {
        background: #000000;
        color: #cccccc;
        padding: 4rem 0 2rem;
        margin-top: auto;
      }
      .footer .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .footer .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 3rem; }
      .footer .footer-section h3 { color: #ffffff; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: 2px; }
      .footer .footer-section h4 { color: #ffffff; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; letter-spacing: 1px; text-transform: uppercase; }
      .footer .footer-section p { color: #cccccc; font-size: 0.9rem; line-height: 1.8; margin-bottom: 0.5rem; }
      .footer .footer-section ul { list-style: none; padding: 0; }
      .footer .footer-section ul li { margin-bottom: 0.5rem; }
      .footer .footer-section ul li a { color: #cccccc; text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
      .footer .footer-section ul li a:hover { color: #ffffff; }
      .footer .footer-bottom { border-top: 1px solid #333; padding-top: 2rem; text-align: center; }
      .footer .footer-bottom p { color: #666; font-size: 0.85rem; }
      @media (max-width: 540px) {
        .footer .footer-content { flex-direction: column !important; gap: 24px !important; }
        .footer .footer-section { min-width: 100% !important; }
      }

    `;
    document.head.appendChild(style);
  }

  // Inject footer HTML - always replace existing to keep links clean and synced
  const existingFooters = document.querySelectorAll('footer.footer');
  existingFooters.forEach(f => f.remove());

  const footerHTML = `
  <footer class="footer">
      <div class="container">
          <div class="footer-content" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 30px;">
              <div class="footer-section" style="flex: 1; min-width: 250px;">
                  <h3>KURAJ FASHION</h3>
                  <p>Redefining luxury through exclusive access and unparalleled craftsmanship.</p>
                  <div style="margin-top: 20px;">
                      <h4 style="margin-bottom: 10px;">Contact Us</h4>
                      <p style="margin: 0; color: #999;">Email: support@kurajfashion.com</p>
                      <p style="margin: 0; color: #999;">Phone: +1 (800) 587-2584</p>
                      <p style="margin: 0; color: #999;">Hours: Mon-Sun: 8AM-10PM EST</p>
                  </div>
              </div>
              <div class="footer-section" style="flex: 1; min-width: 150px;">
                  <h4>Collections</h4>
                  <ul>
                      <li><a href="/collections/watches.html">Watches</a></li>
                      <li><a href="/collections/handbags.html">Handbags</a></li>
                      <li><a href="/collections/mens-apparel.html">Mens Apparel</a></li>
                      <li><a href="/collections/womens-apparel.html">Womens Apparel</a></li>
                  </ul>
              </div>
              <div class="footer-section" style="flex: 1; min-width: 150px;">
                  <h4>Legal</h4>
                  <ul>
                      <li><a href="/legal/terms-conditions">Terms & Conditions</a></li>
                      <li><a href="/legal/privacy-policy">Privacy Policy</a></li>
                      <li><a href="/legal/shipping">Shipping Information</a></li>
                      <li><a href="/legal/returns">Returns & Exchanges</a></li>
                      <li><a href="/legal/authentication">Authentication Guarantee</a></li>
                  </ul>
              </div>
              <div class="footer-section" style="flex: 1; min-width: 150px;">
                  <h4>Newsletter</h4>
                  <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                  <form class="footer-newsletter" style="margin-top: 15px; display: flex;">
                      <input type="email" placeholder="Enter your email address" style="padding: 10px; width: 100%; border: 1px solid #333; background: #111; color: white;">
                      <button type="submit" style="padding: 10px 20px; background: black; color: white; border: 1px solid white; cursor: pointer; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='white'; this.style.color='black';" onmouseout="this.style.background='black'; this.style.color='white';">SUBSCRIBE</button>
                  </form>
              </div>
          </div>
          <div class="footer-bottom" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px;">
              <p>&copy; ${new Date().getFullYear()} Kuraj Fashion. All rights reserved.</p>
          </div>
      </div>
  </footer>
  `;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = footerHTML;
  const newFooter = tempDiv.firstElementChild;
  
  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
      placeholder.parentNode.insertBefore(newFooter, placeholder);
      placeholder.remove();
  } else {
      document.body.appendChild(newFooter);
  }
});
