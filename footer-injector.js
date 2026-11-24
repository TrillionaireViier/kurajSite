// Kuraj Fashion - Global Master Footer Injector
(function() {
  function injectFooter() {
    // 1. Inject footer styles if not present
    if (!document.getElementById('footer-injected-styles')) {
      const style = document.createElement('style');
      style.id = 'footer-injected-styles';
      style.textContent = `
        body {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .footer {
          background: #000000 !important;
          color: #cccccc !important;
          padding: 4rem 0 2rem !important;
          margin-top: auto !important;
          width: 100% !important;
          position: relative !important;
          z-index: 10 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-sizing: border-box !important;
        }
        .footer .container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        .footer a {
          color: #a0a0a0 !important;
          text-decoration: none !important;
          transition: color 0.2s ease !important;
        }
        .footer a:hover {
          color: #ffffff !important;
        }
      `;
      document.head.appendChild(style);
    }

    const masterFooterHTML = `
    <footer class="footer" id="siteFooter">
        <div class="container">
            <div class="footer-content" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px;">
                <div class="footer-section" style="flex: 1.3; min-width: 260px;">
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; letter-spacing: 2px; color: #ffffff; margin: 0 0 14px 0;">KURAJ FASHION</h3>
                    <p style="color: #a0a0a0; font-size: 0.92rem; line-height: 1.7; margin: 0 0 20px 0;">Redefining luxury through exclusive access, verified authenticity, and unparalleled craftsmanship.</p>
                    <div style="margin-top: 15px;">
                        <h4 style="color: #ffffff; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 10px 0;">Contact Us</h4>
                        <p style="margin: 4px 0; color: #888888; font-size: 0.9rem;">Email: <a href="mailto:support@kurajfashion.com" style="color: #cccccc;">support@kurajfashion.com</a></p>
                        <p style="margin: 4px 0; color: #888888; font-size: 0.9rem;">Phone: <a href="tel:+18005872584" style="color: #cccccc;">+1 (800) 587-2584</a></p>
                        <p style="margin: 4px 0; color: #888888; font-size: 0.9rem;">Hours: Mon–Sun: 8AM–10PM EST</p>
                    </div>
                </div>
                
                <div class="footer-section" style="flex: 1; min-width: 150px;">
                    <h4 style="color: #ffffff; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px 0;">Collections</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 8px;"><a href="/collections/timepieces">Timepieces</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/jewelry">Jewelry</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/handbags">Handbags</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/accessories">Accessories</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/clothing">Clothing</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/gifts">Gifts</a></li>
                        <li style="margin-bottom: 8px;"><a href="/collections/limited-drops">Limited Drops</a></li>
                    </ul>
                </div>

                <div class="footer-section" style="flex: 1; min-width: 150px;">
                    <h4 style="color: #ffffff; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px 0;">Explore</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 8px;"><a href="/for-him">For Him</a></li>
                        <li style="margin-bottom: 8px;"><a href="/for-her">For Her</a></li>
                        <li style="margin-bottom: 8px;"><a href="/all-products">All Products</a></li>
                        <li style="margin-bottom: 8px;"><a href="/dashboard">Membership Portal</a></li>
                        <li style="margin-bottom: 8px;"><a href="/dashboard">Referral Program</a></li>
                        <li style="margin-bottom: 8px;"><a href="/about">About Us</a></li>
                        <li style="margin-bottom: 8px;"><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>

                <div class="footer-section" style="flex: 1; min-width: 150px;">
                    <h4 style="color: #ffffff; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px 0;">Client Care</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 8px;"><a href="/legal/authentication">Authentication Guarantee</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/shipping">Shipping Information</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/returns">Returns & Exchanges</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/privacy-policy">Privacy Policy</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/terms-conditions">Terms & Conditions</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/terms-of-service">Terms of Service</a></li>
                        <li style="margin-bottom: 8px;"><a href="/legal/cookie-notices">Cookie Notices</a></li>
                    </ul>
                </div>

                <div class="footer-section" style="flex: 1.2; min-width: 240px;">
                    <h4 style="color: #ffffff; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px 0;">Private Newsletter</h4>
                    <p style="color: #a0a0a0; font-size: 0.9rem; line-height: 1.6; margin: 0 0 16px 0;">Subscribe to receive private previews, private sales access, and exclusive drops.</p>
                    <form class="footer-newsletter" onsubmit="event.preventDefault(); alert('Thank you for subscribing to Kuraj Fashion Private Club.');" style="display: flex; flex-direction: column; gap: 10px;">
                        <input type="email" placeholder="Enter your email address" required style="padding: 12px 16px; width: 100%; border: 1px solid rgba(255,255,255,0.18); background: #141414; color: #ffffff; border-radius: 6px; outline: none; font-size: 0.9rem; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#ffffff';" onblur="this.style.borderColor='rgba(255,255,255,0.18)';">
                        <button type="submit" style="padding: 12px 20px; background: #ffffff; color: #000000; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.88rem; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s ease;" onmouseover="this.style.background='#e6e6e6';" onmouseout="this.style.background='#ffffff';">Subscribe</button>
                    </form>
                </div>
            </div>

            <div class="footer-bottom" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; margin-top: 40px;">
                <p style="color: #777777; font-size: 0.85rem; margin: 0;">&copy; 2026 Kuraj Fashion. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;

    // Replace or insert master footer
    const existingFooters = document.querySelectorAll('footer.footer, footer#siteFooter');
    if (existingFooters.length > 0) {
      existingFooters[0].outerHTML = masterFooterHTML;
      for (let i = 1; i < existingFooters.length; i++) {
        existingFooters[i].remove();
      }
    } else {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.insertAdjacentHTML('beforebegin', masterFooterHTML);
        placeholder.remove();
      } else {
        document.body.insertAdjacentHTML('beforeend', masterFooterHTML);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
