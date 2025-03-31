import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import styles from "./ContactPage.module.css";

const ContactPage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.contactHero}>
        <div className={styles.contactHeroContainer}>
          <div className={styles.contactHeroContent}>
            <h1 className={styles.contactHeroTitle}>Get In Touch</h1>
            <p className={styles.contactHeroSubtitle}>
              We'd love to hear from you! Reach out with questions, partnership inquiries, 
              or just to say hello.
            </p>
            
            <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
                Contact Our Team
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className={`${styles.decorativeCircle} ${styles.decorativeCircleTop}`}></div>
        <div className={`${styles.decorativeCircle} ${styles.decorativeCircleBottom}`}></div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <div className={styles.containerCustom}>
          <div className={styles.contactContainer}>
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <Card className={styles.contactInfoCard}>
                <CardContent>
                  <h3 className={styles.contactInfoTitle}>
                    <MapPin size={20} /> Our Office
                  </h3>
                  <p className={styles.contactInfoText}>
                    123 Volunteer Street<br />
                    Social Impact District<br />
                    Barcelona, Spain 08001
                  </p>
                </CardContent>
              </Card>

              <Card className={styles.contactInfoCard}>
                <CardContent>
                  <h3 className={styles.contactInfoTitle}>
                    <Mail size={20} /> Email Us
                  </h3>
                  <p className={styles.contactInfoText}>
                    info@volunteerconnect.org<br />
                    support@volunteerconnect.org
                  </p>
                </CardContent>
              </Card>

              <Card className={styles.contactInfoCard}>
                <CardContent>
                  <h3 className={styles.contactInfoTitle}>
                    <Phone size={20} /> Call Us
                  </h3>
                  <p className={styles.contactInfoText}>
                    +34 123 456 789 (Office)<br />
                    +34 987 654 321 (Support)
                  </p>
                </CardContent>
              </Card>

              <Card className={styles.contactInfoCard}>
                <CardContent>
                  <h3 className={styles.contactInfoTitle}>
                    <Clock size={20} /> Hours
                  </h3>
                  <p className={styles.contactInfoText}>
                    Monday - Friday: 9am - 6pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className={styles.contactFormContainer}>
              <h2 className={styles.contactFormTitle}>Send Us a Message</h2>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className={styles.formInput} 
                    placeholder="Your name" 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className={styles.formInput} 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className={styles.formInput} 
                    placeholder="What's this about?" 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Your Message</label>
                  <textarea 
                    id="message" 
                    className={styles.formTextarea} 
                    placeholder="How can we help you?" 
                    required
                  ></textarea>
                </div>

                <Button 
                    variant="volunteer" 
                    size="pill" 
                    type="submit"
                    className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
                    >
                    Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.containerCustom}>
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.557654686628!2d2.168365315425993!3d41.40362997926238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f1d7a8a3a5%3A0x12fce8b6e5a5a5a5!2sBarcelona!5e0!3m2!1sen!2ses!4v1620000000000!5m2!1sen!2ses" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;