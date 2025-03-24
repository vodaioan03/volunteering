import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, MapPin, Flag, BookOpen } from "lucide-react";
import styles from "./HomePage.module.css"; // Import the CSS module

const Index = () => {
  return (
    <main className={styles.pt20}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroTitleChip}>Make a difference</span>
            <h1 className={styles.heroTitle}>
              Connect, Volunteer &<br />Create Change Together
            </h1>
            <p className={styles.heroSubtitle}>
              Join our global community of volunteers, experience international exchanges through Erasmus,
              and support meaningful causes with your donations.
            </p>
            <div className={styles.heroButtons}>
              <Button variant="volunteer" size="pill-lg" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
                Get Started
              </Button>
              <Button variant="cta-outline" size="pill-lg" className={`${styles.heroButton} ${styles.heroButtonOutline}`}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`${styles.heroDecorativeCircle} ${styles.heroDecorativeCircleTop}`}></div>
        <div className={`${styles.heroDecorativeCircle} ${styles.heroDecorativeCircleBottom}`}></div>
      </section>

      {/* Programs Section with White Background */}
      <section className={`${styles.programsSection} ${styles.relative}`}>
  <div className={styles.containerCustom}>
    <div className={`${styles.textCenter} ${styles.mb16}`}>
      <span className={styles.titleChip}>Our Programs</span>
      <h2 className={styles.sectionTitle}>How You Can Participate</h2>
      <p className={styles.sectionSubtitle}>
        Discover the various ways you can get involved, from local volunteering
        to international exchange programs and charitable donations.
      </p>
    </div>

    <div className={styles.programsGrid}>
      {/* Volunteering Card */}
      <Card variant="volunteer" className={styles.programCard}>
        <div className={`${styles.programIconContainer} ${styles.programIconContainerVolunteer}`}>
          <Users size={72} className={styles.programIcon} />
        </div>
        <CardContent className={styles.programContent}>
          <h3 className={styles.programTitle}>Volunteering</h3>
          <p className={styles.programDescription}>
            Join local and international volunteering opportunities that match your skills and interests.
          </p>
          <Button variant="volunteer" size="pill" className={`${styles.programButton} ${styles.programButtonVolunteer}`}>
            Explore Projects
          </Button>
        </CardContent>
      </Card>

      {/* Erasmus Card */}
      <Card variant="erasmus" className={styles.programCard}>
        <div className={`${styles.programIconContainer} ${styles.programIconContainerErasmus}`}>
          <Flag size={72} className={styles.programIcon} />
        </div>
        <CardContent className={styles.programContent}>
          <h3 className={styles.programTitle}>Erasmus Exchanges</h3>
          <p className={styles.programDescription}>
            Experience cultural exchange through international mobility programs across Europe.
          </p>
          <Button variant="erasmus" size="pill" className={`${styles.programButton} ${styles.programButtonErasmus}`}>
            Find Opportunities
          </Button>
        </CardContent>
      </Card>

      {/* Donations Card */}
      <Card variant="donate" className={styles.programCard}>
        <div className={`${styles.programIconContainer} ${styles.programIconContainerDonate}`}>
          <Heart size={72} className={styles.programIcon} />
        </div>
        <CardContent className={styles.programContent}>
          <h3 className={styles.programTitle}>Donations</h3>
          <p className={styles.programDescription}>
            Support our causes with financial contributions or donate essential supplies to those in need.
          </p>
          <Button variant="donate" size="pill" className={`${styles.programButton} ${styles.programButtonDonate}`}>
            Contribute Now
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* Wave divider at the bottom */}
  <div className={`${styles.waveDivider} ${styles.absolute} ${styles.bottom0} ${styles.left0} ${styles.right0} ${styles.z0}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className={styles.wFull}>
      <path fill="#D1D1D6" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,245.3C384,213,480,139,576,128C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
</section>

      {/* Impact Statistics Section */}
      <section className={styles.impactSection}>
  <div className={styles.containerCustom}>
    <div className={`${styles.textCenter} ${styles.mb16}`}>
      <span className={styles.titleChip}>Our Impact</span>
      <h2 className={styles.sectionTitle}>Making a Difference Together</h2>
      <p className={styles.sectionSubtitle}>
        See how our community has grown and the positive change we've created around the world.
      </p>
    </div>

    <div className={styles.impactGrid}>
      {/* Active Volunteers */}
      <div className={`${styles.impactCard} ${styles.animateSwellWave}`}>
        <p className={styles.impactNumber}>5K+</p>
        <p className={styles.impactLabel}>Active Volunteers</p>
      </div>

      {/* Global Projects */}
      <div className={`${styles.impactCard} ${styles.animateSwellWaveSlow}`}>
        <p className={styles.impactNumber}>120+</p>
        <p className={styles.impactLabel}>Global Projects</p>
      </div>

      {/* Partner Universities */}
      <div className={`${styles.impactCard} ${styles.animateSwellWave}`}>
        <p className={styles.impactNumber}>80+</p>
        <p className={styles.impactLabel}>Partner Universities</p>
      </div>

      {/* Donations Raised */}
      <div className={`${styles.impactCard} ${styles.animateSwellWaveSlow}`}>
        <p className={styles.impactNumber}>€2M+</p>
        <p className={styles.impactLabel}>Donations Raised</p>
      </div>
    </div>
  </div>
</section>

      {/* Featured Opportunities Section */}
      <section className={`${styles.featuredSection} ${styles.relative} ${styles.overflowHidden}`}>
  <div className={`${styles.containerCustom} ${styles.relative} ${styles.z10}`}>
    <div className={`${styles.textCenter} ${styles.mb16}`}>
      <span className={styles.titleChip}>Get Involved</span>
      <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
      <p className={styles.sectionSubtitle}>
        Explore our most impactful current projects and find your perfect opportunity to contribute.
      </p>
    </div>

    <Tabs defaultValue="volunteer" className={styles.featuredTabs}>
      <TabsList variant="pills" className={styles.featuredTabsList}>
        <TabsTrigger variant="pills" value="volunteer" className={styles.featuredTabsTrigger}>
          Volunteer
        </TabsTrigger>
        <TabsTrigger variant="pills" value="erasmus" className={styles.featuredTabsTrigger}>
          Erasmus
        </TabsTrigger>
        <TabsTrigger variant="pills" value="donate" className={styles.featuredTabsTrigger}>
          Donate
        </TabsTrigger>
      </TabsList>
      
      <TabsContent variant="fade" value="volunteer" className={styles.featuredTabsContent}>
        <div className={styles.featuredGrid}>
          {/* Volunteer Opportunity Cards */}
          {[1, 2, 3].map((item) => (
            <Card key={`volunteer-${item}`} className={styles.featuredCard}>
              <div className={styles.featuredCardImage}>
                <div className={styles.featuredCardBadge}>Europe</div>
                <Users size={72} className={styles.textPlatformBlue} />
              </div>
              <CardContent className={styles.featuredCardContent}>
                <div className={`${styles.flex} ${styles.itemsStart} ${styles.justifyBetween} ${styles.mb3}`}>
                  <h3 className={styles.featuredCardTitle}>Community Education</h3>
                  <MapPin size={16} className={`${styles.textPlatformBlue} ${styles.mt1}`} />
                </div>
                <p className={styles.featuredCardDescription}>
                  Teach basic computer skills to underprivileged communities in rural areas.
                </p>
                <Button variant="volunteer" size="sm" className={`${styles.featuredCardButton} ${styles.featuredCardButtonVolunteer}`}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent variant="fade" value="erasmus" className={styles.featuredTabsContent}>
        <div className={styles.featuredGrid}>
          {/* Erasmus Opportunity Cards */}
          {[1, 2, 3].map((item) => (
            <Card key={`erasmus-${item}`} className={styles.featuredCard}>
              <div className={styles.featuredCardImage}>
                <div className={styles.featuredCardBadge}>6 Months</div>
                <Flag size={72} className={styles.textPlatformIndigo} />
              </div>
              <CardContent className={styles.featuredCardContent}>
                <div className={`${styles.flex} ${styles.itemsStart} ${styles.justifyBetween} ${styles.mb3}`}>
                  <h3 className={styles.featuredCardTitle}>Student Exchange</h3>
                  <BookOpen size={16} className={`${styles.textPlatformIndigo} ${styles.mt1}`} />
                </div>
                <p className={styles.featuredCardDescription}>
                  Study abroad in partner universities across Europe with full scholarship.
                </p>
                <Button variant="erasmus" size="sm" className={`${styles.featuredCardButton} ${styles.featuredCardButtonErasmus}`}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent variant="fade" value="donate" className={styles.featuredTabsContent}>
        <div className={styles.featuredGrid}>
          {/* Donation Opportunity Cards */}
          {[1, 2, 3].map((item) => (
            <Card key={`donate-${item}`} className={styles.featuredCard}>
              <div className={styles.featuredCardImage}>
                <div className={styles.featuredCardBadge}>Urgent</div>
                <Heart size={72} className={styles.textPlatformPurple} />
              </div>
              <CardContent className={styles.featuredCardContent}>
                <div className={`${styles.flex} ${styles.itemsStart} ${styles.justifyBetween} ${styles.mb3}`}>
                  <h3 className={styles.featuredCardTitle}>Medical Supplies</h3>
                  <Heart size={16} className={`${styles.textPlatformPurple} ${styles.mt1}`} />
                </div>
                <p className={styles.featuredCardDescription}>
                  Help provide essential medical supplies to underserved communities.
                </p>
                <Button variant="donate" size="sm" className={`${styles.featuredCardButton} ${styles.featuredCardButtonDonate}`}>
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </div>

  {/* Background wave pattern */}
  <div className={`${styles.waveBg} ${styles.absolute} ${styles.bottom0} ${styles.left0} ${styles.right0} ${styles.z0}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className={styles.wFull}>
      <path fill="#FFFFFF" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,234.7C672,235,768,213,864,213.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
</section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
  <div className={styles.containerCustom}>
    <div className={`${styles.textCenter} ${styles.mb16}`}>
      <span className={styles.titleChip}>Testimonials</span>
      <h2 className={styles.sectionTitle}>From Our Community</h2>
      <p className={styles.sectionSubtitle}>
        Hear from volunteers, students, and donors who have been part of our global community.
      </p>
    </div>

    <div className={styles.testimonialsGrid}>
      {/* Testimonial Card 1 */}
      <Card variant="testimonial" className={styles.testimonialCard}>
        <div className={styles.testimonialHeader}>
          <div className={`${styles.testimonialAvatar} ${styles.testimonialAvatarVolunteer}`}>
            MS
          </div>
          <div className={styles.testimonialInfo}>
            <p className={styles.testimonialName}>Maria Silva</p>
            <p className={styles.testimonialRole}>Volunteer, Portugal</p>
          </div>
        </div>
        <p className={styles.testimonialQuote}>
          "Volunteering with this organization changed my perspective on what community service means. The experience was both fulfilling and eye-opening."
        </p>
      </Card>

      {/* Testimonial Card 2 */}
      <Card variant="testimonial" className={styles.testimonialCard}>
        <div className={styles.testimonialHeader}>
          <div className={`${styles.testimonialAvatar} ${styles.testimonialAvatarErasmus}`}>
            JK
          </div>
          <div className={styles.testimonialInfo}>
            <p className={styles.testimonialName}>Jan Kowalski</p>
            <p className={styles.testimonialRole}>Erasmus Student, Poland</p>
          </div>
        </div>
        <p className={styles.testimonialQuote}>
          "My Erasmus exchange in Barcelona was the highlight of my university experience. I made lifelong friends and gained valuable professional skills."
        </p>
      </Card>

      {/* Testimonial Card 3 */}
      <Card variant="testimonial" className={styles.testimonialCard}>
        <div className={styles.testimonialHeader}>
          <div className={`${styles.testimonialAvatar} ${styles.testimonialAvatarDonate}`}>
            SB
          </div>
          <div className={styles.testimonialInfo}>
            <p className={styles.testimonialName}>Sarah Becker</p>
            <p className={styles.testimonialRole}>Regular Donor, Germany</p>
          </div>
        </div>
        <p className={styles.testimonialQuote}>
          "I appreciate the transparency of this organization. I know exactly where my donations go and can see the direct impact they have on communities."
        </p>
      </Card>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className={styles.ctaSection}>
  <div className={styles.ctaContainer}>
    <div className={styles.ctaContent}>
      <h2 className={styles.ctaTitle}>Ready to Make a Difference?</h2>
      <p className={styles.ctaSubtitle}>
        Join our global community today and be part of creating positive change around the world.
      </p>
      <div className={styles.ctaButtons}>
        <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
          Sign Up Now
        </Button>
        <Button variant="cta-outline" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonOutline}`}>
          Contact Us
        </Button>
      </div>
    </div>
  </div>

  {/* Decorative elements */}
  <div className={`${styles.decorativeCircle} ${styles.decorativeCircleTop}`}></div>
  <div className={`${styles.decorativeCircle} ${styles.decorativeCircleBottom}`}></div>
</section>
    </main>
  );
};

export default Index;