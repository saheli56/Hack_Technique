import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MapPin, Briefcase } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Mumbai, Maharashtra",
    occupation: "Construction Worker",
    avatar: "/avatars/rajesh.jpg",
    rating: 5,
    testimonial: "Shramik Mitra helped me find a stable job after moving to Mumbai. The legal support section saved me from exploitation. Highly recommend!",
    achievement: "Got job within 2 weeks",
    joinedMonths: 8
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi, NCR",
    occupation: "Domestic Worker",
    avatar: "/avatars/priya.jpg",
    rating: 5,
    testimonial: "The loan marketplace helped me get emergency funds when I needed them most. The process was transparent and the interest rates were fair.",
    achievement: "Got ₹50,000 loan approved",
    joinedMonths: 12
  },
  {
    id: 3,
    name: "Amit Singh",
    location: "Bangalore, Karnataka",
    occupation: "Factory Worker",
    avatar: "/avatars/amit.jpg",
    rating: 5,
    testimonial: "Community forum connected me with workers from my village. We share job opportunities and support each other. This platform changed my life!",
    achievement: "Found 3 job referrals",
    joinedMonths: 6
  },
  {
    id: 4,
    name: "Sunita Devi",
    location: "Chennai, Tamil Nadu",
    occupation: "Tailoring Worker",
    avatar: "/avatars/sunita.jpg",
    rating: 5,
    testimonial: "The IVR helpline was a lifesaver when I couldn't access the website. Got immediate help with my salary dispute. Thank you Shramik Mitra!",
    achievement: "Resolved salary dispute",
    joinedMonths: 10
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground">
            Real workers, real results - Hear from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-foreground mb-6 text-lg leading-relaxed">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* User Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.joinedMonths} months
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Briefcase className="w-3 h-3" />
                      {testimonial.occupation}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>

                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                      ✓ {testimonial.achievement}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>50,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>10,000+ Jobs Filled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>₹500M+ Loans Disbursed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span>24/7 Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}