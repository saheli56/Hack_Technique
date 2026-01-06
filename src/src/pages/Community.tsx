import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { postsAPI } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  MessageSquare, HelpCircle, Share2, Lightbulb, Plus, 
  ThumbsUp, MessageCircle, Clock, User, Search, Filter, Loader2, Trash2
} from "lucide-react";

const categories = [
  { id: "all", name: "All Posts", nameHi: "सभी पोस्ट", icon: MessageSquare, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "help", name: "Help Requests", nameHi: "मदद अनुरोध", icon: HelpCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  { id: "info", name: "Information", nameHi: "जानकारी", icon: Lightbulb, color: "text-info", bgColor: "bg-info/10" },
  { id: "experience", name: "Experience Sharing", nameHi: "अनुभव साझा करें", icon: Share2, color: "text-success", bgColor: "bg-success/10" },
];

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    category: "help",
    title: "",
    titleHi: "",
    content: ""
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast({
        title: t("auth.error"),
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        toast({
          title: t("auth.loginRequired"),
          description: "Please login to create a post.",
          variant: "destructive",
        });
        return;
      }

      const postData = {
        ...newPost,
        author: user._id
      };

      await postsAPI.create(postData);
      
      toast({
        title: "Post Created!",
        description: "Your post has been published successfully.",
      });

      // Reset form and hide it
      setNewPost({
        category: "help",
        title: "",
        titleHi: "",
        content: ""
      });
      setShowNewPost(false);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: t("auth.error"),
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.like(postId);
      // Refresh posts to get updated like count
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
      toast({
        title: t("auth.error"),
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        toast({
          title: t("auth.loginRequired"),
          description: "Please login to delete posts.",
          variant: "destructive",
        });
        return;
      }

      await postsAPI.delete(postId, user._id);
      
      toast({
        title: "Post Deleted",
        description: "Your post has been deleted successfully.",
      });
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Community Forum
            </h1>
            <p className="text-xl text-primary-foreground/80">
              समुदाय मंच - एक दूसरे की मदद करें
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-72 shrink-0 space-y-6">
                {/* New Post Button */}
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => setShowNewPost(!showNewPost)}
                >
                  <Plus className="w-5 h-5" />
                  Create New Post
                </Button>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            selectedCategory === cat.id 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${selectedCategory === cat.id ? "bg-primary-foreground/20" : cat.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${selectedCategory === cat.id ? "text-primary-foreground" : cat.color}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className={`text-xs ${selectedCategory === cat.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {cat.nameHi}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Members</span>
                      <span className="font-semibold">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posts Today</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Now</span>
                      <span className="font-semibold text-success">234</span>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Posts Section */}
              <div className="flex-1">
                {/* New Post Form */}
                {showNewPost && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create New Post</CardTitle>
                      <CardDescription>नई पोस्ट बनाएं - Share with the community</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <select 
                          className="w-full h-10 px-4 rounded-lg border border-input bg-background"
                          value={newPost.category}
                          onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="help">Help Request</option>
                          <option value="info">Information</option>
                          <option value="experience">Experience Sharing</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title (English)</label>
                        <Input 
                          placeholder="Enter post title" 
                          value={newPost.title}
                          onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title (Hindi)</label>
                        <Input 
                          placeholder="शीर्षक दर्ज करें" 
                          value={newPost.titleHi}
                          onChange={(e) => setNewPost(prev => ({ ...prev, titleHi: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Textarea 
                          placeholder="Write your post here / यहां अपनी पोस्ट लिखें"
                          rows={4}
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="hero" 
                          onClick={handleCreatePost}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Posting...
                            </>
                          ) : (
                            'Post'
                          )}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowNewPost(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Search posts..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-5 h-5" />
                    Filter
                  </Button>
                </div>

                {/* Posts List */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading posts...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map(post => {
                      const category = categories.find(c => c.id === post.category);
                      const Icon = category?.icon || MessageSquare;
                      
                      return (
                        <Card key={post._id} variant="interactive">
                          <CardContent className="p-6">
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-6 h-6 rounded ${category?.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-3 h-3 ${category?.color}`} />
                              </div>
                              <span className={`text-xs font-medium ${category?.color}`}>
                                {category?.name}
                              </span>
                            </div>

                            {/* Post Title */}
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-primary mb-3">{post.titleHi}</p>

                            {/* Post Content Preview */}
                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {post.content}
                            </p>

                            {/* Post Meta */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                      {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium">{post.author?.name || 'Anonymous'}</span>
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-muted-foreground">
                                <button 
                                  className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                                  onClick={() => handleLike(post._id)}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  {post.likes}
                                </button>
                                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                                  <MessageCircle className="w-4 h-4" />
                                  {post.comments?.length || 0}
                                </button>
                                {(() => {
                                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                                  return post.author?._id === user._id && (
                                    <button 
                                      className="flex items-center gap-1 text-sm hover:text-destructive transition-colors"
                                      onClick={() => handleDeletePost(post._id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {!loading && filteredPosts.length === 0 && (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Be the first to share something with the community!
                        </p>
                        <Button variant="hero" onClick={() => setShowNewPost(true)}>
                          Create First Post
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
