import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example Blog Post */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a summary of the blog post...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 