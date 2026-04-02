import { useEffect, useState, useRef, useMemo, lazy, Suspense } from "react";
import { getCatsHero } from "../../shared/services/cat-service";
import { Carousel, Skeleton, Card, Row, Col, Button, Empty } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAdopt, useCart } from "@/app/providers";
import { Link } from "react-router-dom";

const CatCard = lazy(() => import("@/app/shared/components/CatCard").then(module => ({ default: module.CatCard })));

function ScrollAnimation({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <div ref={elementRef} className={`scroll-animate ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function ContentCarousel({ cats, isLoading }) {
  if (isLoading) {
    return (
      <div className="carousel-skeleton">
        <Skeleton.Node active style={{ width: "100%", height: 400 }} />
      </div>
    );
  }

  if (!cats || cats.length === 0) {
    return (
      <Card className="carousel-empty">
        <Empty description="No cats available at the moment" />
      </Card>
    );
  }

  return (
    <div>
      <Carousel fade autoplaySpeed={5000} autoplay>
        {cats.map((cat, index) => (
          <div key={index} className="carousel-slide">
            <img
              loading="eager"
              draggable={false}
              alt={cat.name || "cat"}
              src={cat.url || null}
              className="carousel-image"
            />
            <div className="carousel-caption">
              <h3>{cat.name}</h3>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

function StatsBar() {
  const { adoptItems } = useAdopt();
  const { cartItems } = useCart();

  const stats = useMemo(() => {
    const totalDonations = cartItems.reduce((sum, item) => {
      const amount = (item.food || 0) + (item.medical || 0) + (item.supplies || 0);
      return sum + amount;
    }, 0);

    return {
      adoptions: adoptItems.length,
      donations: cartItems.length,
      totalAmount: totalDonations,
    };
  }, [adoptItems, cartItems]);

  return (
    <ScrollAnimation>
      <div className="home-stats">
        <div className="home-stats-item">
          <div className="home-stats-number">{stats.adoptions}</div>
          <div className="home-stats-label">Adoptions</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-number">{stats.donations}</div>
          <div className="home-stats-label">Donations</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-number">฿{stats.totalAmount}</div>
          <div className="home-stats-label">Total Raised</div>
        </div>
      </div>
    </ScrollAnimation>
  );
}

function ParallaxScene({ scrollY, children, className = "" }) {
  const opacity = Math.max(1 - scrollY / 900, 0);
  
  return (
    <div 
      className={`parallax-scene ${className}`}
      style={{ 
        transform: `translateY(-${scrollY * 0.2}px)`,
        opacity 
      }}
    >
      {children}  
    </div>
  );
}

function SceneReveal({ threshold = 0.1, children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => observer.unobserve(node);
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`scene-reveal ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}


function HowItWorks() {
  const steps = [
    { icon: "🔍", title: "Browse", description: "Explore our lovely cats waiting for a forever home" },
    { icon: "❤️", title: "Choose", description: "Donate or adopt the cat that touches your heart" },
    { icon: "🏠", title: "Impact", description: "Make a difference in a cat's life today" },
  ];

  return (
    <div className="home-how-it-works">
      <h2 className="home-section-title">How It Works</h2>
      <div className="home-steps">
        {steps.map((step, index) => (
          <div key={index} className="home-step" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="home-step-icon">{step.icon}</div>
            <h3 className="home-step-title">{step.title}</h3>
            <p className="home-step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCats({ cats, isLoading, error }) {
  if (error) {
    return (
      <Card className="error-card">
        <Empty
          image={Empty.PRESENTED_IMAGE_ERROR}
          description="Failed to load cats. Please try again."
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            <Card loading />
          </Col>
        ))}
      </Row>
    );
  }

  if (!cats || cats.length === 0) {
    return (
      <Card className="empty-card">
        <Empty description="No cats available" />
      </Card>
    );
  }

  return (
    <Suspense fallback={
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            <Card loading />
          </Col>
        ))}
      </Row>
    }>
      <Row gutter={[24, 24]}>
        {cats.slice(0, 8).map((cat, index) => (
          <Col key={cat.id || index} xs={24} sm={12} md={8} lg={6}>
            <CatCard cat={cat} />
          </Col>
        ))}
      </Row>
    </Suspense>
  );
}

function Hero() {
  return (
    <div className="hero-gradient">
      <div className="home-hero">
        <h1 className="home-title">Welcome to SEM Cat Shelter</h1>
        <p className="home-subtitle">
          Find your new best friend or help us care for cats in need
        </p>
        <div className="hero-actions">
          <Link to="/search">
            <Button type="primary" size="large">
              Browse Cats
            </Button>
          </Link>
          <Link to="/auth" state={{ mode: "signup" }}>
            <Button size="large" variant="filled">
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: catsHero = [],
    isFetching: isHeroLoading,
  } = useQuery({
    queryKey: ["catsHero"],
    queryFn: ({signal}) => getCatsHero(signal),
    staleTime: 1000 * 120,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  return (
    <div className="page-home">
     
      <ParallaxScene scrollY={scrollY}>
        <div className="container">
          <Hero />
          <StatsBar />
          <HowItWorks />
        </div>
      </ParallaxScene>

      <SceneReveal threshold={0.1}>
        <div className="px-8!">
          <div className="home-section">
            <div className="home-section-header">
              <h2 className="home-section-title">Meet Our Cats</h2>
              <Link to="/search">
                <Button type="link">View All →</Button>
              </Link>
            </div>
            <FeaturedCats cats={catsHero} isLoading={isHeroLoading} />
          </div>
        </div>
      </SceneReveal>
    </div>
  );
}