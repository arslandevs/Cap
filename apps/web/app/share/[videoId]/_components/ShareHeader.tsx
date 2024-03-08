import { Button, LogoBadge } from "@cap/ui";
import { videos } from "@cap/database/schema";
import moment from "moment";
import { userSelectProps } from "@cap/database/auth/session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const ShareHeader = ({
  data,
  user,
}: {
  data: typeof videos.$inferSelect;
  user: typeof userSelectProps | null;
}) => {
  const { push, refresh } = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.name);

  const handleBlur = async () => {
    setIsEditing(false);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/video/title`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, videoId: data.id }),
      }
    );
    if (!response.ok) {
      toast.error("Failed to update title - please try again.");
    }

    refresh();
  };

  const handleKeyDown = async (event: { key: string }) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between space-x-0 md:space-x-6">
        <div className="flex items-center md:justify-between space-x-6">
          <div>
            <a
              href={`${process.env.NEXT_PUBLIC_URL}?referrer=${data.id}`}
              target="_blank"
            >
              <LogoBadge className="w-8 h-auto" />
            </a>
          </div>
          <div>
            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="text-2xl font-semibold"
              />
            ) : (
              <h1
                className="text-2xl"
                onClick={() => {
                  if (
                    user !== null &&
                    user.userId.toString() === data.ownerId
                  ) {
                    setIsEditing(true);
                  }
                }}
              >
                {title}
              </h1>
            )}
            <p className="text-gray-400 text-sm">
              {moment(data.createdAt).fromNow()}
            </p>
          </div>
        </div>
        {user !== null && (
          <div className="hidden md:flex">
            <Button
              onClick={() => {
                push(`${process.env.NEXT_PUBLIC_URL}/dashboard`);
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
