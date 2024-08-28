import { faker } from "@faker-js/faker";

export interface ImageFile {
  id: string;
  url: string;
}

const FAKE_IMAGE_STORES: ImageFile[] = Array(4)
  .fill(null)
  .map(() => ({
    id: crypto.randomUUID(),
    url: faker.image.urlLoremFlickr(),
  }));

const fakeFetchImages = async () => {
  return new Promise<ImageFile[]>((resolve) => {
    setTimeout(() => {
      resolve(FAKE_IMAGE_STORES);
    }, 2000);
  });
};

const fakeDeleteImageAsyncWithRandomError = async (id: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        FAKE_IMAGE_STORES.splice(
          FAKE_IMAGE_STORES.findIndex((image) => image.id === id),
          1
        );
        resolve();
      } else {
        reject(new Error("Failed to delete image"));
      }
    }, 2000);
  });
};

const fakeUploadImageAsync = async () => {
  return new Promise<ImageFile>((resolve) => {
    setTimeout(() => {
      const image: ImageFile = {
        id: crypto.randomUUID(),
        url: faker.image.urlLoremFlickr(),
      };
      FAKE_IMAGE_STORES.push(image);
      resolve(image);
    }, 2000);
  });
};

export {
  fakeFetchImages,
  fakeDeleteImageAsyncWithRandomError,
  fakeUploadImageAsync,
};
