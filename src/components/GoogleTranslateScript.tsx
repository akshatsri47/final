'use client'

import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      (window as unknown as { googleTranslateElementInit: () => void }).googleTranslateElementInit = () => {
        new (window as unknown as { google: { translate: { TranslateElement: new (config: { pageLanguage: string; autoDisplay: boolean }, element: string) => void } } }).google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: true },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div id="google_translate_element" style={{ display: "none" }}></div>
  );
}
