import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Target, TrendingUp } from 'lucide-react';
import React from "react";

const goals = [
  {
    id: 1,
    title: 'Monthly Donation Goal',
    target: 50,
    current: 23.45,
    category: 'Monthly',
    description: 'Support education initiatives',
    color: '#8b5cf6'
  },
  {
    id: 2,
    title: 'Clean Water Project',
    target: 200,
    current: 147.82,
    category: 'Project',
    description: 'Help build wells in Kenya',
    color: '#06b6d4'
  },
  {
    id: 3,
    title: 'Year-End Challenge',
    target: 500,
    current: 247.82,
    category: 'Annual',
    description: 'Make a bigger impact this year',
    color: '#10b981'
  }
];

export function GoalsProgress() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Goals</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;
            
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </div>
                  {isComplete && (
                    <Badge variant="default" className="text-xs">
                      Complete!
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">${goal.current.toFixed(2)} of ${goal.target}</span>
                    <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                    style={{ 
                      '--progress-foreground': goal.color 
                    } as React.CSSProperties}
                  />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>${(goal.target - goal.current).toFixed(2)} to go</span>
                  </div>
                  {goal.category === 'Monthly' && (
                    <span>15 days remaining</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Goal Insights</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You're on track to exceed your monthly goal! Your average round-up is $0.54 per transaction.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}