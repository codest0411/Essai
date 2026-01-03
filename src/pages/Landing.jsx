import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Play, Radio, Heart, TrendingUp, Users, Zap, Sparkles, Headphones, ListMusic, Clock, Shield, Smartphone, Globe, Star, Award, Target, X, Eye, FileText, MessageSquare, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counters, setCounters] = useState({ users: 0, songs: 0, podcasts: 0, streams: 0 });
  const particlesRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Mouse follow effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animated counters
    const animateCounters = () => {
      const targets = { users: 10000000, songs: 50000000, podcasts: 100000, streams: 1000000000 };
      const duration = 2000;
      const step = 50;
      const steps = duration / step;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        setCounters({
          users: Math.floor(targets.users * easeOutCubic),
          songs: Math.floor(targets.songs * easeOutCubic),
          podcasts: Math.floor(targets.podcasts * easeOutCubic),
          streams: Math.floor(targets.streams * easeOutCubic),
        });
        
        if (currentStep >= steps) clearInterval(timer);
      }, step);
    };

    // Start counters after a delay
    setTimeout(animateCounters, 1000);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 10,
  }));

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B+`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  const features = [
    {
      icon: Music,
      title: 'Unlimited Music',
      description: 'Stream millions of tracks across all genres. From pop to indie, we got your vibe covered.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Radio,
      title: 'Podcast Paradise',
      description: 'Dive into thousands of podcasts. True crime, comedy, tech talks - all in one place.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ListMusic,
      title: 'Custom Playlists',
      description: 'Create, share, and vibe to personalized playlists. Your music, your way, always.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero buffering, instant playback. Your music loads faster than you can say "play".',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Heart,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions that actually get you. Discover your next favorite track.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Seamless experience on any device. Start on phone, continue on desktop, no interruptions.',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const stats = [
    { icon: Users, value: '10M+', label: 'Active Users' },
    { icon: Music, value: '50M+', label: 'Songs' },
    { icon: Radio, value: '100K+', label: 'Podcasts' },
    { icon: TrendingUp, value: '1B+', label: 'Streams' },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Music Enthusiast',
      image: '👨‍🎤',
      text: 'ESSAI is literally the best thing that happened to my music life. The UI is fire and the recommendations are spot on! 🔥',
    },
    {
      name: 'Maya Rodriguez',
      role: 'Podcast Addict',
      image: '👩‍💼',
      text: 'Finally, a platform that gets podcasts right. Clean interface, smooth playback, and the discovery is chef\'s kiss! 💯',
    },
    {
      name: 'Jordan Lee',
      role: 'Playlist Curator',
      image: '🎧',
      text: 'Been using ESSAI for 6 months and I\'m obsessed. The playlist features are next level. No cap! 🎵',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Music className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ESSAI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-primary/10 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-500" />
                )}
              </Button>
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div data-aos="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">The Future of Music Streaming</span>
                <Target className="h-4 w-4 text-primary animate-bounce" />
              </div>
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Your Music,
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent glow-text">
                Your Vibe, Your Way
              </span>
              <Star className="inline h-12 w-12 ml-4 text-yellow-400 animate-spin" />
            </h1>
            
            <p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Stream unlimited music and podcasts. No ads, no limits, just pure vibes. 
              Join millions who've already upgraded their listening experience. 🎧✨
            </p>
            
            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6 group transform hover:scale-105 transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Listening Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/browse')}
                className="text-lg px-8 py-6 hover:bg-primary/10 transition-all duration-300"
              >
                <Headphones className="h-5 w-5 mr-2" />
                Explore Music
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Cancel anytime • 30-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: counters.users, label: 'Active Users', color: 'text-blue-500' },
              { icon: Music, value: counters.songs, label: 'Songs', color: 'text-purple-500' },
              { icon: Radio, value: counters.podcasts, label: 'Podcasts', color: 'text-green-500' },
              { icon: TrendingUp, value: counters.streams, label: 'Streams', color: 'text-orange-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center parallax-element"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="counter text-4xl font-bold mb-2">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Everyone's Switching to{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent glow-text">
                ESSAI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're not just another music app. We're the whole vibe. Here's what makes us different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card group relative p-8 rounded-2xl bg-card border border-border overflow-hidden cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Floating particles in card */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-500/30 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300 animation-delay-1000" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Get Started in{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent glow-text">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              It's literally that easy. No complicated setup, just pure music.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Sign Up Free',
                description: 'Create your account in seconds. No credit card needed, no strings attached.',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'Discover Music',
                description: 'Browse millions of tracks or let our AI find your perfect playlist.',
                icon: Sparkles,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Vibe Out',
                description: 'Hit play and enjoy unlimited streaming on any device, anywhere.',
                icon: Headphones,
                color: 'from-green-500 to-emerald-500',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative group text-center parallax-element"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="relative mb-6">
                    <div className={`text-6xl font-bold text-primary/10 mb-4 ${index === 0 ? 'text-blue-500/20' : index === 1 ? 'text-purple-500/20' : 'text-green-500/20'}`}>
                      {item.step}
                    </div>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-primary/30`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    {/* Animated ring */}
                    <div className={`absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/20 group-hover:border-primary/60 transition-colors duration-500 animate-ping-slow`} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{item.description}</p>
                  
                  {/* Connecting line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/30 transform -translate-x-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card/20" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              What the{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent glow-text">
                Community Says
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it. Here's what real users are saying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{testimonial.image}</div>
                    <div>
                      <div className="font-bold group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic group-hover:text-foreground transition-colors duration-300">{testimonial.text}</p>
                  
                  {/* Quote marks */}
                  <div className="absolute top-4 right-4 text-4xl text-primary/20 group-hover:text-primary/40 transition-colors duration-300">"</div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-6 left-6 w-2 h-2 bg-primary/30 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 right-6 w-1 h-1 bg-purple-500/30 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300 animation-delay-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div 
            className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-500"
            data-aos="zoom-in"
          >
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Upgrade Your{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent glow-text neon-text">
                  Music Game?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join millions of music lovers who've already made the switch. 
                Start your free trial today, no credit card required.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6 group transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/30"
              >
                <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 hover:bg-primary/10 transition-all duration-300 border-primary/50 hover:border-primary"
              >
                <Shield className="h-5 w-5 mr-2" />
                30-Day Money Back
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-500" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card/50 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ESSAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 ESSAI. All rights reserved. Made with 💜 for music lovers.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="text-muted-foreground">Privacy</span>
              <span className="text-muted-foreground">Terms</span>
              <span className="text-muted-foreground">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
