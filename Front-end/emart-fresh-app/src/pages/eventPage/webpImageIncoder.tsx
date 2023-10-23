// webpImageIncoder 함수

import Resizer from "react-image-file-resizer";

export const webpImageIncoder = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file, // Is the file of the image which will resized.
      4000, // Is the maxWidth of the resized new image.
      4000, // Is the maxHeight of the resized new image.
      "webp", // Is the compressFormat of the resized new image.
      100, // Is the quality of the resized new image.
      0, // Is the degree of clockwise rotation to apply to uploaded image.
      (uri) => {
        // Is the callBack function of the resized new image URI.
        resolve(uri);
      },
      "base64"
    );
  });
