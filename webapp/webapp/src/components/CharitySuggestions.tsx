import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Star, Globe, BookOpen, TreePine, Shield } from "lucide-react";
import React from "react";

const suggestions = [
  {
    id: 1,
    name: "Doctors Without Borders",
    category: "Healthcare",
    description: "Providing medical care in crisis zones worldwide",
    rating: 4.8,
    efficiency: "87% to programs",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
    icon: Shield,
    reason: "Based on your healthcare donations",
  },
  {
    id: 2,
    name: "Room to Read",
    category: "Education",
    description: "Global literacy and girls' education programs",
    rating: 4.9,
    efficiency: "84% to programs",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=200&fit=crop",
    icon: BookOpen,
    reason: "Matches your education focus",
  },
  {
    id: 3,
    name: "The Nature Conservancy",
    category: "Environment",
    description: "Protecting lands and waters around the world",
    rating: 4.7,
    efficiency: "79% to programs",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
    icon: TreePine,
    reason: "Trending in your area",
  },
  {
    id: 4,
    name: "GiveDirectly",
    category: "Poverty",
    description: "Direct cash transfers to families in poverty",
    rating: 4.6,
    efficiency: "83% to recipients",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=200&fit=crop",
    icon: Globe,
    reason: "High impact recommendation",
  },
];

export function CharitySuggestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {suggestions.map((charity) => {
            const Icon = charity.icon;
            return (
              <div
                key={charity.id}
                className="p-4 border border-border/50 rounded-lg space-y-3"
              >
                <div className="flex items-start gap-3">
                  <ImageWithFallback
                    src={charity.image}
                    alt={charity.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <h4 className="font-medium">{charity.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {charity.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {charity.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{charity.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {charity.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {charity.efficiency}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    <Button size="sm">
                      <Heart className="h-3 w-3 mr-1" />
                      Start Supporting
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Browse All Charities</Button>
        </div>
      </CardContent>
    </Card>
  );
}
