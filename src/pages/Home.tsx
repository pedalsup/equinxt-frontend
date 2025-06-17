import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar22 } from "@/components/ui/DatePicker";
import { BarChartComponent } from "@/custom-components/CustomCharts";
import DialogWrapper from "@/custom-components/CustomDialog";
import { CustomDropdown } from "@/custom-components/CustomDropdown";
import CustomButton from "@/custom-components/CustomeButton";
import { PieChartCard } from "@/custom-components/PieChartCard";
import { LineChartCard } from "@/custom-components/LineChartComponent";
import { Apple, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { fetchPosts, createPost } from "@/api";
import type { Post, CreatePostData } from "@/api";

const Home: React.FC = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  // Fetch posts using API helper
  const { data: posts, isLoading, error } = useCustomQuery<Post[], Error>(
    ["posts", { page, limit: LIMIT }],
    fetchPosts
  );

  // Create post mutation
  const createPostMutation = useCustomMutation<Post, Error, CreatePostData>(
    createPost,
    {
      onSuccess: (newPost) => {
        console.log("Post created successfully:", newPost);
        // You could invalidate queries here to refetch posts
      },
      onError: (error) => {
        console.error("Failed to create post:", error);
      },
    }
  );

  const handleCreatePost = () => {
    createPostMutation.mutate({
      title: "New Post from Equinxt",
      body: "This is a test post created from the frontend",
      userId: 1,
    });
  };

  return (
    <div className="home-page gap-y-3 flex flex-col items-center ">
      <h1>Welcome to Equinxt</h1>
      <p className="text-2xl font-bold text-red-500">
        This is the home page of our application.
      </p>
      <Button className="text-black">Click me</Button>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Calendar22 />
      <DialogWrapper
        trigger={<Button className="text-black">Open Dialog</Button>}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Custom Content</h2>
          <p>This is fully customizable JSX inside the dialog.</p>
        </div>
      </DialogWrapper>
      <CustomButton
        className="text-black"
        layout="theme_black"
        icon={<PlusIcon />}
        isLoading={false}
      >
        Submit
      </CustomButton>

      <CustomDropdown
        options={[
          { label: "Option A", value: "a", icon: <Apple size={16} /> },
          { label: "Option B", value: "b", icon: <Apple size={16} /> },
        ]}
        selectedValue={{ label: "Option A", value: "a" }}
        onChange={(val) => console.log("Selected:", val)}
        isSearchable
        leftChild={<span className="text-xs">🔽</span>}
      />

      <BarChartComponent />
      <PieChartCard />
      <LineChartCard />
      <Progress value={33} />

      {/* Posts fetched via useCustomQuery */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold">JSONPlaceholder Posts</h2>
        <div className="mb-4">
          <Button
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending}
            className="w-full"
          >
            {createPostMutation.isPending ? "Creating..." : "Create New Post"}
          </Button>
          {createPostMutation.isError && (
            <p className="text-red-500 text-sm mt-1">
              Error: {String(createPostMutation.error)}
            </p>
          )}
          {createPostMutation.isSuccess && (
            <p className="text-green-500 text-sm mt-1">
              Post created successfully!
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 my-2">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
        {isLoading && <p>Loading posts...</p>}
        {error != null ? (
          <p className="text-red-500">
            Error loading posts: {String(error)}
          </p>
        ) : null}
        {posts && (
          <ul className="list-disc list-inside space-y-1">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
