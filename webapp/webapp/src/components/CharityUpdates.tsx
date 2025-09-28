import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Users, BookOpen, Droplets } from 'lucide-react';
import React from "react";

const updates = [
  {
    id: 1,
    charity: 'World Food Programme',
    title: 'Emergency Response in East Africa',
    description: 'Your donations helped provide 2,340 meals to families affected by drought. Thank you for making a difference!',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop',
    date: '2 days ago',
    impact: '2,340 meals provided',
    icon: Heart,
    category: 'Food Security'
  },
  {
    id: 2,
    charity: 'Education For All',
    title: 'New School Library Opens',
    description: 'Thanks to community support, we opened a new library serving 450 students in rural Guatemala.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
    date: '1 week ago',
    impact: '450 students benefited',
    icon: BookOpen,
    category: 'Education'
  },
  {
    id: 3,
    charity: 'Clean Water Initiative',
    title: 'Well Project Completed',
    description: 'A new well was completed in rural Kenya, providing clean water access to over 800 community members.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400&h=200&fit=crop',
    date: '2 weeks ago',
    impact: '800+ people served',
    icon: Droplets,
    category: 'Water'
  },
  {
    id: 4,
    charity: 'Local Food Bank',
    title: 'Holiday Food Drive Success',
    description: 'Your support helped us distribute holiday meals to 156 families in need this season.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop',
    date: '3 weeks ago',
    impact: '156 families helped',
    icon: Users,
    category: 'Community'
  }
];

export function CharityUpdates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Updates from Your Charities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-6">
            {updates.map((update) => {
              const Icon = update.icon;
              return (
                <div key={update.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{update.charity}</h4>
                        <Badge variant="outline" className="text-xs">{update.category}</Badge>
                      </div>
                      <h3 className="font-medium mb-2">{update.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{update.date}</span>
                  </div>
                  
                  <div className="ml-11">
                    <ImageWithFallback 
                      src={update.image} 
                      alt={update.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {update.impact}
                      </Badge>
                    </div>
                  </div>
                  
                  {update.id !== updates.length && (
                    <div className="ml-11 border-b border-border/50 pb-3"></div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}