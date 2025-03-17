import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, MapPin, Flag, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <span className="title-chip">Make a difference</span>
            <h1 className="section-title mb-6">
              Connect, Volunteer &<br />Create Change Together
            </h1>
            <p className="section-subtitle mb-8">
              Join our global community of volunteers, experience international exchanges through Erasmus,
              and support meaningful causes with your donations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="volunteer" size="pill-lg">
                Get Started
              </Button>
              <Button variant="cta-outline" size="pill-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background wave pattern */}
        <div className="absolute bottom-0 left-0 right-0 -z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Programs Section with White Background */}
      <section className="py-20 bg-white relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="title-chip">Our Programs</span>
            <h2 className="section-title">How You Can Participate</h2>
            <p className="section-subtitle">
              Discover the various ways you can get involved, from local volunteering
              to international exchange programs and charitable donations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Volunteering Card */}
            <Card variant="volunteer" className="overflow-hidden">
              <div className="h-48 bg-platform-blue/10 flex items-center justify-center">
                <Users size={72} className="text-platform-blue" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Volunteering</h3>
                <p className="text-foreground/70 mb-4">
                  Join local and international volunteering opportunities that match your skills and interests.
                </p>
                <Button variant="volunteer" size="pill" className="w-full">Explore Projects</Button>
              </CardContent>
            </Card>

            {/* Erasmus Card */}
            <Card variant="erasmus" className="overflow-hidden">
              <div className="h-48 bg-platform-indigo/10 flex items-center justify-center">
                <Flag size={72} className="text-platform-indigo" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Erasmus Exchanges</h3>
                <p className="text-foreground/70 mb-4">
                  Experience cultural exchange through international mobility programs across Europe.
                </p>
                <Button variant="erasmus" size="pill" className="w-full">Find Opportunities</Button>
              </CardContent>
            </Card>

            {/* Donations Card */}
            <Card variant="donate" className="overflow-hidden">
              <div className="h-48 bg-platform-purple/10 flex items-center justify-center">
                <Heart size={72} className="text-platform-purple" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Donations</h3>
                <p className="text-foreground/70 mb-4">
                  Support our causes with financial contributions or donate essential supplies to those in need.
                </p>
                <Button variant="donate" size="pill" className="w-full">Contribute Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wave divider at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#D1D1D6" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,245.3C384,213,480,139,576,128C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="title-chip">Our Impact</span>
            <h2 className="section-title">Making a Difference Together</h2>
            <p className="section-subtitle">
              See how our community has grown and the positive change we've created around the world.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="glass-card p-6 animate-swell-wave">
              <p className="text-4xl md:text-5xl font-bold text-platform-blue mb-2">5K+</p>
              <p className="text-sm text-foreground/70">Active Volunteers</p>
            </div>
            <div className="glass-card p-6 animate-swell-wave-slow">
              <p className="text-4xl md:text-5xl font-bold text-platform-indigo mb-2">120+</p>
              <p className="text-sm text-foreground/70">Global Projects</p>
            </div>
            <div className="glass-card p-6 animate-swell-wave">
              <p className="text-4xl md:text-5xl font-bold text-platform-purple mb-2">80+</p>
              <p className="text-sm text-foreground/70">Partner Universities</p>
            </div>
            <div className="glass-card p-6 animate-swell-wave-slow">
              <p className="text-4xl md:text-5xl font-bold text-platform-pink mb-2">€2M+</p>
              <p className="text-sm text-foreground/70">Donations Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="section relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <span className="title-chip">Get Involved</span>
            <h2 className="section-title">Featured Opportunities</h2>
            <p className="section-subtitle">
              Explore our most impactful current projects and find your perfect opportunity to contribute.
            </p>
          </div>

          <Tabs defaultValue="volunteer" className="w-full">
            <TabsList variant="pills" className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger variant="pills" value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger variant="pills" value="erasmus">Erasmus</TabsTrigger>
              <TabsTrigger variant="pills" value="donate">Donate</TabsTrigger>
            </TabsList>
            
            <TabsContent variant="fade" value="volunteer" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Volunteer Opportunity Cards */}
                {[1, 2, 3].map((item) => (
                  <Card key={`volunteer-${item}`} variant="volunteer" className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-platform-blue/20 to-platform-blue/5 relative">
                      <div className="absolute top-3 left-3 bg-white/90 text-platform-blue text-xs font-semibold py-1 px-3 rounded-full">
                        Europe
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">Community Education</h3>
                        <MapPin size={16} className="text-platform-blue mt-1" />
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Teach basic computer skills to underprivileged communities in rural areas.
                      </p>
                      <Button variant="volunteer" size="sm" className="w-full">Apply Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent variant="fade" value="erasmus" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Erasmus Opportunity Cards */}
                {[1, 2, 3].map((item) => (
                  <Card key={`erasmus-${item}`} variant="erasmus" className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-platform-indigo/20 to-platform-indigo/5 relative">
                      <div className="absolute top-3 left-3 bg-white/90 text-platform-indigo text-xs font-semibold py-1 px-3 rounded-full">
                        6 Months
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">Student Exchange</h3>
                        <BookOpen size={16} className="text-platform-indigo mt-1" />
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Study abroad in partner universities across Europe with full scholarship.
                      </p>
                      <Button variant="erasmus" size="sm" className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent variant="fade" value="donate" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Donation Opportunity Cards */}
                {[1, 2, 3].map((item) => (
                  <Card key={`donate-${item}`} variant="donate" className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-platform-purple/20 to-platform-purple/5 relative">
                      <div className="absolute top-3 left-3 bg-white/90 text-platform-purple text-xs font-semibold py-1 px-3 rounded-full">
                        Urgent
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">Medical Supplies</h3>
                        <Heart size={16} className="text-platform-purple mt-1" />
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Help provide essential medical supplies to underserved communities.
                      </p>
                      <Button variant="donate" size="sm" className="w-full">Donate Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Background wave pattern */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,234.7C672,235,768,213,864,213.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="title-chip">Testimonials</span>
            <h2 className="section-title">From Our Community</h2>
            <p className="section-subtitle">
              Hear from volunteers, students, and donors who have been part of our global community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <Card variant="testimonial" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-platform-blue/20 rounded-full flex items-center justify-center text-platform-blue font-semibold">
                  MS
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Maria Silva</p>
                  <p className="text-xs text-foreground/60">Volunteer, Portugal</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "Volunteering with this organization changed my perspective on what community service means. The experience was both fulfilling and eye-opening."
              </p>
            </Card>

            <Card variant="testimonial" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-platform-indigo/20 rounded-full flex items-center justify-center text-platform-indigo font-semibold">
                  JK
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Jan Kowalski</p>
                  <p className="text-xs text-foreground/60">Erasmus Student, Poland</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "My Erasmus exchange in Barcelona was the highlight of my university experience. I made lifelong friends and gained valuable professional skills."
              </p>
            </Card>

            <Card variant="testimonial" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-platform-purple/20 rounded-full flex items-center justify-center text-platform-purple font-semibold">
                  SB
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Sarah Becker</p>
                  <p className="text-xs text-foreground/60">Regular Donor, Germany</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "I appreciate the transparency of this organization. I know exactly where my donations go and can see the direct impact they have on communities."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-platform-blue to-platform-indigo text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join our global community today and be part of creating positive change around the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="cta" size="pill-lg">
                Sign Up Now
              </Button>
              <Button variant="cta-outline" size="pill-lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
      </section>
    </main>
  );
};

export default Index;
