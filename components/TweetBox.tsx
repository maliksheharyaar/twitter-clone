import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import React, { Dispatch, MouseEvent, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

const TweetBox = ({ setTweets }: Props) => {
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = "";
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown user",
      profileImg:
        session?.user?.image ||
        "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast("Tweet Posted", {
      icon: "🚀",
    });

    return json;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    postTweet();

    setInput("");
    setImage("");
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img
        className="h-7 w-7 md:h-10 md:w-10 object-cover rounded-full mt-4"
        src={session?.user?.image || "https://links.papareact.com/gll"}
        alt="profile image"
      />

      <div className="flex flex-1 items-center pl-1">
        <form className="flex flex-1 flex-col" >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's Happening?"
            className=" mt-5 resize-none h-20 w-full placeholder:text-base outline-none "
          >
          </textarea>
          <div className="flex items-center">
            <div className="flex flex-1 text-twitter">
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-out p-1 hover:bg-twitter/10 hover:rounded-full"
              />
              <SearchCircleIcon className="h-7 w-7 p-1 opacity-40" />
              <EmojiHappyIcon className="h-7 w-7 p-1 opacity-40" />
              <CalendarIcon className="h-7 w-7 p-1 opacity-40" />
              <LocationMarkerIcon className="h-7 w-7 p-1 opacity-40" />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="disabled:opacity-40 bg-twitter px-4 py-2 font-bold text-xs md:text-base text-white rounded-full"
            >
              Tweet
            </button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-1">
              <input
                ref={imageInputRef}
                className="text-xs sm:text-base flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white text-xs sm:text-base border-2 rounded-xl shadow-md p-1"
              >
                Add Image
              </button>
            </form>
          )}

          {image && (
            <img
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
              src={image}
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
