
"use client";

import { useEffect, useState } from "react";

export default function LocalTime({ date }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // This runs only in the browser, automatically detecting the user's timezone.
    // By passing 'undefined' as the locale, it uses the user's system language preference.
    const localString = new Date(date).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    setFormattedDate(localString);
  }, [date]);

  // Return an empty or fallback state during server-side rendering
  if (!formattedDate) {
    return <span className="opacity-50">Loading date...</span>;
  }

  return <span>{formattedDate}</span>;
}