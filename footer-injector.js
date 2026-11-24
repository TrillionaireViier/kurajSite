// Footer injector - adds footer CSS styles and HTML across all pages
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
      .footer .footer-content { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 30px; margin-bottom: 2rem; }
      .footer .footer-section h3 { color: #ffffff; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: 2px; }
      .footer .footer-section h4 { color: #ffffff; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; letter-spacing: 1px; text-transform: uppercase; }
      .footer .footer-section p { color: #cccccc; font-size: 0.9rem; line-height: 1.8; margin-bottom: 0.5rem; }
      .footer .footer-section ul { list-style: none; padding: 0; margin: 0; }
      .footer .footer-section ul li { margin-bottom: 0.5rem; }
      .footer .footer-section ul li a { color: #cccccc; text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
      .footer .footer-section ul li a:hover { color: #ffffff; }
      .footer .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px; text-align: center; }
      .footer .footer-bottom p { color: #666; font-size: 0.85rem; margin: 0; }
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
                    <li><a href="/collections/timepieces">Timepieces</a></li>
                    <li><a href="/collections/jewelry">Jewelry</a></li>
                    <li><a href="/collections/handbags">Handbags</a></li>
                    <li><a href="/collections/accessories">Accessories</a></li>
                    <li><a href="/collections/clothing">Clothing</a></li>
                    <li><a href="/collections/home-decor">Home Décor</a></li>
                    <li><a href="/collections/gifts">Gifts</a></li>
                    <li><a href="/collections/limited-drops">Limited Drops</a></li>
                </ul>
            </div>

            <div class="footer-section" style="flex: 1; min-width: 150px;">
                <h4>For Him/For Her</h4>
                <ul>
                    <li><a href="/for-him">For Him</a></li>
                    <li><a href="/for-her">For Her</a></li>
                    <li><a href="/all-products">All Products</a></li>
                </ul>
                <h4 style="margin-top: 20px;">Earn with Us</h4>
                <ul>
                    <li><a href="/dashboard">Join the Club</a></li>
                    <li><a href="/dashboard">VIP Benefits</a></li>
                    <li><a href="/dashboard">Referral Program</a></li>
                    <li><a href="/contact">Member Support</a></li>
                </ul>
            </div>

            <div class="footer-section" style="flex: 1; min-width: 150px;">
                <h4>About</h4>
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="javascript:void(0)">Our Collections</a></li>
                    <li><a href="/dashboard">Membership</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
                <h4 style="margin-top: 20px;">Support</h4>
                <ul>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/legal/authentication">Authentication</a></li>
                    <li><a href="/legal/shipping">Shipping</a></li>
                    <li><a href="/legal/returns">Returns</a></li>
                </ul>
            </div>

            <div class="footer-section" style="flex: 1; min-width: 150px;">
                <h4>Policies</h4>
                <ul>
                    <li><a href="/legal/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/legal/terms-of-service">Terms of Service</a></li>
                    <li><a href="/legal/terms-conditions">Terms & Conditions</a></li>
                    <li><a href="/legal/cookie-notices">Cookie Notices</a></li>
                </ul>
            </div>

        </div>
        <div class="footer-bottom" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px;">
            <p>&copy; 2025 Kuraj Fashion. All rights reserved.</p>
        </div>
    </div>
</footer>
  `;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = footerHTML.trim();
  const newFooter = tempDiv.firstElementChild;
  
  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
      placeholder.parentNode.insertBefore(newFooter, placeholder);
      placeholder.remove();
  } else {
      document.body.appendChild(newFooter);
  }
});
