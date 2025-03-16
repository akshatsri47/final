declare namespace JSX {
    interface IntrinsicElements {
      "dotlottie-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }

  declare global {
    interface Window {
      googleTranslateElementInit?: () => void;
      google?: {
        translate?: {
          TranslateElement?: new (
            element: HTMLElement | string,
            options: google.translate.TranslateElementOptions
          ) => google.translate.TranslateElement;
        };
      };
    }
  
    namespace google.translate {
      interface TranslateElementOptions {
        pageLanguage?: string;
        includedLanguages?: string;
        autoDisplay?: boolean;
        layout?: number;
      }
  
      interface TranslateElement {}
    }
  }
  
  
  