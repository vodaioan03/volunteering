import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Heart, 
  Flag, 
  BookOpen, 
  Globe, 
  Handshake, 
  Lightbulb, 
  Award, 
  Twitter, 
  Linkedin, 
  Instagram 
} from "lucide-react";
import Image from "next/image";
import styles from "./AboutUsPage.module.css";

const AboutUsPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://cdn.pixabay.com/photo/2016/06/15/16/16/man-1459246_1280.png"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Program Director",
      image: "https://cdn.pixabay.com/photo/2024/05/08/14/09/ai-generated-8748392_1280.png"
    },
    {
      id: 3,
      name: "David Kim",
      role: "Volunteer Coordinator",
      image: "https://cdn.pixabay.com/photo/2024/05/19/19/30/ai-generated-8773213_1280.png"
      
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Erasmus Manager",
      image: "https://cdn.pixabay.com/photo/2018/01/03/19/54/fashion-3059143_1280.jpg"
    }
  ];

  const values = [
    {
      icon: <Globe size={24} />,
      title: "Global Community",
      description: "We believe in connecting people across borders to create meaningful change."
    },
    {
      icon: <Handshake size={24} />,
      title: "Collaboration",
      description: "We work together with local partners to ensure sustainable impact."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Innovation",
      description: "We constantly seek new ways to solve social challenges."
    },
    {
      icon: <Heart size={24} />,
      title: "Compassion",
      description: "We approach every project with empathy and understanding."
    },
    {
      icon: <Users size={24} />,
      title: "Inclusivity",
      description: "We create opportunities for people from all backgrounds."
    },
    {
      icon: <Award size={24} />,
      title: "Excellence",
      description: "We strive for the highest standards in all our programs."
    }
  ];

  const history = [
    {
      year: "2010",
      title: "Foundation",
      description: "Founded by a group of university students passionate about social change."
    },
    {
      year: "2012",
      title: "First International Project",
      description: "Launched our first cross-border volunteering initiative in Eastern Europe."
    },
    {
      year: "2015",
      title: "Erasmus Accreditation",
      description: "Became an accredited organization for Erasmus+ youth exchanges."
    },
    {
      year: "2018",
      title: "Global Expansion",
      description: "Expanded our operations to three continents with 50+ active projects."
    },
    {
      year: "2022",
      title: "10,000 Volunteers",
      description: "Celebrated engaging our 10,000th volunteer across all programs."
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.aboutHeroContainer}>
          <div className={styles.aboutHeroContent}>
            <h1 className={styles.aboutHeroTitle}>Our Story</h1>
            <p className={styles.aboutHeroSubtitle}>
              Connecting passionate individuals with meaningful opportunities to create positive change worldwide.
            </p>
            <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.containerCustom}>
          <div className={`${styles.textCenter} ${styles.mb16}`}>
            <span className={styles.titleChip}>Our Mission</span>
            <h2 className={styles.sectionTitle}>Why We Exist</h2>
          </div>

          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <p className={styles.sectionSubtitle}>
                We bridge the gap between passionate individuals and communities in need, creating opportunities for personal growth while addressing pressing social challenges.
              </p>
              <p className={styles.sectionSubtitle}>
                Our organization was born from the belief that everyone has something valuable to contribute, and that cross-cultural exchange can be a powerful force for positive change.
              </p>
              <div className={`${styles.flex} ${styles.gap4} ${styles.mt6}`}>
                <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
                  Our Programs
                </Button>
                <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
                  Annual Report
                </Button>
              </div>
            </div>
            <div className={styles.missionImageContainer}>
              
              <Image 
                src="https://cdn.pixabay.com/photo/2022/07/25/12/51/volunteering-7343667_1280.jpg" 
                alt="Our team working together" 
                width={500} 
                height={400} 
                className={styles.missionImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.containerCustom}>
          <div className={`${styles.textCenter} ${styles.mb16}`}>
            <span className={styles.titleChip}>Our Values</span>
            <h2 className={styles.sectionTitle}>What Guides Us</h2>
            <p className={styles.sectionSubtitle}>
              These core principles shape every decision we make and every program we create.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <Card key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  {value.icon}
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.containerCustom}>
          <div className={`${styles.textCenter} ${styles.mb16}`}>
            <span className={styles.titleChip}>Our Team</span>
            <h2 className={styles.sectionTitle}>Meet The People Behind Our Work</h2>
            <p className={styles.sectionSubtitle}>
              A diverse group of professionals united by a shared passion for social impact.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <Card key={member.id} className={styles.teamCard}>
                <div className={styles.teamImageContainer}>
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={300} 
                    height={400} 
                    className={styles.teamImage}
                  />
                </div>
                <div className={styles.teamContent}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <div className={styles.teamSocial}>
                    <a href="#" className={styles.socialLink}>
                      <Twitter size={16} />
                    </a>
                    <a href="#" className={styles.socialLink}>
                      <Linkedin size={16} />
                    </a>
                    <a href="#" className={styles.socialLink}>
                      <Instagram size={16} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className={styles.historySection}>
        <div className={styles.containerCustom}>
          <div className={`${styles.textCenter} ${styles.mb16}`}>
            <span className={styles.titleChip}>Our Journey</span>
            <h2 className={styles.sectionTitle}>Milestones & Growth</h2>
            <p className={styles.sectionSubtitle}>
              From humble beginnings to a global movement for change.
            </p>
          </div>

          <div className={styles.historyTimeline}>
            {history.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineYear}>{item.year}</p>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Become Part of Our Story</h2>
            <p className={styles.ctaSubtitle}>
              Whether you want to volunteer, participate in exchanges, or support our work, we'd love to have you join our community.
            </p>
            <div className={styles.ctaButtons}>
              <Button variant="cta" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
                Get Involved
              </Button>
              <Button variant="cta-outline" size="pill-lg" className={`${styles.ctaButton} ${styles.ctaButtonOutline}`}>
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;