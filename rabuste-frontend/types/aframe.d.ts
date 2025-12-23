import type { JSX as ReactJSX } from "react/jsx-runtime";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-entity": any;
      "a-sky": any;
      "a-image": any;
      "a-camera": any;
      "a-cursor": any;
      "a-assets": any;
      "a-asset-item": any;
    }
  }
}
