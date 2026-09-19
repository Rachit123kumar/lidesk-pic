"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

export default function ImageGallery({
  uploadedImages,
  generatedImages,
}) {
  const [activeTab, setActiveTab] = useState("uploaded");

  const images =
    activeTab === "uploaded"
      ? uploadedImages
      : generatedImages;

  return (
    <div>

      {/* =========================
          TABS
      ========================== */}

      <div className="flex items-center gap-2 mb-8 border-b border-gray-800">

        <button
          type="button"
          onClick={() => setActiveTab("uploaded")}
          className={`
            relative px-5 py-3 text-sm font-semibold transition-colors
            ${
              activeTab === "uploaded"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }
          `}
        >
          Uploaded Images

          {activeTab === "uploaded" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4B3AFF]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("generated")}
          className={`
            relative px-5 py-3 text-sm font-semibold transition-colors
            ${
              activeTab === "generated"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }
          `}
        >
          Generated Images

          {activeTab === "generated" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4B3AFF]" />
          )}
        </button>

      </div>

      {/* =========================
          IMAGE COUNT
      ========================== */}

      <div className="flex items-center justify-between mb-5">

        <p className="text-sm text-gray-500">
          {images.length}{" "}
          {images.length === 1 ? "image" : "images"}
        </p>

      </div>

      {/* =========================
          EMPTY STATE
      ========================== */}

      {images.length === 0 ? (

        <div className="flex flex-col items-center justify-center w-full h-[50vh] border-2 border-dashed border-gray-800 rounded-3xl bg-black/30 backdrop-blur-sm">

          <div className="p-4 bg-gray-900 rounded-2xl mb-4 border border-gray-800 shadow-lg">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>

          <h3 className="text-xl font-semibold text-gray-200 mb-2 font-['Space_Grotesk',_sans-serif]">
            {activeTab === "uploaded"
              ? "No uploaded images"
              : "No generated images"}
          </h3>

          <p className="text-gray-500 text-sm">
            {activeTab === "uploaded"
              ? "You haven't uploaded any images yet."
              : "You haven't generated any images yet."}
          </p>

        </div>

      ) : (

        /* =========================
           IMAGE GRID
        ========================== */

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">

          {images.map((image) => (

            <div
              key={image.id}
              className="
                group
                relative
                aspect-[4/5]
                rounded-xl
                overflow-hidden
                bg-[#18181b]
                border
                border-gray-800
                hover:border-[#4B3AFF]/60
                transition-all
                duration-300
                shadow-lg
                hover:shadow-[0_0_25px_rgba(75,58,255,0.15)]
              "
            >

              <img
                src={image.url}
                alt={
                  activeTab === "uploaded"
                    ? "Uploaded image"
                    : "Generated image"
                }
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
                loading="lazy"
              />

              {/* Hover overlay */}

              <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/30
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                flex
                flex-col
                justify-end
                p-4
              ">

                <span className="
                  text-xs
                  font-medium
                  text-gray-300
                  backdrop-blur-md
                  bg-black/20
                  px-2
                  py-1
                  rounded-md
                  w-fit
                  border
                  border-white/10
                ">
                  {new Date(image.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}