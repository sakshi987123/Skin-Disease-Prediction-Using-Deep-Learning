import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ThemeToggle';

export const ThemeDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8 w-full pt-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Theme Demo</h1>
            <p className="text-muted-foreground mt-2">
              Showcase of the theme system with light and dark mode support
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Color Palette</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-background border border-border rounded-lg"></div>
                <p className="text-sm text-foreground">Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-foreground rounded-lg"></div>
                <p className="text-sm text-foreground">Foreground</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg"></div>
                <p className="text-sm text-foreground">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-secondary rounded-lg"></div>
                <p className="text-sm text-foreground">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-muted rounded-lg"></div>
                <p className="text-sm text-foreground">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-accent rounded-lg"></div>
                <p className="text-sm text-foreground">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-destructive rounded-lg"></div>
                <p className="text-sm text-foreground">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg"></div>
                <p className="text-sm text-foreground">Card</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Gradient Examples */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Solid Color Examples</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg"></div>
                <p className="text-sm text-foreground">Primary Color</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-secondary rounded-lg"></div>
                <p className="text-sm text-foreground">Secondary Color</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-accent rounded-lg"></div>
                <p className="text-sm text-foreground">Accent Color</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-destructive rounded-lg"></div>
                <p className="text-sm text-foreground">Destructive Color</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Components Demo */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-card-foreground">Buttons</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                <Button fullWidth>Full Width</Button>
                <Button isLoading>Loading...</Button>
              </div>
            </CardBody>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-card-foreground">Form Elements</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input 
                  label="Email" 
                  placeholder="Enter your email"
                  type="email"
                />
                <Input 
                  label="Password" 
                  placeholder="Enter your password"
                  type="password"
                />
                <Input 
                  label="With Error" 
                  placeholder="This field has an error"
                  error="This field is required"
                />
                <Input 
                  label="With Helper Text" 
                  placeholder="This field has helper text"
                  helperText="This is helpful information"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Chart Colors */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Chart Colors</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-chart-1 rounded-lg"></div>
                <p className="text-sm text-foreground">Chart 1</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-chart-2 rounded-lg"></div>
                <p className="text-sm text-foreground">Chart 2</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-chart-3 rounded-lg"></div>
                <p className="text-sm text-foreground">Chart 3</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-chart-4 rounded-lg"></div>
                <p className="text-sm text-foreground">Chart 4</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-chart-5 rounded-lg"></div>
                <p className="text-sm text-foreground">Chart 5</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sidebar Colors */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Sidebar Colors</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-sidebar border border-border rounded-lg"></div>
                <p className="text-sm text-foreground">Sidebar</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-sidebar-primary rounded-lg"></div>
                <p className="text-sm text-foreground">Sidebar Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-sidebar-accent rounded-lg"></div>
                <p className="text-sm text-foreground">Sidebar Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-sidebar-border border border-border rounded-lg"></div>
                <p className="text-sm text-foreground">Sidebar Border</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Typography</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground font-sans">Heading 1 (Sans)</h1>
              <h2 className="text-3xl font-semibold text-foreground font-serif">Heading 2 (Serif)</h2>
              <h3 className="text-2xl font-medium text-foreground font-mono">Heading 3 (Mono)</h3>
              <p className="text-lg text-foreground font-sans">
                This is a paragraph with regular text color using system fonts.
              </p>
              <p className="text-base text-muted-foreground font-serif">
                This is muted text for secondary information using serif font.
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                This is small text for captions and labels using monospace font.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Shadows */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Shadows</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-2xs"></div>
                <p className="text-sm text-foreground">2xs</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-xs"></div>
                <p className="text-sm text-foreground">xs</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-sm"></div>
                <p className="text-sm text-foreground">sm</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow"></div>
                <p className="text-sm text-foreground">default</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-md"></div>
                <p className="text-sm text-foreground">md</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-lg"></div>
                <p className="text-sm text-foreground">lg</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-xl"></div>
                <p className="text-sm text-foreground">xl</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded-lg shadow-2xl"></div>
                <p className="text-sm text-foreground">2xl</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-card-foreground">Border Radius</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-sm"></div>
                <p className="text-sm text-foreground">sm</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-md"></div>
                <p className="text-sm text-foreground">md</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg"></div>
                <p className="text-sm text-foreground">lg</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-xl"></div>
                <p className="text-sm text-foreground">xl</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};